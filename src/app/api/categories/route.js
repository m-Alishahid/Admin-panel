// // // // // import { NextResponse } from 'next/server';
// // // // // import Category from '../../../Models/Category';
// // // // // import connectDB from '../../../lib/mongodb';

// // // // // // GET all categories
// // // // // export async function GET() {
// // // // //   try {
// // // // //     await connectDB();
    
// // // // //     const categories = await Category.find({}).sort({ createdAt: -1 });
    
// // // // //     return NextResponse.json({
// // // // //       success: true,
// // // // //       data: categories,
// // // // //       count: categories.length
// // // // //     });
// // // // //   } catch (error) {
// // // // //     console.error('GET Categories Error:', error);
// // // // //     return NextResponse.json(
// // // // //       { 
// // // // //         success: false, 
// // // // //         error: 'Failed to fetch categories',
// // // // //         details: error.message 
// // // // //       },
// // // // //       { status: 500 }
// // // // //     );
// // // // //   }
// // // // // }

// // // // // // POST create new category
// // // // // export async function POST(request) {
// // // // //   try {
// // // // //     await connectDB();

// // // // //     const body = await request.json();

// // // // //     // Check if category with same name exists
// // // // //     const existingCategory = await Category.findOne({ name: body.name });
// // // // //     if (existingCategory) {
// // // // //       return NextResponse.json(
// // // // //         {
// // // // //           success: false,
// // // // //           error: 'Category with this name already exists'
// // // // //         },
// // // // //         { status: 400 }
// // // // //       );
// // // // //     }

// // // // //     const category = await Category.create(body);

// // // // //     // ✅ Generate page file for new category
// // // // //     try {
// // // // //       const fs = require('fs');
// // // // //       const path = require('path');

// // // // //       // Create unique folder name using category name + random numbers
// // // // //       const categoryNameSlug = category.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
// // // // //       const randomSuffix = Math.random().toString(36).substring(2, 8); // 6 character random string
// // // // //       const uniqueFolderName = `${categoryNameSlug}-${randomSuffix}`;

// // // // //       // Create category page file
// // // // //       const categoryPagePath = path.join(process.cwd(), 'src', 'app', 'categories', uniqueFolderName, 'page.js');

// // // // //       // Ensure directory exists
// // // // //       const categoryDir = path.dirname(categoryPagePath);
// // // // //       if (!fs.existsSync(categoryDir)) {
// // // // //         fs.mkdirSync(categoryDir, { recursive: true });
// // // // //       }

// // // // //       // Page content
// // // // //       const pageContent = `"use client";
// // // // // import CategoryProductsClient from "../[categoryId]/CategoryProductsClient";

// // // // // export default function CategoryPage() {
// // // // //   return <CategoryProductsClient categoryId="${category._id}" />;
// // // // // }`;

// // // // //       fs.writeFileSync(categoryPagePath, pageContent);
// // // // //       console.log(`✅ Page file created for category: ${category.name} at ${categoryPagePath}`);

// // // // //     } catch (fileError) {
// // // // //       console.error('Error creating page file:', fileError);
// // // // //       // Don't fail the category creation if file creation fails
// // // // //     }

// // // // //     return NextResponse.json({
// // // // //       success: true,
// // // // //       data: category,
// // // // //       message: 'Category created successfully'
// // // // //     }, { status: 201 });
// // // // //   } catch (error) {
// // // // //     console.error('POST Category Error:', error);

// // // // //     if (error.name === 'ValidationError') {
// // // // //       const errors = Object.values(error.errors).map(err => err.message);
// // // // //       return NextResponse.json(
// // // // //         {
// // // // //           success: false,
// // // // //           error: 'Validation failed',
// // // // //           details: errors
// // // // //         },
// // // // //         { status: 400 }
// // // // //       );
// // // // //     }

// // // // //     return NextResponse.json(
// // // // //       {
// // // // //         success: false,
// // // // //         error: 'Failed to create category',
// // // // //         details: error.message
// // // // //       },
// // // // //       { status: 500 }
// // // // //     );
// // // // //   }
// // // // // }





// // // import { NextResponse } from 'next/server';
// // // import Category from '../../../Models/Category';
// // // import connectDB from '../../../lib/mongodb';
// // // import { cloudinaryService } from '../../../lib/cloudinary';

// // // import fs from 'fs';
// // // import path from 'path';

// // // // GET all categories
// // // export async function GET() {
// // //   try {
// // //     await connectDB();

// // //     const categories = await Category.find({}).sort({ createdAt: -1 });

// // //     return NextResponse.json({
// // //       success: true,
// // //       data: categories,
// // //       count: categories.length
// // //     });
// // //   } catch (error) {
// // //     console.error('GET Categories Error:', error);
// // //     return NextResponse.json(
// // //       {
// // //         success: false,
// // //         error: 'Failed to fetch categories',
// // //         details: error?.message ?? String(error)
// // //       },
// // //       { status: 500 }
// // //     );
// // //   }
// // // }

// // // // POST create new category
// // // export async function POST(request) {
// // //   try {
// // //     await connectDB();

// // //     const body = await request.json();

// // //     // Basic validation
// // //     if (!body?.name || typeof body.name !== 'string' || body.name.trim() === '') {
// // //       return NextResponse.json(
// // //         {
// // //           success: false,
// // //           error: 'Category name is required'
// // //         },
// // //         { status: 400 }
// // //       );
// // //     }

// // //     // Check if category with same name exists
// // //     const existingCategory = await Category.findOne({ name: body.name });
// // //     if (existingCategory) {
// // //       return NextResponse.json(
// // //         {
// // //           success: false,
// // //           error: 'Category with this name already exists'
// // //         },
// // //         { status: 400 }
// // //       );
// // //     }

// // //     // Handle image upload to Cloudinary if image is base64
// // //     if (body.image && typeof body.image === 'string' && body.image.startsWith('data:image')) {
// // //       try {
// // //         const uploadResult = await cloudinaryService.uploadImage(body.image);
// // //         body.image = uploadResult.secure_url;
// // //         body.imagePublicId = uploadResult.public_id;
// // //       } catch (uploadError) {
// // //         console.error('Cloudinary upload error:', uploadError);
// // //         return NextResponse.json(
// // //           {
// // //             success: false,
// // //             error: 'Failed to upload image'
// // //           },
// // //           { status: 500 }
// // //         );
// // //       }
// // //     }

// // //     const category = await Category.create(body);

// // //     // Generate page file for new category (don't fail create if this errors)
// // //     try {
// // //       await generateCategoryPage(category);
// // //     } catch (fileError) {
// // //       console.error('Error creating page file:', fileError);
// // //       // intentionally not failing the request
// // //     }

// // //     return NextResponse.json(
// // //       {
// // //         success: true,
// // //         data: category,
// // //         message: 'Category created successfully'
// // //       },
// // //       { status: 201 }
// // //     );
// // //   } catch (error) {
// // //     console.error('POST Category Error:', error);

// // //     if (error?.name === 'ValidationError') {
// // //       const errors = Object.values(error.errors || {}).map(err => err.message);
// // //       return NextResponse.json(
// // //         {
// // //           success: false,
// // //           error: 'Validation failed',
// // //           details: errors
// // //         },
// // //         { status: 400 }
// // //       );
// // //     }

