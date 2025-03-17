const mongoose = require('mongoose');

const stakeSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    amount: {
        type: Number,
        required: [true, 'Please add an amount']
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    participants: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    },
    category: {
        type: String,
        required: [true, 'Please add a category']
    },
    expiresAt: {
        type: Date,
        required: [true, 'Please add an expiry date']
    },
    trending: {
        type: Boolean,
        default: false
    },
    visibility: {
        type: String,
        enum: ['public', 'private'],
        default: 'public'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Stake', stakeSchema); 