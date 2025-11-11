import React, { useState, useEffect, useRef } from "react";

const ProductsSlider = ({ recommends }) => {
  const products = recommends?.products || [];
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef(null);
  const animationRef = useRef(null);

  // Define scroll step: 290px on small screens (w-[280px] + gap/padding), 352px on desktop
  const getScrollStep = () => {
    if (window.innerWidth < 640) { // Assuming 'sm' is 640px
      return 290; // Adjusted for new 280px tile width
    }
    return 352;
  }

  useEffect(() => {
    if (products.length === 0) return;

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
  }, [isPaused, products.length]);

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
  const extendedProducts = products.length > 0 
    ? [...products, ...products, ...products] 
    : [];

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-hidden relative py-16 sm:py-24 px-0 sm:px-4" id="products">
      {/* Simplified Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl" />
      </div>

      {/* Section Header */}
      <div className="text-center mb-16 sm:mb-20 relative z-10 px-4 sm:px-0">
        <div className="relative inline-block mb-6">
          <div className="relative inline-flex items-center gap-3 bg-blue-100 px-6 sm:px-8 py-3 rounded-full text-xs sm:text-sm font-bold text-[#353695] shadow-lg">
            <span className="w-2 h-2 bg-[#353695] rounded-full" />
            Handpicked For You
          </div>
        </div>
        
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6">
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Recommended Products
          </span>
        </h2>
        
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="h-1.5 w-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-lg" />
        </div>
        
        <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto font-light">
          Curated collections from emerging brands you'll love
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
            className="absolute -left-4 sm:-left-20 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/80 sm:bg-white rounded-full shadow-xl flex items-center justify-center hover:bg-blue-50 transition-all duration-300 hover:scale-110 border border-gray-100"
            aria-label="Previous"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#353695]">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <button
            onClick={handleNext}
            className="absolute -right-4 sm:-right-20 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/80 sm:bg-white rounded-full shadow-xl flex items-center justify-center hover:bg-blue-50 transition-all duration-300 hover:scale-110 border border-gray-100"
            aria-label="Next"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#353695]">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Scrollable container with padding to prevent border cut-off */}
          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-8 overflow-x-hidden py-4 px-4 sm:px-0"
            style={{ scrollBehavior: 'auto' }}
          >
            {extendedProducts.map((product, index) => (
              <div
                key={`${product.id}-${index}`}
                className="flex-shrink-0 w-[280px] sm:w-[320px] group"
              >
                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 h-full hover:shadow-xl hover:-translate-y-2 hover:border-purple-200">
                  
                  {/* Image Container */}
                  <div className="relative h-56 bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
                    <img
                      src={product.product_images?.[0]?.url || "/api/placeholder/320/224"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 z-30">
                      <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-full text-xs font-black text-[#353695] shadow-lg border border-purple-200/50 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                        {product.category || "Product"}
                      </div>
                    </div>

                    {/* Price Badge */}
                    <div className="absolute top-4 right-4 z-30">
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 rounded-full shadow-xl">
                        <span className="text-white font-black text-sm">₹{product.price}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    {/* Product Name */}
                    <h3 className="font-black text-lg sm:text-xl mb-3 line-clamp-2 min-h-[3.5rem] transition-colors duration-300">
                      <span className="bg-gradient-to-r from-[#0D1539] to-[#353695] bg-clip-text text-transparent group-hover:from-[#353695] group-hover:to-[#5b5fc7]">
                        {product.name}
                      </span>
                    </h3>

                    {/* Description */}
                    {product.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem] leading-relaxed">
                        {product.description}
                      </p>
                    )}

                    {/* Action Section */}
                    <div className="flex items-center justify-between mt-5 pt-5 border-t border-gray-100 group-hover:border-purple-200 transition-colors duration-300">
                      <div>
                        <span className="text-xs text-gray-500 block mb-1 font-semibold uppercase tracking-wide">Best Price</span>
                        <span className="text-2xl font-black bg-gradient-to-r from-[#f15b28] to-[#ff8c5a] bg-clip-text text-transparent">
                          ₹{product.price}
                        </span>
                      </div>
                      
                      {/* Button */}
                      <button className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-6 py-3 rounded-full text-sm font-bold hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                        <span className="font-black">View</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
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

export default ProductsSlider;