import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for admin seeding...');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@pizzadelivery.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log(`Admin user (${adminEmail}) already exists.`);
      process.exit(0);
    }

    const adminUser = new User({
      name: 'System Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      isVerified: true, // Pre-verified so you can log in immediately
    });

    await adminUser.save();
    console.log(`Admin account created successfully!`);
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);

    process.exit(0);
  } catch (error) {
    console.error(`Error seeding admin: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();