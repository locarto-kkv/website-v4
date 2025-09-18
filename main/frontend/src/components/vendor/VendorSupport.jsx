import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const VendorSupport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  // Handle search functionality
  const handleSearch = (e) => {
    e.preventDefault();
    // In a real app, this would filter FAQs based on searchQuery
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Customer Support</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg 
                  className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>

            {/* Frequently Asked Questions */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Frequently Asked Questions</h2>
              
              {/* Account Related */}
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Account Related</h3>
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-800 mb-2">How do I reset my password?</h4>
                  <p className="text-gray-600">You can reset your password by going to the 'Settings' page and clicking on the 'Change Password' button. Follow the instructions sent to your email.</p>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-800 mb-2">How can I update my billing information?</h4>
                  <p className="text-gray-600">Billing information can be updated in the 'Settings' tab under the 'Billing' section. Make sure to save your changes.</p>
                </div>
              </div>

              {/* Order Related */}
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Order Related</h3>
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-800 mb-2">How do I cancel my order?</h4>
                  <p className="text-gray-600">You can cancel your order from the 'Orders' page. Find the order you wish to cancel and click the 'Cancel Order' button.</p>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-800 mb-2">What is your refund policy?</h4>
                  <p className="text-gray-600">We offer a 30-day money-back guarantee on all our plans. If you are not satisfied, you can request a refund within 30 days of your purchase.</p>
                </div>
              </div>

              {/* Products Related */}
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Products Related</h3>
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-800 mb-2">How do I upgrade my plan?</h4>
                  <p className="text-gray-600">You can upgrade your plan from the 'Billing' section in your account settings. Select the plan you want and follow the prompts to complete the upgrade.</p>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-800 mb-2">Can I download my purchased products?</h4>
                  <p className="text-gray-600">Yes, you can download your purchased products from the 'Downloads' section of your account. All purchases are available for download after payment confirmation.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Quick Actions</h2>
          
          <div className="space-y-4">
            <button 
              className="w-full flex items-center px-4 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => window.open('/about-memberships', '_blank')}
            >
              <svg className="w-5 h-5 mr-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              About Memberships
            </button>

            <button 
              className="w-full flex items-center px-4 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => window.open('/reset-password', '_blank')}
            >
              <svg className="w-5 h-5 mr-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Reset Password
            </button>

            <button 
              className="w-full flex items-center px-4 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => window.open('/cancel-order', '_blank')}
            >
              <svg className="w-5 h-5 mr-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel Order
            </button>

            <button 
              className="w-full flex items-center px-4 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => window.open('/transactions', '_blank')}
            >
              <svg className="w-5 h-5 mr-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View Transactions
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Need More Help?</h3>
            
            <div className="space-y-3">
              <button 
                className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => window.open('mailto:support@yourcompany.com', '_blank')}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </button>

              <button 
                className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => window.open('tel:+1234567890', '_blank')}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.54 1.06l-1.518.759a11.042 11.042 0 006.105 6.105l.759-1.518a1 1 0 011.06-.54l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Phone
              </button>

              <button 
                className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => window.open('https://wa.me/1234567890', '_blank')}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16h.01M13 16h.01M17 16h.01M9 14h.01M13 14h.01M17 14h.01M8 12h.01M12 12h.01M16 12h.01M8 18h.01M12 18h.01M16 18h.01M8 8h.01M12 8h.01M16 8h.01M8 6h.01M12 6h.01M16 6h.01M8 4h.01M12 4h.01M16 4h.01M8 2h.01M12 2h.01M16 2h.01" />
                </svg>
                WhatsApp
              </button>

              <button 
                className="w-full flex items-center justify-center px-4 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                onClick={() => alert('Chatbot functionality would be implemented here')}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16h.01M13 16h.01M17 16h.01M9 14h.01M13 14h.01M17 14h.01M8 12h.01M12 12h.01M16 12h.01M8 18h.01M12 18h.01M16 18h.01M8 8h.01M12 8h.01M16 8h.01M8 6h.01M12 6h.01M16 6h.01M8 4h.01M12 4h.01M16 4h.01M8 2h.01M12 2h.01M16 2h.01" />
                </svg>
                Chatbot
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorSupport;