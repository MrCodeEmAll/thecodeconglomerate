const User = require('../models/User');
const Bet = require('../models/Bet');

// Get user statistics
exports.getUserStats = async (req, res) => {
    try {
        const userId = req.params.userId || req.user.userId;
        
        // Get user's bets
        const bets = await Bet.find({
            $or: [
                { creator: userId },
                { 'participants.user': userId }
            ]
        });

        // Calculate statistics
        const stats = {
            totalBets: bets.length,
            activeBets: bets.filter(bet => bet.status === 'active').length,
            completedBets: bets.filter(bet => bet.status === 'completed').length,
            wonBets: 0,
            lostBets: 0,
            totalStakesWon: 0,
            totalStakesLost: 0,
            winRate: 0
        };

        bets.forEach(bet => {
            if (bet.status === 'completed') {
                const isCreator = bet.creator.toString() === userId;
                const isWinner = (isCreator && bet.outcome === 'creator_won') ||
                               (!isCreator && bet.outcome === 'participants_won');

                if (isWinner) {
                    stats.wonBets++;
                    stats.totalStakesWon += bet.totalStake;
                } else {
                    stats.lostBets++;
                    stats.totalStakesLost += bet.totalStake;
                }
            }
        });

        // Calculate win rate
        stats.winRate = stats.completedBets > 0 
            ? (stats.wonBets / stats.completedBets) * 100 
            : 0;

        res.json({ stats });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user statistics', error: error.message });
    }
};

// Get bet category statistics
exports.getCategoryStats = async (req, res) => {
    try {
        const userId = req.params.userId || req.user.userId;
        
        const bets = await Bet.find({
            $or: [
                { creator: userId },
                { 'participants.user': userId }
            ]
        });

        const categoryStats = {
            sports: { total: 0, won: 0, lost: 0, stakes: 0 },
            personal: { total: 0, won: 0, lost: 0, stakes: 0 },
            gaming: { total: 0, won: 0, lost: 0, stakes: 0 },
            other: { total: 0, won: 0, lost: 0, stakes: 0 }
        };

        bets.forEach(bet => {
            const category = bet.category;
            categoryStats[category].total++;
            categoryStats[category].stakes += bet.totalStake;

            if (bet.status === 'completed') {
                const isCreator = bet.creator.toString() === userId;
                const isWinner = (isCreator && bet.outcome === 'creator_won') ||
                               (!isCreator && bet.outcome === 'participants_won');

                if (isWinner) {
                    categoryStats[category].won++;
                } else {
                    categoryStats[category].lost++;
                }
            }
        });

        res.json({ categoryStats });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching category statistics', error: error.message });
    }
};

// Get leaderboard
exports.getLeaderboard = async (req, res) => {
    try {
        const users = await User.find({}, 'username profilePicture stakesBalance');
        
        // Get bet statistics for each user
        const leaderboardStats = await Promise.all(users.map(async user => {
            const bets = await Bet.find({
                $or: [
                    { creator: user._id },
                    { 'participants.user': user._id }
                ],
                status: 'completed'
            });

            let wonBets = 0;
            let totalBets = bets.length;

            bets.forEach(bet => {
                const isCreator = bet.creator.toString() === user._id.toString();
                const isWinner = (isCreator && bet.outcome === 'creator_won') ||
                               (!isCreator && bet.outcome === 'participants_won');
                if (isWinner) wonBets++;
            });

            return {
                userId: user._id,
                username: user.username,
                profilePicture: user.profilePicture,
                stakesBalance: user.stakesBalance,
                totalBets,
                wonBets,
                winRate: totalBets > 0 ? (wonBets / totalBets) * 100 : 0
            };
        }));

        // Sort by stakes balance and win rate
        const leaderboard = leaderboardStats.sort((a, b) => {
            if (b.stakesBalance !== a.stakesBalance) {
                return b.stakesBalance - a.stakesBalance;
            }
            return b.winRate - a.winRate;
        });

        res.json({ leaderboard });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leaderboard', error: error.message });
    }
};

// Get bet history
exports.getBetHistory = async (req, res) => {
    try {
        const userId = req.params.userId || req.user.userId;
        const { limit = 10, offset = 0 } = req.query;

        const bets = await Bet.find({
            $or: [
                { creator: userId },
                { 'participants.user': userId }
            ]
        })
        .sort({ createdAt: -1 })
        .skip(parseInt(offset))
        .limit(parseInt(limit))
        .populate('creator', 'username profilePicture')
        .populate('participants.user', 'username profilePicture');

        const total = await Bet.countDocuments({
            $or: [
                { creator: userId },
                { 'participants.user': userId }
            ]
        });

        res.json({
            bets,
            total,
            hasMore: total > parseInt(offset) + bets.length
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bet history', error: error.message });
    }
};
