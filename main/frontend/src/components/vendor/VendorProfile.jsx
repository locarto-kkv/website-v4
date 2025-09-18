import React, { useState, useEffect } from 'react';

const VendorProfile = () => {
  const [profileData, setProfileData] = useState({
    companyName: '',
    email: '',
    phone: '',
    address: '',
    website: '',
  });

  const [documents, setDocuments] = useState([
    { name: 'Business_License.pdf', size: '1.2MB' },
    { name: 'Tax_ID_Verification.pdf', size: '800KB' },
    { name: 'Insurance_Certificate.pdf', size: '500KB' },
  ]);

  // In a real app, you would fetch the vendor's data when the component loads
  useEffect(() => {
    setProfileData({
      companyName: 'Apex Innovations Inc.',
      email: 'info@apexinnovations.com',
      phone: '+1 (555) 123-4567',
      address: '123 Tech Park Avenue, Suite 101, Silicon Valley, CA 94043, USA',
      website: 'https://www.apexinnovations.com',
    });
  }, []);

  const handleDownloadDocument = (fileName) => {
    // In a real app, this would trigger a file download
    alert(`Downloading ${fileName}...`);
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Vendor Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start space-x-6 mb-8">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v2m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v2m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v2" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{profileData.companyName}</h2>
                <p className="text-gray-600">{profileData.email}</p>
                <p className="text-gray-600">{profileData.phone}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Address</h3>
                <p className="text-gray-600">{profileData.address}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Website</h3>
                <a 
                  href={profileData.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:text-orange-700 transition-colors"
                >
                  {profileData.website}
                </a>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-800 mb-4">Uploaded Documents</h3>
              <div className="space-y-3">
                {documents.map((doc, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => handleDownloadDocument(doc.name)}
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-gray-800">{doc.name}</span>
                    </div>
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Account Milestones Sidebar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Milestones</h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Orders Completed</span>
                <span className="text-orange-600 font-medium">250/500</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: '50%' }}
                ></div>
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600 mb-1">Vendor Since</div>
              <div className="font-medium text-gray-800">January 15, 2022</div>
            </div>

            <div>
              <div className="text-sm text-gray-600 mb-1">Ratings</div>
              <div className="flex items-center">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className={`w-5 h-5 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor" 
                      viewBox="0 0 20 20" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.122a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.122a1 1 0 00-1.175 0l-3.976 2.122c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.122c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 font-medium text-gray-800">4.5</span>
                <span className="text-gray-500">(128 reviews)</span>
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600 mb-3">Earned Badges</div>
              <div className="flex space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.122a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.122a1 1 0 00-1.175 0l-3.976 2.122c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.122c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.041 11.041 0 006.105 6.105l.774-1.548a1 1 0 011.058-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C9.716 18 3 11.284 3 6V3z" />
                  </svg>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <button className="w-full px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors">
              View Membership Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;