const express = require('express');
const router = express.Router();
const { registerEmployee } = require('../controllers/hr/manageEmployee.controller');
const { verifyRole } = require('../middleware/verifyRole.middleware')
const protect  = require('../middleware/auth.middleware')

router.post('/register', protect, verifyRole('hr'), registerEmployee);

module.exports = router;