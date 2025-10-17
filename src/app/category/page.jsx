"use client";

import { useState, useRef, useEffect } from "react";
import { categoryService } from "@/services/categoryService";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [currentCategory, setCurrentCategory] = useState({
    name: "", 
    description: "", 
    image: "",
    requiresSize: false,
    requiresColor: false,
    hasVariants: false,
    shippingCost: 0,
    taxRate: 0,
    seoTitle: "",
    seoDescription: "",
    metaKeywords: "",
    isFeatured: false,
    status: "Active"
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Load categories from API
  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to load categories:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, image: "Please upload a valid image (JPEG, PNG, WebP)" }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: "Image size should be less than 5MB" }));
        return;
      }

      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // In real application, you would upload the file to your server here
      // For now, we'll simulate by setting a mock URL
      setCurrentCategory(prev => ({ 
        ...prev, 
        image: `/uploads/categories/${Date.now()}-${file.name}` 
      }));

      // Clear any previous image errors
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: "" }));
      }
    }
  };

  // Remove image
  const handleRemoveImage = () => {
    setImagePreview(null);
    setCurrentCategory(prev => ({ ...prev, image: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!currentCategory.name.trim()) {
      newErrors.name = "Category name is required";
    } else if (currentCategory.name.length < 2) {
      newErrors.name = "Category name must be at least 2 characters";
    }

    if (!currentCategory.description.trim()) {
      newErrors.description = "Description is required";
    } else if (currentCategory.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!currentCategory.image) {
      newErrors.image = "Category image is required";
    }

    if (currentCategory.taxRate < 0 || currentCategory.taxRate > 100) {
      newErrors.taxRate = "Tax rate must be between 0 and 100";
    }

    if (currentCategory.shippingCost < 0) {
      newErrors.shippingCost = "Shipping cost cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSaveCategory = async () => {
    if (!validateForm()) return;

    setSubmitLoading(true);
    try {
      if (formMode === 'add') {
        await categoryService.create(currentCategory);
        alert('Category created successfully!');
      } else {
        await categoryService.update(currentCategory._id, currentCategory);
        alert('Category updated successfully!');
      }
      resetForm();
      loadCategories(); // Reload categories
    } catch (error) {
      console.error('Failed to save category:', error);
      alert(error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Edit category
  const handleEditCategory = (category) => {
    setCurrentCategory(category);
    setImagePreview(category.image);
    setFormMode('edit');
    setShowForm(true);
  };

  // Delete category
  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await categoryService.delete(id);
      alert('Category deleted successfully!');
      loadCategories(); // Reload categories
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert(error.message);
    }
  };

  // Toggle status
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      await categoryService.toggleStatus(id, newStatus);
      alert(`Category ${newStatus.toLowerCase()} successfully!`);
      loadCategories(); // Reload categories
    } catch (error) {
      console.error('Failed to update status:', error);
      alert(error.message);
    }
  };

  // Reset form
  const resetForm = () => {
    setCurrentCategory({
      name: "", 
      description: "", 
      image: "",
      requiresSize: false,
      requiresColor: false,
      hasVariants: false,
      shippingCost: 0,
      taxRate: 0,
      seoTitle: "",
      seoDescription: "",
      metaKeywords: "",
      isFeatured: false,
      status: "Active"
    });
    setImagePreview(null);
    setErrors({});
    setShowForm(false);
    setFormMode('add');
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    setCurrentCategory(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
          <p className="text-gray-600 mt-1">Manage your product categories and their properties</p>
        </div>
        <button
          onClick={() => {
            setFormMode('add');
            setShowForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-200 flex items-center"
          disabled={submitLoading}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {submitLoading ? 'Loading...' : 'Add Category'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {formMode === 'add' ? 'Add New Category' : 'Edit Category'}
          </h2>
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={currentCategory.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-black ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter category name"
                  disabled={submitLoading}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Image *
              </label>
              <div className="mt-1 flex items-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                  id="image-upload"
                  disabled={submitLoading}
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Choose Image
                </label>
                <span className="ml-3 text-sm text-gray-500">
                  JPEG, PNG, WebP (Max 5MB)
                </span>
              </div>
              {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
              
              {/* Image Preview */}
              {(imagePreview || currentCategory.image) && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Preview
                  </label>
                  <div className="relative inline-block">
                    <img 
                      src={imagePreview || currentCategory.image} 
                      alt="Preview" 
                      className="h-32 w-32 object-cover rounded-md border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      disabled={submitLoading}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                value={currentCategory.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter category description"
                disabled={submitLoading}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            {/* Product Properties */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Product Properties</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={currentCategory.requiresSize}
                    onChange={(e) => handleInputChange('requiresSize', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={submitLoading}
                  />
                  <span className="ml-2 text-sm text-gray-700">Requires Size Selection</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={currentCategory.requiresColor}
                    onChange={(e) => handleInputChange('requiresColor', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={submitLoading}
                  />
                  <span className="ml-2 text-sm text-gray-700">Requires Color Selection</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={currentCategory.hasVariants}
                    onChange={(e) => handleInputChange('hasVariants', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={submitLoading}
                  />
                  <span className="ml-2 text-sm text-gray-700">Has Product Variants</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={currentCategory.isFeatured}
                    onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={submitLoading}
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured Category</span>
                </label>
              </div>
            </div>

            {/* Financial Settings */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="shippingCost" className="block text-sm font-medium text-gray-700 mb-1">
                    Shipping Cost (₹)
                  </label>
                  <input
                    type="number"
                    id="shippingCost"
                    value={currentCategory.shippingCost}
                    onChange={(e) => handleInputChange('shippingCost', parseFloat(e.target.value) || 0)}
                    className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-black ${
                      errors.shippingCost ? 'border-red-500' : 'border-gray-300'
                    }`}
                    min="0"
                    step="0.01"
                    disabled={submitLoading}
                  />
                  {errors.shippingCost && <p className="text-red-500 text-xs mt-1">{errors.shippingCost}</p>}
                </div>

                <div>
                  <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700 mb-1">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    id="taxRate"
                    value={currentCategory.taxRate}
                    onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value) || 0)}
                    className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-black ${
                      errors.taxRate ? 'border-red-500' : 'border-gray-300'
                    }`}
                    min="0"
                    max="100"
                    step="0.1"
                    disabled={submitLoading}
                  />
                  {errors.taxRate && <p className="text-red-500 text-xs mt-1">{errors.taxRate}</p>}
                </div>
              </div>
            </div>

            {/* SEO Section */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    id="seoTitle"
                    value={currentCategory.seoTitle}
                    onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-black"
                    placeholder="SEO title for search engines"
                    disabled={submitLoading}
                  />
                </div>
                <div>
                  <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    SEO Description
                  </label>
                  <textarea
                    id="seoDescription"
                    value={currentCategory.seoDescription}
                    onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                    rows={2}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                    placeholder="Meta description for search engines"
                    disabled={submitLoading}
                  />
                </div>
                <div>
                  <label htmlFor="metaKeywords" className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Keywords
                  </label>
                  <input
                    type="text"
                    id="metaKeywords"
                    value={currentCategory.metaKeywords}
                    onChange={(e) => handleInputChange('metaKeywords', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-black"
                    placeholder="Comma separated keywords"
                    disabled={submitLoading}
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex space-x-4 pt-4 border-t">
              <button
                onClick={handleSaveCategory}
                disabled={submitLoading}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {submitLoading ? 'Saving...' : (formMode === 'add' ? 'Add Category' : 'Update Category')}
              </button>
              <button
                onClick={resetForm}
                disabled={submitLoading}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading categories...</p>
        </div>
      )}

      {/* Categories Table */}
      {!loading && (
        <>
          <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name & Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Properties
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Financial
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img 
                        src={category.image} 
                        alt={category.name}
                        className="h-12 w-12 rounded-md object-cover border border-gray-300"
                        // onError={(e) => {
                        //   e.target.src = '/images/placeholder.jpg';
                        // }}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{category.name}</div>
                      <div className="text-sm text-gray-600 mt-1 line-clamp-2">{category.description}</div>
                      {category.isFeatured && (
                        <span className="inline-flex items-center px-2 py-1 mt-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {category.requiresSize && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                            Size
                          </span>
                        )}
                        {category.requiresColor && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-purple-800 bg-purple-100 rounded-full">
                            Color
                          </span>
                        )}
                        {category.hasVariants && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                            Variants
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>Shipping: ₹{category.shippingCost}</div>
                      <div>Tax: {category.taxRate}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(category._id, category.status)}
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full cursor-pointer ${
                          category.status === 'Active' 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {category.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="text-blue-600 hover:text-blue-900 transition duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category._id)}
                          className="text-red-600 hover:text-red-900 transition duration-200"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">{categories.length}</div>
              <div className="text-sm text-gray-600">Total Categories</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <div className="text-2xl font-bold text-green-600">
                {categories.filter(cat => cat.status === 'Active').length}
              </div>
              <div className="text-sm text-gray-600">Active Categories</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <div className="text-2xl font-bold text-yellow-600">
                {categories.filter(cat => cat.isFeatured).length}
              </div>
              <div className="text-sm text-gray-600">Featured Categories</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">
                {categories.filter(cat => cat.requiresSize).length}
              </div>
              <div className="text-sm text-gray-600">Size Required</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}