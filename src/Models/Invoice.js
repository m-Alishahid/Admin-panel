// // models/Invoice.js
// import mongoose from 'mongoose';

// const invoiceItemSchema = new mongoose.Schema({
//   product: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Product',
//     required: true
//   },
//   productName: {
//     type: String,
//     required: true
//   },
//   quantity: {
//     type: Number,
//     required: true,
//     min: 1
//   },
//   unitPrice: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   totalPrice: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   size: {
//     type: String,
//     default: ''
//   },
//   color: {
//     type: String,
//     default: ''
//   }
// });

// const invoiceSchema = new mongoose.Schema({
//   invoiceNumber: {
//     type: String,
//     unique: true
//   },
//   type: {
//     type: String,
//     enum: ['stock_allocation', 'vendor_sale', 'stock_return', 'payment'],
//     required: true
//   },
//   vendor: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Vendor',
//     required: true
//   },
//   items: [invoiceItemSchema],
//   subtotal: {
//     type: Number,
//     required: true
//   },
//   taxAmount: {
//     type: Number,
//     default: 0
//   },
//   totalAmount: {
//     type: Number,
//     required: true
//   },
//   status: {
//     type: String,
//     enum: ['Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled'],
//     default: 'Draft'
//   },
//   dueDate: {
//     type: Date,
//     default: function() {
//       return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
//     }
//   },
//   paymentDate: Date,
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   notes: String,
//   terms: String
// }, {
//   timestamps: true
// });

// // ✅ PERFECT FIXED: Manual invoice number generation
// invoiceSchema.methods.generateInvoiceNumber = async function() {
//   try {
//     const lastInvoice = await mongoose.model('Invoice')
//       .findOne({}, {}, { sort: { 'createdAt': -1 } });
    
//     let nextNumber = 1;
//     if (lastInvoice && lastInvoice.invoiceNumber) {
//       // Extract number from "INV-00001" format
//       const matches = lastInvoice.invoiceNumber.match(/INV-(\d+)/);
//       if (matches && matches[1]) {
//         nextNumber = parseInt(matches[1]) + 1;
//       }
//     }
    
//     return `INV-${String(nextNumber).padStart(5, '0')}`;
//   } catch (error) {
//     console.error('Error generating invoice number:', error);
//     // Fallback using timestamp
//     return `INV-${Date.now()}`;
//   }
// };

// // ✅ FIXED: Pre-save hook that actually works
// invoiceSchema.pre('save', async function(next) {
//   try {
//     // Only generate invoice number if it doesn't exist
//     if (!this.invoiceNumber) {
//       this.invoiceNumber = await this.generateInvoiceNumber();
//     }
//     next();
//   } catch (error) {
//     console.error('Error in pre-save hook:', error);
//     // Ensure we always have an invoice number
//     if (!this.invoiceNumber) {
//       this.invoiceNumber = `INV-EMG-${Date.now()}`;
//     }
//     next();
//   }
// });

// // ✅ Add index for better performance
// invoiceSchema.index({ invoiceNumber: 1 });
// invoiceSchema.index({ vendor: 1 });
// invoiceSchema.index({ status: 1 });
// invoiceSchema.index({ createdAt: -1 });

// export default mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);



// models/Invoice.js - UPDATED WITH STOCK MANAGEMENT
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
    enum: ['Draft', 'Pending Approval', 'approved', 'Paid', 'Overdue', 'Cancelled', 'rejected'],
    default: 'Draft'
  },
  dueDate: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    }
  },
  paymentDate: Date,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  rejectionReason: String,
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

// ✅ UPDATE VENDOR STOCK METHOD
invoiceSchema.methods.updateVendorStock = async function() {
  try {
    const Vendor = mongoose.model('Vendor');
    const vendor = await Vendor.findById(this.vendor);
    
    if (!vendor) {
      throw new Error('Vendor not found');
    }

    for (const item of this.items) {
      const vendorProduct = vendor.products.find(p => 
        p.product.toString() === item.product.toString() &&
        p.size === item.size &&
        p.color === item.color
      );

      if (vendorProduct) {
        if (this.type === 'vendor_sale') {
          // For sales, reduce current stock and increase sold stock
          if (vendorProduct.currentStock < item.quantity) {
            throw new Error(`Insufficient stock for ${item.productName}. Available: ${vendorProduct.currentStock}, Requested: ${item.quantity}`);
          }
          
          vendorProduct.currentStock -= item.quantity;
          vendorProduct.soldStock += item.quantity;
          
          // Update total profit
          vendorProduct.totalProfit = vendorProduct.profitPerPiece * vendorProduct.soldStock;
        } else if (this.type === 'stock_allocation') {
          // For allocation, increase current stock
          vendorProduct.currentStock += item.quantity;
        } else if (this.type === 'stock_return') {
          // For returns, increase current stock and decrease sold stock
          vendorProduct.currentStock += item.quantity;
          vendorProduct.soldStock = Math.max(0, vendorProduct.soldStock - item.quantity);
        }

        await vendor.save();
      }
    }

    // Update vendor's total profit
    await vendor.updateTotalProfit();
    
    return true;
  } catch (error) {
    console.error('Stock update error:', error);
    throw error;
  }
};

// ✅ APPROVE INVOICE METHOD
invoiceSchema.methods.approveInvoice = async function(approvedBy) {
  try {
    if (this.status !== 'Pending Approval') {
      throw new Error('Invoice is not pending approval');
    }

    // Update vendor stock
    await this.updateVendorStock();

    // Update invoice status
    this.status = 'Approved';
    this.approvedBy = approvedBy;
    this.approvedAt = new Date();
    
    await this.save();
    
    return this;
  } catch (error) {
    console.error('Invoice approval error:', error);
    throw error;
  }
};

// ✅ PERFECT FIXED: Manual invoice number generation
invoiceSchema.methods.generateInvoiceNumber = async function() {
  try {
    const lastInvoice = await mongoose.model('Invoice')
      .findOne({}, {}, { sort: { 'createdAt': -1 } });
    
    let nextNumber = 1;
    if (lastInvoice && lastInvoice.invoiceNumber) {
      const matches = lastInvoice.invoiceNumber.match(/INV-(\d+)/);
      if (matches && matches[1]) {
        nextNumber = parseInt(matches[1]) + 1;
      }
    }
    
    return `INV-${String(nextNumber).padStart(5, '0')}`;
  } catch (error) {
    console.error('Error generating invoice number:', error);
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
    
    // If vendor creates invoice, set status to Pending Approval
    if (this.isNew && this.createdBy) {
      const User = mongoose.model('User');
      const creator = await User.findById(this.createdBy);
      
      if (creator && (creator.isVendor || creator.role === 'vendor')) {
        this.status = 'Pending Approval';
      }
    }
    
    next();
  } catch (error) {
    console.error('Error in pre-save hook:', error);
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