// // //     return NextResponse.json(
// // //       {
// // //         success: false,
// // //         error: 'Failed to create category',
// // //         details: error?.message ?? String(error)
// // //       },
// // //       { status: 500 }
// // //     );
// // //   }
// // // }

// // // // Helper function to generate category page
// // // async function generateCategoryPage(category) {
// // //   // Use fs.promises for async operations
// // //   const fsp = fs.promises;

// // //   // Create folder name using category ID
// // //   const folderName = category._id.toString();

// // //   // Create category page file paths (use .jsx for JSX content)
// // //   const categoryPagePath = path.join(process.cwd(), 'src', 'app', 'categories', folderName, 'page.jsx');
// // //   const clientComponentPath = path.join(process.cwd(), 'src', 'app', 'categories', folderName, 'CategoryProductsClient.jsx');

// // //   // Ensure directory exists
// // //   const categoryDir = path.dirname(categoryPagePath);
// // //   await fsp.mkdir(categoryDir, { recursive: true });

// // //   // Page content (server component)
// // //   const pageContent = `import { notFound } from 'next/navigation';
// // // import CategoryProductsClient from './CategoryProductsClient';

// // // // Generate static params for this category
// // // export async function generateStaticParams() {
// // //   return [{ categoryId: "${category._id.toString()}" }];
// // // }

// // // // Server component that fetches initial data
// // // export default async function CategoryPage({ params }) {
// // //   const { categoryId } = params;

// // //   try {
// // //     // Fetch category data
// // //     const categoryResponse = await fetch(
// // //       \`\${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/categories/\${categoryId}\`,
// // //       {
// // //         cache: 'force-cache',
// // //         next: { revalidate: 3600 }
// // //       }
// // //     );

// // //     if (!categoryResponse.ok) {
// // //       notFound();
// // //     }

// // //     const categoryData = await categoryResponse.json();

// // //     if (!categoryData?.success || !categoryData?.data) {
// // //       notFound();
// // //     }

// // //     const category = categoryData.data;

// // //     // Fetch initial products (first page)
// // //     const productsResponse = await fetch(
// // //       \`\${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/products/category/\${categoryId}?page=1&limit=12&sort=createdAt&order=desc\`,
// // //       {
// // //         cache: 'force-cache',
// // //         next: { revalidate: 3600 }
// // //       }
// // //     );

// // //     let initialProducts = [];
// // //     let initialPagination = {};

// // //     if (productsResponse.ok) {
// // //       const productsData = await productsResponse.json();
// // //       if (productsData?.success) {
// // //         initialProducts = productsData.data?.products || [];
// // //         initialPagination = productsData.data?.pagination || {};
// // //       }
// // //     }

// // //     // Metadata for SEO
// // //     const metadata = {
// // //       title: \`\${category.name} - TinyFashion\`,
// // //       description: category.description || \`Discover our exquisite collection of \${category.name.toLowerCase()} clothing and accessories, crafted with premium quality and elegant designs.\`,
// // //     };

// // //     return (
// // //       <>
// // //         <title>{metadata.title}</title>
// // //         <meta name="description" content={metadata.description} />
// // //         <meta property="og:title" content={metadata.title} />
// // //         <meta property="og:description" content={metadata.description} />
// // //         {category.image && (
// // //           <meta property="og:image" content={category.image} />
// // //         )}

// // //         <CategoryProductsClient
// // //           categoryId={categoryId}
// // //           initialCategory={category}
// // //           initialProducts={initialProducts}
// // //           initialPagination={initialPagination}
// // //         />
// // //       </>
// // //     );
// // //   } catch (error) {
// // //     console.error('Error loading category page:', error);
// // //     notFound();
// // //   }
// // // }
// // // `;

// // //   // Client component content - use backticks so inner quotes/JSX don't break
// // //   const clientComponentContent = ` "use client";
// // // import { useState, useEffect, useCallback } from "react";
// // // import Link from "next/link";
// // // import Navbar from "@/components/Navbar";
// // // import ProductCard from "@/components/ProductCard";
// // // import { productService } from "@/services/productService";

// // // export default function CategoryProductsClient({
// // //   categoryId,
// // //   initialCategory,
// // //   initialProducts,
// // //   initialPagination
// // // }) {
// // //   const [products, setProducts] = useState(initialProducts || []);
// // //   const [category, setCategory] = useState(initialCategory || {});
// // //   const [loading, setLoading] = useState(false);
// // //   const [error, setError] = useState(null);
// // //   const [pagination, setPagination] = useState(initialPagination || {});
// // //   const [filters, setFilters] = useState({
// // //     sort: 'createdAt',
// // //     order: 'desc',
// // //     minPrice: '',
// // //     maxPrice: '',
// // //     page: 1,
// // //     limit: 12
// // //   });

// // //   const fetchCategoryProducts = useCallback(async () => {
// // //     try {
// // //       setLoading(true);
// // //       const response = await productService.getByCategory(categoryId, filters);

// // //       if (response?.success) {
// // //         setProducts(response.data?.products || []);
// // //         setCategory(response.data?.category || {});
// // //         setPagination(response.data?.pagination || {});
// // //       } else {
// // //         setError(response?.error || 'Failed to fetch products');
// // //       }
// // //     } catch (err) {
// // //       setError('Failed to load products');
// // //       console.error('Error fetching category products:', err);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   }, [categoryId, filters]);

// // //   useEffect(() => {
// // //     // Only fetch if filters changed from initial state
// // //     if (filters.page !== 1 || filters.sort !== 'createdAt' || filters.order !== 'desc' ||
// // //         filters.minPrice || filters.maxPrice) {
// // //       fetchCategoryProducts();
// // //     }
// // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, [fetchCategoryProducts, filters]);

// // //   const handleFilterChange = (key, value) => {
// // //     setFilters(prev => ({
// // //       ...prev,
// // //       [key]: value,
// // //       ...(key !== 'page' && { page: 1 })
// // //     }));
// // //   };

// // //   const handlePageChange = (newPage) => {
// // //     handleFilterChange('page', newPage);
// // //     if (typeof window !== 'undefined') {
// // //       window.scrollTo({ top: 0, behavior: 'smooth' });
// // //     }
// // //   };

// // //   const clearFilters = () => {
// // //     setFilters({
// // //       sort: 'createdAt',
// // //       order: 'desc',
// // //       minPrice: '',
// // //       maxPrice: '',
// // //       page: 1,
// // //       limit: 12
// // //     });
// // //   };

// // //   if (loading && products.length === 0) {
// // //     return (
// // //       <div className="min-h-screen bg-white">
// // //         <Navbar />
// // //         <div className="pt-24 pb-16">
// // //           <div className="container mx-auto px-4 flex items-center justify-center">
// // //             <div className="text-center">
// // //               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cda434] mx-auto mb-4"></div>
// // //               <p className="text-gray-600 font-serif text-lg">Loading products...</p>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   if (error && products.length === 0) {
// // //     return (
// // //       <div className="min-h-screen bg-white">
// // //         <Navbar />
// // //         <div className="pt-24 pb-16">
// // //           <div className="container mx-auto px-4 text-center">
// // //             <div className="max-w-md mx-auto">
// // //               <div className="text-6xl mb-4">😔</div>
// // //               <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">Something went wrong</h2>
// // //               <p className="text-gray-600 mb-6 font-serif">{error}</p>
// // //               <div className="flex gap-3 justify-center">
// // //                 <Link
// // //                   href="/"
// // //                   className="bg-[#cda434] text-white px-6 py-3 rounded-sm hover:bg-[#b8932a] transition duration-300 font-serif font-semibold"
// // //                 >
// // //                   Back to Home
// // //                 </Link>
// // //                 <button
// // //                   onClick={fetchCategoryProducts}
// // //                   className="bg-gray-800 text-white px-6 py-3 rounded-sm hover:bg-gray-700 transition duration-300 font-serif"
// // //                 >
// // //                   Try Again
// // //                 </button>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="min-h-screen bg-white">
// // //       <Navbar />

