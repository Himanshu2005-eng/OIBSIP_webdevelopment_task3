import express from 'express';
import {
  getInventory,
  updateInventory,
  updateStock,
  addInventoryItem,
  deleteInventoryItem,
} from '../controllers/inventoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getInventory)
  .post(protect, admin, addInventoryItem);

router.route('/:id')
  .put(protect, admin, updateInventory)
  .patch(protect, admin, updateInventory)
  .delete(protect, admin, deleteInventoryItem);

export default router;