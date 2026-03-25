const express = require("express");
const router = express.Router();

const { createOrder, getOrders } = require("../controllers/orderController");

router.post("/", createOrder);
router.get("/", getOrders);
router.put("/:id", async (req, res) => {
  try {
    const Order = require("../models/PurchaseOrder");

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after" }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const Order = require("../models/PurchaseOrder");
    const Supplier = require("../models/Supplier");
    const Request = require("../models/ProcurementRequest");

    // Get the order to find linked supplier and request
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Delete the linked supplier
    if (order.supplier) {
      await Supplier.findByIdAndDelete(order.supplier);
    }

    // Delete the linked request
    if (order.request) {
      await Request.findByIdAndDelete(order.request);
    }

    // Delete the order itself
    await Order.findByIdAndDelete(req.params.id);

    res.json({ message: "Order and related items deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;