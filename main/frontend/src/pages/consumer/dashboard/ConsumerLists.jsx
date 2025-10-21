// src/pages/consumer/dashboard/CustomerLists.jsx
import React, { useState } from "react";
import { formatCurrency } from "../../../lib/utils";
import { useConsumerData } from "../../../context/consumer/consumerDataContext"; // Adjust path if needed
import { ConsumerListService } from "../../../services/consumer/consumerListService"; // Adjust path if needed

const CustomerLists = () => {
  const [listView, setListView] = useState("cart");
  const { lists, fetchLists } = useConsumerData();
  const { updateList, removeFromList } = ConsumerListService;

  const updateQuantity = async (productId, delta) => {
    const currentItem = lists.cart.find((item) => item.id === productId);
    console.log(currentItem);

    if (!currentItem) return;

    const newQty = Math.max(0, currentItem.quantity + delta);

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
      await fetchLists(); // Refetch lists data
    } catch (err) {
      console.error("Error removing from cart:", err);
      // Add user feedback
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await removeFromList("wishlist", productId);
      await fetchLists(); // Refetch lists data
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      // Add user feedback
    }
  };

  const moveToCart = async (item) => {
    try {
      await updateList("cart", 1, item.id);
      await removeFromList("wishlist", item.id);
      await fetchLists();
    } catch (err) {
      console.error("Error moving item to cart:", err);
    }
  };

  const totalCartAmount = lists.cart
    ? lists.cart.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
        0
      )
    : 0;

  return (
    <div className="space-y-6">
      {/* Toggle Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => setListView("cart")}
          className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all ${
            listView === "cart"
              ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          <i className="fas fa-shopping-cart mr-2"></i>
          Cart ({lists.cart?.length || 0})
        </button>
        <button
          onClick={() => setListView("wishlist")}
          className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all ${
            listView === "wishlist"
              ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          <i className="fas fa-heart mr-2"></i>
          Wishlist ({lists.wishlist?.length || 0})
        </button>
      </div>

      {/* Cart View */}
      {listView === "cart" &&
        (!lists.cart ? (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-shopping-cart text-4xl text-gray-400"></i>
              </div>
              <p className="text-gray-500 text-lg">
                Your Cart is empty — add items to view them here
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="space-y-4 mb-6">
              {lists.cart.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-orange-300 transition-colors"
                >
                  <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image || "N/A"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-bold text-gray-900">
                      {item.name || "Product Name"}
                    </h3>
                    <p className="text-orange-500 font-bold">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* Reduced gap */}
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 border-2 border-gray-300 rounded-lg hover:border-orange-500 transition-all font-bold flex items-center justify-center" // Centered content
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 border-2 border-gray-300 rounded-lg hover:border-orange-500 transition-all font-bold flex items-center justify-center" // Centered content
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 p-2"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>
            <div className="border-t pt-6">
              <div className="flex justify-between text-xl font-bold mb-4">
                <span>Total:</span>
                <span className="text-orange-500">
                  {formatCurrency(totalCartAmount)}
                </span>
              </div>
              <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold hover:shadow-xl transition-all">
                Proceed to Checkout
              </button>
            </div>
          </div>
        ))}

      {/* Wishlist View */}
      {listView === "wishlist" &&
        (!lists.wishlist ? (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-heart text-4xl text-gray-400"></i>
              </div>
              <p className="text-gray-500 text-lg">
                Your wishlist is empty — add items to view them here
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lists.wishlist.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-xl p-4 hover:border-orange-300 transition-colors"
                >
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image || "N/A"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">
                        {item.name || "Product Name"}
                      </h3>
                      <p className="text-orange-500 font-bold mb-3">
                        {formatCurrency(item.price)}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => moveToCart(item)}
                          className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="px-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label={`Remove ${item.name} from wishlist`}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default CustomerLists;
