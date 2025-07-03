const express = require('express');
const router = express.Router();
const { registerEmployee } = require('../controllers/hr/manageEmployee.controller');
const { 
    getnewEmployees,
    getNumberOfNewEmployees,
    getallemployees,
    getNumberOfAllEmployees,
    getAllEmployeesOnLeave,
    getNumberOfEmployeesOnLeave

} = require('../controllers/hr/hr.controller');
const { verifyRole } = require('../middleware/verifyRole.middleware')
const protect = require('../middleware/auth.middleware')

// hr will register employee by this route
router.post('/register', protect, verifyRole('hr'), registerEmployee);

// hr will get new employees by this route
router.get('/new-employees', protect, verifyRole('hr'), getnewEmployees);

// hr will get number of new employees by this route
router.get('/new-employees/count', protect, verifyRole('hr'), getNumberOfNewEmployees);

// hr will get all employees by this route
router.get('/employees', protect, verifyRole('hr'), getallemployees);

//hr will get no. of employees by this route
router.get('/employees/count', protect, verifyRole('hr'), getNumberOfAllEmployees);

// hr will get all employees who are on leave by this route
router.get('/employees-on-leave', protect, verifyRole('hr'), getAllEmployeesOnLeave);

// hr will get number of employees who are on leave by this route
router.get('/employees-on-leave/count', protect, verifyRole('hr'), getNumberOfEmployeesOnLeave);

module.exports = router;