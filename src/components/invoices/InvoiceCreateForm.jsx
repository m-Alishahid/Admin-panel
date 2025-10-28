// // // components/invoices/InvoiceCreateForm.jsx - PERFECT VERSION
// // "use client";
// // import { useState, useEffect, useCallback } from 'react';
// // import { useForm } from 'react-hook-form';
// // import { Button } from '@/components/ui/button';
// // import { Input } from '@/components/ui/input';
// // import { Label } from '@/components/ui/label';
// // import { Textarea } from '@/components/ui/textarea';
// // import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// // import { 
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from '@/components/ui/select';
// // import { Badge } from '@/components/ui/badge';
// // import { Plus, Trash2, Calculator, Calendar, Package, IndianRupee, User, AlertCircle } from 'lucide-react';
// // import { toast } from 'sonner';
// // import { invoiceService } from '@/services/invoiceService';
// // import { vendorService } from '@/services/vendorService';

// // export function InvoiceCreateForm({ onSuccess }) {
// //   const [user, setUser] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [vendors, setVendors] = useState([]);
// //   const [allocatedProducts, setAllocatedProducts] = useState([]);
// //   const [selectedVendor, setSelectedVendor] = useState(null);
// //   const [invoiceItems, setInvoiceItems] = useState([{ id: 1 }]);
// //   const [subtotal, setSubtotal] = useState(0);
// //   const [taxAmount, setTaxAmount] = useState(0);
// //   const [totalAmount, setTotalAmount] = useState(0);
  
// //   const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
// //     defaultValues: {
// //       type: 'vendor_sale',
// //       taxRate: 18
// //     }
// //   });

// //   // Get user session on component mount
// //   useEffect(() => {
// //     const getUserSession = async () => {
// //       try {
// //         const response = await fetch('/api/auth/me');
// //         const data = await response.json();

// //         console.log('User Data', data.data.user.role);
        
        
// //         if (data.success) {
// //           setUser(data.data.user);
// //           if (data.data.user.role === 'super_admin') {
// //             fetchVendors();
// //           } else {
// //             fetchMyVendorData();
// //           }
// //         }
// //       } catch (error) {
// //         console.error('Failed to get user session:', error);
// //         toast.error('Failed to load user data');
// //       }
// //     };

// //     getUserSession();
// //   }, []);

// //   // Check if user is admin
// //   const isAdminUser = user?.role === 'super_admin' || user?.isAdmin;

// //   const fetchVendors = async () => {
// //     try {
// //       const response = await vendorService.getAll({ status: 'Active' });
// //       setVendors(response.data?.vendors || response.data || []);
// //     } catch (error) {
// //       toast.error('Failed to load vendors');
// //     }
// //   };

// //   const fetchMyVendorData = async () => {
// //     try {
// //       const response = await vendorService.getMyProfile();
// //       const vendorData = response.data?.vendor || response.data;
// //       if (vendorData) {
// //         setVendors([vendorData]);
// //         setSelectedVendor(vendorData);
// //         setValue('vendorId', vendorData._id);
// //         await fetchAllocatedProducts(vendorData._id);
// //       }
// //     } catch (error) {
// //       toast.error('Failed to load vendor data');
// //     }
// //   };

// //   const fetchAllocatedProducts = async (vendorId) => {
// //     try {
// //       const response = await vendorService.getAllocatedProducts(vendorId);
// //       const products = response.data?.products || response.data || [];
// //       setAllocatedProducts(products);
      
// //       // Auto-select first product for vendors
// //       if (!isAdminUser && products.length > 0) {
// //         const firstProduct = products[0];
// //         setValue(`product_1`, firstProduct.product._id);
// //         setValue(`unitPrice_1`, firstProduct.vendorPrice || firstProduct.product.salePrice || 0);
// //         setValue(`productName_1`, firstProduct.product.name);
// //         setValue(`size_1`, firstProduct.size || '');
// //         setValue(`color_1`, firstProduct.color || '');
// //         setValue(`quantity_1`, 1);
// //         triggerCalculation();
// //       }
// //     } catch (error) {
// //       toast.error('Failed to load allocated products');
// //     }
// //   };

// //   const handleVendorChange = async (vendorId) => {
// //     const vendor = vendors.find(v => v._id === vendorId);
// //     setSelectedVendor(vendor);
// //     setValue('vendorId', vendorId);
// //     await fetchAllocatedProducts(vendorId);
// //     // Clear existing items when vendor changes
// //     setInvoiceItems([{ id: 1 }]);
// //     resetCalculations();
// //   };

// //   const resetCalculations = () => {
// //     setSubtotal(0);
// //     setTaxAmount(0);
// //     setTotalAmount(0);
// //   };

// //   // Enhanced calculation function
// //   const calculateTotals = useCallback(() => {
// //     let calculatedSubtotal = 0;
    
// //     invoiceItems.forEach(item => {
// //       const quantity = parseInt(watch(`quantity_${item.id}`)) || 0;
// //       const unitPrice = parseFloat(watch(`unitPrice_${item.id}`)) || 0;
// //       calculatedSubtotal += quantity * unitPrice;
// //     });

// //     const taxRate = 18;
// //     const calculatedTax = calculatedSubtotal * (taxRate / 100);
// //     const calculatedTotal = calculatedSubtotal + calculatedTax;

// //     setSubtotal(calculatedSubtotal);
// //     setTaxAmount(calculatedTax);
// //     setTotalAmount(calculatedTotal);

// //     setValue('subtotal', calculatedSubtotal);
// //     setValue('taxAmount', calculatedTax);
// //     setValue('totalAmount', calculatedTotal);
// //   }, [invoiceItems, watch, setValue]);

// //   // Manual calculation triggers
// //   const triggerCalculation = () => {
// //     setTimeout(() => {
// //       calculateTotals();
// //     }, 100);
// //   };

// //   useEffect(() => {
// //     calculateTotals();
// //   }, [calculateTotals]);

// //   const addInvoiceItem = () => {
// //     setInvoiceItems(prev => [...prev, { id: Date.now() }]);
// //   };

// //   const removeInvoiceItem = (id) => {
// //     if (invoiceItems.length > 1) {
// //       setInvoiceItems(prev => prev.filter(item => item.id !== id));
// //       triggerCalculation();
// //     }
// //   };

// //   const getProductInfo = (productId) => {
// //     return allocatedProducts.find(p => p.product?._id === productId) || null;
// //   };

// //   const onProductChange = (itemId, productId) => {
// //     setValue(`product_${itemId}`, productId);
    
// //     const allocatedProduct = getProductInfo(productId);
// //     if (allocatedProduct && allocatedProduct.product) {
// //       const product = allocatedProduct.product;
      
// //       // Auto-fill product details
// //       setValue(`unitPrice_${itemId}`, allocatedProduct.vendorPrice || product.salePrice || 0);
// //       setValue(`productName_${itemId}`, product.name || '');
// //       setValue(`size_${itemId}`, allocatedProduct.size || '');
// //       setValue(`color_${itemId}`, allocatedProduct.color || '');
      
// //       if (!watch(`quantity_${itemId}`)) {
// //         setValue(`quantity_${itemId}`, 1);
// //       }
      
// //       triggerCalculation();
// //     }
// //   };

// //   const onQuantityChange = (itemId) => {
// //     const quantity = parseInt(watch(`quantity_${itemId}`)) || 0;
// //     const productId = watch(`product_${itemId}`);
// //     const allocatedProduct = getProductInfo(productId);
    
// //     if (allocatedProduct && quantity > allocatedProduct.currentStock) {
// //       toast.error(`Only ${allocatedProduct.currentStock} items available in stock`);
// //       setValue(`quantity_${itemId}`, allocatedProduct.currentStock);
// //     }
    
// //     triggerCalculation();
// //   };

// //   const onUnitPriceChange = (itemId) => {
// //     triggerCalculation();
// //   };

// //   const validateForm = () => {
// //     if (!watch('vendorId')) {
// //       toast.error('Please select a vendor');
// //       return false;
// //     }

// //     const hasValidItems = invoiceItems.some(item => {
// //       const productId = watch(`product_${item.id}`);
// //       const quantity = parseInt(watch(`quantity_${item.id}`)) || 0;
// //       return productId && quantity > 0;
// //     });

