import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useVendorData } from "../../../context/vendor/vendorDataContext";

const VendorLocationSetup = () => {
  const navigate = useNavigate();
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [loading, setLoading] = useState(false);

  const [newAddress, setNewAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    pincode: "",
    state: "",
    country: "",
    coordinates: { lat: "", lng: "" },
  });

  const [setupForm, setSetupForm] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    businessType: "",
    addressLine1: "",
    addressLine2: "",
    pincode: "",
    state: "",
    country: "",
    website: "",
  });

  const { vendor, profile } = useVendorData();

  // ✅ Fetch approximate location from pincode (forward geocoding)
  const fetchLocationByPincode = async (pincode) => {
    if (!pincode) return;
    setLoading(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&postalcode=${pincode}&country=India`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        const latlng = [lat, lng];

        // 🗺️ Center map and add marker
        if (map) {
          map.setView(latlng, 14);

          setMarker((prevMarker) => {
            if (prevMarker) {
              prevMarker.setLatLng(latlng);
              return prevMarker;
            }
            return L.marker(latlng).addTo(map);
          });
        }

        // Optionally reverse-geocode for readable address
        await fetchAddress(lat, lng);
      } else {
        console.warn("No results found for pincode:", pincode);
      }
    } catch (err) {
      console.error("Error fetching location from pincode:", err);
    }

    setLoading(false);
  };

  // ✅ Load existing setupForm from localStorage when component mounts
  useEffect(() => {
    const storedForm = localStorage.getItem("setupform");
    if (storedForm) {
      const parsedForm = JSON.parse(storedForm);
      setSetupForm((prev) => ({ ...parsedForm, ...prev }));
      setNewAddress({
        addressLine1: parsedForm.addressLine1 || "",
        addressLine2: parsedForm.addressLine2 || "",
        pincode: parsedForm.pincode || "",
        state: parsedForm.state || "",
        country: parsedForm.country || "",
      });

      // 📍 After map initializes, center map based on saved pincode
      setTimeout(() => {
        if (parsedForm.pincode) {
          fetchLocationByPincode(parsedForm.pincode);
        }
      }, 1000);
    }
  }, [map]);

  // ✅ Initialize the map instance
  useEffect(() => {
    const mapInstance = L.map("map-container").setView([20.5937, 78.9629], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapInstance);
    setMap(mapInstance);

    return () => {
      mapInstance.remove();
    };
  }, []);

  // ✅ Fetch address from coordinates (reverse geocode)
  const fetchAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();

      if (data && data.address) {
        const addr = data.address;
        console.log(addr);

        const addressLine1Parts = [
          addr.house_number,
          addr.road,
          addr.suburb || addr.neighbourhood,
        ].filter(Boolean);

        const addressLine2Parts = [
          addr.city || addr.town || addr.village,
          addr.state,
        ].filter(Boolean);

        setNewAddress({
          addressLine1: addressLine1Parts.join(", "),
          addressLine2: addressLine2Parts.join(", "),
          pincode: addr.postcode || "",
          state: addr.state || "",
          country: addr.country || "",
          coordinates: { lat, lng },
        });
      } else {
        setNewAddress({
          addressLine1: "Address not available",
          addressLine2: "",
          pincode: "",
          state: "",
          country: "",
          coordinates: { lat: "", lng: "" },
        });
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setNewAddress({
        addressLine1: "Address not available",
        addressLine2: "",
        pincode: "",
        state: "",
        country: "",
        coordinates: { lat: "", lng: "" },
      });
    }
  };

  // ✅ Handle user manually selecting on map
  useEffect(() => {
    if (!map) return;

    const handleClick = async (e) => {
      const { lat, lng } = e.latlng;
      setLoading(true);

      setSetupForm((prev) => ({
        ...prev,
        coordinates: { lat: lat.toFixed(6), lng: lng.toFixed(6) },
      }));

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

  // ✅ Save and confirm address update
  const handleNextStep = () => {
    const confirmation = window.confirm(
      "Do you want to update your previous address with the latest address?"
    );

    if (confirmation) {
      console.log(setupForm);

      const updatedForm = {
        ...setupForm,
        addressLine1: newAddress.addressLine1 || setupForm.addressLine1,
        addressLine2: newAddress.addressLine2 || setupForm.addressLine2,
        pincode: newAddress.pincode || setupForm.pincode,
        state: newAddress.state || setupForm.state,
        country: newAddress.country || setupForm.country,
        coordinates: newAddress.coordinates,
      };

      localStorage.setItem("setupform", JSON.stringify(updatedForm));
      console.log("✅ Updated setup form:", updatedForm);
    } else {
      console.log("❌ Address not updated. Keeping previous setupForm.");
    }

    navigate("/vendor/profile");
  };

  // ✅ Cancel setup (save current setupForm)
  const closeSetup = () => {
    localStorage.setItem("setupform", JSON.stringify(setupForm));
    console.log("Setup form saved on cancel:", setupForm);
    navigate("/vendor/profile");
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 p-6">
      {/* 🌀 Full-screen loading overlay */}
      {loading && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">
            Fetching address...
          </p>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Set Your Shop Location
          </h1>
          <p className="text-gray-600">
            Configure your business location to help customers find you
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="bg-white rounded-xl shadow-md p-6 space-y-6 border border-gray-200">
            <div>
              <label className="block text-gray-700 mb-2">Enter Pincode</label>
              <input
                type="text"
                name="pincode"
                value={newAddress.pincode}
                onChange={(e) => fetchLocationByPincode(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g. 400050"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Current Address
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {newAddress.addressLine1 || "No address loaded"}
                {newAddress.addressLine2 && (
                  <>
                    <br />
                    {newAddress.addressLine2}
                  </>
                )}
              </p>

              {newAddress.pincode && (
                <p className="text-gray-600 text-sm mt-2">
                  <span className="font-medium">Pincode:</span>{" "}
                  {newAddress.pincode}
                </p>
              )}
              {newAddress.state && (
                <p className="text-gray-600 text-sm mt-1">
                  <span className="font-medium">State:</span> {newAddress.state}
                </p>
              )}
              {newAddress.country && (
                <p className="text-gray-600 text-sm mt-1">
                  <span className="font-medium">Country:</span>{" "}
                  {newAddress.country}
                </p>
              )}
            </div>

            <button
              onClick={handleNextStep}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-all"
            >
              Save Pin & Continue
            </button>

            <button
              onClick={closeSetup}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-all"
            >
              Cancel
            </button>
          </div>

          {/* Map */}
          <div className="lg:col-span-2 h-[600px] rounded-xl overflow-hidden border border-gray-200 shadow-md relative">
            <div id="map-container" className="w-full h-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorLocationSetup;
