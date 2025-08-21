import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import ProductCard from "../components/ProductCard";

const CustomerDashboard = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Smartphone Case", price: 19.99, quantity: 1 },
    { id: 2, name: "Wireless Charger", price: 24.99, quantity: 2 },
    { id: 3, name: "Phone Stand", price: 12.99, quantity: 1 },
  ]);

  const [wishlistItems, setWishlistItems] = useState([
    { id: 1, name: "Gaming Keyboard", price: 79.99 },
    { id: 2, name: "Noise Cancelling Headphones", price: 129.99 },
  ]);

  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    title: "",
    content: "",
  });

  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const updateQuantity = (id, change) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const removeFromWishlist = (id) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== id));
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    alert("Review submitted successfully!");
    setReviewForm({ rating: 0, title: "", content: "" });
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 5.99;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <div className="text-2xl font-bold text-primary">Locarto</div>
          <span className="ml-4 bg-orange-100 text-primary text-sm font-medium px-3 py-1 rounded-full">
            Customer Dashboard
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
              <i className="fas fa-shopping-cart mr-2"></i> Cart
            </button>
            <span className="notification-badge">{cartItems.length}</span>
          </div>
          <div className="relative">
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
              <i className="fas fa-bell mr-2"></i> Notifications
            </button>
            <span className="notification-badge">2</span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            <i className="fas fa-sign-out-alt mr-2"></i> Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto py-8 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md dashboard-card border-l-4 border-primary">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600">Total Orders</p>
                <h3 className="text-3xl font-bold mt-2">12</h3>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <i className="fas fa-shopping-bag text-primary text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md dashboard-card border-l-4 border-primary">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600">Wishlist</p>
                <h3 className="text-3xl font-bold mt-2">
                  {wishlistItems.length}
                </h3>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <i className="fas fa-heart text-primary text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md dashboard-card border-l-4 border-primary">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600">Reviews</p>
                <h3 className="text-3xl font-bold mt-2">5</h3>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <i className="fas fa-star text-primary text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-secondary">
                  Recent Orders
                </h2>
                <a href="#" className="text-primary hover:underline">
                  View All
                </a>
              </div>

              <div className="space-y-4">
                <div className="flex items-center border-b pb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4"></div>
                  <div className="flex-1">
                    <h3 className="font-medium">Wireless Headphones</h3>
                    <p className="text-gray-600 text-sm">Order #ORD-7841</p>
                    <p className="text-gray-600 text-sm">
                      Delivered on May 15, 2023
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$89.99</p>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Delivered
                    </span>
                  </div>
                </div>

                <div className="flex items-center border-b pb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4"></div>
                  <div className="flex-1">
                    <h3 className="font-medium">Smart Watch</h3>
                    <p className="text-gray-600 text-sm">Order #ORD-7839</p>
                    <p className="text-gray-600 text-sm">
                      Shipped on May 10, 2023
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$149.99</p>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Shipped
                    </span>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4"></div>
                  <div className="flex-1">
                    <h3 className="font-medium">Bluetooth Speaker</h3>
                    <p className="text-gray-600 text-sm">Order #ORD-7835</p>
                    <p className="text-gray-600 text-sm">Processing</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$59.99</p>
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Processing
                    </span>
                  </div>
                </div>
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

          <div>
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-secondary mb-6">
                Shopping Cart
              </h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center border-b pb-4"
                  >
                    <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4"></div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-gray-600 text-sm">${item.price}</p>
                    </div>
                    <div className="flex items-center">
                      <button
                        className="w-8 h-8 bg-gray-100 rounded-l flex items-center justify-center"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        -
                      </button>
                      <span className="w-10 h-8 flex items-center justify-center border-y">
                        {item.quantity}
                      </span>
                      <button
                        className="w-8 h-8 bg-gray-100 rounded-r flex items-center justify-center"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="ml-4 text-red-500 hover:text-red-700"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-4 pt-2 border-t">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <button className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition mt-6">
                  Proceed to Checkout
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-secondary mb-6">
                Wishlist
              </h2>
              <div className="space-y-4">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="flex items-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4"></div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-gray-600 text-sm">${item.price}</p>
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
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 mt-6">
              <h2 className="text-xl font-bold text-secondary mb-6">
                Recommended for You
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <ProductCard title="Smart Watch" price="149.99" />
                <ProductCard title="Bluetooth Speaker" price="59.99" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
