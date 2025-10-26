// app/dashboard/page.jsx - UPDATED WITH VENDOR RESTRICTIONS
"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  AlertCircle,
  FileText,
  Plus,
  Download,
  Eye,
  BarChart3,
  Activity,
  Calendar,
  IndianRupee
} from 'lucide-react';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/modal';
import { VendorCreateForm } from '@/components/vendors/VendorCreateForm';
import { ProductAllocationForm } from '@/components/vendors/ProductAllocationForm';
import { InvoiceCreateForm } from '@/components/invoices/InvoiceCreateForm';
import { useAuth } from '@/context/AuthContext';
import { dashboardService } from '@/services/dashboardService';
import { vendorService } from '@/services/vendorService';
import { invoiceService } from '@/services/invoiceService';

// Vendor Stats Component
function VendorStats({ vendorData, stats }) {
  const statsConfig = [
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Current Stock',
      value: stats?.currentStock || 0,
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Sold Stock',
      value: stats?.soldStock || 0,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Total Sales',
      value: `₹${(stats?.totalSales || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Total Profit',
      value: `₹${(stats?.totalProfit || 0).toLocaleString()}`,
      icon: BarChart3,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Low Stock Alerts',
      value: stats?.lowStockProducts || 0,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statsConfig.map((stat, index) => (
        <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Admin Stats Component
function AdminStats({ stats }) {
  const adminStats = [
    {
      title: 'Total Vendors',
      value: stats?.totalVendors || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Sales',
      value: `₹${(stats?.totalSales || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Total Profit',
      value: `₹${(stats?.totalProfit || 0).toLocaleString()}`,
      icon: BarChart3,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Pending Requests',
      value: stats?.pendingRequests || 0,
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Low Stock Items',
      value: stats?.lowStockProducts || 0,
      icon: Activity,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {adminStats.map((stat, index) => (
        <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Product View Modal Component
function ProductViewModal({ product, isOpen, onClose }) {
  if (!product) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Product Details"
      size="lg"
    >
      <div className="space-y-6">
        {/* Product Header */}
        <div className="flex items-start space-x-4">
          <img 
            src={product.product?.images?.[0] || '/placeholder-product.jpg'} 
            alt={product.product?.name}
            className="w-20 h-20 object-cover rounded-lg border"
          />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">{product.product?.name}</h3>
            <p className="text-gray-600 mt-1">{product.product?.description}</p>
          </div>
        </div>

        {/* Stock Information */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Allocated</p>
            <p className="text-2xl font-bold text-blue-600">{product.allocatedStock}</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Current</p>
            <p className="text-2xl font-bold text-green-600">{product.currentStock}</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600">Sold</p>
            <p className="text-2xl font-bold text-purple-600">{product.soldStock}</p>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <p className="text-sm text-gray-600">Status</p>
            <Badge variant={product.currentStock > 0 ? "default" : "destructive"} className="mt-1">
              {product.currentStock > 0 ? 'In Stock' : 'Out of Stock'}
            </Badge>
          </div>
        </div>

        {/* Variant Details */}
        {(product.size || product.color) && (
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Variant Details</h4>
            <div className="grid grid-cols-2 gap-4">
              {product.size && (
                <div>
                  <span className="text-sm text-gray-600">Size:</span>
                  <p className="font-medium">{product.size}</p>
                </div>
              )}
              {product.color && (
                <div>
                  <span className="text-sm text-gray-600">Color:</span>
                  <p className="font-medium">{product.color}</p>
                </div>
              )}
              {product.fabric && (
                <div>
                  <span className="text-sm text-gray-600">Fabric:</span>
                  <p className="font-medium">{product.fabric}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pricing Information */}
        <div className="border rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Pricing Information</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Cost Price:</span>
              <span className="font-medium">₹{product.costPrice || product.product?.costPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Sale Price:</span>
              <span className="font-medium">₹{product.salePrice || product.product?.salePrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Vendor Price:</span>
              <span className="font-medium">₹{product.vendorPrice}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-800 font-bold">Profit Per Piece:</span>
              <span className="font-bold text-green-600">₹{product.profitPerPiece}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// Vendor Products Component
function VendorProducts({ products, onRequestDelete, onViewProduct }) {
  if (!products || products.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No products allocated yet</p>
            <p className="text-sm text-gray-400 mt-1">Products allocated to you will appear here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          My Products
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.slice(0, 10).map((product, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4 flex-1">
                <img 
                  src={product.product?.images?.[0] || '/placeholder-product.jpg'} 
                  alt={product.product?.name}
                  className="w-12 h-12 object-cover rounded border"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{product.product?.name}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-500">Allocated:</span>
                      <span className="text-sm font-medium">{product.allocatedStock}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-500">Current:</span>
                      <span className="text-sm font-medium">{product.currentStock}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-500">Sold:</span>
                      <span className="text-sm font-medium">{product.soldStock}</span>
                    </div>
                  </div>
                  {(product.size || product.color) && (
                    <p className="text-xs text-gray-500 mt-1">
                      {product.size && `Size: ${product.size}`}
                      {product.size && product.color && ' • '}
                      {product.color && `Color: ${product.color}`}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={product.currentStock > 0 ? "default" : "destructive"}>
                  {product.currentStock > 0 ? 'In Stock' : 'Out of Stock'}
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onViewProduct(product)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onRequestDelete(product)}
                >
                  Delete Request
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Invoices Component
function InvoicesSection({ invoices, user, onCreateInvoice, onViewInvoice }) {
  const getStatusColor = (status) => {
    const colors = {
      Draft: 'bg-gray-100 text-gray-800',
      Sent: 'bg-blue-100 text-blue-800',
      Paid: 'bg-green-100 text-green-800',
      Overdue: 'bg-red-100 text-red-800',
      Cancelled: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Invoices
        </CardTitle>
        {!user.isVendor && (
          <Button onClick={onCreateInvoice}>
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {invoices.length > 0 ? (
          <div className="space-y-4">
            {invoices.slice(0, 5).map((invoice) => (
              <div key={invoice._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">#{invoice.invoiceNumber}</p>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        <span>{invoice.vendor?.companyName || 'System'}</span>
                        <span>•</span>
                        <span>{invoice.type?.replace('_', ' ') || 'Invoice'}</span>
                        <span>•</span>
                        <span className="flex items-center">
                          <IndianRupee className="w-3 h-3 mr-1" />
                          {invoice.totalAmount?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>Due: {new Date(invoice.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(invoice.status)}>
                    {invoice.status}
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onViewInvoice(invoice)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    PDF
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No invoices found</p>
            <p className="text-sm text-gray-400 mt-1">
              {user.isVendor ? 'Your invoices will appear here' : 'Create your first invoice to get started'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Invoice View Modal Component
function InvoiceViewModal({ invoice, isOpen, onClose }) {
  if (!invoice) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Invoice #${invoice.invoiceNumber}`}
      size="xl"
    >
      <div className="space-y-6">
        {/* Invoice Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Vendor Information</h4>
            <div className="space-y-1 text-sm">
              <p className="font-medium">{invoice.vendor?.companyName}</p>
              <p className="text-gray-600">{invoice.vendor?.contactPerson}</p>
              <p className="text-gray-600">{invoice.vendor?.phone}</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Invoice Details</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">{invoice.type?.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <Badge variant={
                  invoice.status === 'Paid' ? 'default' : 
                  invoice.status === 'Pending' ? 'secondary' : 'outline'
                }>
                  {invoice.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Due Date:</span>
                <span className="font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Items</h4>
          <div className="border rounded-lg">
            <div className="grid grid-cols-12 gap-4 p-3 bg-gray-50 border-b font-medium text-sm">
              <div className="col-span-5">Product</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2 text-right">Unit Price</div>
              <div className="col-span-3 text-right">Total</div>
            </div>
            {invoice.items?.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 p-3 border-b text-sm">
                <div className="col-span-5">
                  <p className="font-medium">{item.productName}</p>
                  {(item.size || item.color) && (
                    <p className="text-xs text-gray-500">
                      {item.size && `Size: ${item.size}`}
                      {item.size && item.color && ' • '}
                      {item.color && `Color: ${item.color}`}
                    </p>
                  )}
                </div>
                <div className="col-span-2 text-center">{item.quantity}</div>
                <div className="col-span-2 text-right">
                  <IndianRupee className="w-3 h-3 inline mr-1" />
                  {item.unitPrice?.toFixed(2)}
                </div>
                <div className="col-span-3 text-right font-medium">
                  <IndianRupee className="w-3 h-3 inline mr-1" />
                  {item.totalPrice?.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="border-t pt-4">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">
                  <IndianRupee className="w-3 h-3 inline mr-1" />
                  {invoice.subtotal?.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax:</span>
                <span className="font-medium">
                  <IndianRupee className="w-3 h-3 inline mr-1" />
                  {invoice.taxAmount?.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2 font-bold text-lg">
                <span>Total Amount:</span>
                <span className="text-blue-600">
                  <IndianRupee className="w-4 h-4 inline mr-1" />
                  {invoice.totalAmount?.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes & Terms */}
        {(invoice.notes || invoice.terms) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {invoice.notes && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{invoice.notes}</p>
              </div>
            )}
            {invoice.terms && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Terms & Conditions</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{invoice.terms}</p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// Main Dashboard Component
export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [vendorData, setVendorData] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [isAllocationModalOpen, setIsAllocationModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isDeleteRequestModalOpen, setIsDeleteRequestModalOpen] = useState(false);
  const [isProductViewModalOpen, setIsProductViewModalOpen] = useState(false);
  const [isInvoiceViewModalOpen, setIsInvoiceViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    if (user && !authLoading) {
      loadDashboardData();
    }
  }, [user, authLoading]);  

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load dashboard data based on user role
      const dashboardResponse = await dashboardService.getDashboardData();
      if (dashboardResponse.success) {
        setDashboardData(dashboardResponse.data);
        
        if (user.isVendor) {
          // ✅ VENDOR: Only show vendor's own data
          setVendorData(dashboardResponse.data.vendor);
          setInvoices(dashboardResponse.data.recentInvoices || []);
        } else {
          // ✅ ADMIN: Show all data
          setInvoices(dashboardResponse.data.recentInvoices || []);
        }
      } else {
        toast.error(dashboardResponse.error || 'Failed to load dashboard data');
      }
    } catch (error) {
      console.error('Dashboard load error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = (product) => {
    setSelectedProduct(product);
    setIsDeleteRequestModalOpen(true);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setIsProductViewModalOpen(true);
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setIsInvoiceViewModalOpen(true);
  };

  const handleCreateInvoice = () => {
    setIsInvoiceModalOpen(true);
  };

  const handleModalSuccess = () => {
    loadDashboardData(); // Refresh data after successful action
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Please login to access dashboard</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {user.isVendor ? 'Vendor Dashboard' : 'Admin Dashboard'}
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {user.firstName} {user.lastName}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="text-sm">
              {user.isVendor 
                ? vendorData?.companyName 
                : user.role?.name === 'super_admin' ? 'Super Admin' : 'Admin'
              }
            </Badge>
            {!user.isVendor && (
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => setIsVendorModalOpen(true)} size="sm">
                  <Users className="w-4 h-4 mr-2" />
                  Create Vendor
                </Button>
                <Button variant="outline" onClick={() => setIsAllocationModalOpen(true)} size="sm">
                  <Package className="w-4 h-4 mr-2" />
                  Allocate Products
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Section */}
        {user.isVendor ? (
          <VendorStats 
            vendorData={vendorData} 
            stats={dashboardData?.stats} 
          />
        ) : (
          <AdminStats stats={dashboardData?.stats} />
        )}

        {/* Tabs Content */}
        <Tabs defaultValue="overview" className="mt-8">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            {!user.isVendor && (
              <TabsTrigger value="management">Management</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Recent Activity & Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {invoices.length > 0 ? (
                    <div className="space-y-3">
                      {invoices.slice(0, 5).map((invoice, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => handleViewInvoice(invoice)}>
                          <div>
                            <p className="font-medium text-sm">Invoice #{invoice.invoiceNumber}</p>
                            <p className="text-xs text-gray-600">
                              {invoice.vendor?.companyName || 'System'} • 
                              ₹{invoice.totalAmount?.toLocaleString()} • 
                              {new Date(invoice.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant={
                            invoice.status === 'Paid' ? 'default' : 
                            invoice.status === 'Pending' ? 'secondary' : 'outline'
                          }>
                            {invoice.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No recent activity</p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Quick Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {user.isVendor ? (
                      <>
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                          <span className="text-sm font-medium">Outstanding Balance</span>
                          <span className="font-bold">₹{dashboardData?.stats?.outstandingBalance?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                          <span className="text-sm font-medium">Recent Sales (7 days)</span>
                          <span className="font-bold">₹{dashboardData?.stats?.recentSales?.toLocaleString() || 0}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                          <span className="text-sm font-medium">Total Revenue</span>
                          <span className="font-bold">₹{dashboardData?.stats?.totalSales?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                          <span className="text-sm font-medium">Total Profit</span>
                          <span className="font-bold">₹{dashboardData?.stats?.totalProfit?.toLocaleString() || 0}</span>
                        </div>
                      </>
                    )}
                    
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        View Detailed Reports
                      </Button>
                      <Button variant="outline" className="w-full justify-start" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export Data
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6 mt-6">
            {user.isVendor ? (
              <VendorProducts 
                products={vendorData?.products} 
                onRequestDelete={handleDeleteRequest}
                onViewProduct={handleViewProduct}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>All Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Product management for all vendors</p>
                    <p className="text-sm text-gray-400 mt-1">Use the management tab to allocate products</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="invoices" className="space-y-6 mt-6">
            <InvoicesSection 
              invoices={invoices}
              user={user}
              onCreateInvoice={handleCreateInvoice}
              onViewInvoice={handleViewInvoice}
            />
          </TabsContent>

          {!user.isVendor && (
            <TabsContent value="management" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Vendor Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Manage all vendors, product allocations, and system requests from this centralized panel.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button onClick={() => setIsVendorModalOpen(true)}>
                        <Users className="w-4 h-4 mr-2" />
                        Manage Vendors
                      </Button>
                      <Button variant="outline" onClick={() => setIsAllocationModalOpen(true)}>
                        <Package className="w-4 h-4 mr-2" />
                        Product Allocation
                      </Button>
                      <Button variant="outline">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        View Delete Requests
                      </Button>
                      <Button variant="outline">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Analytics & Reports
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isVendorModalOpen}
        onClose={() => setIsVendorModalOpen(false)}
        title="Create New Vendor"
        size="lg"
      >
        <VendorCreateForm 
          onSuccess={() => {
            setIsVendorModalOpen(false);
            handleModalSuccess();
            toast.success('Vendor created successfully!');
          }}
        />
      </Modal>

      <Modal
        isOpen={isAllocationModalOpen}
        onClose={() => setIsAllocationModalOpen(false)}
        title="Allocate Products to Vendor"
        size="xl"
      >
        <ProductAllocationForm 
          onSuccess={() => {
            setIsAllocationModalOpen(false);
            handleModalSuccess();
            toast.success('Products allocated successfully!');
          }}
        />
      </Modal>

      <Modal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        title="Create New Invoice"
        size="xl"
      >
        <InvoiceCreateForm 
          onSuccess={() => {
            setIsInvoiceModalOpen(false);
            handleModalSuccess();
            toast.success('Invoice created successfully!');
          }}
        />
      </Modal>

      {/* Product View Modal */}
      <ProductViewModal
        product={selectedProduct}
        isOpen={isProductViewModalOpen}
        onClose={() => {
          setIsProductViewModalOpen(false);
          setSelectedProduct(null);
        }}
      />

      {/* Invoice View Modal */}
      <InvoiceViewModal
        invoice={selectedInvoice}
        isOpen={isInvoiceViewModalOpen}
        onClose={() => {
          setIsInvoiceViewModalOpen(false);
          setSelectedInvoice(null);
        }}
      />

      {/* Delete Request Modal */}
      <Modal
        isOpen={isDeleteRequestModalOpen}
        onClose={() => {
          setIsDeleteRequestModalOpen(false);
          setSelectedProduct(null);
        }}
        title="Request Product Deletion"
        size="md"
      >
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="font-medium">{selectedProduct?.product?.name}</p>
            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
              <div>
                <span className="text-gray-600">Current Stock:</span>
                <span className="ml-2 font-medium">{selectedProduct?.currentStock}</span>
              </div>
              <div>
                <span className="text-gray-600">Sold Stock:</span>
                <span className="ml-2 font-medium">{selectedProduct?.soldStock}</span>
              </div>
              {selectedProduct?.size && (
                <div>
                  <span className="text-gray-600">Size:</span>
                  <span className="ml-2 font-medium">{selectedProduct.size}</span>
                </div>
              )}
              {selectedProduct?.color && (
                <div>
                  <span className="text-gray-600">Color:</span>
                  <span className="ml-2 font-medium">{selectedProduct.color}</span>
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for deletion *
            </label>
            <textarea
              placeholder="Please provide a reason for requesting product deletion..."
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteRequestModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={async () => {
                try {
                  // Handle delete request submission
                  await vendorService.requestDelete(
                    vendorData._id,
                    selectedProduct.product._id,
                    "User requested deletion" // You can get this from textarea
                  );
                  setIsDeleteRequestModalOpen(false);
                  setSelectedProduct(null);
                  handleModalSuccess();
                  toast.success('Delete request submitted successfully!');
                } catch (error) {
                  toast.error('Failed to submit delete request');
                }
              }}
            >
              Submit Request
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}



