// "use client";

// import { useState, useEffect } from "react";
// import { orderService } from "@/services/orderService";

// export default function Orders() {
//   const [orders, setOrders] = useState([]);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [filter, setFilter] = useState("all");
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchTerm, setSearchTerm] = useState("");
//   const itemsPerPage = 10;

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       const response = await orderService.getAll();
//       console.log('Response', response);
//       setOrders(response.orders || []);
//     } catch (error) {
//       console.error('Failed to fetch orders:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openModal = (order) => {
//     setSelectedOrder(order);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setSelectedOrder(null);
//     setIsModalOpen(false);
//   };

//   const updateOrderStatus = async (orderId, newStatus) => {
//     try {
//       const response = await fetch('/api/orders', {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ id: orderId, status: newStatus }),
//       });

//       if (response.ok) {
//         setOrders(prev =>
//           prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
//         );
//         if (selectedOrder && selectedOrder.id === orderId) {
//           setSelectedOrder({ ...selectedOrder, status: newStatus });
//         }
//       }
//     } catch (error) {
//       console.error('Failed to update order status:', error);
//     }
//   };

//   // Filter orders based on status and search term
//   const filteredOrders = orders.filter(order => {
//     const matchesFilter = filter === "all" || order.status?.toLowerCase() === filter;
//     const matchesSearch = order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          order.customer?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
//     return matchesFilter && matchesSearch;
//   });

//   // Pagination
//   const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case "completed":
//         return "bg-green-100 text-green-800";
//       case "processed":
//         return "bg-blue-100 text-blue-800";
//       case "pending":
//         return "bg-yellow-100 text-yellow-800";
//       case "cancelled":
//         return "bg-red-100 text-red-800";
//       case "returned":
//         return "bg-purple-100 text-purple-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const getStatusBadge = (status) => (
//     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
//       {status}
//     </span>
//   );

//   // Mock data for stats (you can replace with actual data)
//   const stats = {
//     totalOrders: 579,
//     delivered: 24
//   };

//   const statusCounts = {
//     all: 40,
//     completed: 31,
//     processed: 4,
//     returned: 2,
//     cancelled: 2
//   };

//   return (
//     <div className="space-y-6 p-6">
//       {/* Header Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="flex justify-between items-center">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-900">Total orders</h3>
//               <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="flex justify-between items-center">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-900">Delivered over time</h3>
//               <p className="text-3xl font-bold text-gray-900 mt-2">{stats.delivered}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//         {/* Filters and Search */}
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
//             {/* Status Filters */}
//             <div className="flex flex-wrap gap-2">
//               {[
//                 { key: "all", label: "All", count: statusCounts.all },
//                 { key: "completed", label: "Completed", count: statusCounts.completed },
//                 { key: "processed", label: "Processed", count: statusCounts.processed },
//                 { key: "returned", label: "Returned", count: statusCounts.returned },
//                 { key: "cancelled", label: "Cancelled", count: statusCounts.cancelled }
//               ].map((item) => (
//                 <button
//                   key={item.key}
//                   onClick={() => setFilter(item.key)}
//                   className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//                     filter === item.key
//                       ? "bg-blue-600 text-white"
//                       : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                   }`}
//                 >
//                   {item.label} {item.count}
//                 </button>
//               ))}
//             </div>

