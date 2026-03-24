const Notification = require('../models/Notification');
const { getIO } = require('../utils/socket');

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ student_id: req.user.linked_id || req.user.id })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { read_status: true }, { new: true });
    res.json(notification);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notification deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const clearNotifications = async (req, res) => {
  try {
    const student_id = req.user.linked_id || req.user.id;
    await Notification.deleteMany({ student_id });
    res.json({ message: 'All notifications cleared' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { student_id: req.user.linked_id || req.user.id, read_status: false },
      { read_status: true }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// Internal helper for other controllers to create notifications
const createNotification = async (data) => {
  try {
    const notification = await Notification.create(data);
    
    // Emit real-time update
    const io = getIO();
    io.to(data.student_id.toString()).emit('new_notification', notification);
    
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

module.exports = { getNotifications, markAsRead, deleteNotification, clearNotifications, markAllAsRead, createNotification };
