import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import locartoImg from "../assets/locarto.png";
import { useDataStore } from "../store/useDataStore";
import { useAuthStore } from "../store/useAuthStore";

const categories = [
  {
    name: "Personal Care",
    color: "#10B981",
    icon: "fas fa-leaf",
    description:
      "Discover unique Skin Care, Beauty, and Fragrance brands near you.",
  },
  {
    name: "Accessories",
    color: "#EF4444",
    icon: "fas fa-gem",
    description:
      "Explore local creators of Fashion, Daily, and Tech accessories.",
  },
];

const MapView = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get("category");
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.currentUser);
  const blogs = useDataStore((s) => s.blogs);
  const fetchProductsInBatch = useDataStore((s) => s.fetchProductsInBatch);
  const productLoading = useDataStore((s) => s.productLoading);
  const dataLoading = useDataStore((s) => s.dataLoading);

  const [showOverlay, setShowOverlay] = useState(true);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(() => {
    if (categoryParam) {
      const idx = categories.findIndex(
        (c) => c.name.toLowerCase() === categoryParam.toLowerCase()
      );
      if (idx !== -1) {
        setShowOverlay(false);
        return idx;
      }
    }
    return 0;
  });

  const [map, setMap] = useState(null);
  const markerLayer = useRef(L.layerGroup());

  // Navigation functions
  const nextCategory = () =>
    setCurrentCategoryIndex((prev) => (prev + 1) % categories.length);

  const prevCategory = () =>
    setCurrentCategoryIndex(
      (prev) => (prev - 1 + categories.length) % categories.length
    );

  // Select category and update URL
  const handleSelectCategory = (index) => {
    setCurrentCategoryIndex(index);
    setShowOverlay(false);
    const categoryName = categories[index].name.toLowerCase();
    navigate(`/map?category=${encodeURIComponent(categoryName)}`);
  };

  // Go back to category selection view
  const handleBackToCategories = () => {
    setShowOverlay(true);
    navigate("/map");
  };

  // Function to create custom Leaflet marker icons
  const createCustomIcon = (category) =>
    L.divIcon({
      className: "custom-marker",
      html: `
        <div style="
          background: linear-gradient(135deg, ${category.color}, ${category.color}dd);
          width: 36px;
          height: 36px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 2px solid white;
          box-shadow: 0 6px 15px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <i class="${category.icon}" style="transform: rotate(45deg); color: white; font-size: 14px;"></i>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -38],
    });

  // Initialize map effect (runs only once)
  useEffect(() => {
    if (map) return;

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
        minZoom: 3,
      }
    ).addTo(mapInstance);

    markerLayer.current.addTo(mapInstance);
    setMap(mapInstance);

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
      setMap(null);
    };
  }, []);

  // Effect to fetch products when category changes or overlay is hidden
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      if (!showOverlay && (blogs.length > 0 || !dataLoading)) {
        const category = categories[currentCategoryIndex].name;
        try {
          await fetchProductsInBatch({ category });
        } catch (err) {
          console.error("Error fetching products for category:", err);
        }
      }
    };

    fetchCategoryProducts();
  }, [showOverlay, currentCategoryIndex, blogs, dataLoading, fetchProductsInBatch]);

  // Effect to update map markers when category changes or overlay state changes
  useEffect(() => {
    if (!map) return;

    markerLayer.current.clearLayers();

    if (!showOverlay) {
      const currentCategory = categories[currentCategoryIndex];
      const customIcon = createCustomIcon(currentCategory);

      const vendorsToDisplay = (blogs || []).filter((vendor) => {
        const hasValidPosition =
          vendor.address?.[0]?.coordinates &&
          Array.isArray(vendor.address[0].coordinates) &&
          vendor.address[0].coordinates.length === 2;
        const hasProductsInCategory =
          vendor.products &&
          Array.isArray(vendor.products) &&
          vendor.products.length > 0;
        return hasValidPosition && hasProductsInCategory;
      });

      vendorsToDisplay.forEach((vendor) => {
        const coordinates = vendor.address?.[0]?.coordinates;
        if (!coordinates) return;

        const marker = L.marker(coordinates, { icon: customIcon });

        marker.bindTooltip(vendor.name || "Unnamed Vendor", {
          permanent: false,
          direction: "top",
          offset: [0, -38],
          className: "custom-tooltip",
          opacity: 0.9,
        });

        const logo = vendor.brand_logo_1
          ? `<img src="${vendor.brand_logo_1}" alt="${vendor.name}" style="width:100%; max-height: 100px; object-fit: contain; border-radius:8px; margin-bottom:10px; background: #eee;" />`
          : "";
        const email = vendor.email
          ? `<div style="font-size:12px; color:#6b7280; margin-top:4px; word-break: break-all;">
              <i class="fas fa-envelope" style="margin-right: 5px;"></i> ${vendor.email}
             </div>`
          : "";

        marker.bindPopup(
          `
          <div class="custom-popup">
            ${logo}
            <div class="popup-header">
              <h3 style="font-size: 16px; font-weight: bold; margin: 0; flex-grow: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${vendor.name}</h3>
              <div class="category-badge" style="background:${currentCategory.color}; font-size: 10px; padding: 3px 6px;">
                <i class="${currentCategory.icon}" style="margin-right: 4px;"></i> ${currentCategory.name}
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
          { maxWidth: 240, className: "modern-popup" }
        );

        marker.on("popupopen", () => {
          const button = document.querySelector(
            `.view-products-btn[data-vendor-id="${vendor.id}"]`
          );
          if (button) {
            button.onclick = () => {
              const shopPath = `/shops/${vendor.id}/products/${encodeURIComponent(currentCategory.name)}`;
              navigate(currentUser?.type === "consumer" ? `/consumer${shopPath}` : shopPath);
            };
          }
        });

        markerLayer.current.addLayer(marker);
      });

      if (vendorsToDisplay.length > 0) {
        if (vendorsToDisplay.length === 1) {
          const coordinates = vendorsToDisplay[0].address?.[0]?.coordinates;
          if (coordinates) map.setView(coordinates, 13);
        } else {
          const validCoordinates = vendorsToDisplay
            .map(v => v.address?.[0]?.coordinates)
            .filter(Boolean);
          if (validCoordinates.length > 0) {
            const bounds = L.latLngBounds(validCoordinates);
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
          }
        }
      } else {
        map.setView([19.076, 72.8777], 12);
      }

      map.invalidateSize({ animate: true });
    } else {
      map.setView([19.076, 72.8777], 12);
    }
  }, [showOverlay, currentCategoryIndex, blogs, map, navigate, currentUser]);

  const currentCategory = categories[currentCategoryIndex];

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Logo */}
      <div className="absolute top-4 left-4 z-[9999]">
        <Link to="/" className="group">
          <img
            src={locartoImg}
            alt="Locarto"
            className="h-12 sm:h-14 w-auto object-contain"
          />
        </Link>
      </div>

      {/* Map and UI container */}
      <div className="h-screen relative">
        {/* Leaflet Map container */}
        <div id="map-container" className="w-full h-full bg-gray-800"></div>

        {/* UI CONTROLS */}
        {!showOverlay && (
          <>
            {/* Desktop: Top Center "Back to Categories" Button */}
            <div className="hidden lg:block absolute top-6 left-1/2 transform -translate-x-1/2 z-[9999]">
              <button
                onClick={handleBackToCategories}
                className="group bg-black/40 backdrop-blur-lg hover:bg-black/60 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl flex items-center gap-2 text-sm"
              >
                <i className="fas fa-th-large group-hover:rotate-180 transition-transform duration-300"></i>
                Back to Categories
              </button>
            </div>

            {/* Mobile: Bottom Floating Bar showing current category */}
            <div className="lg:hidden absolute bottom-5 left-4 right-4 z-[9999] bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-3 flex items-center justify-between gap-3 animate-slide-up">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: currentCategory.color }}
                >
                  <i className={`${currentCategory.icon} text-white text-lg`}></i>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">Showing</p>
                  <p className="font-bold text-white truncate">{currentCategory.name}</p>
                </div>
              </div>
              <button
                onClick={handleBackToCategories}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-4 py-2 rounded-lg border border-white/20 transition-colors flex-shrink-0"
              >
                Change
              </button>
            </div>
          </>
        )}

        {/* CATEGORY SELECTION OVERLAYS */}

        {/* Mobile Overlay Container */}
        <div
          className={`
            fixed bottom-0 left-0 right-0 z-[9998] lg:hidden
            transition-all duration-500 ease-in-out
            pb-safe
            ${showOverlay ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full pointer-events-none"}
          `}
          style={{ 
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            maxHeight: '70vh'
          }}
        >
          {/* Mobile Card Content */}
          <div className="bg-gray-900/95 backdrop-blur-xl border-t border-white/10 p-5 rounded-t-2xl shadow-2xl overflow-y-auto max-h-[70vh]">
            {/* Prev/Next Buttons and Icon */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={prevCategory}
                className="text-white/70 hover:text-white transition-colors w-10 h-10 flex items-center justify-center bg-white/10 rounded-full border border-white/20"
                aria-label="Previous Category"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${currentCategory.color}, ${currentCategory.color}cc)`,
                }}
              >
                <i className={`${currentCategory.icon} text-2xl text-white`}></i>
              </div>
              <button
                onClick={nextCategory}
                className="text-white/70 hover:text-white transition-colors w-10 h-10 flex items-center justify-center bg-white/10 rounded-full border border-white/20"
                aria-label="Next Category"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
            {/* Category Name, Description, Explore Button */}
            <div className="text-center">
              <h2
                className="text-3xl font-bold mb-2"
                style={{ color: currentCategory.color }}
              >
                {currentCategory.name}
              </h2>
              <p className="text-gray-300 text-sm mb-5 max-w-xs mx-auto">
                {currentCategory.description}
              </p>
              <button
                onClick={() => handleSelectCategory(currentCategoryIndex)}
                className="w-full bg-white/90 text-gray-900 font-bold py-3 px-6 rounded-xl shadow-lg hover:bg-white transition-colors"
              >
                Explore
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Overlay Container */}
        <div
          className={`
            fixed inset-0 z-[9998] hidden lg:flex items-center justify-center
            bg-black/30 backdrop-blur-sm
            transition-opacity duration-500 ease-in-out
            ${showOverlay ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
        >
          {/* Desktop Overlay Content */}
          <div className="relative w-full max-w-6xl mx-auto text-center px-6">
            {/* Prev Button */}
            <button
              onClick={prevCategory}
              className="absolute left-0 top-1/2 -translate-y-1/2 text-white/70 hover:text-white hover:scale-110 transition-all bg-white/10 backdrop-blur-lg rounded-full w-14 h-14 flex items-center justify-center border border-white/20 z-10"
              aria-label="Previous Category"
            >
              <i className="fas fa-chevron-left text-xl"></i>
            </button>
            {/* Next Button */}
            <button
              onClick={nextCategory}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-white/70 hover:text-white hover:scale-110 transition-all bg-white/10 backdrop-blur-lg rounded-full w-14 h-14 flex items-center justify-center border border-white/20 z-10"
              aria-label="Next Category"
            >
              <i className="fas fa-chevron-right text-xl"></i>
            </button>
            {/* Category Icon, Name, Description */}
            <div className="relative">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center shadow-2xl mb-6 mx-auto"
                style={{
                  background: `linear-gradient(135deg, ${currentCategory.color}, ${currentCategory.color}cc)`,
                }}
              >
                <i className={`${currentCategory.icon} text-3xl text-white`}></i>
              </div>
              {/* Category Name (Clickable) */}
              <button
                onClick={() => handleSelectCategory(currentCategoryIndex)}
                className="text-7xl font-bold mb-6 cursor-pointer hover:scale-105 transition-all duration-300 bg-transparent border-none"
                style={{
                  color: currentCategory.color,
                  textShadow: `0 4px 20px ${currentCategory.color}40, 0 0 40px ${currentCategory.color}20`,
                }}
              >
                {currentCategory.name}
              </button>
              {/* Description */}
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                {currentCategory.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* STYLES */}
      <style>{`
        /* Support for safe area insets */
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }

        /* Tooltip Style */
        .custom-tooltip {
          background: rgba(17, 24, 39, 0.9) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: 8px !important;
          color: white !important;
          font-weight: 600 !important;
          padding: 6px 12px !important;
          font-size: 12px !important;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3) !important;
        }

        /* Popup Styles */
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.2);
          background: #ffffff;
        }
        .leaflet-popup-content {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
        }
        .leaflet-popup-tip {
          background: #ffffff;
        }

        /* Custom Popup Content Styles */
        .custom-popup { padding: 12px; }
        .popup-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 10px;
        }
        .category-badge {
          border-radius: 9999px;
          color: white;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
          flex-shrink: 0;
        }
        .popup-content {
          padding-top: 10px;
          border-top: 1px solid #f3f4f6;
        }
        .view-products-btn {
          width: 100%;
          background: linear-gradient(135deg, #f97316, #ef4444);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 10px;
          font-weight: bold;
          font-size: 14px;
          margin-top: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .view-products-btn:hover {
          transform: scale(1.03);
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
        }

        /* Animation for Mobile Bottom Bar */
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
    </div>
  );
};

export default MapView;