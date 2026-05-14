const mongoose = require("mongoose");

const PurchaseOrderSchema = new mongoose.Schema({

  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProcurementRequest",
    required: true
  },

  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true
  },

  items: [{
    description: { type: String, required: true },
    qty: { type: Number, required: true },
    unit_price: { type: Number, required: true }
  }],

  status: {
    type: String,
    default: "Ordered"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("PurchaseOrder", PurchaseOrderSchema);