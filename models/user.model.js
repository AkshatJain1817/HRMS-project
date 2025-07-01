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
    performanceReviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PerformanceReview',
    }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
