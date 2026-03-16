const express = require("express");
const router = express.Router();

const { createSupplier, getSuppliers } = require("../controllers/supplierController");

router.post("/suppliers", createSupplier);
router.get("/suppliers", getSuppliers);

module.exports = router;