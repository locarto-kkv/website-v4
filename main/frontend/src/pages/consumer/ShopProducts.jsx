// src/pages/consumer/ShopProducts.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useData } from "../../context/dataContext";
import { useConsumerData } from "../../context/consumer/consumerDataContext";
import { ConsumerListService } from "../../services/consumer/consumerListService";

const ShopProducts = () => {
  const { vendorId, category } = useParams(); // vendor.id from URL

  const { blogs, fetchProductsInBatch } = useData();
  const { updateList, removeFromList } = ConsumerListService;
  const { lists, fetchLists } = useConsumerData();

  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Find vendor by ID from blogs
  useEffect(() => {
    const foundVendor = blogs?.find((v) => String(v.id) === String(vendorId));
    setVendor(foundVendor || null);
  }, [blogs, vendorId]);

  // Fetch vendor products
  useEffect(() => {
    const fetchProducts = async () => {
      if (!vendorId) return;
      setLoading(true);
      try {
        await fetchProductsInBatch({ vendor_id: vendorId, category });
        console.log(category);

        console.log(blogs);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [vendorId]);

  if (!vendor)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        <h2 className="text-4xl font-bold mb-4">Vendor Not Found</h2>
        <Link
          to="/map"
          className="text-blue-400 hover:underline flex items-center gap-2"
        >
          <i className="fas fa-arrow-left"></i> Back to Map
        </Link>
      </div>
    );

  const products = vendor.products || [];

  const cart = lists?.cart || {};
  const wishlist = lists?.wishlist || new Set();

  // Handle wishlist toggle
  const toggleWishlist = async (productId) => {
    const isInWishlist = wishlist.has?.(productId);
    try {
      if (isInWishlist) {
        await removeFromList("wishlist", productId);
      } else {
        await updateList("wishlist", 1, productId);
      }
      await fetchLists();
    } catch (err) {
      console.error("Error updating wishlist:", err);
    }
  };

  // Handle add/remove cart quantity
  const handleCartChange = async (productId, delta) => {
    const currentQty = cart[productId] || 0;
    const newQty = currentQty + delta;

    try {
      if (newQty <= 0) {
        await removeFromList("cart", productId);
      } else {
        await updateList("cart", newQty, productId);
      }
      await fetchLists();
    } catch (err) {
      console.error("Error updating cart:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 font-sans">
      {/* Background Effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br opacity-10 rounded-full blur-3xl animate-pulse"
          style={{
            background: `radial-gradient(circle, #3b82f6, transparent)`,
          }}
        ></div>
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br opacity-10 rounded-full blur-3xl animate-pulse animation-delay-2000"
          style={{
            background: `radial-gradient(circle, #3b82f6, transparent)`,
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-7xl relative z-10">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/map"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-all duration-300 p-3 hover:bg-white/10 rounded-xl group bg-white/5 backdrop-blur-xl border border-white/10"
          >
            <i className="fas fa-arrow-left text-lg group-hover:-translate-x-1 transition-transform duration-300"></i>
            <span className="font-medium">Back to Map</span>
          </Link>
        </div>

        {/* Vendor Header */}
        <div
          className="mb-8 rounded-3xl shadow-2xl p-8 text-white backdrop-blur-xl border border-white/10 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, #3b82f6dd, #3b82f699)`,
          }}
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-3 shadow-2xl border border-white/30">
              <div className="w-20 h-20 bg-white/30 rounded-xl flex items-center justify-center overflow-hidden">
                {vendor.brand_logo_1 ? (
                  <img
                    src={vendor.brand_logo_1}
                    alt={vendor.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <i className="fas fa-store text-3xl text-white drop-shadow-lg"></i>
                )}
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold mb-2 drop-shadow-lg">
                {vendor.name}
              </h2>
              <p className="text-white/90 mb-3 drop-shadow">
                Premium quality products curated just for you
              </p>
              <div className="flex items-center justify-center md:justify-start gap-6 text-sm flex-wrap">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <i className="fas fa-box text-white/90"></i>
                  <span className="font-semibold">
                    {products.length} Products
                  </span>
                </div>
                {vendor.email && (
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <i className="fas fa-envelope text-white/90"></i>
                    <span className="font-semibold">{vendor.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="text-center text-white/80 py-20">
            Loading products...
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {products.map((product) => {
              const quantity = cart[product.id] || 0;
              const isInWishlist = wishlist.has?.(product.id);

              return (
                <div
                  key={product.id}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-6 flex flex-col group hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 hover:-translate-y-2 hover:shadow-3xl"
                >
                  {/* Product Image */}
                  <div className="relative mb-4">
                    <div className="overflow-hidden rounded-xl bg-white/5">
                      <img
                        src={product.product_images[0]}
                        alt={product.name}
                        className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-3 right-3 bg-black/50 backdrop-blur-md rounded-full p-2.5 shadow-lg hover:scale-110 transition-all duration-200 border border-white/20"
                    >
                      <i
                        className={`fas fa-heart text-lg transition-colors ${
                          isInWishlist
                            ? "text-red-500"
                            : "text-white/70 hover:text-red-400"
                        }`}
                      ></i>
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 mb-4">
                    <h3 className="font-bold text-white mb-1 text-lg">
                      {product.name}
                    </h3>
                    <p className="text-sm text-white/60 mb-3">
                      {product.type || "Product"}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white/80">
                        ⭐ {product.avg_review || 0} ({product.count_reviews})
                      </span>
                    </div>
                  </div>

                  {/* Cart Controls */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <span className="text-2xl font-bold text-white drop-shadow-lg">
                        {product.price}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCartChange(product.id, -1)}
                          disabled={quantity <= 0}
                          className="rounded-full w-8 h-8 flex items-center justify-center bg-white/10 text-white hover:bg-white/20 transition-all duration-200 border border-white/20"
                        >
                          -
                        </button>
                        <span className="text-white font-semibold w-6 text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => handleCartChange(product.id, +1)}
                          className="rounded-full w-8 h-8 flex items-center justify-center bg-white/10 text-white hover:bg-white/20 transition-all duration-200 border border-white/20"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {quantity > 0 && (
                      <div
                        className="text-center text-sm font-semibold py-2 rounded-lg backdrop-blur-sm"
                        style={{
                          background: `#3b82f630`,
                          color: "#3b82f6",
                          border: `1px solid #3b82f650`,
                        }}
                      >
                        {quantity} in Cart
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10">
            <div className="text-7xl mb-4">🏪</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              No Products Available
            </h3>
            <p className="text-white/60">
              This vendor doesn’t have any products yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopProducts;
