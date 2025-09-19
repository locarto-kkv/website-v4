// src/components/MapView.jsx
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
    { name: "Wellness", description: "Yoga studios, fitness centers, and wellness retreats" },
    { name: "Lifestyle", description: "Fashion stores, home decor, and lifestyle products" },
    { name: "Accessories", description: "Jewelry, watches, and fashion accessories" }
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

  const [selectedMarker, setSelectedMarker] = useState(null);
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

  // Debug overlay state
  useEffect(() => {
    console.log("Overlay visible:", showOverlay);
  }, [showOverlay]);

  // Business data
  const businessData = {
    wellness: [
      {
        id: 1,
        name: "Yoga Studio",
        location: "Mumbai, Maharashtra",
        position: [19.076, 72.8777],
        products: [
          {
            id: 1,
            name: "Yoga Classes",
            weight: "30 mins",
            available: "Available now",
            image: "https://via.placeholder.com/300x300/FF6B00/FFFFFF?text=Yoga"
          }
        ]
      }
    ],
    lifestyle: [
      {
        id: 1,
        name: "Fashion Store",
        location: "Andheri, Mumbai",
        position: [19.1136, 72.8697],
        products: [
          {
            id: 1,
            name: "Casual Wear",
            weight: "Various sizes",
            available: "Available now",
            image: "https://via.placeholder.com/300x300/FF6B00/FFFFFF?text=Fashion"
          }
        ]
      },
      {
        id: 2,
        name: "Home Decor",
        location: "Bandra, Mumbai",
        position: [19.05, 72.8333],
        products: [
          {
            id: 1,
            name: "Decor Items",
            weight: "Various sizes",
            available: "Available now",
            image: "https://via.placeholder.com/300x300/FF6B00/FFFFFF?text=Decor"
          }
        ]
      }
    ],
    accessories: [
      {
        id: 1,
        name: "Jewelry Store",
        location: "Colaba, Mumbai",
        position: [18.922, 72.834],
        products: [
          {
            id: 1,
            name: "Gold Jewelry",
            weight: "Various weights",
            available: "Available now",
            image: "https://via.placeholder.com/300x300/FF6B00/FFFFFF?text=Jewelry"
          }
        ]
      }
    ]
  };

  // Initialize map
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });

    const mapInstance = L.map("map-container").setView([19.076, 72.8777], 12);

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
        minZoom: 2,
        opacity: 1,
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
      const currentCategory = categories[currentCategoryIndex].name.toLowerCase();
      const markersData = businessData[currentCategory] || [];

      markersData.forEach((marker) => {
        const mapMarker = L.marker(marker.position).addTo(map);

        mapMarker.bindPopup(`
          <div>
            <h3><strong>${marker.name}</strong></h3>
            <p>${marker.location}</p>
          </div>
        `);

        mapMarker.on("click", () => {
          setSelectedMarker(marker);
        });
      });
    }
  }, [currentCategoryIndex, map, showOverlay]);

  return (
    <div className="min-h-screen bg-black relative !transition-none">
      {/* Back Arrow */}
      <div className="absolute top-4 right-4 z-[9999]">
        <Link
          to="/"
          className="bg-white/20 hover:bg-white/30 text-white rounded-full w-10 h-10 flex items-center justify-center transition"
        >
          <i className="fas fa-arrow-left text-xl"></i>
        </Link>
      </div>

      {/* Map */}
      <div className="h-screen pt-0 pb-0 relative">
        <div id="map-container" className="w-full h-full"></div>

        {/* Back to Categories */}
        {!showOverlay && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[9999]">
            <button
              onClick={() => setShowOverlay(true)}
              className="bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-full font-medium transition"
            >
              Back to Categories
            </button>
          </div>
        )}

        {/* Category Overlay */}
        {showOverlay && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-[9999]">
            <div className="relative w-full max-w-6xl mx-auto text-center">
              <button
                onClick={prevCategory}
                className="absolute left-4 text-white hover:text-orange-500 transition z-[9999]"
              >
                <i className="fas fa-chevron-left text-2xl"></i>
              </button>

              <button
                onClick={nextCategory}
                className="absolute right-4 text-white hover:text-orange-500 transition z-[9999]"
              >
                <i className="fas fa-chevron-right text-2xl"></i>
              </button>

              <div className="relative w-full">
                <button
                  onClick={() => handleCategoryTextClick(currentCategoryIndex)}
                  className="text-5xl md:text-7xl font-bold mb-4 cursor-pointer text-white hover:text-orange-500 transition bg-transparent border-none"
                >
                  {categories[currentCategoryIndex].name}
                </button>
                <p className="text-xl md:text-2xl text-gray-200 mb-8">
                  {categories[currentCategoryIndex].description}
                </p>
                <p className="text-lg text-gray-300">
                  Click on the category name above to view on map
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Product Card */}
        {selectedMarker && (
          <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-[9999] bg-white rounded-lg shadow-2xl max-w-xs border-2 border-blue-200">
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{selectedMarker.name}</h3>
                  <p className="text-gray-600 text-sm">{selectedMarker.location}</p>
                </div>
                <button
                  onClick={() => setSelectedMarker(null)}
                  className="text-gray-500 hover:text-gray-700 bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center"
                >
                  <i className="fas fa-times text-xs"></i>
                </button>
              </div>

              <div className="mt-4">
                <img
                  src={selectedMarker.products[0].image}
                  alt={selectedMarker.products[0].name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>

              <div className="mt-4">
                <h4 className="font-semibold text-gray-800 text-lg">
                  {selectedMarker.products[0].name}
                </h4>
                <p className="text-lg font-medium mt-1 text-gray-700">
                  {selectedMarker.products[0].weight}
                </p>

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {selectedMarker.products[0].available}
                  </span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700 transition-colors">
                    Know more
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;
