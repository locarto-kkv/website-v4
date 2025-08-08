import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-secondary text-gray-400 py-12 px-6 mt-auto">
      <div className="max-w-6xl mx-auto">
        <div className="border-t border-gray-800 mb-10"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Locarto</h3>
            <p className="text-gray-400 mb-4">Your local marketplace for unique finds and services.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">For Customers</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">How to Buy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Returns & Refunds</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Customer Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">FAQs</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">For Vendors</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">How to Sell</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Vendor Fees</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Vendor Resources</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Success Stories</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-400">
          <p>&copy; 2025 Locarto. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;