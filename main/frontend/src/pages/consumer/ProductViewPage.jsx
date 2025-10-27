// src/pages/consumer/ProductViewPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useData } from "../../context/dataContext";
import { ConsumerListService } from "../../services/consumer/consumerListService";
import { ConsumerProductService } from "../../services/consumer/consumerProductService";
import { useAuthStore } from "../../store/useAuthStore";
import { formatCurrency } from "../../lib/utils";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import toast from "react-hot-toast";

const SimilarProductCard = ({ product }) => (
  <Link
    to={`/product/${product.id}`}
    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2 border border-gray-100"
  >
    <div className="relative overflow-hidden aspect-square bg-gray-100">
      <img
        src={
          product.product_images?.[0]?.url ||
          "https://placehold.co/300x300/e2e8f0/e2e8f0?text=IMG"
        }
        alt={product.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
    <div className="p-4">
      <h4 className="text-sm font-bold text-gray-800 truncate group-hover:text-orange-600 transition mb-2">
        {product.name}
      </h4>
      <div className="flex items-center justify-between">
        <p className="text-xl font-extrabold text-orange-600">
          {formatCurrency(product.price)}
        </p>
        <div className="flex items-center gap-1 text-yellow-400">
          <i className="fas fa-star text-xs"></i>
          <span className="text-xs text-gray-600 font-semibold">
            {product.avg_review || 0}
          </span>
        </div>
      </div>
    </div>
  </Link>
);

const ProductViewPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();
  const { blogs } = useData();

  // Always call useConsumerData hook (React hooks must be called unconditionally)
  const { getLists, updateList, removeFromList } = ConsumerListService;

  const isConsumer = currentUser?.type === "consumer";

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [cartItem, setCartItem] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  const fetchLists = async () => {
    const lists = await getLists();
    setIsInWishlist(
      lists.wishlist?.some((item) => item.product_id === product.id) || false
    );
    const foundCartItem = lists.cart?.find((item) => item.id === product.id);
    setCartItem(foundCartItem || null);
    if (foundCartItem) {
      setQuantity(foundCartItem.quantity);
    } else {
      setQuantity(1);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const findProduct = async () => {
      const prod = await ConsumerProductService.getProductsByFilter({
        id: productId,
      });
      setProduct(prod[0]);
      setLoading(false);
    };
    findProduct();
  }, [productId, blogs]);

  useEffect(() => {
    if (isConsumer && product) {
      fetchLists();
    } else {
      setIsInWishlist(false);
      setCartItem(null);
      setQuantity(1);
    }
  }, [product, currentUser]);

  const handleWishlistToggle = async () => {
    if (!isConsumer) {
      toast.error("Please log in as a customer to manage wishlist.");
      return;
    }
    if (!product) return;
    try {
      if (isInWishlist) {
        await removeFromList("wishlist", product.id);
        toast.success("Removed from Wishlist");
      } else {
        await updateList("wishlist", 1, product.id);
        toast.success("Added to Wishlist ❤️");
      }
      await fetchLists();
    } catch (error) {
      toast.error("Could not update Wishlist.");
    }
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = async () => {
    if (!isConsumer) {
      toast.error("Please log in as a customer to add items.");
      return;
    }
    if (!product) return;
    try {
      await updateList("cart", quantity, product.id);
      toast.success(`${quantity} x ${product.name} added to cart! 🛒`);
      await fetchLists();
    } catch (error) {
      toast.error("Could not add to cart.");
    }
  };

  const handleBuyNow = async () => {
    if (!isConsumer) {
      toast.error("Please log in as a customer to buy.");
      return;
    }
    if (!product) return;
    try {
      await updateList("cart", quantity, product.id);
      await fetchLists();
      navigate("/consumer/checkout");
    } catch (error) {
      toast.error("Could not proceed to checkout.");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name || "Check out this product!",
        text: `Found this amazing product: ${product?.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard! 📋");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">
            Loading amazing product...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="text-center bg-white rounded-3xl shadow-2xl p-12 max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            This product doesn't exist or has been removed.
          </p>
          <Link
            to="/map"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
          >
            <i className="fas fa-arrow-left"></i>
            Back to Shopping
          </Link>
        </div>
      </div>
    );
  }

  const images = product.product_images || [];
  const displayedImages = images.slice(0, 6);
  const similarProducts = blogs
    .flatMap((blog) => blog.products || [])
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-50">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 pt-24 max-w-7xl">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm">
          <Link
            to="/map"
            className="text-gray-500 hover:text-orange-600 transition"
          >
            Home
          </Link>
          <i className="fas fa-chevron-right text-gray-400 text-xs"></i>
          <Link
            to="/map"
            className="text-gray-500 hover:text-orange-600 transition"
          >
            Products
          </Link>
          <i className="fas fa-chevron-right text-gray-400 text-xs"></i>
          <span className="text-gray-800 font-semibold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-gray-100 group">
              {displayedImages.length > 0 ? (
                <img
                  src={displayedImages[selectedImageIndex]?.url}
                  alt={`${product.name} - Image ${selectedImageIndex + 1}`}
                  className="w-full h-full object-cover cursor-zoom-in"
                  onClick={() => setShowImageModal(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <i className="fas fa-image text-6xl mb-4"></i>
                    <p>No Image Available</p>
                  </div>
                </div>
              )}

              {/* Wishlist Button */}
              <button
                onClick={handleWishlistToggle}
                className={`absolute top-6 right-6 z-10 w-14 h-14 flex items-center justify-center rounded-2xl bg-white/90 backdrop-blur-lg shadow-xl transition-all duration-300 hover:scale-110 ${
                  isInWishlist
                    ? "text-red-500"
                    : "text-gray-600 hover:text-red-500"
                }`}
              >
                <i
                  className={`fas fa-heart text-2xl ${
                    isInWishlist ? "animate-pulse" : ""
                  }`}
                ></i>
              </button>

              {/* Zoom Indicator */}
              <div className="absolute bottom-6 right-6 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <i className="fas fa-search-plus mr-2"></i>
                Click to zoom
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {displayedImages.length > 1 && (
              <div className="grid grid-cols-6 gap-3">
                {displayedImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-xl overflow-hidden border-3 transition-all duration-300 hover:scale-105 ${
                      selectedImageIndex === index
                        ? "border-orange-500 ring-4 ring-orange-200 shadow-lg"
                        : "border-gray-200 hover:border-orange-300"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Product Features */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                {
                  icon: "fas fa-shield-check",
                  text: "Authentic",
                  color: "from-green-500 to-emerald-500",
                },
                {
                  icon: "fas fa-truck-fast",
                  text: "Fast Delivery",
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  icon: "fas fa-undo",
                  text: "Easy Returns",
                  color: "from-purple-500 to-pink-500",
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className={`bg-gradient-to-br ${feature.color} rounded-2xl p-4 text-white text-center shadow-lg`}
                >
                  <i className={`${feature.icon} text-2xl mb-2`}></i>
                  <p className="text-xs font-semibold">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
              {/* Badge */}
              {product.type && (
                <span className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 rounded-full text-xs font-bold mb-4">
                  {product.type}
                </span>
              )}

              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Ratings */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 px-4 py-2 rounded-xl border border-yellow-200">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`fas fa-star text-sm ${
                          i < Math.round(product.avg_review || 0)
                            ? ""
                            : "text-gray-300"
                        }`}
                      ></i>
                    ))}
                  </div>
                  <span className="text-sm font-bold text-gray-700">
                    {product.avg_review || 0}
                  </span>
                </div>
                <span className="text-sm text-gray-600">
                  ({product.count_reviews || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-extrabold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    {formatCurrency(product.price)}
                  </span>
                  {product.mrp && product.mrp > product.price && (
                    <>
                      <span className="text-2xl text-gray-400 line-through">
                        {formatCurrency(product.mrp)}
                      </span>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                        {Math.round(
                          ((product.mrp - product.price) / product.mrp) * 100
                        )}
                        % OFF
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Inclusive of all taxes
                </p>
              </div>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <i className="fas fa-ruler text-orange-500"></i>
                  Select Size:{" "}
                  <span className="text-orange-600">{selectedSize}</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 border-2 rounded-xl font-bold transition-all duration-300 hover:scale-105 ${
                        selectedSize === size
                          ? "bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-500 shadow-lg"
                          : "bg-white hover:bg-gray-50 border-gray-300 text-gray-700"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <i className="fas fa-palette text-orange-500"></i>
                  Select Color:{" "}
                  <span className="text-orange-600 capitalize">
                    {selectedColor}
                  </span>
                </h3>
                <div className="flex flex-wrap gap-4">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      style={{ backgroundColor: color.toLowerCase() }}
                      className={`w-12 h-12 rounded-full border-4 transition-all duration-300 hover:scale-110 ${
                        selectedColor === color
                          ? "ring-4 ring-orange-500 border-white shadow-2xl scale-110"
                          : "border-gray-300 hover:border-gray-400 shadow-lg"
                      }`}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <i className="fas fa-file-alt text-orange-500"></i>
                Product Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description ||
                  "No description available for this product."}
              </p>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 space-y-4 sticky top-24">
              {/* Quantity Selector */}
              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 block">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="w-14 h-14 flex items-center justify-center text-gray-600 hover:bg-orange-500 hover:text-white transition-all"
                    >
                      <i className="fas fa-minus text-lg"></i>
                    </button>
                    <span className="w-16 text-center font-bold text-2xl text-gray-800">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="w-14 h-14 flex items-center justify-center text-gray-600 hover:bg-orange-500 hover:text-white transition-all"
                    >
                      <i className="fas fa-plus text-lg"></i>
                    </button>
                  </div>
                  {cartItem && (
                    <div className="flex-1 bg-blue-50 border-2 border-blue-200 rounded-xl px-4 py-2 text-center">
                      <p className="text-xs text-blue-600 font-semibold">
                        In Cart
                      </p>
                      <p className="text-sm font-bold text-blue-700">
                        {cartItem.quantity} items
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-orange-100 to-red-100 text-orange-600 hover:from-orange-200 hover:to-red-200 border-2 border-orange-300 font-bold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 text-lg hover:shadow-xl hover:scale-[1.02]"
              >
                <i className="fas fa-cart-plus text-xl"></i>
                {cartItem ? "Update Cart" : "Add to Cart"}
              </button>

              {/* Buy Now & Share */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleBuyNow}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-2"
                >
                  <i className="fas fa-bolt"></i>
                  Buy Now
                </button>
                <button
                  onClick={handleShare}
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-300 font-bold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg"
                >
                  <i className="fas fa-share-alt"></i>
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t-2 border-gray-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                  You Might Also Like
                </h2>
                <p className="text-gray-600">
                  Similar products handpicked for you
                </p>
              </div>
              <Link
                to="/map"
                className="text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-2 hover:gap-3 transition-all"
              >
                View All
                <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {similarProducts.map((p) => (
                <SimilarProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowImageModal(false)}
        >
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
          <img
            src={displayedImages[selectedImageIndex]?.url}
            alt={product.name}
            className="max-w-full max-h-full object-contain rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductViewPage;
