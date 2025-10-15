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
  const brandDetails = brand.blog || {};

  const calculateResponsiveStyles = useCallback((width) => {
    if (width <= 480) {
      return {
        title: "text-base",
        description: "text-xs",
        button: "text-sm",
        imageTop: "top-[10%]",
        textTop: "top-[40%]",
        buttonBottom: "bottom-[18%]", // raised from 10%
        textPadding: "px-2",
      };
    } else if (width <= 640) {
      return {
        title: "text-lg",
        description: "text-sm",
        button: "text-sm",
        imageTop: "top-[10%]",
        textTop: "top-[42%]",
        buttonBottom: "bottom-[18%]", // raised
        textPadding: "px-3",
      };
    } else if (width <= 768) {
      return {
        title: "text-xl",
        description: "text-base",
        button: "text-base",
        imageTop: "top-[10%]",
        textTop: "top-[45%]",
        buttonBottom: "bottom-[18%]", // raised
        textPadding: "px-4",
      };
    } else if (width <= 1024) {
      return {
        title: "text-2xl",
        description: "text-lg",
        button: "text-base",
        imageTop: "top-[10%]",
        textTop: "top-[150px]",
        buttonBottom: "bottom-[18%]", // raised
        textPadding: "px-4",
      };
    } else {
      return {
        title: "text-3xl",
        description: "text-xl",
        button: "text-lg",
        imageTop: "top-[10%]",
        textTop: "top-[180px]",
        buttonBottom: "bottom-[18%]", // raised
        textPadding: "px-6",
      };
    }
  }, []);

  const responsiveStyles = calculateResponsiveStyles(containerWidth);

  useEffect(() => {
    const updateSize = () => {
      const element = document.querySelector(".brand-card-container");
      if (element) {
        setContainerWidth(element.offsetWidth);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const handleImageLoad = () => {
    setTimeout(() => {
      const element = document.querySelector(".brand-card-container");
      if (element) {
        setContainerWidth(element.offsetWidth);
      }
    }, 10);
  };

  return (
    <div className="mt-6 w-full flex flex-col items-center px-2">
      <div className="relative w-full max-w-[1024px] brand-card-container">
        {/* Border Frame */}
        <img
          src={borderElementImg}
          alt="Card Border"
          className="w-full h-auto object-contain"
          onLoad={handleImageLoad}
        />

        {/* Image */}
        <div
          className={`absolute ${responsiveStyles.imageTop} left-1/2 -translate-x-1/2 w-[80%] aspect-[3/1] rounded-xl overflow-hidden bg-gray-200 flex items-center justify-center`}
        >
          <img
            src={brandDetails.brand_logo}
            alt={brandDetails.title || "Brand"}
            className="w-full h-full object-cover transition-transform duration-300"
          />
        </div>

        {/* Text */}
        <div
          className={`absolute ${responsiveStyles.textTop} left-1/2 -translate-x-1/2 w-[85%] text-center flex flex-col`}
        >
          <h3
            className={`font-bold text-[#0D1539] leading-tight ${responsiveStyles.title}`}
          >
            {brandDetails.title}
          </h3>
          <p
            className={`mt-3 sm:mt-4 text-[#0D1539] leading-relaxed text-justify ${responsiveStyles.textPadding} ${responsiveStyles.description}`}
          >
            {brandDetails.description}
          </p>
        </div>

        {/* Buttons */}
        <div
          className={`absolute ${responsiveStyles.buttonBottom} left-1/2 -translate-x-1/2 w-full flex justify-center`}
        >
          {showAdminButtons ? (
            <div className="flex space-x-3">
              <button
                onClick={() => onEdit?.(brand)}
                className="bg-gray-300 hover:bg-gray-500 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 shadow-md"
              >
                <span className={responsiveStyles.button}>Edit</span>
              </button>
              <button
                onClick={() => onDelete?.(brand)}
                className="bg-orange-600 hover:bg-orange-500 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
              >
                <span className={responsiveStyles.button}>Delete</span>
              </button>
            </div>
          ) : (
            <Link
              to={`/brand-info/${brandDetails.title}`}
              className="bg-gray-900 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 shadow-md"
            >
              <span className={responsiveStyles.button}>Read More</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandIdentityCard;
