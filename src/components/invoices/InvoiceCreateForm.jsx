// components/invoices/InvoiceCreateForm.jsx
"use client";
import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Calculator, Calendar, Package, IndianRupee, User } from 'lucide-react';
import { toast } from 'sonner';
import { invoiceService } from '@/services/invoiceService';
import { vendorService } from '@/services/vendorService';
import { useAuth } from '@/context/AuthContext';

export function InvoiceCreateForm({ onSuccess }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [allocatedProducts, setAllocatedProducts] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [invoiceItems, setInvoiceItems] = useState([{ id: 1 }]);
  const [subtotal, setSubtotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: {
      type: 'stock_allocation',
      taxRate: 18
    }
  });

  // Check if user is admin
  const isAdminUser = user?.role === 'admin' || user?.isAdmin;

  // Fetch data based on user role
  useEffect(() => {
    if (isAdminUser) {
      fetchVendors();
    } else {
      // Vendor sees only their own data
      fetchMyVendorData();
    }
  }, [isAdminUser]);

  const fetchVendors = async () => {
    try {
      const response = await vendorService.getAll({ status: 'Active' });
      setVendors(response.data?.vendors || response.data || []);
    } catch (error) {
      toast.error('Failed to load vendors');
    }
  };

  const fetchMyVendorData = async () => {
    try {
      const response = await vendorService.getMyProfile();
      const vendorData = response.data?.vendor || response.data;
      if (vendorData) {
        setVendors([vendorData]);
        setSelectedVendor(vendorData);
        setValue('vendorId', vendorData._id);
        await fetchAllocatedProducts(vendorData._id);
      }
    } catch (error) {
      toast.error('Failed to load vendor data');
    }
  };

  const fetchAllocatedProducts = async (vendorId) => {
    try {
      const response = await vendorService.getAllocatedProducts(vendorId);
      setAllocatedProducts(response.data?.products || response.data || []);
    } catch (error) {
      toast.error('Failed to load allocated products');
    }
  };

  const handleVendorChange = async (vendorId) => {
    setSelectedVendor(vendors.find(v => v._id === vendorId));
    setValue('vendorId', vendorId);
    await fetchAllocatedProducts(vendorId);
    // Clear existing items when vendor changes
    setInvoiceItems([{ id: 1 }]);
    resetCalculations();
  };

  const resetCalculations = () => {
    setSubtotal(0);
    setTaxAmount(0);
    setTotalAmount(0);
  };

  // Enhanced calculation function
  const calculateTotals = useCallback(() => {
    let calculatedSubtotal = 0;
    
    invoiceItems.forEach(item => {
      const quantity = parseInt(watch(`quantity_${item.id}`)) || 0;
      const unitPrice = parseFloat(watch(`unitPrice_${item.id}`)) || 0;
      calculatedSubtotal += quantity * unitPrice;
    });

    const taxRate = 18;
    const calculatedTax = calculatedSubtotal * (taxRate / 100);
    const calculatedTotal = calculatedSubtotal + calculatedTax;

    setSubtotal(calculatedSubtotal);
    setTaxAmount(calculatedTax);
    setTotalAmount(calculatedTotal);

    setValue('subtotal', calculatedSubtotal);
    setValue('taxAmount', calculatedTax);
    setValue('totalAmount', calculatedTotal);
  }, [invoiceItems, watch, setValue]);

  // Manual calculation triggers
  const triggerCalculation = () => {
    setTimeout(() => {
      calculateTotals();
    }, 100);
  };

  useEffect(() => {
    calculateTotals();
  }, [calculateTotals]);

  const addInvoiceItem = () => {
    setInvoiceItems(prev => [...prev, { id: Date.now() }]);
  };

  const removeInvoiceItem = (id) => {
    if (invoiceItems.length > 1) {
      setInvoiceItems(prev => prev.filter(item => item.id !== id));
      triggerCalculation();
    }
  };

  const getProductInfo = (productId) => {
    return allocatedProducts.find(p => p.product?._id === productId) || null;
  };

  const onProductChange = (itemId, productId) => {
    setValue(`product_${itemId}`, productId);
    
    const allocatedProduct = getProductInfo(productId);
    if (allocatedProduct && allocatedProduct.product) {
      const product = allocatedProduct.product;
      setValue(`unitPrice_${itemId}`, product.salePrice || 0);
      setValue(`productName_${itemId}`, product.name || '');
      
      if (!watch(`quantity_${itemId}`)) {
        setValue(`quantity_${itemId}`, 1);
      }
      
      // Set variant information if available
      if (allocatedProduct.size) {
        setValue(`size_${itemId}`, allocatedProduct.size);
      }
      if (allocatedProduct.color) {
        setValue(`color_${itemId}`, allocatedProduct.color);
      }
      
      triggerCalculation();
    }
  };

  const onQuantityChange = (itemId) => {
    const quantity = parseInt(watch(`quantity_${itemId}`)) || 0;
    const productId = watch(`product_${itemId}`);
    const allocatedProduct = getProductInfo(productId);
    
    if (allocatedProduct && quantity > allocatedProduct.currentStock) {
      toast.error(`Only ${allocatedProduct.currentStock} items available in stock`);
      setValue(`quantity_${itemId}`, allocatedProduct.currentStock);
    }
    
    triggerCalculation();
  };

  const onUnitPriceChange = (itemId) => {
    triggerCalculation();
  };

  const validateForm = () => {
    if (!watch('vendorId')) {
      toast.error('Please select a vendor');
      return false;
    }

    const hasValidItems = invoiceItems.some(item => {
      const productId = watch(`product_${item.id}`);
      const quantity = parseInt(watch(`quantity_${item.id}`)) || 0;
      return productId && quantity > 0;
    });

    if (!hasValidItems) {
      toast.error('Please add at least one valid invoice item');
      return false;
    }

    // Validate stock availability
    for (let item of invoiceItems) {
      const productId = watch(`product_${item.id}`);
      const quantity = parseInt(watch(`quantity_${item.id}`)) || 0;
      const allocatedProduct = getProductInfo(productId);
      
      if (allocatedProduct && quantity > allocatedProduct.currentStock) {
        toast.error(`Insufficient stock for ${allocatedProduct.product.name}`);
        return false;
      }
    }

    return true;
  };

  const onSubmit = async (data) => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const items = invoiceItems
        .map(item => {
          const productId = data[`product_${item.id}`];
          const quantity = parseInt(data[`quantity_${item.id}`]) || 0;
          const unitPrice = parseFloat(data[`unitPrice_${item.id}`]) || 0;
          
          if (!productId || quantity <= 0) return null;

          const allocatedProduct = getProductInfo(productId);
          const productName = allocatedProduct?.product?.name || data[`productName_${item.id}`];

          return {
            productId: productId,
            productName: productName,
            quantity: quantity,
            unitPrice: unitPrice,
            totalPrice: quantity * unitPrice,
            size: data[`size_${item.id}`] || allocatedProduct?.size || '',
            color: data[`color_${item.id}`] || allocatedProduct?.color || ''
          };
        })
        .filter(item => item !== null);

      if (items.length === 0) {
        toast.error('Please add at least one valid invoice item');
        return;
      }

      const invoiceData = {
        type: data.type,
        vendorId: data.vendorId,
        items,
        subtotal: data.subtotal,
        taxAmount: data.taxAmount,
        totalAmount: data.totalAmount,
        notes: data.notes,
        terms: data.terms,
        dueDate: data.dueDate
      };

      const result = await invoiceService.create(invoiceData);
      
      if (result.success) {
        toast.success('Invoice created successfully!');
        onSuccess?.();
      } else {
        toast.error(result.error || 'Failed to create invoice');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-6 h-6" />
            Create New Invoice
            {isAdminUser && (
              <Badge variant="secondary" className="ml-2">
                Admin Mode
              </Badge>
            )}
            {!isAdminUser && (
              <Badge variant="outline" className="ml-2">
                Vendor Mode
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Vendor Selection - Only for Admin */}
            {isAdminUser && (
              <div className="space-y-4">
                <Label htmlFor="vendorId">Select Vendor *</Label>
                <Select onValueChange={handleVendorChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors.map(vendor => (
                      <SelectItem key={vendor._id} value={vendor._id}>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{vendor.companyName}</span>
                          <Badge variant="outline" className="ml-2">
                            {vendor.contactPerson}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Vendor Info Display */}
            {selectedVendor && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-blue-900">
                        {selectedVendor.companyName}
                      </h4>
                      <p className="text-sm text-blue-700">
                        Contact: {selectedVendor.contactPerson} | {selectedVendor.phone}
                      </p>
                      <p className="text-xs text-blue-600">
                        Available Products: {allocatedProducts.length}
                      </p>
                    </div>
                    <Badge variant="default">
                      Vendor
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Invoice Type */}
            <div className="space-y-4">
              <Label htmlFor="type">Invoice Type *</Label>
              <Select onValueChange={(value) => setValue('type', value)} defaultValue="stock_allocation">
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stock_allocation">Stock Allocation</SelectItem>
                  <SelectItem value="vendor_sale">Vendor Sale</SelectItem>
                  <SelectItem value="stock_return">Stock Return</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Due Date */}
            <div className="space-y-4">
              <Label htmlFor="dueDate" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Due Date
              </Label>
              <Input
                type="date"
                {...register("dueDate")}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Invoice Items - Only show if vendor selected and has products */}
            {selectedVendor && allocatedProducts.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Invoice Items ({allocatedProducts.length} products available)
                  </Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={addInvoiceItem}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Item
                  </Button>
                </div>

                <div className="space-y-4">
                  {invoiceItems.map((item) => (
                    <Card key={item.id} className="relative border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="absolute top-3 right-3">
                          {invoiceItems.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeInvoiceItem(item.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                          {/* Product Selection */}
                          <div className="space-y-2">
                            <Label>Product *</Label>
                            <Select 
                              onValueChange={(value) => onProductChange(item.id, value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select product" />
                              </SelectTrigger>
                              <SelectContent>
                                {allocatedProducts.map(allocatedProduct => (
                                  <SelectItem 
                                    key={allocatedProduct.product._id} 
                                    value={allocatedProduct.product._id}
                                    disabled={allocatedProduct.currentStock <= 0}
                                  >
                                    <div className="flex justify-between items-center w-full">
                                      <span>{allocatedProduct.product.name}</span>
                                      <Badge variant={allocatedProduct.currentStock > 0 ? "default" : "destructive"}>
                                        Stock: {allocatedProduct.currentStock}
                                      </Badge>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Quantity */}
                          <div className="space-y-2">
                            <Label>Quantity *</Label>
                            <Input
                              type="number"
                              {...register(`quantity_${item.id}`)}
                              placeholder="Qty"
                              min="1"
                              onChange={() => onQuantityChange(item.id)}
                            />
                          </div>

                          {/* Unit Price */}
                          <div className="space-y-2">
                            <Label className="flex items-center gap-1">
                              <IndianRupee className="w-3 h-3" />
                              Unit Price *
                            </Label>
                            <Input
                              type="number"
                              step="0.01"
                              {...register(`unitPrice_${item.id}`)}
                              placeholder="0.00"
                              onChange={() => onUnitPriceChange(item.id)}
                            />
                          </div>

                          {/* Total Price */}
                          <div className="space-y-2">
                            <Label className="flex items-center gap-1">
                              <IndianRupee className="w-3 h-3" />
                              Total Price
                            </Label>
                            <Input
                              value={(
                                (parseInt(watch(`quantity_${item.id}`)) || 0) * 
                                (parseFloat(watch(`unitPrice_${item.id}`)) || 0)
                              ).toFixed(2)}
                              readOnly
                              className="bg-gray-50 font-semibold"
                            />
                          </div>

                          {/* Variant Info */}
                          <div className="space-y-2">
                            <Label>Variant Info</Label>
                            <div className="grid grid-cols-2 gap-2">
                              <Input
                                {...register(`size_${item.id}`)}
                                placeholder="Size"
                              />
                              <Input
                                {...register(`color_${item.id}`)}
                                placeholder="Color"
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* No Products Message */}
            {selectedVendor && allocatedProducts.length === 0 && (
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-6 text-center">
                  <Package className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-yellow-800 mb-2">
                    No Allocated Products
                  </h3>
                  <p className="text-yellow-700">
                    This vendor doesn't have any allocated products yet.
                    {isAdminUser && " Please allocate products first."}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Invoice Summary */}
            {selectedVendor && allocatedProducts.length > 0 && (
              <Card className="bg-gray-50 border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Invoice Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax (18%):</span>
                      <span className="font-medium">₹{taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 text-base">
                      <span className="font-bold">Total Amount:</span>
                      <span className="font-bold text-lg text-green-600">
                        ₹{totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <input type="hidden" {...register("subtotal")} />
                  <input type="hidden" {...register("taxAmount")} />
                  <input type="hidden" {...register("totalAmount")} />
                </CardContent>
              </Card>
            )}

            {/* Notes & Terms */}
            {selectedVendor && allocatedProducts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    {...register("notes")}
                    placeholder="Additional notes for the vendor..."
                    rows={3}
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="terms">Terms & Conditions</Label>
                  <Textarea
                    {...register("terms")}
                    placeholder="Payment terms and conditions..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onSuccess}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading || !selectedVendor || allocatedProducts.length === 0}
                className="min-w-32"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  'Create Invoice'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}