const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/order');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Order schema
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderAmount: { type: Number, required: true },
  title: { type: String, required: true },
  length: { type: Number, required: true },
  width: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// Route to create an order (JWT authentication)
router.post('/create-order', async (req, res) => {
  const { title, length, width, orderAmount } = req.body;

  if (!title || !length || !width || !orderAmount) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const newOrder = new Order({
      userId,
      orderAmount,
      title,
      length,
      width,
      status: 'pending',
    });

    await newOrder.save();

    res.status(201).json({ 
      message: 'Order created successfully', 
      order: newOrder 
    });

  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Error placing order. Please try again.' });
  }
});

module.exports = router;
