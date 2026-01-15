// Mock Data - Hardcoded untuk Demo
const MOCK_USER = {
  id: 1,
  email: 'demo@trash2treasure.com',
  full_name: 'Demo User',
  phone: '081234567890',
  address: 'Jl. Contoh No. 123, Jakarta',
  total_points: 1250,
  created_at: '2024-01-15T10:00:00Z',
};

const MOCK_REWARDS = [
  {
    id: 1,
    name: 'Voucher Belanja 50K',
    description: 'Voucher belanja senilai Rp 50.000',
    points_required: 500,
    stock: 50,
    image_url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400',
  },
  {
    id: 2,
    name: 'Voucher Belanja 100K',
    description: 'Voucher belanja senilai Rp 100.000',
    points_required: 1000,
    stock: 30,
    image_url: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400',
  },
  {
    id: 3,
    name: 'Tumbler Eco-Friendly',
    description: 'Tumbler ramah lingkungan 500ml',
    points_required: 750,
    stock: 20,
    image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
  },
  {
    id: 4,
    name: 'Tote Bag Canvas',
    description: 'Tas belanja kanvas ramah lingkungan',
    points_required: 300,
    stock: 100,
    image_url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400',
  },
  {
    id: 5,
    name: 'Voucher Belanja 200K',
    description: 'Voucher belanja senilai Rp 200.000',
    points_required: 2000,
    stock: 10,
    image_url: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=400',
  },
];

const MOCK_POINTS_HISTORY = [
  {
    id: 1,
    points: 100,
    description: 'Scan sampah plastik',
    waste_kg: 2.5,
    created_at: '2026-01-14T10:30:00Z',
  },
  {
    id: 2,
    points: 150,
    description: 'Scan sampah kertas',
    waste_kg: 5.0,
    created_at: '2026-01-13T14:20:00Z',
  },
  {
    id: 3,
    points: 200,
    description: 'Scan sampah botol',
    waste_kg: 3.2,
    created_at: '2026-01-12T09:15:00Z',
  },
  {
    id: 4,
    points: -500,
    description: 'Redeem: Voucher Belanja 50K',
    created_at: '2026-01-11T16:45:00Z',
  },
  {
    id: 5,
    points: 300,
    description: 'Scan sampah kaleng',
    waste_kg: 4.1,
    created_at: '2026-01-10T11:00:00Z',
  },
];

const MOCK_REMINDERS = [
  {
    id: 1,
    title: 'Buang Sampah Organik',
    description: 'Jangan lupa buang sampah organik',
    reminder_time: '07:00',
    reminder_days: ['Monday', 'Wednesday', 'Friday'],
    is_active: true,
  },
  {
    id: 2,
    title: 'Buang Sampah Anorganik',
    description: 'Jangan lupa buang sampah anorganik',
    reminder_time: '07:00',
    reminder_days: ['Tuesday', 'Thursday', 'Saturday'],
    is_active: true,
  },
];

// Simulated delay untuk membuat terlihat seperti real API call
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Helper to check if authenticated
const requireAuth = () => {
  if (!getAuthToken()) {
    throw new Error('Authentication required');
  }
};


// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    await delay();
    
    // Simple validation - untuk demo, terima semua login
    if (!email || !password) {
      throw new Error('Email dan password harus diisi');
    }

    // Mock token
    const token = 'mock-jwt-token-' + Date.now();
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(MOCK_USER));

    return {
      success: true,
      message: 'Login berhasil',
      data: {
        token,
        user: MOCK_USER,
      },
    };
  },

  register: async (userData: {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
  }) => {
    await delay();
    
    // Validation
    if (!userData.email || !userData.password || !userData.full_name) {
      throw new Error('Semua field wajib diisi');
    }

    return {
      success: true,
      message: 'Registrasi berhasil. Silakan login.',
      data: null,
    };
  },

  logout: async () => {
    await delay(100);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },
};


// User API
export const userAPI = {
  getProfile: async () => {
    requireAuth();
    await delay();
    
    return {
      success: true,
      data: MOCK_USER,
    };
  },

  updateProfile: async (userData: {
    full_name: string;
    phone?: string;
    address?: string;
  }) => {
    requireAuth();
    await delay();
    
    // Update mock user data
    Object.assign(MOCK_USER, userData);
    localStorage.setItem('user', JSON.stringify(MOCK_USER));

    return {
      success: true,
      message: 'Profile berhasil diupdate',
      data: MOCK_USER,
    };
  },

  getPointsHistory: async () => {
    requireAuth();
    await delay();
    
    return {
      success: true,
      data: MOCK_POINTS_HISTORY,
    };
  },

  addPoints: async (points: number, description: string, waste_kg?: number) => {
    requireAuth();
    await delay();
    
    // Add to mock history
    const newEntry = {
      id: MOCK_POINTS_HISTORY.length + 1,
      points,
      description,
      waste_kg,
      created_at: new Date().toISOString(),
    };
    MOCK_POINTS_HISTORY.unshift(newEntry);
    
    // Update user points
    MOCK_USER.total_points += points;
    localStorage.setItem('user', JSON.stringify(MOCK_USER));

    return {
      success: true,
      message: 'Points berhasil ditambahkan',
      data: {
        new_total: MOCK_USER.total_points,
        points_added: points,
      },
    };
  },

  getTransactions: async () => {
    requireAuth();
    await delay();
    
    return {
      success: true,
      data: MOCK_POINTS_HISTORY,
    };
  },
};


