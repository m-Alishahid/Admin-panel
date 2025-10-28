// // models/Vendor.js - COMPLETELY UPDATED
// import mongoose from 'mongoose';

// const vendorProductSchema = new mongoose.Schema({
//   product: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Product',
//     required: true
//   },
//   allocatedStock: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   currentStock: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   soldStock: {
//     type: Number,
//     default: 0
//   },
  
//   // ✅ VARIANT DETAILS
//   size: {
//     type: String,
//     default: ''
//   },
//   color: {
//     type: String,
//     default: ''
//   },
//   fabric: {
//     type: String,
//     default: ''
//   },
  
//   // ✅ PRICING & PROFIT TRACKING
//   costPrice: {
//     type: Number,
//     default: 0
//   },
//   salePrice: {
//     type: Number,
//     default: 0
//   },
//   vendorPrice: {
//     type: Number,
//     default: 0
//   },
//   profitPerPiece: {
//     type: Number,
//     default: 0
//   },
//   totalProfit: {
//     type: Number,
//     default: 0
//   },
  
//   allocatedAt: {
//     type: Date,
//     default: Date.now
//   },
//   status: {
//     type: String,
//     enum: ['Active', 'Pending Delete', 'Inactive'],
//     default: 'Active'
//   }
// });

// const vendorSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//     unique: true
//   },
//   companyName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   contactPerson: {
//     type: String,
//     required: true
//   },
//   phone: {
//     type: String,
//     required: true
//   },
//   address: {
//     street: String,
//     city: String,
//     state: String,
//     zipCode: String,
//     country: String
//   },
//   products: [vendorProductSchema],
  
//   // Financial Details
//   totalAllocatedValue: {
//     type: Number,
//     default: 0
//   },
//   totalSoldValue: {
//     type: Number,
//     default: 0
//   },
//   outstandingBalance: {
//     type: Number,
//     default: 0
//   },
//   totalProfit: {
//     type: Number,
//     default: 0
//   },
  
//   // Status & Settings
//   status: {
//     type: String,
//     enum: ['Active', 'Inactive', 'Suspended'],
//     default: 'Active'
//   },
//   commissionRate: {
//     type: Number,
//     default: 10
//   }
// }, {
//   timestamps: true
// });

// // ✅ PRE-SAVE MIDDLEWARE TO FIX EXISTING PRODUCTS
// vendorSchema.pre('save', async function(next) {
//   try {
//     // Fix existing products that might be missing required fields
//     if (this.products && this.products.length > 0) {
//       for (let product of this.products) {
//         // Ensure all pricing fields have default values
//         if (product.costPrice === undefined || product.costPrice === null) {
//           product.costPrice = 0;
//         }
//         if (product.salePrice === undefined || product.salePrice === null) {
//           product.salePrice = 0;
//         }
//         if (product.vendorPrice === undefined || product.vendorPrice === null) {
//           product.vendorPrice = 0;
//         }
//         if (product.profitPerPiece === undefined || product.profitPerPiece === null) {
//           product.profitPerPiece = 0;
//         }
//         if (product.totalProfit === undefined || product.totalProfit === null) {
//           product.totalProfit = 0;
//         }
        
//         // Calculate profit per piece if not set
//         if (product.profitPerPiece === 0 && product.vendorPrice > 0 && product.costPrice > 0) {
//           product.profitPerPiece = product.vendorPrice - product.costPrice;
//         }
        
//         // Calculate total profit
//         if (product.totalProfit === 0 && product.profitPerPiece > 0 && product.soldStock > 0) {
//           product.totalProfit = product.profitPerPiece * product.soldStock;
//         }
//       }
//     }
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// // ✅ CALCULATE TOTAL PROFIT WHEN SOLD STOCK UPDATES
// vendorProductSchema.pre('save', function(next) {
//   if (this.isModified('soldStock') || this.isModified('profitPerPiece')) {
//     this.totalProfit = (this.profitPerPiece || 0) * (this.soldStock || 0);
//   }
//   next();
// });

// // ✅ UPDATE VENDOR'S TOTAL PROFIT
// vendorSchema.methods.updateTotalProfit = async function() {
//   const totalProfit = this.products.reduce((sum, product) => {
//     return sum + (product.totalProfit || 0);
//   }, 0);
  
//   this.totalProfit = totalProfit;
//   await this.save();
// };

// // ✅ ADD PROFIT CALCULATION METHOD
// vendorSchema.methods.calculateProfit = function() {
//   let totalProfit = 0;
//   let totalSoldValue = 0;
  
//   this.products.forEach(product => {
//     if (product.status === 'Active') {
//       product.totalProfit = (product.profitPerPiece || 0) * (product.soldStock || 0);
//       totalProfit += product.totalProfit;
//       totalSoldValue += (product.vendorPrice || 0) * (product.soldStock || 0);
//     }
//   });
  
//   this.totalSoldValue = totalSoldValue;
//   this.outstandingBalance = totalSoldValue - totalProfit;
  
//   return totalProfit;
// };

// export default mongoose.models.Vendor || mongoose.model('Vendor', vendorSchema);










// models/Vendor.js
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

export default mongoose.models.Vendor || mongoose.model('Vendor', vendorSchema);