// src/components/DashboardNavbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.jsx";
// Import ConsumerDataContext conditionally or ensure safe access
import { useConsumerData } from "../context/consumer/consumerDataContext.jsx"; // Adjust if needed
import { ConsumerListService } from "../services/consumer/consumerListService.js"; // Adjust if needed for cart count
import locartoImg from "../assets/locarto.png";
import toast from "react-hot-toast"; // Ensure toast is imported
import SideCart from "../components/consumer/SideCart.jsx"; // Import SideCart if used

const DashboardNavbar = ({ onMenuClick }) => {
  // onMenuClick prop for toggling sidebar from layout
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // No need for mobileMenuOpen state here as menu is handled by layout sidebar
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const dropdownRef = useRef(null); // Ref for desktop dropdown
  const mobileDropdownRef = useRef(null); // Ref for mobile bottom sheet
  const buttonRef = useRef(null); // Ref for desktop profile button
  const mobileButtonRef = useRef(null); // Ref for mobile profile button
  const navigate = useNavigate();
  const location = useLocation(); // Get location

  const { currentUser, logout, logoutLoading } = useAuthStore(); // Get logoutLoading state
  const isConsumer = currentUser?.type === "consumer";

  // Safely get consumer data and services only if consumer
  const consumerDataContext = isConsumer ? useConsumerData() : null;
  const lists = consumerDataContext?.lists;

  // Fetch Cart Count only if consumer
  useEffect(() => {
    const loadCart = async () => {
      // Check for isConsumer AND ConsumerListService to avoid errors if not consumer context
      if (isConsumer && ConsumerListService) {
        try {
          const { getLists } = ConsumerListService;
          const res = await getLists();
          setCartItemsCount(res?.cart?.length || 0);
        } catch (error) {
          console.log("Error loading cart items count:", error);
          setCartItemsCount(0); // Reset on error
        }
      } else {
        setCartItemsCount(0); // Not a consumer or service unavailable
      }
    };
    loadCart();
    // Ensure ConsumerListService is included if it might change (though unlikely)
  }, [currentUser, isConsumer, isCartOpen]);

  // Close dropdowns when clicking outside

  // Close mobile dropdown on navigation
  useEffect(() => {
    setDropdownOpen(false);
  }, [location.pathname]);

  const toggleCart = () => {
    if (isConsumer) {
      setIsCartOpen((prev) => !prev);
    } else {
      toast.error("Cart is only available for customers.");
    }
  };

  const handleDashboardNavigation = () => {
    setDropdownOpen(false); // Close profile dropdown

    if (currentUser) {
      window.scrollTo({ top: 0, behavior: "smooth" });

      if (currentUser.type === "vendor") {
        navigate("/vendor/dashboard/overview");
      } else if (currentUser.type === "consumer") {
        navigate("/consumer/dashboard/overview");
      } else if (currentUser.type === "admin") {
        navigate("/admin/dashboard");
      }
    } else {
      toast.error("Please log in or sign up to access the dashboard.");
    }
  };

  // Logout Handler
  const handleLogout = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (logoutLoading || !currentUser?.type) return;

    try {
      await logout(currentUser.type);
      setDropdownOpen(false);
    } catch (error) {
      console.error("Logout failed in Navbar:", error);
      setDropdownOpen(false);
    }
  };

  // Dynamic Navbar Title (Used in mobile overlay)
  const navbarTitle = () => {
    switch (currentUser?.type) {
      case "vendor":
        return "Vendor Dashboard";
      case "consumer":
        return "Customer Dashboard";
      case "admin":
        return "Admin Dashboard";
      default:
        return "Dashboard";
    }
  };

  // Dynamic Profile/Settings Link (Used in mobile overlay)
  const profileLink = () => {
    switch (currentUser?.type) {
      case "vendor":
        return "/vendor/dashboard/profile";
      case "consumer":
        return "/consumer/dashboard/settings";
      case "admin":
        return "/admin/dashboard";
      default:
        return "/";
    }
  };

  return (
    <>
      {/* TOP NAVBAR (Common for Desktop/Mobile) */}
      <nav className="flex bg-white shadow-md h-[70px] px-3 sm:px-4 md:px-6 items-center justify-between fixed top-0 left-0 w-full z-50 border-b border-gray-100">
        {/* Left Side: Logo */}
        {/* Removed Hamburger Button */}
        <div className="flex items-center flex-shrink-0">
          <Link
            to="/"
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <img
              src={locartoImg}
              alt="Locarto"
              // Consistent Logo Styling
              className="object-contain h-10 sm:h-14 w-auto scale-110 sm:scale-125 translate-y-[1px] sm:translate-y-[2px]"
            />
          </Link>
        </div>

        {/* --- Right Side Icons (Desktop Only - sm:flex) --- */}
        <div className="hidden sm:flex items-center space-x-3 sm:space-x-4">
          {/* Cart Button (Consumer Only) */}
          {isConsumer && (
            <button
              onClick={toggleCart}
              className="text-gray-700 hover:text-orange-500 transition-colors relative p-2 hover:bg-gray-100 rounded-lg"
              aria-label={`View Cart (${cartItemsCount} items)`}
            >
              <i className="fas fa-shopping-cart text-lg sm:text-xl"></i>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-md">
                  {cartItemsCount}
                </span>
              )}
            </button>
          )}

          {/* Notifications Button */}
          <Link
            to="/alerts"
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            aria-label="View Notifications"
          >
            {/* Using the Bell icon */}
            <i className="fas fa-bell text-lg sm:text-xl text-gray-700"></i>
            {/* Add notification badge logic here if needed */}
          </Link>

          {/* Profile Dropdown Button (Desktop) */}
          <div className="relative">
            <button
              ref={buttonRef} // Ref for desktop button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="bg-gray-100 text-gray-700 rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-gray-200 transition ring-1 ring-gray-200 hover:ring-orange-300"
              aria-label="User menu"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              {currentUser ? (
                // Display user initial or generic icon if no name/email
                <span className="font-semibold text-xs sm:text-sm">
                  {(
                    currentUser?.name?.charAt(0) ||
                    currentUser?.email?.charAt(0) ||
                    "?"
                  ).toUpperCase()}
                </span>
              ) : (
                // <i className="fas fa-user text-sm sm:text-base"></i> // Alternative icon
                <i className="fas fa-user-plus text-sm sm:text-base"></i> // Should not happen in dashboard
              )}
            </button>

            {/* Desktop Dropdown Menu */}
            {dropdownOpen && (
              <div
                ref={dropdownRef} // Ref for desktop dropdown content
                className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-[51] border border-gray-100 overflow-hidden" // Increased z-index
                role="menu"
                aria-orientation="vertical"
              >
                {currentUser ? (
                  <>
                    {/* Link to Profile/Settings page */}
                    <Link
                      to={profileLink()} // Use dynamic link
                      className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100 transition-colors flex items-center gap-2"
                      onClick={() => setDropdownOpen(false)} // Close on click
                      role="menuitem"
                    >
                      {/* Use dynamic icon/text */}
                      <i
                        className={`fas ${
                          isConsumer ? "fa-cog" : "fa-user"
                        } w-4 text-center text-gray-500`}
                      ></i>
                      {isConsumer ? "Settings" : "Profile"}
                    </Link>

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      disabled={logoutLoading}
                      className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2 disabled:opacity-50"
                      role="menuitem"
                    >
                      <i className="fas fa-sign-out-alt w-4 text-center text-gray-500"></i>
                      {logoutLoading ? "Logging Out..." : "Logout"}
                    </button>
                  </>
                ) : (
                  // Logged out state - shouldn't appear in dashboard context
                  // Kept for robustness, uses parentheses around fragment
                  <>
                    <Link
                      to="/consumer/login"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100 transition-colors flex items-center gap-2"
                      onClick={() => setDropdownOpen(false)}
                      role="menuitem"
                    >
                      <i className="fas fa-user w-4 text-center text-gray-500"></i>{" "}
                      Login as Customer
                    </Link>
                    <Link
                      to="/vendor/login"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                      onClick={() => setDropdownOpen(false)}
                      role="menuitem"
                    >
                      <i className="fas fa-store w-4 text-center text-gray-500"></i>{" "}
                      Login as Vendor
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        {/* --- END: Right Side Icons --- */}
      </nav>

      {/* --- MOBILE BOTTOM NAVIGATION BAR (Remains the same) --- */}
      <div className="sm:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 shadow-lg safe-area-bottom">
        {/* ... (Content of mobile bottom bar remains unchanged) ... */}
        <div className="flex items-stretch justify-around px-2">
          {/* Menu Button (Toggles Sidebar via prop) */}
          <button
            onClick={() => {
              if (onMenuClick) {
                onMenuClick();
                setDropdownOpen(false);
              }
            }}
            className="flex flex-col items-center justify-center flex-1 py-2 text-gray-600 hover:text-orange-500 transition-colors active:scale-95 min-h-[64px]"
          >
            <i className={`fas fa-bars text-xl mb-1`}></i>
            <span className="text-xs font-medium leading-tight">Menu</span>
          </button>

          {/* Cart Button (Consumer Only) */}
          {isConsumer && (
            <button
              onClick={toggleCart}
              className="flex flex-col items-center justify-center flex-1 py-2 text-gray-600 hover:text-orange-500 transition-colors relative active:scale-95 min-h-[64px]"
            >
              <div className="relative mb-1">
                <i className="fas fa-shopping-cart text-xl"></i>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold shadow-md">
                    {cartItemsCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium leading-tight">Cart</span>
            </button>
          )}

          {/* Notifications Link */}
          <Link
            to="/alerts"
            className="flex flex-col items-center justify-center flex-1 py-2 text-gray-600 hover:text-orange-500 transition-colors active:scale-95 min-h-[64px]"
          >
            <i className="fas fa-bell text-xl mb-1"></i>
            <span className="text-xs font-medium leading-tight">Alerts</span>
          </Link>

          {/* Account Button (Toggles Mobile Profile Overlay) */}
          <button
            ref={mobileButtonRef} // Optional ref for mobile button
            onClick={() => {
              setDropdownOpen(!dropdownOpen);
              if (onMenuClick) {
                /* Optionally close sidebar if open */
              }
            }}
            className="flex flex-col items-center justify-center flex-1 py-2 text-gray-600 hover:text-orange-500 transition-colors active:scale-95 min-h-[64px]"
          >
            <i className="fas fa-user-circle text-xl mb-1"></i>
            <span className="text-xs font-medium leading-tight">Account</span>
          </button>
        </div>
      </div>

      {/* --- MOBILE PROFILE DROPDOWN OVERLAY (Bottom Sheet - Remains the same) --- */}
      {dropdownOpen && (
        <div
          className="sm:hidden fixed inset-0 bg-black bg-opacity-50 z-[60] animate-fade-in"
          onClick={() => setDropdownOpen(false)}
        >
          {/* ... (Content of mobile profile overlay remains unchanged) ... */}
          <div
            className="absolute bottom-16 left-0 w-full bg-white rounded-t-2xl shadow-xl animate-slide-up"
            ref={mobileDropdownRef}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-2">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {(
                      currentUser?.name?.charAt(0) ||
                      currentUser?.email?.charAt(0) ||
                      "U"
                    ).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {currentUser?.name?.split(" ")[0] ||
                        currentUser?.email?.split("@")[0] ||
                        "Account"}
                    </h3>
                    <p className="text-xs text-gray-500">{navbarTitle()}</p>
                  </div>
                </div>
                <button
                  onClick={() => setDropdownOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>

              {currentUser ? (
                <>
                  <Link
                    to={profileLink()}
                    className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <i
                      className={`fas ${
                        isConsumer ? "fa-cog" : "fa-user"
                      } w-5 text-center text-gray-500`}
                    ></i>
                    {isConsumer ? "Settings" : "Profile"}
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={logoutLoading}
                    className="w-full flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium text-left disabled:opacity-50"
                  >
                    <i className="fas fa-sign-out-alt w-5 text-center text-gray-500"></i>
                    {logoutLoading ? "Logging Out..." : "Logout"}
                  </button>
                </>
              ) : (
                // Added parentheses
                <>
                  <Link
                    to="/consumer/login"
                    className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <i className="fas fa-user w-5 text-center text-gray-500"></i>
                    Login as Customer
                  </Link>
                  <Link
                    to="/vendor/login"
                    className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <i className="fas fa-store w-5 text-center text-gray-500"></i>
                    Login as Vendor
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Side Cart (Only rendered if consumer and service exists) */}
      {isConsumer && ConsumerListService && (
        <SideCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      )}

      {/* --- Styles (Remains the same) --- */}
      <style>{`
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }

        /* Safe area padding for notched devices (iOS) */
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }

        /* Add bottom padding to body ONLY when mobile navbar is present */
        @media (max-width: 639px) { /* sm breakpoint */
          body {
            /* Adjust 80px if the mobile navbar height changes significantly. */
            padding-bottom: calc(80px + env(safe-area-inset-bottom));
          }
        }
      `}</style>
    </>
  );
};

export default DashboardNavbar;
