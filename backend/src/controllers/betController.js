const Bet = require('../models/Bet');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Create a new bet
exports.createBet = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            deadline,
            participants,
            stake
        } = req.body;

        // Create new bet
        const bet = new Bet({
            creator: req.user.userId,
            title,
            description,
            category,
            deadline,
            participants: participants.map(userId => ({
                user: userId,
                stake,
                status: 'pending'
            }))
        });

        await bet.save();

        // Create notifications for participants
        const notifications = participants.map(userId => ({
            recipient: userId,
            sender: req.user.userId,
            type: 'bet_invitation',
            content: `You've been invited to a bet: ${title}`,
            relatedBet: bet._id
        }));

        await Notification.insertMany(notifications);

        res.status(201).json({
            message: 'Bet created successfully',
            bet: await bet.populate('participants.user', 'username profilePicture')
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating bet', error: error.message });
    }
};

// Get all bets for a user
exports.getUserBets = async (req, res) => {
    try {
        const bets = await Bet.find({
            $or: [
                { creator: req.user.userId },
                { 'participants.user': req.user.userId }
            ]
        })
        .populate('creator', 'username profilePicture')
        .populate('participants.user', 'username profilePicture')
        .sort({ createdAt: -1 });

        res.json({ bets });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bets', error: error.message });
    }
};

// Get specific bet details
exports.getBetDetails = async (req, res) => {
    try {
        const bet = await Bet.findById(req.params.betId)
            .populate('creator', 'username profilePicture')
            .populate('participants.user', 'username profilePicture')
            .populate('witnesses', 'username profilePicture');

        if (!bet) {
            return res.status(404).json({ message: 'Bet not found' });
        }

        res.json({ bet: bet.getBetDetails() });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bet details', error: error.message });
    }
};

// Respond to bet invitation
exports.respondToBet = async (req, res) => {
    try {
        const { status } = req.body;
        const bet = await Bet.findOne({
            _id: req.params.betId,
            'participants.user': req.user.userId,
            'participants.status': 'pending'
        });

        if (!bet) {
            return res.status(404).json({ message: 'Bet not found or already responded' });
        }

        // Update participant status
        const participant = bet.participants.find(p => 
            p.user.toString() === req.user.userId
        );
        participant.status = status;

        // If accepted, check user's balance
        if (status === 'accepted') {
            const user = await User.findById(req.user.userId);
            if (user.stakesBalance < participant.stake) {
                return res.status(400).json({ message: 'Insufficient stakes balance' });
            }
            user.stakesBalance -= participant.stake;
            await user.save();
        }

        // Check if bet can start
        if (bet.canStart()) {
            bet.status = 'active';
            bet.calculateTotalStake();
        }

        await bet.save();

        // Create notification for bet creator
        await new Notification({
            recipient: bet.creator,
            sender: req.user.userId,
            type: status === 'accepted' ? 'bet_accepted' : 'bet_declined',
            content: `${status === 'accepted' ? 'accepted' : 'declined'} your bet: ${bet.title}`,
            relatedBet: bet._id
        }).save();

        res.json({
            message: `Bet ${status} successfully`,
            bet: await bet.populate('participants.user', 'username profilePicture')
        });
    } catch (error) {
        res.status(500).json({ message: 'Error responding to bet', error: error.message });
    }
};

// Complete a bet
exports.completeBet = async (req, res) => {
    try {
        const { outcome, evidence } = req.body;
        const bet = await Bet.findOne({
            _id: req.params.betId,
            creator: req.user.userId,
            status: 'active'
        });

        if (!bet) {
            return res.status(404).json({ message: 'Bet not found or cannot be completed' });
        }

        bet.status = 'completed';
        bet.outcome = outcome;
        bet.evidence = evidence;

        // Distribute stakes based on outcome
        const participants = await User.find({
            _id: { $in: bet.participants.map(p => p.user) }
        });

        if (outcome === 'creator_won') {
            const creator = await User.findById(bet.creator);
            creator.stakesBalance += bet.totalStake;
            await creator.save();
        } else if (outcome === 'participants_won') {
            const acceptedParticipants = bet.participants.filter(p => p.status === 'accepted');
            const stakePerParticipant = bet.totalStake / acceptedParticipants.length;
            
            for (const participant of acceptedParticipants) {
                const user = participants.find(u => u._id.toString() === participant.user.toString());
                user.stakesBalance += stakePerParticipant;
                await user.save();
            }
        }

        await bet.save();

        // Create notifications for participants
        const notifications = bet.participants
            .filter(p => p.status === 'accepted')
            .map(p => ({
                recipient: p.user,
                sender: req.user.userId,
                type: 'bet_completed',
                content: `Bet completed: ${bet.title}. ${outcome === 'creator_won' ? 'Creator won!' : 'Participants won!'}`,
                relatedBet: bet._id
            }));

        await Notification.insertMany(notifications);

        res.json({
            message: 'Bet completed successfully',
            bet: await bet.populate('participants.user', 'username profilePicture')
        });
    } catch (error) {
        res.status(500).json({ message: 'Error completing bet', error: error.message });
    }
};

// Add witness to bet
exports.addWitness = async (req, res) => {
    try {
        const { witnessId } = req.body;
        const bet = await Bet.findById(req.params.betId);

        if (!bet) {
            return res.status(404).json({ message: 'Bet not found' });
        }

        if (bet.witnesses.includes(witnessId)) {
            return res.status(400).json({ message: 'User is already a witness' });
        }

        bet.witnesses.push(witnessId);
        await bet.save();

        // Create notification for witness
        await new Notification({
            recipient: witnessId,
            sender: req.user.userId,
            type: 'bet_witness_added',
            content: `You've been added as a witness to bet: ${bet.title}`,
            relatedBet: bet._id
        }).save();

        res.json({
            message: 'Witness added successfully',
            bet: await bet.populate('witnesses', 'username profilePicture')
        });
    } catch (error) {
        res.status(500).json({ message: 'Error adding witness', error: error.message });
    }
};
