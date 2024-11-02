const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.json());

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/OSF')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Connection error:', err));

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: false },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

app.post('/api/signup', async (req, res) => {
  const { username, email, mobile, password } = req.body;

  // Input validation for additional safety
  if (!username || !mobile || !password) {
    console.error('Validation error: Missing required fields');
    return res.status(400).json({ message: 'Username, mobile, and password are required' });
  }

  try {
    console.log('Received data:', req.body); // Log incoming request data for debugging

    // Check if a user with the same email already exists
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.error('User already exists with this email:', email);
        return res.status(400).json({ message: 'User already exists' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, mobile, password: hashedPassword });
    await newUser.save();

    console.log('User registered successfully:', newUser);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Signup error:', error.message || error);
    res.status(500).json({ message: 'Internal server error', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
