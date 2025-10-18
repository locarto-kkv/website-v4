// src/pages/consumer/dashboard/CustomerLists.jsx
import React, { useState } from 'react';
import { useConsumerData } from "../../../context/consumer/consumerDataContext"; // Adjust path if needed
import { ConsumerListService } from "../../../services/consumer/consumerListService"; // Adjust path if needed

// Helper to format currency (or import from utils)
const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '₹ N/A';
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0, // Adjust as needed
        maximumFractionDigits: 0, // Adjust as needed
    }).format(amount);
};

const CustomerLists = () => {
    const [listView, setListView] = useState("cart"); // 'cart' or 'wishlist'
    const { lists, fetchLists } = useConsumerData(); // Get lists data and refetch function
    const { updateList, removeFromList } = ConsumerListService;

    // --- Handle potential undefined lists ---
    // Process cart items from the context's list object
    const cartItems = lists?.cart ? Object.entries(lists.cart).map(([productId, quantity]) => {
        // Find the product details (you might need to fetch product details separately
        // or have them available in another context/state if not embedded in 'lists')
        // For now, using placeholder data based on the original mock data structure
        const mockProductDetails = {
            id: parseInt(productId), // Assuming product ID is a number
            name: `Product ${productId}`,
            price: 299 * parseInt(productId), // Example price logic
            image: `https://via.placeholder.com/100?text=Product+${productId}`
        };
        return {
            ...mockProductDetails,
            quantity: quantity,
        };
    }) : [];

    // Process wishlist items from the context's list object
    const wishlistItems = lists?.wishlist ? [...lists.wishlist].map(productId => {
        // Similar to cart, fetch or retrieve product details
        // Using placeholder data
        const mockProductDetails = {
            id: productId, // Assuming product ID is already in the correct format
            name: `Product ${productId}`,
            price: 199 * productId, // Example price logic
            image: `https://via.placeholder.com/100?text=Product+${productId}`
        };
        return mockProductDetails;
    }) : [];
     // --- End handling potential undefined lists ---


    // --- Action Handlers ---
    const updateQuantity = async (productId, delta) => {
        const currentItem = cartItems.find(item => item.id === productId);
        if (!currentItem) return;

        const newQty = Math.max(0, currentItem.quantity + delta); // Allow quantity to become 0

        try {
            if (newQty <= 0) {
                await removeFromList("cart", productId);
            } else {
                await updateList("cart", newQty, productId);
            }
            await fetchLists(); // Refetch lists data to update UI
        } catch (err) {
            console.error("Error updating cart quantity:", err);
            // Add user feedback (e.g., toast notification)
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
            // Add to cart (assume quantity 1 initially)
            await updateList("cart", 1, item.id);
            // Remove from wishlist
            await removeFromList("wishlist", item.id);
            await fetchLists(); // Refetch lists data
        } catch (err) {
            console.error("Error moving item to cart:", err);
            // Add user feedback
        }
    };
    // --- End Action Handlers ---


    const totalCartAmount = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);

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
                    Cart ({cartItems.length})
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
                    Wishlist ({wishlistItems.length})
                </button>
            </div>

            {/* Cart View */}
            {listView === "cart" && (
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    {/* <h2 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h2> */}
                    {cartItems.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="fas fa-shopping-cart text-4xl text-gray-400"></i>
                            </div>
                            <p className="text-gray-500 text-lg">Your cart is empty</p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4 mb-6">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-orange-300 transition-colors">
                                        <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                            <img src={item.image || 'https://via.placeholder.com/100'} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 text-center sm:text-left">
                                            <h3 className="font-bold text-gray-900">{item.name || 'Product Name'}</h3>
                                            <p className="text-orange-500 font-bold">{formatCurrency(item.price)}</p>
                                        </div>
                                        <div className="flex items-center gap-2 sm:gap-3"> {/* Reduced gap */}
                                            <button
                                                onClick={() => updateQuantity(item.id, -1)}
                                                className="w-8 h-8 border-2 border-gray-300 rounded-lg hover:border-orange-500 transition-all font-bold flex items-center justify-center" // Centered content
                                                aria-label={`Decrease quantity of ${item.name}`}
                                             >
                                                -
                                            </button>
                                            <span className="w-8 text-center font-bold">{item.quantity}</span>
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
                                    <span className="text-orange-500">{formatCurrency(totalCartAmount)}</span>
                                </div>
                                <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold hover:shadow-xl transition-all">
                                    Proceed to Checkout
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Wishlist View */}
            {listView === "wishlist" && (
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    {/* <h2 className="text-2xl font-bold text-gray-900 mb-6">Wishlist</h2> */}
                    {wishlistItems.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="fas fa-heart text-4xl text-gray-400"></i>
                            </div>
                            <p className="text-gray-500 text-lg">Your wishlist is empty</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {wishlistItems.map((item) => (
                                <div key={item.id} className="border border-gray-200 rounded-xl p-4 hover:border-orange-300 transition-colors">
                                    <div className="flex gap-4">
                                        <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                            <img src={item.image || 'https://via.placeholder.com/100'} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900">{item.name || 'Product Name'}</h3>
                                            <p className="text-orange-500 font-bold mb-3">{formatCurrency(item.price)}</p>
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
                    )}
                </div>
            )}
        </div>
    );
};

export default CustomerLists;