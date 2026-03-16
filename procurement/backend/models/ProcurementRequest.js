const mongoose = require("mongoose");

const ProcurementRequestSchema = new mongoose.Schema({

  itemName: {
    type: String,
    required: true
  },

  quantity: {
    type: Number,
    required: true
  },

  department: {
    type: String,
    required: true
  },

  status: {
    type: String,
    default: "Pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("ProcurementRequest", ProcurementRequestSchema);