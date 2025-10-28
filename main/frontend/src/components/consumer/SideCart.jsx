// src/components/consumer/SideCart.jsx
import React, { useState, useEffect } from "react";
// Corrected import path
import { useAuthStore } from "../../store/useAuthStore";
import { ConsumerListService } from "../../services/consumer/consumerListService";
import { useConsumerDataStore } from "../../store/consumer/consumerDataStore";
import { useNavigate } from "react-router-dom";
// Corrected import path
import { formatCurrency } from "../../lib/utils"; // Import formatCurrency

const SideCart = ({ isOpen, onClose }) => {
  // --- STATE ---
  const [cartItems, setCartItems] = useState([]);
  const [prices, setPrices] = useState({
    subtotal: 0,
    shipping: 0, // Example fixed shipping
    tax: 0, // Example tax rate
    total: 0,
  });
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [couponApplied, setCouponApplied] = useState(false); // Example state
  const [loading, setLoading] = useState(true); // Added loading state

  // --- HOOKS ---
  const navigate = useNavigate();
  // Assuming ConsumerListService provides these functions:
  const currentUser = useAuthStore((s) => s.currentUser);
  const { removeFromList, updateList } = ConsumerListService;
  const fetchLists = useConsumerDataStore((state) => state.fetchLists);

  const lists = useConsumerDataStore((state) => state.lists);

  // --- EFFECTS ---
  // Load cart items on mount or when isOpen changes
  useEffect(() => {
    if (isOpen) {
      setLoading(true); // Start loading

      const loadCart = async () => {
        try {
          const currentCartItems = lists?.cart || [];
          setCartItems(currentCartItems);
          updatePrices(currentCartItems);
        } catch (error) {
          console.error("Error loading cart:", error);
          // Optionally show an error message to the user
        } finally {
        }
      };
      if (currentUser?.type === "consumer") {
        loadCart();
      }
      setLoading(false);
    }
  }, [isOpen]);

  // Update prices based on cart items
  const updatePrices = (items) => {
    const subtotal = items.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 0), // Use safe defaults
      0
    );
    const shipping = subtotal > 0 ? 5.99 : 0; // Only add shipping if there are items
    const tax = subtotal * 0.08; // 8% tax example
    const total = subtotal + shipping + tax;

    setPrices({ subtotal, shipping, tax, total });
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      const newList = await removeFromList("cart", productId);
      useConsumerDataStore.setState((state) => ({
        ...state,
        lists: { ...newList },
      }));
      const updatedCartItems = newList?.cart || [];
      setCartItems(updatedCartItems);
      updatePrices(updatedCartItems);
    } catch (err) {
      console.error("Error removing from cart:", err);
      // Optionally show error feedback
    }
  };

  // Apply coupon code (Placeholder logic)
  const applyCoupon = () => {
    if (couponCode.trim().toUpperCase() === "LOCARTO10") {
      setCouponMessage("Coupon 'LOCARTO10' applied successfully!");
      setCouponApplied(true);
      // Add logic here to actually adjust the price if needed
    } else if (couponCode.trim()) {
      setCouponMessage("Invalid coupon code.");
      setCouponApplied(false);
    } else {
      setCouponMessage("");
      setCouponApplied(false);
    }
  };

  // Navigate to checkout page and close the side cart
  const handleCheckout = () => {
    navigate("/consumer/checkout"); // Navigate to the new checkout route
    onClose(); // Close the side cart drawer
  };

  // --- RENDER ---
  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden transition-opacity duration-300 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose} // Close when clicking the overlay
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
    >
      {/* Enhanced Overlay with Backdrop Blur */}
      <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm" />

      {/* Enhanced Cart Drawer */}
      <div
        className={`absolute right-0 top-0 h-full w-full max-w-sm sm:max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the drawer
      >
        {/* Enhanced Header */}
        <div className="flex justify-between items-center p-5 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 flex-shrink-0">
          <h2
            id="cart-title"
            className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2"
          >
            <i className="fas fa-shopping-cart text-orange-500"></i>
            Your Cart
            {!loading && cartItems.length > 0 && (
              <span className="ml-1 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                {cartItems.length}
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors duration-200"
            aria-label="Close cart"
          >
            <i className="fas fa-times text-sm"></i>
          </button>
        </div>

        {/* Enhanced Cart Content Area (Scrollable) */}
        <div className="flex-grow overflow-y-auto custom-scrollbar p-5 sm:p-6">
          {/* Loading State */}
          {loading ? (
            <div className="text-center py-16 text-gray-500">
              <i className="fas fa-spinner fa-spin text-3xl mb-4"></i>
              <p>Loading cart...</p>
            </div>
          ) : /* Enhanced Empty Cart State */
          cartItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-shopping-cart text-3xl text-gray-400"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Start adding items to see them here
              </p>
              <button
                onClick={onClose}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            // Cart has items - Render sections
            <>
              {/* Cart Items List */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item, index) => (
                  <div
                    key={item.product_id} // Use product_id as key
                    className="group bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all duration-200 border border-gray-100 flex items-center gap-4 hover:cursor-pointer"
                    style={{
                      animation: `slideIn 0.3s ease-out ${index * 0.05}s both`, // Staggered animation
                    }}
                    onClick={() => navigate(`/product/${item.product_id}`)}
                  >
                    {/* Image */}
                    <div className="relative flex-shrink-0">
                      <img
                        // Use product_images safely
                        src={
                          item.product_images?.[0]?.url ||
                          "https://placehold.co/80x80/e2e8f0/e2e8f0?text=IMG"
                        }
                        alt={item.name || "Product"} // Use name safely
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shadow-sm border border-gray-200"
                      />
                      {/* Quantity Badge */}
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow">
                        {item.quantity}
                      </div>
                    </div>
                    {/* Details and Actions */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate text-sm sm:text-base">
                        {item.name || "Product Name"}
                      </h3>
                      <p className="text-orange-600 font-bold text-sm sm:text-base">
                        {formatCurrency(item.price)}
                      </p>
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-medium text-gray-800 text-sm">
                          Quantity:
                        </span>
                        <span className="text-gray-800 text-sm font-semibold">
                          {item.quantity}
                        </span>
                      </div>
                    </div>
                    {/* Remove Button */}
                    <button
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 opacity-0 group-hover:opacity-100 flex-shrink-0"
                      onClick={() => removeFromCart(item.product_id)}
                      title="Remove item"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <i className="fas fa-trash text-sm"></i>
                    </button>
                  </div>
                ))}
              </div>

              {/* Enhanced Coupon Section */}
              <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-tag text-orange-500"></i>
                    <span className="text-sm font-medium text-gray-700">
                      Have a coupon?
                    </span>
                  </div>
                  {/* Remove coupon button - Add logic later */}
                  {/* {couponApplied && (
                    <button className="text-xs text-red-500 hover:text-red-600 transition-colors duration-200">
                      Remove
                    </button>
                  )} */}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    disabled
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm"
                  />
                  <button
                    onClick={applyCoupon}
                    className="bg-orange-500 text-white px-4 sm:px-5 py-2 sm:py-3 rounded-lg hover:bg-orange-600 transition-colors duration-200 font-semibold text-sm"
                  >
                    Apply
                  </button>
                </div>
                {/* Coupon Message Area */}
                {couponMessage && (
                  <p
                    className={`mt-2 text-xs font-medium ${
                      couponApplied ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {couponMessage}
                  </p>
                )}
              </div>

              {/* Enhanced Order Summary */}
              <div className="mt-6 p-5 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <i className="fas fa-receipt text-orange-500"></i>
                  Order Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-800">
                      {formatCurrency(prices.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-medium text-gray-800">
                      {formatCurrency(prices.shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (Est.)</span>
                    <span className="font-medium text-gray-800">
                      {formatCurrency(prices.tax)}
                    </span>
                  </div>
                  {/* Example Discount - Add logic later */}
                  {/* {couponApplied && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-medium">
                        -{formatCurrency(prices.subtotal * 0.10)}
                      </span>
                    </div>
                  )} */}
                  <div className="border-t border-gray-200 pt-3 mt-2">
                    <div className="flex justify-between font-bold text-base text-gray-900">
                      <span>Total</span>
                      <span className="text-orange-600">
                        {formatCurrency(prices.total)}{" "}
                        {/* Adjust if discount applied */}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Enhanced Checkout Footer */}
        <div className="p-5 sm:p-6 border-t border-gray-100 bg-white flex-shrink-0">
          <button
            onClick={handleCheckout}
            // **REMOVED disabled attribute**
            // disabled={cartItems.length === 0 || loading}
            className={`w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 sm:py-4 rounded-xl text-sm sm:text-base font-bold transition-all duration-200 shadow-lg flex items-center justify-center gap-2 ${
              cartItems.length === 0 || loading
                ? "opacity-60 cursor-not-allowed" // Keep visual disabled state for clarity
                : "hover:from-orange-600 hover:to-red-600 hover:shadow-xl transform hover:scale-[1.02]"
            }`}
          >
            <span>Proceed to Checkout</span>
            <i className="fas fa-arrow-right text-sm"></i>
          </button>
          <button
            onClick={onClose}
            className="w-full text-center text-gray-500 hover:text-gray-700 mt-3 text-sm font-medium"
          >
            or Continue Shopping
          </button>
        </div>
      </div>

      {/* Styles for animation and scrollbar */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #cbd5e1 #f1f5f9; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
};

export default SideCart;
