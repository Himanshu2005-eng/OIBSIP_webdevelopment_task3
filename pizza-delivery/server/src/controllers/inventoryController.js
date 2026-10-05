import { Inventory } from '../models/Inventory.js';

// Get all inventory items
export const getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find().sort({ category: 1, name: 1 });
    res.status(200).json({ success: true, count: inventory.length, data: inventory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Increment stock or update item
export const updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock, price, name } = req.body;

    const updateData = {};
    if (price !== undefined) updateData.price = Number(price);
    if (name !== undefined) updateData.name = name;

    const updateQuery = {};

    // $inc increments remaining stock by the input amount
    if (stock !== undefined) {
      updateQuery.$inc = { stock: Number(stock) };
    }

    if (Object.keys(updateData).length > 0) {
      updateQuery.$set = updateData;
    }

    const updatedItem = await Inventory.findByIdAndUpdate(
      id,
      updateQuery,
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.status(200).json({ success: true, data: updatedItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Export alias so routes importing updateStock will not crash
export const updateStock = updateInventory;

// Add new item
export const addInventoryItem = async (req, res) => {
  try {
    const { name, category, price, stock } = req.body;

    const existingItem = await Inventory.findOne({ name });
    if (existingItem) {
      return res.status(400).json({ success: false, message: 'Item with this name already exists' });
    }

    const item = await Inventory.create({
      name,
      category,
      price: Number(price),
      stock: Number(stock) || 0,
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete item
export const deleteInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.status(200).json({ success: true, message: 'Item removed from inventory' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};