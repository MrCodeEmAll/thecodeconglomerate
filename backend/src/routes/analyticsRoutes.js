const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// User statistics
router.get('/stats', analyticsController.getUserStats);
router.get('/stats/:userId', analyticsController.getUserStats);

// Category statistics
router.get('/categories', analyticsController.getCategoryStats);
router.get('/categories/:userId', analyticsController.getCategoryStats);

// Leaderboard
router.get('/leaderboard', analyticsController.getLeaderboard);

// Bet history
router.get('/history', analyticsController.getBetHistory);
router.get('/history/:userId', analyticsController.getBetHistory);

module.exports = router;
