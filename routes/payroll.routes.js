const express = require('express');
const router = express.Router();
const {
    generatePayroll,
    getPayroll,
    getAllPayrolls
} = require('../controllers/payroll.controllers');
const { verifyRole } = require('../middleware/verifyRole.middleware');
const protect = require('../middleware/auth.middleware');

router.post('/generate', protect, verifyRole('hr'), generatePayroll);

router.get('/:employeeId/:month/:year', protect, verifyRole('hr', 'employee'), getPayroll);

router.get('/allPayrolls', protect, verifyRole('hr'), getAllPayrolls);

module.exports = router;