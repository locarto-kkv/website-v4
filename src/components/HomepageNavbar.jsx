// src/components/HomepageNavbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const HomepageNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const { currentUser, logout } = useAuthStore();

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

  console.log("Homepage Navbar: userType: ", currentUser?.type);

  return (
    <nav className="bg-white shadow-md py-3 px-4 flex justify-between items-center sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center">
        <Link to="/" className="text-2xl font-bold text-orange-500">
          Locarto
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
            to="/landing"
            className="py-2 md:py-0 text-gray-700 hover:text-orange-500 font-medium transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            About Us
          </Link>
          <a
            href="#categories"
            className="py-2 md:py-0 text-gray-700 hover:text-orange-500 font-medium transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Categories
          </a>
          <a
            href="#how-it-works"
            className="py-2 md:py-0 text-gray-700 hover:text-orange-500 font-medium transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            How It Works
          </a>
          <a
            href="#testimonials"
            className="py-2 md:py-0 text-gray-700 hover:text-orange-500 font-medium transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Testimonials
          </a>
        </div>
      </div>

      {/* Right Side Elements */}
      <div className="flex items-center space-x-3">
        {/* Cart Icon */}
        <Link
          to="/cart"
          className="text-gray-700 hover:text-orange-500 transition-colors"
        >
          <i className="fas fa-shopping-cart text-lg"></i>
        </Link>

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
                <Link
                  to="/vendor/dashboard"
                  className="block px-4 py-3 hover:bg-gray-100 border-b border-gray-100 text-gray-700"
                  onClick={() => setDropdownOpen(false)}
                >
                  Dashboard
                </Link>
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
    </nav>
  );
};

export default HomepageNavbar;