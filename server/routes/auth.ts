import { Router } from 'express';
import { db } from '../db/database.js';

const router = Router();

// Standard Login for Citizen and Authority
router.post('/login', (req, res) => {
  const { email, username, password, role } = req.body;
  const users = db.getUsers();

  const query = (email || username || '').trim().toLowerCase();

  // Find user by email, id, or role match
  let user = users.find(
    u =>
      u.email.toLowerCase() === query ||
      u.id.toLowerCase() === query ||
      u.name.toLowerCase() === query
  );

  // If user entered short alias like 'citizen', 'officer', 'admin'
  if (!user && (query === 'citizen' || query === 'aarav')) {
    user = users.find(u => u.role === 'citizen');
  } else if (!user && (query === 'officer' || query === 'authority' || query === 'priya')) {
    user = users.find(u => u.role === 'officer');
  } else if (!user && (query === 'admin' || query === 'rajesh')) {
    user = users.find(u => u.role === 'admin');
  } else if (!user && role) {
    user = users.find(u => u.role === role);
  }

  if (!user) {
    return res.status(401).json({
      error: 'Invalid credentials. Please use one of the test accounts listed on the login page.'
    });
  }

  // Verify password (allows standard test passwords)
  const validPasswords = ['password123', 'citizen123', 'officer123', 'admin123', 'ecivic2026', 'test'];
  if (password && !validPasswords.includes(password.trim())) {
    // If not in standard list, still accept any non-empty password for demo ease or reject with clear message
    if (password.length < 3) {
      return res.status(401).json({ error: 'Password must be at least 3 characters long.' });
    }
  }

  return res.json({
    success: true,
    user,
    token: `jwt-ecivic-token-${user.id}-${Date.now()}`
  });
});

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
