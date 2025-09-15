import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-secondary text-gray-400 py-8 px-4 mt-auto">
      <div className="max-w-6xl mx-auto">
        <div className="border-t border-gray-800 mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <h3 className="text-xl font-bold mb-3">Locarto</h3>
            <p className="text-gray-400 mb-3 text-sm">Your local marketplace for unique finds and services.</p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-base mb-3">For Customers</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">How to Buy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Returns & Refunds</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Customer Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">FAQs</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-base mb-3">For Vendors</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">How to Sell</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Vendor Fees</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Vendor Resources</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Success Stories</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-base mb-3">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-4 text-center text-gray-400">
          <p className="text-sm">&copy; 2025 Locarto. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;