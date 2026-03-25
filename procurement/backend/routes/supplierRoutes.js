const express = require("express");
const router = express.Router();

const { createSupplier, getSuppliers } = require("../controllers/supplierController");

/* FIXED ROUTES */
router.post("/", createSupplier);
router.get("/", getSuppliers);
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

async function handleComplete(id) {

  try {
    const res = await fetch(`http://localhost:5000/api/orders/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status: "Completed" })
    });

    if (res.ok) {
      alert("Order Completed");

      window.location.href = "/dashboard";
    }

  } catch (err) {
    console.log(err);
    alert("Error updating order");
  }
}

module.exports = router;