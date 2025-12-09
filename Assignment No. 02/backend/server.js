const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// --- Database Connection (Optimized for Serverless) ---
// Use an environment variable for the URI (crucial for deployment)
const MONGO_URI = process.env.MONGO_URI;

let isConnected = false; // Track connection status

const connectToDatabase = async () => {
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }

  console.log('Creating new database connection');
  try {
    const db = await mongoose.connect(MONGO_URI);
    isConnected = db.connections[0].readyState;
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

// Middleware to ensure DB connection on every request
app.use(async (req, res, next) => {
  await connectToDatabase();
  next();
});

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// ... (Rest of your server.js code: static files, routes, etc.)

// --- Start Server (Only for local development) ---
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running locally on port ${PORT}`);
    });
}

// Export the app for Vercel
module.exports = app;