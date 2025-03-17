const Stake = require('../models/stakeModel');
const User = require('../models/userModel');

// @desc    Get all stakes
// @route   GET /api/stakes
// @access  Public
const getStakes = async (req, res) => {
    try {
        const stakes = await Stake.find({ visibility: 'public' })
            .populate('creator', 'username')
            .populate('participants.user', 'username');
        res.json(stakes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get trending stakes
// @route   GET /api/stakes/trending
// @access  Public
const getTrendingStakes = async (req, res) => {
    try {
        const stakes = await Stake.find({ trending: true, visibility: 'public' })
            .populate('creator', 'username')
            .populate('participants.user', 'username');
        res.json(stakes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new stake
// @route   POST /api/stakes
// @access  Private
const createStake = async (req, res) => {
    try {
        const { title, description, amount, category, expiresAt, visibility } = req.body;

        const stake = await Stake.create({
            title,
            description,
            amount,
            category,
            expiresAt,
            visibility,
            creator: req.user._id,
            participants: [{ user: req.user._id }]
        });

        // Add stake to user's stakes array
        await User.findByIdAndUpdate(
            req.user._id,
            { $push: { stakes: stake._id } }
        );

        const populatedStake = await stake.populate([
            { path: 'creator', select: 'username' },
            { path: 'participants.user', select: 'username' }
        ]);

        res.status(201).json(populatedStake);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get stake by ID
// @route   GET /api/stakes/:id
// @access  Public
const getStakeById = async (req, res) => {
    try {
        const stake = await Stake.findById(req.params.id)
            .populate('creator', 'username')
            .populate('participants.user', 'username');

        if (stake) {
            res.json(stake);
        } else {
            res.status(404).json({ message: 'Stake not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Join a stake
// @route   POST /api/stakes/:id/join
// @access  Private
const joinStake = async (req, res) => {
    try {
        const stake = await Stake.findById(req.params.id);

        if (!stake) {
            return res.status(404).json({ message: 'Stake not found' });
        }

        // Check if user is already a participant
        const isParticipant = stake.participants.some(
            (p) => p.user.toString() === req.user._id.toString()
        );

        if (isParticipant) {
            return res.status(400).json({ message: 'Already joined this stake' });
        }

        stake.participants.push({ user: req.user._id });
        await stake.save();

        // Add stake to user's stakes array
        await User.findByIdAndUpdate(
            req.user._id,
            { $push: { stakes: stake._id } }
        );

        const populatedStake = await stake.populate([
            { path: 'creator', select: 'username' },
            { path: 'participants.user', select: 'username' }
        ]);

        res.json(populatedStake);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update stake status
// @route   PUT /api/stakes/:id/status
// @access  Private
const updateStakeStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const stake = await Stake.findById(req.params.id);

        if (!stake) {
            return res.status(404).json({ message: 'Stake not found' });
        }

        // Check if user is the creator
        if (stake.creator.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        stake.status = status;
        await stake.save();

        const populatedStake = await stake.populate([
            { path: 'creator', select: 'username' },
            { path: 'participants.user', select: 'username' }
        ]);

        res.json(populatedStake);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getStakes,
    getTrendingStakes,
    createStake,
    getStakeById,
    joinStake,
    updateStakeStatus
}; 