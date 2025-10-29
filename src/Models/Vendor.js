// Models/Vendor.js
import mongoose from 'mongoose';

const vendorProductSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  allocatedStock: {
    type: Number,
    required: true,
    min: 0
  },
  currentStock: {
    type: Number,
    required: true,
    min: 0
  },
  soldStock: {
    type: Number,
    default: 0
  },
  
  // Variant details
  size: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: ''
  },
  fabric: {
    type: String,
    default: ''
  },
  
  // Pricing & profit tracking
  costPrice: {
    type: Number,
    default: 0
  },
  salePrice: {
    type: Number,
    default: 0
  },
  vendorPrice: {
    type: Number,
    default: 0
  },
  profitPerPiece: {
    type: Number,
    default: 0
  },
  totalProfit: {
    type: Number,
    default: 0
  },
  
  allocatedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Active', 'Pending Delete', 'Inactive'],
    default: 'Active'
  }
});

const vendorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  contactPerson: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  gstNumber: String,
  panNumber: String,
  
  products: [vendorProductSchema],
  
  // Financial details
  totalAllocatedValue: {
    type: Number,
    default: 0
  },
  totalSoldValue: {
    type: Number,
    default: 0
  },
  outstandingBalance: {
    type: Number,
    default: 0
  },
  totalProfit: {
    type: Number,
    default: 0
  },
  
  // Status & settings
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Suspended'],
    default: 'Active'
  },
  commissionRate: {
    type: Number,
    default: 10
  },
  paymentTerms: {
    type: String,
    default: 'Net 30'
  }
}, {
  timestamps: true
});

// Update total profit when sold stock changes
vendorProductSchema.pre('save', function(next) {
  if (this.isModified('soldStock') || this.isModified('profitPerPiece')) {
    this.totalProfit = (this.profitPerPiece || 0) * (this.soldStock || 0);
  }
  next();
});

// Update vendor totals when products change
vendorSchema.pre('save', function(next) {
  this.totalAllocatedValue = this.products.reduce((sum, product) => 
    sum + (product.allocatedStock * product.costPrice), 0
  );
  
  this.totalSoldValue = this.products.reduce((sum, product) => 
    sum + (product.soldStock * product.vendorPrice), 0
  );
  
  this.totalProfit = this.products.reduce((sum, product) => 
    sum + product.totalProfit, 0
  );
  
  next();
});

// Method to get available products for invoicing
vendorSchema.methods.getAvailableProducts = function() {
  return this.products.filter(product => 
    product.status === 'Active' && product.currentStock > 0
  );
};

// Method to update stock after invoice
vendorSchema.methods.updateStockFromInvoice = async function(invoiceType, items) {
  for (const item of items) {
    const vendorProduct = this.products.find(p => 
      p.product.toString() === item.productId.toString() &&
      p.size === item.size &&
      p.color === item.color
    );

    if (vendorProduct) {
      if (invoiceType === 'vendor_sale') {
        if (vendorProduct.currentStock < item.quantity) {
          throw new Error(`Insufficient stock for ${item.productName}. Available: ${vendorProduct.currentStock}`);
        }
        vendorProduct.soldStock += item.quantity;
        vendorProduct.currentStock -= item.quantity;
      } else if (invoiceType === 'stock_return') {
        vendorProduct.soldStock = Math.max(0, vendorProduct.soldStock - item.quantity);
        vendorProduct.currentStock += item.quantity;
      }
      
      vendorProduct.totalProfit = vendorProduct.profitPerPiece * vendorProduct.soldStock;
    }
  }
  
  await this.save();
};

// ✅ UPDATE TOTAL PROFIT METHOD (Vendor Model mein add karo)
vendorSchema.methods.updateTotalProfit = async function() {
  try {
    this.totalProfit = this.products.reduce((sum, product) => {
      return sum + (product.totalProfit || 0);
    }, 0);
    
    await this.save();
    return this.totalProfit;
  } catch (error) {
    console.error('Vendor profit update error:', error);
    throw error;
  }
};

export default mongoose.models.Vendor || mongoose.model('Vendor', vendorSchema);