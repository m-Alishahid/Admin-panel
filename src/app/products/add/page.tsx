"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { mockCategories, Category } from "@/lib/categories";

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    variants: [{ size: "", colors: [] as string[], fabric: "", stock: "" }],
    image: [] as File[],
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>(mockCategories);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "category") {
      setFormData({ ...formData, category: value });
    } else if (name.startsWith("variants.")) {
      const parts = name.split(".");
      const index = parseInt(parts[1]);
      const key = parts[2];
      const newVariants = [...formData.variants];
      if (key === "colors") {
        newVariants[index][key] = value.split(",").map(c => c.trim());
      } else {
        (newVariants[index] as Record<string, unknown>)[key] = value;
      }
      setFormData({ ...formData, variants: newVariants });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { size: "", colors: [], fabric: "", stock: "" }],
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData({ ...formData, image: files });
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/products");
      } else {
        console.error("Failed to add product");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-indigo-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Add New Product</h1>
            <p className="text-indigo-100 mt-1">Fill in the details to add a product to your inventory.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 transition duration-200"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 transition duration-200"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 transition duration-200"
                placeholder="Describe the product"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                  Price
                </label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 transition duration-200"
                  placeholder="e.g., 99.99"
                />
              </div>

              <div>
                <label htmlFor="stock" className="block text-sm font-semibold text-gray-700 mb-2">
                  Total Stock
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 transition duration-200"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Product Variants
              </label>
              <div className="space-y-4">
                {formData.variants.map((variant, index) => (
                  <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Variant {index + 1}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor={`variants.${index}.size`} className="block text-sm font-medium text-gray-700 mb-1">
                          Size
                        </label>
                        <select
                          id={`variants.${index}.size`}
                          name={`variants.${index}.size`}
                          value={variant.size}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 transition duration-200"
                        >
                          <option value="">Select size</option>
                          <option value="S">S</option>
                          <option value="M">M</option>
                          <option value="L">L</option>
                          <option value="XL">XL</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor={`variants.${index}.colors`} className="block text-sm font-medium text-gray-700 mb-1">
                          Colors
                        </label>
                        <input
                          type="text"
                          id={`variants.${index}.colors`}
                          name={`variants.${index}.colors`}
                          value={variant.colors.join(", ")}
                          onChange={handleChange}
                          placeholder="e.g., Red, Blue, Green"
                          className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 transition duration-200"
                        />
                      </div>
                      <div>
                        <label htmlFor={`variants.${index}.fabric`} className="block text-sm font-medium text-gray-700 mb-1">
                          Fabric
                        </label>
                        <input
                          type="text"
                          id={`variants.${index}.fabric`}
                          name={`variants.${index}.fabric`}
                          value={variant.fabric}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 transition duration-200"
                          placeholder="e.g., Cotton"
                        />
                      </div>
                      <div>
                        <label htmlFor={`variants.${index}.stock`} className="block text-sm font-medium text-gray-700 mb-1">
                          Variant Stock
                        </label>
                        <input
                          type="text"
                          id={`variants.${index}.stock`}
                          name={`variants.${index}.stock`}
                          value={variant.stock}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 transition duration-200"
                          placeholder="e.g., 10"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {formData.variants.length > 0 && formData.variants[formData.variants.length - 1].size && formData.variants[formData.variants.length - 1].colors.length > 0 && formData.variants[formData.variants.length - 1].fabric && formData.variants[formData.variants.length - 1].stock && (
                <button
                  type="button"
                  onClick={addVariant}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200 flex items-center"
                >
                  <span className="mr-2">+</span> Add Another Variant
                </button>
              )}
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-2">
                Product Images
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 transition duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-200 flex-1"
              >
                {loading ? "Adding Product..." : "Add Product"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/products")}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
