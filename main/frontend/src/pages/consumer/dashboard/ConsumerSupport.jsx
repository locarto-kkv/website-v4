// src/pages/consumer/dashboard/CustomerSupport.jsx
import React, { useState } from "react"; // Import useState
import { Navigate, useNavigate } from "react-router-dom"; // Removed useNavigate, useLocation, useEffect, React
import { useConsumerData } from "../../../context/consumer/consumerDataContext";

const CustomerSupport = () => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const navigate = useNavigate();
  const { orders } = useConsumerData();
  console.log(orders);

  const faqItems = [
    {
      id: 1,
      question: "How to track my order?",
      answer:
        "You can track your order status directly from the 'My Orders' page in your dashboard. Click on the order you want to track and select 'Track Order'.",
    },
    {
      id: 2,
      question: "What is the return policy?",
      answer:
        "Most items can be returned within 14 days of delivery. Please check the specific product page for detailed return eligibility and instructions. Initiate returns from the 'My Orders' page.",
    },
    {
      id: 3,
      question: "How to change my address?",
      answer:
        "You can update your shipping address in the 'Account Settings' section of your dashboard. Please note, address changes cannot be applied to orders already shipped.",
    },
    {
      id: 4,
      question: "What payment methods are accepted?",
      answer:
        "We accept major credit cards (Visa, MasterCard, Amex), debit cards, UPI, and Net Banking. Available options may vary.",
    },
    {
      id: 5,
      question: "How long does shipping take?",
      answer:
        "Shipping times vary depending on the vendor and your location. Estimated delivery times are shown during checkout and on the 'My Orders' page after purchase.",
    },
  ];

  const handleLiveChat = () => {
    navigate("/consumer/dashboard/chat");
  }; //

  const handleEmailSupport = () => {
    window.location.href = "mailto:support@locarto.com?subject=Support Request";
    // Consider pre-filling subject or body if needed
  }; //
  // --- End Contact Handlers ---

  // --- Toggle FAQ Function ---
  const toggleFAQ = (faqId) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  }; // Function to open/close FAQ items

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Contact Card (Remains the same) */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <i className="fas fa-headset text-white text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Contact Support
          </h2>
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
        </div>
      </div>{" "}
      {/* */}
      {/* **MODIFIED FAQ Card** */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <i className="fas fa-question-circle text-blue-600 text-lg"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            Frequently Asked Questions
          </h3>
        </div>
        {/* Accordion FAQ List */}
        <div className="space-y-3">
          {faqItems.map((faq) => (
            <div
              key={faq.id}
              className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:border-gray-300"
            >
              {" "}
              {/* Added hover border */}
              <button
                onClick={() => toggleFAQ(faq.id)} // Call toggle function
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors group" // Added group
                aria-expanded={expandedFAQ === faq.id}
              >
                <div className="flex items-center gap-3">
                  {/* Icon container */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                      expandedFAQ === faq.id
                        ? "bg-blue-500"
                        : "bg-blue-100 group-hover:bg-blue-200"
                    }`}
                  >
                    <i
                      className={`fas fa-question text-sm ${
                        expandedFAQ === faq.id ? "text-white" : "text-blue-600"
                      }`}
                    ></i>
                  </div>
                  <span className="flex-1 text-gray-800 font-semibold">
                    {faq.question}
                  </span>{" "}
                  {/* Changed font-medium to font-semibold */}
                </div>
                <i
                  className={`fas fa-chevron-${
                    expandedFAQ === faq.id ? "up" : "down"
                  } text-gray-400 text-sm transition-transform duration-300 ml-2`}
                ></i>{" "}
                {/* Adjusted icon and margin */}
              </button>
              {/* Conditionally Rendered Answer */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  expandedFAQ === faq.id
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0" // Animation classes
                }`}
              >
                <div className="px-4 pb-4 bg-gray-50 border-t border-gray-200">
                  {" "}
                  {/* Style for answer area */}
                  <p className="text-gray-700 leading-relaxed pt-3 pl-11">
                    {" "}
                    {/* Padding to align with question */}
                    {faq.answer || "Answer not available yet."}{" "}
                    {/* Added fallback */}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Removed View All FAQs Button - Add back if needed */}
        {/* <button className="mt-6 w-full text-center text-orange-600 hover:text-orange-700 font-semibold text-sm">
                    View All FAQs <i className="fas fa-arrow-right ml-1 text-xs"></i>
                </button> */}
      </div>
      {/* **END MODIFICATION** */}
    </div>
  );
};

export default CustomerSupport;
