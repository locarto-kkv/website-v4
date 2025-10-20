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
  });

  const { profile } = useVendorData();
  console.log(profile);

  // Fetch approximate location from pincode (forward geocoding)
  const fetchLocationByPincode = async (pincode) => {
    if (!pincode) {
      alert("Please enter a pincode.");
      return;
    }
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

        // Center map and add marker
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
        alert("No results found for this pincode.");
      }
    } catch (err) {
      console.error("Error fetching location from pincode:", err);
      alert("Error fetching location. Please try again.");
    }

    setLoading(false);
  };

  // Fetch address from coordinates (reverse geocode)
  const fetchAddress = async (lat, lng) => {
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

  useEffect(() => {
    const storedForm = localStorage.getItem("setupform");
    if (storedForm) {
      console.log(storedForm);

      const parsedForm = JSON.parse(storedForm);
      console.log({ ...setupForm, ...parsedForm });

      setSetupForm((prev) => ({ ...prev, ...parsedForm }));
      setNewAddress({
        addressLine1: parsedForm.addressLine1 || "",
        addressLine2: parsedForm.addressLine2 || "",
        pincode: parsedForm.pincode || "",
        state: parsedForm.state || "",
        country: parsedForm.country || "",
      });
      // After map initializes, center map based on saved pincode
      setTimeout(() => {
        if (parsedForm.pincode) {
          fetchLocationByPincode(parsedForm.pincode);
        }
      }, 1000);
    }
  }, [map]);

  // Initialize the map instance
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

  // Handle user manually selecting on map
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
      setLoading(false);
    };

    map.on("click", handleClick);
    return () => map.off("click", handleClick);
  }, [map]);

  // Save and confirm address update
  const handleNextStep = async () => {
    const confirmation = window.confirm(
      "Do you want to update your previous address with the latest address?"
    );

    if (confirmation) {
      var updatedForm = {
        ...setupForm,
        addressLine1: newAddress.addressLine1 || setupForm.addressLine1,
        addressLine2: newAddress.addressLine2 || setupForm.addressLine2,
        pincode: newAddress.pincode || setupForm.pincode,
        state: newAddress.state || setupForm.state,
        country: newAddress.country || setupForm.country,
        coordinates: newAddress.coordinates,
      };

      localStorage.setItem("setupform", JSON.stringify(updatedForm));
    } else {
      var updatedForm = setupForm;
      localStorage.setItem("setupform", JSON.stringify(setupForm));
    }

    const profileData = {
      profile: { name: updatedForm.businessName },
      address: {
        label: "Main",
        address_line_1: updatedForm.addressLine1,
        address_line_2: updatedForm.addressLine2,
        pincode: updatedForm.pincode,
        state: updatedForm.state,
        country: updatedForm.country,
        coordinates: [updatedForm.coordinates.lat, updatedForm.coordinates.lng],
      },
      extra: {
        businessType: updatedForm.businessType,
        website: updatedForm.website,
        primary_contact: {
          name: updatedForm.name,
          phone_no: updatedForm.phone,
          email: updatedForm.email,
        },
      },
    };

    await VendorProfileService.updateProfile(profileData);
    navigate("/vendor/profile");
  };

  // Cancel setup (save current setupForm)
  const closeSetup = () => {
    localStorage.setItem("setupform", JSON.stringify(setupForm));
    console.log("Setup form saved on cancel:", setupForm);
    navigate("/vendor/profile");
  };

  // handle Enter key on the pincode input
  const handlePincodeKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      fetchLocationByPincode(newAddress.pincode);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 p-6">
      {/* Full-screen loading overlay */}
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
          <div className="bg-white rounded-xl shadow-md p-3 space-y-6 border border-gray-200">
            {/* Pincode Search Input + Button (aligned) */}
            <div>
              <label className="block text-gray-700 mb-2">Enter Pincode</label>

              {/* inline-flex container to align input + button perfectly */}
              <div className="inline-flex items-stretch w-full gap-0">
                <input
                  type="text"
                  name="pincode"
                  value={newAddress.pincode}
                  onChange={(e) =>
                    setNewAddress((prev) => ({
                      ...prev,
                      pincode: e.target.value,
                    }))
                  }
                  onKeyDown={handlePincodeKeyDown}
                  className="flex-1 py-3 px-1 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g. 400050"
                  aria-label="Enter pincode"
                />

                <button
                  type="button"
                  onClick={() => fetchLocationByPincode(newAddress.pincode)}
                  className="inline-flex items-center justify-center px-4 border border-l-0 border-gray-300 bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg transition-all"
                  aria-label="Search pincode"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 21l-4.35-4.35"></path>
                    <circle cx="11" cy="11" r="6"></circle>
                  </svg>
                </button>
              </div>
            </div>

            {/* Address Display */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Current Address
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {setupForm.addressLine1}
                {setupForm.addressLine2 && (
                  <>
                    <br />
                    {newAddress.addressLine2}
                  </>
                )}
              </p>

              {newAddress.pincode && (
                <p className="text-gray-600 text-sm mt-2">
                  <span className="font-medium">Pincode:</span>
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
                  <span className="font-medium">Country:</span>
                  {newAddress.country}
                </p>
              )}
            </div>

            {/* Buttons */}
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
