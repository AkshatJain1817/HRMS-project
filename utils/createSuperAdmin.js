const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

const createSuperAdmin = async () => {
    try{
        const existing = await User.findOne({ role: 'admin', email: process.env.SUPER_ADMIN_EMAIL });
        if (existing) {
            return;
        }

        const hashedPassword = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, 10);

        const superAdmin = new User({
            email: process.env.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            role: 'admin',
        })

        await superAdmin.save();
        console.log('Super Admin created successfully');

    } catch (error) {
        console.error('Error creating Super Admin:', error);
    }
}

module.exports = createSuperAdmin;