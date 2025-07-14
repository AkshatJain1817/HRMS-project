const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    month: String,
    baseSalary: Number,
    presentDays: Number,
    absentDays: Number,
    lateDays: Number,
    totalWorkingDays: Number,
    bonus: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    netSalary: Number,
    generatedAt: {
        type: Date,
        default: Date.now
    }
});

const Payroll = mongoose.model('Payroll', payrollSchema);
module.exports = Payroll;