const Supplier = require("./models/supplier");
const Request = require("./models/request");
const Order = require("./models/order");

app.get("/api/dashboard", async (req, res) => {
  try {

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

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
