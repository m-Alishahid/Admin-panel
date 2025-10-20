"use client";

import { useState, useEffect } from "react";
import { discountService } from '@/services/discountService';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Calendar,
  Package,
  Tag,
  AlertTriangle
} from "lucide-react";

export default function DiscountManager() {
  const [discounts, setDiscounts] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    scope: "all",
    category: "",
    products: [],
    applicationMethod: "best_price",
    startDate: "",
    endDate: "",
    status: "Active",
    autoRemove: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [discountsRes, productsRes, categoriesRes] = await Promise.all([
        discountService.getAll(),
        productService.getAll({ limit: 1000 }),
        categoryService.getAll()
      ]);

      if (discountsRes.success) setDiscounts(discountsRes.data);
      if (productsRes.success) setProducts(productsRes.data?.products || []);
      if (categoriesRes.success) setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkExpiredDiscounts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/discounts/expire', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to check expiry');
      }
      
      const result = await response.json();
      
      if (result.success) {
        alert(`Auto-expiry check completed: ${result.message}`);
        loadData();
      } else {
        alert(result.error || 'Failed to check expiry');
      }
    } catch (error) {
      console.error('Failed to check expired discounts:', error);
      alert('Failed to check expired discounts');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleProductSelection = (productId, isSelected) => {
    if (isSelected) {
      setSelectedProducts(prev => [...prev, productId]);
      setFormData(prev => ({ ...prev, products: [...prev.products, productId] }));
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
      setFormData(prev => ({ ...prev, products: prev.products.filter(id => id !== productId) }));
    }
  };

  const handleSelectAllProducts = () => {
    const allProductIds = products.map(product => product._id);
    setSelectedProducts(allProductIds);
    setFormData(prev => ({ ...prev, products: allProductIds }));
  };

  const handleClearSelection = () => {
    setSelectedProducts([]);
    setFormData(prev => ({ ...prev, products: [] }));
  };

  const calculateNewPrice = (product) => {
    if (!formData.discountValue) return product.salePrice;

    const discountValue = parseFloat(formData.discountValue);
    
    if (formData.discountType === 'percentage') {
      const discountAmount = product.salePrice * (discountValue / 100);
      return Math.max(0, product.salePrice - discountAmount);
    } else {
      return Math.max(0, product.salePrice - discountValue);
    }
  };

  const getAffectedProducts = () => {
    switch (formData.scope) {
      case 'all':
        return products;
      case 'category':
        return products.filter(product => product.category?._id === formData.category);
      case 'selected':
        return products.filter(product => selectedProducts.includes(product._id));
      default:
        return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = { ...formData };
      submitData.discountValue = parseFloat(submitData.discountValue);
      
      if (submitData.scope !== 'category') {
        submitData.category = undefined;
      }
      
      if (submitData.scope !== 'selected') {
        submitData.products = [];
      }

      const result = await discountService.create(submitData);
      if (result.success) {
        alert('Discount created successfully!');
        setShowForm(false);
        resetForm();
        loadData();
      } else {
        alert(result.error || 'Failed to create discount');
      }
    } catch (error) {
      console.error('Create discount error:', error);
      alert('Failed to create discount. Please check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDiscount = async (discountId) => {
    if (!confirm('Are you sure you want to remove this discount?')) return;

    try {
      const result = await discountService.delete(discountId);
      if (result.success) {
        alert('Discount removed successfully!');
        loadData();
      } else {
        alert(result.error || 'Failed to remove discount');
      }
    } catch (error) {
      console.error('Remove discount error:', error);
      alert('Failed to remove discount');
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      discountType: "percentage",
      discountValue: "",
      scope: "all",
      category: "",
      products: [],
      applicationMethod: "best_price",
      startDate: "",
      endDate: "",
      status: "Active",
      autoRemove: true
    });
    setSelectedProducts([]);
  };

  const isExpiringSoon = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const hoursUntilExpiry = (end - now) / (1000 * 60 * 60);
    return hoursUntilExpiry <= 24 && hoursUntilExpiry > 0;
  };

  const isExpired = (endDate) => {
    return new Date(endDate) < new Date();
  };

  const affectedProducts = getAffectedProducts();

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setShowForm(false)}
            variant="outline"
            size="icon"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Create New Discount</h2>
            <p className="text-muted-foreground">Set up a new discount for your products</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Discount Details</CardTitle>
              <CardDescription>Basic information about the discount</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Discount Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Summer Sale 2024"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the discount..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discountType">Discount Type</Label>
                  <Select
                    name="discountType"
                    value={formData.discountType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, discountType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discountValue">
                    {formData.discountType === 'percentage' ? 'Percentage (%)' : 'Amount ($)'}
                  </Label>
                  <Input
                    id="discountValue"
                    name="discountValue"
                    type="number"
                    value={formData.discountValue}
                    onChange={handleInputChange}
                    placeholder={formData.discountType === 'percentage' ? '20' : '50'}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scope">Apply To</Label>
                <Select
                  name="scope"
                  value={formData.scope}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, scope: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Products</SelectItem>
                    <SelectItem value="category">Specific Category</SelectItem>
                    <SelectItem value="selected">Selected Products</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.scope === 'category' && (
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    name="category"
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="autoRemove"
                  name="autoRemove"
                  checked={formData.autoRemove}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, autoRemove: checked }))}
                />
                <Label htmlFor="autoRemove">Auto-remove when expired</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>See how the discount will apply</CardDescription>
            </CardHeader>
            <CardContent>
              {formData.scope === 'selected' && (
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <Label>Select Products</Label>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={handleSelectAllProducts}>
                        Select All
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={handleClearSelection}>
                        Clear
                      </Button>
                    </div>
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {products.map((product) => (
                      <div key={product._id} className="flex items-center space-x-2">
                        <Checkbox
                          checked={selectedProducts.includes(product._id)}
                          onCheckedChange={(checked) => handleProductSelection(product._id, checked)}
                        />
                        <Label className="flex-1">{product.name}</Label>
                        <Badge variant="secondary">${product.salePrice}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h4 className="font-semibold">Affected Products ({affectedProducts.length})</h4>
                {affectedProducts.slice(0, 5).map((product) => (
                  <div key={product._id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Original: ${product.salePrice}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">
                        ${calculateNewPrice(product).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Save {formData.discountType === 'percentage' ? `${formData.discountValue}%` : `$${formData.discountValue}`}
                      </p>
                    </div>
                  </div>
                ))}
                {affectedProducts.length > 5 && (
                  <p className="text-sm text-muted-foreground text-center">
                    +{affectedProducts.length - 5} more products
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowForm(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Discount"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Discount Management</h1>
          <p className="text-muted-foreground mt-1">Create and manage product discounts</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={checkExpiredDiscounts}
            disabled={loading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            {loading ? 'Checking...' : 'Check Expiry'}
          </Button>
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Discount
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Discounts</CardTitle>
          <CardDescription>Manage all your current discounts and promotions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Scope</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discounts.map((discount) => (
                <TableRow key={discount._id}>
                  <TableCell className="font-medium">{discount.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {discount.discountType === 'percentage' ? 'Percentage' : 'Fixed'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {discount.discountType === 'percentage' 
                      ? `${discount.discountValue}%`
                      : `$${discount.discountValue}`
                    }
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {discount.scope}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        isExpired(discount.endDate) ? "destructive" :
                        isExpiringSoon(discount.endDate) ? "secondary" :
                        "default"
                      }
                    >
                      {isExpired(discount.endDate) ? 'Expired' :
                       isExpiringSoon(discount.endDate) ? 'Expiring Soon' :
                       'Active'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(discount.endDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveDiscount(discount._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {discounts.length === 0 && (
            <div className="text-center py-12">
              <Tag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold text-lg mb-2">No Discounts Found</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first discount
              </p>
              <Button onClick={() => setShowForm(true)}>
                Create Discount
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}