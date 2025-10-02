import React from "react";
import { useLocation } from "react-router-dom";

const VendorSidebar = ({ onNavigate }) => {
  const location = useLocation();
  const activePath = location.pathname;
  
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "fas fa-chart-line",
      path: "/vendor/dashboard",
      isActive: activePath.endsWith("/vendor/dashboard") || activePath === "/vendor"
    },
    {
      id: "analytics",
      label: "Analytics", 
      icon: "fas fa-chart-bar",
      path: "/vendor/analytics",
      isActive: activePath.endsWith("/analytics")
    },
    {
      id: "products",
      label: "Products",
      icon: "fas fa-box",
      path: "/vendor/products", 
      isActive: activePath.endsWith("/products")
    },
    {
      id: "members-hub",
      label: "Members Hub",
      icon: "fas fa-users",
      path: "/vendor/members-hub",
      isActive: activePath.endsWith("/members-hub")
    },
    {
      id: "support",
      label: "Support",
      icon: "fas fa-headset",
      path: "/vendor/support",
      isActive: activePath.endsWith("/support")
    },
    {
      id: "settings",
      label: "Settings",
      icon: "fas fa-cog",
      path: "/vendor/settings",
      isActive: activePath.endsWith("/settings")
    },
    {
      id: "profile",
      label: "Profile",
      icon: "fas fa-user-circle", 
      path: "/vendor/profile",
      isActive: activePath.endsWith("/profile")
    }
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 h-screen sticky top-0 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <i className="fas fa-store text-white text-lg"></i>
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-lg">Vendor Portal</h2>
            <p className="text-sm text-gray-500">Manage your business</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onNavigate(item.path)}
                className={`group w-full text-left py-3 px-4 rounded-xl transition-all duration-300 font-medium flex items-center gap-3 ${
                  item.isActive
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105"
                    : "bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900 hover:shadow-md hover:scale-105"
                }`}
              >
                <i className={`${item.icon} text-lg ${
                  item.isActive 
                    ? "text-white" 
                    : "text-gray-500 group-hover:text-orange-500"
                } transition-colors duration-300`}></i>
                <span className="font-semibold">{item.label}</span>
                
                {/* Active indicator */}
                {item.isActive && (
                  <div className="ml-auto">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default VendorSidebar;