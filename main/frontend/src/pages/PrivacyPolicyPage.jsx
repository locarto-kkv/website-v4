import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivacyPolicyPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      title: "Introduction",
      icon: "fas fa-info-circle",
      content: `Locarto is a registered trademark owned by Locarto Solutions Private Limited (hereinafter referred to as "We", "Our", "Locarto"), a company registered under the Companies Act, 2013, having its registered office at Jer Baug, Dr. B. A. Road, Mumbai- 400027.

This Privacy Policy shall apply to the use of the website www.locarto.in and any other linked pages, products, software(s), API keys, features, content or application services offered by Locarto.

By visiting our Sites and/or availing our services, you are accepting the practices described in this Privacy Policy. All Users are advised to read this Privacy Policy carefully, along with our Terms and Conditions of Use.`
    },
    {
      title: "Data We Collect and Its Use",
      icon: "fas fa-database",
      content: `Locarto may collect your personal information and non-personal information to provide AI personalization services on its Sites.`,
      subsections: [
        {
          subtitle: "Personally-Identifiable Information",
          text: `While opening an account with Locarto, you may be asked for certain sensitive personal data or information to complete your KYC (Know Your Client) formalities. We collect Personal Information when you:
• Voluntarily use the services provided by Locarto
• Enquire to begin an association with Locarto
• Complete the process of opening an account with Locarto`
        },
        {
          subtitle: "Non-Personal Information",
          text: `We use Non-Personal Information for purposes including:
• Troubleshooting connection problems
• Administering the Sites and analyzing trends
• Gathering demographic information
• Understanding how visitors use our Sites
• Ensuring compliance with applicable laws

This information includes your operating system, browser type, previous website URL, internet service provider, and IP Address. This information cannot be easily used to personally identify you.`
        },
        {
          subtitle: "Information We May Collect",
          text: `• Financial information (bank account, credit card, UPI details)
• Personal details (name, contact, email, gender, date of birth)
• Identity documents (PAN, Aadhaar, photographs)
• Business information (name, description, products sold)
• Device information (manufacturer, model, operating system)
• Usage data (time spent, geolocation, interactions)
• Communications and messages
• Any other information you provide`
        }
      ]
    },
    {
      title: "Cookies and Tracking",
      icon: "fas fa-cookie-bite",
      content: `Our Sites utilize standard technology called Cookies and web server logs to collect information about how our Sites are used.

Cookies are pieces of information transferred to your computer's hard disk for record-keeping purposes. They help us:
• Store your preferences on our Sites
• Recognize your device on return visits
• Verify your registration information
• Suggest products or services that may interest you

Most browsers are initially set up to accept cookies. You can set yours to refuse cookies, but you may not be able to take full advantage of our Sites if you do so.`
    },
    {
      title: "How We Use Your Data",
      icon: "fas fa-cogs",
      content: `We use the data we collect for the following purposes:`,
      subsections: [
        {
          subtitle: "Personal Data You Provide",
          text: `• To communicate with you
• To provide features available on the Site
• For direct marketing and market research
• To prevent and investigate fraud
• To protect our rights and property`
        },
        {
          subtitle: "Data Collected Automatically",
          text: `• To manage and personalize the Site
• To monitor, develop, and improve the Site
• To audit and analyze the Site
• To ensure technical functionality and security`
        }
      ]
    },
    {
      title: "Data Disclosure",
      icon: "fas fa-share-alt",
      content: `The data collected may be disclosed to:
• Our advertising partners (in compliance with applicable laws)
• Public authorities and law enforcement (if legally required)
• Our subsidiaries and affiliates
• Service providers (such as data analysis companies)
• Third parties in connection with corporate mergers, acquisitions, or restructuring

We may share information with third-party service providers to measure the effectiveness of our services and for other legitimate business purposes.`
    },
    {
      title: "Data Security",
      icon: "fas fa-shield-alt",
      content: `We understand the importance of data security and implement reasonable safeguards to protect your personal data:

• Data is stored on secure AWS servers with password protection
• We comply with IT laws including Information Technology Rules, 2011
• Only authorized personnel have access to servers
• Information is shared on a need-to-know basis
• We use appropriate encryption and physical security measures
• We conduct internal reviews of data collection and security practices

However, please note that information transmitted through the internet cannot be made absolutely secure. By using our Sites, you agree that we will have no liability in cases where information is disclosed due to transmission errors or unauthorized acts by third parties.`
    },
    {
      title: "Your Privacy Rights",
      icon: "fas fa-user-shield",
      content: `Subject to applicable law, you have the right to:`,
      subsections: [
        {
          subtitle: "Access and Control",
          text: `• Right to access: Obtain confirmation and access to your personal data
• Right to rectification: Correct inaccurate or incomplete data
• Right to erasure: Request deletion of your personal data
• Right to restriction: Restrict processing of your data
• Right to object: Object to processing on specific grounds
• Right to portability: Request transfer of your data`
        },
        {
          subtitle: "Exercising Your Rights",
          text: `To make a request concerning your rights, please contact us at admin@locarto.in. We respond to all requests in accordance with applicable data protection laws.

Note: Withdrawing consent or deleting certain information may lead to cancellation of your account and loss of access to certain features.`
        }
      ]
    },
    {
      title: "Third-Party Websites",
      icon: "fas fa-external-link-alt",
      content: `Our Sites may contain links to third-party websites that have their own privacy policies. We do not control these websites and are not responsible for their privacy practices. We encourage you to review their privacy statements before providing any information.`
    },
    {
      title: "Children's Privacy",
      icon: "fas fa-child",
      content: `If you are under 18 years of age, you may utilize our services only with the involvement of a parent or legal guardian. We do not knowingly collect personal information from persons under 18 years of age. If such information comes to our knowledge, we will take appropriate action to delete it.`
    },
    {
      title: "Changes to Privacy Policy",
      icon: "fas fa-edit",
      content: `Our Privacy Policy may change from time to time without notice. It is your responsibility to periodically review this policy for any changes. The last update date will be mentioned at the top of this page.

If you do not agree to any changes, you must immediately stop using our Sites and services.`
    },
    {
      title: "Contact & Grievances",
      icon: "fas fa-envelope",
      content: `If you have any grievances relating to the processing of your information, please contact our Grievance Officer:

Email: admin@locarto.in

You also have the right to lodge a complaint with the Data Protection Board of India as per the Digital Personal Data Protection Act, 2023.`
    }
  ];

  return (
    <div className="font-sans flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-shield-alt text-4xl"></i>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-white text-opacity-90 mb-2">
              Your privacy is important to us
            </p>
            <p className="text-sm text-white text-opacity-80">
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Quick Navigation */}
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
                      const yOffset = -100;
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
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-6">
                      {section.content}
                    </p>

                    {/* Subsections */}
                    {section.subsections && (
                      <div className="space-y-6 mt-6">
                        {section.subsections.map((subsection, subIndex) => (
                          <div
                            key={subIndex}
                            className="bg-gray-50 rounded-xl p-5 border-l-4 border-orange-500"
                          >
                            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                              <i className="fas fa-chevron-right text-orange-500 text-sm"></i>
                              {subsection.subtitle}
                            </h3>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                              {subsection.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Important Notice */}
          <div className="mt-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-8 text-white">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fas fa-exclamation-triangle text-2xl"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Important Notice</h3>
                <p className="text-white text-opacity-90 leading-relaxed">
                  By using our services, you acknowledge that you have read and understood this Privacy Policy and agree to be bound by its terms. If you do not agree with any part of this policy, please discontinue use of our services immediately.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Card */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-question-circle text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Questions About Your Privacy?
              </h3>
              <p className="text-gray-600 mb-6">
                If you have any questions or concerns about our privacy practices, we're here to help.
              </p>
              <a
                href="mailto:admin@locarto.in"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl transition-all"
              >
                <i className="fas fa-envelope"></i>
                Contact Grievance Officer
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;