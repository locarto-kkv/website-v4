// src/pages/vendor/dashboard/VendorSupport.jsx
import React, { useState } from 'react';
// Removed useLocation as it wasn't used directly for rendering logic
// import { useLocation } from 'react-router-dom';

const VendorSupport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    message: ''
  });
  const [showTicketForm, setShowTicketForm] = useState(false);
  // const location = useLocation(); // Keep if needed for other logic

  // --- Data Definitions ---
  const faqCategories = [
    { id: 'all', name: 'All', icon: 'fas fa-th-large', count: 6 }, // Updated count
    { id: 'account', name: 'Account', icon: 'fas fa-user-circle', count: 2 },
    { id: 'orders', name: 'Orders', icon: 'fas fa-shopping-cart', count: 2 },
    { id: 'products', name: 'Products', icon: 'fas fa-box', count: 1 },
    { id: 'billing', name: 'Billing', icon: 'fas fa-credit-card', count: 1 }
  ];

  const faqData = [
    { id: 1, category: 'account', question: 'How do I reset my password?', answer: 'Go to Settings > Account > Change Password and follow the email instructions. Check spam if needed.', tags: ['password', 'reset', 'login', 'security'] },
    { id: 2, category: 'account', question: 'How can I update my billing information?', answer: 'Update billing info in Settings > Business Settings > Bank & Payment Details. Save changes.', tags: ['billing', 'payment', 'update', 'settings'] },
    { id: 3, category: 'orders', question: 'How do I cancel an order?', answer: 'Cancel within 24 hours from the Orders page. Find the order and click "Cancel Order". Refunds take 3-5 business days.', tags: ['cancel', 'order', 'refund'] },
    { id: 4, category: 'orders', question: 'What is your refund policy?', answer: 'We offer a 30-day money-back guarantee. Request refunds within 30 days. Digital products are non-refundable after download.', tags: ['refund', 'policy', 'money-back', 'guarantee'] },
    { id: 5, category: 'products', question: 'How do I add a new product?', answer: 'Go to Products > Add Product. Fill in details (name, description, price, category) and upload images.', tags: ['add', 'product', 'new', 'create'] },
    { id: 6, category: 'billing', question: 'How do I upgrade my plan?', answer: 'Upgrade in Settings > Business Settings. Select your desired plan and follow the prompts.', tags: ['upgrade', 'plan', 'billing', 'subscription'] }
  ];

  const contactMethods = [
    { title: 'Email Support', subtitle: 'support@locarto.com', icon: 'fas fa-envelope', color: 'bg-blue-500 hover:bg-blue-600', action: () => window.open('mailto:support@locarto.com', '_blank') },
    { title: 'Live Chat', subtitle: 'Available 9 AM - 6 PM IST', icon: 'fas fa-comments', color: 'bg-green-500 hover:bg-green-600', action: () => alert('Live chat feature coming soon!') },
    { title: 'Phone Support', subtitle: '+91 80123 45678', icon: 'fas fa-phone', color: 'bg-orange-500 hover:bg-orange-600', action: () => window.open('tel:+918012345678', '_blank') },
    { title: 'WhatsApp', subtitle: 'Quick responses', icon: 'fab fa-whatsapp', color: 'bg-green-600 hover:bg-green-700', action: () => window.open('https://wa.me/918012345678', '_blank') } // Ensure number is correct
  ];
  // --- End Data Definitions ---


  // --- Event Handlers ---
  const handleSearch = (e) => {
    // Basic search on input change, no need for form submission prevention usually
    setSearchQuery(e.target.value);
  };

  const toggleFAQ = (faqId) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    // Add actual submission logic here (e.g., API call)
    console.log("Submitting ticket:", ticketForm);
    alert('Support ticket submitted successfully!'); // Replace with toast/better feedback
    setTicketForm({ subject: '', category: '', priority: 'medium', message: '' });
    setShowTicketForm(false);
  };
  // --- End Event Handlers ---

  // Filter FAQs based on search and category
  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const lowerSearch = searchQuery.toLowerCase();
    const matchesSearch = faq.question.toLowerCase().includes(lowerSearch) ||
                         faq.answer.toLowerCase().includes(lowerSearch) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(lowerSearch));
    return matchesCategory && matchesSearch;
  });


  return (
    // Removed outer padding (p-6) - assuming layout provides it
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Title removed - handled by layout */}

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-4 sm:space-y-6">
          {/* Search and Filters Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
            {/* Search Input */}
            <div className="relative mb-4 sm:mb-6">
              <input
                type="text"
                placeholder="Search help articles..."
                value={searchQuery}
                onChange={handleSearch} // Changed from onSubmit on form to onChange on input
                className="w-full px-4 py-3 sm:py-4 pl-10 sm:pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base" // Adjusted padding and sizes
              />
              <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base"></i>
              {/* Removed search button - search happens on type */}
            </div>

            {/* Category Filters - Scrollable on mobile */}
            <div className="w-full overflow-x-auto pb-2 sm:pb-0">
               <div className="flex flex-nowrap sm:flex-wrap gap-2">
                {faqCategories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex-shrink-0 flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium transition-all text-xs sm:text-sm whitespace-nowrap ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <i className={`${category.icon} text-xs sm:text-sm`}></i>
                    {category.name}
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs ml-1 ${ selectedCategory === category.id ? 'bg-white/20' : 'bg-gray-200'}`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ Section Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-question-circle text-blue-600 text-sm sm:text-base"></i>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Frequently Asked Questions</h2>
              </div>
              <span className="text-xs sm:text-sm text-gray-500">
                {filteredFAQs.length} articles found
              </span>
            </div>

            {/* FAQ List or Empty State */}
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-10 sm:py-12">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-search text-gray-400 text-xl sm:text-2xl"></i>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600 text-xs sm:text-sm">Try adjusting your search or category.</p>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {filteredFAQs.map((faq) => (
                  <div key={faq.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:border-gray-300 transition-colors">
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full flex items-start sm:items-center justify-between p-3 sm:p-4 text-left group" // Adjusted padding
                      aria-expanded={expandedFAQ === faq.id}
                    >
                       {/* Icon and Question */}
                       <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0"> {/* Ensure flex-1 and min-w-0 */}
                          <div className={`mt-0.5 sm:mt-0 flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                            expandedFAQ === faq.id ? 'bg-blue-500' : 'bg-blue-100 group-hover:bg-blue-200'
                          }`}>
                              <i className={`fas ${faqCategories.find(cat => cat.id === faq.category)?.icon || 'fa-question'} text-[10px] sm:text-xs ${ // Fallback icon
                                expandedFAQ === faq.id ? 'text-white' : 'text-blue-600'
                              }`}></i>
                          </div>
                          <h4 className="font-semibold text-gray-900 text-sm sm:text-base flex-1 break-words"> {/* Allow word break */}
                            {faq.question}
                          </h4>
                        </div>
                        {/* Chevron */}
                      <i className={`fas fa-chevron-${expandedFAQ === faq.id ? 'up' : 'down'} text-gray-400 text-xs sm:text-sm flex-shrink-0 ml-2 mt-1 sm:mt-0 transition-transform duration-300`}></i>
                    </button>

                    {/* Answer Section */}
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${ expandedFAQ === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0' }`}>
                      <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-0 bg-gray-50 border-t border-gray-200"> {/* Adjusted padding */}
                         <div className="pl-8 sm:pl-11 mt-2"> {/* Indent content */}
                            <p className="text-gray-700 leading-relaxed mb-2 sm:mb-3 text-xs sm:text-sm">{faq.answer}</p>
                            {/* Tags */}
                            <div className="flex flex-wrap gap-1 sm:gap-1.5">
                              {faq.tags.map(tag => (
                                <span key={tag} className="px-1.5 sm:px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] sm:text-xs font-medium">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Area */}
        <div className="lg:col-span-1 space-y-4 sm:space-y-6">
          {/* Contact Support Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="fas fa-life-ring text-orange-600 text-sm sm:text-base"></i>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900">Need More Help?</h2>
            </div>
            {/* Contact Buttons */}
            <div className="space-y-2 sm:space-y-3">
              {contactMethods.map((method, index) => (
                <button
                  key={index}
                  onClick={method.action}
                  className={`w-full flex items-center gap-2 sm:gap-3 p-3 ${method.color} text-white rounded-xl transition-all hover:shadow-md transform hover:scale-105`}
                >
                  <i className={`${method.icon} text-sm sm:text-base w-5 text-center`}></i> {/* Fixed width icon */}
                  <div className="text-left flex-1">
                    <div className="font-semibold text-xs sm:text-sm">{method.title}</div>
                    <div className="text-[10px] sm:text-xs opacity-90">{method.subtitle}</div>
                  </div>
                   <i className="fas fa-arrow-right text-xs opacity-70"></i> {/* Added arrow */}
                </button>
              ))}
            </div>
          </div>

          {/* Create Support Ticket Card */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-lg p-4 sm:p-6 text-white">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="fas fa-ticket-alt text-white text-sm sm:text-base"></i>
              </div>
              <h3 className="font-bold text-base sm:text-lg">Create Support Ticket</h3>
            </div>
            <p className="text-xs sm:text-sm opacity-90 mb-4">Can't find an answer? Let us know.</p> {/* Shortened */}
            <button
              onClick={() => setShowTicketForm(true)}
              className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white py-2.5 sm:py-3 rounded-lg font-semibold transition-all hover:shadow-md transform hover:scale-105 text-xs sm:text-sm"
            >
              Create Ticket
            </button>
          </div>

          {/* Support Hours Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="fas fa-clock text-green-600 text-sm sm:text-base"></i>
              </div>
              <h3 className="font-bold text-gray-900 text-base sm:text-lg">Support Hours</h3>
            </div>
            {/* Hours List */}
            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Mon - Fri</span>
                <span className="font-medium">9 AM - 6 PM IST</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Saturday</span>
                <span className="font-medium">10 AM - 4 PM IST</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sunday</span>
                <span className="font-medium text-red-600">Closed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support Ticket Modal - Responsive adjustments */}
      {showTicketForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"> {/* Added overflow-y-auto */}
           {/* Responsive max-width, max-height, flex column */}
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-md md:max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 sm:p-6 flex-shrink-0">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold">Create Support Ticket</h3>
                  <p className="text-orange-100 mt-1 text-xs sm:text-sm">Response within 24 hours</p>
                </div>
                <button onClick={() => setShowTicketForm(false)} className="p-2 -mr-2 hover:bg-white/20 rounded-lg transition-colors" aria-label="Close modal">
                  <i className="fas fa-times text-lg sm:text-xl"></i>
                </button>
              </div>
            </div>

            {/* Modal Body - Scrollable */}
            <form onSubmit={handleTicketSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-grow">
              {/* Subject */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1 sm:mb-1.5">Subject *</label>
                <input type="text" required value={ticketForm.subject} onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                  className="w-full p-3 sm:p-3.5 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                  placeholder="e.g., Issue with order #12345"/>
              </div>

              {/* Category & Priority - Stack on mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1 sm:mb-1.5">Category *</label>
                  <select required value={ticketForm.category} onChange={(e) => setTicketForm({...ticketForm, category: e.target.value})}
                    className="w-full p-3 sm:p-3.5 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all bg-white appearance-none">
                    <option value="">Select category</option>
                    <option value="account">Account Issues</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="technical">Technical Support</option>
                    <option value="products">Product Issues</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1 sm:mb-1.5">Priority</label>
                  <select value={ticketForm.priority} onChange={(e) => setTicketForm({...ticketForm, priority: e.target.value})}
                    className="w-full p-3 sm:p-3.5 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all bg-white appearance-none">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1 sm:mb-1.5">Message *</label>
                <textarea required rows="4" // Reduced rows
                  value={ticketForm.message} onChange={(e) => setTicketForm({...ticketForm, message: e.target.value})}
                  className="w-full p-3 sm:p-3.5 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all resize-none"
                  placeholder="Describe your issue in detail..."></textarea>
              </div>

              {/* Modal Footer - Stick to bottom */}
               <div className="flex items-center justify-end gap-3 sm:gap-4 pt-4 sm:pt-5 border-t border-gray-200">
                  <button type="button" onClick={() => setShowTicketForm(false)}
                    className="px-4 sm:px-6 py-2 sm:py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all text-xs sm:text-sm">
                    Cancel
                  </button>
                  <button type="submit"
                    className="px-5 sm:px-8 py-2 sm:py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 font-semibold transition-all shadow-md hover:shadow-lg transform hover:scale-105 text-xs sm:text-sm">
                    Submit Ticket
                  </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorSupport;