const User = require('../../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerHR = async (req, res) => {
    console.log("req.body:", req.body)

    const { email, password} = req.body;
    try{
        const existingHr = await User.findOne({ email, role: 'hr' });
        if (existingHr) {
            return res.status(400).json({ message: 'HR already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const hr = new User({
            email,
            password: hashedPassword,
            role: 'hr'
        })

        await hr.save();
        res.status(201).json({
            message: 'HR registered successfully',
            hr: {
                _id: hr._id,
                email: hr.email,
                role: hr.role
            }
        });

    }catch (error) {
        console.error('Error registering HR:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}