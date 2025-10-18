// src/pages/consumer/dashboard/CustomerSupport.jsx
import React from 'react';

const CustomerSupport = () => {
    // --- FAQ Data (Consider moving to a separate file or fetching) ---
    const faqItems = [
        { id: 1, question: "How to track my order?" },
        { id: 2, question: "What is the return policy?" },
        { id: 3, question: "How to change my address?" },
        { id: 4, question: "What payment methods are accepted?" },
        { id: 5, question: "How long does shipping take?" },
    ];
    // --- End FAQ Data ---

    // --- Contact Handlers (Implement actual logic or link appropriately) ---
    const handleLiveChat = () => {
        alert('Live Chat: Feature coming soon!');
        // Replace with actual chat integration if available
    };

    const handleEmailSupport = () => {
        window.location.href = 'mailto:support@locarto.com?subject=Support Request';
        // Consider pre-filling subject or body if needed
    };
    // --- End Contact Handlers ---

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <i className="fas fa-headset text-white text-2xl"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Support</h2>
                    <p className="text-gray-600">We're here to help you 24/7</p>
                </div>
                <div className="space-y-4">
                    <button
                        onClick={handleLiveChat}
                        className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all transform hover:scale-105"
                        >
                        <i className="fas fa-comments"></i>
                        Start Live Chat
                    </button>
                    <button
                        onClick={handleEmailSupport}
                        className="w-full flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 py-3 rounded-xl font-bold transition-colors text-gray-700"
                        >
                        <i className="fas fa-envelope"></i>
                        Email Support
                    </button>
                    {/* Add Phone/WhatsApp buttons if needed */}
                    {/* <button className="w-full ..."> <i className="fas fa-phone"></i> Phone Support </button> */}
                </div>
            </div>

            {/* FAQ Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <i className="fas fa-question-circle text-blue-600 text-lg"></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Frequently Asked Questions</h3>
                </div>
                <div className="space-y-3">
                    {faqItems.map((faq) => (
                        <button key={faq.id} className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-3 group">
                            <i className="fas fa-question-circle text-orange-500 text-sm group-hover:scale-110 transition-transform"></i>
                            <span className="flex-1 text-gray-800 font-medium">{faq.question}</span>
                            <i className="fas fa-chevron-right text-gray-400 text-xs group-hover:translate-x-1 transition-transform"></i>
                        </button>
                    ))}
                </div>
                 <button className="mt-6 w-full text-center text-orange-600 hover:text-orange-700 font-semibold text-sm">
                    View All FAQs <i className="fas fa-arrow-right ml-1 text-xs"></i>
                </button>
            </div>
        </div>
    );
};

export default CustomerSupport;