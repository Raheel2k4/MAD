const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Loads .env variables

const MenuItem = require('./models/menuItem'); // Import the model

const app = express();
const PORT = 3000;

// === Middleware ===
app.use(cors()); // Enable CORS as required
app.use(express.json()); // To parse JSON bodies

// === MongoDB Connection ===
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    // This is the required success message
    console.log("Success: Connected to MongoDB");
    
    // Start the server ONLY after a successful DB connection
    app.listen(PORT, () => {
      // This is the required server running message
      console.log(`Coffee shop server running on port ${PORT}`);
    });
  })
  .catch(err => {
    // This is the required failure message
    console.error("MongoDB connection failed: [no response]", err.message);
    process.exit(1); // Exit if we can't connect to the DB
  });

// === Required Endpoints ===

/**
 * 1. GET /menu
 * Get all menu items from the database
 */
app.get('/menu', async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items); // Return proper JSON response
  } catch (error) {
    // Graceful error handling
    res.status(500).json({ message: "Error fetching menu", error: error.message });
  }
});

/**
 * 2. GET /menu/random
 * Get one random item where inStock = true
 */
app.get('/menu/random', async (req, res) => {
  try {
    // We use the aggregation pipeline to efficiently get a random item
    const randomItem = await MenuItem.aggregate([
      { $match: { inStock: true } }, // Find items where inStock is true
      { $sample: { size: 1 } }      // Get 1 random sample
    ]);

    if (randomItem.length === 0) {
      // Handle case where no items are in stock
      return res.status(404).json({ message: "No items are currently in stock." });
    }
    
    res.json(randomItem[0]); // $sample returns an array, so we send the first element
  } catch (error) {
    // Graceful error handling
    res.status(500).json({ message: "Error fetching random item", error: error.message });
  }
});

/**
 * 3. GET /menu/:id
 * Get a single menu item by its ID
 */
app.get('/menu/:id', async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from the URL
    
    // Check if it's a valid MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid item ID" });
    }

    const item = await MenuItem.findById(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    
    res.json(item); // Return the single item
  } catch (error) {
    // Graceful error handling
    res.status(500).json({ message: "Error fetching item", error: error.message });
  }
});