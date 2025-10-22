// import { NextResponse } from 'next/server';
// import connectDB from '@/lib/mongodb';
// import Discount from '@/Models/Discount';
// import Product from '@/Models/Product';
// import mongoose from 'mongoose';

// // GET all discounts
// export async function GET(request) {
//   try {
//     await connectDB();
    
//     const { searchParams } = new URL(request.url);
//     const status = searchParams.get('status') || 'Active';

//     const discounts = await Discount.find({ status })
//       .populate('category')
//       .populate('products')
//       .sort({ createdAt: -1 });

//     return NextResponse.json({
//       success: true,
//       data: discounts
//     });
//   } catch (error) {
//     console.error('GET Discounts Error:', error);
//     return NextResponse.json(
//       { success: false, error: 'Failed to fetch discounts' },
//       { status: 500 }
//     );
//   }
// }

// // POST create and apply discount
// export async function POST(request) {
//   try {
//     await connectDB();
//     const body = await request.json();

//     console.log('Received discount data:', body);

//     // Clean up the data - remove empty category for non-category scopes
//     const cleanData = { ...body };
    
//     // Convert discountValue to number
//     cleanData.discountValue = parseFloat(cleanData.discountValue);
    
//     if (cleanData.scope !== 'category') {
//       cleanData.category = undefined;
//     } else {
//       // Validate category ID for category scope
//       if (!cleanData.category || !mongoose.Types.ObjectId.isValid(cleanData.category)) {
//         return NextResponse.json(
//           { success: false, error: 'Valid category ID is required for category scope' },
//           { status: 400 }
//         );
//       }
//     }

//     // For selected scope, validate product IDs
//     if (cleanData.scope === 'selected') {
//       if (!cleanData.products || !Array.isArray(cleanData.products) || cleanData.products.length === 0) {
//         return NextResponse.json(
//           { success: false, error: 'At least one product must be selected' },
//           { status: 400 }
//         );
//       }

//       // Validate all product IDs
//       const invalidProductIds = cleanData.products.filter(
//         productId => !mongoose.Types.ObjectId.isValid(productId)
//       );
      
//       if (invalidProductIds.length > 0) {
//         return NextResponse.json(
//           { success: false, error: 'Invalid product IDs provided' },
//           { status: 400 }
//         );
//       }
//     }

//     // Create discount record
//     const discount = await Discount.create(cleanData);

//     // Apply discount to products based on scope
//     let affectedProducts = [];
//     let filter = {};

//     switch (cleanData.scope) {
//       case 'all':
//         filter = {};
//         break;
//       case 'category':
//         filter = { category: cleanData.category };
//         break;
//       case 'selected':
//         filter = { _id: { $in: cleanData.products } };
//         break;
//     }

//     const products = await Product.find(filter);
//     affectedProducts = products;

//     console.log(`Applying discount to ${products.length} products`);

//     // Update products with new discounted price
//     const updatePromises = products.map(product => {
//       let newDiscountedPrice;

//       // Calculate new discounted price based on application method
//       if (cleanData.applicationMethod === 'replace') {
//         // Replace existing discount
//         newDiscountedPrice = calculateDiscountedPrice(
//           product.salePrice,
//           cleanData.discountType,
//           cleanData.discountValue
//         );
//       } else if (cleanData.applicationMethod === 'additive' && product.discountedPrice > 0) {
//         // Add to existing discount
//         const existingDiscount = ((product.salePrice - product.discountedPrice) / product.salePrice) * 100;
//         const totalDiscount = existingDiscount + (cleanData.discountType === 'percentage' ? parseFloat(cleanData.discountValue) : (cleanData.discountValue / product.salePrice) * 100);
//         newDiscountedPrice = product.salePrice * (1 - totalDiscount / 100);
//       } else {
//         // Best price (keep the lower price)
//         const newPrice = calculateDiscountedPrice(
//           product.salePrice,
//           cleanData.discountType,
//           cleanData.discountValue
//         );
//         newDiscountedPrice = product.discountedPrice > 0 
//           ? Math.min(product.discountedPrice, newPrice)
//           : newPrice;
//       }

//       return Product.findByIdAndUpdate(
//         product._id,
//         {
//           discountedPrice: Math.max(0, newDiscountedPrice),
//           discountPercentage: Math.round(((product.salePrice - newDiscountedPrice) / product.salePrice) * 100)
//         },
//         { new: true }
//       );
//     });

//     await Promise.all(updatePromises);

//     // Update discount statistics
//     const totalDiscountAmount = products.reduce((sum, product) => {
//       return sum + (product.salePrice - (product.discountedPrice || 0));
//     }, 0);

//     await Discount.findByIdAndUpdate(discount._id, {
//       totalProducts: products.length,
//       totalDiscountAmount
//     });

//     const updatedDiscount = await Discount.findById(discount._id)
//       .populate('category')
//       .populate('products');

