import { Router, Response } from 'express';
import pool from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import { RowDataPacket } from 'mysql2';

const router = Router();

// Get all reminders for user
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const [reminders] = await pool.query<RowDataPacket[]>(
      'SELECT id, title, description, reminder_time, reminder_days, is_active, created_at FROM reminders WHERE user_id = ? ORDER BY reminder_time ASC',
      [userId]
    );

    res.json({ 
      success: true, 
      data: reminders 
    });
  } catch (error) {
    console.error('Get reminders error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch reminders' 
    });
  }
});

// Create reminder
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { title, description, reminder_time, reminder_days } = req.body;

    if (!title || !reminder_time || !reminder_days) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title, reminder time, and days are required' 
      });
    }

    const [result] = await pool.query(
      'INSERT INTO reminders (user_id, title, description, reminder_time, reminder_days) VALUES (?, ?, ?, ?, ?)',
      [userId, title, description || '', reminder_time, JSON.stringify(reminder_days)]
    );

    res.status(201).json({ 
      success: true, 
      message: 'Reminder created successfully',
      data: {
        id: (result as any).insertId
      }
    });
  } catch (error) {
    console.error('Create reminder error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create reminder' 
    });
  }
});

// Update reminder
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { title, description, reminder_time, reminder_days, is_active } = req.body;

    // Check ownership
    const [reminders] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM reminders WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (reminders.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Reminder not found' 
      });
    }

    await pool.query(
      'UPDATE reminders SET title = ?, description = ?, reminder_time = ?, reminder_days = ?, is_active = ? WHERE id = ? AND user_id = ?',
      [title, description, reminder_time, JSON.stringify(reminder_days), is_active, id, userId]
    );

    res.json({ 
      success: true, 
      message: 'Reminder updated successfully' 
    });
  } catch (error) {
    console.error('Update reminder error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update reminder' 
    });
  }
});

// Delete reminder
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    // Check ownership
    const [reminders] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM reminders WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (reminders.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Reminder not found' 
      });
    }

    await pool.query(
      'DELETE FROM reminders WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    res.json({ 
      success: true, 
      message: 'Reminder deleted successfully' 
    });
  } catch (error) {
    console.error('Delete reminder error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete reminder' 
    });
  }
});

// Toggle reminder active status
router.patch('/:id/toggle', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    // Check ownership
    const [reminders] = await pool.query<RowDataPacket[]>(
      'SELECT is_active FROM reminders WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (reminders.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Reminder not found' 
      });
    }

    const newStatus = !reminders[0].is_active;

    await pool.query(
      'UPDATE reminders SET is_active = ? WHERE id = ? AND user_id = ?',
      [newStatus, id, userId]
    );

    res.json({ 
      success: true, 
      message: 'Reminder status updated successfully',
      data: { is_active: newStatus }
    });
  } catch (error) {
    console.error('Toggle reminder error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to toggle reminder' 
    });
  }
});

export default router;
