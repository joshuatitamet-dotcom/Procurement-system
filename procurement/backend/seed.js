const mongoose = require("mongoose");
const PurchaseOrder = require("./models/PurchaseOrder");
const ReceivingReport = require("./models/ReceivingReport");
const Supplier = require("./models/Supplier");
const ProcurementRequest = require("./models/ProcurementRequest");
require("dotenv").config();

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/procurement");

    // Create sample supplier
    const supplier = await Supplier.findOneAndUpdate(
      { name: "Tech Supplies Inc." },
      { name: "Tech Supplies Inc.", contact: "contact@techsupplies.com" },
      { upsert: true, new: true }
    );

    // Create sample request
    const request = new ProcurementRequest({
      itemName: "Laptops and Accessories",
      quantity: 7,
      department: "IT"
    });
    await request.save();

    // Create sample PO
    const po = new PurchaseOrder({
      request: request._id,
      supplier: supplier._id,
      items: [
        { description: "Macbook Pro 14-inch", qty: 2, unit_price: 1200.00 },
        { description: "Wireless Mouse", qty: 5, unit_price: 25.00 }
      ]
    });
    await po.save();

    // Create receiving report
    const receiving = new ReceivingReport({
      purchase_order: po._id,
      received_items: [
        { description: "Macbook Pro 14-inch", qty_received: 2 },
        { description: "Wireless Mouse", qty_received: 4 } // Less than ordered to test discrepancy
      ]
    });
    await receiving.save();

    console.log("Sample data seeded successfully");
    console.log("PO ID:", po._id);
    console.log("Supplier ID:", supplier._id);

  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    mongoose.disconnect();
  }
}

seedData();