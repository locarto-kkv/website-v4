// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.jsx";
import SideCart from "../components/consumer/SideCart.jsx";
import { useConsumerDataStore } from "../store/consumer/consumerDataStore.jsx";
import locartoImg from "../assets/locarto.png";
import toast from "react-hot-toast";

const Navbar = ({ pageType = "homepage" }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);

  const lists = useConsumerDataStore((state) => state.lists);

  useEffect(() => {
    const loadCart = async () => {
      if (currentUser?.type === "consumer") {
        try {
          setCartItemsCount(lists?.cart?.length || 0);
        } catch (error) {
          console.log("Error loading cart items count:", error);
          setCartItemsCount(0);
        }
      } else {
        setCartItemsCount(0);
      }
    };
    loadCart();
  }, [currentUser, isCartOpen]);

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  const handleSectionNavigation = (sectionId) => {
    setMobileMenuOpen(false);

    if (location.pathname === "/home") {
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      navigate(`/home#${sectionId}`);
    }
  };

  const handleDashboardNavigation = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);

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

  const handleLogout = () => {
    if (currentUser?.type) {
      logout(currentUser.type);
    }
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* DESKTOP & TABLET NAVBAR - Fixed Top */}
      <nav className="hidden sm:flex bg-white shadow-md h-[70px] px-4 justify-between items-center fixed top-0 left-0 w-full z-50 border-b border-gray-100">
        {/* Left Column (Logo) */}
        <div className="flex-1 flex justify-start">
          <Link
            to="/"
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <img
              src={locartoImg}
              alt="Locarto"
              className="h-12 sm:h-14 w-auto object-contain scale-110 sm:scale-125 translate-y-[2px]"
            />
          </Link>
        </div>

        {/* Center Column (Nav Links) */}
        <div className="flex-1 flex justify-center items-center">
          <div className="flex items-center space-x-6 lg:space-x-8">
            <Link
              to={pageType === "landing" ? "/home" : "/"}
              className="text-gray-700 hover:text-orange-500 font-medium transition-colors text-sm lg:text-base nav-link"
            >
              {pageType === "landing" ? "About Us" : "Landing"}
            </Link>
            <Link
              to="/map"
              className="text-gray-700 hover:text-orange-500 font-medium transition-colors text-sm lg:text-base nav-link"
            >
              Categories
            </Link>
            <button
              onClick={handleDashboardNavigation}
              className="text-gray-700 hover:text-orange-500 font-medium transition-colors text-sm lg:text-base nav-link"
            >
              Dashboard
            </button>
            <button
              onClick={() => handleSectionNavigation("testimonials")}
              className="text-gray-700 hover:text-orange-500 font-medium transition-colors text-sm lg:text-base nav-link"
            >
              Testimonials
            </button>
          </div>
        </div>

        {/* Right Column (Cart, Notifications & Profile) */}
        <div className="flex-1 flex justify-end items-center space-x-3 sm:space-x-4">
          {/* Cart Button */}
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

          {/* Notifications Button */}
          <button
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            aria-label="View Notifications"
          >
            <i className="fas fa-bell text-lg sm:text-xl text-gray-700"></i>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              ref={buttonRef}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="bg-gray-100 text-gray-700 rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-gray-200 transition ring-1 ring-gray-200 hover:ring-orange-300"
              aria-label="User menu"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              {currentUser ? (
                <i className="fas fa-user text-sm sm:text-base"></i>
              ) : (
                <i className="fas fa-user-plus text-sm sm:text-base"></i>
              )}
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50 border border-gray-100 overflow-hidden"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
              >
                {currentUser ? (
                  <>
                    <button
                      onClick={handleDashboardNavigation}
                      className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100 transition-colors flex items-center gap-2"
                      role="menuitem"
                    >
                      <i className="fas fa-th-large w-4 text-center text-gray-500"></i>
                      Dashboard
                    </button>
                    <button
                      className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                      onClick={handleLogout}
                      role="menuitem"
                    >
                      <i className="fas fa-sign-out-alt w-4 text-center text-gray-500"></i>
                      Logout
                    </button>
                  </>
                ) : (
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
      </nav>

      {/* MOBILE TOP BAR - Fixed */}
      <nav className="sm:hidden bg-white shadow-md h-[60px] px-4 flex items-center fixed top-0 left-0 w-full z-50 border-b border-gray-100">
        <Link
          to="/"
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <img
            src={locartoImg}
            alt="Locarto"
            className="h-10 w-auto object-contain scale-110"
          />
        </Link>
      </nav>

      {/* MOBILE BOTTOM BAR - Fixed with extra padding for content */}
      <div className="sm:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 shadow-lg safe-area-bottom">
        <div className="flex items-stretch justify-around px-2">
          {/* Menu Button */}
          <button
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="flex flex-col items-center justify-center flex-1 py-2 text-gray-600 hover:text-orange-500 transition-colors active:scale-95 min-h-[64px]"
          >
            <i
              className={`fas ${
                mobileMenuOpen ? "fa-times" : "fa-bars"
              } text-xl mb-1`}
            ></i>
            <span className="text-xs font-medium leading-tight">Menu</span>
          </button>

          {/* Cart Button */}
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

          {/* Profile Button */}
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex flex-col items-center justify-center flex-1 py-2 text-gray-600 hover:text-orange-500 transition-colors active:scale-95 min-h-[64px]"
          >
            <i className="fas fa-user-circle text-xl mb-1"></i>
            <span className="text-xs font-medium leading-tight">Account</span>
          </button>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div
          className="sm:hidden fixed inset-0 bg-black bg-opacity-50 z-40 animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="absolute bottom-16 left-0 w-full bg-white rounded-t-2xl shadow-xl max-h-[60vh] overflow-y-auto animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-2">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-800">Menu</h3>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>

              <Link
                to={pageType === "homepage" ? "/home" : "/"}
                className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded-lg transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <i className="fas fa-home w-5 text-center"></i>
                {pageType === "homepage" ? "About Us" : "Home"}
              </Link>

              <Link
                to="/map"
                className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded-lg transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <i className="fas fa-th-large w-5 text-center"></i>
                Categories
              </Link>

              <button
                onClick={handleDashboardNavigation}
                className="w-full flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded-lg transition-colors font-medium text-left"
              >
                <i className="fas fa-chart-pie -alt w-5 text-center"></i>
                Dashboard
              </button>

              <button
                onClick={() => {
                  handleSectionNavigation("testimonials");
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded-lg transition-colors font-medium text-left"
              >
                <i className="fas fa-star w-5 text-center"></i>
                Testimonials
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE PROFILE DROPDOWN OVERLAY */}
      {dropdownOpen && (
        <div
          className="sm:hidden fixed inset-0 bg-black bg-opacity-50 z-40 animate-fade-in"
          onClick={() => setDropdownOpen(false)}
        >
          <div
            className="absolute bottom-16 left-0 w-full bg-white rounded-t-2xl shadow-xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-2">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-800">Account</h3>
                <button
                  onClick={() => setDropdownOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>

              {currentUser ? (
                <>
                  <button
                    onClick={handleDashboardNavigation}
                    className="w-full flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium text-left"
                  >
                    <i className="fas fa-th-large w-5 text-center text-gray-500"></i>
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium text-left"
                  >
                    <i className="fas fa-sign-out-alt w-5 text-center text-gray-500"></i>
                    Logout
                  </button>
                </>
              ) : (
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

      {/* Side Cart */}
      <SideCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Styles with bottom padding spacer */}
      <style>{`
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .nav-link { position: relative; padding-bottom: 4px; }
        .nav-link::after { content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 2px; background-color: #f97316; transition: width 0.3s ease-out; }
        .nav-link:hover::after { width: 100%; }

        /* Safe area padding for notched devices */
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }

        /* Add bottom padding to body when mobile navbar is present */
        @media (max-width: 639px) {
          body {
            padding-bottom: calc(80px + env(safe-area-inset-bottom));
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
