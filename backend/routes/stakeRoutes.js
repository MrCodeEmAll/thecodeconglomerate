const express = require('express');
const router = express.Router();
const {
    getStakes,
    getTrendingStakes,
    createStake,
    getStakeById,
    joinStake,
    updateStakeStatus
} = require('../controllers/stakeController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getStakes);
router.get('/trending', getTrendingStakes);
router.post('/', protect, createStake);
router.get('/:id', getStakeById);
router.post('/:id/join', protect, joinStake);
router.put('/:id/status', protect, updateStakeStatus);

module.exports = router; 