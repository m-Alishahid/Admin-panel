
// services/invoiceService.js - UPDATED
import api from '@/lib/api';

export const invoiceService = {
  // Get all invoices
  getAll: async (params = {}) => {
    const response = await api.get('/invoices', { params });
    return response.data;
  },

  // Get invoice by ID
  getById: async (id) => {
    const response = await api.get(`/invoices/${id}`);
    return response.data;
  },

  // Create invoice
  create: async (invoiceData) => {
    const response = await api.post('/invoices', invoiceData);
    return response.data;
  },

  // Update invoice
  update: async (id, invoiceData) => {
    const response = await api.put(`/invoices/${id}`, invoiceData);
    return response.data;
  },

  // Delete invoice
  delete: async (id) => {
    const response = await api.delete(`/invoices/${id}`);
    return response.data;
  },

  // Get vendor invoices
  getVendorInvoices: async (vendorId, params = {}) => {
    const response = await api.get(`/invoices/vendor/${vendorId}`, { params });
    return response.data;
  },

  // Get my invoices (for vendors)
  getMyInvoices: async (params = {}) => {
    const response = await api.get('/invoices/me', { params });
    return response.data;
  },
    // Get allocated products for vendor (for invoice creation)
  getAllocatedProducts: async (vendorId) => {
    const response = await api.get(`/vendors/${vendorId}/allocated-products`);
    return response.data;
  },

  // Update invoice status
  updateStatus: async (id, status) => {
    const response = await api.patch(`/invoices/${id}/status`, { status });
    return response.data;
  },

  // Record payment
  recordPayment: async (id, paymentData) => {
    const response = await api.post(`/invoices/${id}/payment`, paymentData);
    return response.data;
  },

  // Send invoice (email)
  sendInvoice: async (id) => {
    const response = await api.post(`/invoices/${id}/send`);
    return response.data;
  },

  // Download invoice as PDF
  downloadPDF: async (id) => {
    const response = await api.get(`/invoices/${id}/pdf`, {
      responseType: 'blob'
    });
    return response.data;
  }
};