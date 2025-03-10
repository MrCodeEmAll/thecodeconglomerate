const express = require('express');
const { createBet, resolveBet, getActiveBets } = require('../controllers/betController');

const router = express.Router();

// Create a new bet
router.post('/create', createBet);

// Resolve a bet
router.post('/resolve', resolveBet);

// Get active bets for a user
router.get('/active/:userId', getActiveBets);

module.exports = router;