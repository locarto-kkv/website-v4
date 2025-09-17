import React, { useState, useEffect } from 'react';

const VendorProfile = () => {
  const [profileData, setProfileData] = useState({
    companyName: '',
    email: '',
    phone: '',
    address: '',
  });

  const [documents, setDocuments] = useState([
    { name: 'BusinessLicense.pdf', size: '1.2MB' },
    { name: 'TaxID.pdf', size: '800KB' },
  ]);

  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // In a real app, you would fetch the vendor's data when the component loads
  useEffect(() => {
    // Example: fetchVendorData().then(data => setProfileData(data));
    setProfileData({
      companyName: 'Lucario Merge Inc.',
      email: 'contact@lucariomerge.com',
      phone: '+91 98765 43210',
      address: '123 Tech Park, Innovation Drive, Mumbai, Maharashtra, 400076',
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    // Handle the file upload logic here
    console.log(newFiles);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to save updated profile data to the backend
    console.log('Saving profile data:', profileData);
    alert('Profile updated successfully!');
  };

  const handleEditEmailClick = () => {
    setNewEmail(profileData.email);
    setPassword('');
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would verify the password with your backend
    // For demo purposes, we'll just check if password is not empty
    if (password.trim() !== '') {
      setIsEditingEmail(true);
      setShowPasswordModal(false);
      setPassword('');
    } else {
      alert('Please enter your password');
    }
  };

  const handleEmailChange = (e) => {
    setNewEmail(e.target.value);
  };

  const handleSaveEmail = () => {
    setProfileData(prev => ({ ...prev, email: newEmail }));
    setIsEditingEmail(false);
  };

  const handleCancelEmailEdit = () => {
    setIsEditingEmail(false);
    setNewEmail(profileData.email);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Vendor Profile
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Company Information Section */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-secondary mb-4">Company Information</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                type="text"
                name="companyName"
                id="companyName"
                value={profileData.companyName}
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <textarea
                name="address"
                id="address"
                rows="3"
                value={profileData.address}
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              ></textarea>
            </div>
          </div>
        </div>
        
        {/* Contact & Security Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-secondary mb-4">Contact Details</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <div className="mt-1 flex items-center">
                  {isEditingEmail ? (
                    <>
                      <input
                        type="email"
                        value={newEmail}
                        onChange={handleEmailChange}
                        className="block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      />
                      <div className="ml-2 flex space-x-1">
                        <button
                          type="button"
                          onClick={handleSaveEmail}
                          className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
                          title="Save"
                        >
                          <i className="fas fa-check"></i>
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEmailEdit}
                          className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                          title="Cancel"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <input
                        type="email"
                        value={profileData.email}
                        readOnly
                        className="block w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                      />
                      <button
                        type="button"
                        onClick={handleEditEmailClick}
                        className="ml-2 bg-gray-200 hover:bg-gray-300 text-gray-700 p-3 rounded-lg"
                        title="Edit Email"
                      >
                        <i className="fas fa-pen"></i>
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={profileData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-secondary mb-4">Security</h2>
            <p className="text-sm text-gray-600 mb-4">Manage your account security settings.</p>
            <button type="button" className="w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg transition font-medium">
              Change Password
            </button>
          </div>
        </div>

        {/* Documents Section */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-secondary mb-4">Documents</h2>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
              <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-orange-600">
                <span>Upload a file</span>
                <input id="file-upload" name="file-upload" type="file" multiple className="sr-only" onChange={handleFileChange} />
              </label>
              <p className="text-xs text-gray-500 mt-1">PDF, PNG, JPG up to 10MB</p>
            </div>
            <ul className="divide-y divide-gray-200">
              {documents.map((doc, index) => (
                <li key={index} className="py-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <i className="fas fa-file-alt text-gray-500 text-xl"></i>
                    <span className="ml-3 font-medium text-gray-800">{doc.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">{doc.size}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-primary text-white rounded-lg font-bold hover:bg-orange-600 transition"
          >
            Save Changes
          </button>
        </div>

      </form>

      {/* Password Confirmation Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Confirm Password</h3>
              <p className="text-gray-600 mb-4">Please enter your password to edit your email address</p>
              
              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="Enter your password"
                    autoFocus
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-orange-600"
                  >
                    Confirm
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorProfile;