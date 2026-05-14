const Invoice = require("../models/Invoice");
const PurchaseOrder = require("../models/PurchaseOrder");
const ReceivingReport = require("../models/ReceivingReport");
const multer = require("multer");
const path = require("path");

// Mock AI extraction function
async function extractInvoiceData(filePath) {
  // In real implementation, call AWS Textract or Azure Document Intelligence
  // For demo, return mock data
  return {
    invoice_id: "INV-12345",
    vendor_name: "Tech Supplies Inc.",
    date: new Date("2023-10-01"),
    total_amount: 2500.00,
    line_items: [
      { description: "Macbook Pro 14-inch", qty: 2, unit_price: 1200.00 },
      { description: "Wireless Mouse", qty: 5, unit_price: 25.00 }
    ],
    ai_confidence_scores: {
      overall: 0.95,
      fields: {
        invoice_id: 0.98,
        vendor_name: 0.97,
        date: 0.99,
        total_amount: 0.96,
        line_items: 0.92
      }
    }
  };
}

// Fuzzy matching function
function fuzzyMatch(str1, str2, threshold = 0.8) {
  // Simple implementation using Levenshtein distance
  const levenshtein = (a, b) => {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    const distance = matrix[b.length][a.length];
    const maxLen = Math.max(a.length, b.length);
    return (maxLen - distance) / maxLen;
  };

  return levenshtein(str1.toLowerCase(), str2.toLowerCase()) >= threshold;
}

// Matching logic
async function performThreeWayMatch(extractedData, purchaseOrderId) {
  const po = await PurchaseOrder.findById(purchaseOrderId).populate('supplier');
  if (!po) throw new Error('Purchase Order not found');

  const receiving = await ReceivingReport.findOne({ purchase_order: purchaseOrderId });
  if (!receiving) throw new Error('Receiving Report not found');

  const discrepancies = [];
  let status = 'matched';

  for (const item of extractedData.line_items) {
    // Find matching PO item
    const poItem = po.items.find(poItem => fuzzyMatch(item.description, poItem.description));
    if (!poItem) {
      discrepancies.push({
        item: item.description,
        reason: 'No matching item in Purchase Order',
        expected: 'Item in PO',
        actual: item.description
      });
      status = 'discrepancy';
      continue;
    }

    // Check quantity against received
    const receivedItem = receiving.received_items.find(rec => fuzzyMatch(item.description, rec.description));
    if (!receivedItem || item.qty > receivedItem.qty_received) {
      discrepancies.push({
        item: item.description,
        reason: 'Quantity exceeds received amount',
        expected: receivedItem ? receivedItem.qty_received : 0,
        actual: item.qty
      });
      status = 'discrepancy';
    }

    // Check price
    if (item.unit_price > poItem.unit_price) {
      discrepancies.push({
        item: item.description,
        reason: 'Unit price exceeds PO price',
        expected: poItem.unit_price,
        actual: item.unit_price
      });
      status = 'discrepancy';
    }
  }

  return { status, discrepancies };
}

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

const uploadInvoice = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const purchaseOrderId = req.body.purchaseOrderId;

    // Create invoice record
    const invoice = new Invoice({
      file_path: filePath,
      purchase_order_id: purchaseOrderId,
      status: 'processing'
    });
    await invoice.save();

    // Async processing
    setTimeout(async () => {
      try {
        const extractedData = await extractInvoiceData(filePath);
        const matchingResults = await performThreeWayMatch(extractedData, purchaseOrderId);

        invoice.invoice_id = extractedData.invoice_id;
        invoice.vendor_name = extractedData.vendor_name;
        invoice.date = extractedData.date;
        invoice.total_amount = extractedData.total_amount;
        invoice.line_items = extractedData.line_items;
        invoice.ai_confidence_scores = extractedData.ai_confidence_scores;
        invoice.matching_results = matchingResults;
        invoice.status = matchingResults.status;

        await invoice.save();
      } catch (error) {
        console.error('Processing error:', error);
        invoice.status = 'discrepancy'; // Or handle error status
        await invoice.save();
      }
    }, 2000); // Simulate async processing

    res.status(201).json({
      message: 'Invoice uploaded and processing started',
      invoiceId: invoice._id
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().populate('purchase_order_id');
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const verifyInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const invoice = await Invoice.findByIdAndUpdate(id, {
      ...updates,
      status: 'verified'
    }, { new: true });

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { uploadInvoice, getInvoices, verifyInvoice, upload };