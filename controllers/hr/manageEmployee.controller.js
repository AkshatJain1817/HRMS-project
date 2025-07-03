const User = require('../../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerEmployee = async (req, res) => {
    console.log("req.body:", req.body)

    const { email, password } = req.body;
    try {
        const existingEmployee = await User.findOne({ email, role: 'employee' });
        if (existingEmployee) {
            return res.status(400).json({ message: 'Employee already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const employee = new User({
            email,
            password: hashedPassword,
            role: 'employee',
            isnewEmployee: true,
        });

        await employee.save();
        res.status(201).json({
            message: 'Employee registered successfully',
            employee: {
                _id: employee._id,
                email: employee.email,
                role: employee.role
            }
        });
    } catch (error) {
        console.error('Error registering employee:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}