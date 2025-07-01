const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const createSuperAdmin = require('./utils/createSuperAdmin');
dotenv.config();
connectDB();
createSuperAdmin();

// Import routes
const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(cors());
app.use(express.json())

// Define routes
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});