// Rewards API
export const rewardsAPI = {
  getAll: async () => {
    requireAuth();
    await delay();
    
    return {
      success: true,
      data: MOCK_REWARDS,
    };
  },

  getById: async (id: number) => {
    requireAuth();
    await delay();
    
    const reward = MOCK_REWARDS.find(r => r.id === id);
    if (!reward) {
      throw new Error('Reward tidak ditemukan');
    }

    return {
      success: true,
      data: reward,
    };
  },

  redeem: async (reward_id: number, delivery_address: string, notes?: string) => {
    requireAuth();
    await delay();
    
    const reward = MOCK_REWARDS.find(r => r.id === reward_id);
    if (!reward) {
      throw new Error('Reward tidak ditemukan');
    }

    if (MOCK_USER.total_points < reward.points_required) {
      throw new Error('Points tidak cukup');
    }

    // Deduct points
    MOCK_USER.total_points -= reward.points_required;
    localStorage.setItem('user', JSON.stringify(MOCK_USER));

    // Add to history
    MOCK_POINTS_HISTORY.unshift({
      id: MOCK_POINTS_HISTORY.length + 1,
      points: -reward.points_required,
      description: `Redeem: ${reward.name}`,
      created_at: new Date().toISOString(),
    });

    return {
      success: true,
      message: 'Reward berhasil di-redeem',
      data: {
        reward_name: reward.name,
        points_used: reward.points_required,
        remaining_points: MOCK_USER.total_points,
      },
    };
  },
};


// Reminders API
export const remindersAPI = {
  getAll: async () => {
    requireAuth();
    await delay();
    
    return {
      success: true,
      data: MOCK_REMINDERS,
    };
  },

  create: async (reminderData: {
    title: string;
    description?: string;
    reminder_time: string;
    reminder_days: string[];
  }) => {
    requireAuth();
    await delay();
    
    const newReminder = {
      id: MOCK_REMINDERS.length + 1,
      ...reminderData,
      is_active: true,
    };
    MOCK_REMINDERS.push(newReminder);

    return {
      success: true,
      message: 'Reminder berhasil dibuat',
      data: newReminder,
    };
  },

  update: async (id: number, reminderData: {
    title: string;
    description?: string;
    reminder_time: string;
    reminder_days: string[];
    is_active: boolean;
  }) => {
    requireAuth();
    await delay();
    
    const reminder = MOCK_REMINDERS.find(r => r.id === id);
    if (!reminder) {
      throw new Error('Reminder tidak ditemukan');
    }

    Object.assign(reminder, reminderData);

    return {
      success: true,
      message: 'Reminder berhasil diupdate',
      data: reminder,
    };
  },

  delete: async (id: number) => {
    requireAuth();
    await delay();
    
    const index = MOCK_REMINDERS.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Reminder tidak ditemukan');
    }

    MOCK_REMINDERS.splice(index, 1);

    return {
      success: true,
      message: 'Reminder berhasil dihapus',
    };
  },

  toggle: async (id: number) => {
    requireAuth();
    await delay();
    
    const reminder = MOCK_REMINDERS.find(r => r.id === id);
    if (!reminder) {
      throw new Error('Reminder tidak ditemukan');
    }

    reminder.is_active = !reminder.is_active;

    return {
      success: true,
      message: `Reminder ${reminder.is_active ? 'diaktifkan' : 'dinonaktifkan'}`,
      data: reminder,
    };
  },
};


// QR Scan API
export const qrAPI = {
  scan: async (qrCode: string, location?: string) => {
    requireAuth();
    await delay();
    
    // Simulasi hasil scan berdasarkan QR code
    const wasteTypes = ['plastik', 'kertas', 'botol', 'kaleng', 'organik'];
    const wasteType = wasteTypes[Math.floor(Math.random() * wasteTypes.length)];
    const wasteKg = Math.floor(Math.random() * 5) + 1; // 1-5 kg
    const pointsEarned = wasteKg * 50; // 50 points per kg

    // Add points
    MOCK_USER.total_points += pointsEarned;
    localStorage.setItem('user', JSON.stringify(MOCK_USER));

    // Add to history
    MOCK_POINTS_HISTORY.unshift({
      id: MOCK_POINTS_HISTORY.length + 1,
      points: pointsEarned,
      description: `Scan sampah ${wasteType}${location ? ` di ${location}` : ''}`,
      waste_kg: wasteKg,
      created_at: new Date().toISOString(),
    });

    return {
      success: true,
      message: 'QR Code berhasil di-scan!',
      data: {
        qr_code: qrCode,
        waste_type: wasteType,
        weight_kg: wasteKg,
        points_earned: pointsEarned,
        new_total_points: MOCK_USER.total_points,
        location: location || 'Unknown',
        scanned_at: new Date().toISOString(),
      },
    };
  },

  getMyRewards: async () => {
    requireAuth();
    await delay();
    
    // Return redeemed rewards from history
    const redeemedRewards = MOCK_POINTS_HISTORY
      .filter(h => h.points < 0 && h.description.startsWith('Redeem:'))
      .map(h => ({
        id: h.id,
        reward_name: h.description.replace('Redeem: ', ''),
        points_used: Math.abs(h.points),
        redeemed_at: h.created_at,
        status: 'completed',
      }));

    return {
      success: true,
      data: redeemedRewards,
    };
  },

  getScanHistory: async (limit = 50) => {
    requireAuth();
    await delay();
    
    // Return scan history (positive points only)
    const scanHistory = MOCK_POINTS_HISTORY
      .filter(h => h.points > 0)
      .slice(0, limit);

    return {
      success: true,
      data: scanHistory,
    };
  },

  redeemUserReward: async (rewardId: number) => {
    requireAuth();
    await delay();
    
    return {
      success: true,
      message: 'Reward berhasil di-redeem',
    };
  },
};

// Helper to check if user is logged in
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// Helper to get current user
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};
