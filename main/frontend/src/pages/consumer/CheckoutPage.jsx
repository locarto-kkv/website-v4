// src/pages/consumer/CheckoutPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useConsumerData } from '../../context/consumer/consumerDataContext';
import { formatCurrency } from '../../lib/utils';

const CheckoutPage = () => {
  const { lists } = useConsumerData();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const cartItems = lists?.cart || [];

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );
  const shipping = subtotal > 0 ? 5.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for order submission logic
    alert('Order placement functionality coming soon!');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      <Navbar />

      <main className="flex-grow container mx-auto px-3 sm:px-4 py-6 sm:py-8 pt-20 sm:pt-24 max-w-7xl">
        {/* Header with Progress Indicator */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
            <div className="flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                <i className="fas fa-check text-xs sm:text-sm"></i>
              </div>
              <span className="hidden sm:inline ml-2 text-sm text-gray-600 font-medium">Cart</span>
            </div>
            <div className="w-12 sm:w-20 h-1 bg-green-500"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                2
              </div>
              <span className="hidden sm:inline ml-2 text-sm text-gray-800 font-semibold">Checkout</span>
            </div>
            <div className="w-12 sm:w-20 h-1 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <span className="hidden sm:inline ml-2 text-sm text-gray-500 font-medium">Complete</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-3 sm:mb-4">
            <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Checkout
            </span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
            Complete your order and get your items delivered to your doorstep
          </p>
        </div>

        {cartItems.length === 0 ? (
          // Empty Cart Message - Enhanced
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 p-8 sm:p-12 text-center max-w-2xl mx-auto">
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto">
                <i className="fas fa-shopping-cart text-4xl sm:text-5xl text-orange-500"></i>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <i className="fas fa-exclamation text-white text-sm"></i>
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">Your Cart is Empty</h2>
            <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items yet. Start shopping to fill your cart!
            </p>
            <Link
              to="/map"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <i className="fas fa-arrow-left"></i>
              Continue Shopping
            </Link>
          </div>
        ) : (
          // Checkout Form and Summary - Enhanced
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Shipping & Payment Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information Section */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-5 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <i className="fas fa-user text-white text-sm"></i>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Contact Information</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div className="relative">
                      <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        required
                        className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-sm sm:text-base transition-all duration-300 hover:border-gray-300"
                      />
                    </div>
                    <div className="relative">
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        required
                        className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-sm sm:text-base transition-all duration-300 hover:border-gray-300"
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      required
                      className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-sm sm:text-base transition-all duration-300 hover:border-gray-300"
                    />
                  </div>
                </form>
              </div>

              {/* Shipping Address Section */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-5 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <i className="fas fa-map-marker-alt text-white text-sm"></i>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Shipping Address</h2>
                </div>
                <div className="space-y-4 sm:space-y-5">
                  <div className="relative">
                    <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Main Street, Apt 4B"
                      required
                      className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-sm sm:text-base transition-all duration-300 hover:border-gray-300"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                    <div className="relative">
                      <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Mumbai"
                        required
                        className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-sm sm:text-base transition-all duration-300 hover:border-gray-300"
                      />
                    </div>
                    <div className="relative">
                      <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-2">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="Maharashtra"
                        required
                        className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-sm sm:text-base transition-all duration-300 hover:border-gray-300"
                      />
                    </div>
                    <div className="relative">
                      <label htmlFor="pincode" className="block text-sm font-semibold text-gray-700 mb-2">
                        PIN Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="400001"
                        required
                        className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-sm sm:text-base transition-all duration-300 hover:border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information Section */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-5 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <i className="fas fa-credit-card text-white text-sm"></i>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Payment Details</h2>
                </div>
                <div className="space-y-4 sm:space-y-5">
                  <div className="relative">
                    <label htmlFor="cardName" className="block text-sm font-semibold text-gray-700 mb-2">
                      Cardholder Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                      className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-sm sm:text-base transition-all duration-300 hover:border-gray-300"
                    />
                  </div>
                  <div className="relative">
                    <label htmlFor="cardNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                      Card Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      required
                      maxLength="19"
                      className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-sm sm:text-base transition-all duration-300 hover:border-gray-300"
                    />
                    <div className="absolute right-4 top-11 flex gap-2">
                      <i className="fab fa-cc-visa text-2xl text-blue-600"></i>
                      <i className="fab fa-cc-mastercard text-2xl text-red-600"></i>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:gap-5">
                    <div className="relative">
                      <label htmlFor="expiryDate" className="block text-sm font-semibold text-gray-700 mb-2">
                        Expiry Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        required
                        maxLength="5"
                        className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-sm sm:text-base transition-all duration-300 hover:border-gray-300"
                      />
                    </div>
                    <div className="relative">
                      <label htmlFor="cvv" className="block text-sm font-semibold text-gray-700 mb-2">
                        CVV <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        required
                        maxLength="4"
                        className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-sm sm:text-base transition-all duration-300 hover:border-gray-300"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-orange-500 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <i className="fas fa-info-circle text-orange-500 mt-1"></i>
                    <p className="text-xs sm:text-sm text-gray-700">
                      <span className="font-semibold">Note:</span> This is a demonstration checkout page. Payment integration is not yet implemented. Your card details will not be processed.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary - Sticky on Desktop */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-gray-100 p-5 sm:p-8 lg:sticky lg:top-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <i className="fas fa-receipt text-white text-sm"></i>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Order Summary</h2>
                </div>

                {/* Items List */}
                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-b-0">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl sm:text-3xl">{item.image || '📦'}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{item.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                        <p className="text-sm sm:text-base font-bold text-orange-600 mt-1">
                          {formatCurrency((item.price || 0) * (item.quantity || 0))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 py-6 border-t-2 border-gray-200">
                  <div className="flex justify-between items-center text-sm sm:text-base">
                    <span className="text-gray-600 font-medium">Subtotal</span>
                    <span className="font-semibold text-gray-800">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm sm:text-base">
                    <span className="text-gray-600 font-medium flex items-center gap-2">
                      Shipping
                      <i className="fas fa-truck text-xs text-green-500"></i>
                    </span>
                    <span className="font-semibold text-gray-800">{formatCurrency(shipping)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm sm:text-base">
                    <span className="text-gray-600 font-medium">Tax (Est. 8%)</span>
                    <span className="font-semibold text-gray-800">{formatCurrency(tax)}</span>
                  </div>
                  
                  {/* Promo Code Section */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Promo code"
                        className="flex-1 p-2 sm:p-3 border-2 border-gray-200 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                      />
                      <button className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold text-xs sm:text-sm hover:bg-gray-200 transition-colors">
                        Apply
                      </button>
                    </div>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center text-lg sm:text-xl font-bold py-6 border-t-2 border-gray-200">
                  <span className="text-gray-900">Total</span>
                  <span className="text-2xl sm:text-3xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    {formatCurrency(total)}
                  </span>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <i className="fas fa-lock"></i>
                  Place Secure Order
                </button>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-4 text-gray-500">
                    <div className="flex items-center gap-2">
                      <i className="fas fa-shield-alt text-green-500"></i>
                      <span className="text-xs sm:text-sm font-medium">Secure</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="fas fa-truck text-blue-500"></i>
                      <span className="text-xs sm:text-sm font-medium">Fast Delivery</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="fas fa-undo text-orange-500"></i>
                      <span className="text-xs sm:text-sm font-medium">Easy Returns</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;