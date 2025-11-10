import React, { useState, useEffect, useRef } from "react";

const VendorsSlider = ({ recommends }) => {
  const vendors = recommends?.vendors || [];
  const [offset, setOffset] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);
  const cardWidth = 300 + 32;

  useEffect(() => {
    if (isPaused || vendors.length === 0) return;

    const interval = setInterval(() => {
      setOffset((prev) => {
        const newOffset = prev - 1;
        if (Math.abs(newOffset) >= cardWidth * vendors.length) return 0;
        return newOffset;
      });
    }, 25);

    return () => clearInterval(interval);
  }, [isPaused, vendors.length, cardWidth]);

  const extendedVendors = vendors.length > 0 
    ? [...vendors, ...vendors, ...vendors] 
    : [];

  if (vendors.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-hidden relative py-16 sm:py-24 px-2 sm:px-4" id="vendors">
      {/* Enhanced Decorative Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-orange-300/30 to-pink-300/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-red-300/30 to-orange-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.7s' }} />
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-gradient-to-br from-pink-300/20 to-purple-300/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1.4s' }} />
        
        {/* Floating particles */}
        <div className="absolute top-10 left-1/3 w-3 h-3 bg-orange-400/60 rounded-full animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '3s' }} />
        <div className="absolute bottom-16 right-1/3 w-2 h-2 bg-pink-400/60 rounded-full animate-bounce" style={{ animationDelay: '0.9s', animationDuration: '2.5s' }} />
        <div className="absolute top-1/3 right-1/4 w-2.5 h-2.5 bg-red-400/60 rounded-full animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '3.5s' }} />
      </div>

      {/* Section Header with Enhanced Styling */}
      <div className="text-center mb-16 sm:mb-20 relative z-10">
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-500 blur-2xl opacity-20 animate-pulse" />
          <div className="relative inline-flex items-center gap-3 bg-gradient-to-r from-orange-500/10 via-pink-500/10 to-red-500/10 backdrop-blur-sm px-6 sm:px-8 py-3 rounded-full text-xs sm:text-sm font-bold text-[#f15b28] shadow-lg border border-orange-200/50">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="animate-pulse">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
            Discover Amazing Brands
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="animate-pulse">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
        
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 relative">
          <span className="relative inline-block">
            <span className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 blur-2xl opacity-30 animate-pulse" />
            <span className="relative bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
              FEATURED VENDORS
            </span>
          </span>
        </h2>
        
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="h-1 w-12 bg-gradient-to-r from-transparent to-orange-500 rounded-full" />
          <div className="h-1.5 w-24 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full animate-pulse shadow-lg shadow-orange-500/50" />
          <div className="h-1 w-12 bg-gradient-to-l from-transparent to-pink-500 rounded-full" />
        </div>
        
        <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto font-light">
          Meet the innovative brands shaping tomorrow's marketplace
        </p>
      </div>

      {/* Slider Container */}
      <div
        ref={containerRef}
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Enhanced Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

        <div
          className="flex gap-8"
          style={{
            transform: `translateX(${offset}px)`,
            transition: isPaused ? "transform 0.3s ease-out" : "none",
          }}
        >
          {extendedVendors.map((vendor, index) => (
            <div
              key={`${vendor.id}-${index}`}
              className="flex-shrink-0 w-[280px] sm:w-[300px] group relative"
            >
              {/* Multi-layer Glow Effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-orange-400 via-pink-500 to-red-500 rounded-3xl opacity-0 group-hover:opacity-30 blur-2xl transition-all duration-700 animate-pulse" />
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-300 via-pink-400 to-red-400 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500" />
              
              {/* Main Card with Glass Effect */}
              <div className="relative bg-gradient-to-br from-white to-orange-50/30 rounded-3xl shadow-xl p-8 border border-orange-100/50 backdrop-blur-sm transition-all duration-500 h-full group-hover:shadow-2xl group-hover:-translate-y-3 group-hover:border-orange-300/80 overflow-hidden">
                
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/10 to-transparent rounded-bl-full" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-pink-400/10 to-transparent rounded-tr-full" />
                </div>

                {/* Shimmer Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 animate-shimmer" />
                </div>
                
                <div className="flex flex-col items-center text-center relative z-10">
                  {/* Enhanced Logo Container */}
                  <div className="relative mb-6">
                    {/* Multiple Glow Layers */}
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-all duration-700 animate-pulse scale-150" />
                    <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-orange-500 rounded-full blur-lg opacity-0 group-hover:opacity-40 transition-all duration-500 scale-125" />
                    
                    {/* Logo Ring Animation */}
                    <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-2xl group-hover:border-orange-300 transition-all duration-500 group-hover:scale-110 bg-gradient-to-br from-orange-50 to-pink-50">
                      <img
                        src={vendor.brand_logo_1 || "/api/placeholder/112/112"}
                        alt={vendor.name}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-125 group-hover:rotate-3"
                      />
                      {/* Overlay gradient on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    
                    {/* Triple Orbiting Dots */}
                    <div className="absolute inset-0 animate-spin" style={{ animationDuration: '6s' }}>
                      <div className="absolute top-0 left-1/2 w-2.5 h-2.5 bg-gradient-to-r from-orange-400 to-red-500 rounded-full -translate-x-1/2 shadow-lg shadow-orange-400/50" />
                    </div>
                    <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s', animationDirection: 'reverse' }}>
                      <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-gradient-to-r from-pink-400 to-orange-500 rounded-full -translate-x-1/2 shadow-lg shadow-pink-400/50" />
                    </div>
                    <div className="absolute inset-0 animate-spin" style={{ animationDuration: '10s' }}>
                      <div className="absolute top-1/2 right-0 w-1.5 h-1.5 bg-gradient-to-r from-red-400 to-pink-500 rounded-full -translate-y-1/2 shadow-lg shadow-red-400/50" />
                    </div>
                  </div>

                  {/* Vendor Name with Gradient */}
                  <h3 className="font-black text-xl sm:text-2xl mb-3 transition-all duration-300 relative">
                    <span className="bg-gradient-to-r from-[#0D1539] to-[#f15b28] bg-clip-text text-transparent group-hover:from-[#f15b28] group-hover:to-[#ff8c5a]">
                      {vendor.name}
                    </span>
                  </h3>

                  {/* Email with Icon */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-5 px-2 bg-gray-50/50 rounded-full py-2 group-hover:bg-orange-50/50 transition-colors duration-300">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[#f15b28]">
                      <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="break-all font-medium">{vendor.email}</span>
                  </div>

                  {/* Enhanced Website Button */}
                  {vendor.website && (
                    <a
                      href={
                        vendor.website.startsWith("http")
                          ? vendor.website
                          : `https://${vendor.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white px-6 py-3 rounded-full text-sm font-bold hover:from-orange-600 hover:via-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/50 transform hover:scale-110 group/btn overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Button Shimmer */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000" />
                      <span className="relative">Visit Website</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="relative group-hover/btn:translate-x-1 transition-transform duration-300">
                        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  )}
                </div>

                {/* Animated Bottom Border */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-3xl" />
                
                {/* Corner Sparkles */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-orange-400 rounded-full opacity-0 group-hover:opacity-80 transition-all duration-500 animate-ping" />
                <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-pink-400 rounded-full opacity-0 group-hover:opacity-80 transition-all duration-500 animate-ping" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Pause Indicator */}
      {isPaused && (
        <div className="text-center mt-8 animate-fade-in">
          <span className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-50 px-5 py-2.5 rounded-full shadow-md border border-gray-200">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
            <span className="text-sm font-semibold text-gray-600">Paused</span>
          </span>
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BrandsSlider;