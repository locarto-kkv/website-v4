import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useVendorData } from "../../../context/vendor/vendorDataContext";

const VendorSetupWizard = () => {
  const navigate = useNavigate();

  // ✅ State to manage all setup form data
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
    coordinates: {},
  });

  const { profile } = useVendorData();

  // ✅ Handle input changes dynamically
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSetupForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Close setup wizard
  const closeSetup = () => {
    localStorage.setItem("setupform", JSON.stringify(setupForm));
    navigate("/vendor/dashboard/profile");
  };

  // ✅ Save setupForm to localStorage & go to next step
  const handleNextStep = () => {
    localStorage.setItem("setupform", JSON.stringify(setupForm));
    navigate("/vendor/dashboard/setup/location");
  };

  // ✅ Retrieve setupForm from localStorage if it exists
  useEffect(() => {
    if (profile.address.length > 0) {
      const mainAddress = profile.address.find((item) => item.label === "Main");
      console.log(mainAddress);

      setSetupForm({
        addressLine1: mainAddress.address_line_1,
        addressLine2: mainAddress.address_line_2,
        pincode: mainAddress.pincode,
        state: mainAddress.state,
        country: mainAddress.country,
        coordinates: {
          lat: mainAddress.coordinates[0],
          lng: mainAddress.coordinates[1],
        },
      });
      return;
    }

    const storedForm = localStorage.getItem("setupform");
    if (storedForm) {
      setSetupForm(JSON.parse(storedForm));
    }
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-secondary">
          Vendor Setup Wizard
        </h2>
        <button
          onClick={closeSetup}
          className="text-gray-500 hover:text-gray-700"
        >
          <i className="fas fa-times"></i> Close
        </button>
      </div>

      {/* Primary Contact Section */}
      <div className="border-t pt-4 mt-6">
        <h4 className="text-lg font-semibold text-secondary mb-3">
          Primary Contact
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="block text-gray-700 mb-2">Name *</label>
            <input
              type="text"
              name="name"
              value={setupForm.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Full Name"
              required
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              name="email"
              value={setupForm.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="contact@example.com"
              required
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-gray-700 mb-2">Phone *</label>
            <input
              type="tel"
              name="phone"
              value={setupForm.phone}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="+1 (555) 123-4567"
              required
            />
          </div>
        </div>
      </div>

      {/* Business Info Section */}
      <div className="space-y-6">
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="border-t pt-4 mt-10">
            <h4 className="text-lg font-semibold text-secondary mb-3">
              Business Info
            </h4>
          </div>

          {/* Row 1: Business Name + Business Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">
                Legal Business Name *
              </label>
              <input
                type="text"
                name="businessName"
                value={setupForm.businessName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter legal business name"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">
                Business Type *
              </label>
              <select
                name="businessType"
                value={setupForm.businessType}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="">Select Business Type *</option>
                <option value="sole-prop">Sole Proprietorship</option>
                <option value="partnership">Partnership</option>
                <option value="llc">LLC</option>
                <option value="corp">Corporation</option>
                <option value="non-profit">Non-Profit</option>
              </select>
            </div>
          </div>

          {/* Row 2: Address Line 1 */}
          <div>
            <label className="block text-gray-700 mb-2">Address Line 1 *</label>
            <input
              type="text"
              name="addressLine1"
              value={setupForm.addressLine1}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter street address, building, etc."
              required
            />
          </div>

          {/* Row 3: Address Line 2 */}
          <div>
            <label className="block text-gray-700 mb-2">Address Line 2</label>
            <input
              type="text"
              name="addressLine2"
              value={setupForm.addressLine2}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Apartment, suite, unit, etc. (optional)"
            />
          </div>

          {/* Row 4: Pincode + State */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Pincode *</label>
              <input
                type="text"
                name="pincode"
                value={setupForm.pincode}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter pincode"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">State *</label>
              <input
                type="text"
                name="state"
                value={setupForm.state}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter state"
                required
              />
            </div>
          </div>

          {/* Row 5: Country + Website */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Country *</label>
              <select
                name="country"
                value={setupForm.country}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="">Select Country</option>
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="India">India</option>
                <option value="United Kingdom">United Kingdom</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">
                Business Website
              </label>
              <input
                type="url"
                name="website"
                value={setupForm.website}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="https://example.com"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={closeSetup}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 transition"
            >
              Next Step
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorSetupWizard;