// //     if (!hasValidItems) {
// //       toast.error('Please add at least one valid invoice item');
// //       return false;
// //     }

// //     // Validate stock availability
// //     for (let item of invoiceItems) {
// //       const productId = watch(`product_${item.id}`);
// //       const quantity = parseInt(watch(`quantity_${item.id}`)) || 0;
// //       const allocatedProduct = getProductInfo(productId);
      
// //       if (allocatedProduct && quantity > allocatedProduct.currentStock) {
// //         toast.error(`Insufficient stock for ${allocatedProduct.product.name}. Available: ${allocatedProduct.currentStock}`);
// //         return false;
// //       }
// //     }

// //     return true;
// //   };

// //   const onSubmit = async (data) => {
// //     if (!validateForm()) return;

// //     setLoading(true);
// //     try {
// //       const items = invoiceItems
// //         .map(item => {
// //           const productId = data[`product_${item.id}`];
// //           const quantity = parseInt(data[`quantity_${item.id}`]) || 0;
// //           const unitPrice = parseFloat(data[`unitPrice_${item.id}`]) || 0;
          
// //           if (!productId || quantity <= 0) return null;

// //           const allocatedProduct = getProductInfo(productId);
// //           const productName = allocatedProduct?.product?.name || data[`productName_${item.id}`];

// //           return {
// //             productId: productId,
// //             productName: productName,
// //             quantity: quantity,
// //             unitPrice: unitPrice,
// //             totalPrice: quantity * unitPrice,
// //             size: data[`size_${item.id}`] || allocatedProduct?.size || '',
// //             color: data[`color_${item.id}`] || allocatedProduct?.color || ''
// //           };
// //         })
// //         .filter(item => item !== null);

// //       if (items.length === 0) {
// //         toast.error('Please add at least one valid invoice item');
// //         return;
// //       }

// //       const invoiceData = {
// //         type: data.type,
// //         vendorId: data.vendorId,
// //         items,
// //         subtotal: data.subtotal,
// //         taxAmount: data.taxAmount,
// //         totalAmount: data.totalAmount,
// //         notes: data.notes,
// //         terms: data.terms,
// //         dueDate: data.dueDate
// //       };

// //       const result = await invoiceService.create(invoiceData);
      
// //       if (result.success) {
// //         const message = isAdminUser 
// //           ? 'Invoice created successfully!' 
// //           : 'Invoice created successfully! Waiting for admin approval.';
        
// //         toast.success(message);
// //         onSuccess?.();
// //       } else {
// //         toast.error(result.error || 'Failed to create invoice');
// //       }
// //     } catch (error) {
// //       toast.error(error.response?.data?.error || 'Failed to create invoice');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Show loading while fetching user
// //   if (!user) {
// //     return (
// //       <div className="flex justify-center items-center h-64">
// //         <div className="text-center">
// //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
// //           <p>Loading user data...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="space-y-6">
// //       <Card>
// //         <CardHeader>
// //           <CardTitle className="flex items-center gap-2">
// //             <Calculator className="w-6 h-6" />
// //             Create New Invoice
// //             {isAdminUser && (
// //               <Badge variant="secondary" className="ml-2">
// //                 Admin Mode
// //               </Badge>
// //             )}
// //             {!isAdminUser && (
// //               <Badge variant="outline" className="ml-2">
// //                 Vendor Mode
// //               </Badge>
// //             )}
// //           </CardTitle>
// //         </CardHeader>
// //         <CardContent>
// //           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
// //             {/* Vendor Selection - Only for Admin */}
// //             {isAdminUser && (
// //               <div className="space-y-4">
// //                 <Label htmlFor="vendorId">Select Vendor *</Label>
// //                 <Select onValueChange={handleVendorChange}>
// //                   <SelectTrigger>
// //                     <SelectValue placeholder="Choose vendor" />
// //                   </SelectTrigger>
// //                   <SelectContent>
// //                     {vendors.map(vendor => (
// //                       <SelectItem key={vendor._id} value={vendor._id}>
// //                         <div className="flex items-center gap-2">
// //                           <User className="w-4 h-4" />
// //                           <span>{vendor.companyName}</span>
// //                           <Badge variant="outline" className="ml-2">
// //                             {vendor.contactPerson}
// //                           </Badge>
// //                         </div>
// //                       </SelectItem>
// //                     ))}
// //                   </SelectContent>
// //                 </Select>
// //               </div>
// //             )}

// //             {/* Vendor Info Display */}
// //             {selectedVendor && (
// //               <Card className="bg-blue-50 border-blue-200">
// //                 <CardContent className="p-4">
// //                   <div className="flex items-center justify-between">
// //                     <div>
// //                       <h4 className="font-semibold text-blue-900">
// //                         {selectedVendor.companyName}
// //                       </h4>
// //                       <p className="text-sm text-blue-700">
// //                         Contact: {selectedVendor.contactPerson} | {selectedVendor.phone}
// //                       </p>
// //                       <p className="text-xs text-blue-600">
// //                         Available Products: {allocatedProducts.length}
// //                       </p>
// //                     </div>
// //                     <Badge variant="default">
// //                       Vendor
// //                     </Badge>
// //                   </div>
// //                 </CardContent>
// //               </Card>
// //             )}

// //             {/* Invoice Type */}
// //             <div className="space-y-4">
// //               <Label htmlFor="type">Invoice Type *</Label>
// //               <Select 
// //                 onValueChange={(value) => setValue('type', value)} 
// //                 defaultValue="vendor_sale"
// //               >
// //                 <SelectTrigger>
// //                   <SelectValue placeholder="Select type" />
// //                 </SelectTrigger>
// //                 <SelectContent>
// //                   <SelectItem value="vendor_sale">Vendor Sale</SelectItem>
// //                   <SelectItem value="stock_allocation">Stock Allocation</SelectItem>
// //                   <SelectItem value="stock_return">Stock Return</SelectItem>
// //                 </SelectContent>
// //               </Select>
// //               <p className="text-sm text-gray-600">
// //                 {watch('type') === 'vendor_sale' && 'Record product sales and update stock'}
// //                 {watch('type') === 'stock_allocation' && 'Allocate new stock to vendor'}
// //                 {watch('type') === 'stock_return' && 'Return products from vendor'}
// //               </p>
// //             </div>

// //             {/* Due Date */}
// //             <div className="space-y-4">
// //               <Label htmlFor="dueDate" className="flex items-center gap-2">
// //                 <Calendar className="w-4 h-4" />
// //                 Due Date
// //               </Label>
// //               <Input
// //                 type="date"
// //                 {...register("dueDate")}
// //                 min={new Date().toISOString().split('T')[0]}
// //               />
// //             </div>

// //             {/* Invoice Items - Only show if vendor selected and has products */}
// //             {selectedVendor && allocatedProducts.length > 0 && (
// //               <div className="space-y-4">
// //                 <div className="flex items-center justify-between">
// //                   <Label className="flex items-center gap-2">
// //                     <Package className="w-4 h-4" />
// //                     Invoice Items ({allocatedProducts.length} products available)
// //                   </Label>
// //                   <Button 
// //                     type="button" 
// //                     variant="outline" 
// //                     size="sm"
// //                     onClick={addInvoiceItem}
// //                   >
// //                     <Plus className="w-4 h-4 mr-1" />
// //                     Add Item
// //                   </Button>
// //                 </div>

// //                 <div className="space-y-4">
// //                   {invoiceItems.map((item) => (
// //                     <Card key={item.id} className="relative border-l-4 border-l-blue-500">
// //                       <CardContent className="p-4">
// //                         <div className="absolute top-3 right-3">
// //                           {invoiceItems.length > 1 && (
// //                             <Button
// //                               type="button"
// //                               variant="ghost"
// //                               size="sm"
// //                               onClick={() => removeInvoiceItem(item.id)}
// //                             >
// //                               <Trash2 className="w-4 h-4 text-red-500" />
// //                             </Button>
// //                           )}
// //                         </div>

