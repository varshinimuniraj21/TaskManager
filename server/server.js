const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const noteRoutes = require('./routes/noteRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// CORS configuration
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static upload directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'TASKFLOW API is running smoothly' });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

let server;
const start = async () => {
  await connectDB();
  server = app.listen(PORT, () => {
    console.log(`[TASKFLOW Server] Running in ${process.env.NODE_ENV || 'development'} on port ${PORT}`);
  });
  return server;
};

// Start if executed directly
if (require.main === module) {
  start();
}

module.exports = { app, start };
