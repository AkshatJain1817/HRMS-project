const leaveRequest = require('../models/leaveRequest.model');
const User = require('../models/user.model');
const Attendance = require('../models/attendance.model');

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

        const leaveRequestData = await leaveRequest.findByIdAndUpdate(
            requestId,
            { status },
            { new: true }
        )

        if (!leaveRequestData) {
            return res.status(404).json({ message: 'Leave request not found' });
        }

        if (status === 'approved') {
            await User.findByIdAndUpdate(
                leaveRequestData.employeeId,
                { onLeave: leaveRequestData._id }
            )


            const from = new Date(leaveRequestData.startDate);
            const to = new Date(leaveRequestData.endDate);

            for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
                const dateOnly = new Date(d.toISOString().split('T')[0]);

                const alreadyExists = await Attendance.findOne({
                    employeeId: leaveRequestData.employeeId,
                    date: dateOnly
                });

                if (!alreadyExists) {
                    await Attendance.create({
                        employeeId: leaveRequestData.employeeId,
                        date: dateOnly,
                        status: 'Absent',
                        isLate: false,
                        reason: 'Leave'
                    });
                }
            }
        }

        res.status(200).json({
            message: 'Leave request status updated successfully',
            leaveRequest
        });
    } catch (error) {
        console.error('Error updating leave request status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

//employee can check their leave status old ones too
exports.getMyLeaveRequests = async (req, res) => {
    const employeeId = req.user.id;

    try {
        const leaveRequests = await leaveRequest.find({ employeeId })
            .populate({ path: 'employeeId', select: 'name email' });
        res.status(200).json(leaveRequests);
    } catch (error) {
        console.error('Error fetching my leave requests:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
