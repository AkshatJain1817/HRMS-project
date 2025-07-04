const leaveRequest = require('../models/leaveRequest.model');
const User = require('../models/user.model');

exports.applyLeave = async (req, res) => {
    const { startDate, endDate, reason } = req.body;
    const employeeId = req.user.id;

    try {
        if (new Date(startDate) >= new Date(endDate)) {
            return res.status(400).json({ message: 'End date must be after start date' });
        }

        const leaveRequestData = new leaveRequest({
            employeeId,
            startDate,
            endDate,
            reason
        });

        const savedLeaveRequest = await leaveRequestData.save();
        res.status(201).json(savedLeaveRequest);
    } catch (error) {
        console.error('Error applying for leave:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getLeaveRequests = async (req, res) => {
    try {
        const leaveRequests = await leaveRequest.find().populate({ path: 'employeeId', select: 'name email' });
        res.status(200).json(leaveRequests);
    } catch (error) {
        console.error('Error fetching leave requests:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

//update leave request status
exports.updateLeaveRequestStatus = async (req, res) => {
    const { requestId, status } = req.body;

    try {
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        const leaveRequestData = await leaveRequest.findByIdAndUpdate(requestId, { status }, { new: true });
        if (!leaveRequestData) {
            return res.status(404).json({ message: 'Leave request not found' });
        }
        res.status(200).json(leaveRequestData);
    } catch (error) {
        console.error('Error updating leave request status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
