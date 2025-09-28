import React, { useState, useEffect, useCallback } from "react";
import borderElementImg from "../../assets/border_element.png";

const BrandIdentityCard = ({ brand, showContent = false, onReadMore }) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const brandDetails = brand || {};

  // Calculate responsive text sizes and positions based on container width
  const calculateResponsiveStyles = useCallback((width) => {
    if (width <= 480) {
      return {
        title: 'text-base',
        description: 'text-xs',
        button: 'text-sm',
        imageTop: 'top-[10%]',
        textTop: 'top-[40%]',
        buttonBottom: 'bottom-[10%]',
        textPadding: 'px-2'
      };
    } else if (width <= 640) {
      return {
        title: 'text-lg',
        description: 'text-sm',
        button: 'text-sm',
        imageTop: 'top-[10%]',
        textTop: 'top-[42%]',
        buttonBottom: 'bottom-[10%]',
        textPadding: 'px-3'
      };
    } else if (width <= 768) {
      return {
        title: 'text-xl',
        description: 'text-base',
        button: 'text-base',
        imageTop: 'top-[10%]',
        textTop: 'top-[45%]',
        buttonBottom: 'bottom-[10%]',
        textPadding: 'px-4'
      };
    } else if (width <= 1024) {
      return {
        title: 'text-2xl',
        description: 'text-lg',
        button: 'text-base',
        imageTop: 'top-[10%]',
        textTop: 'top-[150px]', // Fixed px for larger screens
        buttonBottom: 'bottom-[10%]',
        textPadding: 'px-4'
      };
    } else {
      return {
        title: 'text-3xl',
        description: 'text-xl',
        button: 'text-lg',
        imageTop: 'top-[10%]',
        textTop: 'top-[180px]', // Scaled for very large screens
        buttonBottom: 'bottom-[10%]',
        textPadding: 'px-6'
      };
    }
  }, []);

  const responsiveStyles = calculateResponsiveStyles(containerWidth);

  // Handle resize and initial measurement
  useEffect(() => {
    const updateSize = () => {
      const element = document.querySelector('.brand-card-container');
      if (element) {
        setContainerWidth(element.offsetWidth);
      }
    };

    // Initial measurement
    updateSize();

    // Add resize listener
    window.addEventListener('resize', updateSize);
    
    // Clean up
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Handle image load to trigger size recalculation if needed
  const handleImageLoad = () => {
    setIsLoaded(true);
    setTimeout(() => {
      const element = document.querySelector('.brand-card-container');
      if (element) {
        setContainerWidth(element.offsetWidth);
      }
    }, 10);
  };

  return (
    <div className="mt-6 w-full flex flex-col items-center px-2">
      {/* Outer wrapper for the card */}
      <div className="relative w-full max-w-[1024px] brand-card-container">
        {/* Border Frame */}
        <img
          src={borderElementImg}
          alt="Card Border"
          className="w-full h-auto object-contain"
          onLoad={handleImageLoad}
        />

        {/* Image container - responsive aspect ratio */}
        <div className={`absolute ${responsiveStyles.imageTop} left-1/2 -translate-x-1/2 w-[80%] aspect-[3/1] sm:aspect-[3/1] md:aspect-[3/1] rounded-xl overflow-hidden bg-gray-200 flex items-center justify-center`}>
          <img
            src={brandDetails.image}
            alt={brandDetails.title || "Brand"}
            className="w-full h-full object-cover transition-transform duration-300"
          />
        </div>

        {/* Text Content */}
        {showContent && (
          <div className={`absolute ${responsiveStyles.textTop} left-1/2 -translate-x-1/2 w-[85%] text-center flex flex-col`}>
            {/* Title - Dynamically sized based on container */}
            <h3 className={`font-bold text-[#FBF5E5] leading-tight ${responsiveStyles.title}`}>
              {brandDetails.title}
            </h3>

            {/* Description - Dynamically sized based on container */}
            <p className={`mt-2 text-[#FBF5E5] leading-relaxed text-justify ${responsiveStyles.textPadding} mt-3 sm:mt-4 ${responsiveStyles.description}`}>
              {brandDetails.description}
            </p>
          </div>
        )}

        {/* Button */}
        {showContent && (
          <div className={`absolute ${responsiveStyles.buttonBottom} left-1/2 -translate-x-1/2 w-full flex justify-center`}>
            <button
              onClick={() => onReadMore(brandDetails.id)}
              className="bg-gray-900 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 shadow-md"
            >
              <span className={responsiveStyles.button}>Read More</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandIdentityCard;