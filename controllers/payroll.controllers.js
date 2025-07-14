const User = require('../models/user.model');
const Attendance = require('../models/attendance.model');
const Payroll = require('../models/payroll.model');

exports.generatePayroll = async (req, res) => {
    try {
        const { email, month, year, salary, bonus = 0 } = req.body;

        if (!email || !month || !year || !salary) {
            return res.status(400).json({ message: 'Email, salary, month, and year are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User with given email not found' });
        }


        const employeeId = user._id;
        const startDate = new Date(`${year}-${month}-01`);
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0); // end of month

        const attendanceRecords = await Attendance.find({
            employeeId,
            date: {
                $gte: startDate.toISOString().split('T')[0],
                $lte: endDate.toISOString().split('T')[0]
            }
        });

        const totalDays = endDate.getDate();
        const presentDays = attendanceRecords.filter(a => a.status === 'Present').length;
        const absentDays = totalDays - presentDays;
        const lateDays = attendanceRecords.filter(a => a.isLate).length;

        const perDaySalary = salary / totalDays;
        const latePenalty = lateDays * 50;
        const totalDeductions = latePenalty;

        const netSalary = Math.round((perDaySalary * presentDays) + bonus - totalDeductions);

        const payroll = new Payroll({
            employeeId,
            month: `${month}-${year}`,
            baseSalary: salary,
            presentDays,
            absentDays,
            lateDays,
            totalWorkingDays: totalDays,
            bonus,
            deductions: totalDeductions,
            netSalary
        });

        const payrollExists = await Payroll.findOne({
            employeeId,
            month: `${month}-${year}`
        });

        if (payrollExists) {
            return res.status(400).json({ message: 'Payroll for this month already exists' });
        }

        await payroll.save();

        res.status(201).json({
            message: 'Payroll generated successfully',
            payroll
        });

    } catch (error) {
        console.error('Error generating payroll:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.getPayroll = async (req, res) => {
    try {
        const { employeeId, month, year } = req.params;
        console.log('Looking for payroll with:', {
            employeeId,
            month: `${month}-${year}`
        });



        if (!employeeId || !month || !year) {
            return res.status(400).json({ message: 'Employee ID, month, and year are required' });
        }

        const user = await User.findById(employeeId);
        if (!user) {
            return res.status(404).json({ message: 'User with given email not found' });
        }

        const payroll = await Payroll.findOne({
            employeeId: user.id,
            month: `${month}-${year}`
        }).populate('employeeId', 'name email');

        if (!payroll) {
            return res.status(404).json({ message: 'Payroll record not found for the specified month' });
        }

        res.status(200).json(payroll);
    } catch (error) {
        console.error('Error fetching payroll:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getAllPayrolls = async (req, res) => {
    try {
        const payrolls = await Payroll.find().populate('employeeId', 'name email');
        res.status(200).json(payrolls);
    } catch (error) {
        console.error('Error fetching payrolls:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};