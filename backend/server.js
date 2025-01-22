const express = require('express');  // Import express
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const jwt = require('jsonwebtoken');  // Import jwt
const serviceRoutes = require('./routes/serviceRoutes');
dotenv.config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS with credentials
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true, // Allow credentials to be included
}));

app.use(bodyParser.json());

// Connect to MongoDB (Updated to use localhost)
mongoose.connect('mongodb://127.0.0.1:27017/OSF', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Connection error:', err));

// Setup session store
const store = new MongoDBStore({
  uri: 'mongodb://127.0.0.1:27017/OSF', // Updated to use localhost
  collection: 'sessions'
});

// Check for session store errors
store.on('error', function (error) {
  console.log(error);
});

// Configure session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'AnkitaDilipKamble', // Use environment variable for security
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
  role: { type: String, default: 'user' }, // Add the role field (default 'user')
  addr: { type: String, required: false }, // Added addr field
  lastLogin: { type: Date } // Added lastLogin field
});

const User = mongoose.model('User', userSchema);

// Order schema
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderAmount: { type: Number, required: true },
  title: { type: String, required: true },  // Add this line
  length: { type: Number, required: true },
  width: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);

// Signup route (Updated to /addr)
app.post('/addr', async (req, res) => {
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

    // Check if this is the first user to sign up
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? 'admin' : 'user'; // First user gets 'admin' role

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, mobile, password: hashedPassword, role });

    await newUser.save();

    console.log('User registered successfully:', newUser);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Signup error:', error.message || error);
    res.status(500).json({ message: 'Internal server error', details: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { mobile, password } = req.body;

  if (!mobile || !password) {
    return res.status(400).json({ message: 'Mobile number and password are required' });
  }

  try {
    const user = await User.findOne({ mobile });  // Assuming mobile is used as the unique identifier
    if (!user) {
      return res.status(401).json({ message: 'Invalid mobile number or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid mobile number or password' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the token and role in the response
    res.status(200).json({
      message: 'Login successful',
      token,  // Return the token here
      role: user.role,  // Send the user role along with the token
    });
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

app.post('/api/create-order', async (req, res) => {
  debugger
  const { orderAmount, title, length, width } = req.body;

  // Check if required fields are missing
  if (!orderAmount || !title || !length || !width) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    debugger
    const user = jwt.verify(token, process.env.JWT_SECRET);

    const newOrder = new Order({
      userId: user.id,
      orderAmount,
      title,
      length,
      width,
      status: 'pending',
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Error placing order. Please try again.' });
  }
});


app.get('/api/orders', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }

  try {
    // Verify the token and extract user information
    const user = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if the user is an admin
    if (user.role === 'admin') {
      // Admin sees all orders
      const orders = await Order.find();
      return res.status(200).json({ orders });
    } else {
      // Regular user sees only their orders
      const orders = await Order.find({ userId: user.id });
      return res.status(200).json({ orders });
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
});

// Add the route to update order status
// Route to handle updating order statuses
app.post('/api/orders/update-status', async (req, res) => {
  const { statusUpdates } = req.body; // Array of { orderId, status }
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    // Verify the token and extract user information
    console.log('Token:', token);
    const user = jwt.verify(token, process.env.JWT_SECRET);
    console.log('User:', user);
      
    const updatedOrders = [];
    
    for (const { orderId, status } of statusUpdates) {
      const order = await Order.findById(orderId);
      if (!order) {
        continue; // Skip if the order does not exist
      }

      // Check if the user is allowed to update the order (admin or order owner)
      if (user.role !== 'admin' && order.userId.toString() !== user.id.toString()) {
        continue; // Skip if the user is not authorized
      }

      // Update the order status
      order.status = status;
      await order.save();
      updatedOrders.push(order);
    }

    res.status(200).json({ message: 'Order statuses updated successfully', updatedOrders });
  } catch (error) {
    console.error('Error updating order statuses:', error);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
});




app.get('/api/my-orders', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    // Verify the token to get the user's ID
    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    // Fetch orders that belong to the authenticated user
    const orders = await Order.find({ userId: user.id });

    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Error fetching user orders' });
  }
});

// Cancel an order
app.put('/api/orders/:orderId/cancel', async (req, res) => {
  const { orderId } = req.params;
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the user is allowed to cancel the order
    if (user.role !== 'admin' && order.userId.toString() !== user.id) {
      return res.status(403).json({ message: 'Forbidden: Cannot cancel this order' });
    }

    // Update the order status to 'cancelled'
    order.status = 'cancelled';
    await order.save();

    res.status(200).json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
});


app.get('/api/profile', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    // Verify the token
    const user = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user details from the database
    const userData = await User.findById(user.id).select('-password'); // Exclude password
    if (!userData) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(userData);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
});

app.put('/api/profile', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);

    const updatedData = {
      username: req.body.username,
      email: req.body.email,
      mobile: req.body.mobile,
      addr: req.body.addr,
    };

    // Only update password if provided
    if (req.body.password) {
      updatedData.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(user.id, updatedData, {
      new: true,
    }).select('-password'); // Exclude password in the response

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.use(bodyParser.json());

app.use('/api/services', serviceRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));


