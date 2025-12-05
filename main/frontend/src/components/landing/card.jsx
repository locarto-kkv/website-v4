// src/components/landing/card.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import borderElementImg from "../../assets/border_element.png";

const BrandIdentityCard = ({
  brand,
  showAdminButtons = false,
  onEdit,
  onDelete,
}) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const brandDetails = brand.blog[0] || {};

  // --- ADJUSTED RESPONSIVE STYLES ---
  const calculateResponsiveStyles = useCallback((width) => {
    // Base styles (Smallest screens)
    let styles = {
      title: "text-sm",
      description: "text-[10px]",
      button: "text-xs py-1.5 px-4",
      // Image: 1:1 aspect ratio
      imageTop: "top-[8%]",
      imageWidth: "w-[40%] max-w-[200px]",
      imageAspect: "aspect-square",
      // Text: Pushed down significantly
      textTop: "top-[55%]",
      buttonBottom: "bottom-[12%]",
      textPadding: "px-1",
    };

    // Adjustments for larger breakpoints
    if (width > 400) {
      styles.title = "text-base";
      styles.description = "text-xs";
      styles.button = "text-sm py-2 px-6";
      styles.imageTop = "top-[7%]";
      styles.textTop = "top-[58%]";
      styles.buttonBottom = "bottom-[10%]";
      styles.textPadding = "px-2";
    }
    if (width > 550) {
      styles.title = "text-xl";
      styles.description = "text-sm";
      styles.button = "text-sm py-2.5 px-8";
      styles.imageTop = "top-[6%]";
      styles.textTop = "top-[60%]";
      styles.buttonBottom = "bottom-[9%]";
      styles.textPadding = "px-4";
      styles.imageWidth = "w-[35%] max-w-[200px]";
    }

    return styles;
  }, []);

  const responsiveStyles = calculateResponsiveStyles(containerWidth);

  useEffect(() => {
    const updateSize = () => {
      const element = document.querySelector(".brand-card-container");
      if (element) {
        setContainerWidth(element.offsetWidth);
      }
    };

    const timeoutId = setTimeout(updateSize, 50);
    window.addEventListener("resize", updateSize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  // Helper to stop navigation when clicking admin buttons
  const handleAdminClick = (e, action) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation(); // Stop event bubbling
    action?.(brand);
  };

  return (
    <div className="mt-6 w-full flex flex-col items-center px-2">
      {/* CHANGED: The container is now a Link. 
        'block' is added to ensure it behaves like a div layout-wise.
      */}
      <Link
        to={`/brand-info/${brand.name}`}
        className="relative w-full max-w-[640px] brand-card-container group select-none block cursor-pointer"
      >
        {/* --- GLASS SHINE EFFECT OVERLAY --- */}
        <div className="absolute inset-0 z-10 w-full h-full overflow-hidden rounded-3xl pointer-events-none">
          <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-blue-200 opacity-40 group-hover:animate-shine" />
        </div>

        {/* Border Frame */}
        <img
          src={borderElementImg}
          alt="Card Border"
          className="w-full h-auto object-contain drop-shadow-xl"
        />

        {/* Image - 1:1 Aspect Ratio (Square) */}
        <div
          className={`absolute ${responsiveStyles.imageTop} left-1/2 -translate-x-1/2 
          ${responsiveStyles.imageWidth} ${responsiveStyles.imageAspect} 
          rounded-2xl overflow-hidden bg-white shadow-inner border-4 border-white/50 flex items-center justify-center z-20`}
        >
          <img
            src={brandDetails.blog_image}
            alt={brandDetails.title || "Brand"}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Text */}
        <div
          className={`absolute ${responsiveStyles.textTop} left-1/2 -translate-x-1/2 w-[85%] text-center flex flex-col z-20`}
        >
          {/* Title */}
          <h3
            className={`font-extrabold text-[#0D1539] tracking-tight leading-tight ${responsiveStyles.title}`}
          >
            {brandDetails.title}
          </h3>
          {/* Description */}
          <p
            className={`mt-2 text-gray-600 font-medium leading-relaxed line-clamp-2 sm:line-clamp-3 ${responsiveStyles.textPadding} ${responsiveStyles.description}`}
          >
            {brandDetails.description}
          </p>
        </div>

        {/* Buttons - Only show Admin buttons if requested */}
        {showAdminButtons && (
          <div
            className={`absolute ${responsiveStyles.buttonBottom} left-1/2 -translate-x-1/2 w-full flex justify-center z-30`}
          >
            <div className="flex space-x-3">
              <button
                onClick={(e) => handleAdminClick(e, onEdit)}
                className={`bg-gradient-to-br from-gray-100 to-gray-300 hover:from-white hover:to-gray-200 text-gray-700 border border-gray-300 font-bold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 ${responsiveStyles.button}`}
              >
                Edit
              </button>
              <button
                onClick={(e) => handleAdminClick(e, onDelete)}
                className={`bg-gradient-to-br from-red-500 to-orange-600 hover:from-red-400 hover:to-orange-500 text-white font-bold rounded-full transition-all duration-300 shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5 active:scale-95 ${responsiveStyles.button}`}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </Link>
    </div>
  );
};

export default BrandIdentityCard;
