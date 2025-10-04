import React, { useState } from "react";

const WhatInItForYou = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    companyReferral: "",
    companyEmail: "",
    companyPhone: "",
    yourContact: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.companyReferral || !formData.companyEmail || !formData.yourContact) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          name: "",
          companyReferral: "",
          companyEmail: "",
          companyPhone: "",
          yourContact: "",
        });
        setSubmitSuccess(false);
        setIsFormVisible(false);
      }, 2000);
    }, 1000);
  };

  // Placeholder images - replace with your actual imports
  const Heart = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E";
  const Arrow = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z'/%3E%3C/svg%3E";
  const Dollar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z'/%3E%3C/svg%3E";

  return (
    <div 
      className="mt-24 w-full max-w-[400px] sm:max-w-[1200px] mx-auto p-8 md:p-12 rounded-xl shadow-lg relative overflow-hidden transition-all duration-500"
      style={{ backgroundColor: "#f15b28", minHeight: isFormVisible ? "700px" : "500px" }}
      onMouseEnter={() => setIsFormVisible(true)}
      onMouseLeave={() => !isSubmitting && setIsFormVisible(false)}
    >
      {/* Main Content */}
      <div className={`transition-all duration-500 ${isFormVisible ? 'opacity-30 blur-sm' : 'opacity-100'}`}>
        <h2 className="text-3xl text-[#FFFFFF] text-center mb-6 font-semibold">
          What's In It For You?
        </h2>
        <p className="text-[#FFFFFF] text-center mb-12 font-medium">
          Share what works, get rewarded
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-[#FFFFFF]">
          {/* Step 1 */}
          <div className="p-4">
            <img src={Heart} alt="heart" className="w-32 mx-auto mb-6" />
            <h3 className="font-bold mb-4 text-lg">Step 1 -</h3>
            <p className="text-base">Find a brand we should know about.</p>
          </div>
          {/* Step 2 */}
          <div className="p-4">
            <img src={Arrow} alt="arrow" className="w-32 mx-auto mb-6" />
            <h3 className="font-bold mb-4 text-lg">Step 2 -</h3>
            <p className="text-base">Send us their information.</p>
          </div>
          {/* Step 3 */}
          <div className="p-4">
            <img src={Dollar} alt="dollar" className="w-32 mx-auto mb-6" />
            <h3 className="font-bold mb-4 text-lg">Step 3 -</h3>
            <p className="text-base">Get credits when they join us.</p>
          </div>
        </div>
      </div>

      {/* Dropdown Form Overlay */}
      <div 
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
          isFormVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl mx-4 transform transition-all duration-500"
          style={{
            transform: isFormVisible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-20px)',
          }}
        >
          {submitSuccess ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#0D1539] mb-2">Thank You!</h3>
              <p className="text-gray-600">Your referral has been submitted successfully.</p>
            </div>
          ) : (
            <div>
              <h3 className="text-2xl font-bold text-[#0D1539] text-center mb-2">
                Refer A Brand
              </h3>
              <p className="text-center text-gray-600 mb-8">
                Help us discover amazing brands and get rewarded
              </p>

              <div className="space-y-6">
                {/* Your Name */}
                <div>
                  <label className="block text-sm font-semibold text-[#0D1539] mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#f15b28] focus:outline-none transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Company Being Referred */}
                <div>
                  <label className="block text-sm font-semibold text-[#0D1539] mb-2">
                    Company You're Referring *
                  </label>
                  <input
                    type="text"
                    name="companyReferral"
                    value={formData.companyReferral}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#f15b28] focus:outline-none transition-colors"
                    placeholder="Enter company name"
                  />
                </div>

                {/* Company Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#0D1539] mb-2">
                      Company Email *
                    </label>
                    <input
                      type="email"
                      name="companyEmail"
                      value={formData.companyEmail}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#f15b28] focus:outline-none transition-colors"
                      placeholder="company@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0D1539] mb-2">
                      Company Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      name="companyPhone"
                      value={formData.companyPhone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#f15b28] focus:outline-none transition-colors"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                {/* Your Contact */}
                <div>
                  <label className="block text-sm font-semibold text-[#0D1539] mb-2">
                    Your Contact Number *
                  </label>
                  <input
                    type="tel"
                    name="yourContact"
                    value={formData.yourContact}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#f15b28] focus:outline-none transition-colors"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-[#f15b28] hover:bg-[#d94d20] text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Referral</span>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </>
                  )}
                </button>
              </div>

              <p className="text-center text-xs text-gray-500 mt-6">
                Move your mouse away to close this form
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatInItForYou;