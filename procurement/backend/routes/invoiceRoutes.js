const express = require("express");
const { uploadInvoice, getInvoices, verifyInvoice, upload } = require("../controllers/invoiceController");

const router = express.Router();

router.post("/upload", upload.single('invoiceFile'), uploadInvoice);
router.get("/", getInvoices);
router.put("/:id/verify", verifyInvoice);

module.exports = router;