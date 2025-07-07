const Attendance = require('../models/attendance.model');
const mongoose = require('mongoose');
const User = require('../models/user.model');

exports.markAttendance = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date().toISOString().split('T')[0]; //this gets the current date in YYYY-MM-DD format

        const checkIn = new Date(req.body.checkinTime);
        const lateThreshold = new Date(`${today}T09:00:00`); // Assuming 9 AM is the reporting time

        const alreadyMarked = await Attendance.findOne({ employeeId: userId, date: today });

        if (alreadyMarked) {
            return res.status(400).json({ message: 'Attendance already marked for today' });
        }

        const newRecord = new Attendance({
            employeeId: userId,
            date: today,
            checkinTime: checkIn,
            status: 'Present',
            isLate: checkIn > lateThreshold
        });

        await newRecord.save();
        res.status(201).json(newRecord);
    } catch (error) {
        console.error('Error marking attendance:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getEmployeeAttendance = async (req, res) => {
    const userId = req.user.id;
    try {
        const records = await Attendance.find({ employeeId: userId })
        res.status(200).json(records);
    } catch (error) {
        console.error('Error fetching attendance records:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

//get attendance for all employees for a specific date
exports.getAllAttendance = async (req, res) => {
    const { date } = req.query;

    const filter = {};

    if (date) {
        filter.date = new Date(date).toISOString().split('T')[0];
    }

    const records = await Attendance.find(filter).populate('employeeId', 'name email');
    res.json(records);
};

// get attendance of a perticular employee for a specific date by hr
exports.getEmployeeAttendanceByDate = async (req, res) => {
    try {
        const { employeeId, date } = req.query;

        if (!employeeId || !date) {
            return res.status(400).json({ message: 'Employee ID and date are required' });
        }

        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({ message: 'Invalid employee ID format' });
        }

        const userExists = await User.findById(employeeId);
        if (!userExists) {
            return res.status(404).json({ message: 'Employee not found or Employee id incorrect' });
        }

        const record = await Attendance.findOne({
            employeeId,
            date: new Date(date).toISOString().split('T')[0]
        }).populate('employeeId', 'name email');

        if (!record) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }

        res.status(200).json(record);
    } catch (error) {
        console.error('Error fetching employee attendance by date:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
