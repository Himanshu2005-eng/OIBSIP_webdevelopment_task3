import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Inventory } from '../models/Inventory.js';

dotenv.config();

const initialInventory = [
  // 5 Pizza Bases
  { name: 'Classic Thin Crust', category: 'base', stock: 50, threshold: 20, price: 120 },
  { name: 'Thick Pan Crust', category: 'base', stock: 45, threshold: 20, price: 140 },
  { name: 'Cheese Burst Crust', category: 'base', stock: 40, threshold: 20, price: 190 },
  { name: 'Whole Wheat Crust', category: 'base', stock: 35, threshold: 20, price: 150 },
  { name: 'Gluten-Free Crust', category: 'base', stock: 25, threshold: 15, price: 180 },

  // 5 Sauces
  { name: 'Classic Marinara', category: 'sauce', stock: 60, threshold: 20, price: 40 },
  { name: 'Spicy Peri-Peri', category: 'sauce', stock: 50, threshold: 20, price: 50 },
  { name: 'Creamy Garlic Alfredo', category: 'sauce', stock: 40, threshold: 20, price: 60 },
  { name: 'Smoky Barbecue', category: 'sauce', stock: 45, threshold: 20, price: 55 },
  { name: 'Basil Pesto', category: 'sauce', stock: 30, threshold: 15, price: 65 },

  // Cheese Options
  { name: 'Mozzarella', category: 'cheese', stock: 55, threshold: 20, price: 70 },
  { name: 'Cheddar', category: 'cheese', stock: 40, threshold: 20, price: 80 },
  { name: 'Parmesan', category: 'cheese', stock: 35, threshold: 15, price: 90 },
  { name: 'Vegan Mozzarella', category: 'cheese', stock: 25, threshold: 10, price: 95 },

  // Vegetable Options
  { name: 'Red Onions', category: 'veggie', stock: 80, threshold: 25, price: 25 },
  { name: 'Crispy Capsicum', category: 'veggie', stock: 75, threshold: 25, price: 25 },
  { name: 'Black Olives', category: 'veggie', stock: 60, threshold: 20, price: 35 },
  { name: 'Sliced Mushrooms', category: 'veggie', stock: 50, threshold: 20, price: 35 },
  { name: 'Sweet Corn', category: 'veggie', stock: 70, threshold: 25, price: 30 },
  { name: 'Jalapeños', category: 'veggie', stock: 65, threshold: 20, price: 30 },
  { name: 'Paneer Cubes', category: 'veggie', stock: 40, threshold: 20, price: 50 },
];

const seedInventory = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for inventory seeding...');

    // Clear previous inventory items to avoid duplicates
    await Inventory.deleteMany({});
    console.log('Cleared existing inventory items.');

    await Inventory.insertMany(initialInventory);
    console.log(`Successfully seeded ${initialInventory.length} inventory items!`);

    process.exit(0);
  } catch (error) {
    console.error(`Error seeding inventory: ${error.message}`);
    process.exit(1);
  }
};

seedInventory();