import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { User } from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await User.deleteOne({ email: 'admin@pizzadelivery.com' });

    const admin = new User({
      name: 'System Admin',
      email: 'admin@pizzadelivery.com',
      password: 'Admin@123456',
      role: 'admin',
      isVerified: true,
    });

    await admin.save();
    console.log('Admin user created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error.message);
    process.exit(1);
  }
};

seed();