// //                         <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
// //                           {/* Product Selection */}
// //                           <div className="space-y-2">
// //                             <Label>Product *</Label>
// //                             <Select 
// //                               onValueChange={(value) => onProductChange(item.id, value)}
// //                               value={watch(`product_${item.id}`)}
// //                             >
// //                               <SelectTrigger>
// //                                 <SelectValue placeholder="Select product" />
// //                               </SelectTrigger>
// //                               <SelectContent>
// //                                 {allocatedProducts.map(allocatedProduct => (
// //                                   <SelectItem 
// //                                     key={allocatedProduct.product._id} 
// //                                     value={allocatedProduct.product._id}
// //                                     disabled={allocatedProduct.currentStock <= 0}
// //                                   >
// //                                     <div className="flex justify-between items-center w-full">
// //                                       <div className="text-left">
// //                                         <span className="block font-medium">{allocatedProduct.product.name}</span>
// //                                         {(allocatedProduct.size || allocatedProduct.color) && (
// //                                           <span className="text-xs text-gray-500">
// //                                             {allocatedProduct.size && `Size: ${allocatedProduct.size}`}
// //                                             {allocatedProduct.size && allocatedProduct.color && ' • '}
// //                                             {allocatedProduct.color && `Color: ${allocatedProduct.color}`}
// //                                           </span>
// //                                         )}
// //                                       </div>
// //                                       <Badge 
// //                                         variant={
// //                                           allocatedProduct.currentStock > 10 ? "default" : 
// //                                           allocatedProduct.currentStock > 0 ? "secondary" : "destructive"
// //                                         }
// //                                       >
// //                                         Stock: {allocatedProduct.currentStock}
// //                                       </Badge>
// //                                     </div>
// //                                   </SelectItem>
// //                                 ))}
// //                               </SelectContent>
// //                             </Select>
// //                           </div>

// //                           {/* Quantity */}
// //                           <div className="space-y-2">
// //                             <Label>Quantity *</Label>
// //                             <Input
// //                               type="number"
// //                               {...register(`quantity_${item.id}`, { 
// //                                 valueAsNumber: true,
// //                                 min: 1 
// //                               })}
// //                               placeholder="Qty"
// //                               min="1"
// //                               onChange={() => onQuantityChange(item.id)}
// //                             />
// //                             {watch(`product_${item.id}`) && (
// //                               <p className="text-xs text-gray-500">
// //                                 Available: {
// //                                   getProductInfo(watch(`product_${item.id}`))?.currentStock || 0
// //                                 }
// //                               </p>
// //                             )}
// //                           </div>

// //                           {/* Unit Price */}
// //                           <div className="space-y-2">
// //                             <Label className="flex items-center gap-1">
// //                               <IndianRupee className="w-3 h-3" />
// //                               Unit Price *
// //                             </Label>
// //                             <Input
// //                               type="number"
// //                               step="0.01"
// //                               {...register(`unitPrice_${item.id}`, { valueAsNumber: true })}
// //                               placeholder="0.00"
// //                               onChange={() => onUnitPriceChange(item.id)}
// //                             />
// //                           </div>

// //                           {/* Total Price */}
// //                           <div className="space-y-2">
// //                             <Label className="flex items-center gap-1">
// //                               <IndianRupee className="w-3 h-3" />
// //                               Total Price
// //                             </Label>
// //                             <Input
// //                               value={(
// //                                 (parseInt(watch(`quantity_${item.id}`)) || 0) * 
// //                                 (parseFloat(watch(`unitPrice_${item.id}`)) || 0)
// //                               ).toFixed(2)}
// //                               readOnly
// //                               className="bg-gray-50 font-semibold"
// //                             />
// //                           </div>

// //                           {/* Variant Info */}
// //                           <div className="space-y-2">
// //                             <Label>Variant Info</Label>
// //                             <div className="grid grid-cols-2 gap-2">
// //                               <Input
// //                                 {...register(`size_${item.id}`)}
// //                                 placeholder="Size"
// //                                 readOnly
// //                                 className="bg-gray-50"
// //                               />
// //                               <Input
// //                                 {...register(`color_${item.id}`)}
// //                                 placeholder="Color"
// //                                 readOnly
// //                                 className="bg-gray-50"
// //                               />
// //                             </div>
// //                           </div>
// //                         </div>
// //                       </CardContent>
// //                     </Card>
// //                   ))}
// //                 </div>
// //               </div>
// //             )}

// //             {/* No Products Message */}
// //             {selectedVendor && allocatedProducts.length === 0 && (
// //               <Card className="bg-yellow-50 border-yellow-200">
// //                 <CardContent className="p-6 text-center">
// //                   <Package className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
// //                   <h3 className="font-semibold text-yellow-800 mb-2">
// //                     No Allocated Products
// //                   </h3>
// //                   <p className="text-yellow-700">
// //                     This vendor doesn't have any allocated products yet.
// //                     {isAdminUser && " Please allocate products first."}
// //                   </p>
// //                 </CardContent>
// //               </Card>
// //             )}

// //             {/* Invoice Summary */}
// //             {selectedVendor && allocatedProducts.length > 0 && (
// //               <Card className="bg-gray-50 border-2 border-gray-200">
// //                 <CardHeader>
// //                   <CardTitle className="flex items-center gap-2">
// //                     <Calculator className="w-5 h-5" />
// //                     Invoice Summary
// //                   </CardTitle>
// //                 </CardHeader>
// //                 <CardContent>
// //                   <div className="space-y-3">
// //                     <div className="flex justify-between text-sm">
// //                       <span>Subtotal:</span>
// //                       <span className="font-medium">₹{subtotal.toFixed(2)}</span>
// //                     </div>
// //                     <div className="flex justify-between text-sm">
// //                       <span>Tax (18%):</span>
// //                       <span className="font-medium">₹{taxAmount.toFixed(2)}</span>
// //                     </div>
// //                     <div className="flex justify-between border-t pt-2 text-base">
// //                       <span className="font-bold">Total Amount:</span>
// //                       <span className="font-bold text-lg text-green-600">
// //                         ₹{totalAmount.toFixed(2)}
// //                       </span>
// //                     </div>
// //                   </div>

// //                   <input type="hidden" {...register("subtotal")} />
// //                   <input type="hidden" {...register("taxAmount")} />
// //                   <input type="hidden" {...register("totalAmount")} />
// //                 </CardContent>
// //               </Card>
// //             )}

// //             {/* Notes & Terms */}
// //             {selectedVendor && allocatedProducts.length > 0 && (
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //                 <div className="space-y-4">
// //                   <Label htmlFor="notes">Notes</Label>
// //                   <Textarea
// //                     {...register("notes")}
// //                     placeholder="Additional notes for the vendor..."
// //                     rows={3}
// //                   />
// //                 </div>

// //                 <div className="space-y-4">
// //                   <Label htmlFor="terms">Terms & Conditions</Label>
// //                   <Textarea
// //                     {...register("terms")}
// //                     placeholder="Payment terms and conditions..."
// //                     rows={3}
// //                   />
// //                 </div>
// //               </div>
// //             )}

// //             {/* Approval Notice for Vendors */}
// //             {!isAdminUser && selectedVendor && allocatedProducts.length > 0 && (
// //               <Card className="bg-blue-50 border-blue-200">
// //                 <CardContent className="p-4">
// //                   <div className="flex items-start gap-3">
// //                     <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
// //                     <div>
// //                       <h4 className="font-semibold text-blue-900">Approval Required</h4>
// //                       <p className="text-sm text-blue-700 mt-1">
// //                         Your invoice will be submitted for admin approval. Stock will be updated only after approval.
// //                       </p>
// //                     </div>
// //                   </div>
// //                 </CardContent>
// //               </Card>
// //             )}

// //             {/* Submit Buttons */}
// //             <div className="flex justify-end space-x-3 pt-4 border-t">
// //               <Button 
// //                 type="button" 
// //                 variant="outline" 
// //                 onClick={onSuccess}
// //                 disabled={loading}
// //               >
// //                 Cancel
// //               </Button>
// //               <Button 
// //                 type="submit" 
// //                 disabled={loading || !selectedVendor || allocatedProducts.length === 0}
// //                 className="min-w-32"
// //               >
// //                 {loading ? (
// //                   <>
// //                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
// //                     Creating...
// //                   </>
// //                 ) : isAdminUser ? (
// //                   'Create Invoice'
// //                 ) : (
// //                   'Submit for Approval'
// //                 )}
// //               </Button>
// //             </div>
// //           </form>
// //         </CardContent>
// //       </Card>
// //     </div>
// //   );
// // }





