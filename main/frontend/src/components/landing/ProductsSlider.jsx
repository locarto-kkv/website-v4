import React, { useState, useEffect, useRef } from "react";

const ProductSlider = ({ recommends }) => {
  const products = recommends?.products || [];
  const [offset, setOffset] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);
  const cardWidth = 280 + 24; // card width + gap

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setOffset((prev) => {
        const newOffset = prev - 1;
        if (Math.abs(newOffset) >= cardWidth * products.length) return 0;
        return newOffset;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [isPaused, products.length]);

  const extendedProducts = [...products, ...products, ...products];

  return (
    <div className="w-full overflow-hidden relative py-16 px-4" id="products">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-16 text-[#0D1539]">
        RECOMMENDED PRODUCTS
      </h2>

      <div
        ref={containerRef}
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className="flex gap-6 transition-transform"
          style={{
            transform: `translateX(${offset}px)`,
            transition: isPaused ? "transform 0.3s ease-out" : "none",
          }}
        >
          {extendedProducts.map((product, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[280px] bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
              }}
            >
              <div className="flex flex-col items-center text-center">
                <img
                  src={product.product_images?.[0]?.url || "N/A"}
                  alt={product.name}
                  className="w-32 h-32 object-cover rounded-xl mb-4 border border-gray-200"
                />
                <h3 className="font-bold text-lg text-[#0D1539] mb-1">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                <p className="text-[#f15b28] font-semibold text-base mb-2">
                  ₹{product.price}
                </p>
                {product.description && (
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {product.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSlider;
