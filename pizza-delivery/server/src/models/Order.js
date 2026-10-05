import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  name: { 
    type: String, 
    default: 'Custom Pizza' 
  },
  base: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Inventory' 
  },
  sauce: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Inventory' 
  },
  cheese: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Inventory' 
  },
  veggies: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Inventory' 
  }],
  price: { 
    type: Number, 
    required: true 
  },
  quantity: { 
    type: Number, 
    default: 1 
  }
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true
    },
    deliveryAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      zipCode: { type: String, required: true },
      phone: { type: String, required: true }
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    status: {
      type: String,
      enum: ['Received', 'In the Kitchen', 'Sent to Delivery', 'Delivered'],
      default: 'Received'
    },
    razorpayOrderId: {
      type: String
    }
  },
  { timestamps: true }
);

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);