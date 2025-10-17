"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// --- Types & Mock Data ---
interface Category {
  id: number;
  name: string;
}

interface ColorStock {
  color: string;
  stock: string;
}

interface Variant {
  size: string;
  colors: ColorStock[];
  fabric: string;
}

interface FormData {
    name: string;
    description: string;
    price: string;
    category: string;
    stock: string;
    variants: Variant[];
    image: File[];
    thumbnailIndex: number; // New state to track the index of the thumbnail image
}

const mockCategories: Category[] = [
  { id: 1, name: "T-Shirts" },
  { id: 2, name: "Hoodies" },
  { id: 3, name: "Accessories" },
];
// -----------------

// --- Product Preview Component (Updated for Thumbnail and Variants) ---
const ProductPreview = ({ formData }: { formData: FormData }) => {
  const { name, description, price, variants, image, thumbnailIndex } = formData;

  // State for selected size and color in preview
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [selectedColor, setSelectedColor] = useState<string>('');

  // Logic to determine the image for the live preview
  let previewImage = 'https://images.unsplash.com/photo-1571402325950-891d06b69460?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0OTI3MDV8MHwxfHNlYXJjaHw1fHxibGFjayUyMHRzaGlydHxlbnwwfHx8fDE3MTgyNTg5MjF8MA&ixlib=rb-4.0.3&q=80&w=400';

  if (image.length > 0) {
      // Use the thumbnail image if set and available, otherwise use the first image
      const imageToShow = thumbnailIndex !== -1 && image[thumbnailIndex] ? image[thumbnailIndex] : image[0];
      previewImage = URL.createObjectURL(imageToShow);
  }

  // Get available sizes from variants
  const availableSizes = variants.filter(v => v.size).map(v => v.size);
  const defaultSize = availableSizes.length > 0 ? availableSizes[0] : 'M';

  // Get the selected variant based on selectedSize
  const selectedVariant = variants.find(v => v.size === selectedSize) || variants.find(v => v.size) || variants[0];

  // Get all unique colors from all variants
  const allColors = variants.flatMap(v => v.colors.filter(c => c.color));
  const uniqueColors = Array.from(new Set(allColors.map(c => c.color))).map(color => ({ color }));

  // Get colors for the selected variant (for display in details)
  const availableColors = selectedVariant?.colors.filter(c => c.color) || [];

  // Set default selectedColor if not set or not available
  useEffect(() => {
    if (availableColors.length > 0 && !availableColors.some(c => c.color === selectedColor)) {
      setSelectedColor(availableColors[0].color);
    } else if (availableColors.length === 0) {
      setSelectedColor('');
    }
  }, [selectedSize, availableColors, selectedColor]);

  // Update selectedSize if defaultSize changes
  useEffect(() => {
    if (!availableSizes.includes(selectedSize)) {
      setSelectedSize(defaultSize);
    }
  }, [defaultSize, availableSizes, selectedSize]);

  const defaultName = "Product Name Preview";
  const defaultDescription = "Short description will appear here...";

  return (
    <div className="p-6 border border-gray-200 rounded-xl shadow-lg bg-white sticky top-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Live Preview</h2>

      {/* Product Image */}
      <div className="w-full h-80 bg-gray-100 rounded-lg overflow-hidden mb-4 border border-gray-200 flex items-center justify-center">
        {image.length > 0 ? (
          <img
            src={previewImage}
            alt={name || defaultName}
            className="w-full h-full object-cover"
          />
        ) : (
           <p className="text-gray-400 text-sm">Upload an image to see the preview</p>
        )}
      </div>

      {/* Product Info */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-bold text-gray-900">{name || defaultName}</h3>
        <p className="text-2xl font-bold text-blue-600">
          {price ? `$${price}` : "$0.00"}
        </p>
      </div>

      <p className="text-sm text-gray-500 mb-4">{description.split('\n')[0] || defaultDescription}</p>

      {/* Options/Variants Preview */}
      <div className="space-y-4 mb-6">
        {/* Size Selector */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Size</p>
          <div className="flex space-x-2 flex-wrap">
            {availableSizes.length > 0 ? availableSizes.map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`py-1 px-3 border rounded-lg text-sm font-medium transition ${
                  size === selectedSize ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {size}
              </button>
            )) : (
              <span className="py-1 px-3 border rounded-lg text-sm font-medium bg-gray-100 text-gray-500 border-gray-300">
                No sizes available
              </span>
            )}
          </div>
        </div>

        {/* Color Selector */}
        {uniqueColors.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Color</p>
            <div className="flex space-x-2 flex-wrap">
              {uniqueColors.map(color => (
                <button
                  key={color.color}
                  onClick={() => setSelectedColor(color.color)}
                  className={`py-1 px-3 border rounded-lg text-sm font-medium transition ${
                    color.color === selectedColor ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {color.color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Variants Summary */}
        {variants.length > 0 && variants.some(v => v.size || v.colors.some(c => c.color)) && (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Variants Added</p>
            <div className="space-y-2">
              {variants.filter(v => v.size || v.colors.some(c => c.color)).map((variant, index) => (
                <div key={index} className="bg-gray-50 p-2 rounded-lg text-xs">
                  <p className="font-medium">Size: {variant.size || 'N/A'}</p>
                  {variant.colors.filter(c => c.color).length > 0 && (
                    <p>Colors: {variant.colors.filter(c => c.color).map(c => c.color).join(', ')}</p>
                  )}
                  {variant.fabric && <p>Fabric: {variant.fabric}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Button (Placeholder) */}
      <button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-200"
      >
        Buy Now
      </button>

      {/* Extra Details */}
      <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500 space-y-1">
        <p>Category: {formData.category || 'N/A'}</p>
        {selectedVariant?.fabric && <p>Fabric: {selectedVariant.fabric || 'N/A'}</p>}
        {selectedColor && <p>Selected Color: {selectedColor}</p>}
      </div>
    </div>
  );
};

// --- Add Product Form Component ---
export default function AddProduct() {
  // === INITIAL STATE (ALL FIELDS EMPTY) ===
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "0", 
    variants: [{ size: "", colors: [{ color: "", stock: "" }], fabric: "" }], 
    image: [] as File[],
    thumbnailIndex: -1, // -1 means no thumbnail set initially
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [showPreview, setShowPreview] = useState(true);

  const router = useRouter();

  // === Effect to calculate total stock ===
  useEffect(() => {
    const totalStock = formData.variants.reduce((sum, variant) => {
      const variantStock = variant.colors.reduce((colorSum, color) => {
        return colorSum + (parseInt(color.stock) || 0);
      }, 0);
      return sum + variantStock;
    }, 0);
    setFormData(prev => ({ ...prev, stock: totalStock.toString() }));
  }, [formData.variants]);
  

  // --- Handlers ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.currentTarget;
    
    if (name === "category") {
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
        // Narrow the key to known Variant properties and immutably update the variant
        const k = key as "size" | "fabric";
        if (k === "size" || k === "fabric") {
          newVariants[index] = { ...newVariants[index], [k]: value };
        }
      }
      setFormData({ ...formData, variants: newVariants });
    } else if (name !== "stock") { 
      setFormData({ ...formData, [name]: value });
    }
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { size: "", colors: [{ color: "", stock: "" }], fabric: "" }],
    });
  };

  const addColor = (variantIndex: number) => {
    const newVariants = [...formData.variants];
    newVariants[variantIndex].colors.push({ color: "", stock: "" });
    setFormData({ ...formData, variants: newVariants });
  };

  const removeColor = (variantIndex: number, colorIndex: number) => {
    const newVariants = [...formData.variants];
    newVariants[variantIndex].colors.splice(colorIndex, 1);
    setFormData({ ...formData, variants: newVariants });
  };

  // Handler for multiple image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({ 
        ...prev, 
        image: [...prev.image, ...files], // Add new files to the existing array
    }));
  };
  
  // Handler to set the thumbnail
  const setThumbnail = (index: number) => {
      setFormData(prev => ({
          ...prev,
          thumbnailIndex: index,
      }));
  };
  
  // Handler to remove an image
  const removeImage = (indexToRemove: number) => {
    setFormData(prev => {
        const newImages = prev.image.filter((_, index) => index !== indexToRemove);
        let newThumbnailIndex = prev.thumbnailIndex;

        // Adjust thumbnail index if the removed image was the thumbnail
        if (prev.thumbnailIndex === indexToRemove) {
            newThumbnailIndex = newImages.length > 0 ? 0 : -1; // Set to first image or -1 if empty
        } else if (prev.thumbnailIndex > indexToRemove) {
            newThumbnailIndex = prev.thumbnailIndex - 1; // Shift the index down
        }
        
        return {
            ...prev,
            image: newImages,
            thumbnailIndex: newThumbnailIndex,
        };
    });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('variants', JSON.stringify(formData.variants));
      formData.image.forEach((file, index) => {
        formDataToSend.append('image', file);
      });

      const response = await fetch('/api/products', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        alert("Product added successfully!");
        router.push('/products');
      } else {
        alert("Failed to add product.");
      }
    } catch (error) {
      alert("An error occurred during submission.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* === Top Action Bar === */}
        <div className="flex justify-between items-center bg-white p-4 rounded-t-lg shadow-md border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => router.push('/products')}
              className="px-4 py-2 text-sm font-medium text-blue-700 bg-white border border-blue-300 rounded-lg hover:bg-blue-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="product-form"
              disabled={loading}
              // Blue color for the main action button
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition shadow-md"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
        {/* --- */}

        {/* === Main Content Area (Form 2/3 and Preview 1/3) === */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
          
          {/* --- Form Column (lg:col-span-2) --- */}
          <div className="lg:col-span-2 bg-white shadow-lg rounded-xl overflow-hidden p-6">
            <form id="product-form" onSubmit={handleSubmit} className="space-y-8">
              
              {/* --- Base Information --- */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Base Information</h2>
                <div className="space-y-4">
                  
                  {/* Title/Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Product Title
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      // Changed focus ring to blue
                      className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition duration-200"
                      placeholder="Enter a descriptive and unique product title"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={5}
                       // Changed focus ring to blue
                      className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition duration-200"
                      placeholder="Enter a detailed product description, including material, features, and care instructions."
                    />
                  </div>
                </div>
              </div>
              
              {/* --- Pictures --- */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Images</h2>
                <div>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        // Changed file input colors to blue
                        className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 bg-white text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    
                    {/* Image Preview Thumbnails & Set Thumbnail Button */}
                    <div className="flex flex-wrap gap-4 pt-4">
                        {formData.image.map((file, index) => (
                            <div key={index} className={`w-36 border-2 rounded-lg p-1 transition ${formData.thumbnailIndex === index ? 'border-blue-500 ring-4 ring-blue-200' : 'border-gray-300'}`}>
                                <div className="w-full h-24 overflow-hidden rounded-md mb-2">
                                    <img src={URL.createObjectURL(file)} alt={`Product Image ${index + 1}`} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex justify-between items-center space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => setThumbnail(index)}
                                        disabled={formData.thumbnailIndex === index}
                                        className={`flex-1 text-xs font-medium py-1 px-1 rounded transition ${formData.thumbnailIndex === index 
                                            ? 'bg-blue-600 text-white cursor-default' 
                                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                        }`}
                                        title="Set as Thumbnail"
                                    >
                                        {formData.thumbnailIndex === index ? 'Thumbnail Set' : 'Set Thumbnail'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="text-red-500 hover:text-red-700 p-1"
                                        title="Remove Image"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
              </div>

              {/* --- Details (Price, Category, Stock) --- */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Pricing & Category</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Price */}
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                            Price ($)
                        </label>
                        <input
                            type="text"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            // Changed focus ring to blue
                            className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition duration-200"
                            placeholder="e.g., 12.99"
                        />
                    </div>
                    {/* Category */}
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                          Category
                      </label>
                      <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          required
                          // Changed focus ring to blue
                          className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition duration-200"
                      >
                          <option value="">Select a category</option>
                          {categories.map((category) => (
                              <option key={category.id} value={category.name}>
                                  {category.name}
                              </option>
                          ))}
                      </select>
                    </div>
                    {/* Total Stock (Read Only) */}
                    <div>
                        <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                            Total Stock
                        </label>
                        <input
                            type="number"
                            id="stock"
                            name="stock"
                            value={formData.stock}
                            readOnly
                            className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 bg-gray-100 text-gray-900"
                            placeholder="0"
                        />
                    </div>
                </div>
              </div>

              {/* --- Product Variants --- */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Variants</h2>
                <div className="space-y-6">
                  {formData.variants.map((variant, index) => (
                    <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm">
                      <h3 className="text-lg font-medium text-gray-900 mb-3 border-b pb-2">Variant {index + 1} ({variant.size || 'New Size'})</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        
                        {/* Size */}
                        <div>
                          <label htmlFor={`variants.${index}.size`} className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                          <select
                            id={`variants.${index}.size`}
                            name={`variants.${index}.size`}
                            value={variant.size}
                            onChange={handleChange}
                            // Changed focus ring to blue
                            className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition duration-200"
                          >
                            <option value="">Select size</option>
                            {['S', 'M', 'L', 'XL', 'XXL'].map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        
                        {/* Fabric */}
                        <div>
                          <label htmlFor={`variants.${index}.fabric`} className="block text-sm font-medium text-gray-700 mb-1">Fabric</label>
                          <input
                            type="text"
                            id={`variants.${index}.fabric`}
                            name={`variants.${index}.fabric`}
                            value={variant.fabric}
                            onChange={handleChange}
                            // Changed focus ring to blue
                            className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition duration-200"
                            placeholder="e.g., Cotton, Polyester"
                          />
                        </div>
                        
                        {/* Colors and Stock */}
                        <div className="sm:col-span-3">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Colors & Stock</label>
                          <div className="space-y-3">
                            {variant.colors.map((color, colorIndex) => (
                              <div key={colorIndex} className="flex items-center space-x-3">
                                <input
                                  type="text"
                                  id={`variants.${index}.colors.${colorIndex}.color`}
                                  name={`variants.${index}.colors.${colorIndex}.color`}
                                  value={color.color}
                                  onChange={handleChange}
                                  placeholder="Color name (e.g., Red)"
                                  // Changed focus ring to blue
                                  className="flex-1 border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition duration-200"
                                />
                                <input
                                  type="number"
                                  id={`variants.${index}.colors.${colorIndex}.stock`}
                                  name={`variants.${index}.colors.${colorIndex}.stock`}
                                  value={color.stock}
                                  onChange={handleChange}
                                  placeholder="Stock"
                                  min="0"
                                  // Changed focus ring to blue
                                  className="w-20 border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition duration-200"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeColor(index, colorIndex)}
                                  className="text-red-500 hover:text-red-700 p-1"
                                >
                                  {/* Trash Icon */}
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => addColor(index)}
                              // Blue color for "Add Color Option"
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center mt-2"
                            >
                              <span className="mr-1 text-lg leading-none">+</span> Add Color Option
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addVariant}
                    // Blue color for "Add Another Size/Variant"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200 flex items-center mt-4"
                  >
                    <span className="mr-2">+</span> Add Another Size/Variant
                  </button>
                </div>
              </div>

            </form>
          </div>

          {/* --- Preview Column (lg:col-span-1) --- */}
          <div className="lg:col-span-1">
            {showPreview && <ProductPreview formData={formData} />}
          </div>
          
        </div>
        
        {/* Button to show/hide preview (optional, for smaller screens) */}
        <div className="lg:hidden mt-6">
            <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg shadow-md transition duration-200"
            >
                {showPreview ? "Hide Preview" : "Show Live Preview"}
            </button>
        </div>
        
      </div>
    </div>
  );
}
