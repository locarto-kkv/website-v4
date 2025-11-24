// src/components/landing/InteractiveGrid.jsx
import React, { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatCurrency } from "../../lib/utils";

// --- Custom Hook for Tilt Effect (Desktop Only) ---
const useTilt = (isMobile) => {
  const ref = useRef(null);

  useEffect(() => {
    const card = ref.current;
    if (!card || isMobile) return;

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const tiltX = (y / rect.height - 0.5) * 15;
      const tiltY = (x / rect.width - 0.5) * -15;

      card.style.transition = "none";
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.03)`;
      card.style.boxShadow = `0 20px 40px rgba(0,0,0,0.3), 0 0 10px rgba(255,255,255,0.1) inset`;
    };

    const handleMouseLeave = () => {
      card.style.transition =
        "transform 0.5s ease-out, box-shadow 0.5s ease-out";
      card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
      card.style.boxShadow = `0 8px 16px rgba(0,0,0,0.15)`;
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    card.style.transition = "transform 0.5s ease-out, box-shadow 0.5s ease-out";
    card.style.boxShadow = `0 8px 16px rgba(0,0,0,0.15)`;

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isMobile]);

  return ref;
};
// --- End Tilt Hook ---

const ProductCard = ({ product, isMobile }) => {
  const tiltRef = useTilt(isMobile);
  const navigate = useNavigate();

  return (
    <Link
      ref={tiltRef}
      to={`/product/${product.product_uuid}`}
      className="product-card-v2 group bg-white shadow-xl lg:bg-white/80 lg:backdrop-blur-md rounded-2xl lg:shadow-xl overflow-hidden border border-gray-200 lg:border-white/40 transition-all duration-500 h-full flex flex-col cursor-pointer lg:hover:shadow-2xl lg:hover:border-white"
    >
      {/* Image Container with Price */}
      <div className="relative h-32 sm:h-48 bg-gradient-to-br from-gray-100 to-blue-100 overflow-hidden flex-shrink-0">
        <img
          src={product.product_images?.[0]?.url || "/api/placeholder/320/224"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Price Badge */}
        <div className="absolute top-2 right-2 z-10">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1 sm:px-4 sm:py-2 rounded-full shadow-xl transform group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-xs sm:text-sm">
              {formatCurrency(product.price)}
            </span>
          </div>
        </div>
      </div>

      {/* Content Section MODIFIED: Added text-center */}
      <div className="p-3 sm:p-4 md:p-6 flex flex-col flex-grow text-center">
        {/* Category & Title */}
        {/* MODIFIED: Used mx-auto to center the category badge */}
        <span className="text-[10px] sm:text-xs font-bold text-purple-600 mb-1 sm:mb-2 mx-auto">
          {product.category || "Product"}
        </span>

        <h3 className="font-black text-sm sm:text-lg mb-1 sm:mb-3 transition-colors duration-300 flex-grow">
          <span className="text-gray-900 group-hover:text-purple-700 transition-colors">
            {product.name}
          </span>
        </h3>

        {/* Description (Hidden on small mobile for space) */}
        <p className="text-xs text-gray-600 mb-2 sm:mb-4 line-clamp-3 leading-relaxed flex-shrink-0 hidden sm:block">
          {product.description}
        </p>

        {/* Action Button */}
        <div className="mt-auto pt-2 sm:pt-4 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={() => navigate(`/product/${product.product_uuid}`)}
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <i className="fas fa-eye"></i>
            <span className="font-black">View Details</span>
          </button>
        </div>
      </div>
    </Link>
  );
};

const VendorCard = ({ vendor, isMobile }) => {
  const tiltRef = useTilt(isMobile);
  const navigate = useNavigate();

  return (
    <Link
      ref={tiltRef}
      to={`/vendor/${vendor.id}/products/all`}
      className="vendor-card-v2 group bg-white shadow-xl lg:bg-white/80 lg:backdrop-blur-md rounded-2xl p-4 sm:p-6 md:p-8 lg:p-8 lg:shadow-xl border border-gray-200 lg:border-white/40 transition-all duration-500 h-full flex flex-col items-center cursor-pointer lg:hover:shadow-2xl lg:hover:border-white"
    >
      {/* WRAPPER FOR CONTENT THAT SHOULD GROW */}
      <div className="flex flex-col items-center flex-grow">
        {/* Logo Container */}
        <div className="relative mb-4 sm:mb-6">
          {/* Background Shimmer Effect (Desktop Only) */}
          <div className="absolute inset-[-10px] rounded-full opacity-10 blur-md bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 lg:animate-shimmer hidden lg:block" />

          <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-xl transition-all duration-300 group-hover:border-orange-500 group-hover:scale-105 bg-gradient-to-br from-orange-50 to-pink-50 relative z-10">
            <img
              src={vendor.brand_logo_1 || "/api/placeholder/112/112"}
              alt={vendor.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        </div>

        {/* Vendor Name */}
        <h3 className="font-black text-lg sm:text-2xl mb-2 sm:mb-3 transition-colors duration-300 text-center">
          <span className="text-gray-900 group-hover:text-orange-700 transition-colors">
            {vendor.name}
          </span>
        </h3>

        {/* Email / Contact */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 px-3 py-1.5 bg-gray-100 rounded-full group-hover:bg-orange-100 transition-colors duration-300 flex-shrink-0">
          <i className="fas fa-envelope text-orange-500"></i>
          <span className="break-all font-medium text-[10px] sm:text-xs">
            {vendor.email}
          </span>
        </div>
      </div>
      {/* END WRAPPER */}

      {/* Visit Store Button MODIFIED: Added mt-auto to push to bottom */}
      <button
        onClick={() => {
          navigate(`/vendor/${vendor.id}/products/all`);
        }}
        className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm font-bold shadow-xl transform hover:scale-105 transition-all duration-300 flex-shrink-0 mt-auto"
      >
        <span>Visit Store</span>
        <i className="fas fa-store"></i>
      </button>
    </Link>
  );
};

const InteractiveGrid = ({ data, type }) => {
  if (!data || data.length === 0) return null;

  const [displayLimit, setDisplayLimit] = useState(4);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const checkSize = () => {
      // Set limit to 2 for mobile/tablet (< 1024px, i.e., lg breakpoint)
      const isCurrentlyMobile = window.innerWidth < 1024;
      setDisplayLimit(isCurrentlyMobile ? 2 : 4); // Only show 2 items on mobile
      setIsMobile(isCurrentlyMobile);
    };
    window.addEventListener("resize", checkSize);
    checkSize(); // Initial check

    return () => window.removeEventListener("resize", checkSize);
  }, []);

  const CardComponent = type === "vendor" ? VendorCard : ProductCard;
  const header =
    type === "vendor"
      ? {
          badgeText: "Discover Amazing Brands",
          titleStart: "Brands Handpicked",
          titleEnd: "for you",
          subtitle: "Meet the innovative brands shaping tomorrow's marketplace",
          badgeColor: "text-[#f15b28]",
          badgeBg: "bg-orange-100",
          gradient: "from-orange-500 via-red-500 to-pink-500",
          icon: "fas fa-store",
        }
      : {
          badgeText: "Handpicked For You",
          titleStart: "Recommended",
          titleEnd: "Products",
          subtitle: "Curated collections from emerging brands you'll love",
          badgeColor: "text-[#353695]",
          badgeBg: "bg-blue-100",
          gradient: "from-blue-500 via-purple-500 to-pink-500",
          icon: "fas fa-box",
        };

  return (
    <div className="w-full relative py-12 sm:py-20 px-2 sm:px-4">
      {/* Section Header */}
      <div className="text-center mb-8 sm:mb-16 relative z-10">
        <div
          className={`relative inline-flex items-center gap-2 sm:gap-3 ${header.badgeBg} px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold ${header.badgeColor} shadow-lg`}
        >
          <span
            className={`w-2 h-2 ${header.badgeColor.replace(
              "text-",
              "bg-"
            )} rounded-full`}
          />
          {header.badgeText}
        </div>

        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6 mt-4">
          <span
            className={`bg-gradient-to-r ${header.gradient} bg-clip-text text-transparent`}
          >
            {header.titleStart} {header.titleEnd}
          </span>
        </h2>

        <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto font-light">
          {header.subtitle}
        </p>
      </div>

      {/* Interactive Grid Container: Centered with flex wrapper */}
      <div className="w-full flex justify-center px-4">
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 max-w-[1400px] w-full">
          {/* Limits to 2 items on mobile/tablet, 4 on desktop */}
          {data.slice(0, displayLimit).map((item, index) => (
            <div
              key={item.id || index}
              className="animate-fade-in-up-v2 w-[calc(50%-0.5rem)] sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)] lg:max-w-[300px]"
              style={{ animationDelay: `${index * 0.15 + 0.1}s` }}
            >
              <CardComponent
                {...(type === "vendor"
                  ? { vendor: item, isMobile }
                  : { product: item, isMobile })}
              />
            </div>
          ))}
        </div>
      </div>

      {/* View All Button */}
      <div className="text-center mt-8 sm:mt-12">
        <Link
          to={type === "vendor" ? "/discover" : "/map"}
          className="bg-[#0D1539] hover:bg-[#1A244C] text-white font-medium py-3 px-6 sm:px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 text-sm sm:text-lg flex items-center gap-2 justify-center mx-auto max-w-xs group"
        >
          <i className={`${header.icon} text-sm sm:text-lg`}></i>
          <span>
            {type === "vendor" ? "View All Brands" : "Explore Products"}
          </span>
        </Link>
      </div>

      <style>{`
        /* Global Styles for Cards */
        .product-card-v2, .vendor-card-v2 {
          box-shadow: 0 8px 16px rgba(0,0,0,0.15); 
          transform-style: preserve-3d;
          perspective: 1000px;
        }

        /* Initial Fade-in Animation */
        @keyframes fade-in-up-v2 {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up-v2 {
          animation: fade-in-up-v2 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default InteractiveGrid;
