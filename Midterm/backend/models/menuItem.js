const mongoose = require('mongoose');

// This schema now matches your seed.js file
const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  // --- UPDATED THIS FIELD ---
  // Changed from 'imageUrl' to 'image'
  image: {
    type: String,
    required: false,
    default: 'https://placehold.co/600x400/F2F2F7/3C3C43?text=Skybrews'
  },
  // --- ADD THIS FIELD ---
  description: {
    type: String,
    required: false,
    default: 'A delightful treat from Skybrews Coffee.'
  }
  // -------------------------
});

// The third argument 'menu_items' forces this exact collection name
module.exports = mongoose.model('MenuItem', menuItemSchema, 'menu_items');