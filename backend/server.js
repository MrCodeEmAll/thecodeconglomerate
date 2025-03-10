// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const firebase = require('./firebase.js');
const app = require('./app');

// Load environment variables from .env file
dotenv.config();

// Define the port for the server to listen on
const PORT = process.env.PORT || 5000;

// Get the MongoDB connection URI from environment variables
const MONGO_URI = process.env.MONGO_URI;

// Initialize Firebase (for real-time updates and notifications)
initializeFirebase();

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');

    // Start the server after successfully connecting to MongoDB
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    // Handle MongoDB connection errors
    console.error('Error connecting to MongoDB:', err.message);

    // Exit the process if MongoDB connection fails
    process.exit(1);
  });

// Handle unhandled promise rejections (e.g., database errors)
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);

  // Gracefully shut down the server
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions (e.g., syntax errors)
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);

  // Gracefully shut down the server
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM signal (e.g., when the process is terminated)
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');

  // Gracefully shut down the server
  server.close(() => {
    console.log('Server closed.');
  });
});