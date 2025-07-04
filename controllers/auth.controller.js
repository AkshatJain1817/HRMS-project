const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

exports.loginUser = async (req, res) => {
    const {email, password, role} = req.body;
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (role && user.role !== role) {
            return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        }

        res.status(200).json({
            _id: user._id,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role)
        });
    }catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}