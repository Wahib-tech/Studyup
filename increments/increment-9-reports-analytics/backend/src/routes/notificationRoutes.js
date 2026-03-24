const express = require('express');
const router = express.Router();
const { 
  getNotifications, markAsRead, markAllAsRead, 
  deleteNotification, clearNotifications 
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getNotifications);
router.put('/mark-all-read', protect, markAllAsRead);
router.put('/:id/read', protect, markAsRead);
router.delete('/clear-all', protect, clearNotifications);
router.delete('/:id', protect, deleteNotification);

module.exports = router;
