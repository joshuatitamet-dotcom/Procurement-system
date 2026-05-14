const mongoose = require("mongoose");

const ReceivingReportSchema = new mongoose.Schema({
  purchase_order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PurchaseOrder",
    required: true
  },
  received_items: [{
    description: { type: String, required: true },
    qty_received: { type: Number, required: true }
  }],
  status: {
    type: String,
    default: "Received"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("ReceivingReport", ReceivingReportSchema);