// // //       {/* Breadcrumb */}
// // //       <div className="bg-gray-50 border-b border-gray-200">
// // //         <div className="container mx-auto px-4 py-3">
// // //           <nav className="flex items-center text-sm font-serif">
// // //             <Link href="/" className="text-gray-600 hover:text-[#cda434] transition-colors duration-300">
// // //               Home
// // //             </Link>
// // //             <span className="mx-3 text-gray-400">›</span>
// // //             <span className="text-[#cda434] font-semibold capitalize">{category?.name}</span>
// // //           </nav>
// // //         </div>
// // //       </div>

// // //       {/* Category Header */}
// // //       <section className="bg-gradient-to-b from-gray-50 to-white py-12 md:py-16">
// // //         <div className="container mx-auto px-4 text-center">
// // //           <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-4 tracking-tight">
// // //             {category?.name}
// // //           </h1>
// // //           <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-serif leading-relaxed">
// // //             {category?.description || \`Discover our exquisite collection of \${category?.name?.toLowerCase()} clothing and accessories, crafted with premium quality and elegant designs.\`}
// // //           </p>
// // //           <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-500 font-serif">
// // //             <span>{pagination.totalProducts || products.length} products</span>
// // //             <span>•</span>
// // //             <span>Premium quality</span>
// // //             <span>•</span>
// // //             <span>Free shipping over £100</span>
// // //           </div>
// // //         </div>
// // //       </section>

// // //       {/* Filters and Sorting Bar */}
// // //       <section className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
// // //         <div className="container mx-auto px-4 py-4">
// // //           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
// // //             {/* Left Side - Filters */}
// // //             <div className="flex flex-wrap items-center gap-4">
// // //               {/* Sort By */}
// // //               <div className="flex items-center gap-2">
// // //                 <label className="text-sm font-medium text-gray-700 font-serif whitespace-nowrap">Sort by:</label>
// // //                 <select
// // //                   value={\`\${filters.sort}-\${filters.order}\`}
// // //                   onChange={(e) => {
// // //                     const [sort, order] = e.target.value.split('-');
// // //                     handleFilterChange('sort', sort);
// // //                     handleFilterChange('order', order);
// // //                   }}
// // //                   className="border border-gray-300 rounded-sm px-4 py-2 text-sm font-serif focus:outline-none focus:ring-2 focus:ring-[#cda434] focus:border-[#cda434] transition-colors bg-white min-w-[160px]"
// // //                 >
// // //                   <option value="createdAt-desc">Newest First</option>
// // //                   <option value="createdAt-asc">Oldest First</option>
// // //                   <option value="salePrice-asc">Price: Low to High</option>
// // //                   <option value="salePrice-desc">Price: High to Low</option>
// // //                   <option value="name-asc">Name: A to Z</option>
// // //                   <option value="name-desc">Name: Z to A</option>
// // //                 </select>
// // //               </div>

// // //               {/* Price Range */}
// // //               <div className="flex items-center gap-2">
// // //                 <label className="text-sm font-medium text-gray-700 font-serif whitespace-nowrap">Price:</label>
// // //                 <div className="flex items-center gap-2 bg-gray-50 rounded-sm p-1">
// // //                   <input
// // //                     type="number"
// // //                     placeholder="Min"
// // //                     value={filters.minPrice}
// // //                     onChange={(e) => handleFilterChange('minPrice', e.target.value)}
// // //                     className="border-0 bg-transparent px-3 py-1 text-sm w-20 font-serif focus:outline-none focus:ring-1 focus:ring-[#cda434] rounded"
// // //                   />
// // //                   <span className="text-gray-400">-</span>
// // //                   <input
// // //                     type="number"
// // //                     placeholder="Max"
// // //                     value={filters.maxPrice}
// // //                     onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
// // //                     className="border-0 bg-transparent px-3 py-1 text-sm w-20 font-serif focus:outline-none focus:ring-1 focus:ring-[#cda434] rounded"
// // //                   />
// // //                 </div>
// // //               </div>

// // //               {/* Clear Filters */}
// // //               {(filters.minPrice || filters.maxPrice || filters.sort !== 'createdAt' || filters.order !== 'desc') && (
// // //                 <button
// // //                   onClick={clearFilters}
// // //                   className="text-sm text-[#cda434] hover:text-[#b8932a] font-serif font-medium transition-colors underline"
// // //                 >
// // //                   Clear Filters
// // //                 </button>
// // //               )}
// // //             </div>

// // //             {/* Right Side - Results Count */}
// // //             <div className="text-sm text-gray-600 font-serif bg-gray-50 px-3 py-2 rounded-sm">
// // //               Showing <span className="font-semibold">{products.length}</span> of{" "}
// // //               <span className="font-semibold">{pagination.totalProducts || products.length}</span>
// // //               {pagination.currentPage && (
// // //                 <span> • Page <span className="font-semibold">{pagination.currentPage}</span> of{" "}
// // //                   <span className="font-semibold">{pagination.currentPage && pagination.totalPages}</span></span>
// // //               )}
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </section>

// // //       <main className="container mx-auto px-4 py-8 md:py-12">
// // //         {loading && (
// // //           <div className="flex justify-center py-8">
// // //             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#cda434]"></div>
// // //           </div>
// // //         )}

// // //         {products.length === 0 && !loading ? (
// // //           <div className="text-center py-16 md:py-24">
// // //             <div className="max-w-md mx-auto">
// // //               <div className="text-8xl mb-6">👗</div>
// // //               <h3 className="text-2xl font-serif font-bold text-gray-800 mb-4">
// // //                 No products found
// // //               </h3>
// // //               <p className="text-gray-600 mb-8 font-serif leading-relaxed">
// // //                 We couldn't find any products in this category matching your filters.
// // //                 Try adjusting your search criteria or browse other categories.
// // //               </p>
// // //               <div className="flex flex-col sm:flex-row gap-3 justify-center">
// // //                 <button
// // //                   onClick={clearFilters}
// // //                   className="border border-[#d4b26e] rounded-full px-6 py-3 flex items-center gap-2 hover:bg-[#f8f4eb] transition-colors font-serif text-[#d4b26e] hover:text-[#b8932a]"
// // //                 >
// // //                   Clear All Filters
// // //                 </button>
// // //                 <Link
// // //                   href="/"
// // //                   className="bg-[#d4b26e] text-white rounded-full px-6 py-3 hover:bg-[#b8932a] transition duration-300 font-serif text-center flex items-center justify-center gap-2"
// // //                 >
// // //                   Browse All Categories
// // //                 </Link>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         ) : (
// // //           <>
// // //             {/* Products Grid */}
// // //             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
// // //               {products.map((product) => (
// // //                 <ProductCard key={product._id} product={product} />
// // //               ))}
// // //             </div>

