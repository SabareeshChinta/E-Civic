import { Router } from 'express';
import { db } from '../db/database.js';

const router = Router();

// Registered valid test credentials map
const REGISTERED_CREDENTIALS: Record<string, { userId: string; allowedPasswords: string[] }> = {
  'aarav.sharma@citizen.gov.in': {
    userId: 'user_citizen_aarav',
    allowedPasswords: ['citizen123', 'password123']
  },
  'aarav': {
    userId: 'user_citizen_aarav',
    allowedPasswords: ['citizen123', 'password123']
  },
  'citizen': {
    userId: 'user_citizen_aarav',
    allowedPasswords: ['citizen123', 'password123']
  },
  'priya.mehta@pwd.gov.in': {
    userId: 'user_officer_priya',
    allowedPasswords: ['officer123', 'password123']
  },
  'priya': {
    userId: 'user_officer_priya',
    allowedPasswords: ['officer123', 'password123']
  },
  'officer': {
    userId: 'user_officer_priya',
    allowedPasswords: ['officer123', 'password123']
  },
  'authority': {
    userId: 'user_officer_priya',
    allowedPasswords: ['officer123', 'password123']
  },
  'admin@municipality.gov.in': {
    userId: 'user_admin_rajesh',
    allowedPasswords: ['admin123', 'password123']
  },
  'admin': {
    userId: 'user_admin_rajesh',
    allowedPasswords: ['admin123', 'password123']
  }
};

// Strict Login Endpoint
router.post('/login', (req, res) => {
  const { email, username, password } = req.body;
  const query = (email || username || '').trim().toLowerCase();
  const pwd = (password || '').trim();

  if (!query) {
    return res.status(400).json({ error: 'Email / Username is required.' });
  }
  if (!pwd) {
    return res.status(400).json({ error: 'Password is required.' });
  }

  const credentialRecord = REGISTERED_CREDENTIALS[query];

  if (!credentialRecord) {
    return res.status(401).json({
      error: 'Account not found. Please select or enter one of the registered test accounts.'
    });
  }

  if (!credentialRecord.allowedPasswords.includes(pwd)) {
    return res.status(401).json({
      error: 'Invalid password. Please check your credentials and try again.'
    });
  }

  const user = db.getUserById(credentialRecord.userId);
  if (!user) {
    return res.status(404).json({ error: 'User profile not found in database.' });
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
