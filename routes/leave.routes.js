const express = require('express');
const router = express.Router();
const {
    applyLeave,
    getLeaveRequests,
    updateLeaveRequestStatus
} = require('../controllers/leave.controller');
const { verifyRole } = require('../middleware/verifyRole.middleware');
const protect = require('../middleware/auth.middleware');

// Employee applies for leave
router.post('/apply', protect, verifyRole('employee'), applyLeave);

//get all leave requests by hr
router.get('/requests', protect, verifyRole('hr'), getLeaveRequests);

// Update leave request status by hr
router.put('/update-status', protect, verifyRole('hr'), updateLeaveRequestStatus);

module.exports = router;