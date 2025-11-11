import React, { useState, useEffect, useRef } from "react";

const VendorsSlider = ({ recommends }) => {
  const vendors = recommends?.vendors || [];
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (vendors.length === 0) return;

    const scroll = scrollRef.current;
    if (!scroll) return;

    let scrollPos = 0;
    const scrollSpeed = 0.5; // Reduced speed for smoothness

    const animate = () => {
      if (!isPaused && scroll) {
        scrollPos += scrollSpeed;
        
        // Reset when scrolled past first set
        if (scrollPos >= scroll.scrollWidth / 3) {
          scrollPos = 0;
        }
        
        scroll.scrollLeft = scrollPos;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused, vendors.length]);

  const handleNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 332, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -332, behavior: 'smooth' });
    }
  };

  // Triple the array for seamless loop
  const extendedVendors = vendors.length > 0 
    ? [...vendors, ...vendors, ...vendors] 
    : [];

  if (vendors.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-hidden relative py-16 sm:py-24 px-2 sm:px-4" id="vendors">
      {/* Simplified Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-orange-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-pink-200/20 rounded-full blur-3xl" />
      </div>

      {/* Section Header */}
      <div className="text-center mb-16 sm:mb-20 relative z-10">
        <div className="relative inline-block mb-6">
          <div className="relative inline-flex items-center gap-3 bg-orange-100 px-6 sm:px-8 py-3 rounded-full text-xs sm:text-sm font-bold text-[#f15b28] shadow-lg">
            <span className="w-2 h-2 bg-[#f15b28] rounded-full" />
            Discover Amazing Brands
          </div>
        </div>
        
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6">
          <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
            FEATURED VENDORS
          </span>
        </h2>
        
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="h-1.5 w-24 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full shadow-lg" />
        </div>
        
        <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto font-light">
          Meet the innovative brands shaping tomorrow's marketplace
        </p>
      </div>

      {/* Slider Container */}
      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center hover:bg-orange-50 transition-all duration-300 hover:scale-110 border border-gray-100"
          aria-label="Previous"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#f15b28]">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center hover:bg-orange-50 transition-all duration-300 hover:scale-110 border border-gray-100"
          aria-label="Next"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#f15b28]">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-hidden"
          style={{ scrollBehavior: 'auto' }}
        >
          {extendedVendors.map((vendor, index) => (
            <div
              key={`${vendor.id}-${index}`}
              className="flex-shrink-0 w-[280px] sm:w-[300px] group"
            >
              {/* Main Card */}
              <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 transition-all duration-300 h-full hover:shadow-xl hover:-translate-y-2 hover:border-orange-200">
                <div className="flex flex-col items-center text-center">
                  {/* Logo Container */}
                  <div className="relative mb-6">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl transition-all duration-300 group-hover:border-orange-300 group-hover:scale-105 bg-gradient-to-br from-orange-50 to-pink-50">
                      <img
                        src={vendor.brand_logo_1 || "/api/placeholder/112/112"}
                        alt={vendor.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  </div>

                  {/* Vendor Name */}
                  <h3 className="font-black text-xl sm:text-2xl mb-3 transition-colors duration-300">
                    <span className="bg-gradient-to-r from-[#0D1539] to-[#f15b28] bg-clip-text text-transparent group-hover:from-[#f15b28] group-hover:to-[#ff8c5a]">
                      {vendor.name}
                    </span>
                  </h3>

                  {/* Email */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-5 px-2 bg-gray-50 rounded-full py-2 group-hover:bg-orange-50 transition-colors duration-300">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[#f15b28]">
                      <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="break-all font-medium">{vendor.email}</span>
                  </div>

                  {/* Website Button */}
                  {vendor.website && (
                    <a
                      href={
                        vendor.website.startsWith("http")
                          ? vendor.website
                          : `https://${vendor.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white px-6 py-3 rounded-full text-sm font-bold hover:from-orange-600 hover:via-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>Visit Website</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

     
    </div>
  );
};

export default VendorsSlider;