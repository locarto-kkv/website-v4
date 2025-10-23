import React, { useState, useEffect, useRef } from "react";
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

  const { blogs, fetchProductsInBatch } = useData();

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

  const nextCategory = () =>
    setCurrentCategoryIndex((prev) => (prev + 1) % categories.length);

  const prevCategory = () =>
    setCurrentCategoryIndex(
      (prev) => (prev - 1 + categories.length) % categories.length
    );

  const handleSelectCategory = (index) => {
    setCurrentCategoryIndex(index);
    setShowOverlay(false);
    const categoryName = categories[index].name.toLowerCase();
    navigate(`/map?category=${encodeURIComponent(categoryName)}`);
  };

  const handleBackToCategories = () => {
    setShowOverlay(true);
    navigate("/map");
  };

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

  useEffect(() => {
    // Prevent map re-initialization
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

    L.control.zoom({ position: "bottomright" }).addTo(mapInstance);
    markerLayer.current.addTo(mapInstance);

    setMap(mapInstance);

    // Cleanup function to run when component unmounts
    return () => {
      mapInstance.remove();
      setMap(null);
    };
  }, []); // Empty dependency array ensures this runs only once

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      if (showOverlay) return;
      const category = categories[currentCategoryIndex].name;
      try {
        await fetchProductsInBatch({ category });
      } catch (err) {
        console.error("Error fetching products for category:", err);
      }
    };

    fetchCategoryProducts();
  }, [currentCategoryIndex, showOverlay]);

  useEffect(() => {
    if (!map) return;

    markerLayer.current.clearLayers();

    if (!showOverlay) {
      const currentCategory = categories[currentCategoryIndex];
      const customIcon = createCustomIcon(currentCategory);

      const vendorsToDisplay = (blogs || []).filter((vendor) => {
        const hasValidPosition =
          Array.isArray(vendor.position) && vendor.position.length === 2;
        const hasProducts =
          vendor.products &&
          Array.isArray(vendor.products) &&
          vendor.products.length > 0;
        return hasValidPosition && hasProducts;
      });

      vendorsToDisplay.forEach((vendor) => {
        const marker = L.marker(vendor.position, { icon: customIcon });

        marker.bindTooltip(vendor.name || "Unnamed Vendor", {
          permanent: false,
          direction: "top",
          offset: [0, -38],
          className: "custom-tooltip",
          opacity: 0.9,
        });

        const logo = vendor.brand_logo_1
          ? `<img src="${vendor.brand_logo_1}" alt="${vendor.name}" style="width:100%; border-radius:8px; margin-bottom:10px;" />`
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
              <h3 style="font-size: 16px; font-weight: bold; margin: 0;">${vendor.name}</h3>
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
          if (button)
            button.onclick = () =>
              navigate(
                `/consumer/shops/${vendor.id}/products/${currentCategory.name}`
              );
        });

        markerLayer.current.addLayer(marker);
      });

      if (vendorsToDisplay.length > 0) {
        if (vendorsToDisplay.length === 1) {
          map.setView(vendorsToDisplay[0].position, 13);
        } else {
          const bounds = L.latLngBounds(
            vendorsToDisplay.map((v) => v.position)
          );
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
        }
      }

      map.invalidateSize({ animate: true });
    }
  }, [blogs, showOverlay, currentCategoryIndex]);

  const currentCategory = categories[currentCategoryIndex];

  return (
    <div className="min-h-screen bg-gray-900 relative">
      <div className="absolute top-4 left-4 z-[9999]">
        <Link to="/" className="group">
          <img
            src={locartoImg}
            alt="Locarto"
            className="h-12 sm:h-14 w-auto object-contain"
          />
        </Link>
      </div>

      <div className="h-screen relative">
        <div id="map-container" className="w-full h-full bg-gray-800"></div>

        {/* --- IMPROVED RESPONSIVE CONTROLS --- */}
        {!showOverlay && (
          <>
            {/* Desktop: Top Center Button */}
            <div className="hidden lg:block absolute top-6 left-1/2 transform -translate-x-1/2 z-[9999]">
              <button
                onClick={handleBackToCategories}
                className="group bg-black/40 backdrop-blur-lg hover:bg-black/60 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl flex items-center gap-2 text-sm"
              >
                <i className="fas fa-th-large group-hover:rotate-180 transition-transform duration-300"></i>
                Back to Categories
              </button>
            </div>

            {/* Mobile: Bottom Floating Bar */}
            <div className="lg:hidden absolute bottom-5 left-4 right-4 z-[9999] bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-3 flex items-center justify-between gap-3 animate-slide-up">
              <div className="flex items-center gap-3 min-w-0">
                {" "}
                {/* Added min-w-0 */}
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: currentCategory.color }}
                >
                  <i
                    className={`${currentCategory.icon} text-white text-lg`}
                  ></i>
                </div>
                <div className="min-w-0">
                  {" "}
                  {/* Added min-w-0 */}
                  <p className="text-xs text-gray-400">Showing</p>
                  <p className="font-bold text-white truncate">
                    {currentCategory.name}
                  </p>{" "}
                  {/* Added truncate */}
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

        <div
          className={`
            fixed z-[9998] transition-all duration-500 ease-in-out
            
            ${showOverlay ? "opacity-100" : "opacity-0 pointer-events-none"}
            
            ${
              showOverlay ? "bottom-0" : "-bottom-full"
            } lg:bottom-0 lg:left-0 lg:right-0 lg:top-0 lg:flex lg:items-center lg:justify-center lg:bg-black/30 lg:backdrop-blur-sm
          `}
        >
          {/* Mobile Card */}
          <div className="lg:hidden bg-gray-900/80 backdrop-blur-xl border-t border-white/10 p-5 rounded-t-2xl">
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
                <i
                  className={`${currentCategory.icon} text-2xl text-white`}
                ></i>
              </div>
              <button
                onClick={nextCategory}
                className="text-white/70 hover:text-white transition-colors w-10 h-10 flex items-center justify-center bg-white/10 rounded-full border border-white/20"
                aria-label="Next Category"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>

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

          {/* Desktop Overlay */}
          <div className="hidden lg:flex items-center justify-center relative w-full max-w-6xl mx-auto text-center px-6">
            <button
              onClick={prevCategory}
              className="absolute left-0 top-1/2 -translate-y-1/2 text-white/70 hover:text-white hover:scale-110 transition-all bg-white/10 backdrop-blur-lg rounded-full w-14 h-14 flex items-center justify-center border border-white/20 z-10"
              aria-label="Previous Category"
            >
              <i className="fas fa-chevron-left text-xl"></i>
            </button>
            <button
              onClick={nextCategory}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-white/70 hover:text-white hover:scale-110 transition-all bg-white/10 backdrop-blur-lg rounded-full w-14 h-14 flex items-center justify-center border border-white/20 z-10"
              aria-label="Next Category"
            >
              <i className="fas fa-chevron-right text-xl"></i>
            </button>

            <div className="relative">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center shadow-2xl mb-6 mx-auto"
                style={{
                  background: `linear-gradient(135deg, ${currentCategory.color}, ${currentCategory.color}cc)`,
                }}
              >
                <i
                  className={`${currentCategory.icon} text-3xl text-white`}
                ></i>
              </div>
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
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                {currentCategory.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Keep all existing CSS styles for popups and tooltips */
        .leaflet-popup-content-wrapper { border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.2); background: #ffffff; }
        .leaflet-popup-content { margin: 0 !important; padding: 0 !important; width: 100% !important; }
        .leaflet-popup-tip { background: #ffffff; }
        .custom-tooltip { background: rgba(17, 24, 39, 0.9) !important; border: 1px solid rgba(255, 255, 255, 0.2) !important; border-radius: 8px !important; color: white !important; font-weight: 600 !important; padding: 6px 12px !important; font-size: 12px !important; box-shadow: 0 4px 15px rgba(0,0,0,0.3) !important; }
        .custom-popup { padding: 12px; }
        .popup-header { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 10px; }
        .category-badge { border-radius: 9999px; color: white; font-weight: 600; display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
        .popup-content { padding-top: 10px; border-top: 1px solid #f3f4f6; }
        .view-products-btn { width: 100%; background: linear-gradient(135deg, #f97316, #ef4444); color: white; border: none; border-radius: 8px; padding: 10px; font-weight: bold; font-size: 14px; margin-top: 12px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .view-products-btn:hover { transform: scale(1.03); box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3); }

        @keyframes slide-up {
            from {
                transform: translateY(120%);
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
