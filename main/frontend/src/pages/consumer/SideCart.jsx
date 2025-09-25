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
      className={`fixed inset-0 z-50 overflow-hidden ${
        isOpen ? "block" : "hidden"
      }`}
      onClick={onClose}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      {/* Cart Drawer */}
      <div
        className={`absolute right-0 top-0 h-full w-80 md:w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold flex items-center">
            <i className="fas fa-shopping-cart mr-2"></i>
            Your Cart
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Cart Content */}
        <div className="p-4 max-h-[calc(100vh-120px)] overflow-y-auto">
          {/* Coupon Message */}
          {couponMessage && (
            <div
              className={`mb-4 p-2 text-sm rounded ${
                couponApplied
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {couponMessage}
            </div>
          )}

          {/* Cart Items */}
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <i className="fas fa-shopping-cart text-4xl text-gray-300 mb-4"></i>
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <img
                    src={item.image || "https://via.placeholder.com/50"}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      ₹{item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className="w-6 h-6 flex items-center justify-center text-sm"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      className="w-6 h-6 flex items-center justify-center text-sm"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Coupon Section */}
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Coupon:</span>
              <span className="text-sm text-red-500">Remove</span>
            </div>
            <div className="flex items-center mb-4">
              <input
                type="text"
                placeholder="Enter coupon code here"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-l focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={applyCoupon}
                className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-6 pt-4 border-t">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{prices.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{prices.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{prices.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span className="text-red-500">
                  -₹
                  {(
                    prices.total -
                    prices.subtotal -
                    prices.shipping -
                    prices.tax
                  ).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                <span>Total</span>
                <span>₹{prices.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Buttons */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex justify-between">
            <button
              onClick={onClose}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Continue shopping
            </button>
            <button
              onClick={handleCheckout}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideCart;
