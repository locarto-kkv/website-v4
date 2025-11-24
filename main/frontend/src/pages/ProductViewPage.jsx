// src/pages/consumer/ProductViewPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDataStore } from "../store/useDataStore";
import { ConsumerListService } from "../services/consumer/consumerListService";
import { ConsumerProductService } from "../services/consumer/consumerProductService";
import { useAuthStore } from "../store/useAuthStore";
import { formatCurrency } from "../lib/utils";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import toast from "react-hot-toast";
import { useConsumerDataStore } from "../store/consumer/consumerDataStore";

const SimilarProductCard = ({ product }) => (
  <Link
    to={`/product/${product.product_uuid}`}
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
  const { product_uuid } = useParams();
  const navigate = useNavigate();

  const currentUser = useAuthStore((s) => s.currentUser);
  const brands = useDataStore((s) => s.brands);
  const fetchProductsInBatch = useDataStore((s) => s.fetchProductsInBatch);
  const { updateList, removeFromList } = ConsumerListService;

  const lists = useConsumerDataStore((s) => s.lists);
  const vendorInCart = useConsumerDataStore((s) => s.vendorInCart);

  const isConsumer = currentUser?.type === "consumer";

  // State
  const [product, setProduct] = useState(null); // The currently selected variant or base product
  const [globalData, setGlobalData] = useState(null); // The raw API response wrapper
  const [variantList, setVariantList] = useState([]); // Array of variants (if any)
  const [variantKey, setVariantKey] = useState(""); // "size", "color", etc.

  const [reviews, setReviews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [cartItem, setCartItem] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  // Find the vendor associated with the product (using global data if available)
  const vendor = globalData
    ? brands.find((b) => b.id === globalData.vendor_id)
    : null;

  // Helper to show the custom auth toast
  const showAuthToast = () => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2 items-start">
          <span className="font-medium text-gray-800">
            Not signed in as customer
          </span>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              navigate("/consumer/login", { state: { isSignup: true } });
            }}
            className="px-3 py-1.5 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition-colors"
          >
            Sign Up as Customer
          </button>
        </div>
      ),
      {
        duration: 5000,
        icon: "🔒",
        style: {
          background: "#fff",
          color: "#333",
          border: "1px solid #e5e7eb",
        },
      }
    );
  };

  const setLists = async () => {
    if (!product) return;
    setIsInWishlist(
      lists.wishlist?.some((item) => item.product_id === product.id) || false
    );
    const foundCartItem = lists.cart?.find((item) => item.id === product.id);
    setCartItem(foundCartItem || null);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const findProduct = async () => {
      setLoading(true);
      try {
        const data = await ConsumerProductService.getProductVariants(
          product_uuid
        );

        // 1. Store Global Data
        setGlobalData(data);
        setReviews(data.reviews || []);

        let vList = [];
        let vKey = "";
        let initialVariant = null;

        // 2. Identify the Product Base/Initial State
        // Strategy: Check if there is a direct 'base' object first (Single SKU).
        if (data.base) {
          initialVariant = data.base;
        }

        // 3. Parse Variants (if they exist)
        if (data.variants && typeof data.variants === "object") {
          const keys = Object.keys(data.variants);
          if (keys.length > 0) {
            vKey = keys[0]; // e.g., "size"
            vList = data.variants[vKey];

            // If we didn't find a direct base object earlier, find the base variant
            // or default to the first one in the list.
            if (!initialVariant) {
              initialVariant = vList.find((v) => v.base) || vList[0];
            }
          }
        }

        setVariantList(vList);
        setVariantKey(vKey);

        // 4. Merge Data
        if (initialVariant) {
          const mergedProduct = {
            ...initialVariant,
            name: data.name || initialVariant.name || "Product Name",
            vendor_id: data.vendor_id,
            category: data.category,
            avg_review: data.avg_review || 0,
            count_reviews: data.count_reviews || 0,
            description: data.description,
          };
          setProduct(mergedProduct);
        }

        // 5. Background fetch for similar products
        if (data.vendor_id) {
          fetchProductsInBatch({
            vendor_id: data.vendor_id,
            category: data.category,
          });
        }
      } catch (error) {
        console.error("Error loading product", error);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    findProduct();
  }, [product_uuid]);

  // Handle Variant Switching
  const handleVariantChange = (variant) => {
    if (!globalData) return;

    const mergedProduct = {
      ...variant,
      name: globalData.name || variant.name || product.name,
      vendor_id: globalData.vendor_id,
      category: globalData.category,
      avg_review: globalData.avg_review || 0,
      count_reviews: globalData.count_reviews || 0,
      description: globalData.description || product.description,
    };

    setProduct(mergedProduct);
    setSelectedImageIndex(0);
  };

  useEffect(() => {
    if (isConsumer && product) {
      setLists();
    } else {
      setIsInWishlist(false);
      setCartItem(null);
    }
  }, [product, currentUser, lists]);

  const handleWishlistToggle = async () => {
    if (!isConsumer) {
      showAuthToast();
      return;
    }
    try {
      if (isInWishlist) {
        const newList = await removeFromList("wishlist", product.id);
        useConsumerDataStore.setState((state) => ({
          ...state,
          lists: { ...newList },
          vendorInCart: newList.cart ? state.vendorInCart : null,
        }));
        toast.success("Removed from Wishlist");
      } else {
        const newList = await updateList("wishlist", 1, product.id);
        useConsumerDataStore.setState((state) => ({
          ...state,
          lists: { ...newList },
        }));
        toast.success("Added to Wishlist ❤️");
      }
    } catch (error) {
      toast.error("Could not update Wishlist.");
    }
  };

  const handleQuantityChange = async (delta) => {
    if (!isConsumer) {
      showAuthToast();
      return;
    }
    const vendorId = product.vendor_id;
    try {
      if (cartItem?.quantity === 1 && delta < 1) {
        const newList = await removeFromList("cart", product.id);
        useConsumerDataStore.setState((state) => ({
          ...state,
          lists: { ...newList },
          vendorInCart: newList.cart ? state.vendorInCart : null,
        }));
      } else if (!cartItem?.quantity) {
        if (vendorInCart && vendorId !== vendorInCart) {
          toast.error(
            "Only one brand is allowed in cart at a time. Please remove previous brand to add a different one"
          );
          return;
        }
        const newList = await updateList("cart", "1", product.id);
        useConsumerDataStore.setState((state) => ({
          ...state,
          lists: { ...newList },
          vendorInCart: vendorId,
        }));
      } else {
        if (vendorInCart && vendorId !== vendorInCart) {
          toast.error(
            "Only one brand is allowed in cart at a time. Please remove previous brand to add a different one"
          );
          return;
        }
        const newList = await updateList(
          "cart",
          cartItem.quantity + delta,
          product.id
        );
        useConsumerDataStore.setState((state) => ({
          ...state,
          lists: { ...newList },
          vendorInCart: vendorId,
        }));
      }
    } catch (error) {
      toast.error("Could not add to cart.");
    }
  };

  const handleBuyNow = async () => {
    if (!isConsumer) {
      showAuthToast();
      return;
    }
    const vendorId = product.vendor_id;
    try {
      if (!cartItem?.quantity) {
        if (vendorInCart && vendorId !== vendorInCart) {
          toast.error(
            "Only one brand is allowed in cart at a time. Please remove previous brand to add a different one"
          );
          return;
        }
        const newList = await updateList("cart", "1", product.id);
        useConsumerDataStore.setState((state) => ({
          ...state,
          lists: { ...newList },
        }));
        navigate("/consumer/checkout");
      } else {
        navigate("/consumer/checkout");
      }
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
  const similarProducts = brands
    .flatMap((brand) => brand.products || [])
    .filter(
      (p) =>
        p.id !== product.id &&
        p.category === product.category &&
        p.vendor_id === product.vendor_id
    )
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

        {/* Brand Header */}
        {vendor && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl border border-gray-200 overflow-hidden flex-shrink-0 bg-white flex items-center justify-center">
                {vendor.brand_logo_1 ? (
                  <img
                    src={vendor.brand_logo_1}
                    alt={vendor.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <i className="fas fa-store text-2xl text-gray-400"></i>
                )}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 leading-tight">
                  {vendor.name}
                </h2>
                <p className="text-sm text-gray-500">Official Brand Store</p>
              </div>
            </div>
            <Link
              to={`/vendor/${vendor.id}/products/all`}
              className="hidden sm:inline-flex items-center gap-2 text-orange-600 bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
            >
              <span>View Store</span>
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        )}

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
                {globalData?.name || product.name}
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
                {/* Only show "Selected Variant" if there is an attribute name (i.e. not a single product) */}
                {product.attribute_name && (
                  <p className="text-orange-600 font-semibold mt-1">
                    Selected Variant: {product.attribute_name}
                  </p>
                )}
              </div>
            </div>

            {/* --- Variant Selector (Conditional) --- */}
            {variantList.length > 0 && (
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 capitalize">
                  <i className="fas fa-layer-group text-orange-500"></i>
                  Select {variantKey}:{" "}
                  <span className="text-orange-600">
                    {product.attribute_name}
                  </span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {variantList.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => handleVariantChange(variant)}
                      className={`min-w-[4rem] px-4 py-3 border-2 rounded-xl font-bold transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center ${
                        product.id === variant.id
                          ? "bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-500 shadow-lg scale-105"
                          : "bg-white hover:bg-gray-50 border-gray-300 text-gray-700"
                      }`}
                    >
                      <span>{variant.attribute_name}</span>
                    </button>
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
                      {cartItem?.quantity || 0}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="w-14 h-14 flex items-center justify-center text-gray-600 hover:bg-orange-500 hover:text-white transition-all"
                    >
                      <i className="fas fa-plus text-lg"></i>
                    </button>
                  </div>
                </div>
              </div>

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

        {/* Customer Reviews Section */}
        {reviews && reviews.length > 0 && (
          <div className="mt-16 pt-12 border-t-2 border-gray-200">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center gap-3">
              <i className="fas fa-star text-yellow-400"></i>
              Customer Reviews
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((r) => {
                const review = r.review || r;
                const hasImages =
                  review.review_images && review.review_images.length > 0;

                return (
                  <div
                    key={review.id}
                    className="bg-white border border-gray-200 rounded-2xl shadow hover:shadow-lg transition-all duration-300 overflow-hidden group"
                  >
                    {/* Optional Review Image */}
                    {hasImages && (
                      <div className="relative aspect-video bg-gray-100">
                        <img
                          src={review.review_images[0].url}
                          alt="Review"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {review.review_images.length > 1 && (
                          <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                            +{review.review_images.length - 1} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Review Content */}
                    <div className="p-4">
                      {/* Rating */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1 text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`fas fa-star text-sm ${
                                i < (review.rating || 0)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            ></i>
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-gray-500">
                          {review.rating}/5
                        </span>
                      </div>

                      {/* Review Text */}
                      <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                        {review.content || "No review content provided."}
                      </p>

                      {/* Date */}
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <i className="far fa-calendar text-gray-400"></i>
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
