import React from "react";
import { useNavigate } from "react-router-dom";

const VendorSetupWizard = ({ onSubmit }) => {
  // In a real application, you'd manage form state here
  // using useState or a library like Formik/React Hook Form.

  const navigate = useNavigate();
  const closeSetup = () => {
    navigate("/vendor/profile");
  };
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
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

      <div className="space-y-6">
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold text-primary">
            Step 1: Business Info
          </h3>
          <p className="text-gray-600">Please provide your business details.</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">
                Legal Business Name *
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter legal business name"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">
                Doing Business As
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter DBA (if applicable)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">
                Business Type *
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="">Select Business Type</option>
                <option value="sole-prop">Sole Proprietorship</option>
                <option value="partnership">Partnership</option>
                <option value="llc">LLC</option>
                <option value="corp">Corporation</option>
                <option value="non-profit">Non-Profit</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">
                Tax ID (TIN/EIN) *
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter Tax ID"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Country *</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="">Select Country</option>
                <option value="us">United States</option>
                <option value="ca">Canada</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Website</label>
              <input
                type="url"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="border-t pt-4 mt-6">
            <h4 className="text-md font-semibold text-secondary mb-3">
              Primary Contact
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Full Name"
                  required
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="contact@example.com"
                  required
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>
            </div>
          </div>

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
              onClick={onSubmit}
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
