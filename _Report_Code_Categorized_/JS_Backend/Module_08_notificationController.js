const Notification = require('../models/Notification');

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ student_id: req.user.linked_id || req.user.id });
    res.json(notifications);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { read_status: true }, { new: true });
    res.json(notification);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getNotifications, markAsRead };