//             {/* Search */}
//             <div className="relative w-full lg:w-64">
//               <input
//                 type="text"
//                 placeholder="Search products..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//               <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//                 🔍
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Orders Table */}
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   Name
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   Price
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {paginatedOrders.map((order) => (
//                 <tr key={order._id} className="hover:bg-gray-50 transition-colors">
//                   <td className="px-6 py-4">
//                     <div>
//                       <div className="text-sm font-semibold text-gray-900">
//                         {order.items?.[0]?.productSnapshot?.name || "Sports Jacket"}
//                       </div>
//                       <div className="text-sm text-gray-500">#{order.orderNumber}</div>
//                     </div>
//                   </td>
//                   <td className="px-3 md:px-6 py-3 md:py-4">
//                     <div>
//                       <div className="text-sm font-medium text-gray-900">{order.customer?.name || order.customerEmail || 'N/A'}</div>
//                       <div className="text-xs md:text-sm text-gray-500">{order.customer?.email || order.customerEmail || 'N/A'}</div>
//                     </div>
//                   </td>
//                   <td className="px-3 md:px-6 py-3 md:py-4 text-sm font-semibold text-gray-900">${(order.pricing?.grandTotal || order.total || 0).toFixed(2)}</td>
//                   <td className="px-3 md:px-6 py-3 md:py-4">
//                     <select
//                       value={order.status}
//                       onChange={(e) => updateOrderStatus(order.id, e.target.value)}
//                       className={`text-xs font-medium rounded-full border-0 focus:ring-2 focus:ring-blue-500 px-2 md:px-3 py-1 ${getStatusColor(order.status)} cursor-pointer`}
//                     >
//                       <option value="Pending">Pending</option>
//                       <option value="Shipped">Shipped</option>
//                       <option value="Completed">Completed</option>
//                       <option value="Cancelled">Cancelled</option>
//                     </select>
//                   </td>
//                   <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
//                   <td className="px-3 md:px-6 py-3 md:py-4">
//                     <button
//                       onClick={() => openModal(order)}
//                       className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50"
//                     >
//                       👁️ View
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Empty State */}
//         {!loading && paginatedOrders.length === 0 && (
//           <div className="text-center py-12 px-4">
//             <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
//             </svg>
//             <h3 className="mt-4 text-lg font-medium text-gray-900">No orders found</h3>
//             <p className="mt-2 text-sm text-gray-500">No orders match your current filter selection.</p>
//           </div>
//         )}

//         {/* Loading State */}
//         {loading && (
//           <div className="text-center py-12">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//             <p className="mt-4 text-sm text-gray-600">Loading orders...</p>
//           </div>
//         )}

//         {/* Pagination */}
//         {!loading && paginatedOrders.length > 0 && (
//           <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
//             <div className="text-sm text-gray-700">
//               Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredOrders.length)} of {filteredOrders.length} results
//             </div>
//             <div className="flex space-x-2">
//               <button
//                 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                 disabled={currentPage === 1}
//                 className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//               >
//                 Previous
//               </button>
//               <button
//                 onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                 disabled={currentPage === totalPages}
//                 className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Order Details Modal */}
//       {isModalOpen && selectedOrder && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6 border-b border-gray-200">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-900">#{selectedOrder.orderNumber}</h2>
//                   <p className="text-gray-600 mt-1">Order details</p>
//                 </div>
//                 <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-xl">✖️</button>
//               </div>
//             </div>

//             <div className="p-6 space-y-6">
//               {/* Items Section */}
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Items</h3>
//                 {selectedOrder.items?.map((item, index) => (
//                   <div key={index} className="flex justify-between items-center py-3 border-b border-gray-200">
//                     <div>
//                       <p className="font-semibold text-gray-900">
//                         {item.productSnapshot?.name || "Sports Jacket"}
//                       </p>
//                       <p className="text-sm text-gray-500">Fashion</p>
//                       <p className="text-sm text-gray-500">Tips</p>
//                     </div>
//                     <p className="font-semibold text-gray-900">
//                       ${item.unitPrice ? (item.unitPrice / 100).toFixed(2) : "0.00"}
//                     </p>
//                   </div>
//                 ))}
//               </div>

//               {/* Customer Information */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
//                   <div className="space-y-2">
//                     <p className="text-sm md:text-base"><strong>Name:</strong> {selectedOrder.customer?.name || selectedOrder.customerEmail || 'N/A'}</p>
//                     <p className="text-sm md:text-base"><strong>Email:</strong> {selectedOrder.customer?.email || selectedOrder.customerEmail || 'N/A'}</p>
//                     <p className="text-sm md:text-base"><strong>Phone:</strong> {selectedOrder.customer?.phone || selectedOrder.customerPhone || 'N/A'}</p>
//                     <p className="text-sm md:text-base"><strong>Address:</strong> {selectedOrder.shippingAddress?.addressLine1 || selectedOrder.customer?.address || 'N/A'}</p>
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h3>
//                   <div className="space-y-2">
//                     <p className="text-sm md:text-base"><strong>Status:</strong> {getStatusBadge(selectedOrder.status)}</p>
//                     <p className="text-sm md:text-base"><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
//                     <p className="text-sm md:text-base"><strong>Total:</strong> ${(selectedOrder.pricing?.grandTotal || selectedOrder.total || 0).toFixed(2)}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Timeline */}
//               <div>
//                 <h3 className="text-base md:text-lg font-medium text-gray-900 mb-3 md:mb-4">Order Items</h3>
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full border divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         {["Product", "Category", "Price", "Qty", "Total"].map((h, i) => (
//                           <th key={i} className="px-3 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">{h}</th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {selectedOrder.items.map((item, i) => (
//                         <tr key={i}>
//                           <td className="px-3 md:px-4 py-2 md:py-3 text-sm">{item.productSnapshot?.name || item.productName || 'N/A'}</td>
//                           <td className="px-3 md:px-4 py-2 md:py-3 text-sm">{item.category || 'N/A'}</td>
//                           <td className="px-3 md:px-4 py-2 md:py-3 text-sm">${(item.unitPrice || item.price || 0).toFixed(2)}</td>
//                           <td className="px-3 md:px-4 py-2 md:py-3 text-sm">{item.quantity}</td>
//                           <td className="px-3 md:px-4 py-2 md:py-3 text-sm font-medium">${(item.totalPrice || (item.price * item.quantity) || 0).toFixed(2)}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>

//             <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
//               <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
//                 Export
//               </button>
//               <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
//                 Update Status
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }





"use client"

import { useState, useEffect } from "react"
import { orderService } from "@/services/orderService"
import { OrderDetailsSheet } from "@/components/order-details-sheet"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const itemsPerPage = 10

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await orderService.getAll()
      setOrders(response.orders || [])
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const openSheet = (order) => {
    setSelectedOrder(order)
    setIsSheetOpen(true)
  }

  const closeSheet = () => {
    setSelectedOrder(null)
    setIsSheetOpen(false)
  }

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)))
  }

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filter === "all" || order.status?.toLowerCase() === filter
    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage)

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-purple-100 text-purple-800"
      case "shipped":
        return "bg-orange-100 text-orange-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const statusCounts = {
    all: orders.length,
    confirmed: orders.filter((o) => o.status?.toLowerCase() === "confirmed").length,
    processing: orders.filter((o) => o.status?.toLowerCase() === "processing").length,
    shipped: orders.filter((o) => o.status?.toLowerCase() === "shipped").length,
    delivered: orders.filter((o) => o.status?.toLowerCase() === "delivered").length,
    cancelled: orders.filter((o) => o.status?.toLowerCase() === "cancelled").length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-1">Manage and track all customer orders</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 font-medium">Total Orders</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{orders.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 font-medium">Pending</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{statusCounts.pending || 0}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 font-medium">Delivered</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{statusCounts.delivered}</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
              {[
                { key: "all", label: "All" },
                { key: "confirmed", label: "Confirmed" },
                { key: "processing", label: "Processing" },
                { key: "shipped", label: "Shipped" },
                { key: "delivered", label: "Delivered" },
                { key: "cancelled", label: "Cancelled" },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    setFilter(item.key)
                    setCurrentPage(1)
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === item.key ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {item.label}{" "}
                  <span className="text-xs ml-1">({statusCounts[item.key] || 0})</span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full lg:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : paginatedOrders.length === 0 ? (
            <div className="text-center py-12 px-4">
              <p className="text-gray-600">No orders found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-900">#{order.orderNumber}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{order.shippingAddress?.fullName || "N/A"}</p>
                            <p className="text-sm text-gray-500">{order.customerEmail}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-900">
                            {order.items?.length || 0} item
                            {order.items?.length !== 1 ? "s" : ""}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-900">
                            ₹{(order.pricing?.grandTotal / 100).toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              order.status,
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => openSheet(order)}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredOrders.length)} of{" "}
                  {filteredOrders.length} results
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Order Details Sheet */}
      <OrderDetailsSheet
        order={selectedOrder}
        isOpen={isSheetOpen}
        onClose={closeSheet}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  )
}
