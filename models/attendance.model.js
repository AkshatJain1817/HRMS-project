const mongoose = require('mongoose');
const { getAllEmployeesOnLeave } = require('../controllers/hr/hr.controller');

const attendanceSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: Date,
        required: true,
    },
    checkinTime: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['Present', 'Absent'],
        default: 'Present',
    },
    isLate: {
        type: Boolean,
        default: false,
    }
})

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;