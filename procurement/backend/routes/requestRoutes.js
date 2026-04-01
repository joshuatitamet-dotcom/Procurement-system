const express = require("express");
const router = express.Router();

const { createRequest, getRequests } = require("../controllers/requestController");

router.post("/", createRequest);
router.get("/", getRequests);
router.put("/:id", async (req, res) => {
  try {
    const Request = require("../models/ProcurementRequest");

    const updated = await Request.findByIdAndUpdate(
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
    const Request = require("../models/ProcurementRequest");

    await Request.findByIdAndDelete(req.params.id);

    res.json({ message: "Request deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
