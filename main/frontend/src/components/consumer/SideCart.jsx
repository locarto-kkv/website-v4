// src/components/SideCart.jsx
import React, { useState, useEffect } from "react";
import { ConsumerListService } from "../../services/consumer/consumerListService";
import { useNavigate } from "react-router-dom";

const SideCart = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [prices, setPrices] = useState({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0,
  });
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const navigate = useNavigate();

  const { getList, removeFromList, updateList } = ConsumerListService;

  // Load cart items on mount
  // useEffect(() => {
  //   const loadCart = async () => {
  //     const res = await getList();
  //     if (res.cart) {
  //       setCartItems(res.cart);
  //       updatePrices(res.cart);
  //     }
  //   };
  // loadCart();
  // }, []);

  // Update prices based on cart items
  const updatePrices = (items) => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shipping = 5.99;
    const tax = subtotal * 0.08; // 8% tax example
    const total = subtotal + shipping + tax;

    setPrices({ subtotal, shipping, tax, total });
  };

  // Update quantity
  const updateQuantity = async (itemId, change) => {
    const newQty = Math.max(
      1,
      cartItems.find((item) => item.id === itemId)?.quantity + change
    );
    const updatedCart = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: newQty } : item
    );
    await updateList("cart", newQty, itemId);
    setCartItems(updatedCart);
    updatePrices(updatedCart);
  };

  // Remove item from cart
  const removeFromCart = async (id) => {
    await removeFromList("cart", id);
    setCartItems(cartItems.filter((item) => item.id !== id));
    updatePrices(cartItems.filter((item) => item.id !== id));
  };

  // Apply coupon code
  const applyCoupon = () => {
    if (couponCode.trim()) {
      setCouponMessage("Coupon code applied successfully.");
      setCouponApplied(true);
    }
  };

  // Close cart and clear message
  const handleCheckout = () => {
    navigate("/checkout");
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden transition-opacity duration-300 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      {/* Enhanced Overlay with Backdrop Blur */}
      <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm" />

      {/* Enhanced Cart Drawer */}
      <div
        className={`absolute right-0 top-0 h-full w-80 md:w-96 bg-white shadow-2xl transform transition-all duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Enhanced Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <i className="fas fa-shopping-cart text-blue-600 text-sm"></i>
            </div>
            Your Cart
            {cartItems.length > 0 && (
              <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                {cartItems.length}
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <i className="fas fa-times text-sm"></i>
          </button>
        </div>

        {/* Enhanced Cart Content */}
        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
          {/* Enhanced Coupon Message */}
          {couponMessage && (
            <div
              className={`mb-6 p-4 text-sm rounded-lg border-l-4 transition-all duration-300 ${
                couponApplied
                  ? "bg-emerald-50 text-emerald-800 border-emerald-400"
                  : "bg-amber-50 text-amber-800 border-amber-400"
              }`}
            >
              <div className="flex items-center">
                <i className={`fas ${couponApplied ? 'fa-check-circle' : 'fa-info-circle'} mr-2`}></i>
                {couponMessage}
              </div>
            </div>
          )}

          {/* Enhanced Empty Cart State */}
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-shopping-cart text-3xl text-gray-400"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">Your cart is empty</h3>
              <p className="text-gray-400 text-sm mb-6">Start adding items to see them here</p>
              <button
                onClick={onClose}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div 
                  key={item.id} 
                  className="group bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all duration-200 border border-gray-100"
                  style={{
                    animation: `slideIn 0.3s ease-out ${index * 0.1}s both`
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={item.image || "https://via.placeholder.com/60"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg shadow-sm"
                      />
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate">{item.name}</h3>
                      <p className="text-blue-600 font-medium">
                        ₹{item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 bg-white rounded-lg shadow-sm border">
                      <button
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-l-lg transition-colors duration-200"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <i className="fas fa-minus text-xs"></i>
                      </button>
                      <span className="w-10 text-center font-medium text-gray-800">{item.quantity}</span>
                      <button
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-r-lg transition-colors duration-200"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <i className="fas fa-plus text-xs"></i>
                      </button>
                    </div>
                    <button
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 opacity-0 group-hover:opacity-100"
                      onClick={() => removeFromCart(item.id)}
                      title="Remove item"
                    >
                      <i className="fas fa-trash text-sm"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {cartItems.length > 0 && (
            <>
              {/* Enhanced Coupon Section */}
              <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <i className="fas fa-tag text-blue-600 mr-2"></i>
                    <span className="text-sm font-medium text-gray-700">Have a coupon?</span>
                  </div>
                  {couponApplied && (
                    <button className="text-sm text-red-500 hover:text-red-600 transition-colors duration-200">
                      Remove
                    </button>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <button
                    onClick={applyCoupon}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Enhanced Order Summary */}
              <div className="mt-8 p-5 bg-gray-50 rounded-xl border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <i className="fas fa-receipt text-blue-600 mr-2"></i>
                  Order Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">₹{prices.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-medium">₹{prices.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span className="font-medium">₹{prices.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Discount</span>
                    <span className="text-emerald-600 font-medium">
                      -₹{(prices.total - prices.subtotal - prices.shipping - prices.tax).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between font-bold text-lg text-gray-800">
                      <span>Total</span>
                      <span className="text-blue-600">₹{prices.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Enhanced Checkout Footer */}
        <div className="p-6 border-t border-gray-100 bg-white">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 transition-colors duration-200 flex items-center"
            >
              <i className="fas fa-arrow-left mr-2 text-sm"></i>
              Continue shopping
            </button>
            <button
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <span>Checkout</span>
              <i className="fas fa-arrow-right ml-2 text-sm"></i>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default SideCart;