// src/components/MapView.jsx
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

const MapView = () => {
  const [selectedCategory, setSelectedCategory] = useState("bakery");
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [markers, setMarkers] = useState([]);

  const mapRef = useRef(null);

  // Real business data with Mumbai coordinates
  const businessData = {
    bakery: [
      {
        id: 1,
        name: "Yazdhani Bakery",
        location: "Mumbai, Maharashtra",
        position: [19.076, 72.8777],
        products: [
          {
            id: 1,
            name: "Fresh Bread",
            weight: "500g",
            available: "Available now",
            image:
              "https://via.placeholder.com/300x300/FF6B00/FFFFFF?text=Yazdhani",
          },
        ],
      },
    ],
    restaurant: [
      {
        id: 1,
        name: "Subko",
        location: "Andheri, Mumbai",
        position: [19.1136, 72.8697],
        products: [
          {
            id: 1,
            name: "Biryani",
            weight: "500g",
            available: "Available now",
            image:
              "https://via.placeholder.com/300x300/FF6B00/FFFFFF?text=Subko",
          },
        ],
      },
      {
        id: 2,
        name: "The Nest",
        location: "Bandra, Mumbai",
        position: [19.05, 72.8333],
        products: [
          {
            id: 1,
            name: "Pizza",
            weight: "300g",
            available: "Available now",
            image:
              "https://via.placeholder.com/300x300/FF6B00/FFFFFF?text=Nest",
          },
        ],
      },
    ],
    cafe: [
      {
        id: 1,
        name: "Cafe Coffee Day",
        location: "Colaba, Mumbai",
        position: [18.922, 72.834],
        products: [
          {
            id: 1,
            name: "Coffee",
            weight: "300ml",
            available: "Available now",
            image:
              "https://via.placeholder.com/300x300/FF6B00/FFFFFF?text=Coffee",
          },
        ],
      },
    ],
  };

  const getMarkers = () => {
    return businessData[selectedCategory] || [];
  };

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  const closePopup = () => {
    setSelectedMarker(null);
  };

  // Clear all markers from map
  const clearMarkers = () => {
    if (markers && markers.length > 0) {
      markers.forEach((marker) => {
        if (marker.mapInstance) {
          marker.mapInstance.remove();
        }
      });
      setMarkers([]);
    }
  };

  // Initialize or update map with custom blue style
  const initializeOrUpdateMap = async () => {
    if (typeof window !== "undefined") {
      try {
        // Load Leaflet if not already loaded
        if (!window.L) {
          await import("leaflet");
        }

        const L = window.L;

        // Fix for default marker icons
        if (L.Icon.Default.prototype._getIconUrl) {
          delete L.Icon.Default.prototype._getIconUrl;
        }
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        });

        // Initialize map only if it doesn't exist
        let map = mapInstance;
        if (!map) {
          map = L.map('map-container').setView([19.0760, 72.8777], 12);
          setMapInstance(map);
        }

        // Clear existing tile layer
        if (map.tileLayer) {
          map.tileLayer.remove();
        }

        // Create custom blue map style
        const customBlueStyle = L.tileLayer(
          'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
          {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            maxZoom: 19,
            minZoom: 2,
            opacity: 1,
          }
        ).addTo(map);

        // Store reference to tile layer
        map.tileLayer = customBlueStyle;

        // Add custom CSS for better styling
        const style = document.createElement('style');
        style.textContent = `
          .leaflet-pane {
            z-index: 1;
          }
          
          .leaflet-tile {
            filter: brightness(1.2);
          }
          
          .leaflet-label {
            color: #ffffff !important;
            font-weight: bold;
          }
          
          .leaflet-popup-content-wrapper {
            background-color: rgba(0, 0, 64, 0.9) !important;
            border: 1px solid #ffffff !important;
          }
          
          .leaflet-popup-content {
            color: #ffffff !important;
          }
          
          .leaflet-popup-tip {
            border-bottom-color: #ffffff !important;
          }
        `;
        document.head.appendChild(style);

        // Clear existing markers
        clearMarkers();

        // Add new markers for current category
        const currentMarkers = getMarkers();
        const newMarkers = [];

        currentMarkers.forEach((marker) => {
          const mapMarker = L.marker(marker.position).addTo(map);

          mapMarker.bindPopup(`
          <div style="padding: 10px;">
            <h3 style="font-weight: bold; margin: 0;">${marker.name}</h3>
            <p style="font-size: 12px; margin: 5px 0 0 0;">${marker.location}</p>
            <button onclick="window.handleMarkerClickFromMap(${marker.id}, '${selectedCategory}')"
                    style="margin-top: 8px; background: #FF6B00; color: white; border: none; padding: 5px 10px; border-radius: 15px; cursor: pointer; font-size: 12px;">
              View Products
            </button>
          </div>
        `);

          // Store marker reference
          newMarkers.push({ ...marker, mapInstance: mapMarker });
        });

        setMarkers(newMarkers);

        // Add global function for map popup buttons
        window.handleMarkerClickFromMap = (markerId, category) => {
          const markersList = businessData[category] || [];
          const marker = markersList.find((m) => m.id === markerId);
          if (marker) {
            handleMarkerClick(marker);
          }
        };
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    }
  };

  // Effect for category changes
  useEffect(() => {
    if (mapInstance) {
      initializeOrUpdateMap();
    }
  }, [selectedCategory, mapInstance]);

  // Effect for initial map load
  useEffect(() => {
    const loadMap = async () => {
      await initializeOrUpdateMap();
    };

    loadMap();

    // Cleanup function
    return () => {
      clearMarkers();
      if (mapInstance) {
        if (mapInstance.tileLayer) {
          mapInstance.tileLayer.remove();
        }
        mapInstance.remove();
        setMapInstance(null);
      }
      if (typeof window !== "undefined") {
        delete window.handleMarkerClickFromMap;
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-transparent relative">
      {/* Back Arrow - Top Left */}
      <div className="absolute top-4 right-4 z-50">
        <Link 
          to="/" 
          className="bg-white/20 hover:bg-white/30 text-white rounded-full w-10 h-10 flex items-center justify-center transition"
        >
          <i className="fas fa-arrow-left text-xl"></i>
        </Link>
      </div>

      {/* Map Container */}
      <div className="h-screen pt-0 pb-0 relative">
        <div id="map-container" className="w-full h-full"></div>

        {/* Product Card when marker is clicked - Highest z-index to ensure visibility */}
        {selectedMarker && (
          <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-[9999] bg-white rounded-lg shadow-2xl max-w-xs border-2 border-blue-200">
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">
                    {selectedMarker.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {selectedMarker.location}
                  </p>
                </div>
                <button
                  onClick={closePopup}
                  className="text-gray-500 hover:text-gray-700 bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center"
                >
                  <i className="fas fa-times text-xs"></i>
                </button>
              </div>

              {/* Product Image */}
              <div className="mt-4">
                <img
                  src={selectedMarker.products[0].image}
                  alt={selectedMarker.products[0].name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>

              {/* Product Details */}
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
      
      {/* Category Selector - Top Center */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => setSelectedCategory("bakery")}
            className={`px-6 py-2 rounded-full font-medium transition ${
              selectedCategory === "bakery"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            Bakery
          </button>
          <button
            onClick={() => setSelectedCategory("restaurant")}
            className={`px-6 py-2 rounded-full font-medium transition ${
              selectedCategory === "restaurant"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            Restaurant
          </button>
          <button
            onClick={() => setSelectedCategory("cafe")}
            className={`px-6 py-2 rounded-full font-medium transition ${
              selectedCategory === "cafe"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            Cafe
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapView;
