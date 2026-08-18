import { Router } from 'express';
import { db } from '../db/database.js';

const router = Router();

// GET notifications for user
router.get('/', (req, res) => {
  const { userId } = req.query;
  const list = db.getNotifications(userId as string);
  return res.json(list);
});

// PATCH mark notification as read
router.patch('/:id/read', (req, res) => {
  const success = db.markNotificationAsRead(req.params.id);
  return res.json({ success });
});

// POST mark all read
router.post('/mark-all-read', (req, res) => {
  const { userId } = req.body;
  if (userId) {
    db.markAllNotificationsAsRead(userId);
  }
  return res.json({ success: true });
});

export default router;
