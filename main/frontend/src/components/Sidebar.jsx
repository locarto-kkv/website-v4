// src/components/Sidebar.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useConsumerData } from "../context/consumer/consumerDataContext";

const Sidebar = ({ onNavigate, isOpen, onClose }) => {
  const location = useLocation();
  const activePath = location.pathname;
  const navigate = useNavigate();

  const { currentUser } = useAuthStore();
  const isConsumer = currentUser?.type === "consumer";

  const consumerData = isConsumer ? useConsumerData() : { lists: null };
  const lists = consumerData.lists;

  const cartCount = lists?.cart ? Object.keys(lists.cart).length : 0;
  const wishlistCount = lists?.wishlist?.size ?? 0;
  const listBadgeCount = cartCount + wishlistCount;

  let menuItems = [];
  let headerDetails = {
    title: "Dashboard",
    icon: "fas fa-tachometer-alt",
    gradient: "from-gray-500 to-gray-600",
  };

  if (currentUser?.type === "vendor") {
    headerDetails = {
      title: "Vendor Portal",
      icon: "fas fa-store",
      gradient: "from-orange-500 to-red-500",
    };
    menuItems = [
      { id: "dashboard", label: "Dashboard", icon: "fas fa-chart-line", path: "/vendor/dashboard" },
      { id: "orders", label: "Orders", icon: "fas fa-shopping-bag", path: "/vendor/orders"},
      { id: "analytics", label: "Analytics", icon: "fas fa-chart-bar", path: "/vendor/analytics" },
      { id: "products", label: "Products", icon: "fas fa-box", path: "/vendor/products" },
      { id: "milestones", label: "Milestones", icon: "fas fa-flag-checkered", path: "/vendor/milestones" },
      { id: "members-hub", label: "Members Hub", icon: "fas fa-users", path: "/vendor/members-hub" },
      { id: "profile", label: "Profile", icon: "fas fa-user-circle", path: "/vendor/profile" },
    ];
  } else if (currentUser?.type === "consumer") {
    headerDetails = {
      title: "Customer Portal",
      icon: "fas fa-user",
      gradient: "from-orange-500 to-red-500",
    };
    menuItems = [
      { id: "overview", label: "Overview", icon: "fas fa-home", badge: null, path: "/consumer/dashboard/overview" },
      { id: "orders", label: "Orders", icon: "fas fa-box", badge: null, path: "/consumer/dashboard/orders" },
      { id: "lists", label: "Lists", icon: "fas fa-list", badge: listBadgeCount, path: "/consumer/dashboard/lists" },
      { id: "reviews", label: "Reviews", icon: "fas fa-star", badge: null, path: "/consumer/dashboard/reviews" },
      { id: "settings", label: "Settings", icon: "fas fa-cog", badge: null, path: "/consumer/dashboard/settings" },
    ];
  } else if (currentUser?.type === "admin") {
     headerDetails = {
      title: "Admin Panel",
      icon: "fas fa-user-shield",
      gradient: "from-purple-500 to-violet-600",
    };
    menuItems = [
      { id: "dashboard", label: "Dashboard", icon: "fas fa-th-large", path: "/admin/dashboard" },
    ];
  }

  const isActive = (itemPath) => {
    if (itemPath === '/consumer/dashboard/overview' && activePath === '/consumer/dashboard') {
        return true;
    }
    if (itemPath === '/vendor/dashboard' && activePath === '/vendor') {
        return true;
    }
    if (itemPath === '/consumer/dashboard' || itemPath === '/vendor/dashboard') {
         return activePath === itemPath;
    }
    return activePath.startsWith(itemPath);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) onClose(); // Close sidebar on mobile after navigation
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`
          fixed lg:static 
          top-[70px] lg:top-0 left-0
          w-full lg:w-64 
          bg-white shadow-lg border-r lg:border-r border-b lg:border-b-0 border-gray-200 
          flex flex-col 
          max-h-[calc(100vh-70px)] lg:h-[calc(100vh-70px)]
          flex-shrink-0 z-50
          transform transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 lg:translate-y-0 lg:opacity-100'}
        `}
      >
        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors z-10"
          aria-label="Close menu"
        >
          <i className="fas fa-times text-xl text-gray-600"></i>
        </button>

        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
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
                  onClick={() => handleNavigation(item.path)}
                  className={`group w-full text-left py-3 px-4 rounded-xl transition-all duration-300 font-medium flex items-center gap-3 ${
                    isActive(item.path)
                      ? `bg-gradient-to-r ${headerDetails.gradient} text-white shadow-lg transform scale-105`
                      : "bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900 hover:shadow-md hover:scale-105"
                  }`}
                >
                  <i
                    className={`${item.icon} text-lg ${
                      isActive(item.path)
                        ? "text-white"
                        : "text-gray-500 group-hover:text-orange-500"
                    } transition-colors duration-300`}
                  ></i>
                  <span className="font-semibold flex-1">{item.label}</span>

                  {item.badge != null && item.badge > 0 && (
                    <span className={`text-xs rounded-full h-5 min-w-[20px] px-2 flex items-center justify-center font-bold ${
                       isActive(item.path)
                        ? "bg-white text-orange-500"
                        : "bg-orange-500 text-white"
                    }`}>
                      {item.badge}
                    </span>
                  )}

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
    </>
  );
};

export default Sidebar;