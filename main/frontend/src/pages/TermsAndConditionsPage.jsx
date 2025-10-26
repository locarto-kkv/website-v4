// src/pages/TermsAndConditionsPage.jsx
import React, { useEffect } from 'react';
import Navbar from '../components/Navbar'; // Assuming Navbar is in components
import Footer from '../components/Footer'; // Assuming Footer is in components
import { Link } from 'react-router-dom'; // Import Link for navigation if needed

const TermsAndConditionsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Content extracted from the DOCX file
  const sections = [
    {
      title: "Introduction",
      icon: "fas fa-info-circle", // Example icon, change if desired
      content: `Welcome to Locarto.in (“Locarto”, “we”, “our”, or “us”).These Terms and Conditions (“Terms”) govern your access to and use of our website and related services. By accessing or using the site, you agree to comply with these Terms. If you do not agree, please discontinue use of the website.`
    },
    {
      title: "1. Eligibility",
      icon: "fas fa-user-check", // Example icon
      content: `By using Locarto.in, you represent that you are at least 18 years of age and have the legal capacity to enter into these Terms under applicable law.`
    },
    {
      title: "2. Account Registration",
      icon: "fas fa-user-plus", // Example icon
      content: `Certain features require you to create an account. You agree to provide accurate, complete, and updated information. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. Notify us immediately of any unauthorized access or breach.`
    },
    {
      title: "3. Acceptable Use",
      icon: "fas fa-check-double", // Example icon
      content: `You agree to use the website only for lawful purposes and not to:
• Engage in any activity that disrupts or interferes with the website’s operation;
• Upload or transmit harmful code, spam, or illegal content;
• Infringe upon the rights or privacy of others.
We reserve the right to suspend or terminate your access if you violate these Terms.`
    },
    {
      title: "4. Intellectual Property",
      icon: "fas fa-copyright", // Example icon
      content: `All content, features, design, and materials on locarto.in are the property of Locarto or its licensors and are protected under applicable intellectual property laws. You may not reproduce, distribute, or modify any content without prior written consent.`
    },
    {
      title: "5. Modification of Terms",
      icon: "fas fa-edit", // Example icon
      content: `Locarto may amend these Terms at any time by posting the updated version on the website . Continued use of the site after changes are posted constitutes acceptance of the revised Terms.`
    },
    {
      title: "6. Termination",
      icon: "fas fa-ban", // Example icon
      content: `We may terminate or suspend access to the website at our discretion, without prior notice, if we believe you have violated these Terms or engaged in unlawful activity.`
    },
    {
      title: "7. Limitation of Liability",
      icon: "fas fa-exclamation-triangle", // Example icon
      content: `To the maximum extent permitted by law, Locarto shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use or inability to use the website, including but not limited to data loss, loss of profits, or unauthorized access to information.`
    },
    {
      title: "8. Governing Law",
      icon: "fas fa-gavel", // Example icon
      content: `These Terms shall be governed by and construed in accordance with the laws of India . Any disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai, India.`
    },
    {
      title: "9. Dispute Resolution",
      icon: "fas fa-balance-scale", // Example icon
      content: `In case of any dispute, the parties shall first attempt to resolve it amicably . If unresolved, the matter shall be referred to arbitration under the Indian Arbitration and Conciliation Act, 1996. The arbitration shall be conducted in English, in Mumbai, and the decision shall be final and binding.`
    },
    {
      title: "10. Contact Us",
      icon: "fas fa-envelope", // Example icon
      content: `For any questions, please contact: Email: team@locarto.in `
    }
  ];

  return (
    // UI structure copied from PrivacyPolicyPage.jsx
    <div className="font-sans flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
              {/* Changed Icon */}
              <i className="fas fa-file-contract text-4xl"></i>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Terms and Conditions
            </h1>
            <p className="text-xl text-white text-opacity-90 mb-2">
              Please read these terms carefully
            </p>
            <p className="text-sm text-white text-opacity-80">
              Last Updated: {new Date("2025-10-26").toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} {/* Assuming date from filename */}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Quick Navigation (Optional, can be removed if not desired) */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i className="fas fa-list text-orange-500"></i>
              Quick Navigation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sections.map((section, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const element = document.getElementById(`section-${index}`);
                    if (element) {
                      const yOffset = -100; // Adjust offset for fixed header
                      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                  }}
                  className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-orange-50 rounded-xl transition-colors group w-full text-left"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:shadow-md transition-shadow">
                    <i className={`${section.icon} text-white text-sm`}></i>
                  </div>
                  <span className="font-medium text-gray-700 group-hover:text-orange-600 transition-colors text-sm">
                    {section.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Policy Sections */}
          <div className="space-y-6">
            {sections.map((section, index) => (
              <div
                key={index}
                id={`section-${index}`}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Section Header */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-orange-100 p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                      <i className={`${section.icon} text-white text-xl`}></i>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {section.title}
                    </h2>
                  </div>
                </div>

                {/* Section Content */}
                <div className="p-6 md:p-8">
                  {/* Using prose for basic text formatting, and whitespace-pre-line */}
                  <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                     {/* Split content by bullet points if needed */}
                     {section.content.split('\n• ').map((item, i) => (
                        <p key={i}>{i > 0 ? `• ${item}` : item}</p>
                     ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Card (Similar to Privacy Policy) */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-question-circle text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Questions About These Terms?
              </h3>
              <p className="text-gray-600 mb-6">
                If you have any questions, please reach out to us.
              </p>
              <a
                href="mailto:team@locarto.in" // Use contact email from doc
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl transition-all"
              >
                <i className="fas fa-envelope"></i>
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsAndConditionsPage;