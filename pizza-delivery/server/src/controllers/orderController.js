import { Order } from '../models/Order.js';

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, deliveryAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      status: 'Received'
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get logged-in user's orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.base items.sauce items.cheese items.veggies');

    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Get all orders across the system
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.base items.sauce items.cheese items.veggies')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Update workflow status or payment status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify simulated payment
export const verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findByIdAndUpdate(
      orderId,
      { paymentStatus: 'completed' },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Daily EOD Settlement & History Cleanup
export const settleAndCleanDailyOrders = async (req, res) => {
  try {
    const completedOrders = await Order.find({
      status: 'Delivered',
      paymentStatus: 'completed'
    });

    const totalEarnings = completedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const totalPizzasSold = completedOrders.reduce((sum, o) => {
      const itemsCount = o.items?.reduce((itemSum, it) => itemSum + (it.quantity || 1), 0) || 0;
      return sum + itemsCount;
    }, 0);

    const todayDate = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    await Order.deleteMany({
      status: 'Delivered',
      paymentStatus: 'completed'
    });

    return res.status(200).json({
      success: true,
      summary: {
        date: todayDate,
        totalEarnings,
        totalPizzasSold,
        ordersCleared: completedOrders.length
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  verifyPayment,
  settleAndCleanDailyOrders,
};