// // //             {/* Pagination */}
// // //             {(pagination.totalPages || 0) > 1 && (
// // //               <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-16 pt-8 border-t border-gray-200">
// // //                 <div className="text-sm text-gray-600 font-serif">
// // //                   Page {pagination.currentPage} of {pagination.totalPages}
// // //                 </div>

// // //                 <div className="flex items-center gap-2">
// // //                   <button
// // //                     onClick={() => handlePageChange(pagination.currentPage - 1)}
// // //                     disabled={!pagination.hasPrev}
// // //                     className={\`border border-[#d4b26e] rounded-full px-4 py-2 font-serif text-sm font-semibold transition-all duration-300 flex items-center gap-2 \${
// // //                       pagination.hasPrev
// // //                         ? 'text-[#d4b26e] hover:bg-[#f8f4eb] hover:border-[#b8932a] hover:text-[#b8932a]'
// // //                         : 'border-gray-300 text-gray-400 cursor-not-allowed'
// // //                     }\`}
// // //                   >
// // //                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
// // //                     </svg>
// // //                     Previous
// // //                   </button>

// // //                   <div className="flex items-center gap-1 mx-4">
// // //                     {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
// // //                       let pageNum;
// // //                       if (pagination.totalPages <= 5) {
// // //                         pageNum = i + 1;
// // //                       } else if (pagination.currentPage <= 3) {
// // //                         pageNum = i + 1;
// // //                       } else if (pagination.currentPage >= pagination.totalPages - 2) {
// // //                         pageNum = pagination.totalPages - 4 + i;
// // //                       } else {
// // //                         pageNum = pagination.currentPage - 2 + i;
// // //                       }

// // //                       return (
// // //                         <button
// // //                           key={pageNum}
// // //                           onClick={() => handlePageChange(pageNum)}
// // //                           className={\`w-10 h-10 rounded-full font-serif text-sm font-semibold transition-all duration-300 \${
// // //                             pageNum === pagination.currentPage
// // //                               ? 'bg-[#d4b26e] text-white shadow-lg'
// // //                               : 'border border-[#d4b26e] text-[#d4b26e] hover:bg-[#f8f4eb]'
// // //                           }\`}
// // //                         >
// // //                           {pageNum}
// // //                         </button>
// // //                       );
// // //                     })}
// // //                   </div>

// // //                   <button
// // //                     onClick={() => handlePageChange(pagination.currentPage + 1)}
// // //                     disabled={!pagination.hasNext}
// // //                     className={\`border border-[#d4b26e] rounded-full px-4 py-2 font-serif text-sm font-semibold transition-all duration-300 flex items-center gap-2 \${
// // //                       pagination.hasNext
// // //                         ? 'text-[#d4b26e] hover:bg-[#f8f4eb] hover:border-[#b8932a] hover:text-[#b8932a]'
// // //                         : 'border-gray-300 text-gray-400 cursor-not-allowed'
// // //                     }\`}
// // //                   >
// // //                     Next
// // //                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
// // //                     </svg>
// // //                   </button>
// // //                 </div>

// // //                 <div className="text-sm text-gray-500 font-serif">
// // //                   {pagination.totalProducts} total products
// // //                 </div>
// // //               </div>
// // //             )}
// // //           </>
// // //         )}
// // //       </main>

// // //       {/* Back to Home */}
// // //       <section className="bg-gray-50 border-t border-gray-200">
// // //         <div className="container mx-auto px-4 py-8 text-center">
// // //           <Link
// // //             href="/"
// // //             className="inline-flex items-center gap-2 text-gray-600 hover:text-[#cda434] font-serif font-semibold transition-colors duration-300 group"
// // //           >
// // //             <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
// // //             Back to All Categories
// // //           </Link>
// // //         </div>
// // //       </section>
// // //     </div>
// // //   );
// // // }
// // // `;

// // //   // Write files (async)
// // //   await fsp.writeFile(categoryPagePath, pageContent, 'utf8');
// // //   await fsp.writeFile(clientComponentPath, clientComponentContent, 'utf8');

// // //   console.log(`✅ Page files created for category: ${category.name} at /categories/${folderName}`);
// // // }

// // import { NextResponse } from 'next/server';
// // import Category from '../../../Models/Category';
// // import connectDB from '../../../lib/mongodb';
// // import { cloudinaryService } from '../../../lib/cloudinary';

// // import fs from 'fs';
// // import path from 'path';

// // // GET all categories
// // export async function GET() {
// //   try {
// //     await connectDB();

// //     const categories = await Category.find({}).sort({ createdAt: -1 });

// //     return NextResponse.json({
// //       success: true,
// //       data: categories,
// //       count: categories.length
// //     });
// //   } catch (error) {
// //     console.error('GET Categories Error:', error);
// //     return NextResponse.json(
// //       {
// //         success: false,
// //         error: 'Failed to fetch categories',
// //         details: error?.message ?? String(error)
// //       },
// //       { status: 500 }
// //     );
// //   }
// // }

// // // POST create new category
// // export async function POST(request) {
// //   try {
// //     await connectDB();

// //     const body = await request.json();

// //     // Basic validation
// //     if (!body?.name || typeof body.name !== 'string' || body.name.trim() === '') {
// //       return NextResponse.json(
// //         {
// //           success: false,
// //           error: 'Category name is required'
// //         },
// //         { status: 400 }
// //       );
// //     }

// //     // Check if category with same name exists
// //     const existingCategory = await Category.findOne({ name: body.name });
// //     if (existingCategory) {
// //       return NextResponse.json(
// //         {
// //           success: false,
// //           error: 'Category with this name already exists'
// //         },
// //         { status: 400 }
// //       );
// //     }

// //     // Handle image upload to Cloudinary if image is base64
// //     if (body.image && typeof body.image === 'string' && body.image.startsWith('data:image')) {
// //       try {
// //         const uploadResult = await cloudinaryService.uploadImage(body.image);
// //         body.image = uploadResult.secure_url;
// //         body.imagePublicId = uploadResult.public_id;
// //       } catch (uploadError) {
// //         console.error('Cloudinary upload error:', uploadError);
// //         return NextResponse.json(
// //           {
// //             success: false,
// //             error: 'Failed to upload image'
// //           },
// //           { status: 500 }
// //         );
// //       }
// //     }

// //     const category = await Category.create(body);

// //     // Generate page file for new category (don't fail create if this errors)
// //     try {
// //       await generateCategoryPage(category);
// //     } catch (fileError) {
// //       console.error('Error creating page file:', fileError);
// //       // intentionally not failing the request
// //     }

// //     return NextResponse.json(
// //       {
// //         success: true,
// //         data: category,
// //         message: 'Category created successfully'
// //       },
// //       { status: 201 }
// //     );
// //   } catch (error) {
// //     console.error('POST Category Error:', error);

// //     if (error?.name === 'ValidationError') {
// //       const errors = Object.values(error.errors || {}).map(err => err.message);
// //       return NextResponse.json(
// //         {
// //           success: false,
// //           error: 'Validation failed',
// //           details: errors
// //         },
// //         { status: 400 }
// //       );
// //     }

