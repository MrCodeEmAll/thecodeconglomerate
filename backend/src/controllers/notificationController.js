const Notification = require('../models/Notification');

// Get user notifications
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.getRecent(req.user.userId);
        const unreadCount = await Notification.getUnreadCount(req.user.userId);

        res.json({
            notifications,
            unreadCount
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications', error: error.message });
    }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.notificationId,
            recipient: req.user.userId
        });

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        await notification.markAsRead();

        res.json({
            message: 'Notification marked as read',
            notification
        });
    } catch (error) {
        res.status(500).json({ message: 'Error marking notification as read', error: error.message });
    }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user.userId, read: false },
            { read: true }
        );

        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Error marking all notifications as read', error: error.message });
    }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: req.params.notificationId,
            recipient: req.user.userId
        });

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.json({
            message: 'Notification deleted successfully',
            notification
        });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting notification', error: error.message });
    }
};

// Delete all notifications
exports.deleteAllNotifications = async (req, res) => {
    try {
        await Notification.deleteMany({ recipient: req.user.userId });
        res.json({ message: 'All notifications deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting all notifications', error: error.message });
    }
};

// Get unread notifications count
exports.getUnreadCount = async (req, res) => {
    try {
        const count = await Notification.getUnreadCount(req.user.userId);
        res.json({ unreadCount: count });
    } catch (error) {
        res.status(500).json({ message: 'Error getting unread count', error: error.message });
    }
};
