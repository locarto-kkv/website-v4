// src/pages/vendor/dashboard/VendorSupport.jsx
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

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
  const location = useLocation();

  const faqCategories = [
    { id: 'all', name: 'All Categories', icon: 'fas fa-th-large', count: 12 },
    { id: 'account', name: 'Account', icon: 'fas fa-user-circle', count: 4 },
    { id: 'orders', name: 'Orders', icon: 'fas fa-shopping-cart', count: 3 },
    { id: 'products', name: 'Products', icon: 'fas fa-box', count: 3 },
    { id: 'billing', name: 'Billing', icon: 'fas fa-credit-card', count: 2 }
  ];

  const faqData = [
    {
      id: 1,
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'You can reset your password by going to the Settings page and clicking on Change Password. Follow the instructions sent to your email. Make sure to check your spam folder if you don\'t receive the email within 5 minutes.',
      tags: ['password', 'reset', 'login', 'security']
    },
    {
      id: 2,
      category: 'account',
      question: 'How can I update my billing information?',
      answer: 'Billing information can be updated in the Settings tab under the Business Settings section. Navigate to Bank & Payment Details and make sure to save your changes after updating.',
      tags: ['billing', 'payment', 'update', 'settings']
    },
    {
      id: 3,
      category: 'orders',
      question: 'How do I cancel my order?',
      answer: 'You can cancel your order from the Orders page within 24 hours of placing it. Find the order you wish to cancel and click the Cancel Order button. Refunds will be processed within 3-5 business days.',
      tags: ['cancel', 'order', 'refund']
    },
    {
      id: 4,
      category: 'orders',
      question: 'What is your refund policy?',
      answer: 'We offer a 30-day money-back guarantee on all our services. If you are not satisfied, you can request a refund within 30 days of your purchase. Digital products are non-refundable after download.',
      tags: ['refund', 'policy', 'money-back', 'guarantee']
    },
    {
      id: 5,
      category: 'products',
      question: 'How do I add a new product?',
      answer: 'Navigate to the Products page and click the Add Product button. Fill in all required information including name, description, price, and category. You can also upload images to showcase your product.',
      tags: ['add', 'product', 'new', 'create']
    },
    {
      id: 6,
      category: 'billing',
      question: 'How do I upgrade my plan?',
      answer: 'You can upgrade your plan from the Settings section under Business Settings. Select the plan you want and follow the prompts to complete the upgrade. Changes take effect immediately.',
      tags: ['upgrade', 'plan', 'billing', 'subscription']
    }
  ];

  // Removed quickActions array

  const contactMethods = [
    {
      title: 'Email Support',
      subtitle: 'support@locarto.com',
      icon: 'fas fa-envelope',
      color: 'bg-blue-500 hover:bg-blue-600',
      description: 'Get help via email (24-48 hours)',
      action: () => window.open('mailto:support@locarto.com', '_blank')
    },
    {
      title: 'Live Chat',
      subtitle: 'Available 9 AM - 6 PM',
      icon: 'fas fa-comments',
      color: 'bg-green-500 hover:bg-green-600',
      description: 'Chat with our support team',
      action: () => alert('Live chat would be implemented here')
    },
    {
      title: 'Phone Support',
      subtitle: '+91 80123 45678',
      icon: 'fas fa-phone',
      color: 'bg-orange-500 hover:bg-orange-600',
      description: 'Call us for urgent issues',
      action: () => window.open('tel:+918012345678', '_blank')
    },
    {
      title: 'WhatsApp',
      subtitle: 'Quick responses',
      icon: 'fab fa-whatsapp',
      color: 'bg-green-600 hover:bg-green-700',
      description: 'Get help on WhatsApp',
      action: () => window.open('https://wa.me/918012345678', '_blank')
    }
  ];

  // Filter FAQs based on search and category
  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const toggleFAQ = (faqId) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    alert('Support ticket submitted successfully!');
    setTicketForm({ subject: '', category: '', priority: 'medium', message: '' });
    setShowTicketForm(false);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search and Filters */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for help articles, FAQs, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pl-14 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-lg"
                />
                <i className="fas fa-search absolute left-5 top-5 text-gray-400 text-lg"></i>
                <button
                  type="submit"
                  className="absolute right-3 top-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-3">
              {faqCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <i className={`${category.icon} text-sm`}></i>
                  {category.name}
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-question-circle text-blue-600"></i>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Frequently Asked Questions</h2>
              </div>
              <span className="text-sm text-gray-500">
                {filteredFAQs.length} articles found
              </span>
            </div>

            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-search text-gray-400 text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600">Try adjusting your search terms or browse different categories</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFAQs.map((faq) => (
                  <div key={faq.id} className="border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <i className={`fas ${faqCategories.find(cat => cat.id === faq.category)?.icon} text-blue-600 text-sm`}></i>
                        </div>
                        <h4 className="font-semibold text-gray-900">{faq.question}</h4>
                      </div>
                      <i className={`fas fa-chevron-${expandedFAQ === faq.id ? 'up' : 'down'} text-gray-400 transition-transform`}></i>
                    </button>

                    {expandedFAQ === faq.id && (
                      <div className="px-4 pb-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-gray-700 leading-relaxed mb-3">{faq.answer}</p>
                        <div className="flex flex-wrap gap-2">
                          {faq.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions Grid - REMOVED */}
          {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-bolt text-green-600"></i>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className={`flex items-center gap-4 p-4 ${action.color} text-white rounded-xl transition-all hover:shadow-lg transform hover:scale-105`}
                >
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <i className={`${action.icon} text-xl`}></i>
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold">{action.title}</h3>
                    <p className="text-sm opacity-90">{action.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div> 
          */}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Contact Support */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-life-ring text-orange-600"></i>
              </div>
              <h2 className="text-lg font-bold text-gray-900">Need More Help?</h2>
            </div>

            <div className="space-y-3">
              {contactMethods.map((method, index) => (
                <button
                  key={index}
                  onClick={method.action}
                  className={`w-full flex items-center gap-3 p-3 ${method.color} text-white rounded-xl transition-all hover:shadow-md transform hover:scale-105`}
                >
                  <i className={`${method.icon} text-lg`}></i>
                  <div className="text-left flex-1">
                    <div className="font-semibold text-sm">{method.title}</div>
                    <div className="text-xs opacity-90">{method.subtitle}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Create Support Ticket */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <i className="fas fa-ticket-alt text-white"></i>
              </div>
              <h3 className="font-bold">Create Support Ticket</h3>
            </div>
            <p className="text-sm opacity-90 mb-4">Can't find what you're looking for? Create a support ticket and we'll get back to you.</p>
            <button
              onClick={() => setShowTicketForm(true)}
              className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white py-3 rounded-lg font-semibold transition-all hover:shadow-md transform hover:scale-105"
            >
              Create Ticket
            </button>
          </div>

          {/* Support Hours */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-clock text-green-600"></i>
              </div>
              <h3 className="font-bold text-gray-900">Support Hours</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Monday - Friday</span>
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

      {/* Support Ticket Modal */}
      {showTicketForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold">Create Support Ticket</h3>
                  <p className="text-orange-100 mt-1">We'll get back to you within 24 hours</p>
                </div>
                <button
                  onClick={() => setShowTicketForm(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>

            <form onSubmit={handleTicketSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Subject *</label>
                <input
                  type="text"
                  required
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  placeholder="Brief description of your issue"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Category *</label>
                  <select
                    required
                    value={ticketForm.category}
                    onChange={(e) => setTicketForm({...ticketForm, category: e.target.value})}
                    className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  >
                    <option value="">Select category</option>
                    <option value="account">Account Issues</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="technical">Technical Support</option>
                    <option value="products">Product Issues</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Priority</label>
                  <select
                    value={ticketForm.priority}
                    onChange={(e) => setTicketForm({...ticketForm, priority: e.target.value})}
                    className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Message *</label>
                <textarea
                  required
                  rows="6"
                  value={ticketForm.message}
                  onChange={(e) => setTicketForm({...ticketForm, message: e.target.value})}
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none"
                  placeholder="Please describe your issue in detail..."
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowTicketForm(false)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
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