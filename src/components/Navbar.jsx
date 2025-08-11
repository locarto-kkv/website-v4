import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && 
          dropdownRef.current && 
          !dropdownRef.current.contains(event.target) &&
          buttonRef.current &&
          !buttonRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center">
        <Link to="#main-content" className="text-xl font-medium text-gray-500">Locarto</Link>
      </div>
      
      {/* Navigation Links */}
      <div className="hidden md:flex space-x-8">
        <Link to="#main-content" className="nav-link text-gray-700 hover:text-gray-900 font-medium">Home</Link>
        <a href="#categories" className="nav-link text-gray-700 hover:text-gray-900 font-medium">Categories</a>
        <a href="#how-it-works" className="nav-link text-gray-700 hover:text-gray-900 font-medium">How It Works</a>
        <a href="#testimonials" className="nav-link text-gray-700 hover:text-gray-900 font-medium">Testimonials</a>
      </div>
      
      {/* Right Side Elements */}
      <div className="flex items-center space-x-4">
        {/* Cart Icon */}
        <Link to="/cart" className="text-gray-700 hover:text-gray-900">
          <i className="fas fa-shopping-cart text-lg"></i>
        </Link>

        {/* Circular Login Button */}
        <div className="relative">
          <button 
            ref={buttonRef}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-gray-200 text-gray-700 rounded-full w-9 h-9 flex items-center justify-center hover:bg-gray-300 transition"
          >
            <span className="text-lg">👤</span>
          </button>
          
          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div ref={dropdownRef} className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50">
              <Link 
                to="/login/customer" 
                className="block px-4 py-3 hover:bg-gray-100 border-b border-gray-100 text-gray-700"
                onClick={() => setDropdownOpen(false)}
              >
                Login as Customer
              </Link>
              <Link 
                to="/login/vendor" 
                className="block px-4 py-3 hover:bg-gray-100 text-gray-700"
                onClick={() => setDropdownOpen(false)}
              >
                Login as Vendor
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
