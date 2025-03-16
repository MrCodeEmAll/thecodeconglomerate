const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    choice: String,
    amount: Number,
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending',
    },
  }],
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Sports', 'E-Sports', 'Politics', 'Entertainment', 'Custom'],
  },
  options: [{
    text: String,
    odds: Number,
  }],
  totalPool: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'completed', 'cancelled'],
    default: 'open',
  },
  outcome: {
    type: String,
    default: null,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  visibility: {
    type: String,
    enum: ['public', 'friends', 'private'],
    default: 'public',
  },
});

module.exports = mongoose.model('Bet', betSchema);
