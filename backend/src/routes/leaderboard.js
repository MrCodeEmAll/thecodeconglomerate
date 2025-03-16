const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get global leaderboard
router.get('/global', async (req, res) => {
  try {
    const users = await User.find({})
      .select('username stats profilePicture')
      .sort({ 'stats.winRate': -1, 'stats.wins': -1 })
      .limit(100);
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get friends leaderboard
router.get('/friends', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('friends');
    const friendIds = user.friends.map(friend => friend._id);
    friendIds.push(req.user.id); // Include the user themselves

    const leaderboard = await User.find({
      '_id': { $in: friendIds }
    })
      .select('username stats profilePicture')
      .sort({ 'stats.winRate': -1, 'stats.wins': -1 });
    
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user ranking
router.get('/ranking', auth, async (req, res) => {
  try {
    const userRank = await User.countDocuments({
      $or: [
        { 'stats.winRate': { $gt: req.user.stats.winRate } },
        {
          'stats.winRate': req.user.stats.winRate,
          'stats.wins': { $gt: req.user.stats.wins }
        }
      ]
    });

    res.json({ rank: userRank + 1 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 