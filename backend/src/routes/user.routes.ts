import { Router, Response } from 'express';
import pool from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import { RowDataPacket } from 'mysql2';

const router = Router();

// Get user profile
router.get('/profile', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const [users] = await pool.query<RowDataPacket[]>(
      'SELECT id, email, full_name, phone, address, points, total_waste_kg, profile_image, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({ 
      success: true, 
      data: users[0] 
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch profile' 
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { full_name, phone, address } = req.body;

    await pool.query(
      'UPDATE users SET full_name = ?, phone = ?, address = ? WHERE id = ?',
      [full_name, phone, address, userId]
    );

    res.json({ 
      success: true, 
      message: 'Profile updated successfully' 
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update profile' 
    });
  }
});

// Get points history
router.get('/points-history', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const [history] = await pool.query<RowDataPacket[]>(
      'SELECT id, points, type, description, waste_kg, created_at FROM points_history WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    res.json({ 
      success: true, 
      data: history 
    });
  } catch (error) {
    console.error('Get points history error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch points history' 
    });
  }
});

// Add points (for testing or admin)
router.post('/add-points', authenticateToken, async (req: AuthRequest, res: Response) => {
  const connection = await pool.getConnection();
  
  try {
    const userId = req.userId!;
    const { points, description, waste_kg } = req.body;

    if (!points || points <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid points value' 
      });
    }

    await connection.beginTransaction();

    // Update user points
    await connection.query(
      'UPDATE users SET points = points + ?, total_waste_kg = total_waste_kg + ? WHERE id = ?',
      [points, waste_kg || 0, userId]
    );

    // Add to history
    await connection.query(
      'INSERT INTO points_history (user_id, points, type, description, waste_kg) VALUES (?, ?, ?, ?, ?)',
      [userId, points, 'earn', description || 'Poin ditambahkan', waste_kg || 0]
    );

    await connection.commit();

    res.json({ 
      success: true, 
      message: 'Points added successfully' 
    });
  } catch (error) {
    await connection.rollback();
    console.error('Add points error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to add points' 
    });
  } finally {
    connection.release();
  }
});

// Get transactions history
router.get('/transactions', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const [transactions] = await pool.query<RowDataPacket[]>(
      `SELECT t.id, t.points_used, t.status, t.delivery_address, t.created_at,
              r.name as reward_name, r.description as reward_description, r.image_url
       FROM transactions t
       JOIN rewards r ON t.reward_id = r.id
       WHERE t.user_id = ?
       ORDER BY t.created_at DESC`,
      [userId]
    );

    res.json({ 
      success: true, 
      data: transactions 
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch transactions' 
    });
  }
});

export default router;
