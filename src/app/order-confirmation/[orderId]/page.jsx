"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get order from localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const foundOrder = orders.find(o => o.orderId === orderId);

    if (foundOrder) {
      setOrder(foundOrder);
    } else {
      // Order not found, redirect to home
      router.push('/');
    }
    setLoading(false);
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Order Not Found</h1>
            <p className="text-muted-foreground mb-6">The order you're looking for doesn't exist.</p>
            <button
              onClick={() => router.push('/')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-semibold"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">Thank you for your purchase. Your order has been successfully placed.</p>
        </div>

        {/* Order Details */}
        <div className="bg-card rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-card-foreground">Order Information</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID:</span>
                  <span className="font-semibold text-foreground">{order.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Date:</span>
                  <span className="font-semibold text-foreground">
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
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span className="font-semibold text-foreground capitalize">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-semibold text-green-600 capitalize">{order.status}</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-card-foreground">Shipping Address</h2>
              <div className="text-foreground">
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
        </div>

        {/* Order Items */}
        <div className="bg-card rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-card-foreground">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={`${item.productId}-${item.size}-${item.color}`} className="flex items-center space-x-4 border-b pb-4">
                <img
                  src={item.image || "/placeholder-product.jpg"}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  {item.size && item.color && (
                    <p className="text-xs text-muted-foreground">
                      Size: {item.size}, Color: {item.color}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="font-semibold text-foreground">
                    Rs. {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Order Totals */}
          <div className="border-t pt-4 mt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>Rs. {order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>{order.shipping === 0 ? 'Free' : `Rs. ${order.shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax</span>
                <span>Rs. {order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-foreground border-t pt-2">
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
            className="bg-blue-600 hover:bg-primary-blue-hover text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Continue Shopping
          </button>

        </div>

        {/* Order Tracking Info */}
        <div className="mt-8 bg-accent rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-accent-foreground mb-2">Track Your Order</h3>
          <p className="text-accent-foreground mb-4">
            You can track your order status using the Order ID: <strong>{order.orderId}</strong>
          </p>
          <button
            onClick={() => router.push('/order-tracking')}
            className="bg-blue-600 hover:bg-primary-blue-hover text-white px-6 py-2 rounded-lg font-semibold transition-colors mb-4"
          >
            Track Order
          </button>
          <p className="text-sm text-accent-foreground">
            We'll send you email updates about your order status. For COD orders, our delivery partner will contact you before delivery.
          </p>
        </div>
      </div>
    </div>
  );
}
