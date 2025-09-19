import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapView = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get("category");

  // Available categories
  const categories = [
    { 
      name: "Wellness", 
      description: "Yoga studios, fitness centers, and wellness retreats",
      color: "#10B981", // emerald
      icon: "fas fa-leaf"
    },
    { 
      name: "Lifestyle", 
      description: "Fashion stores, home decor, and lifestyle products",
      color: "#F59E0B", // amber
      icon: "fas fa-shopping-bag"
    },
    { 
      name: "Accessories", 
      description: "Jewellery, watches, and fashion accessories",
      color: "#EF4444", // red
      icon: "fas fa-gem"
    }
  ];

  // Overlay starts visible
  const [showOverlay, setShowOverlay] = useState(true);

  // Track current category
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

  const nextCategory = () => {
    setCurrentCategoryIndex((prev) => (prev + 1) % categories.length);
  };

  const prevCategory = () => {
    setCurrentCategoryIndex((prev) => (prev - 1 + categories.length) % categories.length);
  };

  const handleCategoryTextClick = (index) => {
    setCurrentCategoryIndex(index);
    setShowOverlay(false);
  };

  // Business data
  const businessData = {
    wellness: [
      {
        id: 1,
        name: "Serenity Yoga Studio",
        location: "Bandra West, Mumbai",
        position: [19.076, 72.8777],
        address: "123 Carter Road, Bandra West, Mumbai 400050"
      },
      {
        id: 2,
        name: "Mindful Fitness Center",
        location: "Juhu, Mumbai",
        position: [19.1075, 72.8263],
        address: "456 Juhu Beach Road, Mumbai 400049"
      }
    ],
    lifestyle: [
      {
        id: 1,
        name: "Urban Style Boutique",
        location: "Andheri West, Mumbai",
        position: [19.1136, 72.8697],
        address: "789 Link Road, Andheri West, Mumbai 400053"
      },
      {
        id: 2,
        name: "Casa Living",
        location: "Bandra East, Mumbai",
        position: [19.05, 72.8333],
        address: "321 BKC Road, Bandra East, Mumbai 400051"
      }
    ],
    accessories: [
      {
        id: 1,
        name: "Golden Crown Jewellers",
        location: "Colaba, Mumbai",
        position: [18.922, 72.834],
        address: "654 Colaba Causeway, Mumbai 400001"
      },
      {
        id: 2,
        name: "Timepiece Gallery",
        location: "Fort, Mumbai",
        position: [18.9322, 72.8311],
        address: "987 Horniman Circle, Fort, Mumbai 400001"
      }
    ]
  };

  // Create custom marker icons
  const createCustomIcon = (category) => {
    const color = category.color;
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background: linear-gradient(135deg, ${color}, ${color}dd);
          width: 40px;
          height: 40px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 8px 20px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        ">
          <i class="${category.icon}" style="
            transform: rotate(45deg);
            color: white;
            font-size: 16px;
            text-shadow: 0 1px 3px rgba(0,0,0,0.3);
          "></i>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });
  };

  // Initialize map
  useEffect(() => {
    const mapInstance = L.map("map-container", {
      zoomControl: false
    }).setView([19.076, 72.8777], 12);

    // Custom zoom control
    L.control.zoom({
      position: 'bottomright'
    }).addTo(mapInstance);

    // Dark theme map
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
        minZoom: 10,
      }
    ).addTo(mapInstance);

    setMap(mapInstance);

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, []);

  // Update markers when category changes and overlay is hidden
  useEffect(() => {
    if (!map) return;

    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    if (!showOverlay) {
      const currentCategory = categories[currentCategoryIndex];
      const currentCategoryName = currentCategory.name.toLowerCase();
      const markersData = businessData[currentCategoryName] || [];

      markersData.forEach((marker) => {
        const customIcon = createCustomIcon(currentCategory);
        const mapMarker = L.marker(marker.position, { icon: customIcon }).addTo(map);

        // Permanent tooltip with shop name
        mapMarker.bindTooltip(marker.name, {
          permanent: true,
          direction: 'top',
          offset: [0, -45],
          className: 'custom-tooltip',
          opacity: 0.9
        });

        // Enhanced popup
        mapMarker.bindPopup(`
          <div class="custom-popup">
            <div class="popup-header">
              <h3>${marker.name}</h3>
              <div class="category-badge" style="background: ${currentCategory.color}">
                <i class="${currentCategory.icon}"></i>
                ${currentCategory.name}
              </div>
            </div>
            <div class="popup-content">
              <div class="location-info">
                <i class="fas fa-map-marker-alt"></i>
                <span>${marker.address}</span>
              </div>
              <button class="view-products-btn" onclick="alert('Products page coming soon!')">
                <i class="fas fa-eye"></i>
                View Products
              </button>
            </div>
          </div>
        `, {
          maxWidth: 300,
          className: 'modern-popup'
        });
      });
    }
  }, [currentCategoryIndex, map, showOverlay]);

  const currentCategory = categories[currentCategoryIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative">
      {/* Locarto Logo Home Button */}
      <div className="absolute top-6 left-6 z-[9999]">
        <Link
          to="/"
          className="group text-3xl font-bold text-orange-500 hover:text-orange-400 transition-colors duration-300 hover:scale-105 transform"
          style={{ textShadow: '0 2px 10px rgba(245, 158, 11, 0.3)' }}
        >
          Locarto
        </Link>
      </div>

      {/* Map */}
      <div className="h-screen pt-0 pb-0 relative">
        <div id="map-container" className="w-full h-full rounded-none"></div>

        {/* Enhanced Back to Categories */}
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

        {/* Enhanced Category Overlay */}
        {showOverlay && (
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20 backdrop-blur-sm flex items-center justify-center z-[9999]">
            <div className="relative w-full max-w-6xl mx-auto text-center px-6">
              {/* Navigation Arrows - Moved further to edges */}
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

              {/* Category Display */}
              <div className="relative w-full">
                {/* Icon Container - Centered */}
                <div className="flex flex-col items-center mb-6">
                  <div 
                    className="w-24 h-24 rounded-full flex items-center justify-center shadow-2xl mb-6"
                    style={{
                      background: `linear-gradient(135deg, ${currentCategory.color}, ${currentCategory.color}cc)`
                    }}
                  >
                    <i className={`${currentCategory.icon} text-3xl text-white`}></i>
                  </div>
                </div>
                
                {/* Category Name - Centered with max width */}
                <div className="flex justify-center">
                  <button
                    onClick={() => handleCategoryTextClick(currentCategoryIndex)}
                    className="text-6xl md:text-8xl font-bold mb-6 cursor-pointer hover:scale-105 transition-all duration-500 bg-transparent border-none inline-block text-center mx-auto"
                    style={{
                      color: currentCategory.color,
                      textShadow: `0 4px 20px ${currentCategory.color}40, 0 0 40px ${currentCategory.color}20`,
                      maxWidth: "fit-content"
                    }}
                  >
                    {currentCategory.name}
                  </button>
                </div>
                
                {/* Description - Already centered */}
                <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed text-center">
                  {currentCategory.description}
                </p>
              </div>

              {/* Category Indicators */}
              <div className="flex justify-center gap-3 mt-12">
                {categories.map((category, index) => (
                  <button
                    key={category.name}
                    onClick={() => setCurrentCategoryIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentCategoryIndex 
                        ? 'scale-125 shadow-lg' 
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                    style={{
                      background: index === currentCategoryIndex 
                        ? category.color
                        : undefined
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .custom-tooltip {
          background: rgba(0, 0, 0, 0.9) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: 8px !important;
          color: white !important;
          font-weight: 600 !important;
          padding: 8px 12px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
          backdrop-filter: blur(10px);
        }

        .custom-tooltip::before {
          border-top-color: rgba(0, 0, 0, 0.9) !important;
        }

        .modern-popup .leaflet-popup-content-wrapper {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9)) !important;
          border-radius: 16px !important;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2) !important;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .modern-popup .leaflet-popup-tip {
          background: linear-gradient(45deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9)) !important;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: none !important;
        }

        .custom-popup {
          padding: 4px;
          min-width: 250px;
        }

        .popup-header {
          margin-bottom: 12px;
        }

        .popup-header h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
        }

        .category-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 20px;
          color: white;
          font-size: 12px;
          font-weight: 600;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .popup-content {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .location-info {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          color: #6b7280;
          font-size: 14px;
          line-height: 1.4;
        }

        .location-info i {
          color: #ef4444;
          margin-top: 2px;
          flex-shrink: 0;
        }

        .view-products-btn {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .view-products-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
          background: linear-gradient(135deg, #1d4ed8, #1e40af);
        }

        .custom-marker {
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
        }

        #map-container {
          filter: contrast(1.1) saturate(1.1);
        }
      `}</style>
    </div>
  );
};

export default MapView;