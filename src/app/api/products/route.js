// import connectDB from '@/lib/mongodb';
// import { NextResponse } from 'next/server';
// import Product from '@/Models/Product';
// import Category from '@/Models/Category';

// // GET all products with filtering, sorting, pagination
// export async function GET(request) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(request.url);
//     const page = parseInt(searchParams.get('page')) || 1;
//     const limit = parseInt(searchParams.get('limit')) || 10;
//     const search = searchParams.get('search') || '';
//     const category = searchParams.get('category') || '';
//     const status = searchParams.get('status') || '';
//     const sortBy = searchParams.get('sortBy') || 'createdAt';
//     const sortOrder = searchParams.get('sortOrder') || 'desc';

//     const skip = (page - 1) * limit;

//     // Build filter
//     let filter = {};

//     if (search) {
//       filter.$or = [
//         { name: { $regex: search, $options: 'i' } },
//         { description: { $regex: search, $options: 'i' } }
//       ];
//     }

//     if (category) {
//       filter.category = category;
//     }

//     if (status) {
//       filter.status = status;
//     }

//     // Sort
//     const sort = {};
//     sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

//     const products = await Product.find(filter)
//       .populate('category')
//       .sort(sort)
//       .skip(skip)
//       .limit(limit);

//     const total = await Product.countDocuments(filter);
//     const totalPages = Math.ceil(total / limit);

//     return NextResponse.json({
//       success: true,
//       data: {
//         products,
//         pagination: {
//           page,
//           limit,
//           total,
//           totalPages,
//           hasNext: page < totalPages,
//           hasPrev: page > 1
//         }
//       }
//     });
//   } catch (error) {
//     console.error('GET Products Error:', error);
//     return NextResponse.json(
//       { 
//         success: false, 
//         error: 'Failed to fetch products',
//         details: error.message 
//       },
//       { status: 500 }
//     );
//   }
// }

// // POST create new product
// export async function POST(request) {
//   try {
//     await connectDB();

//     const formData = await request.formData();

//     // Extract form data
//     const name = formData.get('name');
//     const description = formData.get('description');
//     const costPrice = parseFloat(formData.get('costPrice'));
//     const salePrice = parseFloat(formData.get('salePrice'));
//     const discountedPrice = formData.get('discountedPrice') ? parseFloat(formData.get('discountedPrice')) : null;
//     const category = formData.get('category');
//     const variants = JSON.parse(formData.get('variants') || '[]');
    
//     // Handle images
//     const images = [];
//     const thumbnail = formData.get('thumbnail') || '';
    
//     // Get all image files
//     for (let [key, value] of formData.entries()) {
//       if (key.startsWith('images[') && value instanceof File) {
//         // In real implementation, you would upload to cloud storage
//         // For now, we'll simulate by creating a mock URL
//         const mockUrl = `/uploads/products/${Date.now()}-${value.name}`;
//         images.push(mockUrl);
//       }
//     }

//     // Calculate total stock from variants
//     const totalStock = variants.reduce((sum, variant) => {
//       const variantStock = variant.colors.reduce((colorSum, color) => {
//         return colorSum + (parseInt(color.stock) || 0);
//       }, 0);
//       return sum + variantStock;
//     }, 0);

//     // Create product
//     const product = await Product.create({
//       name,
//       description,
//       costPrice,
//       salePrice,
//       discountedPrice,
//       category,
//       variants,
//       images,
//       thumbnail: thumbnail || (images[0] || ''),
//       totalStock
//     });

//     const newProduct = await Product.findById(product._id).populate('category');

//     return NextResponse.json({
//       success: true,
//       data: newProduct,
//       message: 'Product created successfully'
//     }, { status: 201 });
//   } catch (error) {
//     console.error('POST Product Error:', error);
    
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
//         error: 'Failed to create product',
//         details: error.message 
//       },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/Models/Product';
import Category from '@/Models/Category';
import { cloudinaryService } from '@/lib/cloudinary';

// GET all products with filtering, sorting, pagination
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const skip = (page - 1) * limit;

    // Build filter
    let filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (status) {
      filter.status = status;
    }

    // Sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const products = await Product.find(filter)
      .populate('category')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('GET Products Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch products',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// POST create new product
export async function POST(request) {
  try {
    await connectDB();

    const formData = await request.formData();

    // Extract form data
    const name = formData.get('name');
    const description = formData.get('description');
    const costPrice = parseFloat(formData.get('costPrice'));
    const salePrice = parseFloat(formData.get('salePrice'));
    const discountedPrice = formData.get('discountedPrice') ? parseFloat(formData.get('discountedPrice')) : null;
    const category = formData.get('category');
    const variants = JSON.parse(formData.get('variants') || '[]');
    const status = formData.get('status') || 'Active';
    
    // Handle images
    const imageFiles = [];
    for (let [key, value] of formData.entries()) {
      if (key.startsWith('images[') && value instanceof File) {
        imageFiles.push(value);
      }
    }

    // Upload images to Cloudinary
    let uploadedImages = [];
    if (imageFiles.length > 0) {
      uploadedImages = await cloudinaryService.uploadImages(imageFiles);
    }

    // Calculate total stock from variants
    const totalStock = variants.reduce((sum, variant) => {
      const variantStock = variant.colors.reduce((colorSum, color) => {
        return colorSum + (parseInt(color.stock) || 0);
      }, 0);
      return sum + variantStock;
    }, 0);

    // Set thumbnail (first image or specified thumbnail)
    const thumbnailIndex = parseInt(formData.get('thumbnailIndex')) || 0;
    const thumbnail = uploadedImages[thumbnailIndex] || '';

    // Create product
    const product = await Product.create({
      name,
      description,
      costPrice,
      salePrice,
      discountedPrice,
      category,
      variants,
      images: uploadedImages,
      thumbnail,
      totalStock,
      status
    });

    const newProduct = await Product.findById(product._id).populate('category');

    return NextResponse.json({
      success: true,
      data: newProduct,
      message: 'Product created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('POST Product Error:', error);
    
    // Delete uploaded images if product creation fails
    if (uploadedImages && uploadedImages.length > 0) {
      await cloudinaryService.deleteImages(uploadedImages).catch(console.error);
    }
    
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
        error: 'Failed to create product',
        details: error.message 
      },
      { status: 500 }
    );
  }
}