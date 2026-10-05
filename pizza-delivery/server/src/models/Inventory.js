import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['base', 'sauce', 'cheese', 'veggie'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock count is required'],
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    threshold: {
      type: Number,
      default: 20, // Low-stock alert threshold
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Inventory = mongoose.model('Inventory', inventorySchema);