import React, { useState, useEffect, useRef } from "react";

const ProductsSlider = ({ recommends }) => {
  const products = recommends?.products || [];
  const [offset, setOffset] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);
  const cardWidth = 320 + 32;

  useEffect(() => {
    if (isPaused || products.length === 0) return;

    const interval = setInterval(() => {
      setOffset((prev) => {
        const newOffset = prev - 1;
        if (Math.abs(newOffset) >= cardWidth * products.length) return 0;
        return newOffset;
      });
    }, 25);

    return () => clearInterval(interval);
  }, [isPaused, products.length, cardWidth]);

  const extendedProducts = products.length > 0 
    ? [...products, ...products, ...products] 
    : [];

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-hidden relative py-16 sm:py-24 px-2 sm:px-4" id="products">
      {/* Enhanced Decorative Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-blue-300/30 to-purple-300/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-purple-300/30 to-pink-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.7s' }} />
        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-gradient-to-br from-indigo-300/20 to-blue-300/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1.4s' }} />
        
        {/* Floating particles */}
        <div className="absolute top-10 right-1/3 w-3 h-3 bg-blue-400/60 rounded-full animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '3s' }} />
        <div className="absolute bottom-16 left-1/3 w-2 h-2 bg-purple-400/60 rounded-full animate-bounce" style={{ animationDelay: '0.9s', animationDuration: '2.5s' }} />
        <div className="absolute top-1/3 left-1/4 w-2.5 h-2.5 bg-pink-400/60 rounded-full animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '3.5s' }} />
      </div>

      {/* Section Header with Enhanced Styling */}
      <div className="text-center mb-16 sm:mb-20 relative z-10">
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 blur-2xl opacity-20 animate-pulse" />
          <div className="relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm px-6 sm:px-8 py-3 rounded-full text-xs sm:text-sm font-bold text-[#353695] shadow-lg border border-blue-200/50">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="animate-pulse">
              <path d="M21 16V8C21 6.9 20.1 6 19 6H5C3.9 6 3 6.9 3 8V16C3 17.1 3.9 18 5 18H19C20.1 18 21 17.1 21 16ZM5 8H19V16H5V8Z" fill="currentColor"/>
            </svg>
            Handpicked For You
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="animate-pulse">
              <path d="M21 16V8C21 6.9 20.1 6 19 6H5C3.9 6 3 6.9 3 8V16C3 17.1 3.9 18 5 18H19C20.1 18 21 17.1 21 16ZM5 8H19V16H5V8Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
        
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 relative">
          <span className="relative inline-block">
            <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-2xl opacity-30 animate-pulse" />
            <span className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
              RECOMMENDED PRODUCTS
            </span>
          </span>
        </h2>
        
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="h-1 w-12 bg-gradient-to-r from-transparent to-blue-500 rounded-full" />
          <div className="h-1.5 w-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-pulse shadow-lg shadow-purple-500/50" />
          <div className="h-1 w-12 bg-gradient-to-l from-transparent to-pink-500 rounded-full" />
        </div>
        
        <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto font-light">
          Curated collections from emerging brands you'll love
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
          {extendedProducts.map((product, index) => (
            <div
              key={`${product.id}-${index}`}
              className="flex-shrink-0 w-[300px] sm:w-[320px] group relative"
            >
              {/* Multi-layer Glow Effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-30 blur-2xl transition-all duration-700 animate-pulse" />
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-300 via-purple-400 to-pink-400 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500" />
              
              {/* Main Card with Glass Effect */}
              <div className="relative bg-gradient-to-br from-white to-blue-50/30 rounded-3xl shadow-xl overflow-hidden border border-blue-100/50 backdrop-blur-sm transition-all duration-500 h-full group-hover:shadow-2xl group-hover:-translate-y-3 group-hover:border-purple-300/80">
                
                {/* Enhanced Image Container */}
                <div className="relative h-56 bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
                  {/* Shimmer Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 z-30" />
                  
                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />
                  
                  <img
                    src={product.product_images?.[0]?.url || "/api/placeholder/320/224"}
                    alt={product.name}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-125 group-hover:rotate-2"
                  />
                  
                  {/* Enhanced Category Badge */}
                  <div className="absolute top-4 left-4 z-30">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 blur-md opacity-60" />
                      <div className="relative bg-white/95 backdrop-blur-md px-4 py-2 rounded-full text-xs font-black text-[#353695] shadow-xl border border-purple-200/50 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
                        {product.category || "Product"}
                      </div>
                    </div>
                  </div>

                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 z-30">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 blur-md opacity-60" />
                      <div className="relative bg-gradient-to-r from-orange-500 to-red-500 backdrop-blur-md px-4 py-2 rounded-full shadow-xl">
                        <span className="text-white font-black text-sm">₹{product.price}</span>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Corners */}
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-purple-500/20 via-purple-500/10 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Content Section */}
                <div className="p-6 relative">
                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-400/10 to-transparent rounded-bl-full" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/10 to-transparent rounded-tr-full" />
                  </div>

                  {/* Product Name */}
                  <h3 className="font-black text-lg sm:text-xl mb-3 line-clamp-2 min-h-[3.5rem] relative z-10 transition-all duration-300">
                    <span className="bg-gradient-to-r from-[#0D1539] to-[#353695] bg-clip-text text-transparent group-hover:from-[#353695] group-hover:to-[#5b5fc7]">
                      {product.name}
                    </span>
                  </h3>

                  {/* Description */}
                  {product.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem] relative z-10 leading-relaxed">
                      {product.description}
                    </p>
                  )}

                  {/* Action Section */}
                  <div className="flex items-center justify-between mt-5 pt-5 border-t border-gray-100 group-hover:border-purple-200 transition-colors duration-300 relative z-10">
                    <div>
                      <span className="text-xs text-gray-500 block mb-1 font-semibold uppercase tracking-wide">Best Price</span>
                      <div className="relative inline-block">
                        <span className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 blur-lg opacity-30" />
                        <span className="relative text-2xl font-black bg-gradient-to-r from-[#f15b28] to-[#ff8c5a] bg-clip-text text-transparent">
                          ₹{product.price}
                        </span>
                      </div>
                    </div>
                    
                    {/* Enhanced Button */}
                    <button className="relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-6 py-3 rounded-full text-sm font-bold hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/50 transform hover:scale-110 group/btn overflow-hidden">
                      {/* Button Shimmer */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000" />
                      <span className="relative font-black">View</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="relative group-hover/btn:translate-x-1 transition-transform duration-300">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Animated Bottom Border */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Corner Sparkles */}
                <div className="absolute top-20 right-6 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-80 transition-all duration-500 animate-ping z-40" />
                <div className="absolute bottom-32 left-6 w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-80 transition-all duration-500 animate-ping z-40" style={{ animationDelay: '0.2s' }} />
                <div className="absolute top-32 left-8 w-1 h-1 bg-pink-400 rounded-full opacity-0 group-hover:opacity-80 transition-all duration-500 animate-ping z-40" style={{ animationDelay: '0.4s' }} />
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

export default ProductsSlider;