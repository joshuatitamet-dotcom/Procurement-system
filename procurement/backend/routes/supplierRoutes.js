const express = require("express");
const router = express.Router();

const { createSupplier, getSuppliers } = require("../controllers/supplierController");

/* FIXED ROUTES */
router.post("/", createSupplier);
router.get("/", getSuppliers);
router.put("/:id", async (req, res) => {
  try {
    const Supplier = require("../models/Supplier");

    const updated = await Supplier.findByIdAndUpdate(
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
    const Supplier = require("../models/Supplier");
    const Order = require("../models/PurchaseOrder");
    const Request = require("../models/ProcurementRequest");

    await Supplier.findByIdAndDelete(req.params.id);
    await Order.deleteMany({ supplier: req.params.id });
    await Request.deleteMany({ supplier: req.params.id });

    res.json({ message: "Supplier and related data deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
