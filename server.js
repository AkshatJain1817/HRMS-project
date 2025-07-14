const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const createSuperAdmin = require('./utils/createSuperAdmin');
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

connectDB();
createSuperAdmin();

// Import routes
const authRoutes = require('./routes/auth.routes');
const superAdminRoutes = require('./routes/superAdmin.routes');
const hrRoutes = require('./routes/hr.routes');
const leaveRoutes = require('./routes/leave.routes');
const taskRoutes = require('./routes/task.routes');
const noteRoutes = require('./routes/notes.route');
const attendanceRoutes = require('./routes/attendance.routes');
const profileRoutes = require('./routes/profile.routes');
const performanceRoutes = require('./routes/performance.routes');
const payrollRoutes = require('./routes/payroll.routes');

// Define routes
app.use('/auth', authRoutes);
app.use('/super-admin', superAdminRoutes);
app.use('/hr', hrRoutes);
app.use('/payroll', payrollRoutes);
app.use('/performance', performanceRoutes);
app.use('/tasks', taskRoutes);
app.use('/leave', leaveRoutes);
app.use('/notes', noteRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/profile', profileRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});