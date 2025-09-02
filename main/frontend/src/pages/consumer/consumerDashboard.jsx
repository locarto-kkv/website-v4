import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import ProductCard from "../../components/ProductCard";
import Navbar from "../../components/DashboardNavbar";
import { ConsumerOrderService } from "../../services/consumer/consumerOrderService";
import { useEffect } from "react";
import { DateTimeDisplay } from "../../lib/utils";
import { ConsumerListService } from "../../services/consumer/consumerListService";

const CustomerDashboard = () => {
  const [cartItems, setCartItems] = useState([]);
  const [prices, setPrices] = useState({
    subtotal: null,
    shipping: null,
    total: null,
  });
  const [wishlistItems, setWishlistItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    title: "",
    content: "",
  });

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const { getOrders } = ConsumerOrderService;
  const { getList, updateList, removeFromList } = ConsumerListService;

  useEffect(() => {
    async function fetchData() {
      const orderRes = await getOrders();
      const listRes = await getList();

      setOrders(orderRes);
      listRes.wishlist && setWishlistItems(listRes.wishlist);
      listRes.cart && setCartItems(listRes.cart);
      updatePrices(listRes.cart);
    }

    fetchData();
  }, []);

  const updateQuantity = async (item, change) => {
    const res = await updateList("cart", item.quantity + change, item.id);
    setCartItems(res.cart);
    updatePrices(res.cart);
  };

  const updatePrices = (items) => {
    console.log("Update Prices: ", items);

    const subtotal = items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
    const shipping = 5.99;
    const total = subtotal + shipping;

    setPrices({ subtotal, shipping, total });
  };

  const removeFromCart = async (id) => {
    await removeFromList("cart", id);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navbar
        cartItems={cartItems} // pass array of cart items
      />

      <div className="max-w-6xl mx-auto py-8 px-6">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
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
                      {/* <img src={order.product.product_images[0]} /> */}
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
                      <p className="font-medium">Rs.{order.product.price}</p>
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

          <div>
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              {cartItems.length > 0 ? (
                <>
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
                            onClick={() => updateQuantity(item, -1)}
                          >
                            -
                          </button>
                          <span className="w-10 h-8 flex items-center justify-center border-y">
                            {item.quantity}
                          </span>
                          <button
                            className="w-8 h-8 bg-gray-100 rounded-r flex items-center justify-center"
                            onClick={() => updateQuantity(item, 1)}
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
                </>
              ) : (
                <div className="flex justify-center">
                  <h2 className="text-xl font-bold text-secondary mb-6">
                    Add Items to your Cart
                  </h2>
                </div>
              )}

              {prices.subtotal ? (
                <div className="mt-6 pt-4 border-t">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal</span>
                    <span>${prices.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Shipping</span>
                    <span>${prices.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg mt-4 pt-2 border-t">
                    <span>Total</span>
                    <span>${prices.total.toFixed(2)}</span>
                  </div>
                  <button className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition mt-6">
                    Proceed to Checkout
                  </button>
                </div>
              ) : null}
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
