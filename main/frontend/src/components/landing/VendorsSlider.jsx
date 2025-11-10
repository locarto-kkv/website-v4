import React, { useState, useEffect, useRef } from "react";

const BrandsSlider = ({ recommends }) => {
  const vendors = recommends?.vendors || [];
  const [offset, setOffset] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);
  const cardWidth = 260 + 24; // card width + gap

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setOffset((prev) => {
        const newOffset = prev - 1;
        if (Math.abs(newOffset) >= cardWidth * vendors.length) return 0;
        return newOffset;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [isPaused, vendors.length]);

  const extendedVendors = [...vendors, ...vendors, ...vendors];

  return (
    <div className="w-full overflow-hidden relative py-16 px-4" id="vendors">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-16 text-[#0D1539]">
        FEATURED VENDORS
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
          {extendedVendors.map((vendor, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[260px] bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
              }}
            >
              <div className="flex flex-col items-center text-center">
                <img
                  src={
                    vendor.brand_logo_1 ||
                    "https://via.placeholder.com/100?text=No+Logo"
                  }
                  alt={vendor.name}
                  className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-[#f15b28] shadow-md"
                />
                <h3 className="font-bold text-lg text-[#0D1539] mb-1">
                  {vendor.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{vendor.email}</p>
                {vendor.website && (
                  <a
                    href={
                      vendor.website.startsWith("http")
                        ? vendor.website
                        : `https://${vendor.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#f15b28] text-sm font-medium hover:underline"
                  >
                    Visit Website
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandsSlider;
