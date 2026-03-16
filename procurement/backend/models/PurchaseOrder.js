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