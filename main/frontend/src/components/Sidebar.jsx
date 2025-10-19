// src/components/Sidebar.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore"; // Import auth store
import { useConsumerData } from "../context/consumer/consumerDataContext"; // Import consumer context

const Sidebar = ({ onNavigate }) => {
  const location = useLocation();
  const activePath = location.pathname;
  const navigate = useNavigate(); // Use navigate hook directly

  const { currentUser } = useAuthStore(); // Get current user
  const isConsumer = currentUser?.type === "consumer";

  // --- Get consumer data only if the user is a consumer ---
  const consumerData = isConsumer ? useConsumerData() : { lists: null };
  const lists = consumerData.lists;

  // Calculate counts (handle potential undefined lists)
  // Ensure lists.cart and lists.wishlist exist before accessing properties
  const cartCount = lists?.cart ? Object.keys(lists.cart).length : 0;
  // Use optional chaining and nullish coalescing for wishlist size
  const wishlistCount = lists?.wishlist?.size ?? 0;
  const listBadgeCount = cartCount + wishlistCount;
  // --- End consumer data logic ---

  let menuItems = [];
  let headerDetails = {
    title: "Dashboard",
    icon: "fas fa-tachometer-alt",
    gradient: "from-gray-500 to-gray-600",
  }; // Default

  // --- Define items and theme based on user type ---
  if (currentUser?.type === "vendor") {
    headerDetails = {
      title: "Vendor Portal",
      icon: "fas fa-store",
      gradient: "from-orange-500 to-red-500", // Vendor orange theme
    };
    menuItems = [
      { id: "dashboard", label: "Dashboard", icon: "fas fa-chart-line", path: "/vendor/dashboard" },
      { id: "analytics", label: "Analytics", icon: "fas fa-chart-bar", path: "/vendor/analytics" },
      { id: "products", label: "Products", icon: "fas fa-box", path: "/vendor/products" },
      { id: "members-hub", label: "Members Hub", icon: "fas fa-users", path: "/vendor/members-hub" },
      { id: "support", label: "Support", icon: "fas fa-headset", path: "/vendor/support" },
      { id: "settings", label: "Settings", icon: "fas fa-cog", path: "/vendor/settings" },
      { id: "profile", label: "Profile", icon: "fas fa-user-circle", path: "/vendor/profile" },
    ];
  } else if (currentUser?.type === "consumer") {
    headerDetails = {
      title: "Customer Portal",
      icon: "fas fa-user",
      gradient: "from-orange-500 to-red-500", // <<<<<< CHANGED TO ORANGE THEME
    };
    menuItems = [
      { id: "overview", label: "Overview", icon: "fas fa-home", badge: null, path: "/consumer/dashboard/overview" },
      { id: "orders", label: "Orders", icon: "fas fa-box", badge: null, path: "/consumer/dashboard/orders" },
      { id: "lists", label: "Lists", icon: "fas fa-list", badge: listBadgeCount, path: "/consumer/dashboard/lists" },
      { id: "reviews", label: "Reviews", icon: "fas fa-star", badge: null, path: "/consumer/dashboard/reviews" },
      { id: "support", label: "Support", icon: "fas fa-headset", badge: null, path: "/consumer/dashboard/support" },
      { id: "settings", label: "Settings", icon: "fas fa-cog", badge: null, path: "/consumer/dashboard/settings" },
    ];
  } else if (currentUser?.type === "admin") {
    headerDetails = {
      title: "Admin Panel",
      icon: "fas fa-user-shield",
      gradient: "from-purple-500 to-violet-600", // Example gradient for admin
    };
    menuItems = [
      { id: "dashboard", label: "Dashboard", icon: "fas fa-tachometer-alt", path: "/admin/dashboard" },
      // Add other admin links...
    ];
  }
  // --- End defining items ---

  const isActive = (itemPath) => {
    // Handle base dashboard path for overview explicitly for consumer
    if (itemPath === '/consumer/dashboard/overview' && activePath === '/consumer/dashboard') {
        return true;
    }
    // Handle exact match or when base path matches overview for vendor (original logic)
    if (itemPath === '/vendor/dashboard' && activePath === '/vendor') {
        return true;
    }
    // General case: Check if the current path starts with the item's path
    // This handles nested routes as well, make sure it's the most specific match first if needed
    // Example: /consumer/dashboard/orders should match /consumer/dashboard/orders but not /consumer/dashboard/overview
    return activePath === itemPath || (activePath.startsWith(itemPath) && itemPath !== '/consumer/dashboard' && itemPath !== '/vendor/dashboard');
  };


  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col h-[calc(100vh-70px)] flex-shrink-0"> {/* Adjusted height */}
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {/* Use the dynamic gradient for the header icon background */}
          <div className={`w-10 h-10 bg-gradient-to-r ${headerDetails.gradient} rounded-lg flex items-center justify-center`}>
            <i className={`${headerDetails.icon} text-white text-lg`}></i>
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-lg">{headerDetails.title}</h2>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => navigate(item.path)} // Use navigate directly
                className={`group w-full text-left py-3 px-4 rounded-xl transition-all duration-300 font-medium flex items-center gap-3 ${
                  isActive(item.path)
                    ? `bg-gradient-to-r ${headerDetails.gradient} text-white shadow-lg transform scale-105` // Use dynamic gradient for active item
                    : "bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900 hover:shadow-md hover:scale-105"
                }`}
              >
                <i
                  className={`${item.icon} text-lg ${
                    isActive(item.path)
                      ? "text-white" // Icon color for active item
                      : "text-gray-500 group-hover:text-orange-500" // Icon color for inactive item
                  } transition-colors duration-300`}
                ></i>
                <span className="font-semibold flex-1">{item.label}</span>

                {/* Badge for consumer lists */}
                {item.badge != null && item.badge > 0 && (
                  <span className={`text-xs rounded-full h-5 min-w-[20px] px-2 flex items-center justify-center font-bold ${
                     isActive(item.path)
                      ? "bg-white text-orange-500" // Badge colors for active item
                      : "bg-orange-500 text-white" // Badge colors for inactive item
                  }`}>
                    {item.badge}
                  </span>
                )}

                {/* Active indicator */}
                {isActive(item.path) && (
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

export default Sidebar;