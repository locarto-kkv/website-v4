// src/pages/CustomerDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/DashboardNavbar";
import { ConsumerOrderService } from "../../services/consumer/consumerOrderService";
import { DateTimeDisplay } from "../../lib/utils";
import { ConsumerListService } from "../../services/consumer/consumerListService";

const CustomerDashboard = () => {
  const [cartItems, setCartItems] = useState([]);
  const [prices, setPrices] = useState({
    subtotal: 0,
    shipping: 5.99,
    tax: 0,
    total: 0,
  });
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("UNITED STATES");
  const [wishlistItems, setWishlistItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("overview"); // Add tabs for navigation

  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    title: "",
    content: "",
  });

  const { getOrders } = ConsumerOrderService;
  const { getList, updateList, removeFromList } = ConsumerListService;
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);


  // Check for URL parameter to auto-select cart tab
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('tab') === 'cart') {
      setActiveTab("cart");
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      const orderRes = await getOrders();
      const listRes = await getList();
      console.log(orderRes);

      setOrders(orderRes);
      listRes.wishlist && setWishlistItems(listRes.wishlist);
      if (listRes.cart) {
        setCartItems(listRes.cart);
        updatePrices(listRes.cart);
      }
    }

    fetchData();
  }, []);

  const updateQuantity = async (item, change) => {
    const newQty = Math.max(1, item.quantity + change);
    const res = await updateList("cart", newQty, item.id);
    setCartItems(res.cart);
    updatePrices(res.cart);
  };

  const updatePrices = (items) => {
    console.log("Update Prices: ", items);

    const subtotal = items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
    const shipping = 5.99;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    setPrices({ subtotal, shipping, tax, total });
  };

  const removeFromCart = async (id) => {
    await removeFromList("cart", id);
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    updatePrices(updatedCart);
  };

  const removeFromWishlist = async (id) => {
    await removeFromList("wishlist", id);
    setWishlistItems(wishlistItems.filter((item) => item.id !== id));
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    alert("Review submitted successfully!");
    setReviewForm({ rating: 0, title: "", content: "" });
  };

  const handleZipChange = (e) => {
    setZipCode(e.target.value);
  };

  // Handle "Shop Now" button click - navigate to landing page
  const handleShopNow = () => {
    navigate("/landing");
  };

  // Render different sections based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "cart":
        return renderCartSection();
      case "wishlist":
        return renderWishlistSection();
      case "orders":
        return renderOrdersSection();
      case "reviews":
        return renderReviewsSection();
      default:
        return renderOverviewSection();
    }
  };

  const renderCartSection = () => (
    <div className="flex-1 p-6">
      {/* Left Column: Cart Items */}
      <div className="lg:col-span-2">
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <i className="fas fa-shopping-cart text-6xl text-gray-300 mb-4"></i>
            <h2 className="text-xl font-semibold text-gray-700">Your cart is empty</h2>
            <p className="text-gray-500 mt-2">Add some products to get started!</p>
            <button
              onClick={handleShopNow}
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 px-6 rounded-lg"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {cartItems.map((item) => (
              <div key={item.id} className="border-b p-4 flex items-start">
                <img
                  src={item.image || "https://via.placeholder.com/100"}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md mr-4"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-blue-700">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    {item.sku && `SKU: ${item.sku}`}
                  </p>
                  <p className="text-sm text-gray-600">₹{item.price.toFixed(2)}</p>
                  <div className="mt-2 flex items-center space-x-2">
                    <button
                      className="w-8 h-8 border border-gray-300 flex items-center justify-center rounded hover:bg-gray-100"
                      onClick={() => updateQuantity(item, -1)}
                    >
                      -
                    </button>
                    <span className="w-12 text-center">{item.quantity}</span>
                    <button
                      className="w-8 h-8 border border-gray-300 flex items-center justify-center rounded hover:bg-gray-100"
                      onClick={() => updateQuantity(item, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                  <button
                    className="text-red-500 hover:text-red-700 text-sm mt-1"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {/* Item Total */}
            <div className="bg-gray-50 p-4 flex justify-between font-bold text-lg">
              <span>Item Total:</span>
              <span>₹{prices.subtotal.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Saved for Later Section */}
        <div className="mt-8 bg-gray-100 p-6 rounded-lg">
          <h2 className="flex items-center text-xl font-semibold mb-2">
            <i className="fas fa-clock mr-2"></i>
            Saved for Later
          </h2>
          <p className="text-gray-600">Stash ideas here, commitment-free!</p>
        </div>
      </div>

      {/* Right Column: Shipping & Checkout */}
      <div className="space-y-6">
        {/* Estimate Shipping & Tax */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold mb-4">ESTIMATE SHIPPING & TAX</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="pickup"
                className="mr-2"
              />
              <label htmlFor="pickup" className="text-sm">NYC SuperStore Pickup</label>
              <a href="#" className="ml-2 text-blue-600 text-sm">See Details</a>
            </div>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option>UNITED STATES</option>
              <option>CANADA</option>
              <option>UK</option>
            </select>
            <div className="flex items-center">
              <label className="text-sm mr-2">Zip Code</label>
              <input
                type="text"
                value={zipCode}
                onChange={handleZipChange}
                placeholder="Enter Zip Code"
                className="flex-1 p-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{prices.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>₹{prices.shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Sales Tax:</span>
              <span>₹{prices.tax.toFixed(2)}</span>
            </div>
            <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>₹{prices.total.toFixed(2)}</span>
            </div>
          </div>

          <button
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold flex items-center justify-center"
          >
            <i className="fas fa-lock mr-2"></i>
            Begin Checkout
          </button>
        </div>

        {/* Move All / Remove All Buttons */}
        <div className="flex space-x-4">
          <button className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-lg text-sm">
            Move All to Wish List
          </button>
          <button className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-lg text-sm">
            Remove All
          </button>
        </div>
      </div>
    </div>
  );

  const renderWishlistSection = () => (
    <div className="flex-1 p-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-secondary mb-6">
          Wishlist
        </h2>
        {wishlistItems.length === 0 ? (
          <p className="text-gray-500">Your wishlist is empty.</p>
        ) : (
          <div className="space-y-4">
            {wishlistItems.map((item) => (
              <div key={item.id} className="flex items-center">
                <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4"></div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-gray-600 text-sm">₹{item.price}</p>
                </div>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => removeFromWishlist(item.id)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderOrdersSection = () => (
    <div className="flex-1 p-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-secondary">
            Recent Orders
          </h2>
          <a href="#" className="text-primary hover:text-secondary">
            View All
          </a>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center border-b pb-4 last:border-b-0"
            >
              <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4">
                <img src="https://media.wired.com/photos/65b0438c22aa647640de5c75/master/pass/Mechanical-Keyboard-Guide-Gear-GettyImages-1313504623.jpg" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{order.product.name}</h3>
                <p className="text-gray-600 text-sm">
                  <DateTimeDisplay dateString={order.created_at} />
                </p>
                <p className="text-gray-600 text-sm">
                  {order.order_status === "delivered"
                    ? `Delivered on ${order.delivery_date}`
                    : order.order_status === "shipped"
                    ? `Shipped on ${order.delivery_date}`
                    : order.order_status}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">₹{order.product.price}</p>
                <span
                  className={`${
                    order.order_status === "delivered"
                      ? "bg-green-100 text-green-800"
                      : order.order_status === "shipped"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  } text-xs font-medium px-2.5 py-0.5 rounded-full`}
                >
                  {order.order_status.charAt(0).toUpperCase() +
                    order.order_status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReviewsSection = () => (
    <div className="flex-1 p-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-secondary mb-6">
          Leave a Review
        </h2>
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4"></div>
          <div>
            <h3 className="font-medium">Wireless Headphones</h3>
            <p className="text-gray-600 text-sm">
              Order #ORD-7841 • Delivered
            </p>
          </div>
        </div>

        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Rating</label>
            <div className="flex text-2xl text-yellow-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={`fas fa-star cursor-pointer hover:text-yellow-500 ${
                    star <= reviewForm.rating
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  onClick={() =>
                    setReviewForm({ ...reviewForm, rating: star })
                  }
                ></i>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">
              Review Title
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Great product!"
              value={reviewForm.title}
              onChange={(e) =>
                setReviewForm({ ...reviewForm, title: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Review</label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              rows="4"
              placeholder="Share your experience with this product..."
              value={reviewForm.content}
              onChange={(e) =>
                setReviewForm({ ...reviewForm, content: e.target.value })
              }
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-primary text-white py-3 px-6 rounded-lg font-bold hover:bg-orange-600 transition"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );

  const renderOverviewSection = () => (
    <div className="flex-1 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-secondary">
              Recent Orders
            </h2>
            <button 
              onClick={() => setActiveTab("orders")}
              className="text-primary hover:text-secondary"
            >
              View All
            </button>
          </div>

          <div className="space-y-4">
            {orders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="flex items-center border-b pb-4 last:border-b-0"
              >
                <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4">
                  <img src="https://media.wired.com/photos/65b0438c22aa647640de5c75/master/pass/Mechanical-Keyboard-Guide-Gear-GettyImages-1313504623.jpg" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{order.product.name}</h3>
                  <p className="text-gray-600 text-sm">
                    <DateTimeDisplay dateString={order.created_at} />
                  </p>
                  <p className="text-gray-600 text-sm">
                    {order.order_status === "delivered"
                      ? `Delivered on ${order.delivery_date}`
                      : order.order_status === "shipped"
                      ? `Shipped on ${order.delivery_date}`
                      : order.order_status}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{order.product.price}</p>
                  <span
                    className={`${
                      order.order_status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : order.order_status === "shipped"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    } text-xs font-medium px-2.5 py-0.5 rounded-full`}
                  >
                    {order.order_status.charAt(0).toUpperCase() +
                      order.order_status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-secondary mb-6">
            Leave a Review
          </h2>
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4"></div>
            <div>
              <h3 className="font-medium">Wireless Headphones</h3>
              <p className="text-gray-600 text-sm">
                Order #ORD-7841 • Delivered
              </p>
            </div>
          </div>

          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Rating</label>
              <div className="flex text-2xl text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i
                    key={star}
                    className={`fas fa-star cursor-pointer hover:text-yellow-500 ${
                      star <= reviewForm.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    onClick={() =>
                      setReviewForm({ ...reviewForm, rating: star })
                    }
                  ></i>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">
                Review Title
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Great product!"
                value={reviewForm.title}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, title: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Review</label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                rows="4"
                placeholder="Share your experience with this product..."
                value={reviewForm.content}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, content: e.target.value })
                }
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-primary text-white py-3 px-6 rounded-lg font-bold hover:bg-orange-600 transition"
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation - Pass setActiveTab function to handle cart icon click */}
      <Navbar
        cartItems={cartItems}
        onCartIconClick={() => setActiveTab("cart")}
      />

      <div className="mx-auto flex pt-[70px]">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md p-4 h-screen sticky top-0">
          <ul className="space-y-3 pt-4">
            <li>
              <button
                onClick={() => setActiveTab("overview")}
                className={`w-full text-left py-3 px-4 rounded-lg transition font-medium ${
                  activeTab === "overview"
                    ? "bg-primary text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
              >
                Overview
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("cart")}
                className={`w-full text-left py-3 px-4 rounded-lg transition font-medium ${
                  activeTab === "cart"
                    ? "bg-primary text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
              >
                Cart
                {cartItems.length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("wishlist")}
                className={`w-full text-left py-3 px-4 rounded-lg transition font-medium ${
                  activeTab === "wishlist"
                    ? "bg-primary text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
              >
                Wishlist
                {wishlistItems.length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full text-left py-3 px-4 rounded-lg transition font-medium ${
                  activeTab === "orders"
                    ? "bg-primary text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
              >
                Orders
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`w-full text-left py-3 px-4 rounded-lg transition font-medium ${
                  activeTab === "reviews"
                    ? "bg-primary text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
              >
                Reviews
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Dashboard Header */}
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Customer Dashboard</h1>
            
            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-md dashboard-card border-l-4 border-background">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600">Total Orders</p>
                    <h3 className="text-3xl font-bold mt-2">{orders.length}</h3>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-shopping-bag text-black text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md dashboard-card border-l-4 border-background">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600">Wishlist</p>
                    <h3 className="text-3xl font-bold mt-2">
                      {wishlistItems.length}
                    </h3>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-heart text-black text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md dashboard-card border-l-4 border-background">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600">Reviews</p>
                    <h3 className="text-3xl font-bold mt-2">{reviews.length}</h3>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-star text-black text-xl"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;