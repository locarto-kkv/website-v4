// src/components/Sidebar.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useConsumerDataStore } from "../store/consumer/consumerDataStore";
import { useVendorDataStore } from "../store/vendor/vendorDataStore";

// Accept isOpen and onClose props for mobile responsiveness
const Sidebar = ({ onNavigate, isOpen, onClose }) => {
  const location = useLocation();
  const activePath = location.pathname;
  const navigate = useNavigate();

  const { currentUser } = useAuthStore();
  const isConsumer = currentUser?.type === "consumer";
  const isVendor = currentUser?.type === "vendor";

  const lists = useConsumerDataStore((s) => s.lists);

  const cartCount = lists?.cart ? Object.keys(lists.cart).length : 0;
  const wishlistCount = lists?.wishlist?.size ?? 0;
  const listBadgeCount = cartCount + wishlistCount;

  const profile = useVendorDataStore((s) => s.profile);
  const isVerified = (path) => {
    if (currentUser?.type === "consumer") return true;
    if (profile?.status !== "verified") {
      if (path !== "/vendor/dashboard/profile") return false;
    }
    return true;
  };

  let menuItems = [];
  let headerDetails = {
    title: "Dashboard",
    icon: "fas fa-tachometer-alt",
    gradient: "from-gray-500 to-gray-600",
  };

  // Define menu items based on user type
  if (isVendor) {
    headerDetails = {
      title: "Vendor Portal",
      icon: "fas fa-store",
      gradient: "from-orange-500 to-red-500",
    };
    menuItems = [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: "fas fa-chart-line",
        path: "/vendor/dashboard/overview",
      },
      {
        id: "orders",
        label: "Orders",
        icon: "fas fa-shopping-bag",
        path: "/vendor/dashboard/orders",
      },
      {
        id: "analytics",
        label: "Analytics",
        icon: "fas fa-chart-bar",
        path: "/vendor/dashboard/analytics",
      },
      {
        id: "products",
        label: "Products",
        icon: "fas fa-box",
        path: "/vendor/dashboard/products",
      },
      {
        id: "milestones",
        label: "Milestones",
        icon: "fas fa-flag-checkered",
        path: "/vendor/dashboard/milestones",
      },
      {
        id: "members-hub",
        label: "Members Hub",
        icon: "fas fa-users",
        path: "/vendor/dashboard/members-hub",
      },
      {
        id: "profile",
        label: "Profile",
        icon: "fas fa-user-circle",
        path: "/vendor/dashboard/profile",
      },
    ];
  } else if (isConsumer) {
    headerDetails = {
      title: "Customer Portal",
      icon: "fas fa-user",
      gradient: "from-orange-500 to-red-500", // Using same gradient as vendor for consistency
    };
    menuItems = [
      {
        id: "overview",
        label: "Overview",
        icon: "fas fa-home",
        badge: null,
        path: "/consumer/dashboard/overview",
      },
      {
        id: "orders",
        label: "Orders",
        icon: "fas fa-box",
        badge: null,
        path: "/consumer/dashboard/orders",
      },
      {
        id: "lists",
        label: "Lists",
        icon: "fas fa-list",
        badge: listBadgeCount,
        path: "/consumer/dashboard/lists",
      },
      {
        id: "reviews",
        label: "Reviews",
        icon: "fas fa-star",
        badge: null,
        path: "/consumer/dashboard/reviews",
      },
      {
        id: "settings",
        label: "Settings",
        icon: "fas fa-cog",
        badge: null,
        path: "/consumer/dashboard/settings",
      },
      {
        id: "support",
        label: "Support",
        icon: "fas fa-headset",
        path: "/consumer/dashboard/support",
      },
    ];
  } else if (currentUser?.type === "admin") {
    headerDetails = {
      title: "Admin Panel",
      icon: "fas fa-user-shield",
      gradient: "from-purple-500 to-violet-600",
    };
    menuItems = [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: "fas fa-th-large",
        path: "/admin/dashboard",
      },
      {
        id: "users",
        label: "Users",
        icon: "fas fa-users-cog",
        path: "/admin/users",
      }, // Example
      {
        id: "content",
        label: "Content",
        icon: "fas fa-edit",
        path: "/admin/content",
      }, // Example
    ];
  }

  const isActive = (itemPath) => {
    return activePath.startsWith(itemPath);
  };

  // Handle navigation and close sidebar on mobile
  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`
          fixed
          top-0 lg:top-[70px] left-0 bottom-0
          w-64
          bg-white shadow-lg lg:shadow-none border-r border-gray-200
          flex flex-col
          h-screen lg:h-[calc(100vh-70px)]
          lg:pt-0
          flex-shrink-0 z-50 lg:z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 bg-gradient-to-r ${headerDetails.gradient} rounded-lg flex items-center justify-center`}
            >
              <i className={`${headerDetails.icon} text-white text-lg`}></i>
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-lg">
                {headerDetails.title}
              </h2>
            </div>
          </div>
          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 -mr-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <i className="fas fa-times text-xl text-gray-600"></i>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigation(item.path)}
                  disabled={!isVerified(item.path)}
                  className={`group w-full text-left py-3 px-4 rounded-xl transition-all duration-300 font-medium flex items-center gap-3
        ${
          !isVerified(item.path)
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : isActive(item.path)
            ? `bg-gradient-to-r ${headerDetails.gradient} text-white shadow-lg transform scale-105`
            : "hover:bg-gray-100 text-black hover:text-gray-900 hover:shadow-sm"
        }
      `}
                >
                  <i
                    className={`${
                      item.icon
                    } text-lg w-5 text-center transition-colors duration-300
          ${
            !isVerified(item.path)
              ? "text-gray-400"
              : isActive(item.path)
              ? "text-white"
              : "text-gray-500 group-hover:text-orange-500"
          }
        `}
                  ></i>

                  <span
                    className={`font-semibold flex-1 ${
                      !isVerified ? "text-gray-400" : ""
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* Badge */}
                  {item.badge != null && item.badge > 0 && (
                    <span
                      className={`text-xs rounded-full h-5 min-w-[20px] px-2 flex items-center justify-center font-bold transition-colors
            ${
              !isVerified
                ? "bg-gray-300 text-gray-500"
                : isActive(item.path)
                ? "bg-white text-orange-500"
                : "bg-orange-500 text-white"
            }
          `}
                    >
                      {item.badge}
                    </span>
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