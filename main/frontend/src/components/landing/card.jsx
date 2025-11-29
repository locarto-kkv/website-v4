// src/components/landing/card.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import borderElementImg from "../../assets/border_element.png"; //

const BrandIdentityCard = ({
  brand,
  showAdminButtons = false,
  onEdit,
  onDelete,
}) => {
  const [containerWidth, setContainerWidth] = useState(0); //
  const brandDetails = brand.blog[0] || {}; //

  // --- ADJUSTED RESPONSIVE STYLES FOR SMALLER CARD & SPACING ---
  const calculateResponsiveStyles = useCallback((width) => {
    //
    // Base styles (Smallest screens)
    let styles = {
      //
      title: "text-sm",
      description: "text-[10px]",
      button: "text-xs py-1 px-3",
      imageTop: "top-[10%]", // Slightly higher image
      textTop: "top-[40%]", // Adjusted text start
      buttonBottom: "bottom-[15%]", // Lower button slightly
      textPadding: "px-1",
      imageWidth: "w-[55%]",
      imageAspect: "aspect-[16/9]",
    };

    // Adjustments for larger breakpoints
    if (width > 400) {
      // Example breakpoint for slightly larger
      styles.title = "text-base";
      styles.description = "text-xs";
      styles.button = "text-sm py-1.5 px-4";
      styles.imageTop = "top-[9%]"; // Adjust image top
      styles.textTop = "top-[42%]"; // Move text down slightly
      styles.buttonBottom = "bottom-[14%]"; // Move button down
      styles.textPadding = "px-2";
    }
    if (width > 550) {
      // Example breakpoint for medium (within max-w-640px)
      styles.title = "text-lg";
      styles.description = "text-sm";
      styles.button = "text-sm py-2 px-5";
      styles.imageTop = "top-[8%]"; // Adjust image top
      styles.textTop = "top-[44%]"; // Move text down further
      styles.buttonBottom = "bottom-[12%]"; // Move button down further
      styles.textPadding = "px-3";
      styles.imageWidth = "w-[60%]";
    }

    return styles; //
  }, []); //
  // --- END ADJUSTED STYLES ---

  const responsiveStyles = calculateResponsiveStyles(containerWidth); //

  useEffect(() => {
    //
    const updateSize = () => {
      //
      const element = document.querySelector(".brand-card-container"); //
      if (element) {
        //
        setContainerWidth(element.offsetWidth); //
      }
    };

    const timeoutId = setTimeout(updateSize, 50); //
    window.addEventListener("resize", updateSize); //

    return () => {
      //
      clearTimeout(timeoutId); //
      window.removeEventListener("resize", updateSize); //
    };
  }, []); //

  return (
    <div className="mt-6 w-full flex flex-col items-center px-2">
      {" "}
      {/* */}
      <div className="relative w-full max-w-[640px] brand-card-container">
        {" "}
        {/* Reduced max-width significantly */} {/* */}
        {/* Border Frame */}
        <img
          src={borderElementImg} //
          alt="Card Border"
          className="w-full h-auto object-contain" //
        />
        {/* Image */}
        <div
          className={`absolute ${responsiveStyles.imageTop} left-1/2 -translate-x-1/2 ${responsiveStyles.imageWidth} ${responsiveStyles.imageAspect} rounded-xl overflow-hidden bg-gray-200 flex items-center justify-center`} //
        >
          <img
            src={brandDetails.blog_image} //
            alt={brandDetails.title || "Brand"} //
            className="w-full h-full object-cover transition-transform duration-300" //
          />
        </div>
        {/* Text */}
        <div
          className={`absolute ${responsiveStyles.textTop} left-1/2 -translate-x-1/2 w-[85%] text-center flex flex-col`} //
        >
          {/* Title */}
          <h3
            className={`font-bold text-[#0D1539] leading-tight ${responsiveStyles.title}`} //
          >
            {brandDetails.title} {/* */}
          </h3>
          {/* Description - Added margin-top */}
          <p
            className={`mt-2 sm:mt-3 text-[#0D1539] leading-relaxed line-clamp-3 sm:line-clamp-4 ${responsiveStyles.textPadding} ${responsiveStyles.description}`} // Added mt-2 sm:mt-3 //
          >
            {brandDetails.description} {/* */}
          </p>
        </div>
        {/* Buttons */}
        <div
          className={`absolute ${responsiveStyles.buttonBottom} left-1/2 -translate-x-1/2 w-full flex justify-center`} //
        >
          {showAdminButtons ? ( //
            <div className="flex space-x-2 sm:space-x-3">
              {" "}
              {/* */}
              <button
                onClick={() => onEdit?.(brand)} //
                className={`bg-gray-300 hover:bg-gray-500 text-white font-medium rounded-lg transition-colors duration-200 shadow-md ${responsiveStyles.button}`} //
              >
                Edit
              </button>
              <button
                onClick={() => onDelete?.(brand)} //
                className={`bg-orange-600 hover:bg-orange-500 text-white font-medium rounded-lg transition-colors duration-200 shadow-md ${responsiveStyles.button}`} //
              >
                Delete
              </button>
            </div>
          ) : (
            <Link
              to={`/brand-info/${brandDetails.title}`} //
              className={`bg-gray-900 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md ${responsiveStyles.button}`} //
            >
              Read More
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandIdentityCard; //
