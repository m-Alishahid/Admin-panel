"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { mockCategories, Category } from "@/lib/categories";

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

export default function EditProduct() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    subcategory: "",
    stock: "",
    variants: {
      size: "",
      color: "",
      fabric: "",
    },
    image: [] as File[],
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    fetchProduct();
  }, [id]);
    
  // Added an effect to set selectedCategory after fetching product data
  useEffect(() => {
    if (!fetchLoading && formData.category) {
      const initialCat = categories.find(cat => cat.name === formData.category);
      setSelectedCategory(initialCat || null);
    }
  }, [fetchLoading, formData.category, categories]); 

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${id}`);
      const product: Product = await response.json();
      setFormData({
        name: product.name,
        price: product.price.toString(),
        category: product.category,
        subcategory: product.subcategory || "",
        stock: product.stock.toString(),
        variants: product.variants || {
          size: "",
          color: "",
          fabric: "",
        },
        image: [],
      });
    } catch (error) {
      console.error("Failed to fetch product:", error);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "category") {
      const selectedCat = categories.find(cat => cat.name === value);
      setSelectedCategory(selectedCat || null);
      setFormData({ ...formData, [name]: value, subcategory: "" });
    } else if (name.startsWith("variants.")) {
      const variantKey = name.split(".")[1];
      setFormData({
        ...formData,
        variants: {
          ...formData.variants,
          [variantKey]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: Category = {
        id: categories.length + 1,
        name: newCategoryName,
        description: `${newCategoryName} category`,
        status: "Active",
        subcategories: [], 
      };
      setCategories([...categories, newCategory]);
      setNewCategoryName("");
      setShowAddCategory(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/products");
      } else {
        console.error("Failed to update product");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return <div className="text-center py-10 text-xl font-semibold text-gray-700">Loading...</div>; 
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-2xl rounded-xl"> 
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-2">Edit Product 📝</h1>

      <form onSubmit={handleSubmit} className="space-y-6"> 
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900 transition duration-150 ease-in-out" // Focus Ring Blue
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <div className="flex space-x-3"> 
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900" // Focus Ring Blue
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowAddCategory(!showAddCategory)}
              className="mt-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition duration-150 text-base font-semibold flex items-center justify-center" // **CHANGED: Add Category button is now Blue**
            >
              <span className="text-xl leading-none">+</span>
            </button>
          </div>
          {showAddCategory && (
            <div className="mt-3 p-4 bg-gray-100 border border-gray-200 rounded-lg"> 
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="New category name"
                className="block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900" // Focus Ring Blue
              />
              <div className="flex space-x-2 mt-3"> 
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium shadow-sm transition duration-150" // (Green for Positive Action)
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCategory(false)}
                  className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium shadow-sm transition duration-150" // (Red for Negative/Cancel Action)
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {selectedCategory && selectedCategory.subcategories && selectedCategory.subcategories.length > 0 && ( 
          <div>
            <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">
              Subcategory
            </label>
            <select
              id="subcategory"
              name="subcategory"
              value={formData.subcategory}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900" // Focus Ring Blue
            >
              <option value="">Select subcategory</option>
              {selectedCategory.subcategories.map((subcategory) => (
                <option key={subcategory.id} value={subcategory.name}>
                  {subcategory.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedCategory && selectedCategory.subcategories && formData.subcategory && (
          <>
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                Stock Quantity
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900" // Focus Ring Blue
              />
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 border-t pt-4">Variants Details</h3> 
              <div className="space-y-4">
                <div>
                  <label htmlFor="variants.size" className="block text-sm font-medium text-gray-700">
                    Size (e.g., S, M, L)
                  </label>
                  <input
                    type="text"
                    id="variants.size"
                    name="variants.size"
                    value={formData.variants.size}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900" // Focus Ring Blue
                  />
                </div>
                <div>
                  <label htmlFor="variants.color" className="block text-sm font-medium text-gray-700">
                    Color (e.g., Red, Blue)
                  </label>
                  <input
                    type="text"
                    id="variants.color"
                    name="variants.color"
                    value={formData.variants.color}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900" // Focus Ring Blue
                  />
                </div>
                <div>
                  <label htmlFor="variants.fabric" className="block text-sm font-medium text-gray-700">
                    Fabric (e.g., Cotton, Silk)
                  </label>
                  <input
                    type="text"
                    id="variants.fabric"
                    name="variants.fabric"
                    value={formData.variants.fabric}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900" // Focus Ring Blue
                  />
                </div>
              </div>
            </div>
          </>
        )}

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price ($)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            required
            className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900" // Focus Ring Blue
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Product Image(s)
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              setFormData({ ...formData, image: files });
            }}
            className="mt-1 block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" // File input color blue
          />
        </div>

        <div className="flex space-x-4 pt-4"> 
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg shadow-lg disabled:opacity-60 transition duration-150 transform hover:scale-[1.01]" // **MAIN BUTTON IS BLUE**
          >
            {loading ? "Updating..." : "Update Product"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/products")}
            className="flex-1 bg-white border border-blue-500 hover:bg-blue-50 text-blue-600 font-medium py-2.5 px-4 rounded-lg shadow-sm transition duration-150" // **Cancel Button is Blue Outline**
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}