"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

export default function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart, removeFromCart, updateQuantity } = useCart();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postcode: "",
    country: "Pakistan"
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: ""
  });

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Pre-fill form with user data if available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Generate unique order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // For guest users, create a user account from customer information
    let userId = null;
    if (!isAuthenticated) {
      // Create guest user ID from email and phone
      userId = `GUEST-${formData.email}-${formData.phone}`.replace(/[^a-zA-Z0-9-_]/g, '-');

      // Store guest user info for future reference
      const guestUsers = JSON.parse(localStorage.getItem('guestUsers') || '[]');
      const existingGuestUser = guestUsers.find(user => user.userId === userId);

      if (!existingGuestUser) {
        const guestUserData = {
          userId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postcode: formData.postcode,
          country: formData.country,
          roleType: 'customer',
          createdAt: new Date().toISOString(),
          orders: [orderId]
        };
        guestUsers.push(guestUserData);
        localStorage.setItem('guestUsers', JSON.stringify(guestUsers));
      } else {
        // Add order to existing guest user
        existingGuestUser.orders = existingGuestUser.orders || [];
        if (!existingGuestUser.orders.includes(orderId)) {
          existingGuestUser.orders.push(orderId);
        }
        localStorage.setItem('guestUsers', JSON.stringify(guestUsers));
      }

      // Store userId in session for tracking
      sessionStorage.setItem('guestUserId', userId);
    }

    // Create order object
    const orderData = {
      orderId,
      userId: isAuthenticated ? user?.id : userId,
      customerInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postcode: formData.postcode,
        country: formData.country
      },
      items: cartItems,
      paymentMethod,
      subtotal,
      shipping,
      tax,
      total,
      orderDate: new Date().toISOString(),
      status: 'confirmed',
      isGuestOrder: !isAuthenticated
    };

    // Store order in localStorage for tracking (in a real app, this would be sent to backend)
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    existingOrders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(existingOrders));

    // Clear the cart
    clearCart();

    // Redirect to order confirmation page
    router.push(`/order-confirmation/${orderId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Billing & Shipping */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-card rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 text-card-foreground">Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isAuthenticated ? (
                  // For logged-in users: only email and phone
                  <>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                      />
                    </div>
                  </>
                ) : (
                  // For guest users: full billing information
                  <>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-card rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 text-card-foreground">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    placeholder="Street address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Postcode *
                    </label>
                    <input
                      type="text"
                      name="postcode"
                      value={formData.postcode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Country *
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  >
                    <option value="Pakistan">Pakistan</option>
                    <option value="UK">United Kingdom</option>
                    <option value="USA">United States</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-card rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 text-card-foreground">Payment Method</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-2 text-[#cda434] focus:ring-[#cda434]"
                    />
                    <span className="text-foreground">Cash on Delivery (COD)</span>
                  </label>
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  Pay when your order is delivered to your doorstep.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 text-card-foreground">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={`${item.productId}-${item.size}-${item.color}`} className="flex items-center space-x-4">
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
                    <div className="flex flex-col items-end space-y-1">
                      <span className="font-semibold text-foreground">
                        Rs. {(item.price * item.quantity).toFixed(2)}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                          className="w-6 h-6 bg-muted hover:bg-muted/80 rounded-full flex items-center justify-center text-sm font-medium"
                        >
                          -
                        </button>
                        <span className="text-sm font-medium min-w-[20px] text-center">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                          className="w-6 h-6 bg-muted hover:bg-muted/80 rounded-full flex items-center justify-center text-sm font-medium"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.productId, item.size, item.color)}
                          className="text-xs text-destructive hover:text-destructive underline ml-2"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `Rs. ${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax</span>
                  <span>Rs. {tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-foreground border-t pt-2">
                  <span>Total</span>
                  <span>Rs. {total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-primary-blue-hover text-primary-foreground py-4 px-6 rounded-lg font-semibold text-lg transition-colors"
            >
              Place Order
            </button>

            {/* Terms and Conditions */}
            <div className="text-sm text-muted-foreground text-center">
              <p>By placing your order, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.</p>
            </div>

            {/* Order Tracking Link */}
            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground">
                Already have an order? <a href="/order-tracking" className="text-primary hover:underline font-semibold">Track your order here</a>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
