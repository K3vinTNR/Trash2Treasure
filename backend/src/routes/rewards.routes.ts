import { Router, Response } from 'express';
import pool from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import { RowDataPacket } from 'mysql2';

const router = Router();

// Get all rewards
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const [rewards] = await pool.query<RowDataPacket[]>(
      'SELECT id, name, description, points_required, category, image_url, stock, is_active FROM rewards WHERE is_active = TRUE ORDER BY points_required ASC'
    );

    res.json({ 
      success: true, 
      data: rewards 
    });
  } catch (error) {
    console.error('Get rewards error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch rewards' 
    });
  }
});

// Get reward detail
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const [rewards] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM rewards WHERE id = ? AND is_active = TRUE',
      [id]
    );

    if (rewards.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Reward not found' 
      });
    }

    res.json({ 
      success: true, 
      data: rewards[0] 
    });
  } catch (error) {
    console.error('Get reward detail error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch reward detail' 
    });
  }
});

// Redeem reward
router.post('/redeem', authenticateToken, async (req: AuthRequest, res: Response) => {
  const connection = await pool.getConnection();
  
  try {
    const userId = req.userId!;
    const { reward_id, delivery_address, notes } = req.body;

    await connection.beginTransaction();

    // Get user points
    const [users] = await connection.query<RowDataPacket[]>(
      'SELECT points FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      await connection.rollback();
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const userPoints = users[0].points;

    // Get reward
    const [rewards] = await connection.query<RowDataPacket[]>(
      'SELECT points_required, stock, name FROM rewards WHERE id = ? AND is_active = TRUE',
      [reward_id]
    );

    if (rewards.length === 0) {
      await connection.rollback();
      return res.status(404).json({ 
        success: false, 
        message: 'Reward not found' 
      });
    }

    const reward = rewards[0];

    // Check points
    if (userPoints < reward.points_required) {
      await connection.rollback();
      return res.status(400).json({ 
        success: false, 
        message: 'Insufficient points' 
      });
    }

    // Check stock
    if (reward.stock <= 0) {
      await connection.rollback();
      return res.status(400).json({ 
        success: false, 
        message: 'Reward out of stock' 
      });
    }

    // Create transaction
    const [transactionResult] = await connection.query(
      'INSERT INTO transactions (user_id, reward_id, points_used, status, delivery_address, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, reward_id, reward.points_required, 'pending', delivery_address, notes]
    );

    const transactionId = (transactionResult as any).insertId;

    // Update user points
    await connection.query(
      'UPDATE users SET points = points - ? WHERE id = ?',
      [reward.points_required, userId]
    );

    // Update reward stock
    await connection.query(
      'UPDATE rewards SET stock = stock - 1 WHERE id = ?',
      [reward_id]
    );

    // Add points history
    await connection.query(
      'INSERT INTO points_history (user_id, points, type, description, transaction_id) VALUES (?, ?, ?, ?, ?)',
      [userId, -reward.points_required, 'spend', `Penukaran ${reward.name}`, transactionId]
    );

    await connection.commit();

    res.json({ 
      success: true, 
      message: 'Reward redeemed successfully',
      data: {
        transaction_id: transactionId,
        points_used: reward.points_required
      }
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
