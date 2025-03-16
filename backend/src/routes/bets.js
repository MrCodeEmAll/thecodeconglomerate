const express = require('express');
const router = express.Router();
const Bet = require('../models/Bet');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Create a new bet
router.post('/', auth, async (req, res) => {
  try {
    const bet = new Bet({
      ...req.body,
      creator: req.user.id,
    });
    await bet.save();
    res.status(201).json(bet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all public bets
router.get('/public', async (req, res) => {
  try {
    const bets = await Bet.find({ visibility: 'public', status: 'open' })
      .populate('creator', 'username')
      .sort({ createdAt: -1 });
    res.json(bets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's bets
router.get('/my-bets', auth, async (req, res) => {
  try {
    const bets = await Bet.find({
      $or: [
        { creator: req.user.id },
        { 'participants.user': req.user.id }
      ]
    }).populate('creator', 'username');
    res.json(bets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Join a bet
router.post('/:id/join', auth, async (req, res) => {
  try {
    const bet = await Bet.findById(req.params.id);
    if (!bet) return res.status(404).json({ message: 'Bet not found' });
    
    if (bet.status !== 'open') {
      return res.status(400).json({ message: 'This bet is no longer open' });
    }

    const user = await User.findById(req.user.id);
    if (user.balance < req.body.amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    bet.participants.push({
      user: req.user.id,
      choice: req.body.choice,
      amount: req.body.amount,
      status: 'accepted'
    });

    bet.totalPool += req.body.amount;
    await bet.save();

    user.balance -= req.body.amount;
    await user.save();

    res.json(bet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Resolve a bet
router.post('/:id/resolve', auth, async (req, res) => {
  try {
    const bet = await Bet.findById(req.params.id);
    if (!bet) return res.status(404).json({ message: 'Bet not found' });
    
    if (bet.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    bet.status = 'completed';
    bet.outcome = req.body.outcome;

    // Calculate and distribute winnings
    const winners = bet.participants.filter(p => p.choice === req.body.outcome);
    const totalWinningAmount = bet.totalPool;
    const winnerShare = totalWinningAmount / winners.length;

    for (const winner of winners) {
      const user = await User.findById(winner.user);
      user.balance += winnerShare;
      user.stats.wins += 1;
      user.stats.winRate = (user.stats.wins / (user.stats.wins + user.stats.losses)) * 100;
      await user.save();
    }

    const losers = bet.participants.filter(p => p.choice !== req.body.outcome);
    for (const loser of losers) {
      const user = await User.findById(loser.user);
      user.stats.losses += 1;
      user.stats.winRate = (user.stats.wins / (user.stats.wins + user.stats.losses)) * 100;
      await user.save();
    }

    await bet.save();
    res.json(bet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 