//     return NextResponse.json({
//       success: true,
//       data: updatedDiscount,
//       message: `Discount applied to ${products.length} products successfully`
//     }, { status: 201 });

//   } catch (error) {
//     console.error('POST Discount Error:', error);
    
//     if (error.name === 'ValidationError') {
//       const errors = Object.values(error.errors).map(err => err.message);
//       return NextResponse.json(
//         { 
//           success: false, 
//           error: 'Validation failed',
//           details: errors 
//         },
//         { status: 400 }
//       );
//     }
    
//     return NextResponse.json(
//       { 
//         success: false, 
//         error: 'Failed to create discount',
//         details: error.message 
//       },
//       { status: 500 }
//     );
//   }
// }

// // Helper function to calculate discounted price
// function calculateDiscountedPrice(originalPrice, discountType, discountValue) {
//   if (discountType === 'percentage') {
//     return originalPrice * (1 - discountValue / 100);
//   } else {
//     return Math.max(0, originalPrice - discountValue);
//   }
// }

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Discount from '@/Models/Discount';
import Product from '@/Models/Product';
import mongoose from 'mongoose';

// GET all discounts
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const discounts = await Discount.find(query)
      .populate('category')
      .populate('products')
      .populate('appliedProducts.product')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: discounts
    });
  } catch (error) {
    console.error('GET Discounts Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch discounts' },
      { status: 500 }
    );
  }
}

// POST create and apply discount
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    console.log('Received discount data:', body);

    // Validate required fields
    const requiredFields = ['name', 'discountType', 'discountValue', 'scope', 'startDate', 'endDate'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Clean and validate data
    const cleanData = { 
      ...body,
      discountValue: parseFloat(body.discountValue)
    };

    // Validate dates
    const startDate = new Date(cleanData.startDate);
    const endDate = new Date(cleanData.endDate);
    
    if (startDate >= endDate) {
      return NextResponse.json(
        { success: false, error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    if (endDate <= new Date()) {
      return NextResponse.json(
        { success: false, error: 'End date must be in the future' },
        { status: 400 }
      );
    }

    // Validate scope-specific fields
    if (cleanData.scope === 'category') {
      if (!cleanData.category || !mongoose.Types.ObjectId.isValid(cleanData.category)) {
        return NextResponse.json(
          { success: false, error: 'Valid category ID is required for category scope' },
          { status: 400 }
        );
      }
    } else {
      cleanData.category = undefined;
    }

    if (cleanData.scope === 'selected') {
      if (!cleanData.products || !Array.isArray(cleanData.products) || cleanData.products.length === 0) {
        return NextResponse.json(
          { success: false, error: 'At least one product must be selected for selected scope' },
          { status: 400 }
        );
      }

      const invalidProductIds = cleanData.products.filter(
        productId => !mongoose.Types.ObjectId.isValid(productId)
      );
      
      if (invalidProductIds.length > 0) {
        return NextResponse.json(
          { success: false, error: 'Invalid product IDs provided' },
          { status: 400 }
        );
      }
    } else {
      cleanData.products = [];
    }

    // Set initial status based on start date
    const now = new Date();
    if (startDate > now) {
      cleanData.status = 'Scheduled';
    } else {
      cleanData.status = 'Active';
    }

    // Create discount
    const discount = await Discount.create(cleanData);

    // Apply discount to products if it's active
    if (discount.status === 'Active') {
      await discount.applyToProducts();
    }

    // Populate and return the created discount
    const populatedDiscount = await Discount.findById(discount._id)
      .populate('category')
      .populate('products')
      .populate('appliedProducts.product');

    return NextResponse.json({
      success: true,
      data: populatedDiscount,
      message: `Discount created successfully${discount.status === 'Active' ? ` and applied to ${discount.totalProducts} products` : ''}`
    }, { status: 201 });

  } catch (error) {
    console.error('POST Discount Error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: errors 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create discount',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// PUT update discount
export async function PUT(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const discountId = searchParams.get('id');
    const body = await request.json();

    if (!discountId) {
      return NextResponse.json(
        { success: false, error: 'Discount ID is required' },
        { status: 400 }
      );
    }

    const discount = await Discount.findById(discountId);
    if (!discount) {
      return NextResponse.json(
        { success: false, error: 'Discount not found' },
        { status: 404 }
      );
    }

    // Update discount
    const updatedDiscount = await Discount.findByIdAndUpdate(
      discountId,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    )
      .populate('category')
      .populate('products')
      .populate('appliedProducts.product');

    // Re-apply discount if it's active
    if (updatedDiscount.status === 'Active') {
      await updatedDiscount.applyToProducts();
    }

    return NextResponse.json({
      success: true,
      data: updatedDiscount,
      message: 'Discount updated successfully'
    });

  } catch (error) {
    console.error('PUT Discount Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update discount' },
      { status: 500 }
    );
  }
}