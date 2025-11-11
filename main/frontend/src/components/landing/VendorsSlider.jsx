import React, { useState, useEffect, useRef } from "react";

const VendorsSlider = ({ recommends }) => {
  const vendors = recommends?.vendors || [];
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef(null);
  const animationRef = useRef(null);

  // Define scroll step: 270px on small screens (w-[260px] + gap/padding), 332px on desktop
  const getScrollStep = () => {
    if (window.innerWidth < 640) { // Assuming 'sm' is 640px
      return 270; // Adjusted for new 260px tile width
    }
    return 332;
  }

  useEffect(() => {
    if (vendors.length === 0) return;

    const scroll = scrollRef.current;
    if (!scroll) return;

    let lastTime = performance.now();
    const scrollSpeed = 0.5;

    const animate = (currentTime) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      if (!isPaused && scroll) {
        const scrollAmount = (scrollSpeed * deltaTime) / 16;
        scroll.scrollLeft += scrollAmount;
        
        // Seamless loop - when we've scrolled past the first set, jump back
        const singleSetWidth = scroll.scrollWidth / 3;
        if (scroll.scrollLeft >= singleSetWidth) {
          scroll.scrollLeft = scroll.scrollLeft - singleSetWidth;
        }
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
      const step = getScrollStep(); // Use responsive step
      const currentScroll = scrollRef.current.scrollLeft;
      scrollRef.current.scrollTo({ 
        left: currentScroll + step, 
        behavior: 'smooth' 
      });
    }
  };

  const handlePrev = () => {
    if (scrollRef.current) {
      const step = getScrollStep(); // Use responsive step
      const currentScroll = scrollRef.current.scrollLeft;
      scrollRef.current.scrollTo({ 
        left: currentScroll - step, 
        behavior: 'smooth' 
      });
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
    <div className="w-full overflow-hidden relative py-16 sm:py-24 px-0 sm:px-4" id="vendors">
      {/* Simplified Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-orange-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-pink-200/20 rounded-full blur-3xl" />
      </div>

      {/* Section Header */}
      <div className="text-center mb-16 sm:mb-20 relative z-10 px-4 sm:px-0">
        <div className="relative inline-block mb-6">
          <div className="relative inline-flex items-center gap-3 bg-orange-100 px-6 sm:px-8 py-3 rounded-full text-xs sm:text-sm font-bold text-[#f15b28] shadow-lg">
            <span className="w-2 h-2 bg-[#f15b28] rounded-full" />
            Discover Amazing Brands
          </div>
        </div>
        
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6">
          <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
            Brands Handpicked for you
          </span>
        </h2>
        
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="h-1.5 w-24 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full shadow-lg" />
        </div>
        
        <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto font-light">
          Meet the innovative brands shaping tomorrow's marketplace
        </p>
      </div>

      {/* Slider Container with responsive padding */}
      <div className="relative px-0 sm:px-20">
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation Arrows - Adjusted for mobile */}
          <button
            onClick={handlePrev}
            className="absolute -left-4 sm:-left-20 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/80 sm:bg-white rounded-full shadow-xl flex items-center justify-center hover:bg-orange-50 transition-all duration-300 hover:scale-110 border border-gray-100"
            aria-label="Previous"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#f15b28]">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <button
            onClick={handleNext}
            className="absolute -right-4 sm:-right-20 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/80 sm:bg-white rounded-full shadow-xl flex items-center justify-center hover:bg-orange-50 transition-all duration-300 hover:scale-110 border border-gray-100"
            aria-label="Next"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#f15b28]">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Scrollable container with padding to prevent border cut-off */}
          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-8 overflow-x-hidden py-4 px-4 sm:px-0"
            style={{ scrollBehavior: 'auto' }}
          >
            {extendedVendors.map((vendor, index) => (
              <div
                key={`${vendor.id}-${index}`}
                className="flex-shrink-0 w-[260px] sm:w-[300px] group"
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
    </div>
  );
};

export default VendorsSlider;