// src/pages/consumer/dashboard/CustomerLists.jsx
import React, { useState } from "react";
import { formatCurrency } from "../../../lib/utils.js";
import { useConsumerData } from "../../../context/consumer/consumerDataContext.jsx";
import { ConsumerListService } from "../../../services/consumer/consumerListService.js";
import { useNavigate } from "react-router-dom";

const CustomerLists = () => {
  const [listView, setListView] = useState("cart");
  const { lists, fetchLists } = useConsumerData();
  const { updateList, removeFromList } = ConsumerListService;
  const navigate = useNavigate();

  const updateQuantity = async (productId, delta) => {
    const currentItem = lists?.cart?.find((item) => item.id === productId);
    if (!currentItem) return;

    const currentQty = Number(currentItem.quantity) || 0;
    const newQty = Math.max(0, currentQty + delta);

    try {
      if (newQty <= 0) {
        await removeFromList("cart", productId);
      } else {
        await updateList("cart", newQty, productId);
      }
      await fetchLists();
    } catch (err) {
      console.error("Error updating cart quantity:", err);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await removeFromList("cart", productId);
      await fetchLists();
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await removeFromList("wishlist", productId);
      await fetchLists();
    } catch (err) {
      console.error("Error removing from wishlist:", err);
    }
  };

  const moveToCart = async (item) => {
    if (!item || !item.id) {
      console.error("Invalid item passed to moveToCart:", item);
      return;
    }
    try {
      await updateList("cart", 1, item.id);
      await removeFromList("wishlist", item.id);
      await fetchLists();
    } catch (err) {
      console.error("Error moving item to cart:", err);
    }
  };

  const totalCartAmount = Array.isArray(lists?.cart)
    ? lists.cart.reduce(
        (sum, item) => sum + (Number(item?.price) || 0) * (Number(item?.quantity) || 0),
        0
      )
    : 0;

  const cartItemsCount = lists?.cart?.length || 0;
  const wishlistItemsCount = lists?.wishlist?.length || 0;

  return (
    // Reduced spacing on mobile: space-y-4 instead of space-y-6
    <div className="space-y-4 md:space-y-6 lg:space-y-8">
      {/* Header Section - reduced padding on mobile */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 text-white shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black mb-1 md:mb-2">My Shopping Lists</h1>
            <p className="text-sm sm:text-base text-white/90">Manage your cart and wishlist items</p>
          </div>
          <div className="flex gap-3 sm:gap-4 md:gap-6">
            <div className="text-center bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4">
              <div className="text-xl sm:text-2xl md:text-3xl font-black">{cartItemsCount}</div>
              <div className="text-xs sm:text-sm text-white/90 font-medium">Cart Items</div>
            </div>
            <div className="text-center bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4">
              <div className="text-xl sm:text-2xl md:text-3xl font-black">{wishlistItemsCount}</div>
              <div className="text-xs sm:text-sm text-white/90 font-medium">Wishlist Items</div>
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Buttons - reduced padding on mobile */}
      <div className="flex gap-2 sm:gap-3 md:gap-4 bg-white rounded-xl sm:rounded-2xl p-1.5 sm:p-2 shadow-lg border border-gray-100">
        <button
          onClick={() => setListView("cart")}
          className={`flex-1 py-2.5 sm:py-3 md:py-4 px-3 sm:px-4 md:px-6 rounded-lg sm:rounded-xl font-bold transition-all duration-300 text-sm sm:text-base relative overflow-hidden ${
            listView === "cart"
              ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg scale-105"
              : "bg-gray-50 text-gray-700 hover:bg-gray-100"
          }`}
        >
          <span className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2">
            <i className="fas fa-shopping-cart text-sm sm:text-base"></i>
            <span className="hidden sm:inline">Shopping Cart</span>
            <span className="sm:hidden">Cart</span>
            <span className={`ml-0.5 sm:ml-1 px-1.5 py-0.5 sm:px-2 rounded-full text-xs font-bold ${
              listView === "cart" ? "bg-white/20" : "bg-orange-100 text-orange-600"
            }`}>
              {cartItemsCount}
            </span>
          </span>
          {listView === "cart" && (
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          )}
        </button>
        <button
          onClick={() => setListView("wishlist")}
          className={`flex-1 py-2.5 sm:py-3 md:py-4 px-3 sm:px-4 md:px-6 rounded-lg sm:rounded-xl font-bold transition-all duration-300 text-sm sm:text-base relative overflow-hidden ${
            listView === "wishlist"
              ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg scale-105"
              : "bg-gray-50 text-gray-700 hover:bg-gray-100"
          }`}
        >
          <span className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2">
            <i className="fas fa-heart text-sm sm:text-base"></i>
            <span className="hidden sm:inline">My Wishlist</span>
            <span className="sm:hidden">Wishlist</span>
            <span className={`ml-0.5 sm:ml-1 px-1.5 py-0.5 sm:px-2 rounded-full text-xs font-bold ${
              listView === "wishlist" ? "bg-white/20" : "bg-orange-100 text-orange-600"
            }`}>
              {wishlistItemsCount}
            </span>
          </span>
          {listView === "wishlist" && (
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          )}
        </button>
      </div>

      {/* Cart View */}
      {listView === "cart" &&
        (!lists?.cart || lists.cart.length === 0 ? (
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 md:p-12 border border-gray-100">
            <div className="text-center py-6 sm:py-8 md:py-12">
              <div className="relative inline-block mb-4 md:mb-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto">
                  <i className="fas fa-shopping-cart text-4xl sm:text-5xl md:text-6xl text-orange-400"></i>
                </div>
                <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <i className="fas fa-plus text-white text-base sm:text-lg"></i>
                </div>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-3">Your Cart is Empty</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6 md:mb-8 max-w-md mx-auto">
                Start adding items to your cart and they'll appear here
              </p>
              <button
                onClick={() => navigate('/map')}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 text-sm sm:text-base"
              >
                <i className="fas fa-shopping-bag"></i>
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Cart Header - reduced padding on mobile */}
            <div className="bg-gradient-to-r from-gray-50 to-orange-50 px-3 sm:px-4 md:px-8 py-3 sm:py-4 md:py-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
                  <i className="fas fa-shopping-cart text-orange-500"></i>
                  Shopping Cart
                </h2>
                <span className="text-xs sm:text-sm text-gray-600 font-medium">
                  {cartItemsCount} {cartItemsCount === 1 ? 'item' : 'items'}
                </span>
              </div>
            </div>

            {/* Cart Items - reduced padding on mobile */}
            <div className="p-3 sm:p-4 md:p-6 lg:p-8">
              {/* Reduced spacing on mobile: space-y-3 instead of space-y-4 */}
              <div className="space-y-3 sm:space-y-4 md:space-y-6 mb-4 sm:mb-6 md:mb-8">
                {lists.cart.map((item) => (
                  <div
                    key={item.product_id || item.id}
                    className="group relative bg-gradient-to-br from-white to-gray-50 p-3 sm:p-4 md:p-6 border-2 border-gray-200 rounded-xl sm:rounded-2xl hover:border-orange-300 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 md:gap-6">
                      {/* Product Image - smaller on mobile */}
                      <div className="relative flex-shrink-0">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
                          <img
                            src={item.product_images?.[0]?.url || "https://placehold.co/120x120/e2e8f0/94a3b8?text=Product"}
                            alt={item.name || "Product"}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/120x120/e2e8f0/94a3b8?text=Error"; }}
                          />
                        </div>
                        <div className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                          {item.quantity}
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 text-center sm:text-left min-w-0">
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base md:text-lg mb-1 md:mb-2 line-clamp-2">
                          {item.name || "Product Name"}
                        </h3>
                        <div className="flex items-center justify-center sm:justify-start gap-1.5 md:gap-2 mb-2 md:mb-3">
                          <span className="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                            {formatCurrency(item.price)}
                          </span>
                          <span className="text-xs sm:text-sm text-gray-500 font-medium">per item</span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 md:gap-2 bg-orange-50 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full">
                          <span className="text-xs sm:text-sm text-gray-600 font-medium">Subtotal:</span>
                          <span className="text-sm sm:text-base font-bold text-orange-600">
                            {formatCurrency((item.price || 0) * (item.quantity || 0))}
                          </span>
                        </div>
                      </div>

                      {/* Quantity Controls & Remove */}
                      <div className="flex sm:flex-col items-center gap-2 sm:gap-3 md:gap-4">
                        {/* Quantity Controls - smaller on mobile */}
                        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 bg-white border-2 border-gray-200 rounded-xl px-1.5 py-1.5 sm:px-2 sm:py-2 shadow-md">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={!item.id}
                            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 rounded-lg hover:from-orange-500 hover:to-red-500 hover:text-white transition-all font-bold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-lg"
                            aria-label={`Decrease quantity of ${item.name || 'product'}`}
                          >
                            <i className="fas fa-minus text-xs sm:text-sm"></i>
                          </button>
                          <span className="w-8 sm:w-10 md:w-12 text-center font-black text-base sm:text-lg md:text-xl text-gray-800">
                            {item.quantity || 0}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            disabled={!item.id}
                            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 rounded-lg hover:from-orange-500 hover:to-red-500 hover:text-white transition-all font-bold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-lg"
                            aria-label={`Increase quantity of ${item.name || 'product'}`}
                          >
                            <i className="fas fa-plus text-xs sm:text-sm"></i>
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          disabled={!item.id}
                          className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-xl flex items-center justify-center"
                          aria-label={`Remove ${item.name || 'product'} from cart`}
                        >
                          <i className="fas fa-trash text-sm sm:text-base md:text-lg"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary - reduced padding on mobile */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-8 border-2 border-orange-200">
                <div className="space-y-2 sm:space-y-3 md:space-y-4 mb-4 sm:mb-6">
                  <div className="flex justify-between items-center text-sm sm:text-base">
                    <span className="text-gray-600 font-medium">Subtotal ({cartItemsCount} items)</span>
                    <span className="font-bold text-gray-800 text-sm sm:text-base md:text-lg">{formatCurrency(totalCartAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm sm:text-base">
                    <span className="text-gray-600 font-medium flex items-center gap-2">
                      <i className="fas fa-truck text-green-500"></i>
                      Shipping
                    </span>
                    <span className="font-bold text-green-600">FREE</span>
                  </div>
                  <div className="border-t-2 border-orange-300 pt-3 md:pt-4 mt-3 md:mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-base sm:text-lg md:text-xl font-bold text-gray-900">Total Amount</span>
                      <span className="text-xl sm:text-2xl md:text-4xl font-black bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                        {formatCurrency(totalCartAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/consumer/checkout')}
                  className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base md:text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 md:gap-3"
                  disabled={totalCartAmount <= 0}
                >
                  <i className="fas fa-lock"></i>
                  Proceed to Secure Checkout
                  <i className="fas fa-arrow-right"></i>
                </button>

                {/* Trust Badges - smaller on mobile */}
                <div className="mt-4 sm:mt-6 flex items-center justify-center gap-3 sm:gap-4 md:gap-6 text-gray-600">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <i className="fas fa-shield-alt text-green-500 text-sm sm:text-base"></i>
                    <span className="text-xs sm:text-sm font-medium">Secure</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <i className="fas fa-undo text-blue-500 text-sm sm:text-base"></i>
                    <span className="text-xs sm:text-sm font-medium">Easy Returns</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <i className="fas fa-headset text-orange-500 text-sm sm:text-base"></i>
                    <span className="text-xs sm:text-sm font-medium">24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

      {/* Wishlist View */}
      {listView === "wishlist" &&
        (!lists?.wishlist || lists.wishlist.length === 0 ? (
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 md:p-12 border border-gray-100">
            <div className="text-center py-6 sm:py-8 md:py-12">
              <div className="relative inline-block mb-4 md:mb-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-br from-pink-100 to-red-100 rounded-full flex items-center justify-center mx-auto">
                  <i className="fas fa-heart text-4xl sm:text-5xl md:text-6xl text-pink-400"></i>
                </div>
                <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <i className="fas fa-plus text-white text-base sm:text-lg"></i>
                </div>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-3">Your Wishlist is Empty</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6 md:mb-8 max-w-md mx-auto">
                Save your favorite items here for later
              </p>
              <button
                onClick={() => navigate('/map')}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-red-500 text-white px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 text-sm sm:text-base"
              >
                <i className="fas fa-heart"></i>
                Explore Products
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Wishlist Header - reduced padding on mobile */}
            <div className="bg-gradient-to-r from-gray-50 to-pink-50 px-3 sm:px-4 md:px-8 py-3 sm:py-4 md:py-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
                  <i className="fas fa-heart text-pink-500"></i>
                  My Wishlist
                </h2>
                <span className="text-xs sm:text-sm text-gray-600 font-medium">
                  {wishlistItemsCount} {wishlistItemsCount === 1 ? 'item' : 'items'}
                </span>
              </div>
            </div>

            {/* Wishlist Items - reduced padding on mobile */}
            <div className="p-3 sm:p-4 md:p-6 lg:p-8">
              {/* Reduced gap on mobile: gap-3 instead of gap-4 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                {lists.wishlist.map((item) => (
                  <div
                    key={item.product_id || item.id}
                    className="group relative bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 hover:border-pink-300 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex gap-3 md:gap-4">
                      {/* Product Image - smaller on mobile */}
                      <div className="relative flex-shrink-0">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-lg">
                          <img
                            src={item.product_images?.[0]?.url || "https://placehold.co/120x120/e2e8f0/94a3b8?text=Product"}
                            alt={item.name || "Product"}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/120x120/e2e8f0/94a3b8?text=Error"; }}
                          />
                        </div>
                        <div className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-pink-500 text-white rounded-full flex items-center justify-center shadow-lg">
                          <i className="fas fa-heart text-xs"></i>
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm sm:text-base md:text-lg mb-1 md:mb-2 line-clamp-2">
                            {item.name || "Product Name"}
                          </h3>
                          <div className="text-lg sm:text-xl md:text-2xl font-black bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-2 sm:mb-3 md:mb-4">
                            {formatCurrency(item.price)}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-auto">
                          <button
                            onClick={() => moveToCart(item)}
                            disabled={!item.id}
                            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-1.5 sm:gap-2"
                          >
                            <i className="fas fa-shopping-cart"></i>
                            Add to Cart
                          </button>
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            disabled={!item.id}
                            className="px-2.5 sm:px-3 md:px-4 bg-red-50 text-red-500 rounded-lg sm:rounded-xl hover:bg-red-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-xl"
                            aria-label={`Remove ${item.name || 'product'} from wishlist`}
                          >
                            <i className="fas fa-trash text-sm sm:text-base"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default CustomerLists;