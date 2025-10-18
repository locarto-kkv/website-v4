import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import locartoImg from "../assets/locarto.png";
import { useData } from "../context/dataContext";

const MapView = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get("category");
  const navigate = useNavigate();

  const { blogs, fetchProductsInBatch } = useData(); // vendors with products

  const categories = [
    {
      name: "Personal Care",
      color: "#10B981",
      icon: "fas fa-leaf",
      description: "Skin Care, Beauty, Fragrances",
    },
    {
      name: "Accessories",
      color: "#EF4444",
      icon: "fas fa-gem",
      description: "Fashion, Daily, Tech",
    },
  ];

  const [showOverlay, setShowOverlay] = useState(true);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(() => {
    if (categoryParam) {
      const idx = categories.findIndex(
        (c) => c.name.toLowerCase() === categoryParam.toLowerCase()
      );
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });

  const [map, setMap] = useState(null);

  const nextCategory = () =>
    setCurrentCategoryIndex((prev) => (prev + 1) % categories.length);

  const prevCategory = () =>
    setCurrentCategoryIndex(
      (prev) => (prev - 1 + categories.length) % categories.length
    );

  const handleCategoryTextClick = async (index) => {
    setCurrentCategoryIndex(index);
    setShowOverlay(false);
  };

  // Create custom icon per category
  const createCustomIcon = (category) =>
    L.divIcon({
      className: "custom-marker",
      html: `
        <div style="
          background: linear-gradient(135deg, ${category.color}, ${category.color}dd);
          width: 40px;
          height: 40px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 8px 20px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <i class="${category.icon}" style="transform: rotate(45deg); color: white; font-size: 16px;"></i>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });

  // Initialize map
  useEffect(() => {
    const mapInstance = L.map("map-container", { zoomControl: false }).setView(
      [19.076, 72.8777],
      12
    );

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
        minZoom: 3, // allow zooming out freely
      }
    ).addTo(mapInstance);

    L.control.zoom({ position: "bottomright" }).addTo(mapInstance);

    setMap(mapInstance);
    return () => mapInstance.remove();
  }, []);

  // Fetch products for the current category when it changes
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      const category = categories[currentCategoryIndex].name;
      try {
        await fetchProductsInBatch({ category });
        console.log(`Fetched products for category:`, blogs);
      } catch (err) {
        console.error("Error fetching products for category:", err);
      }
    };

    fetchCategoryProducts();
  }, [currentCategoryIndex]);

  // Render vendor markers
  useEffect(() => {
    if (!map) return;

    // Clear previous markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) map.removeLayer(layer);
    });

    if (!showOverlay) {
      const currentCategory = categories[currentCategoryIndex];
      const customIcon = createCustomIcon(currentCategory);

      const vendorsToDisplay = (blogs || []).filter((vendor) => {
        // must have position + products
        const hasValidPosition =
          Array.isArray(vendor.position) && vendor.position.length === 2;
        const hasProducts =
          vendor.products &&
          Array.isArray(vendor.products) &&
          vendor.products.length > 0;
        return hasValidPosition && hasProducts;
      });

      console.log(
        "Displaying vendors:",
        vendorsToDisplay.map((v) => v.name)
      );

      vendorsToDisplay.forEach((vendor) => {
        const marker = L.marker(vendor.position, { icon: customIcon }).addTo(
          map
        );

        marker.bindTooltip(vendor.name || "Unnamed Vendor", {
          permanent: true,
          direction: "top",
          offset: [0, -45],
          className: "custom-tooltip",
          opacity: 0.9,
        });

        const logo = vendor.brand_logo_1
          ? `<img src="${vendor.brand_logo_1}" alt="${vendor.name}" style="width:100%;border-radius:12px;margin-bottom:10px;" />`
          : "";

        const email = vendor.email
          ? `<div style="font-size:14px;color:#6b7280;margin-top:6px;">
              <i class="fas fa-envelope"></i> ${vendor.email}
             </div>`
          : "";

        marker.bindPopup(
          `
          <div class="custom-popup">
            ${logo}
            <div class="popup-header">
              <h3>${vendor.name}</h3>
              <div class="category-badge" style="background:${currentCategory.color}">
                <i class="${currentCategory.icon}"></i> ${currentCategory.name}
              </div>
            </div>
            <div class="popup-content">
              ${email}
              <button class="view-products-btn" data-vendor-id="${vendor.id}">
                <i class="fas fa-eye"></i> View Products
              </button>
            </div>
          </div>
        `,
          { maxWidth: 300, className: "modern-popup" }
        );

        marker.on("popupopen", () => {
          const button = document.querySelector(
            `.view-products-btn[data-vendor-id="${vendor.id}"]`
          );
          if (button)
            button.onclick = () =>
              navigate(
                `/consumer/shops/${vendor.id}/products/${currentCategory.name}`
              );
        });
      });

      // Adjust map bounds if vendors found
      if (vendorsToDisplay.length === 1) {
        map.setView(vendorsToDisplay[0].position, 13);
      } else if (vendorsToDisplay.length > 1) {
        const bounds = L.latLngBounds(vendorsToDisplay.map((v) => v.position));
        map.fitBounds(bounds, { padding: [100, 100], maxZoom: 13 });
      }

      map.invalidateSize({ animate: true });
    }
  }, [blogs, map, showOverlay, currentCategoryIndex]);

  const currentCategory = categories[currentCategoryIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative">
      {/* Logo / Home Button */}
      <div className="absolute top-6 left-6 z-[9999]">
        <Link
          to="/"
          className="group hover:scale-105 transform transition-transform duration-300"
        >
          <img
            src={locartoImg}
            alt="Locarto"
            className="h-12 w-auto md:h-14 lg:h-16"
          />
        </Link>
      </div>

      {/* Map Container */}
      <div className="h-screen relative">
        <div id="map-container" className="w-full h-full"></div>

        {/* Back Button */}
        {!showOverlay && (
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-[9999]">
            <button
              onClick={() => setShowOverlay(true)}
              className="group bg-black/40 backdrop-blur-lg hover:bg-black/60 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <i className="fas fa-th-large group-hover:rotate-180 transition-transform duration-300"></i>
              Back to Categories
            </button>
          </div>
        )}

        {/* Category Overlay */}
        {showOverlay && (
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20 backdrop-blur-sm flex items-center justify-center z-[9999]">
            <div className="relative w-full max-w-6xl mx-auto text-center px-6">
              {/* Category navigation buttons */}
              <button
                onClick={prevCategory}
                className="absolute left-12 top-1/2 -translate-y-1/2 text-white/70 hover:text-white hover:scale-110 transition-all duration-300 bg-white/10 backdrop-blur-lg rounded-full w-14 h-14 flex items-center justify-center border border-white/20 z-10"
              >
                <i className="fas fa-chevron-left text-xl"></i>
              </button>

              <button
                onClick={nextCategory}
                className="absolute right-12 top-1/2 -translate-y-1/2 text-white/70 hover:text-white hover:scale-110 transition-all duration-300 bg-white/10 backdrop-blur-lg rounded-full w-14 h-14 flex items-center justify-center border border-white/20 z-10"
              >
                <i className="fas fa-chevron-right text-xl"></i>
              </button>

              <div className="relative w-full">
                <div className="flex flex-col items-center mb-6">
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center shadow-2xl mb-6"
                    style={{
                      background: `linear-gradient(135deg, ${currentCategory.color}, ${currentCategory.color}cc)`,
                    }}
                  >
                    <i
                      className={`${currentCategory.icon} text-3xl text-white`}
                    ></i>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() =>
                      handleCategoryTextClick(currentCategoryIndex)
                    }
                    className="text-6xl md:text-8xl font-bold mb-6 cursor-pointer hover:scale-105 transition-all duration-500 bg-transparent border-none inline-block text-center mx-auto"
                    style={{
                      color: currentCategory.color,
                      textShadow: `0 4px 20px ${currentCategory.color}40, 0 0 40px ${currentCategory.color}20`,
                      maxWidth: "fit-content",
                    }}
                  >
                    {currentCategory.name}
                  </button>
                </div>
                <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed text-center">
                  {currentCategory.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .custom-tooltip {
          background: rgba(0, 0, 0, 0.9) !important;
          border-radius: 8px !important;
          color: white !important;
          font-weight: 600 !important;
          padding: 8px 12px !important;
        }
      `}</style>
    </div>
  );
};

export default MapView;
