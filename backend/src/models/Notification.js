const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['bet_invitation', 'bet_accepted', 'bet_declined', 'bet_completed', 'friend_request', 'friend_accepted']
    },
    content: {
        type: String,
        required: true
    },
    relatedBet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bet'
    },
    read: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Method to mark notification as read
notificationSchema.methods.markAsRead = function() {
    this.read = true;
    return this.save();
};

// Static method to get unread notifications count
notificationSchema.statics.getUnreadCount = async function(userId) {
    return await this.countDocuments({ recipient: userId, read: false });
};

// Static method to get recent notifications
notificationSchema.statics.getRecent = async function(userId, limit = 10) {
    return await this.find({ recipient: userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('sender', 'username profilePicture')
        .populate('relatedBet', 'title');
};

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