// // components/invoices/InvoiceCreateForm.jsx - PERFECT FOR ADMIN & VENDOR
// "use client";
// import { useState, useEffect, useCallback } from 'react';
// import { useForm } from 'react-hook-form';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { 
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Badge } from '@/components/ui/badge';
// import { Plus, Trash2, Calculator, Calendar, Package, IndianRupee, User, AlertCircle, Edit } from 'lucide-react';
// import { toast } from 'sonner';
// import { invoiceService } from '@/services/invoiceService';
// import { vendorService } from '@/services/vendorService';
// import { authService } from '@/services/authService';

// export function InvoiceCreateForm({ onSuccess, editData = null, isEdit = false }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [vendors, setVendors] = useState([]);
//   const [allocatedProducts, setAllocatedProducts] = useState([]);
//   const [selectedVendor, setSelectedVendor] = useState(null);
//   const [invoiceItems, setInvoiceItems] = useState([{ id: 1 }]);
//   const [subtotal, setSubtotal] = useState(0);
//   const [taxAmount, setTaxAmount] = useState(0);
//   const [totalAmount, setTotalAmount] = useState(0);
  
//   const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
//     defaultValues: {
//       type: 'vendor_sale',
//       taxRate: 18
//     }
//   });

//   // Get user session on component mount
//   useEffect(() => {
//     const getUserSession = async () => {
//       try {
//         const data = await authService.getCurrentUser();
        
//         if (data.success) {
//           setUser(data.data.user);
//           if (data.data.user.isAdmin || data.data.user.role === 'super_admin') {
//             await fetchVendors();
//           } else {
//             await fetchMyVendorData();
//           }

//           // If edit mode, load existing data
//           if (isEdit && editData) {
//             loadEditData(editData);
//           }
//         }
//       } catch (error) {
//         console.error('Failed to get user session:', error);
//         toast.error('Failed to load user data');
//       }
//     };

//     getUserSession();
//   }, [isEdit, editData]);

//   // Load edit data
//   const loadEditData = (invoice) => {
//     try {
//       setValue('vendorId', invoice.vendor?._id);
//       setValue('type', invoice.type);
//       setValue('dueDate', new Date(invoice.dueDate).toISOString().split('T')[0]);
//       setValue('notes', invoice.notes || '');
//       setValue('terms', invoice.terms || '');
      
//       // Set vendor and load products
//       const vendor = vendors.find(v => v._id === invoice.vendor?._id);
//       if (vendor) {
//         setSelectedVendor(vendor);
//         fetchAllocatedProducts(vendor._id).then(() => {
//           // Set invoice items after products are loaded
//           setTimeout(() => {
//             const items = invoice.items.map((item, index) => ({
//               id: index + 1,
//               productId: item.product?._id,
//               quantity: item.quantity,
//               unitPrice: item.unitPrice,
//               size: item.size,
//               color: item.color
//             }));
            
//             setInvoiceItems(items);
            
//             // Set form values for each item
//             items.forEach((item, index) => {
//               setValue(`product_${item.id}`, item.productId);
//               setValue(`quantity_${item.id}`, item.quantity);
//               setValue(`unitPrice_${item.id}`, item.unitPrice);
//               setValue(`size_${item.id}`, item.size || '');
//               setValue(`color_${item.id}`, item.color || '');
//             });
            
//             // Calculate totals
//             setTimeout(calculateTotals, 500);
//           }, 1000);
//         });
//       }
//     } catch (error) {
//       console.error('Error loading edit data:', error);
//       toast.error('Failed to load invoice data for editing');
//     }
//   };

//   // Check if user is admin
//   const isAdminUser = user?.role === 'super_admin' || user?.isAdmin;

//   const fetchVendors = async () => {
//     try {
//       const response = await vendorService.getAll({ status: 'Active' });
//       const vendorsData = response.data?.vendors || response.data || [];
//       setVendors(vendorsData);
      
//       // Auto-select first vendor for admin in create mode
//       if (!isEdit && vendorsData.length > 0 && isAdminUser) {
//         const firstVendor = vendorsData[0];
//         setSelectedVendor(firstVendor);
//         setValue('vendorId', firstVendor._id);
//         await fetchAllocatedProducts(firstVendor._id);
//       }
//     } catch (error) {
//       console.error('Vendor fetch error:', error);
//       toast.error('Failed to load vendors');
//     }
//   };

//   const fetchMyVendorData = async () => {
//     try {
//       const response = await vendorService.getMyProfile();
//       const vendorData = response.data?.vendor || response.data;
//       if (vendorData) {
//         setVendors([vendorData]);
//         setSelectedVendor(vendorData);
//         setValue('vendorId', vendorData._id);
//         await fetchAllocatedProducts(vendorData._id);
//       }
//     } catch (error) {
//       toast.error('Failed to load vendor data');
//     }
//   };

//   const fetchAllocatedProducts = async (vendorId) => {
//     try {
//       const response = await vendorService.getAllocatedProducts(vendorId);
//       const products = response.data?.products || response.data || [];
//       setAllocatedProducts(products);
      
//       // Auto-select first product for vendors in create mode
//       if (!isEdit && !isAdminUser && products.length > 0) {
//         const firstProduct = products[0];
//         setValue(`product_1`, firstProduct.product._id);
//         setValue(`unitPrice_1`, firstProduct.vendorPrice || firstProduct.product.salePrice || 0);
//         setValue(`productName_1`, firstProduct.product.name);
//         setValue(`size_1`, firstProduct.size || '');
//         setValue(`color_1`, firstProduct.color || '');
//         setValue(`quantity_1`, 1);
//         triggerCalculation();
//       }
//     } catch (error) {
//       toast.error('Failed to load allocated products');
//     }
//   };

//   const handleVendorChange = async (vendorId) => {
//     const vendor = vendors.find(v => v._id === vendorId);
//     setSelectedVendor(vendor);
//     setValue('vendorId', vendorId);
//     await fetchAllocatedProducts(vendorId);
//     // Clear existing items when vendor changes (only in create mode)
//     if (!isEdit) {
//       setInvoiceItems([{ id: 1 }]);
//       resetCalculations();
//     }
//   };

//   const resetCalculations = () => {
//     setSubtotal(0);
//     setTaxAmount(0);
//     setTotalAmount(0);
//   };

//   // Enhanced calculation function
//   const calculateTotals = useCallback(() => {
//     let calculatedSubtotal = 0;
    
//     invoiceItems.forEach(item => {
//       const quantity = parseInt(watch(`quantity_${item.id}`)) || 0;
//       const unitPrice = parseFloat(watch(`unitPrice_${item.id}`)) || 0;
//       calculatedSubtotal += quantity * unitPrice;
//     });

//     const taxRate = 18;
//     const calculatedTax = calculatedSubtotal * (taxRate / 100);
//     const calculatedTotal = calculatedSubtotal + calculatedTax;

//     setSubtotal(calculatedSubtotal);
//     setTaxAmount(calculatedTax);
//     setTotalAmount(calculatedTotal);

//     setValue('subtotal', calculatedSubtotal);
//     setValue('taxAmount', calculatedTax);
//     setValue('totalAmount', calculatedTotal);
//   }, [invoiceItems, watch, setValue]);

//   // Manual calculation triggers
//   const triggerCalculation = () => {
//     setTimeout(() => {
//       calculateTotals();
//     }, 100);
//   };

//   useEffect(() => {
//     calculateTotals();
//   }, [calculateTotals]);

//   const addInvoiceItem = () => {
//     setInvoiceItems(prev => [...prev, { id: Date.now() }]);
//   };

//   const removeInvoiceItem = (id) => {
//     if (invoiceItems.length > 1) {
//       setInvoiceItems(prev => prev.filter(item => item.id !== id));
//       triggerCalculation();
//     }
//   };

//   const getProductInfo = (productId) => {
//     return allocatedProducts.find(p => p.product?._id === productId) || null;
//   };

//   const onProductChange = (itemId, productId) => {
//     setValue(`product_${itemId}`, productId);
    
//     const allocatedProduct = getProductInfo(productId);
//     if (allocatedProduct && allocatedProduct.product) {
//       const product = allocatedProduct.product;
      