// //     return NextResponse.json(
// //       {
// //         success: false,
// //         error: 'Failed to create category',
// //         details: error?.message ?? String(error)
// //       },
// //       { status: 500 }
// //     );
// //   }
// // }

// // // Helper function to generate category page
// // async function generateCategoryPage(category) {
// //   // Use fs.promises for async operations
// //   const fsp = fs.promises;

// //   // Dynamic folder name [categoryId] so Next provides params.categoryId
// //   const dynamicFolderName = '[categoryId]';

// //   // Create category page file paths (use .jsx for JSX content)
// //   const categoryPagePath = path.join(process.cwd(), 'src', 'app', 'categories', dynamicFolderName, 'page.jsx');
// //   const clientComponentPath = path.join(process.cwd(), 'src', 'app', 'categories', dynamicFolderName, 'CategoryProductsClient.jsx');

// //   // Ensure directory exists
// //   const categoryDir = path.dirname(categoryPagePath);
// //   await fsp.mkdir(categoryDir, { recursive: true });

// // //   // Server page content — NOTE: uses relative fetch() calls to avoid double /api
// // //   const pageContent = `
// // //   import { notFound } from 'next/navigation';
// // // import CategoryProductsClient from './CategoryProductsClient';

// // // // Generate static params for this category (so Next can pre-render if you want)
// // // export async function generateStaticParams() {
// // //   return [{ categoryId: "${category._id.toString()}" }];
// // // }

// // // // Server component that fetches initial data
// // // export default async function CategoryPage({ params }) {
// // //   const { categoryId } = params;

// // //   try {
// // //     if (!categoryId) {
// // //       notFound();
// // //     }

// // //     // Fetch category data from internal API (relative path)
// // //     const categoryResponse = await fetch(\`/api/categories/\${categoryId}\`, {
// // //       cache: 'force-cache',
// // //       next: { revalidate: 3600 }
// // //     });

// // //     if (!categoryResponse.ok) {
// // //       notFound();
// // //     }

// // //     const categoryData = await categoryResponse.json();

// // //     if (!categoryData?.success || !categoryData?.data) {
// // //       notFound();
// // //     }

// // //     const category = categoryData.data;

// // //     // Fetch initial products (first page) — relative route
// // //     const productsResponse = await fetch(
// // //       \`/api/products/category/\${categoryId}?page=1&limit=12&sort=createdAt&order=desc\`,
// // //       {
// // //         cache: 'force-cache',
// // //         next: { revalidate: 3600 }
// // //       }
// // //     );

// // //     let initialProducts = [];
// // //     let initialPagination = {};

// // //     if (productsResponse.ok) {
// // //       const productsData = await productsResponse.json();
// // //       if (productsData?.success) {
// // //         initialProducts = productsData.data?.products || [];
// // //         initialPagination = productsData.data?.pagination || {};
// // //       }
// // //     }

// // //     // Metadata for SEO
// // //     const metadata = {
// // //       title: \`\${category.name} - TinyFashion\`,
// // //       description: category.description || \`Discover our exquisite collection of \${category.name.toLowerCase()} clothing and accessories, crafted with premium quality and elegant designs.\`,
// // //     };

// // //     return (
// // //       <>
// // //         <title>{metadata.title}</title>
// // //         <meta name="description" content={metadata.description} />
// // //         <meta property="og:title" content={metadata.title} />
// // //         <meta property="og:description" content={metadata.description} />
// // //         {category.image && (
// // //           <meta property="og:image" content={category.image} />
// // //         )}

// // //         <CategoryProductsClient
// // //           categoryId={categoryId}
// // //           initialCategory={category}
// // //           initialProducts={initialProducts}
// // //           initialPagination={initialPagination}
// // //         />
// // //       </>
// // //     );
// // //   } catch (error) {
// // //     console.error('Error loading category page:', error);
// // //     notFound();
// // //   }
// // // }
// // // `;


// // const pageContent = `
// // import { notFound } from 'next/navigation';
// // import CategoryProductsClient from './CategoryProductsClient';
// // import { categoryService } from '@/services/categoryService';
// // import { productService } from '@/services/productService';

// // // ✅ Static params generation for SSG (optional)
// // export async function generateStaticParams() {
// //   try {
// //     const categories = await categoryService.getAll();
// //     if (categories?.data?.length > 0) {
// //       return categories.data.map((cat) => ({ categoryId: cat._id.toString() }));
// //     }
// //     return [];
// //   } catch (err) {
// //     console.error('Error generating static params:', err);
// //     return [];
// //   }
// // }

// // // ✅ Main Server Component
// // export default async function CategoryPage({ params }) {
// //   const { categoryId } = params;

// //   try {
// //     if (!categoryId) notFound();

// //     // 🧱 Fetch Category Details via Service
// //     const categoryRes = await categoryService.getById(categoryId);

// //     if (!categoryRes?.success || !categoryRes?.data) notFound();

// //     const category = categoryRes.data;

// //     // 🧱 Fetch Products via Service
// //     const productRes = await productService.getByCategory(categoryId, {
// //       page: 1,
// //       limit: 12,
// //       sort: 'createdAt',
// //       order: 'desc',
// //     });

// //     const initialProducts = productRes?.data?.products || [];
// //     const initialPagination = productRes?.data?.pagination || {};

// //     // 🧱 SEO Metadata
// //     const metadata = {
// //       title: \`\${category.name} - TinyFashion\`,
// //       description:
// //         category.description ||
// //         \`Discover our exclusive range of \${category.name.toLowerCase()} apparel and accessories — premium quality, timeless style.\`,
// //     };

// //     return (
// //       <>
// //         <title>{metadata.title}</title>
// //         <meta name="description" content={metadata.description} />
// //         <meta property="og:title" content={metadata.title} />
// //         <meta property="og:description" content={metadata.description} />
// //         {category.image && <meta property="og:image" content={category.image} />}

// //         <CategoryProductsClient
// //           categoryId={categoryId}
// //           initialCategory={category}
// //           initialProducts={initialProducts}
// //           initialPagination={initialPagination}
// //         />
// //       </>
// //     );
// //   } catch (error) {
// //     console.error('Error loading category page:', error);
// //     notFound();
// //   }
// // }
// // `;


// //   // Client component content — corrected "use client";
// //   const clientComponentContent = `"use client";
// // import { useState, useEffect, useCallback } from "react";
// // import Link from "next/link";
// // import Navbar from "@/components/Navbar";
// // import ProductCard from "@/components/ProductCard";
// // import { productService } from "@/services/productService";

// // export default function CategoryProductsClient({
// //   categoryId,
// //   initialCategory,
// //   initialProducts,
// //   initialPagination
// // }) {
// //   const [products, setProducts] = useState(initialProducts || []);
// //   const [category, setCategory] = useState(initialCategory || {});
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [pagination, setPagination] = useState(initialPagination || {});
// //   const [filters, setFilters] = useState({
// //     sort: 'createdAt',
// //     order: 'desc',
// //     minPrice: '',
// //     maxPrice: '',
// //     page: 1,
// //     limit: 12
// //   });

// //   const fetchCategoryProducts = useCallback(async () => {
// //     try {
// //       setLoading(true);
// //       if (!categoryId) {
// //         setError('Category ID missing');
// //         return;
// //       }
// //       const response = await productService.getByCategory(categoryId, filters);

