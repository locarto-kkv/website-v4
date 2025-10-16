import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { VendorProfileService } from "../../../services/vendor/vendorProfileService";

const VendorLocationSetup = () => {
  const navigate = useNavigate();
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [pincode, setPincode] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState("");
  const [coords, setCoords] = useState({ lat: "", lng: "" });
  const [loading, setLoading] = useState(false);
  const [shopName, setShopName] = useState("");

  const { getProfile, updateProfile } = VendorProfileService;

  // Effect to initialize the map instance. Runs only once on mount.
  useEffect(() => {
    const mapInstance = L.map("map-container").setView([19.076, 72.8777], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstance);
    setMap(mapInstance);

    return () => {
      mapInstance.remove();
    };
  }, []);

  // Function to fetch address from coordinates using reverse geocoding
  const fetchAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();

      if (data && data.address) {
        const addr = data.address;
        const addressParts = [
          addr.house_number,
          addr.road,
          addr.suburb || addr.neighbourhood,
          addr.city || addr.town || addr.village,
          addr.state,
        ].filter(Boolean);

        const formattedAddress = addressParts.join(", ");
        setAddress(formattedAddress);
        setPincode(addr.postcode || "");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress("Address not available");
    }
  };

  // Effect to handle map clicks. Runs whenever the 'map' object is ready.
  useEffect(() => {
    if (!map) return;

    const handleClick = async (e) => {
      const { lat, lng } = e.latlng;
      setCoords({ lat: lat.toFixed(6), lng: lng.toFixed(6) });
      setLoading(true);

      setMarker((prevMarker) => {
        if (prevMarker) {
          prevMarker.setLatLng(e.latlng);
          return prevMarker;
        }
        return L.marker(e.latlng).addTo(map);
      });

      await fetchAddress(lat, lng);
      setLoading(false);
    };

    map.on("click", handleClick);

    return () => {
      map.off("click", handleClick);
    };
  }, [map]);

  const handleSetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const newLatLng = [latitude, longitude];

        setCoords({ lat: latitude.toFixed(6), lng: longitude.toFixed(6) });

        if (map) {
          map.setView(newLatLng, 15);

          setMarker((prevMarker) => {
            if (prevMarker) {
              prevMarker.setLatLng(newLatLng);
              return prevMarker;
            }
            return L.marker(newLatLng).addTo(map);
          });
        }

        await fetchAddress(latitude, longitude);
        setLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location");
        setLoading(false);
      }
    );
  };

  const handleSetLocationByPincode = async () => {
    if (!pincode) {
      alert("Please enter a pincode");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&postalcode=${pincode}&country=India`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        const newLatLng = [lat, lng];

        setCoords({ lat: lat.toFixed(6), lng: lng.toFixed(6) });

        if (map) {
          map.setView(newLatLng, 15);

          setMarker((prevMarker) => {
            if (prevMarker) {
              prevMarker.setLatLng(newLatLng);
              return prevMarker;
            }
            return L.marker(newLatLng).addTo(map);
          });
        }

        await fetchAddress(lat, lng);
      } else {
        alert("Pincode not found");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      alert("Error finding location for pincode");
    }
    setLoading(false);
  };

  const handleRemovePin = () => {
    if (marker && map) {
      map.removeLayer(marker);
      setMarker(null);
      setCoords({ lat: "", lng: "" });
      setPincode("");
      setAddress("");
      setCategory("");
      setShopName("");
    }
  };

  const handleSave = () => {
    if (coords.lat && coords.lng && category && address && shopName) {
      const newShop = {
        id: `new-shop-${Date.now()}`,
        name: shopName,
        location: address,
        position: [parseFloat(coords.lat), parseFloat(coords.lng)],
        address: address,
        pincode: pincode,
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
      alert("Please enter shop name, set a location, and choose a category.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Set Your Shop Location
          </h1>
          <p className="text-gray-600">
            Configure your business location to help customers find you
          </p>
        </div>

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
                To establish your shop location, you can either use your current
                location, enter a pincode, or click anywhere on the interactive
                map to place a location pin. The address will be automatically
                fetched and displayed. After positioning your pin, select your
                business category from the dropdown menu and click "Save Shop &
                Continue" to proceed.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            <div className="lg:col-span-1 p-6 bg-gray-50 border-r border-gray-200">
              <div className="space-y-6">
                {/* Shop Name Section */}
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
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    Shop Name
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter your shop name
                    </label>
                    <input
                      type="text"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="e.g., Raj Electronics"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      This name will be displayed on the map
                    </p>
                  </div>
                </div>

                {/* Current Location Button */}
                <button
                  onClick={handleSetCurrentLocation}
                  disabled={loading}
                  className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white py-3 rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                    />
                  </svg>
                  {loading ? "Getting Location..." : "Use Current Location"}
                </button>

                {/* Pincode Section */}
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
                    Pincode
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter Pincode
                      </label>
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="e.g., 400050"
                      />
                    </div>

                    <button
                      onClick={handleSetLocationByPincode}
                      disabled={loading}
                      className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-3 rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
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
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      Find Location by Pincode
                    </button>
                  </div>
                </div>

                {/* Address Display */}
                {address && (
                  <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Address
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {address}
                    </p>
                    {pincode && (
                      <p className="text-gray-600 text-sm mt-2">
                        <span className="font-medium">Pincode:</span> {pincode}
                      </p>
                    )}
                  </div>
                )}

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
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-green-300 disabled:to-green-400 text-white py-4 rounded-lg transition-all duration-200 font-bold text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Save Shop & Continue
                </button>

                {/* Status Indicator */}
                {marker && address && (
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
              <div id="map-container" className="w-full h-full"></div>
              <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-lg shadow-md border border-gray-200 z-[1000]">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Click on map</span> to place
                  pin
                </p>
              </div>
              {loading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-[1001]">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-3 text-gray-600">Loading address...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorLocationSetup;
