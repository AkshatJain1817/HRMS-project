const express = require('express');
const router = express.Router();
const {
    assignTask,
    getTasksByUser,
    updateTaskStatus,
    getAllTasks
} = require('../controllers/task.controller');
const { verifyRole } = require('../middleware/verifyRole.middleware');
const protect = require('../middleware/auth.middleware');

// HR will assign tasks to employees
router.post('/assign', protect, verifyRole('hr'), assignTask);

// employee will get all tasks assigned to them
router.get('/my-tasks', protect, verifyRole('employee'), getTasksByUser);

//employee will update task status
router.put('/update-status/:id', protect, verifyRole('employee'), updateTaskStatus);

//get all tasks by hr
router.get('/all-tasks', protect, verifyRole('hr'), getAllTasks);

module.exports = router;