// //       if (response?.success) {
// //         setProducts(response.data?.products || []);
// //         setCategory(response.data?.category || {});
// //         setPagination(response.data?.pagination || {});
// //       } else {
// //         setError(response?.error || 'Failed to fetch products');
// //       }
// //     } catch (err) {
// //       setError('Failed to load products');
// //       console.error('Error fetching category products:', err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [categoryId, filters]);

// //   useEffect(() => {
// //     // Only fetch if filters changed from initial state
// //     if (filters.page !== 1 || filters.sort !== 'createdAt' || filters.order !== 'desc' ||
// //         filters.minPrice || filters.maxPrice) {
// //       fetchCategoryProducts();
// //     }
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [fetchCategoryProducts, filters]);

// //   const handleFilterChange = (key, value) => {
// //     setFilters(prev => ({
// //       ...prev,
// //       [key]: value,
// //       ...(key !== 'page' && { page: 1 })
// //     }));
// //   };

// //   const handlePageChange = (newPage) => {
// //     handleFilterChange('page', newPage);
// //     if (typeof window !== 'undefined') {
// //       window.scrollTo({ top: 0, behavior: 'smooth' });
// //     }
// //   };

// //   const clearFilters = () => {
// //     setFilters({
// //       sort: 'createdAt',
// //       order: 'desc',
// //       minPrice: '',
// //       maxPrice: '',
// //       page: 1,
// //       limit: 12
// //     });
// //   };

// //   if (loading && products.length === 0) {
// //     return (
// //       <div className="min-h-screen bg-white">
// //         <Navbar />
// //         <div className="pt-24 pb-16">
// //           <div className="container mx-auto px-4 flex items-center justify-center">
// //             <div className="text-center">
// //               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cda434] mx-auto mb-4"></div>
// //               <p className="text-gray-600 font-serif text-lg">Loading products...</p>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (error && products.length === 0) {
// //     return (
// //       <div className="min-h-screen bg-white">
// //         <Navbar />
// //         <div className="pt-24 pb-16">
// //           <div className="container mx-auto px-4 text-center">
// //             <div className="max-w-md mx-auto">
// //               <div className="text-6xl mb-4">😔</div>
// //               <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">Something went wrong</h2>
// //               <p className="text-gray-600 mb-6 font-serif">{error}</p>
// //               <div className="flex gap-3 justify-center">
// //                 <Link
// //                   href="/"
// //                   className="bg-[#cda434] text-white px-6 py-3 rounded-sm hover:bg-[#b8932a] transition duration-300 font-serif font-semibold"
// //                 >
// //                   Back to Home
// //                 </Link>
// //                 <button
// //                   onClick={fetchCategoryProducts}
// //                   className="bg-gray-800 text-white px-6 py-3 rounded-sm hover:bg-gray-700 transition duration-300 font-serif"
// //                 >
// //                   Try Again
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-white">
// //       <Navbar />

// //       {/* Breadcrumb */}
// //       <div className="bg-gray-50 border-b border-gray-200">
// //         <div className="container mx-auto px-4 py-3">
// //           <nav className="flex items-center text-sm font-serif">
// //             <Link href="/" className="text-gray-600 hover:text-[#cda434] transition-colors duration-300">
// //               Home
// //             </Link>
// //             <span className="mx-3 text-gray-400">›</span>
// //             <span className="text-[#cda434] font-semibold capitalize">{category?.name}</span>
// //           </nav>
// //         </div>
// //       </div>

// //       {/* Category Header */}
// //       <section className="bg-gradient-to-b from-gray-50 to-white py-12 md:py-16">
// //         <div className="container mx-auto px-4 text-center">
// //           <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-4 tracking-tight">
// //             {category?.name}
// //           </h1>
// //           <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-serif leading-relaxed">
// //             {category?.description || \`Discover our exquisite collection of \${category?.name?.toLowerCase()} clothing and accessories, crafted with premium quality and elegant designs.\`}
// //           </p>
// //           <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-500 font-serif">
// //             <span>{pagination.totalProducts || products.length} products</span>
// //             <span>•</span>
// //             <span>Premium quality</span>
// //             <span>•</span>
// //             <span>Free shipping over £100</span>
// //           </div>
// //         </div>
// //       </section>

// //       {/* Filters and Sorting Bar */}
// //       <section className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
// //         <div className="container mx-auto px-4 py-4">
// //           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
// //             {/* Left Side - Filters */}
// //             <div className="flex flex-wrap items-center gap-4">
// //               {/* Sort By */}
// //               <div className="flex items-center gap-2">
// //                 <label className="text-sm font-medium text-gray-700 font-serif whitespace-nowrap">Sort by:</label>
// //                 <select
// //                   value={\`\${filters.sort}-\${filters.order}\`}
// //                   onChange={(e) => {
// //                     const [sort, order] = e.target.value.split('-');
// //                     handleFilterChange('sort', sort);
// //                     handleFilterChange('order', order);
// //                   }}
// //                   className="border border-gray-300 rounded-sm px-4 py-2 text-sm font-serif focus:outline-none focus:ring-2 focus:ring-[#cda434] focus:border-[#cda434] transition-colors bg-white min-w-[160px]"
// //                 >
// //                   <option value="createdAt-desc">Newest First</option>
// //                   <option value="createdAt-asc">Oldest First</option>
// //                   <option value="salePrice-asc">Price: Low to High</option>
// //                   <option value="salePrice-desc">Price: High to Low</option>
// //                   <option value="name-asc">Name: A to Z</option>
// //                   <option value="name-desc">Name: Z to A</option>
// //                 </select>
// //               </div>

// //               {/* Price Range */}
// //               <div className="flex items-center gap-2">
// //                 <label className="text-sm font-medium text-gray-700 font-serif whitespace-nowrap">Price:</label>
// //                 <div className="flex items-center gap-2 bg-gray-50 rounded-sm p-1">
// //                   <input
// //                     type="number"
// //                     placeholder="Min"
// //                     value={filters.minPrice}
// //                     onChange={(e) => handleFilterChange('minPrice', e.target.value)}
// //                     className="border-0 bg-transparent px-3 py-1 text-sm w-20 font-serif focus:outline-none focus:ring-1 focus:ring-[#cda434] rounded"
// //                   />
// //                   <span className="text-gray-400">-</span>
// //                   <input
// //                     type="number"
// //                     placeholder="Max"
// //                     value={filters.maxPrice}
// //                     onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
// //                     className="border-0 bg-transparent px-3 py-1 text-sm w-20 font-serif focus:outline-none focus:ring-1 focus:ring-[#cda434] rounded"
// //                   />
// //                 </div>
// //               </div>

// //               {/* Clear Filters */}
// //               {(filters.minPrice || filters.maxPrice || filters.sort !== 'createdAt' || filters.order !== 'desc') && (
// //                 <button
// //                   onClick={clearFilters}
// //                   className="text-sm text-[#cda434] hover:text-[#b8932a] font-serif font-medium transition-colors underline"
// //                 >
// //                   Clear Filters
// //                 </button>
// //               )}
// //             </div>

