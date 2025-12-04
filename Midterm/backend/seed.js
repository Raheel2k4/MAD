require('dotenv').config();
const mongoose = require('mongoose');
// Import your existing model from the models folder
const MenuItem = require('./models/menuItem');

// This data combines your seed.js images/prices with the descriptions from atlas-data.json
const items = [
  {
    "name": "Espresso",
    "category": "Hot Drinks",
    "price": 800.50,
    "inStock": true,
    "image": "https://img.freepik.com/free-photo/closeup-classic-fresh-espresso-served-dark-surface_1220-5375.jpg?semt=ais_hybrid&w=740&q=80",
    "description": "A strong and concentrated coffee, perfect for a quick energy boost."
  },
  {
    "name": "Cappuccino",
    "category": "Hot Drinks",
    "price": 550.50,
    "inStock": true,
    "image": "https://media.istockphoto.com/id/1045880988/photo/coffee-art-in-cup-closeup-of-hands-making-latte-art.jpg?s=612x612&w=0&k=20&c=dsQM2jUw-oz8CtaZYPiC0dL9uoOIH5Z86iH-UlTxYs0=",
    "description": "A classic coffee made with equal parts espresso, steamed milk, and foamed milk."
  },
  {
    "name": "Latte",
    "category": "Hot Drinks",
    "price": 900.00,
    "inStock": true,
    "image": "https://columbiametro.com/wp-content/uploads/2018/10/Latte.jpg",
    "description": "A smooth and creamy coffee with a single shot of espresso and plenty of steamed milk."
  },
  {
    "name": "Iced Coffee",
    "category": "Cold Drinks",
    "price": 800.00,
    "inStock": true,
    "image": "https://t3.ftcdn.net/jpg/03/16/01/48/360_F_316014817_EC1KN7mAD86ALYhhwGUUeSsQoJIVMtfQ.jpg",
    "description": "Our signature cold brew served over ice, offering a refreshing and bold coffee experience."
  },
  {
    "name": "Croissant",
    "category": "Pastries",
    "price": 700.50,
    "inStock": true,
    "image": "https://www.shutterstock.com/image-photo/freshly-baked-raisin-danish-pastry-600nw-2511360437.jpg",
    "description": "A buttery, flaky pastry, freshly baked daily to perfection."
  },
  {
    "name": "Muffin",
    "category": "Pastries",
    "price": 400.00,
    "inStock": false,
    "image": "https://media.istockphoto.com/id/516688047/photo/homemade-autumn-pumpkin-muffin.jpg?s=612x612&w=0&k=20&c=wbzrNN3oX-F4Q1rZJAeDLH9EKJfnHk9yyaJqIJbkV_U=",
    "description": "A soft, delicious muffin, baked with a rotating selection of seasonal fruits and flavors."
  }
];

/**
 * Connects to the DB, wipes the collection, and inserts the new items.
 */
async function seedData() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('Connection successful. Wiping old data...');
    await MenuItem.deleteMany({});
    console.log('Old data wiped.');

    console.log('Inserting new data...');
    await MenuItem.insertMany(items);
    console.log('Sample data inserted successfully!');

  } catch (err) {
    console.error('Error seeding data:', err.message);
  } finally {
    console.log('Disconnecting from database...');
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

// Run the script
seedData();
