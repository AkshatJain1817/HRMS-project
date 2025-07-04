const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'hr', 'employee'],
        default: 'employee',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    department: {
        type: String,
        default: 'General',
    },
    position: {
        type: String,
        default: 'Staff',
    },
    isnewEmployee: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    onLeave: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LeaveRequest',
        default: null,
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
