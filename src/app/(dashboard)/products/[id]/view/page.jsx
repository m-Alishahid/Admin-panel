"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { productService } from '@/services/productService';

export default function ViewProduct() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productService.getById(id);
      if (response.success) {
        setProduct(response.data);
      } else {
        alert("Product not found");
        router.push('/products');
      }
    } catch (error) {
      console.error("Failed to fetch product:", error);
      alert("Failed to load product");
      router.push('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      try {
        const response = await productService.delete(id);
        if (response.success) {
          alert("Product deleted successfully!");
          router.push('/products');
        }
      } catch (error) {
        alert("Failed to delete product.");
        console.error("Delete error:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">Product Not Found</h1>
        <Link href="/products" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-gray-600 mt-1">Product details and information</p>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/products/${id}/edit`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Edit Product
              </Link>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Delete Product
              </button>
              <Link
                href="/products"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Back to List
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images Gallery */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Images</h2>
              {product.images && product.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {product.images.map((image, index) => (
                    <div key={index} className={`border-2 rounded-lg overflow-hidden ${
                      product.thumbnail === image ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                    }`}>
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      {product.thumbnail === image && (
                        <div className="bg-blue-500 text-white text-xs text-center py-1">
                          Thumbnail
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No images available
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Variants</h2>
                <div className="space-y-4">
                  {product.variants.map((variant, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3">
                        Variant {index + 1} {variant.size && `- Size: ${variant.size}`}
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {variant.fabric && (
                          <div>
                            <label className="text-sm font-medium text-gray-700">Fabric:</label>
                            <p className="text-gray-900">{variant.fabric}</p>
                          </div>
                        )}
                        
                        {variant.colors && variant.colors.length > 0 && (
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Colors & Stock:</label>
                            <div className="space-y-2">
                              {variant.colors.map((color, colorIndex) => (
                                <div key={colorIndex} className="flex justify-between items-center py-2 border-b border-gray-100">
                                  <span className="text-gray-900">{color.color}</span>
                                  <span className="text-gray-700 font-medium">{color.stock} in stock</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Summary</h2>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Product ID:</label>
                  <p className="text-gray-900 font-mono text-sm">{product._id}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Category:</label>
                  <p className="text-gray-900">{product.category?.name}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Status:</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    product.status === 'Active' 
                      ? 'bg-green-100 text-green-800'
                      : product.status === 'Draft'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.status}
                  </span>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Total Stock:</label>
                  <p className="text-gray-900 font-medium">{product.totalStock || 0} units</p>
                </div>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Pricing</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Cost Price:</span>
                  <span className="text-gray-900 font-medium">${product.costPrice?.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-700">Sale Price:</span>
                  <span className="text-gray-900 font-medium">${product.salePrice?.toFixed(2)}</span>
                </div>
                
                {product.discountedPrice > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Discounted Price:</span>
                      <span className="text-green-600 font-medium">${product.discountedPrice?.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-700">Discount:</span>
                      <span className="text-green-600 font-medium">
                        {product.discountPercentage}% OFF
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-700">You Save:</span>
                      <span className="text-green-600 font-medium">
                        ${(product.salePrice - product.discountedPrice)?.toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700 font-medium">Profit:</span>
                    <span className={`font-medium ${
                      product.profit >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${product.profit?.toFixed(2)}
                    </span>
                  </div>
                  
                  {product.profit > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Profit Margin:</span>
                      <span className="text-green-600">
                        {Math.round((product.profit / product.costPrice) * 100)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Analytics Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Analytics</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Views:</span>
                  <span className="text-gray-900 font-medium">{product.views || 0}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-700">Sales:</span>
                  <span className="text-gray-900 font-medium">{product.sales || 0}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-700">Created:</span>
                  <span className="text-gray-900 text-sm">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-700">Last Updated:</span>
                  <span className="text-gray-900 text-sm">
                    {new Date(product.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}