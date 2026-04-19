const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Staff'], default: 'Staff' },
  name: String,
  phone: String,
});

const InventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String },
  quantity: { type: Number, default: 0 },
  supplier: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const MessageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  senderRole: String,
  status: { type: String, default: 'Unread' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = {
  User: mongoose.model('User', UserSchema),
  Inventory: mongoose.model('Inventory', InventorySchema),
  Message: mongoose.model('Message', MessageSchema)
};
