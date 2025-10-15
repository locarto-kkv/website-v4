import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const VendorLocationSetup = () => {
  const navigate = useNavigate();
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [coords, setCoords] = useState({ lat: "", lng: "" });
  const [category, setCategory] = useState("");

  // Effect to initialize the map instance. Runs only once on mount.
  useEffect(() => {
    const mapInstance = L.map("map-container").setView([19.076, 72.8777], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstance);
    setMap(mapInstance);

    // Cleanup function to remove the map instance when the component unmounts
    return () => {
      mapInstance.remove();
    };
  }, []); // Empty dependency array ensures this runs only once.

  // Effect to handle map clicks. Runs whenever the 'map' object is ready.
  useEffect(() => {
    if (!map) return;

    const handleClick = (e) => {
      const { lat, lng } = e.latlng;
      setCoords({ lat: lat.toFixed(6), lng: lng.toFixed(6) });

      setMarker((prevMarker) => {
        // If a marker already exists, update its position
        if (prevMarker) {
          prevMarker.setLatLng(e.latlng);
          return prevMarker;
        }
        // Otherwise, create a new marker and add it to the map
        return L.marker(e.latlng).addTo(map);
      });
    };

    map.on("click", handleClick);

    // Cleanup: remove the event listener when the component unmounts or map changes
    return () => {
      map.off("click", handleClick);
    };
  }, [map]);

  const handleSetLocation = () => {
    const { lat, lng } = coords;
    if (lat && lng && map) {
      const newLatLng = [parseFloat(lat), parseFloat(lng)];
      map.setView(newLatLng, 15);
      
      setMarker((prevMarker) => {
        if (prevMarker) {
          prevMarker.setLatLng(newLatLng);
          return prevMarker;
        }
        return L.marker(newLatLng).addTo(map);
      });
    }
  };

  const handleRemovePin = () => {
    if (marker && map) {
      map.removeLayer(marker);
      setMarker(null);
      setCoords({ lat: "", lng: "" });
      setCategory(""); // Also clear the category selection
    }
  };

  const handleSave = () => {
    if (coords.lat && coords.lng && category) {
      const newShop = {
        id: `new-shop-${Date.now()}`,
        name: "My New Shop",
        location: "Custom Location",
        position: [parseFloat(coords.lat), parseFloat(coords.lng)],
        address: "User-defined address",
        category: category,
      };

      const existingShops = JSON.parse(localStorage.getItem("newShops")) || [];
      localStorage.setItem(
        "newShops",
        JSON.stringify([...existingShops, newShop])
      );

      alert("Shop location saved!");
      navigate("/map");
    } else {
      alert("Please set a location and choose a category.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Set Your Shop Location
          </h1>
          <p className="text-gray-600">
            Configure your business location to help customers find you
          </p>
        </div>

        {/* Instructions Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <svg 
                className="w-6 h-6 text-blue-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Location Setup Instructions
              </h3>
              <p className="text-blue-800 leading-relaxed">
                To establish your shop location, click anywhere on the interactive map to place a location pin, or manually enter the geographic coordinates in the latitude and longitude fields provided. After positioning your pin, select your business category from the dropdown menu and click "Save Shop & Continue" to proceed. If you need to adjust your selection, use the "Remove Pin" button to clear both the map marker and coordinate values, allowing you to start fresh.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            {/* Control Panel */}
            <div className="lg:col-span-1 p-6 bg-gray-50 border-r border-gray-200">
              <div className="space-y-6">
                {/* Coordinates Section */}
                <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <svg 
                      className="w-5 h-5 text-orange-500" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                      />
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                      />
                    </svg>
                    Coordinates
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Latitude
                      </label>
                      <input
                        type="text"
                        value={coords.lat}
                        onChange={(e) => setCoords({ ...coords, lat: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="e.g., 19.076000"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Longitude
                      </label>
                      <input
                        type="text"
                        value={coords.lng}
                        onChange={(e) => setCoords({ ...coords, lng: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="e.g., 72.877700"
                      />
                    </div>
                    
                    <button
                      onClick={handleSetLocation}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                    >
                      <svg 
                        className="w-4 h-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
                        />
                      </svg>
                      Set Location from Coordinates
                    </button>
                  </div>
                </div>

                {/* Remove Pin Button */}
                {marker && (
                  <button
                    onClick={handleRemovePin}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                  >
                    <svg 
                      className="w-4 h-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                      />
                    </svg>
                    Remove Pin
                  </button>
                )}

                {/* Category Section */}
                <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Shop Category
                  </h3>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white"
                  >
                    <option value="">Select Category</option>
                    <option value="Wellness">Wellness</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSave}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-lg transition-all duration-200 font-bold text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Save Shop & Continue
                </button>

                {/* Status Indicator */}
                {marker && coords.lat && coords.lng && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 text-sm font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Location pin active
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Map Container */}
            <div className="lg:col-span-2 h-96 lg:h-[700px] relative">
              <div
                id="map-container"
                className="w-full h-full"
              ></div>
              <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md border border-gray-200 z-[1000]">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Click on map</span> to place pin
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorLocationSetup;