// import { NextResponse } from 'next/server';
// import Category from '../../../Models/Category';
// import connectDB from '../../../lib/mongodb';

// // GET all categories
// export async function GET() {
//   try {
//     await connectDB();
    
//     const categories = await Category.find({}).sort({ createdAt: -1 });
    
//     return NextResponse.json({
//       success: true,
//       data: categories,
//       count: categories.length
//     });
//   } catch (error) {
//     console.error('GET Categories Error:', error);
//     return NextResponse.json(
//       { 
//         success: false, 
//         error: 'Failed to fetch categories',
//         details: error.message 
//       },
//       { status: 500 }
//     );
//   }
// }

// // POST create new category
// export async function POST(request) {
//   try {
//     await connectDB();

//     const body = await request.json();

//     // Check if category with same name exists
//     const existingCategory = await Category.findOne({ name: body.name });
//     if (existingCategory) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: 'Category with this name already exists'
//         },
//         { status: 400 }
//       );
//     }

//     const category = await Category.create(body);

//     // ✅ Generate page file for new category
//     try {
//       const fs = require('fs');
//       const path = require('path');

//       // Create unique folder name using category name + random numbers
//       const categoryNameSlug = category.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
//       const randomSuffix = Math.random().toString(36).substring(2, 8); // 6 character random string
//       const uniqueFolderName = `${categoryNameSlug}-${randomSuffix}`;

//       // Create category page file
//       const categoryPagePath = path.join(process.cwd(), 'src', 'app', 'categories', uniqueFolderName, 'page.js');

//       // Ensure directory exists
//       const categoryDir = path.dirname(categoryPagePath);
//       if (!fs.existsSync(categoryDir)) {
//         fs.mkdirSync(categoryDir, { recursive: true });
//       }

//       // Page content
//       const pageContent = `"use client";
// import CategoryProductsClient from "../[categoryId]/CategoryProductsClient";

// export default function CategoryPage() {
//   return <CategoryProductsClient categoryId="${category._id}" />;
// }`;

//       fs.writeFileSync(categoryPagePath, pageContent);
//       console.log(`✅ Page file created for category: ${category.name} at ${categoryPagePath}`);

//     } catch (fileError) {
//       console.error('Error creating page file:', fileError);
//       // Don't fail the category creation if file creation fails
//     }

//     return NextResponse.json({
//       success: true,
//       data: category,
//       message: 'Category created successfully'
//     }, { status: 201 });
//   } catch (error) {
//     console.error('POST Category Error:', error);

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
//         error: 'Failed to create category',
//         details: error.message
//       },
//       { status: 500 }
//     );
//   }
// }





import { NextResponse } from 'next/server';
import Category from '../../../Models/Category';
import connectDB from '../../../lib/mongodb';
import { cloudinaryService } from '../../../lib/cloudinary';

// GET all categories
export async function GET() {
  try {
    await connectDB();
    
    const categories = await Category.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: categories,
      count: categories.length
    });
  } catch (error) {
    console.error('GET Categories Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch categories',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// POST create new category
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    // Check if category with same name exists
    const existingCategory = await Category.findOne({ name: body.name });
    if (existingCategory) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category with this name already exists'
        },
        { status: 400 }
      );
    }

    // Handle image upload to Cloudinary if image is base64
    if (body.image && body.image.startsWith('data:image')) {
      try {
        const uploadResult = await cloudinaryService.uploadImage(body.image);
        body.image = uploadResult.secure_url;
        body.imagePublicId = uploadResult.public_id;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return NextResponse.json(
          {
            success: false,
            error: 'Failed to upload image'
          },
          { status: 500 }
        );
      }
    }

    const category = await Category.create(body);

    // ✅ Generate page file for new category
    try {
      await generateCategoryPage(category);
    } catch (fileError) {
      console.error('Error creating page file:', fileError);
      // Don't fail the category creation if file creation fails
    }

    return NextResponse.json({
      success: true,
      data: category,
      message: 'Category created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('POST Category Error:', error);

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
        error: 'Failed to create category',
        details: error.message
      },
      { status: 500 }
    );
  }
}

// Helper function to generate category page
async function generateCategoryPage(category) {
  const fs = require('fs');
  const path = require('path');

  // Create unique folder name using category ID
  const folderName = category._id.toString();

  // Create category page file
  const categoryPagePath = path.join(process.cwd(), 'src', 'app', 'categories', folderName, 'page.js');

  // Ensure directory exists
  const categoryDir = path.dirname(categoryPagePath);
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true });
  }

  // Page content
  const pageContent = `"use client";
import CategoryProductsClient from "../../CategoryProductsClient";

export default function CategoryPage() {
  return <CategoryProductsClient categoryId="${category._id}" />;
}`;

  fs.writeFileSync(categoryPagePath, pageContent);
  console.log(`✅ Page file created for category: ${category.name} at ${categoryPagePath}`);
}