// //             {/* Right Side - Results Count */}
// //             <div className="text-sm text-gray-600 font-serif bg-gray-50 px-3 py-2 rounded-sm">
// //               Showing <span className="font-semibold">{products.length}</span> of{" "}
// //               <span className="font-semibold">{pagination.totalProducts || products.length}</span>
// //               {pagination.currentPage && (
// //                 <span> • Page <span className="font-semibold">{pagination.currentPage}</span> of{" "}
// //                   <span className="font-semibold">{pagination.currentPage && pagination.totalPages}</span></span>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </section>

// //       <main className="container mx-auto px-4 py-8 md:py-12">
// //         {loading && (
// //           <div className="flex justify-center py-8">
// //             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#cda434]"></div>
// //           </div>
// //         )}

// //         {products.length === 0 && !loading ? (
// //           <div className="text-center py-16 md:py-24">
// //             <div className="max-w-md mx-auto">
// //               <div className="text-8xl mb-6">👗</div>
// //               <h3 className="text-2xl font-serif font-bold text-gray-800 mb-4">
// //                 No products found
// //               </h3>
// //               <p className="text-gray-600 mb-8 font-serif leading-relaxed">
// //                 We couldn't find any products in this category matching your filters.
// //                 Try adjusting your search criteria or browse other categories.
// //               </p>
// //               <div className="flex flex-col sm:flex-row gap-3 justify-center">
// //                 <button
// //                   onClick={clearFilters}
// //                   className="border border-[#d4b26e] rounded-full px-6 py-3 flex items-center gap-2 hover:bg-[#f8f4eb] transition-colors font-serif text-[#d4b26e] hover:text-[#b8932a]"
// //                 >
// //                   Clear All Filters
// //                 </button>
// //                 <Link
// //                   href="/"
// //                   className="bg-[#d4b26e] text-white rounded-full px-6 py-3 hover:bg-[#b8932a] transition duration-300 font-serif text-center flex items-center justify-center gap-2"
// //                 >
// //                   Browse All Categories
// //                 </Link>
// //               </div>
// //             </div>
// //           </div>
// //         ) : (
// //           <>
// //             {/* Products Grid */}
// //             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
// //               {products.map((product) => (
// //                 <ProductCard key={product._id} product={product} />
// //               ))}
// //             </div>

// //             {/* Pagination */}
// //             {(pagination.totalPages || 0) > 1 && (
// //               <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-16 pt-8 border-t border-gray-200">
// //                 <div className="text-sm text-gray-600 font-serif">
// //                   Page {pagination.currentPage} of {pagination.totalPages}
// //                 </div>

// //                 <div className="flex items-center gap-2">
// //                   <button
// //                     onClick={() => handlePageChange(pagination.currentPage - 1)}
// //                     disabled={!pagination.hasPrev}
// //                     className={\`border border-[#d4b26e] rounded-full px-4 py-2 font-serif text-sm font-semibold transition-all duration-300 flex items-center gap-2 \${
// //                       pagination.hasPrev
// //                         ? 'text-[#d4b26e] hover:bg-[#f8f4eb] hover:border-[#b8932a] hover:text-[#b8932a]'
// //                         : 'border-gray-300 text-gray-400 cursor-not-allowed'
// //                     }\`}
// //                   >
// //                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
// //                     </svg>
// //                     Previous
// //                   </button>

// //                   <div className="flex items-center gap-1 mx-4">
// //                     {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
// //                       let pageNum;
// //                       if (pagination.totalPages <= 5) {
// //                         pageNum = i + 1;
// //                       } else if (pagination.currentPage <= 3) {
// //                         pageNum = i + 1;
// //                       } else if (pagination.currentPage >= pagination.totalPages - 2) {
// //                         pageNum = pagination.totalPages - 4 + i;
// //                       } else {
// //                         pageNum = pagination.currentPage - 2 + i;
// //                       }

// //                       return (
// //                         <button
// //                           key={pageNum}
// //                           onClick={() => handlePageChange(pageNum)}
// //                           className={\`w-10 h-10 rounded-full font-serif text-sm font-semibold transition-all duration-300 \${
// //                             pageNum === pagination.currentPage
// //                               ? 'bg-[#d4b26e] text-white shadow-lg'
// //                               : 'border border-[#d4b26e] text-[#d4b26e] hover:bg-[#f8f4eb]'
// //                           }\`}
// //                         >
// //                           {pageNum}
// //                         </button>
// //                       );
// //                     })}
// //                   </div>

// //                   <button
// //                     onClick={() => handlePageChange(pagination.currentPage + 1)}
// //                     disabled={!pagination.hasNext}
// //                     className={\`border border-[#d4b26e] rounded-full px-4 py-2 font-serif text-sm font-semibold transition-all duration-300 flex items-center gap-2 \${
// //                       pagination.hasNext
// //                         ? 'text-[#d4b26e] hover:bg-[#f8f4eb] hover:border-[#b8932a] hover:text-[#b8932a]'
// //                         : 'border-gray-300 text-gray-400 cursor-not-allowed'
// //                     }\`}
// //                   >
// //                     Next
// //                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
// //                     </svg>
// //                   </button>
// //                 </div>

// //                 <div className="text-sm text-gray-500 font-serif">
// //                   {pagination.totalProducts} total products
// //                 </div>
// //               </div>
// //             )}
// //           </>
// //         )}
// //       </main>

// //       {/* Back to Home */}
// //       <section className="bg-gray-50 border-t border-gray-200">
// //         <div className="container mx-auto px-4 py-8 text-center">
// //           <Link
// //             href="/"
// //             className="inline-flex items-center gap-2 text-gray-600 hover:text-[#cda434] font-serif font-semibold transition-colors duration-300 group"
// //           >
// //             <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
// //             Back to All Categories
// //           </Link>
// //         </div>
// //       </section>
// //     </div>
// //   );
// // }
// // `;

// //   // Write files (async)
// //   await fsp.writeFile(categoryPagePath, pageContent, 'utf8');
// //   await fsp.writeFile(clientComponentPath, clientComponentContent, 'utf8');

// //   console.log(`✅ Page files created (dynamic) for category: ${category.name}`);
// // }







// import { NextResponse } from 'next/server';
// import Category from '../../../Models/Category';
// import connectDB from '../../../lib/mongodb';
// import { cloudinaryService } from '../../../lib/cloudinary';
// import fs from 'fs';
// import path from 'path';

// // ✅ GET all categories
// export async function GET() {
//   try {
//     await connectDB();
//     const categories = await Category.find({}).sort({ createdAt: -1 });

//     return NextResponse.json({
//       success: true,
//       data: categories,
//       count: categories.length,
//     });
//   } catch (error) {
//     console.error('GET Categories Error:', error);
//     return NextResponse.json(
//       { success: false, error: 'Failed to fetch categories', details: error.message },
//       { status: 500 }
//     );
//   }
// }

// // ✅ POST create new category (with folder generation)
// export async function POST(request) {
//   try {
//     await connectDB();
//     const body = await request.json();

//     if (!body.name || typeof body.name !== 'string') {
//       return NextResponse.json({ success: false, error: 'Category name required' }, { status: 400 });
//     }

//     const exists = await Category.findOne({ name: body.name });
//     if (exists) {
//       return NextResponse.json({ success: false, error: 'Category with this name already exists' }, { status: 400 });
//     }

//     // ☁️ Upload image if base64
//     if (body.image && body.image.startsWith('data:image')) {
//       const upload = await cloudinaryService.uploadImage(body.image);
//       body.image = upload.secure_url;
//       body.imagePublicId = upload.public_id;
//     }

