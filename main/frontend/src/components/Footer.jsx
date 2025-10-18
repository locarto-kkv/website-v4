// src/components/Footer.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // <-- Import Link
import FAQModal from './FAQModal';

const Footer = () => {
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);

  return (
    <>
      <footer className="bg-secondary text-gray-400 py-8 sm:py-12 px-4 mt-auto">
        <div className="max-w-6xl mx-auto">
          {/* Decorative top border */}
          <div className="border-t border-gray-700 mb-6 sm:mb-8"></div>

          {/* Footer content grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            {/* Brand section */}
            <div className="space-y-3 sm:space-y-4 text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Locarto</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Your local marketplace for unique finds and services.
              </p>
              <div className="flex space-x-4 pt-2 justify-center sm:justify-start">
                <a
                  href="https://www.instagram.com/locarto.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label="Follow us on Instagram"
                >
                  <i className="fab fa-instagram text-xl sm:text-2xl"></i>
                </a>
              </div>
            </div>

            {/* Support section */}
            <div className="text-center sm:text-left">
              <h4 className="font-bold text-white text-base mb-3 sm:mb-4">Support</h4>
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <button
                    onClick={() => setIsFaqModalOpen(true)}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    FAQs
                  </button>
                </li>
              </ul>
            </div>

            {/* Company section */}
            <div className="text-center sm:text-left">
              <h4 className="font-bold text-white text-base mb-3 sm:mb-4">Company</h4>
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  {/* Updated Link */}
                  <Link
                    to="/privacy-policy" // <-- Change href to 'to' and set the route
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  {/* Keep Terms of Service as is, or update similarly if you create a page for it */}
                  <a
                    href="#" // Assuming this doesn't exist yet
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            {/* Placeholder for future section */}
            <div className="hidden lg:block"></div>
          </div>

          {/* Bottom copyright section */}
          <div className="border-t border-gray-700 pt-4 sm:pt-6 text-center">
            <p className="text-xs sm:text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Locarto. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* FAQ Modal */}
      <FAQModal
        isOpen={isFaqModalOpen}
        onClose={() => setIsFaqModalOpen(false)}
      />
    </>
  );
};

export default Footer;