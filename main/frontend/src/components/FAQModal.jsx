import React, { useState } from 'react';
import Modal from './Modal';

const faqData = [
  {
    id: 1,
    category: 'general',
    question: 'What is LOCARTO?',
    answer: 'LOCARTO is a marketplace designed to connect emerging brands with smart customers. It\'s a platform for brands with something to say and for people who want to listen.',
  },
  {
    id: 2,
    category: 'general',
    question: 'Who is LOCARTO meant for?',
    answer: 'LOCARTO is for emerging brands looking for a platform to grow and for customers who are interested in discovering new and unique products and services.',
  },
  {
    id: 3,
    category: 'general',
    question: 'Why only emerging brands?',
    answer: 'Big brands already have a platform. We\'re building a community where new and exciting brands can be discovered and have a place to grow from day one.',
  },
  {
    id: 4,
    category: 'general',
    question: 'How is LOCARTO different from Amazon, Flipkart, etc.?',
    answer: 'Unlike larger platforms that are often saturated with big brands, LOCARTO focuses on curating and showcasing emerging brands, offering a unique discovery experience for customers.',
  },
  {
    id: 5,
    category: 'general',
    question: 'Is this a curated platform or open to all brands?',
    answer: 'LOCARTO is a curated platform. We focus on showcasing unique and emerging brands to ensure a high-quality discovery experience for our customers.',
  },
  {
    id: 6,
    category: 'general',
    question: 'Do you support both products and services?',
    answer: 'Yes, our platform is designed to support both products and services from a variety of emerging brands.',
  },
  {
    id: 7,
    category: 'general',
    question: 'Is LOCARTO live right now?',
    answer: 'We are currently in a beta phase with a limited selection of brands and features. You can sign up to get early access and help us shape the future of the platform.',
  },
  {
    id: 8,
    category: 'general',
    question: 'When will the full marketplace launch?',
    answer: 'We are working hard to bring the full marketplace experience to you soon. Sign up for our newsletter to stay updated on our official launch date!',
  },
  {
    id: 9,
    category: 'general',
    question: 'Can I join now or is there a waitlist?',
    answer: 'You can join our beta program now to get early access. For vendors, there might be a review process to ensure a curated experience on our platform.',
  }
];

const FAQModal = ({ isOpen, onClose }) => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleFAQ = (faqId) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  const filteredFAQs = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Frequently Asked Questions">
      {/* Search bar */}
      <div className="mb-6">
        <div className="relative">
          <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            placeholder="Search for answers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>
      </div>

      {/* FAQ List */}
      <div className="space-y-3 max-h-[55vh] sm:max-h-[60vh] overflow-y-auto pr-2">
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((faq) => (
            <div 
              key={faq.id} 
              className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-200 hover:border-gray-300"
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full flex items-start justify-between p-4 sm:p-5 text-left group"
                aria-expanded={expandedFAQ === faq.id}
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-200 ${
                    expandedFAQ === faq.id ? 'bg-blue-500' : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                    <i className={`fas fa-question text-xs ${
                      expandedFAQ === faq.id ? 'text-white' : 'text-gray-600'
                    }`}></i>
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base leading-snug flex-1">
                    {faq.question}
                  </h4>
                </div>
                <i 
                  className={`fas fa-chevron-down text-gray-400 text-sm flex-shrink-0 ml-2 mt-1 transition-transform duration-300 ${
                    expandedFAQ === faq.id ? 'rotate-180' : ''
                  }`}
                ></i>
              </button>

              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  expandedFAQ === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0">
                  <div className="pl-9 border-l-2 border-blue-500 ml-3">
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base pl-4">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <i className="fas fa-search text-gray-300 text-4xl mb-4"></i>
            <p className="text-gray-500 text-sm sm:text-base">No FAQs found matching your search.</p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 text-blue-500 hover:text-blue-600 text-sm font-medium"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      {/* Help footer */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-center text-gray-600 text-sm">
          Still have questions?{' '}
          <a href="#" className="text-blue-500 hover:text-blue-600 font-medium">
            Contact us
          </a>
        </p>
      </div>
    </Modal>
  );
};

export default FAQModal;