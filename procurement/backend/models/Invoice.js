const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
  invoice_id: {
    type: String,
    required: true
  },
  vendor_name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  total_amount: {
    type: Number,
    required: true
  },
  line_items: [{
    description: { type: String, required: true },
    qty: { type: Number, required: true },
    unit_price: { type: Number, required: true }
  }],
  ai_confidence_scores: {
    overall: { type: Number, default: 0 },
    fields: {
      invoice_id: { type: Number, default: 0 },
      vendor_name: { type: Number, default: 0 },
      date: { type: Number, default: 0 },
      total_amount: { type: Number, default: 0 },
      line_items: { type: Number, default: 0 }
    }
  },
  matching_results: {
    status: { type: String, enum: ['matched', 'discrepancy'], default: 'matched' },
    discrepancies: [{
      item: String,
      reason: String,
      expected: String,
      actual: String
    }]
  },
  status: {
    type: String,
    enum: ['processing', 'matched', 'discrepancy', 'verified'],
    default: 'processing'
  },
  file_path: {
    type: String
  },
  purchase_order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PurchaseOrder'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Invoice", InvoiceSchema);