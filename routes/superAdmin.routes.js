const express = require('express');
const router = express.Router();
const { registerHR } = require('../controllers/superAdmin/manageHR.controller');
const { verifyRole } = require('../middleware/verifyRole.middleware')
const protect  = require('../middleware/auth.middleware')

router.post('/register', protect, verifyRole('admin'), registerHR);

module.exports = router;
