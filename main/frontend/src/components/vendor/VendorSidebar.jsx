import React from 'react';
import { useLocation } from 'react-router-dom';

const VendorSidebar = ({ onNavigate }) => {
  const location = useLocation();
  const activePath = location.pathname;

  const activeClass = "bg-primary text-white";
  const inactiveClass = "bg-gray-100 hover:bg-gray-200 text-gray-800";

  return (
    <div className="w-64 bg-white shadow-md p-4 h-screen sticky top-0">
      <ul className="space-y-3 pt-4">
        <li>
          <button
            onClick={() => onNavigate("/vendor/dashboard")}
            className={`w-full text-left py-3 px-4 rounded-lg transition font-medium ${
              activePath.endsWith('/vendor/dashboard') || activePath === '/vendor' ? activeClass : inactiveClass
            }`}
          >
            Dashboard
          </button>
        </li>
        <li>
          <button
            onClick={() => onNavigate("/vendor/analytics")}
            className={`w-full text-left py-3 px-4 rounded-lg transition font-medium ${
              activePath.endsWith('/analytics') ? activeClass : inactiveClass
            }`}
          >
            Analytics
          </button>
        </li>
        <li>
          <button
            onClick={() => onNavigate("/vendor/products")}
            className={`w-full text-left py-3 px-4 rounded-lg transition font-medium ${
              activePath.endsWith('/products') ? activeClass : inactiveClass
            }`}
          >
            Products
          </button>
        </li>
        <li>
          <button
            onClick={() => onNavigate("/vendor/settings")}
            className={`w-full text-left py-3 px-4 rounded-lg transition font-medium ${
              activePath.endsWith('/settings') ? activeClass : inactiveClass
            }`}
          >
            Settings
          </button>
        </li>
        <li>
          <button
            onClick={() => onNavigate("/vendor/profile")}
            className={`w-full text-left py-3 px-4 rounded-lg transition font-medium ${
              activePath.endsWith('/profile') ? activeClass : inactiveClass
            }`}
          >
            Profile
          </button>
        </li>
      </ul>
    </div>
  );
};

export default VendorSidebar;