import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { Inventory } from './models/Inventory.js';
import { User } from './models/User.js';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

// Define Pizza Preset Schema
const presetPizzaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, enum: ['Veg', 'Non-Veg', 'Exotic', 'Classic'], default: 'Veg' },
  image: { type: String, default: '' },
  badge: { type: String, default: '' }
}, { timestamps: true });

export const PresetPizza = mongoose.models.PresetPizza || mongoose.model('PresetPizza', presetPizzaSchema);

// Auto-seed Database on Startup
connectDB().then(async () => {
  try {
    // 1. Ensure Default Admin
    const existingAdmin = await User.findOne({ email: 'admin@pizzadelivery.com' });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Admin@123456', salt);
      await User.create({
        name: 'System Admin',
        email: 'admin@pizzadelivery.com',
        password: hashedPassword,
        role: 'admin',
        isVerified: true
      });
      console.log('Default admin seeded.');
    }

    // 2. Ensure Inventory Items
    const count = await Inventory.countDocuments();
    if (count === 0) {
      const defaultItems = [
        { name: 'Classic Hand Tossed', category: 'base', price: 120, stock: 50 },
        { name: 'Thin Crust', category: 'base', price: 140, stock: 40 },
        { name: 'Cheese Burst', category: 'base', price: 180, stock: 35 },
        { name: 'Whole Wheat Thin', category: 'base', price: 150, stock: 30 },
        { name: 'Classic Marinara', category: 'sauce', price: 30, stock: 60 },
        { name: 'Spicy Peri Peri', category: 'sauce', price: 40, stock: 50 },
        { name: 'Creamy Garlic Parmesan', category: 'sauce', price: 45, stock: 40 },
        { name: 'Smoky BBQ Sauce', category: 'sauce', price: 40, stock: 30 },
        { name: 'Mozzarella', category: 'cheese', price: 60, stock: 70 },
        { name: 'Cheddar Blend', category: 'cheese', price: 70, stock: 50 },
        { name: 'Feta & Ricotta', category: 'cheese', price: 85, stock: 25 },
        { name: 'Crisp Capsicum', category: 'veggie', price: 25, stock: 80 },
        { name: 'Red Onion', category: 'veggie', price: 20, stock: 90 },
        { name: 'Juicy Tomatoes', category: 'veggie', price: 20, stock: 75 },
        { name: 'Button Mushrooms', category: 'veggie', price: 35, stock: 40 },
        { name: 'Black Olives', category: 'veggie', price: 40, stock: 50 },
        { name: 'Spicy Jalapenos', category: 'veggie', price: 30, stock: 55 },
        { name: 'Sweet Golden Corn', category: 'veggie', price: 25, stock: 65 }
      ];
      await Inventory.insertMany(defaultItems);
      console.log('Inventory stock seeded.');
    }

    // 3. Ensure 25 Signature Pizzas
    const pizzaCount = await PresetPizza.countDocuments();
    if (pizzaCount === 0) {
      const standard25Pizzas = [
        { name: 'Margherita Royale', description: 'Crushed San Marzano tomatoes, fresh buffalo mozzarella, fragrant basil leaves.', price: 249, category: 'Classic', badge: 'Bestseller' },
        { name: 'Double Cheese Margherita', description: 'Loaded double layer of pure melted mozzarella with rich herb marinara.', price: 299, category: 'Classic', badge: 'Popular' },
        { name: 'Farmhouse Special', description: 'Crisp capsicum, red onions, diced ripe tomatoes, and tender button mushrooms.', price: 379, category: 'Veg', badge: 'Chef Choice' },
        { name: 'Peppy Paneer Tikka', description: 'Tandoori-spiced paneer cubes, crunchy bell peppers, and red paprika sprinkles.', price: 419, category: 'Veg', badge: 'Trending' },
        { name: 'Mexican Green Wave', description: 'Mexican jalapeños, sweet golden corn, red onion, and spicy herbs on cheddar.', price: 389, category: 'Exotic', badge: 'Spicy' },
        { name: 'Deluxe Veggie Feast', description: 'Black olives, baby mushrooms, golden corn, capsicum, and paneer chunks.', price: 449, category: 'Veg', badge: 'Loaded' },
        { name: 'Veggie Paradise', description: 'Golden corn, black olives, capsicum, red paprika, and creamy garlic drizzle.', price: 399, category: 'Veg' },
        { name: 'Paneer Makhani Crunch', description: 'Rich makhani sauce base topped with butter paneer cubes and capsicum.', price: 439, category: 'Veg', badge: 'Fusion' },
        { name: 'Quattro Formaggi (4-Cheese)', description: 'Mozzarella, yellow cheddar, parmesan, and creamy ricotta on olive oil crust.', price: 499, category: 'Exotic', badge: 'Gourmet' },
        { name: 'Spicy Peri Peri Paneer', description: 'Fiery African bird eye chili sauce, peri peri grilled cottage cheese, and onion.', price: 429, category: 'Veg', badge: 'Hot' },
        { name: 'Truffle Mushroom Supreme', description: 'Button and shiitake mushrooms, caramelized onions, drizzled with truffle essence.', price: 529, category: 'Exotic', badge: 'Premium' },
        { name: 'Mediterranean Olive & Feta', description: 'Greek feta cheese chunks, kalamata black olives, spinach leaves, and sundried tomatoes.', price: 489, category: 'Exotic' },
        { name: 'Fiery Jalapeno & Red Paprika', description: 'Pickled jalapeños, sweet fiery paprika, chili flakes, and ghost pepper sauce swirl.', price: 369, category: 'Veg', badge: 'Spicy' },
        { name: 'Sweet Corn & Cheese Melt', description: 'Double sweet American golden corn with triple molten mozzarella.', price: 289, category: 'Classic' },
        { name: 'Rustic Garlic Mushroom', description: 'Slow-roasted garlic cloves, button mushrooms, thyme leaves, and parmesan butter.', price: 399, category: 'Veg' },
        { name: 'Smoky BBQ Paneer Delight', description: 'Texas smoky barbecue glaze, BBQ grilled paneer, onions, and crisp peppers.', price: 429, category: 'Veg' },
        { name: 'Spinach & Artichoke Bianco', description: 'White garlic cream sauce, baby spinach, marinated artichoke hearts, mozzarella.', price: 499, category: 'Exotic' },
        { name: 'Sun-Dried Tomato & Basil Pesto', description: 'Fragrant basil pesto sauce base, tangy sundried tomatoes, and buffalo mozzarella.', price: 469, category: 'Exotic', badge: 'Chef Special' },
        { name: 'Capsicum & Crisp Onion Crunch', description: 'A timeless neighborhood favorite with extra crunchy green bell peppers and sliced onions.', price: 269, category: 'Classic' },
        { name: 'Indi Tandoori Wave', description: 'Mint mayonnaise swirl, tandoori marinara, red paprika, onions, and capsicum.', price: 389, category: 'Veg' },
        { name: 'Golden Pineapple Sweet Chilli', description: 'Caramelized pineapple pieces, jalapeño rings, chili flakes, and rich tomato sauce.', price: 379, category: 'Exotic' },
        { name: 'Zesty Jalapeno Popper', description: 'Stuffed cheese pocket crust topped with pickled jalapeños and cheddar melt.', price: 459, category: 'Exotic' },
        { name: 'Corn & Olive Garden', description: 'Sweet crunchy corn kernels paired with Spanish black olive rings on creamy marinara.', price: 349, category: 'Veg' },
        { name: 'Loaded Overload Veg Supreme', description: '7 distinct vegetable toppings with double cheese burst crust.', price: 549, category: 'Exotic', badge: 'Signature' },
        { name: 'Classic Tomato Herb Simple', description: 'Simple thin crust baked with herb tomato purée, oregano, and light shredded cheese.', price: 219, category: 'Classic' }
      ];
      await PresetPizza.insertMany(standard25Pizzas);
      console.log('25 Signature Preset Pizzas seeded.');
    }
  } catch (err) {
    console.error('Auto-seed warning:', err.message);
  }
});

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/orders', orderRoutes);

// Endpoint for 25 Standard Pizzas
app.get('/api/pizzas/preset', async (req, res) => {
  try {
    const pizzas = await PresetPizza.find().sort({ price: 1 });
    res.status(200).json({ success: true, count: pizzas.length, data: pizzas });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is operational' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});