//       // Auto-fill product details (only in create mode)
//       if (!isEdit) {
//         setValue(`unitPrice_${itemId}`, allocatedProduct.vendorPrice || product.salePrice || 0);
//         setValue(`productName_${itemId}`, product.name || '');
//         setValue(`size_${itemId}`, allocatedProduct.size || '');
//         setValue(`color_${itemId}`, allocatedProduct.color || '');
        
//         if (!watch(`quantity_${itemId}`)) {
//           setValue(`quantity_${itemId}`, 1);
//         }
//       }
      
//       triggerCalculation();
//     }
//   };

//   const onQuantityChange = (itemId) => {
//     const quantity = parseInt(watch(`quantity_${itemId}`)) || 0;
//     const productId = watch(`product_${itemId}`);
//     const allocatedProduct = getProductInfo(productId);
    
//     if (allocatedProduct && quantity > allocatedProduct.currentStock && !isEdit) {
//       toast.error(`Only ${allocatedProduct.currentStock} items available in stock`);
//       setValue(`quantity_${itemId}`, allocatedProduct.currentStock);
//     }
    
//     triggerCalculation();
//   };

//   const onUnitPriceChange = (itemId) => {
//     triggerCalculation();
//   };

//   const validateForm = () => {
//     if (!watch('vendorId')) {
//       toast.error('Please select a vendor');
//       return false;
//     }

//     const hasValidItems = invoiceItems.some(item => {
//       const productId = watch(`product_${item.id}`);
//       const quantity = parseInt(watch(`quantity_${item.id}`)) || 0;
//       return productId && quantity > 0;
//     });

//     if (!hasValidItems) {
//       toast.error('Please add at least one valid invoice item');
//       return false;
//     }

//     // Validate stock availability (only in create mode)
//     if (!isEdit) {
//       for (let item of invoiceItems) {
//         const productId = watch(`product_${item.id}`);
//         const quantity = parseInt(watch(`quantity_${item.id}`)) || 0;
//         const allocatedProduct = getProductInfo(productId);
        
//         if (allocatedProduct && quantity > allocatedProduct.currentStock) {
//           toast.error(`Insufficient stock for ${allocatedProduct.product.name}. Available: ${allocatedProduct.currentStock}`);
//           return false;
//         }
//       }
//     }

//     return true;
//   };

//   const onSubmit = async (data) => {
//     if (!validateForm()) return;

//     setLoading(true);
//     try {
//       const items = invoiceItems
//         .map(item => {
//           const productId = data[`product_${item.id}`];
//           const quantity = parseInt(data[`quantity_${item.id}`]) || 0;
//           const unitPrice = parseFloat(data[`unitPrice_${item.id}`]) || 0;
          
//           if (!productId || quantity <= 0) return null;

//           const allocatedProduct = getProductInfo(productId);
//           const productName = allocatedProduct?.product?.name || data[`productName_${item.id}`];

//           return {
//             productId: productId,
//             productName: productName,
//             quantity: quantity,
//             unitPrice: unitPrice,
//             totalPrice: quantity * unitPrice,
//             size: data[`size_${item.id}`] || allocatedProduct?.size || '',
//             color: data[`color_${item.id}`] || allocatedProduct?.color || ''
//           };
//         })
//         .filter(item => item !== null);

//       if (items.length === 0) {
//         toast.error('Please add at least one valid invoice item');
//         return;
//       }

//       const invoiceData = {
//         type: data.type,
//         vendorId: data.vendorId,
//         items,
//         subtotal: data.subtotal,
//         taxAmount: data.taxAmount,
//         totalAmount: data.totalAmount,
//         notes: data.notes,
//         terms: data.terms,
//         dueDate: data.dueDate
//       };

//       let result;
//       if (isEdit && editData) {
//         // Update existing invoice
//         result = await invoiceService.update(editData._id, invoiceData);
//       } else {
//         // Create new invoice
//         result = await invoiceService.create(invoiceData);
//       }
      
//       if (result.success) {
//         const message = isEdit 
//           ? 'Invoice updated successfully!'
//           : isAdminUser 
//             ? 'Invoice created successfully!' 
//             : 'Invoice created successfully! Waiting for admin approval.';
        
//         toast.success(message);
//         onSuccess?.();
//       } else {
//         toast.error(result.error || `Failed to ${isEdit ? 'update' : 'create'} invoice`);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.error || `Failed to ${isEdit ? 'update' : 'create'} invoice`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Show loading while fetching user
//   if (!user) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p>Loading user data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             {isEdit ? <Edit className="w-6 h-6" /> : <Calculator className="w-6 h-6" />}
//             {isEdit ? 'Edit Invoice' : 'Create New Invoice'}
//             {isAdminUser && (
//               <Badge variant="secondary" className="ml-2">
//                 Admin Mode
//               </Badge>
//             )}
//             {!isAdminUser && (
//               <Badge variant="outline" className="ml-2">
//                 Vendor Mode
//               </Badge>
//             )}
//             {isEdit && (
//               <Badge variant="outline" className="ml-2">
//                 Editing: {editData?.invoiceNumber}
//               </Badge>
//             )}
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//             {/* Vendor Selection - Only for Admin */}
//             {isAdminUser && (
//               <div className="space-y-4">
//                 <Label htmlFor="vendorId">Select Vendor *</Label>
//                 <Select onValueChange={handleVendorChange} value={watch('vendorId')}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Choose vendor" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {vendors.map(vendor => (
//                       <SelectItem key={vendor._id} value={vendor._id}>
//                         <div className="flex items-center gap-2">
//                           <User className="w-4 h-4" />
//                           <span>{vendor.companyName}</span>
//                           <Badge variant="outline" className="ml-2">
//                             {vendor.contactPerson}
//                           </Badge>
//                         </div>
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             )}

//             {/* Vendor Info Display */}
//             {selectedVendor && (
//               <Card className="bg-blue-50 border-blue-200">
//                 <CardContent className="p-4">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <h4 className="font-semibold text-blue-900">
//                         {selectedVendor.companyName}
//                       </h4>
//                       <p className="text-sm text-blue-700">
//                         Contact: {selectedVendor.contactPerson} | {selectedVendor.phone}
//                       </p>
//                       <p className="text-xs text-blue-600">
//                         Available Products: {allocatedProducts.length}
//                       </p>
//                     </div>
//                     <Badge variant="default">
//                       Vendor
//                     </Badge>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {/* Invoice Type */}
//             <div className="space-y-4">
//               <Label htmlFor="type">Invoice Type *</Label>
//               <Select 
//                 onValueChange={(value) => setValue('type', value)} 
//                 value={watch('type')}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select type" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="vendor_sale">Vendor Sale</SelectItem>
//                   <SelectItem value="stock_allocation">Stock Allocation</SelectItem>
//                   <SelectItem value="stock_return">Stock Return</SelectItem>
//                 </SelectContent>
//               </Select>
//               <p className="text-sm text-gray-600">
//                 {watch('type') === 'vendor_sale' && 'Record product sales and update stock'}
//                 {watch('type') === 'stock_allocation' && 'Allocate new stock to vendor'}
//                 {watch('type') === 'stock_return' && 'Return products from vendor'}
//               </p>
//             </div>

//             {/* Due Date */}
//             <div className="space-y-4">
//               <Label htmlFor="dueDate" className="flex items-center gap-2">
//                 <Calendar className="w-4 h-4" />
//                 Due Date
//               </Label>
//               <Input
//                 type="date"
//                 {...register("dueDate")}
//                 min={new Date().toISOString().split('T')[0]}
//               />
//             </div>

//             {/* Invoice Items - Only show if vendor selected and has products */}
//             {selectedVendor && allocatedProducts.length > 0 && (
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <Label className="flex items-center gap-2">
//                     <Package className="w-4 h-4" />
//                     Invoice Items ({allocatedProducts.length} products available)
//                     {isEdit && (
//                       <Badge variant="outline" className="ml-2">
//                         Edit Mode
//                       </Badge>
//                     )}
//                   </Label>
//                   <Button 
//                     type="button" 
//                     variant="outline" 
//                     size="sm"
//                     onClick={addInvoiceItem}
//                   >
//                     <Plus className="w-4 h-4 mr-1" />
//                     Add Item
//                   </Button>
//                 </div>

