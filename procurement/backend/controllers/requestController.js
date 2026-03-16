const ProcurementRequest = require("../models/ProcurementRequest");

// CREATE REQUEST
const createRequest = async (req, res) => {

  try {

    const request = new ProcurementRequest(req.body);

    await request.save();

    res.status(201).json({
      message: "Request created successfully",
      request
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }

};


// GET REQUESTS
const getRequests = async (req, res) => {

  try {

    const requests = await ProcurementRequest.find();

    res.json(requests);

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }

};

module.exports = { createRequest, getRequests };