import { Router } from 'express';
import { db } from '../db/database.js';

const router = Router();

// Demo Quick Login
router.post('/demo-login', (req, res) => {
  const { role, userId } = req.body;
  const users = db.getUsers();

  let selectedUser;
  if (userId) {
    selectedUser = db.getUserById(userId);
  } else if (role) {
    selectedUser = users.find(u => u.role === role);
  } else {
    selectedUser = users[0];
  }

  if (!selectedUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.json({
    user: selectedUser,
    token: `demo-token-${selectedUser.id}-${Date.now()}`
  });
});

// Get current user profile
router.get('/profile/:id', (req, res) => {
  const user = db.getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  return res.json(user);
});

// Get all demo accounts
router.get('/demo-accounts', (_req, res) => {
  const users = db.getUsers();
  return res.json(users);
});

// Update profile
router.patch('/profile/:id', (req, res) => {
  const updated = db.updateUser(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'User not found' });
  }
  return res.json(updated);
});

export default router;
