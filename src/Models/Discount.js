// import mongoose from 'mongoose';

// const discountSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Discount name is required'],
//     trim: true,
//     maxlength: [100, 'Discount name cannot exceed 100 characters']
//   },
//   description: {
//     type: String,
//     trim: true,
//     maxlength: [500, 'Description cannot exceed 500 characters']
//   },
//   discountType: {
//     type: String,
//     enum: ['percentage', 'fixed'],
//     required: [true, 'Discount type is required']
//   },
//   discountValue: {
//     type: Number,
//     required: [true, 'Discount value is required'],
//     min: [0, 'Discount value cannot be negative']
//   },
//   // Discount application scope
//   scope: {
//     type: String,
//     enum: ['all', 'category', 'selected'],
//     required: [true, 'Scope is required']
//   },
//   // For category scope - make it optional and only required for category scope
//   category: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Category',
//     required: function() {
//       return this.scope === 'category';
//     }
//   },
//   // For selected products scope
//   products: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Product',
//     required: function() {
//       return this.scope === 'selected';
//     }
//   }],
//   // Discount application method
//   applicationMethod: {
//     type: String,
//     enum: ['additive', 'replace', 'best_price'],
//     default: 'best_price'
//   },
//   // Validity period
//   startDate: {
//     type: Date,
//     required: [true, 'Start date is required']
//   },
//   endDate: {
//     type: Date,
//     required: [true, 'End date is required']
//   },
//   // Auto removal settings
//   autoRemove: {
//     type: Boolean,
//     default: true
//   },
//   // Status
//   status: {
//     type: String,
//     enum: ['Active', 'Inactive', 'Expired', 'Scheduled'],
//     default: 'Scheduled'
//   },
//   // Statistics
//   totalProducts: {
//     type: Number,
//     default: 0
//   },
//   totalDiscountAmount: {
//     type: Number,
//     default: 0
//   },
//   // Timestamps
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// }, {
//   timestamps: true
// });

// // Index for better performance
// discountSchema.index({ scope: 1 });
// discountSchema.index({ category: 1 });
// discountSchema.index({ status: 1 });
// discountSchema.index({ startDate: 1, endDate: 1 });

// // Pre-save middleware to update status based on dates
// discountSchema.pre('save', function(next) {
//   const now = new Date();
  
//   // Auto update status based on dates
//   if (this.startDate > now) {
//     this.status = 'Scheduled';
//   } else if (this.endDate < now) {
//     this.status = 'Expired';
//   } else if (this.status === 'Scheduled' && this.startDate <= now) {
//     this.status = 'Active';
//   }
  
//   this.updatedAt = now;
//   next();
// });

// // Static method to check and expire discounts
// discountSchema.statics.checkExpiredDiscounts = async function() {
//   const now = new Date();
  
//   // Find active discounts that have expired
//   const expiredDiscounts = await this.find({
//     status: 'Active',
//     endDate: { $lt: now },
//     autoRemove: true
//   });

//   for (const discount of expiredDiscounts) {
//     await discount.removeDiscountFromProducts();
//   }

//   return expiredDiscounts.length;
// };

// // Instance method to remove discount from products
// discountSchema.methods.removeDiscountFromProducts = async function() {
//   const Product = mongoose.model('Product');
  
//   let filter = {};
//   switch (this.scope) {
//     case 'all':
//       filter = { discountedPrice: { $gt: 0 } };
//       break;
//     case 'category':
//       filter = { category: this.category, discountedPrice: { $gt: 0 } };
//       break;
//     case 'selected':
//       filter = { _id: { $in: this.products }, discountedPrice: { $gt: 0 } };
//       break;
//   }

//   // Reset discounted prices for affected products
//   await Product.updateMany(filter, {
//     $set: {
//       discountedPrice: 0,
//       discountPercentage: 0
//     }
//   });

//   // Update discount status to expired
//   this.status = 'Expired';
//   await this.save();

//   console.log(`Discount "${this.name}" expired and removed from products`);
// };

// export default mongoose.models.Discount || mongoose.model('Discount', discountSchema);


import mongoose from 'mongoose';

const discountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Discount name is required'],
    trim: true,
    maxlength: [100, 'Discount name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: [true, 'Discount type is required']
  },
  discountValue: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: [0, 'Discount value cannot be negative']
  },
  scope: {
    type: String,
    enum: ['all', 'category', 'selected'],
    required: [true, 'Scope is required']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: function() {
      return this.scope === 'category';
    }
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: function() {
      return this.scope === 'selected';
    }
  }],
  applicationMethod: {
    type: String,
    enum: ['additive', 'replace', 'best_price'],
    default: 'best_price'
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  autoRemove: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Expired', 'Scheduled'],
    default: 'Scheduled'
  },
  totalProducts: {
    type: Number,
    default: 0
  },
  totalDiscountAmount: {
    type: Number,
    default: 0
  },
  // NEW: Track which products have this discount applied
  appliedProducts: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    originalPrice: Number,
    discountedPrice: Number,
    appliedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
discountSchema.index({ scope: 1 });
discountSchema.index({ category: 1 });
discountSchema.index({ status: 1 });
discountSchema.index({ startDate: 1, endDate: 1 });
discountSchema.index({ 'appliedProducts.product': 1 });

// Auto-update status based on dates
discountSchema.pre('save', function(next) {
  const now = new Date();
  
  if (this.startDate > now) {
    this.status = 'Scheduled';
  } else if (this.endDate < now) {
    this.status = 'Expired';
  } else if (this.status === 'Scheduled' && this.startDate <= now) {
    this.status = 'Active';
  }
  
  this.updatedAt = now;
  next();
});

// Method to apply discount to products
discountSchema.methods.applyToProducts = async function() {
  const Product = mongoose.model('Product');
  
  let filter = {};
  switch (this.scope) {
    case 'all':
      filter = { status: 'Active' };
      break;
    case 'category':
      filter = { category: this.category, status: 'Active' };
      break;
    case 'selected':
      filter = { _id: { $in: this.products }, status: 'Active' };
      break;
  }

  const products = await Product.find(filter);
  this.appliedProducts = [];
  this.totalProducts = products.length;
  
  let totalDiscountAmount = 0;

  for (const product of products) {
    const newDiscountedPrice = this.calculateDiscountedPrice(product.salePrice);
    const discountAmount = product.salePrice - newDiscountedPrice;
    
    totalDiscountAmount += discountAmount;

    // Update product
    await Product.findByIdAndUpdate(product._id, {
      discountedPrice: Math.max(0, newDiscountedPrice),
      discountPercentage: Math.round(((product.salePrice - newDiscountedPrice) / product.salePrice) * 100)
    });

    // Track applied products
    this.appliedProducts.push({
      product: product._id,
      originalPrice: product.salePrice,
      discountedPrice: newDiscountedPrice,
      appliedAt: new Date()
    });
  }

  this.totalDiscountAmount = totalDiscountAmount;
  await this.save();
};

// Method to remove discount from products
discountSchema.methods.removeFromProducts = async function() {
  const Product = mongoose.model('Product');
  
  // Reset only the products that have this discount applied
  for (const appliedProduct of this.appliedProducts) {
    await Product.findByIdAndUpdate(appliedProduct.product, {
      $set: {
        discountedPrice: 0,
        discountPercentage: 0
      }
    });
  }

  this.status = 'Inactive';
  this.appliedProducts = [];
  await this.save();
};

// Helper method to calculate discounted price
discountSchema.methods.calculateDiscountedPrice = function(originalPrice) {
  if (this.discountType === 'percentage') {
    return originalPrice * (1 - this.discountValue / 100);
  } else {
    return Math.max(0, originalPrice - this.discountValue);
  }
};

// Static method to check and update discount statuses
discountSchema.statics.updateDiscountStatuses = async function() {
  const now = new Date();
  const Discount = this;
  
  // Expire discounts that have ended
  const expiredDiscounts = await Discount.find({
    status: 'Active',
    endDate: { $lt: now },
    autoRemove: true
  });

  for (const discount of expiredDiscounts) {
    await discount.removeFromProducts();
    discount.status = 'Expired';
    await discount.save();
  }

  // Activate scheduled discounts
  const scheduledDiscounts = await Discount.find({
    status: 'Scheduled',
    startDate: { $lte: now },
    endDate: { $gte: now }
  });

  for (const discount of scheduledDiscounts) {
    discount.status = 'Active';
    await discount.save();
    await discount.applyToProducts();
  }

  return {
    expired: expiredDiscounts.length,
    activated: scheduledDiscounts.length
  };
};

export default mongoose.models.Discount || mongoose.model('Discount', discountSchema);