"use client";

import { useEffect, useState } from "react";
import API_BASE_URL from "../config/api";
import DashboardShell from "../components/DashboardShell";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [editingInvoice, setEditingInvoice] = useState(null);

  const fetchInvoices = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/invoices`);
      const data = await res.json();
      setInvoices(data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  useEffect(() => {
    fetchInvoices();
    const interval = setInterval(fetchInvoices, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('invoiceFile', file);
    formData.append('purchaseOrderId', '69dcc3b373781eed0c650364'); // From seed data

    try {
      setUploadStatus('Uploading...');
      const res = await fetch(`${API_BASE_URL}/api/invoices/upload`, {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      setUploadStatus('Processing...');
      setTimeout(fetchInvoices, 3000); // Refresh after processing
    } catch (error) {
      setUploadStatus('Upload failed');
      console.error(error);
    }
  };

  const handleVerify = async (invoice) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/invoices/${invoice._id}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingInvoice),
      });
      await res.json();
      setSelectedInvoice(null);
      setEditingInvoice(null);
      fetchInvoices();
    } catch (error) {
      console.error(error);
    }
  };

  const getConfidenceColor = (score) => score < 0.9 ? 'text-red-500' : 'text-green-500';

  return (
    <DashboardShell
      eyebrow="Finance lane"
      title="Smart Invoicing"
      description="AI-powered invoice processing with three-way matching against POs and receiving reports."
      actions={
        <button
          className="dashboard-button dashboard-button--primary"
          onClick={fetchInvoices}
        >
          Refresh
        </button>
      }
    >
      <div className="p-6">
        {/* Upload Section */}
        <div className="mb-6 p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">Upload Invoice</h2>
          <input type="file" accept="image/*,application/pdf" onChange={handleFileUpload} />
          {uploadStatus && <p className="mt-2">{uploadStatus}</p>}
        </div>

        {/* Invoices List */}
        <div className="grid gap-4">
          {invoices.map((invoice) => (
            <div key={invoice._id} className="p-4 border rounded">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{invoice.invoice_id || 'Processing...'}</h3>
                  <p>Vendor: {invoice.vendor_name || 'N/A'}</p>
                  <p>Status: <span className={`font-semibold ${
                    invoice.status === 'matched' ? 'text-green-500' :
                    invoice.status === 'discrepancy' ? 'text-red-500' :
                    'text-yellow-500'
                  }`}>{invoice.status}</span></p>
                  {invoice.ai_confidence_scores?.overall && (
                    <p>AI Confidence: <span className={getConfidenceColor(invoice.ai_confidence_scores.overall)}>
                      {(invoice.ai_confidence_scores.overall * 100).toFixed(1)}%
                    </span></p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedInvoice(invoice)}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                  disabled={invoice.status === 'processing'}
                >
                  Review
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Verification Modal */}
        {selectedInvoice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded max-w-2xl w-full max-h-96 overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Verify Invoice</h2>

              <div className="mb-4">
                <label className="block font-semibold">Invoice ID</label>
                <input
                  type="text"
                  value={editingInvoice?.invoice_id || selectedInvoice.invoice_id}
                  onChange={(e) => setEditingInvoice({...editingInvoice, invoice_id: e.target.value})}
                  className={`w-full p-2 border rounded ${getConfidenceColor(selectedInvoice.ai_confidence_scores?.fields?.invoice_id)}`}
                />
              </div>

              <div className="mb-4">
                <label className="block font-semibold">Vendor Name</label>
                <input
                  type="text"
                  value={editingInvoice?.vendor_name || selectedInvoice.vendor_name}
                  onChange={(e) => setEditingInvoice({...editingInvoice, vendor_name: e.target.value})}
                  className={`w-full p-2 border rounded ${getConfidenceColor(selectedInvoice.ai_confidence_scores?.fields?.vendor_name)}`}
                />
              </div>

              <div className="mb-4">
                <label className="block font-semibold">Date</label>
                <input
                  type="date"
                  value={editingInvoice?.date || selectedInvoice.date?.split('T')[0]}
                  onChange={(e) => setEditingInvoice({...editingInvoice, date: e.target.value})}
                  className={`w-full p-2 border rounded ${getConfidenceColor(selectedInvoice.ai_confidence_scores?.fields?.date)}`}
                />
              </div>

              <div className="mb-4">
                <label className="block font-semibold">Total Amount</label>
                <input
                  type="number"
                  value={editingInvoice?.total_amount || selectedInvoice.total_amount}
                  onChange={(e) => setEditingInvoice({...editingInvoice, total_amount: parseFloat(e.target.value)})}
                  className={`w-full p-2 border rounded ${getConfidenceColor(selectedInvoice.ai_confidence_scores?.fields?.total_amount)}`}
                />
              </div>

              <h3 className="font-semibold mb-2">Line Items</h3>
              {selectedInvoice.line_items?.map((item, index) => (
                <div key={index} className="mb-2 p-2 border rounded">
                  <input
                    type="text"
                    value={editingInvoice?.line_items?.[index]?.description || item.description}
                    onChange={(e) => {
                      const newItems = [...(editingInvoice?.line_items || selectedInvoice.line_items)];
                      newItems[index].description = e.target.value;
                      setEditingInvoice({...editingInvoice, line_items: newItems});
                    }}
                    className={`w-full p-1 border rounded mb-1 ${getConfidenceColor(selectedInvoice.ai_confidence_scores?.fields?.line_items)}`}
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Qty"
                      value={editingInvoice?.line_items?.[index]?.qty || item.qty}
                      onChange={(e) => {
                        const newItems = [...(editingInvoice?.line_items || selectedInvoice.line_items)];
                        newItems[index].qty = parseInt(e.target.value);
                        setEditingInvoice({...editingInvoice, line_items: newItems});
                      }}
                      className="w-20 p-1 border rounded"
                    />
                    <input
                      type="number"
                      placeholder="Unit Price"
                      value={editingInvoice?.line_items?.[index]?.unit_price || item.unit_price}
                      onChange={(e) => {
                        const newItems = [...(editingInvoice?.line_items || selectedInvoice.line_items)];
                        newItems[index].unit_price = parseFloat(e.target.value);
                        setEditingInvoice({...editingInvoice, line_items: newItems});
                      }}
                      className="w-24 p-1 border rounded"
                    />
                  </div>
                </div>
              ))}

              {selectedInvoice.matching_results?.discrepancies?.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-red-500">Discrepancies</h3>
                  {selectedInvoice.matching_results.discrepancies.map((disc, idx) => (
                    <p key={idx} className="text-sm text-red-600">{disc.reason}: {disc.item}</p>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => handleVerify(selectedInvoice)}
                  className="px-4 py-2 bg-green-500 text-white rounded"
                >
                  Verify & Approve
                </button>
                <button
                  onClick={() => { setSelectedInvoice(null); setEditingInvoice(null); }}
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
