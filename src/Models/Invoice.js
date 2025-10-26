// models/Invoice.js
import mongoose from 'mongoose';

const invoiceItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  size: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: ''
  }
});

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    unique: true
  },
  type: {
    type: String,
    enum: ['stock_allocation', 'vendor_sale', 'stock_return', 'payment'],
    required: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  items: [invoiceItemSchema],
  subtotal: {
    type: Number,
    required: true
  },
  taxAmount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled'],
    default: 'Draft'
  },
  dueDate: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    }
  },
  paymentDate: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: String,
  terms: String
}, {
  timestamps: true
});

// ✅ PERFECT FIXED: Manual invoice number generation
invoiceSchema.methods.generateInvoiceNumber = async function() {
  try {
    const lastInvoice = await mongoose.model('Invoice')
      .findOne({}, {}, { sort: { 'createdAt': -1 } });
    
    let nextNumber = 1;
    if (lastInvoice && lastInvoice.invoiceNumber) {
      // Extract number from "INV-00001" format
      const matches = lastInvoice.invoiceNumber.match(/INV-(\d+)/);
      if (matches && matches[1]) {
        nextNumber = parseInt(matches[1]) + 1;
      }
    }
    
    return `INV-${String(nextNumber).padStart(5, '0')}`;
  } catch (error) {
    console.error('Error generating invoice number:', error);
    // Fallback using timestamp
    return `INV-${Date.now()}`;
  }
};

// ✅ FIXED: Pre-save hook that actually works
invoiceSchema.pre('save', async function(next) {
  try {
    // Only generate invoice number if it doesn't exist
    if (!this.invoiceNumber) {
      this.invoiceNumber = await this.generateInvoiceNumber();
    }
    next();
  } catch (error) {
    console.error('Error in pre-save hook:', error);
    // Ensure we always have an invoice number
    if (!this.invoiceNumber) {
      this.invoiceNumber = `INV-EMG-${Date.now()}`;
    }
    next();
  }
});

// ✅ Add index for better performance
invoiceSchema.index({ invoiceNumber: 1 });
invoiceSchema.index({ vendor: 1 });
invoiceSchema.index({ status: 1 });
invoiceSchema.index({ createdAt: -1 });

export default mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);