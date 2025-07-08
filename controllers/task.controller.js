const Task = require('../models/task.model');
const User = require('../models/user.model');

exports.assignTask = async (req, res) => {
    const { title, description, email, dueDate } = req.body;

    try {
        if (!title || !description || !email || !dueDate) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const task = new Task({
            title,
            description,
            assignedTo: user._id,
            dueDate
        })
        const savedTask = await task.save();
        res.status(201).json({
            message: 'Task assigned successfully',
            task: savedTask
        });
    } catch (error) {
        console.error('Error assigning task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Get all tasks assigned to a user
exports.getTasksByUser = async (req, res) => {
    const userId = req.user.id;
    try {
        const tasks = await Task.find({ assignedTo: userId });
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Update task status
exports.updateTaskStatus = async (req, res) => {
    const taskId = req.params.id;
    const { status } = req.body;
    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        if (!['pending', 'in-progress', 'completed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        task.status = status;
        const updatedTask = await task.save();
        res.status(200).json(updatedTask);
    } catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

//get all tasks by hr
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}