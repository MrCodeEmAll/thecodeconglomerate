const Friend = require('../models/Friend');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Send friend request
exports.sendFriendRequest = async (req, res) => {
    try {
        const { recipientId } = req.body;

        // Check if recipient exists
        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if friend request already exists
        const existingRequest = await Friend.findOne({
            $or: [
                { requester: req.user.userId, recipient: recipientId },
                { requester: recipientId, recipient: req.user.userId }
            ]
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'Friend request already exists' });
        }

        // Create friend request
        const friendRequest = new Friend({
            requester: req.user.userId,
            recipient: recipientId
        });

        await friendRequest.save();

        // Create notification
        await new Notification({
            recipient: recipientId,
            sender: req.user.userId,
            type: 'friend_request',
            content: 'You have received a friend request'
        }).save();

        res.status(201).json({
            message: 'Friend request sent successfully',
            friendRequest: await friendRequest
                .populate('requester', 'username profilePicture')
                .populate('recipient', 'username profilePicture')
        });
    } catch (error) {
        res.status(500).json({ message: 'Error sending friend request', error: error.message });
    }
};

// Respond to friend request
exports.respondToFriendRequest = async (req, res) => {
    try {
        const { status } = req.body;
        const friendRequest = await Friend.findOne({
            _id: req.params.requestId,
            recipient: req.user.userId,
            status: 'pending'
        });

        if (!friendRequest) {
            return res.status(404).json({ message: 'Friend request not found or already responded' });
        }

        friendRequest.status = status;
        await friendRequest.save();

        // If accepted, update both users' friend lists
        if (status === 'accepted') {
            const [requester, recipient] = await Promise.all([
                User.findById(friendRequest.requester),
                User.findById(friendRequest.recipient)
            ]);

            requester.friends.push(friendRequest.recipient);
            recipient.friends.push(friendRequest.requester);

            await Promise.all([requester.save(), recipient.save()]);

            // Create notification for requester
            await new Notification({
                recipient: friendRequest.requester,
                sender: req.user.userId,
                type: 'friend_accepted',
                content: 'Your friend request has been accepted'
            }).save();
        }

        res.json({
            message: `Friend request ${status} successfully`,
            friendRequest: await friendRequest
                .populate('requester', 'username profilePicture')
                .populate('recipient', 'username profilePicture')
        });
    } catch (error) {
        res.status(500).json({ message: 'Error responding to friend request', error: error.message });
    }
};

// Get friend list
exports.getFriendList = async (req, res) => {
    try {
        const friends = await Friend.getFriendList(req.user.userId);
        res.json({ friends });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching friend list', error: error.message });
    }
};

// Get pending friend requests
exports.getPendingRequests = async (req, res) => {
    try {
        const pendingRequests = await Friend.getPendingRequests(req.user.userId);
        res.json({ pendingRequests });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pending requests', error: error.message });
    }
};

// Remove friend
exports.removeFriend = async (req, res) => {
    try {
        const { friendId } = req.params;

        // Find and remove friendship
        const friendship = await Friend.findOneAndDelete({
            $or: [
                { requester: req.user.userId, recipient: friendId },
                { requester: friendId, recipient: req.user.userId }
            ],
            status: 'accepted'
        });

        if (!friendship) {
            return res.status(404).json({ message: 'Friendship not found' });
        }

        // Remove from both users' friend lists
        await Promise.all([
            User.findByIdAndUpdate(req.user.userId, {
                $pull: { friends: friendId }
            }),
            User.findByIdAndUpdate(friendId, {
                $pull: { friends: req.user.userId }
            })
        ]);

        res.json({ message: 'Friend removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing friend', error: error.message });
    }
};

// Block user
exports.blockUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find existing relationship
        let relationship = await Friend.findOne({
            $or: [
                { requester: req.user.userId, recipient: userId },
                { requester: userId, recipient: req.user.userId }
            ]
        });

        if (relationship) {
            relationship.status = 'blocked';
            await relationship.save();
        } else {
            relationship = await new Friend({
                requester: req.user.userId,
                recipient: userId,
                status: 'blocked'
            }).save();
        }

        // Remove from friend lists if they were friends
        await Promise.all([
            User.findByIdAndUpdate(req.user.userId, {
                $pull: { friends: userId }
            }),
            User.findByIdAndUpdate(userId, {
                $pull: { friends: req.user.userId }
            })
        ]);

        res.json({ message: 'User blocked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error blocking user', error: error.message });
    }
};
