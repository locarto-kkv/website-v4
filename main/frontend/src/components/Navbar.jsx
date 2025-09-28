// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import SideCart from "../pages/consumer/SideCart.jsx";
import { ConsumerListService } from "../services/consumer/consumerListService";
import locartoImg from "../assets/locarto.png";

const Navbar = ({ pageType = "landing" }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { currentUser, logout } = useAuthStore();
  const { getList } = ConsumerListService;

  // Load cart items
  useEffect(() => {
    const loadCart = async () => {
      try {
        const res = await getList();
        if (res.cart) {
          setCartItems(res.cart);
        }
      } catch (error) {
        console.log("Error loading cart items");
      }
    };
    // loadCart();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle cart open/close
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  // Handle navigation to sections
  const handleSectionNavigation = (sectionId) => {
    setMobileMenuOpen(false);

    // If already on landing page, scroll to section
    if (location.pathname === "/landing") {
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      // Navigate to landing page with hash
      navigate(`/landing#${sectionId}`);
    }
  };

  // Handle dashboard navigation based on user role with auto-scroll to top
  const handleDashboardNavigation = () => {
    setDropdownOpen(false);

    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Navigate to appropriate dashboard
    if (currentUser?.type === "vendor") {
      navigate("/vendor/dashboard");
    } else if (currentUser?.type === "consumer") {
      navigate("/consumer/dashboard");
    } else {
      navigate("/consumer/login");
    }
  };

  return (
    <nav className="bg-white shadow-md py-3 px-4 flex justify-between items-center sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center">
        <Link to="/" className="flex items-center">
          <img 
            src={locartoImg} 
            alt="Locarto" 
            className="h-8 w-auto" // Adjust size as needed
          />
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-gray-700"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <i
          className={`fas ${mobileMenuOpen ? "fa-times" : "fa-bars"} text-xl`}
        ></i>
      </button>

      {/* Navigation Links */}
      <div
        className={`absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none z-40 ${
          mobileMenuOpen ? "block" : "hidden"
        } md:block`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:space-x-6 p-4 md:p-0">
          <Link
            to={pageType === "homepage" ? "/landing" : "/"}
            className="py-2 md:py-0 text-gray-700 hover:text-orange-500 font-medium transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            {pageType === "homepage" ? "About Us" : "Home"}
          </Link>

          {/* Categories Button */}
          <button
            onClick={() => handleSectionNavigation("categories")}
            className="py-2 md:py-0 text-gray-700 hover:text-orange-500 font-medium transition-colors text-left"
          >
            Categories
          </button>

          {/* How It Works Button */}
          <button
            onClick={() => handleSectionNavigation("how-it-works")}
            className="py-2 md:py-0 text-gray-700 hover:text-orange-500 font-medium transition-colors text-left"
          >
            How It Works
          </button>

          {/* Testimonials Button */}
          <button
            onClick={() => handleSectionNavigation("testimonials")}
            className="py-2 md:py-0 text-gray-700 hover:text-orange-500 font-medium transition-colors text-left"
          >
            Testimonials
          </button>
        </div>
      </div>

      {/* Right Side Elements */}
      <div className="flex items-center space-x-3">
        {/* Cart Icon - Click to open side cart */}
        <button
          onClick={toggleCart}
          className="text-gray-700 hover:text-orange-500 transition-colors relative"
        >
          <i className="fas fa-shopping-cart text-lg"></i>
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </button>

        {/* Circular Login Button */}
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-gray-200 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-300 transition"
          >
            <span className="text-sm">👤</span>
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen &&
            (currentUser ? (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50"
              >
                <button
                  onClick={handleDashboardNavigation}
                  className="block w-full text-left px-4 py-3 hover:bg-gray-100 border-b border-gray-100 text-gray-700"
                >
                  Dashboard
                </button>
                <button
                  className="block w-full text-left px-4 py-3 hover:bg-gray-100 text-gray-700"
                  onClick={() => {
                    logout(currentUser.type);
                    setDropdownOpen(false);
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50"
              >
                <Link
                  to="/consumer/login"
                  className="block px-4 py-3 hover:bg-gray-100 border-b border-gray-100 text-gray-700"
                  onClick={() => setDropdownOpen(false)}
                >
                  Login as Customer
                </Link>
                <Link
                  to="/vendor/login"
                  className="block px-4 py-3 hover:bg-gray-100 text-gray-700"
                  onClick={() => setDropdownOpen(false)}
                >
                  Login as Vendor
                </Link>
              </div>
            ))}
        </div>
      </div>

      {/* Side Cart */}
      <SideCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  );
};

export default Navbar;
