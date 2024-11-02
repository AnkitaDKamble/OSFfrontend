const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS with credentials
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true, // Allow credentials to be included
}));

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/OSF')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Connection error:', err));

// Setup session store
const store = new MongoDBStore({
  uri: 'mongodb://localhost:27017/OSF',
  collection: 'sessions'
});

// Check for session store errors
store.on('error', function (error) {
  console.log(error);
});

// Configure session middleware
app.use(session({
  secret: 'your_secret_key', // Replace with a secure secret
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    maxAge: 1000 * 60 * 60, // 1 hour session duration
    sameSite: 'None', // Allow cookies to be sent in cross-site contexts
    secure: false // Set to true if using HTTPS
  }
}));

// User schema with last login timestamp
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: false },
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  lastLogin: { type: Date } // Added lastLogin field
});

const User = mongoose.model('User', userSchema);

// Signup route
app.post('/api/signup', async (req, res) => {
  const { username, email, mobile, password } = req.body;

  // Input validation for additional safety
  if (!username || !mobile || !password) {
    console.error('Validation error: Missing required fields');
    return res.status(400).json({ message: 'Username, mobile, and password are required' });
  }

  try {
    console.log('Received data:', req.body); // Log incoming request data for debugging

    // Check if a user with the same mobile number or username already exists
    const existingUser = await User.findOne({ $or: [{ mobile }, { username }] });
    if (existingUser) {
      console.error('User already exists with this mobile number or username:', mobile, username);
      return res.status(400).json({ message: 'User already exists with this mobile number or username' });
    }

    // Hash the password
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

// Login route
app.post('/api/login', async (req, res) => {
  const { username, mobile, password } = req.body; // Expecting username or mobile and password in the request body

  // Input validation
  if ((!username && !mobile) || !password) {
    console.error('Validation error: Missing required fields');
    return res.status(400).json({ message: 'Either username or mobile, and password are required' });
  }

  try {
    const user = await User.findOne({ $or: [{ username }, { mobile }] }); // Find the user by username or mobile
    if (!user) {
      return res.status(401).json({ message: 'Invalid username/mobile or password' });
    }

    // Compare password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username/mobile or password' });
    }

    // Create session and update last login timestamp
    req.session.userId = user._id; // Store user ID in session
    user.lastLogin = new Date(); // Update last login time
    await user.save(); // Save the user document with updated lastLogin

    console.log('User logged in successfully:', user);
    res.status(200).json({ message: 'Login successful' }); // Send success response
  } catch (error) {
    console.error('Login error:', error.message || error);
    res.status(500).json({ message: 'Internal server error', details: error.message });
  }
});

// Logout route
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error during logout:', err); // Log the error for debugging
      return res.status(500).json({ message: 'Could not log out' });
    }
    res.clearCookie('connect.sid'); // Clear the session cookie
    console.log('User logged out successfully'); // Log a success message without referencing user
    res.status(200).json({ message: 'Logout successful' });
  });
});

// Middleware to track user activity
app.use((req, res, next) => {
  if (req.session.userId) {
    // Log user activity (this could be more detailed)
    console.log(`User ID: ${req.session.userId} accessed ${req.originalUrl} at ${new Date()}`);
  }
  next();
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
