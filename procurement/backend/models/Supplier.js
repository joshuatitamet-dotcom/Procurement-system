const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  phone: {
    type: String
  },

  status: {
    type: String,
    default: "Active"
  }

});

module.exports = mongoose.model("Supplier", SupplierSchema);