//                 <div className="space-y-4">
//                   {invoiceItems.map((item) => (
//                     <Card key={item.id} className="relative border-l-4 border-l-blue-500">
//                       <CardContent className="p-4">
//                         <div className="absolute top-3 right-3">
//                           {invoiceItems.length > 1 && (
//                             <Button
//                               type="button"
//                               variant="ghost"
//                               size="sm"
//                               onClick={() => removeInvoiceItem(item.id)}
//                             >
//                               <Trash2 className="w-4 h-4 text-red-500" />
//                             </Button>
//                           )}
//                         </div>

//                         <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
//                           {/* Product Selection */}
//                           <div className="space-y-2">
//                             <Label>Product *</Label>
//                             <Select 
//                               onValueChange={(value) => onProductChange(item.id, value)}
//                               value={watch(`product_${item.id}`)}
//                             >
//                               <SelectTrigger>
//                                 <SelectValue placeholder="Select product" />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 {allocatedProducts.map(allocatedProduct => (
//                                   <SelectItem 
//                                     key={allocatedProduct.product._id} 
//                                     value={allocatedProduct.product._id}
//                                     disabled={!isEdit && allocatedProduct.currentStock <= 0}
//                                   >
//                                     <div className="flex justify-between items-center w-full">
//                                       <div className="text-left">
//                                         <span className="block font-medium">{allocatedProduct.product.name}</span>
//                                         {(allocatedProduct.size || allocatedProduct.color) && (
//                                           <span className="text-xs text-gray-500">
//                                             {allocatedProduct.size && `Size: ${allocatedProduct.size}`}
//                                             {allocatedProduct.size && allocatedProduct.color && ' • '}
//                                             {allocatedProduct.color && `Color: ${allocatedProduct.color}`}
//                                           </span>
//                                         )}
//                                       </div>
//                                       <Badge 
//                                         variant={
//                                           allocatedProduct.currentStock > 10 ? "default" : 
//                                           allocatedProduct.currentStock > 0 ? "secondary" : "destructive"
//                                         }
//                                       >
//                                         Stock: {allocatedProduct.currentStock}
//                                       </Badge>
//                                     </div>
//                                   </SelectItem>
//                                 ))}
//                               </SelectContent>
//                             </Select>
//                           </div>

//                           {/* Quantity */}
//                           <div className="space-y-2">
//                             <Label>Quantity *</Label>
//                             <Input
//                               type="number"
//                               {...register(`quantity_${item.id}`, { 
//                                 valueAsNumber: true,
//                                 min: 1 
//                               })}
//                               placeholder="Qty"
//                               min="1"
//                               onChange={() => onQuantityChange(item.id)}
//                             />
//                             {watch(`product_${item.id}`) && (
//                               <p className="text-xs text-gray-500">
//                                 Available: {
//                                   getProductInfo(watch(`product_${item.id}`))?.currentStock || 0
//                                 }
//                                 {isEdit && " (Editing - stock check disabled)"}
//                               </p>
//                             )}
//                           </div>

//                           {/* Unit Price */}
//                           <div className="space-y-2">
//                             <Label className="flex items-center gap-1">
//                               <IndianRupee className="w-3 h-3" />
//                               Unit Price *
//                             </Label>
//                             <Input
//                               type="number"
//                               step="0.01"
//                               {...register(`unitPrice_${item.id}`, { valueAsNumber: true })}
//                               placeholder="0.00"
//                               onChange={() => onUnitPriceChange(item.id)}
//                             />
//                           </div>

//                           {/* Total Price */}
//                           <div className="space-y-2">
//                             <Label className="flex items-center gap-1">
//                               <IndianRupee className="w-3 h-3" />
//                               Total Price
//                             </Label>
//                             <Input
//                               value={(
//                                 (parseInt(watch(`quantity_${item.id}`)) || 0) * 
//                                 (parseFloat(watch(`unitPrice_${item.id}`)) || 0)
//                               ).toFixed(2)}
//                               readOnly
//                               className="bg-gray-50 font-semibold"
//                             />
//                           </div>

//                           {/* Variant Info */}
//                           <div className="space-y-2">
//                             <Label>Variant Info</Label>
//                             <div className="grid grid-cols-2 gap-2">
//                               <Input
//                                 {...register(`size_${item.id}`)}
//                                 placeholder="Size"
//                                 readOnly={isEdit}
//                                 className={isEdit ? "bg-gray-50" : ""}
//                               />
//                               <Input
//                                 {...register(`color_${item.id}`)}
//                                 placeholder="Color"
//                                 readOnly={isEdit}
//                                 className={isEdit ? "bg-gray-50" : ""}
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* No Products Message */}
//             {selectedVendor && allocatedProducts.length === 0 && (
//               <Card className="bg-yellow-50 border-yellow-200">
//                 <CardContent className="p-6 text-center">
//                   <Package className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
//                   <h3 className="font-semibold text-yellow-800 mb-2">
//                     No Allocated Products
//                   </h3>
//                   <p className="text-yellow-700">
//                     This vendor doesn't have any allocated products yet.
//                     {isAdminUser && " Please allocate products first."}
//                   </p>
//                 </CardContent>
//               </Card>
//             )}

//             {/* Invoice Summary */}
//             {selectedVendor && allocatedProducts.length > 0 && (
//               <Card className="bg-gray-50 border-2 border-gray-200">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Calculator className="w-5 h-5" />
//                     Invoice Summary
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-3">
//                     <div className="flex justify-between text-sm">
//                       <span>Subtotal:</span>
//                       <span className="font-medium">₹{subtotal.toFixed(2)}</span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span>Tax (18%):</span>
//                       <span className="font-medium">₹{taxAmount.toFixed(2)}</span>
//                     </div>
//                     <div className="flex justify-between border-t pt-2 text-base">
//                       <span className="font-bold">Total Amount:</span>
//                       <span className="font-bold text-lg text-green-600">
//                         ₹{totalAmount.toFixed(2)}
//                       </span>
//                     </div>
//                   </div>

//                   <input type="hidden" {...register("subtotal")} />
//                   <input type="hidden" {...register("taxAmount")} />
//                   <input type="hidden" {...register("totalAmount")} />
//                 </CardContent>
//               </Card>
//             )}

//             {/* Notes & Terms */}
//             {selectedVendor && allocatedProducts.length > 0 && (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-4">
//                   <Label htmlFor="notes">Notes</Label>
//                   <Textarea
//                     {...register("notes")}
//                     placeholder="Additional notes for the vendor..."
//                     rows={3}
//                   />
//                 </div>

//                 <div className="space-y-4">
//                   <Label htmlFor="terms">Terms & Conditions</Label>
//                   <Textarea
//                     {...register("terms")}
//                     placeholder="Payment terms and conditions..."
//                     rows={3}
//                   />
//                 </div>
//               </div>
//             )}

