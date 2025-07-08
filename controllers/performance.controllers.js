const Task = require('../models/task.model');
const User = require('../models/user.model');
const Attendance = require(`../models/attendance.model`)

exports.getEmployeePerformance = async (req, res) => {
    try{
        const { employeeId } = req.params;
        const { start, end } = req.query;

        const startDate = new Date(start);
        const endDate = new Date(end);

        const tasks = await Task.find({
            assignedTo: employeeId,
            status: 'completed',
            dueDate: {
                $gte: startDate,
                $lte: endDate
            }
        })

        const taskOnTime = tasks.filter(task => task.dueDate >= task.createdAt && task.status === 'completed').length;

        const attendance = await Attendance.find({
            employeeId,
            date: {
                $gte: startDate,
                $lte: endDate
            }
        })

        const onTimeAttendance = attendance.filter(a => a.status === 'Present' && !a.isLate).length;

        const performanceScore = (
            ((taskOnTime / (tasks.length || 1)) * 0.6) +
            ((onTimeAttendance / (attendance.length || 1)) * 0.4)
        ) * 100;

        res.status(200).json({
            employeeId,
            totalTasks: tasks.length,
            taskOnTime,
            totalAttendance: attendance.length,
            onTimeAttendance,
            score: Math.round(performanceScore)
        })

    } catch (error) {
        console.error('Error fetching employee performance:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.getAllEmployeesPerformance = async (req, res) => {
    try{
        const { start, end } = req.query;
        const startDate = new Date(start);
        const endDate = new Date(end);

        const employees = await User.find({
            role: 'employee'
        })

        const result = [];

        for(const emp of employees){
            const tasks = await Task.find({
                assignedTo: emp._id,
                status: 'completed',
                dueDate: {
                    $gte: startDate,
                    $lte: endDate
                }
            })

            const tasksOnTime = tasks.filter(task => task.dueDate >= task.createdAt && task.status === 'completed').length;

            const attendance = await Attendance.find({
                employeeId: emp._id,
                date: {
                    $gte: startDate,
                    $lte: endDate
                }
            })

            const onTimeAttendance = attendance.filter(a => a.status === 'Present' && !a.isLate).length;

            const score = (
                ((tasksOnTime / (tasks.length || 1)) * 0.6) +
                ((onTimeAttendance / (attendance.length || 1)) * 0.4)
            ) * 100;

            result.push({
                employeeId: emp._id,
                name: emp.name,
                department: emp.department,
                position: emp.position,
                score: Math.round(score),
                tasksCompleted: tasks.length,
                onTimeAttendance,
            });
        }

        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching all employees performance:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.getMyPerformance = async (req, res) => {
    try {
        const employeeId = req.user.id; // Assuming user ID is stored in req.user
        const { start, end } = req.query;

        const startDate = new Date(start);
        const endDate = new Date(end);

        const tasks = await Task.find({
            assignedTo: employeeId,
            status: 'completed',
            dueDate: {
                $gte: startDate,
                $lte: endDate
            }
        });

        const tasksOnTime = tasks.filter(task => task.dueDate >= task.createdAt && task.status === 'completed').length;

        const attendance = await Attendance.find({
            employeeId,
            date: {
                $gte: startDate,
                $lte: endDate
            }
        });

        const onTimeAttendance = attendance.filter(a => a.status === 'Present' && !a.isLate).length;

        const score = (
            ((tasksOnTime / (tasks.length || 1)) * 0.6) +
            ((onTimeAttendance / (attendance.length || 1)) * 0.4)
        ) * 100;

        res.status(200).json({
            employeeId,
            tasksCompleted: tasks.length,
            tasksOnTime,
            totalAttendance: attendance.length,
            onTimeAttendance,
            score: Math.round(score)
        });
    } catch (error) {
        console.error('Error fetching my performance:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}