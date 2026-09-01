const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, verifyToken } = require('../middleware/auth');

module.exports = function(db) {
  const router = express.Router();

  // Ensure db.users array exists
  if (!Array.isArray(db.users)) {
    db.users = [];
  }

  // Pre-seed default demo accounts if empty
  const defaultAccounts = [
    {
      id: 'USR-AUTH-001',
      name: 'Col. Rajesh Sangma',
      email: 'officer@sdma.gov.in',
      passwordHash: bcrypt.hashSync('Officer@123', 10),
      role: 'authority',
      designation: 'SDMA Field Commander',
      district: 'East Khasi Hills',
      state: 'Meghalaya',
      phone: '+91 98620 12345',
      createdAt: new Date().toISOString()
    },
    {
      id: 'USR-AUTH-002',
      name: 'Dr. S. K. Marak, IAS',
      email: 'dm@shillong.gov.in',
      passwordHash: bcrypt.hashSync('Admin@123', 10),
      role: 'authority',
      designation: 'District Magistrate & DDMA Chair',
      district: 'East Khasi Hills',
      state: 'Meghalaya',
      phone: '+91 94361 98765',
      createdAt: new Date().toISOString()
    },
    {
      id: 'USR-CIT-001',
      name: 'Tenzin Norbu',
      email: 'citizen@ner.in',
      passwordHash: bcrypt.hashSync('Citizen@123', 10),
      role: 'citizen',
      designation: 'Local Resident & Volunteer',
      district: 'East Khasi Hills',
      state: 'Meghalaya',
      phone: '+91 87941 55678',
      createdAt: new Date().toISOString()
    }
  ];

  defaultAccounts.forEach(acc => {
    const exists = db.users.find(u => u.email.toLowerCase() === acc.email.toLowerCase());
    if (!exists) {
      db.users.push(acc);
    }
  });

  function generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        designation: user.designation,
        district: user.district,
        state: user.state
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  function getSafeUser(user) {
    const { passwordHash, ...safe } = user;
    return safe;
  }

  /**
   * POST /api/auth/register
   * Register a new user (Citizen or Authority)
   */
  router.post('/register', async (req, res) => {
    try {
      const { name, email, password, role = 'citizen', designation, district, state, phone } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide name, email, and password.'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long.'
        });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const existingUser = db.users.find(u => u.email.toLowerCase() === normalizedEmail);

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email address already exists. Please sign in.'
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = {
        id: `USR-${Date.now().toString().slice(-6)}`,
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        role: role === 'authority' ? 'authority' : 'citizen',
        designation: designation || (role === 'authority' ? 'Disaster Response Officer' : 'Citizen Reporter'),
        district: district || 'East Khasi Hills',
        state: state || 'Meghalaya',
        phone: phone || '',
        createdAt: new Date().toISOString()
      };

      db.users.push(newUser);
      const token = generateToken(newUser);

      res.status(201).json({
        success: true,
        message: 'Account created successfully.',
        data: {
          token,
          user: getSafeUser(newUser)
        }
      });
    } catch (err) {
      console.error('[NER-LEWS Auth Error]:', err);
      res.status(500).json({
        success: false,
        message: 'Server error creating account.'
      });
    }
  });

  /**
   * POST /api/auth/login
   * Authenticate user & return JWT token
   */
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide both email and password.'
        });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const user = db.users.find(u => u.email.toLowerCase() === normalizedEmail);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      const token = generateToken(user);

      res.json({
        success: true,
        message: 'Authentication successful.',
        data: {
          token,
          user: getSafeUser(user)
        }
      });
    } catch (err) {
      console.error('[NER-LEWS Auth Error]:', err);
      res.status(500).json({
        success: false,
        message: 'Server error during login.'
      });
    }
  });

  /**
   * GET /api/auth/me
   * Return current authenticated user session
   */
  router.get('/me', verifyToken, (req, res) => {
    const user = db.users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.'
      });
    }

    res.json({
      success: true,
      data: {
        user: getSafeUser(user)
      }
    });
  });

  /**
   * GET /api/auth/demo-users
   * Return pre-seeded demo login profiles for 1-click testing
   */
  router.get('/demo-users', (req, res) => {
    res.json({
      success: true,
      data: [
        {
          role: 'authority',
          label: 'SDMA Field Commander',
          email: 'officer@sdma.gov.in',
          password: 'Officer@123',
          name: 'Col. Rajesh Sangma',
          badge: 'Authority Access'
        },
        {
          role: 'authority',
          label: 'District Magistrate',
          email: 'dm@shillong.gov.in',
          password: 'Admin@123',
          name: 'Dr. S. K. Marak, IAS',
          badge: 'DDMA Chair'
        },
        {
          role: 'citizen',
          label: 'Citizen / Volunteer',
          email: 'citizen@ner.in',
          password: 'Citizen@123',
          name: 'Tenzin Norbu',
          badge: 'Citizen Access'
        }
      ]
    });
  });

  return router;
};
