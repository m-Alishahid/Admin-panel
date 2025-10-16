"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  subcategory?: string;
  stock: number;
  variants?: {
    size: string;
    color: string;
    fabric: string;
  };
  image?: string;
}

export default function ViewProduct() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${id}`);
      const data: Product = await response.json();
      setProduct(data);
    } catch (error) {
      console.error("Failed to fetch product:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Product Details</h1>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {product.image && (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
            <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain" />
          </div>
        )}

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Product ID</label>
              <p className="mt-2 text-lg text-gray-900 font-medium">{product.id}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Product Name</label>
              <p className="mt-2 text-lg text-gray-900 font-medium">{product.name}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Category</label>
              <p className="mt-2 text-lg text-gray-900">{product.category}</p>
            </div>

            {product.subcategory && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Subcategory</label>
                <p className="mt-2 text-lg text-gray-900">{product.subcategory}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Price</label>
              <p className="mt-2 text-lg text-gray-900 font-semibold">${product.price ? product.price.toFixed(2) : 'N/A'}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Stock</label>
              <p className="mt-2 text-lg text-gray-900">{product.stock}</p>
            </div>
          </div>

          {product.variants && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Variants</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Size</label>
                  <p className="mt-2 text-lg text-gray-900">{product.variants.size}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Color</label>
                  <p className="mt-2 text-lg text-gray-900">{product.variants.color}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Fabric</label>
                  <p className="mt-2 text-lg text-gray-900">{product.variants.fabric}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-4 pt-6 border-t border-gray-200">
            <button
              onClick={() => router.push(`/products/${id}/edit`)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg shadow-md transition duration-200"
            >
              Update Product
            </button>
            <button
              onClick={() => router.push("/products")}
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg shadow-md transition duration-200"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
