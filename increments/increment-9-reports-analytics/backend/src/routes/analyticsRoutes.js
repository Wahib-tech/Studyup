const express = require('express');
const router = express.Router();
const { getStudentAnalytics, getAdminAnalytics, getDashboardSummary } = require('../controllers/analyticsController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/student', protect, getStudentAnalytics);
router.get('/admin', protect, admin, getAdminAnalytics);
router.get('/dashboard-summary', protect, getDashboardSummary);

module.exports = router;
