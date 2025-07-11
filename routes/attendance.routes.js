const express = require('express');
const router = express.Router();
const {
    markAttendance,
    getEmployeeAttendance,
    getAllAttendance,
    getEmployeeAttendanceByDate,
    markCheckout
}= require('../controllers/attendance.controllers');
const protect = require('../middleware/auth.middleware');
const { verifyRole } = require('../middleware/verifyRole.middleware')

// Route to mark attendance
router.post('/mark', protect, verifyRole('employee'), markAttendance);

// Route to get employee attendance records
router.get('/records', protect, verifyRole('employee'), getEmployeeAttendance);

// Route to get all attendance records by hr
router.get('/all', protect, verifyRole('hr'), getAllAttendance);

// Route to get attendance of a specific employee by hr
router.get('/employee', protect, verifyRole('hr'), getEmployeeAttendanceByDate);

// checkout route
router.put('/checkout', protect, verifyRole('employee'), markCheckout);

module.exports = router;