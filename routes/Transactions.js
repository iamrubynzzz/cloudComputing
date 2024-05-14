const express = require('express');
const router = express.Router();
const Transaction = require('../models/trans');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/expense-tracker', {
  connectTimeoutMS: 30000, // Increase timeout to 30 seconds
  socketTimeoutMS: 30000
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


// Get all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json({ success: true, data: transactions });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// Add a transaction
router.post('/', async (req, res) => {
  const { text, amount } = req.body;

  try {
    const newTransaction = new Transaction({ text, amount });
    
    await newTransaction.save();
    res.status(201).json({ success: true, data: newTransaction });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// Delete a transaction
router.delete('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }

    await transaction.deleteOne();
    res.json({ success: true, data: {} });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

module.exports = router;
