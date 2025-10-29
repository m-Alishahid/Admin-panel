"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleTrackOrder = (e) => {
    e.preventDefault();
    setError("");
    setOrder(null);
    setLoading(true);

    // Get orders from localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const foundOrder = orders.find(o => o.orderId === orderId.trim());

    setLoading(false);

    if (foundOrder) {
      setOrder(foundOrder);
    } else {
      setError("Order not found. Please check your Order ID and try again.");
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'text-blue-600 bg-blue-100';
      case 'processing':
        return 'text-yellow-600 bg-yellow-100';
      case 'shipped':
        return 'text-purple-600 bg-purple-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusSteps = (status) => {
    const steps = [
      { name: 'Order Confirmed', status: 'confirmed', completed: true },
      { name: 'Processing', status: 'processing', completed: ['processing', 'shipped', 'delivered'].includes(status.toLowerCase()) },
      { name: 'Shipped', status: 'shipped', completed: ['shipped', 'delivered'].includes(status.toLowerCase()) },
      { name: 'Delivered', status: 'delivered', completed: status.toLowerCase() === 'delivered' }
    ];
    return steps;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Track Your Order</h1>
          <p className="text-gray-600">Enter your Order ID to check the status of your order</p>
        </div>

        {/* Tracking Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <form onSubmit={handleTrackOrder} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-2">
                Order ID
              </label>
              <input
                type="text"
                id="orderId"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter your Order ID (e.g., ORD-123456789-ABCDEF)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                {loading ? 'Searching...' : 'Track Order'}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* Order Details */}
        {order && (
          <div className="space-y-6">
            {/* Order Status Overview */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Order Status</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              {/* Status Steps */}
              <div className="relative">
                <div className="flex items-center justify-between">
                  {getStatusSteps(order.status).map((step, index) => (
                    <div key={step.status} className="flex flex-col items-center flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                        step.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                      }`}>
                        {step.completed ? (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className="text-sm font-semibold">{index + 1}</span>
                        )}
                      </div>
                      <span className={`text-sm font-medium text-center ${
                        step.completed ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        {step.name}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Progress Line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10">
                  <div
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{
                      width: `${(getStatusSteps(order.status).filter(step => step.completed).length - 1) / 3 * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Order Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Order Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-semibold text-gray-800">{order.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span className="font-semibold text-gray-800">
                      {new Date(order.orderDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-semibold text-gray-800 capitalize">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-semibold text-gray-800">Rs. {order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Shipping Address</h3>
                <div className="text-gray-700">
                  <p className="font-semibold">
                    {order.customerInfo.firstName} {order.customerInfo.lastName}
                  </p>
                  <p>{order.customerInfo.address}</p>
                  <p>{order.customerInfo.city}, {order.customerInfo.postcode}</p>
                  <p>{order.customerInfo.country}</p>
                  <p className="mt-2">{order.customerInfo.phone}</p>
                  <p>{order.customerInfo.email}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={`${item.productId}-${item.size}-${item.color}`} className="flex items-center space-x-4 border-b pb-4 last:border-b-0 last:pb-0">
                    <img
                      src={item.image || "/placeholder-product.jpg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{item.name}</h4>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      {item.size && item.color && (
                        <p className="text-xs text-gray-500">
                          Size: {item.size}, Color: {item.color}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-gray-800">
                        Rs. {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="border-t pt-4 mt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>Rs. {order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{order.shipping === 0 ? 'Free' : `Rs. ${order.shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>Rs. {order.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-gray-800 border-t pt-2">
                    <span>Total</span>
                    <span>Rs. {order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => router.push(`/order-confirmation/${order.orderId}`)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                View Order Details
              </button>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Need Help?</h3>
          <p className="text-blue-700 mb-4">
            Can't find your order? Make sure you're entering the complete Order ID exactly as shown in your confirmation email.
          </p>
          <div className="text-sm text-blue-600">
            <p><strong>Example Order ID:</strong> ORD-1703123456789-ABCDEF123</p>
            <p className="mt-2">
              For COD orders, our delivery partner will contact you 24-48 hours before delivery.
              For any questions, please contact our customer support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
