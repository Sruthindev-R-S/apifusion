/**
 * @fileoverview The main entry point for the Express application.
 */

const express = require('express');
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const config = require('./config/env');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = config.PORT;

// Enable CORS for frontend application
app.use(cors({
  origin: true, // Allow requests from any origin (e.g. localhost:5173, localhost:3002)
  credentials: true
}));

// Initialize Passport
require('./config/passport')(passport);

// Middleware to parse JSON bodies.
app.use(express.json());

// Middleware to parse cookies, required for JWT
app.use(cookieParser());

// Mount the Auth routes under the /auth prefix.
app.use('/auth', authRoutes);

// Mount the API routes under the /api prefix.
app.use('/api', apiRoutes);

// Basic error handling middleware.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// 404 handler for routes not found.
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app; // Export for testing purposes