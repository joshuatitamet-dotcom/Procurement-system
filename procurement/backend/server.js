const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());

/* DATABASE */
mongoose.connect("mongodb://127.0.0.1:27017/procurement")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => {
    console.log("❌ MongoDB Connection Failed:", err.message);
    console.log("⚠️  Server will start without database connection");
    console.log("💡 To fix: Install MongoDB or use MongoDB Atlas");
  });

/* ROUTES */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/suppliers", require("./routes/supplierRoutes"));
app.use("/api/requests", require("./routes/requestRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

/* ✅ DASHBOARD API (ADD HERE) */
app.get("/api/dashboard", async (req, res) => {
  try {
    const Supplier = require("./models/Supplier");
    const Request = require("./models/ProcurementRequest");
    const Order = require("./models/PurchaseOrder");

    const suppliers = await Supplier.countDocuments();
    const requests = await Request.countDocuments();
    const orders = await Order.countDocuments();
    const pending = await Request.countDocuments({ status: "Pending" });

    res.json({
      suppliers,
      requests,
      orders,
      pending
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

/* TEST ROUTE */
app.get("/", (req, res) => {
  res.send("API running...");
});

/* SERVER */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});