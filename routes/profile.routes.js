const express = require('express');
const router = express.Router();
const {
    getMyProfile,
    updateMyProfile,
    getEmployeeProfile
}= require('../controllers/profile.controllers');
const protect = require('../middleware/auth.middleware');
const { verifyRole } = require('../middleware/verifyRole.middleware');

// Route to get self profile
router.get('/me', protect, getMyProfile);

// Route to update self profile
router.put('/me', protect, updateMyProfile);

// Route to get employee profile by id
router.get('/employee/:employeeId', protect, verifyRole('hr'), getEmployeeProfile);

module.exports = router;


//check out
