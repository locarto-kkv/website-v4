import React from "react";
import borderElementImg from "../../assets/border_element.png";

const BrandIdentityCard = ({ brand, showContent = false, onReadMore }) => {
  const brandDetails = brand || {};

  return (
    <div className="mt-[32px] w-full flex flex-col items-center pl-[8px] pr-[8px]">
      {/* Card with border + inner image */}
      <div className="relative w-full max-w-[1024px]"> {/* Increased max-width */}
        {/* Border Frame */}
        <img
          src={borderElementImg}
          alt="Card Border"
          className="w-full object-contain"
        />

        {/* Dedicated Image Container - Shorter and wider */}
        <div className="absolute top-[38px] left-1/2 -translate-x-1/2 w-[82%] aspect-[3/1] rounded-[16px] overflow-hidden bg-gray-200 flex items-center justify-center">
          <img
            src={brandDetails.image}
            alt={brandDetails.title || "Brand"}
            className="w-full h-full object-cover transition-transform duration-300"
          />
        </div>

        {/* Text Content */}
        {showContent && (
          <div className="absolute top-[150px] left-1/2 -translate-x-1/2 w-[80%] text-center flex flex-col h-full">
            <h3 className="text-[12px] font-bold text-[#FBF5E5] md:text-[14px]">
              {brandDetails.title}
            </h3>

            <p className="mt-[12px] text-[16px] md:text-[14px] text-[#FBF5E5] leading-relaxed text-justify">
              {brandDetails.description}
            </p>

            <div className="mt-auto"></div>
          </div>
        )}

        {/* Button positioned lower at bottom of the border image */}
        {showContent && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full flex justify-center">
            <div className="mb-[40px]"> {/* Increased from 64px to 80px - or adjust as needed */}
              <button
                onClick={() => onReadMore(brandDetails.id)}
                className="bg-gray-900 hover:bg-gray-700 text-white font-medium py-[12px] px-[32px] rounded-[5px] transition-colors duration-200 shadow-md text-[16px]"
              >
                Read More
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandIdentityCard;