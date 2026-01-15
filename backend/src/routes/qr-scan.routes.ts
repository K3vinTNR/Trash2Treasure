import { Router, Response } from 'express';
import pool from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const router = Router();

// Scan QR Code
router.post('/scan', authenticateToken, async (req: AuthRequest, res: Response) => {
  const connection = await pool.getConnection();
  
  try {
    const userId = req.userId!;
    const { qr_code, location } = req.body;

    if (!qr_code) {
      return res.status(400).json({ 
        success: false, 
        message: 'QR code is required' 
      });
    }

    await connection.beginTransaction();

    // 1. Verify QR code exists and is active
    const [qrCodes] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM qr_codes WHERE code = ? AND is_active = TRUE',
      [qr_code]
    );

    if (qrCodes.length === 0) {
      await connection.rollback();
      return res.status(404).json({ 
        success: false, 
        message: 'Invalid or inactive QR code' 
      });
    }

    const qrData = qrCodes[0];
    const pointsEarned = qrData.points_value;

    // 2. Check if user already has this reward
    const [existingRewards] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM user_rewards WHERE user_id = ? AND qr_code_id = ? AND is_redeemed = FALSE',
      [userId, qrData.id]
    );

    let userRewardId: number;

    if (existingRewards.length > 0) {
      // Update existing reward
      const existingReward = existingRewards[0];
      const newCurrentPoints = existingReward.current_points + pointsEarned;
      const newScannedCount = existingReward.scanned_count + 1;

      await connection.query(
        `UPDATE user_rewards 
         SET current_points = ?, 
             scanned_count = ?,
             last_scanned_at = NOW(),
             updated_at = NOW()
         WHERE id = ?`,
        [newCurrentPoints, newScannedCount, existingReward.id]
      );

      userRewardId = existingReward.id;
    } else {
      // Create new reward
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 days expiry

      const targetPoints = pointsEarned * 10; // Need to scan 10 times to complete

      const [result] = await connection.query<ResultSetHeader>(
        `INSERT INTO user_rewards 
         (user_id, qr_code_id, brand_name, reward_label, current_points, target_points, expires_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          qrData.id,
          qrData.brand_name,
          `Free ${qrData.reward_type}`,
          pointsEarned,
          targetPoints,
          expiresAt
        ]
      );

      userRewardId = result.insertId;
    }

    // 3. Add scan history
    await connection.query(
      `INSERT INTO scan_history 
       (user_id, qr_code_id, user_reward_id, points_earned, scan_location)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, qrData.id, userRewardId, pointsEarned, location || null]
    );

    // 4. Update user total points
    await connection.query(
      'UPDATE users SET points = points + ? WHERE id = ?',
      [pointsEarned, userId]
    );

    // 5. Add to points history
    const [userPoints] = await connection.query<RowDataPacket[]>(
      'SELECT points FROM users WHERE id = ?',
      [userId]
    );
    
    await connection.query(
      `INSERT INTO points_history 
       (user_id, points, type, description, balance_after)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, pointsEarned, 'earn', `Scanned ${qrData.brand_name} - ${qrData.reward_type}`, userPoints[0].points]
    );

    await connection.commit();

    // Get updated user reward
    const [updatedReward] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM user_rewards WHERE id = ?',
      [userRewardId]
    );

    res.json({ 
      success: true,
      message: `+${pointsEarned} points earned!`,
      data: {
        points_earned: pointsEarned,
        reward: updatedReward[0]
      }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Scan QR error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process QR scan' 
    });
  } finally {
    connection.release();
  }
});

// Get user's rewards (Your Rewards)
router.get('/my-rewards', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const [rewards] = await pool.query<RowDataPacket[]>(
      `SELECT 
        ur.*,
        qc.reward_type,
        DATEDIFF(ur.expires_at, NOW()) as days_left
       FROM user_rewards ur
       JOIN qr_codes qc ON ur.qr_code_id = qc.id
       WHERE ur.user_id = ? AND ur.is_redeemed = FALSE
       ORDER BY ur.current_points / ur.target_points DESC, ur.created_at DESC`,
      [userId]
    );

    res.json({ 
      success: true, 
      data: rewards 
    });
  } catch (error) {
    console.error('Get user rewards error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch rewards' 
    });
  }
});

// Get scan history
router.get('/scan-history', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { limit = 50 } = req.query;

    const [history] = await pool.query<RowDataPacket[]>(
      `SELECT 
        sh.*,
        qc.brand_name,
        qc.reward_type,
        qc.description
       FROM scan_history sh
       JOIN qr_codes qc ON sh.qr_code_id = qc.id
       WHERE sh.user_id = ?
       ORDER BY sh.created_at DESC
       LIMIT ?`,
      [userId, parseInt(limit as string)]
    );

    res.json({ 
      success: true, 
      data: history 
    });
  } catch (error) {
    console.error('Get scan history error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch scan history' 
    });
  }
});

// Redeem user reward
router.post('/redeem/:rewardId', authenticateToken, async (req: AuthRequest, res: Response) => {
  const connection = await pool.getConnection();
  
  try {
    const userId = req.userId!;
    const { rewardId } = req.params;

    await connection.beginTransaction();

    // Get user reward
    const [rewards] = await connection.query<RowDataPacket[]>(
      `SELECT * FROM user_rewards 
       WHERE id = ? AND user_id = ? AND is_redeemed = FALSE`,
      [rewardId, userId]
    );

    if (rewards.length === 0) {
      await connection.rollback();
      return res.status(404).json({ 
        success: false, 
        message: 'Reward not found or already redeemed' 
      });
    }

    const reward = rewards[0];

    // Check if points are enough
    if (reward.current_points < reward.target_points) {
      await connection.rollback();
      return res.status(400).json({ 
        success: false, 
        message: 'Insufficient points to redeem this reward',
        points_needed: reward.target_points - reward.current_points
      });
    }

    // Mark as redeemed
    await connection.query(
      `UPDATE user_rewards 
       SET is_redeemed = TRUE, redeemed_at = NOW()
       WHERE id = ?`,
      [rewardId]
    );

    // Create transaction record
    await connection.query(
      `INSERT INTO transactions 
       (user_id, user_reward_id, points_used, status)
       VALUES (?, ?, ?, 'completed')`,
      [userId, rewardId, reward.target_points]
    );

    await connection.commit();

    res.json({ 
      success: true,
      message: 'Reward redeemed successfully!',
      data: reward
    });
  } catch (error) {
    await connection.rollback();
    console.error('Redeem reward error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to redeem reward' 
    });
  } finally {
    connection.release();
  }
});

export default router;
