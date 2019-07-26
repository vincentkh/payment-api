const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  payeeId: { type: String, required: true },
  payerId: { type: String, required: true },
  paymentSystem: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String },
  comment: { type: String },
  created: { type: Date },
  updated: { type: Date },
}, { versionKey: false });

module.exports = mongoose.model('Payment', PaymentSchema);