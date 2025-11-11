import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVendorDataStore } from "../../../store/vendor/vendorDataStore";

const VendorSetupWizard = () => {
  const navigate = useNavigate();

  // ✅ State to manage all setup form data
  const [setupForm, setSetupForm] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    businessType: "",
    address: {
      address_line_1: "",
      address_line_2: "",
      pincode: "",
      state: "",
      country: "",
      coordinates: {},
    },
    bank_detail: {
      ifsc_code: "",
      account_number: "",
      account_name: "",
      bank_name: "",
    },
  });

  // ✅ Handle input changes dynamically
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setSetupForm((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else if (name.startsWith("bank_detail")) {
      const bankField = name.split(".")[1];
      setSetupForm((prev) => ({
        ...prev,
        bank_detail: {
          ...prev.bank_detail,
          [bankField]: value,
        },
      }));
    } else {
      setSetupForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // ✅ Close setup wizard
  const closeSetup = () => {
    navigate("/vendor/dashboard/profile");
  };

  // ✅ Submit form and validate
  const handleSubmit = (e) => {
    e.preventDefault();

    // Browser will handle HTML5 required validation automatically.
    // If all fields are valid, navigate to next step.
    navigate("/vendor/dashboard/setup/location", { state: setupForm });
  };

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
          type="button"
        >
          <i className="fas fa-times"></i> Close
        </button>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Primary Contact Section */}
        <div className="border-t pt-4 mt-6">
          <h4 className="text-lg font-semibold text-secondary mb-3">
            Primary Contact
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-gray-700 my-5">Name *</label>
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
              <label className="block text-gray-700 my-5">Email *</label>
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
              <label className="block text-gray-700 my-5">Phone *</label>
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
        <div className="border-t pt-4 mt-10">
          <h4 className="text-lg font-semibold text-secondary mb-3">
            Business Info
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 my-5">
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
            <div>
              <label className="block text-gray-700 my-5">
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
        </div>

        {/* Address Detail*/}
        <div className="border-t pt-4 mt-10">
          <h4 className="text-lg font-semibold text-secondary mb-3">
            Address Details
          </h4>
          <div>
            <label className="block text-gray-700 my-5">Address Line 1 *</label>
            <input
              type="text"
              name="address.address_line_1"
              value={setupForm.address.address_line_1}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter street address, building, etc."
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 my-5">Address Line 2</label>
            <input
              type="text"
              name="address.address_line_2"
              value={setupForm.address.address_line_2}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Apartment, suite, unit, etc. (optional)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 my-5">Pincode *</label>
              <input
                type="text"
                name="address.pincode"
                value={setupForm.address.pincode}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter pincode"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 my-5">State *</label>
              <input
                type="text"
                name="address.state"
                value={setupForm.address.state}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter state"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 my-5">Country *</label>
              <select
                name="address.country"
                value={setupForm.address.country}
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
          </div>
        </div>

        {/* Bank Detail*/}
        <div className="border-t pt-4 mt-10">
          <h4 className="text-lg font-semibold text-secondary mb-3">
            Bank Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 my-5">Bank Name *</label>
              <input
                type="text"
                name="bank_detail.bank_name"
                value={setupForm.bank_detail.bank_name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter Bank Name"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 my-5">Account Name *</label>
              <input
                type="text"
                name="bank_detail.account_name"
                value={setupForm.bank_detail.account_name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter Account Name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 my-5">
                Account Number *
              </label>
              <input
                type="text"
                name="bank_detail.account_number"
                value={setupForm.bank_detail.account_number}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter Account Number"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 my-5">IFSC Code *</label>
              <input
                type="text"
                name="bank_detail.ifsc_code"
                value={setupForm.bank_detail.ifsc_code}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter IFSC Code"
                required
              />
            </div>
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
            type="submit"
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 transition"
          >
            Next Step
          </button>
        </div>
      </form>
    </div>
  );
};

export default VendorSetupWizard;
