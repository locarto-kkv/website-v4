import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center">
        <Link to="/" className="text-2xl font-bold text-primary">Locarto</Link>
      </div>
      
      <div className="hidden md:flex space-x-8">
        <Link to="/" className="nav-link text-gray-700 hover:text-primary font-medium">Home</Link>
        <a href="#categories" className="nav-link text-gray-700 hover:text-primary font-medium">Categories</a>
        <a href="#how-it-works" className="nav-link text-gray-700 hover:text-primary font-medium">How It Works</a>
        <a href="#testimonials" className="nav-link text-gray-700 hover:text-primary font-medium">Testimonials</a>
      </div>
      
      <div className="relative">
        <button 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition flex items-center"
        >
          <i className="fas fa-user mr-2"></i> Login
          <i className="fas fa-chevron-down ml-2 text-xs"></i>
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50">
            <Link 
              to="/login/customer" 
              className="block px-4 py-3 hover:bg-gray-100 border-b border-gray-100"
              onClick={() => setDropdownOpen(false)}
            >
              <i className="fas fa-user mr-2 text-primary"></i> Login as Customer
            </Link>
            <Link 
              to="/login/vendor" 
              className="block px-4 py-3 hover:bg-gray-100"
              onClick={() => setDropdownOpen(false)}
            >
              <i className="fas fa-store mr-2 text-primary"></i> Login as Vendor
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;