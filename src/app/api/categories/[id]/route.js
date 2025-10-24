// import { NextResponse } from 'next/server';
// import Category from '../../../../Models/Category';
// import connectDB from '@/lib/mongodb';

// // GET category by ID
// export async function GET(request, { params }) {
//   try {
//     await connectDB();
    
//     const { id } = params;
    
//     const category = await Category.findById(id);
    
//     if (!category) {
//       return NextResponse.json(
//         { success: false, error: 'Category not found' },
//         { status: 404 }
//       );
//     }
    
//     return NextResponse.json({
//       success: true,
//       data: category
//     });
//   } catch (error) {
//     console.error('GET Category Error:', error);
//     return NextResponse.json(
//       { 
//         success: false, 
//         error: 'Failed to fetch category',
//         details: error.message 
//       },
//       { status: 500 }
//     );
//   }
// }

// // PUT update category
// export async function PUT(request, { params }) {
//   try {
//     await connectDB();
    
//     const { id } = params;
//     const body = await request.json();
    
//     // If updating name, check for duplicates
//     if (body.name) {
//       const existingCategory = await Category.findOne({ 
//         name: body.name, 
//         _id: { $ne: id } 
//       });
      
//       if (existingCategory) {
//         return NextResponse.json(
//           { 
//             success: false, 
//             error: 'Category with this name already exists' 
//           },
//           { status: 400 }
//         );
//       }
//     }
    
//     const category = await Category.findByIdAndUpdate(
//       id, 
//       body, 
//       { new: true, runValidators: true }
//     );
    
//     if (!category) {
//       return NextResponse.json(
//         { success: false, error: 'Category not found' },
//         { status: 404 }
//       );
//     }
    
//     return NextResponse.json({
//       success: true,
//       data: category,
//       message: 'Category updated successfully'
//     });
//   } catch (error) {
//     console.error('PUT Category Error:', error);
    
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
//         error: 'Failed to update category',
//         details: error.message 
//       },
//       { status: 500 }
//     );
//   }
// }

// // DELETE category
// export async function DELETE(request, { params }) {
//   try {
//     await connectDB();
    
//     const { id } = params;
    
//     const category = await Category.findByIdAndDelete(id);
    
//     if (!category) {
//       return NextResponse.json(
//         { success: false, error: 'Category not found' },
//         { status: 404 }
//       );
//     }
    
//     return NextResponse.json({
//       success: true,
//       message: 'Category deleted successfully'
//     });
//   } catch (error) {
//     console.error('DELETE Category Error:', error);
//     return NextResponse.json(
//       { 
//         success: false, 
//         error: 'Failed to delete category',
//         details: error.message 
//       },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from 'next/server';
import Category from '../../../../Models/Category';
import connectDB from '@/lib/mongodb';
import { cloudinaryService } from '../../../../lib/cloudinary';

// GET category by ID
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    const category = await Category.findById(id);
    
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('GET Category Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch category',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// PUT update category
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const body = await request.json();
    
    // Find existing category
    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // If updating name, check for duplicates
    if (body.name && body.name !== existingCategory.name) {
      const duplicateCategory = await Category.findOne({ 
        name: body.name, 
        _id: { $ne: id } 
      });
      
      if (duplicateCategory) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Category with this name already exists' 
          },
          { status: 400 }
        );
      }
    }

    // Handle image upload to Cloudinary if new image is provided
    if (body.image && body.image.startsWith('data:image')) {
      try {
        // Delete old image from Cloudinary if exists
        if (existingCategory.imagePublicId) {
          await cloudinaryService.deleteImage(existingCategory.imagePublicId);
        }

        // Upload new image
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

    const category = await Category.findByIdAndUpdate(
      id, 
      body, 
      { new: true, runValidators: true }
    );
    
    // ✅ Update page file if name changed
    if (body.name && body.name !== existingCategory.name) {
      try {
        await updateCategoryPage(category);
      } catch (fileError) {
        console.error('Error updating page file:', fileError);
      }
    }
    
    return NextResponse.json({
      success: true,
      data: category,
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error('PUT Category Error:', error);
    
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
        error: 'Failed to update category',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// DELETE category
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    const category = await Category.findById(id);
    
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    // Delete image from Cloudinary if exists
    if (category.imagePublicId) {
      try {
        await cloudinaryService.deleteImage(category.imagePublicId);
      } catch (deleteError) {
        console.error('Error deleting image from Cloudinary:', deleteError);
        // Continue with category deletion even if image deletion fails
      }
    }

    // Delete category from database
    await Category.findByIdAndDelete(id);

    // ✅ Delete page file
    try {
      await deleteCategoryPage(id);
    } catch (fileError) {
      console.error('Error deleting page file:', fileError);
      // Continue with category deletion even if file deletion fails
    }
    
    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('DELETE Category Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete category',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Helper function to update category page
async function updateCategoryPage(category) {
  const fs = require('fs');
  const path = require('path');

  const folderName = category._id.toString();
  const categoryPagePath = path.join(process.cwd(), 'src', 'app', 'categories', folderName, 'page.js');

  if (fs.existsSync(categoryPagePath)) {
    const pageContent = `"use client";
import CategoryProductsClient from "../../CategoryProductsClient";

export default function CategoryPage() {
  return <CategoryProductsClient categoryId="${category._id}" />;
}`;

    fs.writeFileSync(categoryPagePath, pageContent);
    console.log(`✅ Page file updated for category: ${category.name}`);
  }
}

// Helper function to delete category page
async function deleteCategoryPage(categoryId) {
  const fs = require('fs');
  const path = require('path');

  const folderName = categoryId.toString();
  const categoryDir = path.join(process.cwd(), 'src', 'app', 'categories', folderName);

  if (fs.existsSync(categoryDir)) {
    fs.rmSync(categoryDir, { recursive: true, force: true });
    console.log(`✅ Page file deleted for category ID: ${categoryId}`);
  }
}