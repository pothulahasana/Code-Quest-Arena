const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

if (!MONGO_URI) {
  console.error('❌ Missing MONGO_URI. Create a .env file with MONGO_URI and JWT_SECRET');
  process.exit(1);
}

if (!JWT_SECRET) {
  console.error('❌ Missing JWT_SECRET. Set JWT_SECRET in your .env file');
  process.exit(1);
}

// ─── Middleware ───────────────────────────────────────────
app.use(cors());
app.use(bodyParser.json());

// ─── Connect to MongoDB ───────────────────────────────────
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB Connected Successfully');
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err);
  process.exit(1);
});

// ─── User Schema (What gets saved to MongoDB) ─────────────
const userSchema = new mongoose.Schema({
  username:  { type: String, required: true, unique: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  coins:     { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// ─── REGISTER ROUTE ───────────────────────────────────────
app.post('/api/users/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    console.log('✅ New user registered:', username, email);
    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ─── LOGIN ROUTE ──────────────────────────────────────────
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log('✅ User logged in:', user.email);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        coins: user.coins
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── GET ALL USERS (for testing) ─────────────────────────
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── GET USER PROFILE (protected route) ───────────────────
app.get('/api/users/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer token

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// ─── UPDATE COINS ROUTE ───────────────────────────────────
app.put('/api/users/coins', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    let userId = req.body.userId;
    const { coins } = req.body;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    }

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { coins: coins },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Coins updated', user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});