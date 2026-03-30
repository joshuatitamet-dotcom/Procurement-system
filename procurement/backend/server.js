require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const allowedOrigins = (
  process.env.CORS_ORIGINS ||
  [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://procurement-system-xfb1.vercel.app",
    "https://procurement-system-xfb1-6wkp1k68t.vercel.app",
    "https://procurement-system-jcuk.vercel.app"
  ].join(",")
)
  .split(",")
  .map(origin => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204
};

/* MIDDLEWARE */
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());

/* DATABASE */
const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/procurement";
mongoose.connect(mongoURI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => {
    console.log("❌ MongoDB Connection Failed:", err.message);
    console.log("⚠️  Server will start without database connection");
    console.log("💡 To fix: Set MONGODB_URI environment variable to MongoDB Atlas connection string");
  });

/* ROUTES */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/suppliers", require("./routes/supplierRoutes"));
app.use("/api/requests", require("./routes/requestRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

/* ✅ DASHBOARD API (ADD HERE) */
app.get("/api/dashboard", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        suppliers: 0,
        requests: 0,
        orders: 0,
        pending: 0,
        databaseConnected: false
      });
    }

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
      pending,
      databaseConnected: true
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/reports", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        summary: {
          totalSuppliers: 0,
          totalRequests: 0,
          totalOrders: 0,
          pendingRequests: 0,
          completedOrders: 0,
          approvedRequests: 0
        },
        requestsByStatus: [],
        ordersByStatus: [],
        requestsByDepartment: [],
        recentOrders: [],
        databaseConnected: false
      });
    }

    const Supplier = require("./models/Supplier");
    const Request = require("./models/ProcurementRequest");
    const Order = require("./models/PurchaseOrder");

    const [
      totalSuppliers,
      totalRequests,
      totalOrders,
      pendingRequests,
      completedOrders,
      approvedRequests,
      requestsByStatusRaw,
      ordersByStatusRaw,
      requestsByDepartmentRaw,
      recentOrdersRaw
    ] = await Promise.all([
      Supplier.countDocuments(),
      Request.countDocuments(),
      Order.countDocuments(),
      Request.countDocuments({ status: "Pending" }),
      Order.countDocuments({ status: "Completed" }),
      Request.countDocuments({ status: "Approved" }),
      Request.aggregate([
        { $group: { _id: "$status", value: { $sum: 1 } } },
        { $sort: { value: -1, _id: 1 } }
      ]),
      Order.aggregate([
        { $group: { _id: "$status", value: { $sum: 1 } } },
        { $sort: { value: -1, _id: 1 } }
      ]),
      Request.aggregate([
        { $group: { _id: "$department", value: { $sum: 1 } } },
        { $sort: { value: -1, _id: 1 } }
      ]),
      Order.find()
        .populate("supplier", "name")
        .populate("request", "itemName department quantity")
        .sort({ createdAt: -1 })
        .limit(6)
        .lean()
    ]);

    res.json({
      summary: {
        totalSuppliers,
        totalRequests,
        totalOrders,
        pendingRequests,
        completedOrders,
        approvedRequests
      },
      requestsByStatus: requestsByStatusRaw.map((item) => ({
        label: item._id || "Unknown",
        value: item.value
      })),
      ordersByStatus: ordersByStatusRaw.map((item) => ({
        label: item._id || "Unknown",
        value: item.value
      })),
      requestsByDepartment: requestsByDepartmentRaw.map((item) => ({
        label: item._id || "Unknown",
        value: item.value
      })),
      recentOrders: recentOrdersRaw.map((order) => ({
        id: order._id,
        supplier: order.supplier?.name || "N/A",
        item: order.request?.itemName || "N/A",
        department: order.request?.department || "N/A",
        quantity: order.request?.quantity || 0,
        status: order.status,
        createdAt: order.createdAt
      })),
      databaseConnected: true
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to load reports",
      error: err.message
    });
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
