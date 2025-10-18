"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';

export default function EditProduct() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    costPrice: "",
    salePrice: "",
    discountedPrice: "",
    category: "",
    variants: [{ size: "", colors: [{ color: "", stock: "" }], fabric: "" }],
    images: [],
    thumbnailIndex: 0,
    status: "Active"
  });
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    if (id) {
      fetchProduct();
      loadCategories();
    }
  }, [id]);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAll();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await productService.getById(id);
      if (response.success) {
        const product = response.data;
        setFormData({
          name: product.name || "",
          description: product.description || "",
          costPrice: product.costPrice?.toString() || "",
          salePrice: product.salePrice?.toString() || "",
          discountedPrice: product.discountedPrice?.toString() || "",
          category: product.category?._id || "",
          variants: product.variants || [{ size: "", colors: [{ color: "", stock: "" }], fabric: "" }],
          images: product.images || [],
          thumbnailIndex: product.thumbnail ? product.images.indexOf(product.thumbnail) : 0,
          status: product.status || "Active"
        });

        // Set selected category
        if (product.category) {
          const category = categories.find(cat => cat._id === product.category._id);
          setSelectedCategory(category);
        }
      }
    } catch (error) {
      console.error("Failed to fetch product:", error);
      alert("Failed to load product data");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "category") {
      const category = categories.find(cat => cat._id === value);
      setSelectedCategory(category);
      setFormData({ ...formData, category: value });
    } else if (name.startsWith("variants.")) {
      const parts = name.split(".");
      const index = parseInt(parts[1]);
      const key = parts[2];
      const newVariants = [...formData.variants];
      
      if (key === "colors") {
        const colorIndex = parseInt(parts[3]);
        const subKey = parts[4];
        if (subKey === "color") {
          newVariants[index].colors[colorIndex].color = value;
        } else if (subKey === "stock") {
          newVariants[index].colors[colorIndex].stock = value;
        }
      } else {
        newVariants[index][key] = value;
      }
      setFormData({ ...formData, variants: newVariants });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { size: "", colors: [{ color: "", stock: "" }], fabric: "" }],
    });
  };

  const addColor = (variantIndex) => {
    const newVariants = [...formData.variants];
    newVariants[variantIndex].colors.push({ color: "", stock: "" });
    setFormData({ ...formData, variants: newVariants });
  };

  const removeColor = (variantIndex, colorIndex) => {
    const newVariants = [...formData.variants];
    newVariants[variantIndex].colors.splice(colorIndex, 1);
    setFormData({ ...formData, variants: newVariants });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({ 
      ...prev, 
      images: [...prev.images, ...files],
    }));
  };
  
  const setThumbnail = (index) => {
    setFormData(prev => ({
      ...prev,
      thumbnailIndex: index,
    }));
  };
  
  const removeImage = (indexToRemove) => {
    setFormData(prev => {
      const newImages = prev.images.filter((_, index) => index !== indexToRemove);
      let newThumbnailIndex = prev.thumbnailIndex;

      if (prev.thumbnailIndex === indexToRemove) {
        newThumbnailIndex = newImages.length > 0 ? 0 : 0;
      } else if (prev.thumbnailIndex > indexToRemove) {
        newThumbnailIndex = prev.thumbnailIndex - 1;
      }
      
      return {
        ...prev,
        images: newImages,
        thumbnailIndex: newThumbnailIndex,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Append basic fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('costPrice', formData.costPrice);
      formDataToSend.append('salePrice', formData.salePrice);
      formDataToSend.append('discountedPrice', formData.discountedPrice || '');
      formDataToSend.append('category', formData.category);
      formDataToSend.append('variants', JSON.stringify(formData.variants));
      formDataToSend.append('thumbnailIndex', formData.thumbnailIndex);
      formDataToSend.append('status', formData.status);
      
      // Append new images
      formData.images.forEach((file, index) => {
        if (file instanceof File) {
          formDataToSend.append(`images[${index}]`, file);
        }
      });

      const result = await productService.update(id, formDataToSend);

      if (result.success) {
        alert("Product updated successfully!");
        router.push('/products');
      } else {
        alert(result.error || "Failed to update product.");
      }
    } catch (error) {
      console.error('Product update error:', error);
      alert("An error occurred during submission.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
              <p className="text-gray-600 mt-1">Update product information and inventory</p>
            </div>
            <button
              onClick={() => router.push('/products')}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter product description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cost Price ($) *
                </label>
                <input
                  type="number"
                  name="costPrice"
                  value={formData.costPrice}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sale Price ($) *
                </label>
                <input
                  type="number"
                  name="salePrice"
                  value={formData.salePrice}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discounted Price ($)
                </label>
                <input
                  type="number"
                  name="discountedPrice"
                  value={formData.discountedPrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Variants Section */}
          {selectedCategory?.hasVariants && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Variants</h2>
              <div className="space-y-6">
                {formData.variants.map((variant, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Variant {index + 1}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {selectedCategory?.requiresSize && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Size
                          </label>
                          <select
                            name={`variants.${index}.size`}
                            value={variant.size}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select size</option>
                            {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                              <option key={size} value={size}>{size}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fabric
                        </label>
                        <input
                          type="text"
                          name={`variants.${index}.fabric`}
                          value={variant.fabric}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., Cotton, Polyester"
                        />
                      </div>
                    </div>

                    {selectedCategory?.requiresColor && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Colors & Stock
                        </label>
                        <div className="space-y-3">
                          {variant.colors.map((color, colorIndex) => (
                            <div key={colorIndex} className="flex items-center gap-3">
                              <input
                                type="text"
                                name={`variants.${index}.colors.${colorIndex}.color`}
                                value={color.color}
                                onChange={handleChange}
                                placeholder="Color name"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                              <input
                                type="number"
                                name={`variants.${index}.colors.${colorIndex}.stock`}
                                value={color.stock}
                                onChange={handleChange}
                                placeholder="Stock"
                                min="0"
                                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                              <button
                                type="button"
                                onClick={() => removeColor(index, colorIndex)}
                                className="text-red-500 hover:text-red-700 p-2"
                              >
                                🗑️
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addColor(index)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            + Add Color Option
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addVariant}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                >
                  + Add Another Variant
                </button>
              </div>
            </div>
          )}

          {/* Images Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Images</h2>
            
            <div className="mb-4">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.map((file, index) => (
                <div key={index} className={`border-2 rounded-lg p-2 transition ${
                  formData.thumbnailIndex === index ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'
                }`}>
                  <div className="w-full h-24 bg-gray-100 rounded-md overflow-hidden mb-2">
                    <img 
                      src={file instanceof File ? URL.createObjectURL(file) : file} 
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setThumbnail(index)}
                      className={`text-xs px-2 py-1 rounded ${
                        formData.thumbnailIndex === index 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {formData.thumbnailIndex === index ? 'Thumbnail' : 'Set as Thumbnail'}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.push('/products')}
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Updating...' : 'Update Product'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}