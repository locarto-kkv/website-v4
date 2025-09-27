import React from "react";
import borderElementImg from "../../assets/border_element.png";

const BrandIdentityCard = ({ brand, showContent = false, onReadMore }) => {
  const brandDetails = brand || {};

  return (
    <div className="mt-6 w-full flex flex-col items-center px-2">
      {/* Outer wrapper for the card */}
      <div className="relative w-full max-w-[1024px]">
        {/* Border Frame */}
        <img
          src={borderElementImg}
          alt="Card Border"
          className="w-full h-auto object-contain"
        />

        {/* Image container - responsive aspect ratio */}
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[80%] aspect-[3/1] sm:aspect-[3/1] md:aspect-[3/1] rounded-xl overflow-hidden bg-gray-200 flex items-center justify-center">
          <img
            src={brandDetails.image}
            alt={brandDetails.title || "Brand"}
            className="w-full h-full object-cover transition-transform duration-300"
          />
        </div>

        {/* Text Content */}
        {showContent && (
          <div className="absolute top-[40%] sm:top-[45%] md:top-[150px] left-1/2 -translate-x-1/2 w-[85%] text-center flex flex-col">
            <h3 className="text-lg sm:text-base md:text-base font-bold text-[#FBF5E5]">
              {brandDetails.title}
            </h3>

            <p className="mt-2 text-sm sm:text-[10px] md:text-xs text-[#FBF5E5] leading-relaxed text-justify px-4 sm:px-3 md:px-4">
              {brandDetails.description}
            </p>
          </div>
        )}

        {/* Button */}
        {showContent && (
          <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-full flex justify-center">
            <button
              onClick={() => onReadMore(brandDetails.id)}
              className="bg-gray-900 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 shadow-md text-sm sm:text-base"
            >
              Read More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandIdentityCard;
