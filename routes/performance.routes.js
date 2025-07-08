const express = require('express');
const router = express.Router();
const {
    getEmployeePerformance,
    getAllEmployeesPerformance,
    getMyPerformance
} = require('../controllers/performance.controllers');
const protect = require('../middleware/auth.middleware');
const { verifyRole } = require('../middleware/verifyRole.middleware');

// Route to get employee performance
router.get('/employee/:employeeId', protect, verifyRole('hr'), getEmployeePerformance);

// Route to get all employees performance
router.get('/employees', protect, verifyRole('hr'), getAllEmployeesPerformance);

// Route to get my performance
router.get('/me', protect, getMyPerformance);

module.exports = router;