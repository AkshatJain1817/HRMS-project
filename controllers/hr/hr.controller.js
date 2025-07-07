const User = require('../../models/user.model')

exports.getnewEmployees = async (req, res) => {
    //time for which a employee is considered new
    const newEmployeeDuration = 30 * 24 * 60 * 60 * 1000;
    try{
        const newEmployees = await User.find({
            isnewEmployee: true,
            createdAt: { $gte: new Date(Date.now() - newEmployeeDuration) }
        })
        if (newEmployees.length === 0) {
            return res.status(404).json({ message: 'No new employees found' });
        }
        res.status(200).json({
            message: 'New employees retrieved successfully',
            newEmployees: newEmployees.map(employee => ({
                _id: employee._id,
                name: employee.name,
                email: employee.email,
                department: employee.department,
                position: employee.position,
                createdAt: employee.createdAt
            }))
        });
    } catch (error) {
        console.error('Error retrieving new employees:', error);
        res.status(500).json({ message: 'Internal server error' });
    }  
}

exports.getNumberOfNewEmployees = async (req, res) => {
    const newEmployeeDuration = 30 * 24 * 60 * 60 * 1000;
    try{
        const count = await User.countDocuments({
            isnewEmployee:true,
            createdAt: { $gte: new Date(Date.now() - newEmployeeDuration) }
        })
        res.status(200).json({
            message: 'Count of new employees retrieved successfully',
            count: count
        });
    }catch (error) {
        console.error('Error retrieving count of new employees:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

//get all employees
exports.getallemployees = async (req, res) => {
    try{
        const employees = await User.find({ role: 'employee' }).select('-password -__v');
        if(employees.length === 0){
            return res.status(404).json({ message: 'No employees found' });
        }
        res.status(200).json({
            message: 'Employees retrieved successfully',
            employees: employees.map(employee => ({
                _id: employee._id,
                name: employee.name,
                email: employee.email,
                department: employee.department,
                position: employee.position,
                createdAt: employee.createdAt
            }))
        });
    }catch (error) {
        console.error('Error retrieving employees:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

//get count of all employees
exports.getNumberOfAllEmployees = async (req,res) => {
    try{
        const count = await User.countDocuments({ role: 'employee' });
        res.status(200).json({
            message: 'Count of all employees retrieved successfully',
            count: count
        });
    }catch (error) {
        console.error('Error retrieving count of all employees:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Get all employees currently on leave
exports.getAllEmployeesOnLeave = async (req, res) => {
  try {
    const employeesOnLeave = await User.find({ onLeave: { $ne: null } }).select('-password -__v');

    if (employeesOnLeave.length === 0) {
      return res.status(404).json({ message: 'No employees on leave found' });
    }

    res.status(200).json({
      message: 'Employees on leave retrieved successfully',
      employeesOnLeave: employeesOnLeave.map(employee => ({
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        department: employee.department,
        position: employee.position,
        createdAt: employee.createdAt
      }))
    });
  } catch (error) {
    console.error('Error retrieving employees on leave:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


//get count of all employees who are on leave
exports.getNumberOfEmployeesOnLeave = async (req, res) => {
  try {
    const count = await User.countDocuments({ onLeave: { $ne: null } });

    res.status(200).json({
      message: 'Count retrieved successfully',
      count
    });
  } catch (error) {
    console.error('Error retrieving count of employees on leave:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
