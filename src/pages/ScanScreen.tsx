import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import GradientBackground from '@/components/GradientBackground';
import PrimaryButton from '@/components/PrimaryButton';
import { ArrowLeft, QrCode, Camera, X, CheckCircle, SwitchCamera } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { qrAPI } from '@/services/api';
import { Html5Qrcode, Html5QrcodeCameraScanConfig } from 'html5-qrcode';

const ScanScreen: React.FC = () => {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    points?: number;
  } | null>(null);
  const [cameras, setCameras] = useState<any[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const scannerDivId = 'qr-reader';

  // Get available cameras on mount and auto-start
  useEffect(() => {
    console.log('🎥 Detecting cameras...');
    
    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        console.log(`✅ Found ${devices.length} camera(s):`, devices.map(d => d.label));
        setCameras(devices);
        
        // Prefer back camera for mobile, otherwise use first camera
        const backCamera = devices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear') ||
          device.label.toLowerCase().includes('environment')
        );
        
        const selected = backCamera || devices[0];
        console.log('📸 Selected camera:', selected.label);
        setSelectedCamera(selected.id);
        
        // Auto-start camera after 500ms delay
        setTimeout(() => {
          handleStartScan();
        }, 500);
      } else {
        console.warn('⚠️ No cameras detected');
      }
    }).catch(err => {
      console.error('❌ Error getting cameras:', err);
    });

    return () => {
      stopScanner();
    };
  }, []);

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
        html5QrCodeRef.current = null;
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
  };

  const handleStartScan = async () => {
    setScanning(true);
    setResult(null);

    // Wait for DOM to be ready
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      html5QrCodeRef.current = new Html5Qrcode(scannerDivId);
      
      const config: Html5QrcodeCameraScanConfig = {
        fps: 10,
        qrbox: { width: 250, height: 250 }
      };

      // Try with specific camera ID first
      try {
        if (selectedCamera) {
          await html5QrCodeRef.current.start(
            selectedCamera,
            config,
            (decodedText) => {
              handleScanComplete(decodedText);
              stopScanner();
            },
            (errorMessage) => {
              // Scan error (normal during scanning)
            }
          );
        } else {
          throw new Error('No camera selected');
        }
      } catch (cameraError) {
        console.warn('Failed with camera ID, trying environment facing mode:', cameraError);
        
        // Fallback: Try with facing mode (works better on some devices)
        await html5QrCodeRef.current.start(
          { facingMode: "environment" }, // Prefer back camera
          config,
          (decodedText) => {
            handleScanComplete(decodedText);
            stopScanner();
          },
          (errorMessage) => {
            // Scan error (normal during scanning)
          }
        );
      }
      
      console.log('✅ Camera started successfully');
    } catch (err: any) {
      console.error('❌ Error starting scanner:', err);
      console.error('Error details:', {
        name: err.name,
        message: err.message,
        type: err.type
      });
      
      await stopScanner();
      setScanning(false);
      
      // More specific error messages
      let errorMsg = 'Failed to start camera. ';
      if (err.message?.includes('Permission')) {
        errorMsg += 'Camera permission denied. Please allow camera access in browser settings.';
      } else if (err.message?.includes('NotFound')) {
        errorMsg += 'No camera found on this device.';
      } else if (err.message?.includes('NotReadable')) {
        errorMsg += 'Camera is already in use by another application.';
      } else {
        errorMsg += `Error: ${err.message || 'Unknown error'}. Try manual input instead.`;
      }
      
      alert(errorMsg);
    }
  };

  const handleStopScan = async () => {
    await stopScanner();
    setScanning(false);
  };

  const handleSwitchCamera = async () => {
    if (cameras.length <= 1) return;
    
    console.log('Switching camera...');
    await stopScanner();
    
    const currentIndex = cameras.findIndex(cam => cam.id === selectedCamera);
    const nextIndex = (currentIndex + 1) % cameras.length;
    const newCamera = cameras[nextIndex];
    
    console.log('Switching to:', newCamera.label);
    setSelectedCamera(newCamera.id);
    
    // Restart scanner with new camera
    setTimeout(() => {
      handleStartScan();
    }, 300);
  };

  const handleUseManual = async () => {
    console.log('Switching to manual input mode');
    await handleStopScan();
    setShowManualEntry(true);
  };

  const handleBackFromManual = () => {
    setShowManualEntry(false);
    setManualInput('');
    // Restart camera
    setTimeout(() => {
      handleStartScan();
    }, 300);
  };

  const handleScanComplete = async (qrCode: string) => {
    try {
      setLoading(true);
      setScanning(false);
      await stopScanner();
      
      const response = await qrAPI.scan(qrCode, 'Scanned via camera');
      
      if (response.success) {
        setResult({
          success: true,
          message: response.message,
          points: response.data.points_earned
        });
      } else {
        setResult({
          success: false,
          message: response.message || 'Failed to scan QR code'
        });
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: error.response?.data?.message || 'Failed to scan QR code'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async () => {
    if (!manualInput.trim()) {
      alert('Please enter QR code');
      return;
    }
    await handleScanComplete(manualInput);
  };

  const handleClose = () => {
    if (result?.success) {
      navigate('/rewards');
    } else {
      setResult(null);
      setManualInput('');
    }
  };

  const handleReset = () => {
    setResult(null);
    setManualInput('');
    setShowManualEntry(false);
    // Auto-restart camera
    setTimeout(() => {
      handleStartScan();
    }, 300);
  };

  return (
    <>
      <GradientBackground>
        <div className="flex flex-col h-[100dvh] overflow-hidden">
          {/* Header - Only show when not scanning */}
          {!scanning && (
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 animate-fade-in flex-shrink-0 z-10">
              <button
                onClick={() => navigate('/rewards')}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <ArrowLeft size={18} className="text-white" />
              </button>
              <h1 className="text-sm sm:text-base font-semibold text-white">Scan QR Code</h1>
              <div className="w-9 sm:w-10" />
            </div>
          )}

        {/* Manual Entry Page */}
        {showManualEntry && !result && !loading && (
          <div className="flex-1 flex flex-col px-4 sm:px-6 pb-[72px] animate-fade-in overflow-auto">
            <div className="flex-1 flex items-center justify-center py-6 min-h-0">
              <div className="w-full max-w-md">
                <div className="text-center mb-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-3">
                    <QrCode size={28} className="text-white sm:w-8 sm:h-8" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Enter Code Manually</h2>
                  <p className="text-white/70 text-xs sm:text-sm">Type your QR code below</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <input
                      type="text"
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value.toUpperCase())}
                      placeholder="QR-XXXX-XXX"
                      className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:outline-none focus:border-white/40 transition-colors text-center text-white text-sm sm:text-base font-mono placeholder:text-white/40"
                      autoFocus
                    />
                    <p className="text-white/50 text-xs mt-2 text-center">Example: QR-KOPI-001</p>
                  </div>

                  <PrimaryButton
                    onClick={handleManualSubmit}
                    fullWidth
                    className="h-11 sm:h-12 text-sm sm:text-base"
                  >
                    Submit Code
                  </PrimaryButton>

                  <button
                    onClick={handleBackFromManual}
                    className="w-full h-11 sm:h-12 rounded-xl bg-white/10 backdrop-blur-sm text-white text-xs sm:text-sm font-medium hover:bg-white/20 transition-colors"
                  >
                    <Camera size={16} className="inline mr-2 sm:w-5 sm:h-5" />
                    Back to Camera
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

          {/* Camera Scanning View - Full Screen */}
          {scanning && !showManualEntry && !result && !loading && (
            <div className="fixed inset-0 w-screen h-screen max-h-[100dvh] flex flex-col animate-fade-in overflow-hidden z-50 bg-black">
              {/* Full Camera View */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <div 
                  id={scannerDivId} 
                  className="absolute inset-0 w-full h-full"
                />
                
                {/* Scan Frame Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56">
                    {/* Corner borders */}
                    <div className="absolute top-0 left-0 w-8 h-8 sm:w-10 sm:h-10 border-t-4 border-l-4 border-white rounded-tl-2xl" />
                    <div className="absolute top-0 right-0 w-8 h-8 sm:w-10 sm:h-10 border-t-4 border-r-4 border-white rounded-tr-2xl" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 sm:w-10 sm:h-10 border-b-4 border-l-4 border-white rounded-bl-2xl" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 border-b-4 border-r-4 border-white rounded-br-2xl" />
                  </div>
                </div>

                {/* Top back button & instruction */}
                <div className="absolute top-0 left-0 right-0 z-20 safe-top">
                  <div className="flex items-center justify-between px-4 py-3 sm:py-4">
                    <button
                      onClick={() => navigate('/rewards')}
                      className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors"
                    >
                      <ArrowLeft size={20} className="text-white" />
                    </button>
                    
                    {cameras.length > 1 && (
                      <button
                        onClick={handleSwitchCamera}
                        className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors"
                      >
                        <SwitchCamera size={20} className="text-white" />
                      </button>
                    )}
                  </div>
                  
                  <div className="text-center px-4">
                    <div className="bg-black/60 backdrop-blur-sm inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                      <p className="text-white text-xs sm:text-sm font-medium">Align the code within the frame</p>
                    </div>
                  </div>
                </div>

                {/* Bottom Action - Absolute positioned */}
                <div className="absolute bottom-16 sm:bottom-20 left-0 right-0 bg-gradient-to-t from-black via-black/60 to-transparent px-4 pt-6 sm:pt-8 pb-3 sm:pb-4 z-20 safe-bottom">
                  <button
                    onClick={handleUseManual}
                    className="w-full h-11 sm:h-12 rounded-xl bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-medium hover:bg-white/30 transition-colors shadow-lg"
                  >
                    Enter code manually
                  </button>
                </div>
              </div>
            </div>
          )}

        {/* Initial Loading (Camera Detection) */}
        {!scanning && !showManualEntry && !result && !loading && cameras.length === 0 && (
          <div className="flex-1 flex items-center justify-center px-4 sm:px-5 animate-pulse min-h-0">
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-3">
                <Camera size={28} className="text-white/60 sm:w-8 sm:h-8" />
              </div>
              <p className="text-white text-sm sm:text-base">Detecting camera...</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex-1 flex items-center justify-center px-4 sm:px-5 min-h-0">
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-3 relative">
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-3 border-white/20 border-t-white" />
              </div>
              <p className="text-white text-sm sm:text-base font-medium">Processing...</p>
              <p className="text-white/60 text-xs mt-1">Please wait</p>
            </div>
          </div>
        )}

        {/* Result Display */}
        {result && (
          <div className="flex-1 flex items-center justify-center px-4 sm:px-5 pb-[72px] overflow-auto min-h-0">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-5 sm:p-6 text-center animate-scale-in border border-white/20 my-auto">
              {result.success ? (
                <>
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle size={32} className="text-white sm:w-9 sm:h-9" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white mb-1.5">Success!</h2>
                  <p className="text-white/80 text-xs sm:text-sm mb-4">{result.message}</p>
                  {result.points && (
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-3 sm:p-4 mb-4">
                      <p className="text-white/90 text-xs mb-0.5">Points Earned</p>
                      <p className="text-white text-2xl sm:text-3xl font-bold">+{result.points}</p>
                    </div>
                  )}
                  <PrimaryButton onClick={handleReset} fullWidth className="h-10 sm:h-11 text-sm sm:text-base">
                    Scan Another Code
                  </PrimaryButton>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-500 flex items-center justify-center mx-auto mb-3">
                    <X size={32} className="text-white sm:w-9 sm:h-9" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white mb-1.5">Failed</h2>
                  <p className="text-white/80 text-xs sm:text-sm mb-5">{result.message}</p>
                  <PrimaryButton onClick={handleReset} fullWidth className="h-10 sm:h-11 text-sm sm:text-base">
                    Try Again
                  </PrimaryButton>
                </>
              )}
            </div>
          </div>
          )}
        </div>
      </GradientBackground>
      
      {/* BottomNav - Always show */}
      <BottomNav />
      
      {/* Add global style for video element */}
      <style>{`
        #${scannerDivId} video {
          width: 100vw !important;
          height: 100vh !important;
          max-height: 100dvh !important;
          object-fit: cover !important;
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
        }
        #${scannerDivId} {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          max-height: 100dvh !important;
        }
        body {
          overflow: hidden !important;
          position: fixed !important;
          width: 100% !important;
          height: 100dvh !important;
        }
      `}</style>
    </>
  );
};

export default ScanScreen;
