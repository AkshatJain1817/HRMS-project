const User = require('../models/user.model');

// get self profile
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//get employee profile by id
exports.getEmployeeProfile = async (req, res) => {
    const { employeeId } = req.params;
    
    try {
        if (!employeeId) {
        return res.status(400).json({ message: 'Employee ID is required' });
        }
    
        const user = await User.findById(employeeId).select('-password');
        if (!user) return res.status(404).json({ message: 'Employee not found' });
    
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching employee profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// update self profile
exports.updateMyProfile = async (req, res) => {
  try {
    const allowedFields = ['name', 'phone', 'department', 'position'];
    const updates = {};

    for (let key of allowedFields) {
      if (req.body[key]) updates[key] = req.body[key];
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true }
    ).select('-password');

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