//     const category = await Category.create(body);

//     // 🧱 Create dynamic folder + page
//     await generateCategoryFolder(category);

//     return NextResponse.json({
//       success: true,
//       data: category,
//       message: 'Category created successfully',
//     });
//   } catch (error) {
//     console.error('POST Category Error:', error);
//     return NextResponse.json(
//       { success: false, error: 'Failed to create category', details: error.message },
//       { status: 500 }
//     );
//   }
// }

// // ✅ Helper — Create category folder & files
// async function generateCategoryFolder(category) {
//   const fsp = fs.promises;
//   const folderName = category.name.toLowerCase().replace(/\s+/g, '-'); // name-based folder
//   const baseDir = path.join(process.cwd(), 'src', 'app', 'categories', folderName);

//   await fsp.mkdir(baseDir, { recursive: true });

//   const pagePath = path.join(baseDir, 'page.jsx');

//   const pageContent = `
// import { notFound } from 'next/navigation';
// import CategoryProductsClient from './CategoryProductsClient';
// import { categoryService } from '@/services/categoryService';
// import { productService } from '@/services/productService';

// export default async function CategoryPage() {
//   try {
//     const categoryRes = await categoryService.getById('${category._id}');
//     if (!categoryRes?.success || !categoryRes?.data) notFound();

//     const category = categoryRes.data;
//     const productRes = await productService.getByCategory('${category._id}', {
//       page: 1,
//       limit: 12,
//       sort: 'createdAt',
//       order: 'desc',
//     });

//     const initialProducts = productRes?.data?.products || [];
//     const initialPagination = productRes?.data?.pagination || {};

//     return (
//       <CategoryProductsClient
//         categoryId={'${category._id}'}
//         initialCategory={category}
//         initialProducts={initialProducts}
//         initialPagination={initialPagination}
//       />
//     );
//   } catch (err) {
//     console.error('Category page load error:', err);
//     notFound();
//   }
// }
// `;

//   const clientComponent = `"use client";
// import { useState, useEffect } from 'react';
// import Navbar from '@/components/Navbar';
// import ProductCard from '@/components/ProductCard';
// import { productService } from '@/services/productService';
// import Link from 'next/link';

// export default function CategoryProductsClient({ categoryId, initialCategory, initialProducts, initialPagination }) {
//   const [products, setProducts] = useState(initialProducts);
//   const [category, setCategory] = useState(initialCategory);
//   const [pagination, setPagination] = useState(initialPagination);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     setProducts(initialProducts);
//     setCategory(initialCategory);
//   }, [categoryId]);

//   return (
//     <div className="min-h-screen bg-white">
//       <Navbar />
//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-4xl font-serif mb-6 text-center">{category?.name}</h1>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {products?.map((p) => (
//             <ProductCard key={p._id} product={p} />
//           ))}
//         </div>
//         {products?.length === 0 && (
//           <div className="text-center text-gray-500 mt-10 font-serif">No products found in this category.</div>
//         )}
//         <div className="text-center mt-10">
//           <Link href="/" className="text-[#cda434] underline font-serif">← Back to Categories</Link>
//         </div>
//       </div>
//     </div>
//   );
// }`;

//   await fsp.writeFile(pagePath, pageContent, 'utf8');
//   await fsp.writeFile(path.join(baseDir, 'CategoryProductsClient.jsx'), clientComponent, 'utf8');

//   console.log(`✅ Folder created for category: ${category.name}`);
// }











// src/app/api/categories/route.js
import { NextResponse } from 'next/server';
import Category from '@/Models/Category';
import connectDB from '@/lib/mongodb';
import { cloudinaryService } from '@/lib/cloudinary';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: categories, count: categories.length });
  } catch (err) {
    console.error('GET /api/categories error', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch categories', details: err.message }, { status: 500 });
  }
}

async function generateCategoryFolder(category) {
  const slug = category.slug || category._id.toString();
  const baseDir = path.join(process.cwd(), 'src', 'app', 'categories', slug);
  await fs.promises.mkdir(baseDir, { recursive: true });

  // Server page (uses services, and uses relative client import)
  const pageContent = `
import { notFound } from 'next/navigation';
import CategoryProductsClient from './CategoryProductsClient';
import { categoryService } from '@/services/categoryService';
import { productService } from '@/services/productService';

export default async function CategoryPage() {
  const idOrSlug = '${category.slug || category._id}';
  try {
    const categoryRes = await categoryService.getById(idOrSlug);
    if (!categoryRes?.success || !categoryRes?.data) notFound();
    const category = categoryRes.data;

    const productRes = await productService.getByCategory(category._id || category.slug, { page:1, limit:12, sort:'createdAt', order:'desc' });
    const initialProducts = productRes?.data?.products || [];
    const initialPagination = productRes?.data?.pagination || {};

    return (
      <CategoryProductsClient
        categoryId={category._id || category.slug}
        initialCategory={category}
        initialProducts={initialProducts}
        initialPagination={initialPagination}
      />
    );
  } catch (err) {
    console.error('Category page load error:', err);
    notFound();
  }
}
`.trim();

  // Client component file placed in same folder (so relative import works)
  const clientContent = `"use client";
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import { productService } from '@/services/productService';
import Link from 'next/link';

export default function CategoryProductsClient({ categoryId, initialCategory, initialProducts, initialPagination }) {
  const [products, setProducts] = useState(initialProducts || []);
  const [category, setCategory] = useState(initialCategory || {});
  const [pagination, setPagination] = useState(initialPagination || {});
  useEffect(() => {
    setProducts(initialProducts || []);
    setCategory(initialCategory || {});
    setPagination(initialPagination || {});
  }, [categoryId]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-serif mb-6 text-center">{category?.name}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products?.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
        {(!products || products.length === 0) && <div className="text-center text-gray-500 mt-10 font-serif">No products found.</div>}
        <div className="text-center mt-10">
          <Link href="/" className="text-[#cda434] underline font-serif">← Back to Categories</Link>
        </div>
      </div>
    </div>
  );
}
`;

  await fs.promises.writeFile(path.join(baseDir, 'page.jsx'), pageContent, 'utf8');
  await fs.promises.writeFile(path.join(baseDir, 'CategoryProductsClient.jsx'), clientContent, 'utf8');
  console.log(`✅ Generated folder for category: ${slug}`);
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    if (!body?.name) {
      return NextResponse.json({ success: false, error: 'Category name required' }, { status: 400 });
    }

    if (await Category.findOne({ name: body.name })) {
      return NextResponse.json({ success: false, error: 'Category already exists' }, { status: 400 });
    }

    // handle base64 image upload
    if (body.image && typeof body.image === 'string' && body.image.startsWith('data:image')) {
      const upload = await cloudinaryService.uploadImage(body.image);
      body.image = upload.secure_url;
      body.imagePublicId = upload.public_id;
    }

    const category = await Category.create(body);
    await generateCategoryFolder(category);
    return NextResponse.json({ success: true, data: category, message: 'Created and generated page' }, { status: 201 });
  } catch (err) {
    console.error('POST /api/categories error', err);
    return NextResponse.json({ success: false, error: 'Failed to create', details: err.message }, { status: 500 });
  }
}
