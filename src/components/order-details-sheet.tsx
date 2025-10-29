"use client"

import { useState } from "react"
import { orderService } from "@/services/orderService"
import { ChevronLeft, X } from "lucide-react"

interface OrderDetailsSheetProps {
  order: any
  isOpen: boolean
  onClose: () => void
  onStatusUpdate: (orderId: string, newStatus: string) => void
}

export function OrderDetailsSheet({ order, isOpen, onClose, onStatusUpdate }: OrderDetailsSheetProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState(order?.status || "")

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true)
    try {
      await orderService.updateStatus(order._id, newStatus)
      setSelectedStatus(newStatus)
      onStatusUpdate(order._id, newStatus)
    } catch (error) {
      console.error("Failed to update status:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "processing":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "shipped":
        return "bg-orange-50 text-orange-700 border-orange-200"
      case "delivered":
        return "bg-green-50 text-green-700 border-green-200"
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200"
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "text-orange-600"
      case "completed":
        return "text-green-600"
      case "failed":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  if (!isOpen || !order) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={onClose} />

      {/* Sheet */}
      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Order ID #{order.orderNumber}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status Badges */}
          <div className="flex gap-3 mt-4">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                order.status,
              )}`}
            >
              {order.status}
            </span>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-gray-200 ${getPaymentStatusColor(
                order.payment?.status,
              )}`}
            >
              {order.payment?.status === "pending" ? "Unfulfilled" : "Fulfilled"}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Order Items Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items?.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {/* Product Image Placeholder */}
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📦</span>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">{item.productSnapshot?.name || "Product"}</h4>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div>
                        <span className="text-gray-500">Size:</span>{" "}
                        <span className="font-medium">{item.variant?.size || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Color:</span>{" "}
                        <span className="font-medium">{item.variant?.color || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Quantity:</span>{" "}
                        <span className="font-medium">{item.quantity}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Stock:</span>{" "}
                        <span className="font-medium">{item.productSnapshot?.originalStock || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold text-gray-900">₹{(item.unitPrice / 100).toFixed(2)}</p>
                    <p className="text-sm text-gray-500 mt-1">Total: ₹{(item.totalPrice / 100).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span className="font-medium">₹{(order.pricing?.subtotal / 100).toFixed(2)}</span>
              </div>
              {order.pricing?.discount > 0 && (
                <div className="flex justify-between text-gray-700">
                  <span>Discount</span>
                  <span className="font-medium text-green-600">-₹{(order.pricing?.discount / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span className="font-medium">₹{(order.pricing?.shipping / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax</span>
                <span className="font-medium">₹{(order.pricing?.tax / 100).toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-xl font-bold text-gray-900">₹{(order.pricing?.grandTotal / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Name</p>
                <p className="font-medium text-gray-900">{order.shippingAddress?.fullName || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="font-medium text-gray-900">
                  {order.shippingAddress?.email || order.customerEmail || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Phone</p>
                <p className="font-medium text-gray-900">
                  {order.shippingAddress?.phone || order.customerPhone || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                <p className="font-medium text-gray-900 uppercase">{order.payment?.method || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="font-medium text-gray-900">{order.shippingAddress?.addressLine1}</p>
              <p className="text-gray-600 mt-1">
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}
              </p>
              <p className="text-gray-600">{order.shippingAddress?.country}</p>
            </div>
          </div>

          {/* Status Update Section */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h3>
            <div className="flex gap-2 flex-wrap">
              {["confirmed", "processing", "shipped", "delivered", "cancelled"].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={isUpdating}
                  className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                    selectedStatus === status ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Print Invoice
          </button>
        </div>
      </div>
    </>
  )
}