//             {/* Approval Notice for Vendors */}
//             {!isAdminUser && selectedVendor && allocatedProducts.length > 0 && !isEdit && (
//               <Card className="bg-blue-50 border-blue-200">
//                 <CardContent className="p-4">
//                   <div className="flex items-start gap-3">
//                     <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
//                     <div>
//                       <h4 className="font-semibold text-blue-900">Approval Required</h4>
//                       <p className="text-sm text-blue-700 mt-1">
//                         Your invoice will be submitted for admin approval. Stock will be updated only after approval.
//                       </p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {/* Edit Mode Notice */}
//             {isEdit && (
//               <Card className="bg-yellow-50 border-yellow-200">
//                 <CardContent className="p-4">
//                   <div className="flex items-start gap-3">
//                     <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
//                     <div>
//                       <h4 className="font-semibold text-yellow-900">Edit Mode</h4>
//                       <p className="text-sm text-yellow-700 mt-1">
//                         You are editing an existing invoice. Stock validation is disabled during editing.
//                       </p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {/* Submit Buttons */}
//             <div className="flex justify-end space-x-3 pt-4 border-t">
//               <Button 
//                 type="button" 
//                 variant="outline" 
//                 onClick={onSuccess}
//                 disabled={loading}
//               >
//                 Cancel
//               </Button>
//               <Button 
//                 type="submit" 
//                 disabled={loading || !selectedVendor || allocatedProducts.length === 0}
//                 className="min-w-32"
//               >
//                 {loading ? (
//                   <>
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                     {isEdit ? 'Updating...' : 'Creating...'}
//                   </>
//                 ) : isEdit ? (
//                   'Update Invoice'
//                 ) : isAdminUser ? (
//                   'Create Invoice'
//                 ) : (
//                   'Submit for Approval'
//                 )}
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// components/invoices/InvoiceCreateForm.jsx - FIXED VERSION
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
import { Plus, Trash2, Calculator, Calendar, Package, IndianRupee, User, AlertCircle, Edit, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { invoiceService } from '@/services/invoiceService';
import { vendorService } from '@/services/vendorService';
import { authService } from '@/services/authService';

export function InvoiceCreateForm({ onSuccess, editData = null, isEdit = false, onCancel }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [allocatedProducts, setAllocatedProducts] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [invoiceItems, setInvoiceItems] = useState([{ id: 1 }]);
  const [subtotal, setSubtotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isApproving, setIsApproving] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset, trigger } = useForm({
    defaultValues: {
      type: 'vendor_sale',
      taxRate: 18
    }
  });

  // Get user session on component mount
  useEffect(() => {
    const getUserSession = async () => {
      try {
        const data = await authService.getCurrentUser();
        
        if (data.success) {
          setUser(data.data.user);
          if (data.data.user.isAdmin || data.data.user.role === 'super_admin') {
            await fetchVendors();
          } else {
            await fetchMyVendorData();
          }

          // If edit mode, load existing data
          if (isEdit && editData) {
            await loadEditData(editData);
          } else {
            setDataLoaded(true);
          }
        }
      } catch (error) {
        console.error('Failed to get user session:', error);
        toast.error('Failed to load user data');
        setDataLoaded(true);
      }
    };

    getUserSession();
  }, [isEdit, editData]);

  // Load edit data - FIXED VERSION
  const loadEditData = async (invoice) => {
    try {
      console.log('Loading edit data:', invoice);
      
      // Set basic invoice data
      setValue('vendorId', invoice.vendor?._id || invoice.vendorId);
      setValue('type', invoice.type || 'vendor_sale');
      setValue('dueDate', invoice.dueDate ? new Date(invoice.dueDate).toISOString().split('T')[0] : '');
      setValue('notes', invoice.notes || '');
      setValue('terms', invoice.terms || '');
      setValue('status', invoice.status || 'draft');
      
      // Set vendor and load products
      const vendorId = invoice.vendor?._id || invoice.vendorId;
      if (vendorId) {
        await handleVendorChange(vendorId);
        
        // Wait for products to load then set items - FIXED TIMING
        setTimeout(() => {
          if (invoice.items && invoice.items.length > 0) {
            const items = invoice.items.map((item, index) => ({
              id: index + 1,
              productId: item.product?._id || item.product,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              size: item.size,
              color: item.color,
              productName: item.productName
            }));
            
            console.log('Setting invoice items:', items);
            setInvoiceItems(items);
            
            // Set form values for each item - FIXED: Wait for next render cycle
            setTimeout(() => {
              items.forEach((item, index) => {
                const itemId = item.id;
                setValue(`product_${itemId}`, item.productId);
                setValue(`quantity_${itemId}`, item.quantity);
                setValue(`unitPrice_${itemId}`, item.unitPrice);
                setValue(`size_${itemId}`, item.size || '');
                setValue(`color_${itemId}`, item.color || '');
                setValue(`productName_${itemId}`, item.productName || '');
              });
              
              // Calculate totals after all values are set
              setTimeout(() => {
                calculateTotals();
                setDataLoaded(true);
              }, 300);
            }, 200);
          } else {
            setDataLoaded(true);
          }
        }, 1000);
      } else {
        setDataLoaded(true);
      }
    } catch (error) {
      console.error('Error loading edit data:', error);
      toast.error('Failed to load invoice data for editing');
      setDataLoaded(true);
    }
  };

  // Check if user is admin
  const isAdminUser = user?.role === 'super_admin' || user?.isAdmin;

  const fetchVendors = async () => {
    try {
      const response = await vendorService.getAll({ status: 'Active' });
      const vendorsData = response.data?.vendors || response.data || [];
      setVendors(vendorsData);
      
      // Auto-select first vendor for admin in create mode
      if (!isEdit && vendorsData.length > 0 && isAdminUser) {
        const firstVendor = vendorsData[0];
        setSelectedVendor(firstVendor);
        setValue('vendorId', firstVendor._id);
        await fetchAllocatedProducts(firstVendor._id);
      } else {
        setDataLoaded(true);
      }
    } catch (error) {
      console.error('Vendor fetch error:', error);
      toast.error('Failed to load vendors');
      setDataLoaded(true);
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
      } else {
        setDataLoaded(true);
      }
    } catch (error) {
      toast.error('Failed to load vendor data');
      setDataLoaded(true);
    }
  };

  // Fixed fetchAllocatedProducts function
  const fetchAllocatedProducts = async (vendorId) => {
    try {
      if (!vendorId || vendorId === 'undefined') {
        console.error('Invalid vendor ID:', vendorId);
        toast.error('Invalid vendor selection');
        setDataLoaded(true);
        return;
      }

      console.log('Fetching products for vendor:', vendorId);
      const response = await vendorService.getAllocatedProducts(vendorId);
      
      if (response.success) {
        const products = response.data?.products || response.data || [];
        setAllocatedProducts(products);
        
        console.log('Loaded products:', products.length);
        
        // Auto-select first product for vendors in create mode
        if (!isEdit && !isAdminUser && products.length > 0) {
          const firstProduct = products[0];
          setValue(`product_1`, firstProduct.product._id);
          setValue(`unitPrice_1`, firstProduct.vendorPrice || firstProduct.product.salePrice || 0);
          setValue(`productName_1`, firstProduct.product.name);
          setValue(`size_1`, firstProduct.size || '');
          setValue(`color_1`, firstProduct.color || '');
          setValue(`quantity_1`, 1);
          triggerCalculation();
        }
        
        setDataLoaded(true);
      } else {
        toast.error(response.error || 'Failed to load allocated products');
        setDataLoaded(true);
      }
    } catch (error) {
      console.error('Error fetching allocated products:', error);
      toast.error(error.response?.data?.error || 'Failed to load allocated products');
      setDataLoaded(true);
    }
  };

  const handleVendorChange = async (vendorId) => {
    const vendor = vendors.find(v => v._id === vendorId);
    setSelectedVendor(vendor);
    setValue('vendorId', vendorId);
    await fetchAllocatedProducts(vendorId);
    // Clear existing items when vendor changes (only in create mode)
    if (!isEdit) {
      setInvoiceItems([{ id: 1 }]);
      resetCalculations();
    }
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
    if (dataLoaded) {
      calculateTotals();
    }
  }, [calculateTotals, dataLoaded]);

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
      
      // Auto-fill product details (only in create mode)
      if (!isEdit) {
        setValue(`unitPrice_${itemId}`, allocatedProduct.vendorPrice || product.salePrice || 0);
        setValue(`productName_${itemId}`, product.name || '');
        setValue(`size_${itemId}`, allocatedProduct.size || '');
        setValue(`color_${itemId}`, allocatedProduct.color || '');
        
        if (!watch(`quantity_${itemId}`)) {
          setValue(`quantity_${itemId}`, 1);
        }
      }
      
      triggerCalculation();
    }
  };

  const onQuantityChange = (itemId) => {
    const quantity = parseInt(watch(`quantity_${itemId}`)) || 0;
    const productId = watch(`product_${itemId}`);
    const allocatedProduct = getProductInfo(productId);
    
    if (allocatedProduct && quantity > allocatedProduct.currentStock && !isEdit) {
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

    // Validate stock availability (only in create mode and for pending approval invoices)
    if (!isEdit || editData?.status === 'pending_approval') {
      for (let item of invoiceItems) {
        const productId = watch(`product_${item.id}`);
        const quantity = parseInt(watch(`quantity_${item.id}`)) || 0;
        const allocatedProduct = getProductInfo(productId);
        
        if (allocatedProduct && quantity > allocatedProduct.currentStock) {
          toast.error(`Insufficient stock for ${allocatedProduct.product.name}. Available: ${allocatedProduct.currentStock}`);
          return false;
        }
      }
    }

    return true;
  };

  // Handle invoice approval (for admin)
  const handleApproveInvoice = async () => {
    if (!isAdminUser || !editData) return;
    
    setIsApproving(true);
    try {
      const result = await invoiceService.approve(editData._id);
      if (result.success) {
        toast.success('Invoice approved successfully!');
        onSuccess?.();
      } else {
        toast.error(result.error || 'Failed to approve invoice');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to approve invoice');
    } finally {
      setIsApproving(false);
    }
  };

  // Handle invoice rejection (for admin)
  const handleRejectInvoice = async () => {
    if (!isAdminUser || !editData) return;
    
    setIsApproving(true);
    try {
      const result = await invoiceService.reject(editData._id);
      if (result.success) {
        toast.success('Invoice rejected successfully!');
        onSuccess?.();
      } else {
        toast.error(result.error || 'Failed to reject invoice');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to reject invoice');
    } finally {
      setIsApproving(false);
    }
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
        dueDate: data.dueDate,
        status: isAdminUser ? 'approved' : 'pending_approval' // Admin creates directly approved invoices
      };

      let result;
      if (isEdit && editData) {
        // Update existing invoice - only allow if not approved
        if (editData.status === 'approved') {
          toast.error('Cannot edit an approved invoice');
          return;
        }
        
        result = await invoiceService.update(editData._id, invoiceData);
      } else {
        // Create new invoice
        result = await invoiceService.create(invoiceData);
      }
      
      if (result.success) {
        const message = isEdit 
          ? 'Invoice updated successfully!'
          : isAdminUser 
            ? 'Invoice created and approved successfully!' 
            : 'Invoice created successfully! Waiting for admin approval.';
        
        toast.success(message);
        onSuccess?.();
      } else {
        toast.error(result.error || `Failed to ${isEdit ? 'update' : 'create'} invoice`);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || `Failed to ${isEdit ? 'update' : 'create'} invoice`);
    } finally {
      setLoading(false);
    }
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case 'pending_approval':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending Approval</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Show loading while fetching data
  if (!dataLoaded) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>{isEdit ? 'Loading invoice data...' : 'Loading form...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isEdit ? <Edit className="w-6 h-6" /> : <Calculator className="w-6 h-6" />}
            {isEdit ? 'Edit Invoice' : 'Create New Invoice'}
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
            {isEdit && editData && (
              <div className="flex items-center gap-2 ml-2">
                <Badge variant="outline">
                  Editing: {editData.invoiceNumber}
                </Badge>
                {getStatusBadge(editData.status)}
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Vendor Selection - Only for Admin */}
            {isAdminUser && (
              <div className="space-y-4">
                <Label htmlFor="vendorId">Select Vendor *</Label>
                <Select 
                  onValueChange={handleVendorChange} 
                  value={watch('vendorId')}
                  disabled={isEdit && editData?.status === 'approved'}
                >
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
              <Select 
                onValueChange={(value) => setValue('type', value)} 
                value={watch('type')}
                disabled={isEdit && editData?.status === 'approved'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vendor_sale">Vendor Sale</SelectItem>
                  <SelectItem value="stock_allocation">Stock Allocation</SelectItem>
                  <SelectItem value="stock_return">Stock Return</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-600">
                {watch('type') === 'vendor_sale' && 'Record product sales and update stock'}
                {watch('type') === 'stock_allocation' && 'Allocate new stock to vendor'}
                {watch('type') === 'stock_return' && 'Return products from vendor'}
              </p>
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
                disabled={isEdit && editData?.status === 'approved'}
              />
            </div>

            {/* Invoice Items - Only show if vendor selected and has products */}
            {selectedVendor && allocatedProducts.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Invoice Items ({allocatedProducts.length} products available)
                    {isEdit && (
                      <Badge variant="outline" className="ml-2">
                        Edit Mode
                      </Badge>
                    )}
                  </Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={addInvoiceItem}
                    disabled={isEdit && editData?.status === 'approved'}
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
                          {invoiceItems.length > 1 && !(isEdit && editData?.status === 'approved') && (
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
                              value={watch(`product_${item.id}`)}
                              disabled={isEdit && editData?.status === 'approved'}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select product" />
                              </SelectTrigger>
                              <SelectContent>
                                {allocatedProducts.map(allocatedProduct => (
                                  <SelectItem 
                                    key={allocatedProduct.product._id} 
                                    value={allocatedProduct.product._id}
                                    disabled={!isEdit && allocatedProduct.currentStock <= 0}
                                  >
                                    <div className="flex justify-between items-center w-full">
                                      <div className="text-left">
                                        <span className="block font-medium">{allocatedProduct.product.name}</span>
                                        {(allocatedProduct.size || allocatedProduct.color) && (
                                          <span className="text-xs text-gray-500">
                                            {allocatedProduct.size && `Size: ${allocatedProduct.size}`}
                                            {allocatedProduct.size && allocatedProduct.color && ' • '}
                                            {allocatedProduct.color && `Color: ${allocatedProduct.color}`}
                                          </span>
                                        )}
                                      </div>
                                      <Badge 
                                        variant={
                                          allocatedProduct.currentStock > 10 ? "default" : 
                                          allocatedProduct.currentStock > 0 ? "secondary" : "destructive"
                                        }
                                      >
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
                              {...register(`quantity_${item.id}`, { 
                                valueAsNumber: true,
                                min: 1 
                              })}
                              placeholder="Qty"
                              min="1"
                              onChange={() => onQuantityChange(item.id)}
                              disabled={isEdit && editData?.status === 'approved'}
                            />
                            {watch(`product_${item.id}`) && (
                              <p className="text-xs text-gray-500">
                                Available: {
                                  getProductInfo(watch(`product_${item.id}`))?.currentStock || 0
                                }
                                {(isEdit && editData?.status !== 'pending_approval') && " (Editing - stock check disabled)"}
                              </p>
                            )}
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
                              {...register(`unitPrice_${item.id}`, { valueAsNumber: true })}
                              placeholder="0.00"
                              onChange={() => onUnitPriceChange(item.id)}
                              disabled={isEdit && editData?.status === 'approved'}
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
                                readOnly={isEdit}
                                className={isEdit ? "bg-gray-50" : ""}
                                disabled={isEdit && editData?.status === 'approved'}
                              />
                              <Input
                                {...register(`color_${item.id}`)}
                                placeholder="Color"
                                readOnly={isEdit}
                                className={isEdit ? "bg-gray-50" : ""}
                                disabled={isEdit && editData?.status === 'approved'}
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
                    disabled={isEdit && editData?.status === 'approved'}
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="terms">Terms & Conditions</Label>
                  <Textarea
                    {...register("terms")}
                    placeholder="Payment terms and conditions..."
                    rows={3}
                    disabled={isEdit && editData?.status === 'approved'}
                  />
                </div>
              </div>
            )}

            {/* Approval Notice for Vendors */}
            {!isAdminUser && selectedVendor && allocatedProducts.length > 0 && !isEdit && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900">Approval Required</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Your invoice will be submitted for admin approval. Stock will be updated only after approval.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Edit Mode Notice */}
            {isEdit && (
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-900">Edit Mode</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        {editData?.status === 'approved' 
                          ? 'This invoice is already approved and cannot be edited.'
                          : 'You are editing an existing invoice. Stock validation is applied for pending approval invoices.'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t">
              {/* Left side - Approval buttons for admin in edit mode */}
              {isEdit && isAdminUser && editData?.status === 'pending_approval' && (
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    onClick={handleApproveInvoice}
                    disabled={isApproving || loading}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {isApproving ? 'Approving...' : 'Approve Invoice'}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleRejectInvoice}
                    disabled={isApproving || loading}
                    variant="destructive"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    {isApproving ? 'Rejecting...' : 'Reject Invoice'}
                  </Button>
                </div>
              )}

              {/* Right side - Form actions */}
              <div className="flex space-x-3 ml-auto">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel}
                  disabled={loading || isApproving}
                >
                  Cancel
                </Button>
                
                {/* Show save button only if invoice is not approved */}
                {!(isEdit && editData?.status === 'approved') && (
                  <Button 
                    type="submit" 
                    disabled={loading || isApproving || !selectedVendor || allocatedProducts.length === 0}
                    className="min-w-32"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {isEdit ? 'Updating...' : 'Creating...'}
                      </>
                    ) : isEdit ? (
                      'Update Invoice'
                    ) : isAdminUser ? (
                      'Create Invoice'
                    ) : (
                      'Submit for Approval'
                    )}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}