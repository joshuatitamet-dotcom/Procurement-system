const PurchaseOrder = require("../models/PurchaseOrder");

const createOrder = async (req, res) => {

  try {

    const order = new PurchaseOrder(req.body);

    await order.save();

    res.status(201).json({
      message: "Purchase Order created",
      order
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }

};


const getOrders = async (req, res) => {

  try {

    const orders = await PurchaseOrder
      .find()
      .populate("supplier")
      .populate("request");

    res.json(orders);

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }

};

module.exports = { createOrder, getOrders };