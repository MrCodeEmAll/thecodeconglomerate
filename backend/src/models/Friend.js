const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined', 'blocked'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound index to ensure unique friend relationships
friendSchema.index({ requester: 1, recipient: 1 }, { unique: true });

// Static method to check if users are friends
friendSchema.statics.areFriends = async function(user1Id, user2Id) {
    const friendship = await this.findOne({
        $or: [
            { requester: user1Id, recipient: user2Id },
            { requester: user2Id, recipient: user1Id }
        ],
        status: 'accepted'
    });
    return !!friendship;
};

// Static method to get friend list
friendSchema.statics.getFriendList = async function(userId) {
    const friends = await this.find({
        $or: [
            { requester: userId, status: 'accepted' },
            { recipient: userId, status: 'accepted' }
        ]
    })
    .populate('requester', 'username profilePicture')
    .populate('recipient', 'username profilePicture');

    return friends.map(friendship => {
        const friend = friendship.requester._id.equals(userId) 
            ? friendship.recipient 
            : friendship.requester;
        return {
            _id: friend._id,
            username: friend.username,
            profilePicture: friend.profilePicture,
            friendshipId: friendship._id,
            createdAt: friendship.createdAt
        };
    });
};

// Static method to get pending requests
friendSchema.statics.getPendingRequests = async function(userId) {
    return await this.find({
        recipient: userId,
        status: 'pending'
    })
    .populate('requester', 'username profilePicture');
};

const Friend = mongoose.model('Friend', friendSchema);

module.exports = Friend;
