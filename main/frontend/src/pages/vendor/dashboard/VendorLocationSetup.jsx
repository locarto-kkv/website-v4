import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useVendorData } from "../../../context/vendor/vendorDataContext";
import { VendorProfileService } from "../../../services/vendor/vendorProfileService";

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
    coordinates: { lat: "", lng: "" },
  });

  const { profile, getProfile } = useVendorData();

  // ✅ Fetch approximate location from pincode (forward geocoding)
  const fetchLocationByPincode = async (pincode) => {
    if (!pincode) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&postalcode=${encodeURIComponent(
          pincode
        )}&country=India`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        const latlng = [lat, lng];

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

        await fetchAddress(lat, lng);
      } else {
        console.warn("No results found for this pincode.");
      }
    } catch (err) {
      console.error("Error fetching location from pincode:", err);
    }
    setLoading(false);
  };

  // ✅ Fetch address from coordinates (reverse geocode)
  const fetchAddress = async (lat, lng) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();

      if (data && data.address) {
        const addr = data.address;

        const addressLine1Parts = [
          addr.house_number,
          addr.road,
          addr.suburb || addr.neighbourhood,
        ].filter(Boolean);

        const addressLine2Parts = [
          addr.city || addr.town || addr.village,
          addr.state,
        ].filter(Boolean);

        const latlng = [parseFloat(lat), parseFloat(lng)];

        // Center map and place marker
        map.setView(latlng, 14);
        const newMarker = L.marker(latlng).addTo(map);
        setMarker(newMarker);

        setNewAddress({
          addressLine1: addressLine1Parts.join(", "),
          addressLine2: addressLine2Parts.join(", "),
          pincode: addr.postcode || "",
          state: addr.state || "",
          country: addr.country || "",
          coordinates: { lat, lng },
        });
        console.log("Fetched Address: ", {
          addressLine1: addressLine1Parts.join(", "),
          addressLine2: addressLine2Parts.join(", "),
          pincode: addr.postcode || "",
          state: addr.state || "",
          country: addr.country || "",
          coordinates: { lat, lng },
        });
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    setLoading(true);
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await fetchAddress(latitude, longitude);
      },
      (err) => {
        console.log(`Error: ${err.message}`);
      }
    );
    setLoading(false);
  };

  // ✅ Load setup form from localStorage
  useEffect(() => {
    const storedForm = localStorage.getItem("setupform");
    if (storedForm) {
      const parsedForm = JSON.parse(storedForm);
      setSetupForm((prev) => ({ ...prev, ...parsedForm }));
      setNewAddress({
        addressLine1: parsedForm.addressLine1 || "",
        addressLine2: parsedForm.addressLine2 || "",
        pincode: parsedForm.pincode || "",
        state: parsedForm.state || "",
        country: parsedForm.country || "",
      });
    }
  }, []);

  // ✅ Initialize map
  useEffect(() => {
    const mapInstance = L.map("map-container").setView([20.5937, 78.9629], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapInstance);
    setMap(mapInstance);

    return () => mapInstance.remove();
  }, []);

  // ✅ Set initial marker — from profile.coordinates or pincode
  useEffect(() => {
    if (!map) return;

    const storedCoords = setupForm.coordinates;
    const storedPincode = setupForm.pincode;

    if (storedCoords.lat) {
      const { lat, lng } = storedCoords;
      fetchAddress(lat, lng);
    } else if (storedPincode) {
      // Fallback to pincode-based location
      fetchLocationByPincode(storedPincode);
    }
  }, [map, profile, setupForm.pincode]);

  // ✅ Handle manual marker move — only update coordinates
  useEffect(() => {
    if (!map) return;

    const handleClick = async (e) => {
      const { lat, lng } = e.latlng;
      setLoading(true);

      setMarker((prevMarker) => {
        if (prevMarker) {
          prevMarker.setLatLng(e.latlng);
          return prevMarker;
        }
        return L.marker(e.latlng).addTo(map);
      });

      await fetchAddress(lat, lng);

      // Only update coordinates in setupForm
      setSetupForm((prev) => ({
        ...prev,
        coordinates: { lat: lat.toFixed(6), lng: lng.toFixed(6) },
      }));

      setLoading(false);
    };

    map.on("click", handleClick);
    return () => map.off("click", handleClick);
  }, [map]);

  // ✅ Save
  const handleNextStep = async () => {
    const profileData = {
      profile: { name: setupForm.businessName },
      address: {
        label: "Main",
        address_line_1: setupForm.addressLine1,
        address_line_2: setupForm.addressLine2,
        pincode: setupForm.pincode,
        state: setupForm.state,
        country: setupForm.country,
        coordinates: [newAddress.coordinates.lat, newAddress.coordinates.lng],
      },
      extra: {
        businessType: setupForm.businessType,
        website: setupForm.website,
        primary_contact: {
          name: setupForm.name,
          phone_no: setupForm.phone,
          email: setupForm.email,
        },
      },
    };

    localStorage.setItem("setupform", JSON.stringify(setupForm));
    await VendorProfileService.updateProfile(profileData);
    await getProfile();
    navigate("/vendor/dashboard/profile");
  };

  const closeSetup = () => {
    localStorage.setItem("setupform", JSON.stringify(setupForm));
    navigate("/vendor/dashboard/profile");
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 p-6">
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
          <div className="bg-white rounded-xl shadow-md p-4 space-y-6 border border-gray-200">
            <div>
              <label className="block text-gray-700 mb-2">Enter Pincode</label>
              <div className="inline-flex items-stretch w-full">
                <input
                  type="text"
                  name="pincode"
                  value={setupForm.pincode}
                  onChange={(e) =>
                    setNewAddress((prev) => ({
                      ...prev,
                      pincode: e.target.value,
                    }))
                  }
                  className="flex-1 py-3 px-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g. 400050"
                />
                <button
                  type="button"
                  onClick={() => fetchLocationByPincode(newAddress.pincode)}
                  className="inline-flex items-center justify-center px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg transition-all"
                >
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Current Pin At Location:
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {newAddress.addressLine1 || "No address Found"}
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
              onClick={getUserLocation}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
            >
              Get Current Location
            </button>
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

          <div className="lg:col-span-2 h-[600px] rounded-xl overflow-hidden border border-gray-200 shadow-md relative">
            <div id="map-container" className="w-full h-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorLocationSetup;
