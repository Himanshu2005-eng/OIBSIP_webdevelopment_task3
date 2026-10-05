import express from 'express';
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  verifyPayment,
  settleAndCleanDailyOrders
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Customer Endpoints
router.post('/create', protect, createOrder);
router.get('/my-orders', protect, getUserOrders);
router.post('/verify-payment', protect, verifyPayment);

// Admin Operations
router.get('/all', protect, admin, getAllOrders);
router.patch('/:id/status', protect, admin, updateOrderStatus);

// Admin EOD Settlement and Daily Cleanup
router.post('/admin/settle-day', protect, admin, settleAndCleanDailyOrders);

export default router;