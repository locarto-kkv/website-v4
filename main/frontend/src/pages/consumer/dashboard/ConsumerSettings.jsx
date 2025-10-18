// src/pages/consumer/dashboard/CustomerSettings.jsx
import React, { useState, useEffect } from 'react';
// Import profile service if you plan to fetch/update data
// import { ConsumerProfileService } from "../../../services/consumer/consumerProfileService"; // Adjust path
// Import auth store if needed to get current user details
// import { useAuthStore } from "../../../store/useAuthStore"; // Adjust path

// Reusable Toggle Switch Component (or import if you have a shared one)
const ToggleSwitch = ({ enabled, onChange, color = "orange" }) => (
    <label className="relative inline-flex items-center cursor-pointer">
        <input
            type="checkbox"
            checked={enabled}
            onChange={onChange}
            className="sr-only peer"
        />
        <div className={`w-11 h-6 bg-gray-300 peer-checked:bg-${color}-500 rounded-full transition-colors duration-300 relative peer-focus:ring-2 peer-focus:ring-${color}-300`}>
            <div className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${enabled ? 'translate-x-5' : ''} shadow`}></div>
        </div>
    </label>
);


const CustomerSettings = () => {
    // --- State for Form Inputs ---
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        // Add other fields as needed (address, etc.)
    });
    const [loading, setLoading] = useState(false); // For fetching/saving state

    // --- State for Notification Toggles ---
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [smsNotifications, setSmsNotifications] = useState(false);
    const [marketingEmails, setMarketingEmails] = useState(true);

    // --- Fetch current user data (Example) ---
    // const { currentUser } = useAuthStore(); // Get user info if needed
    // useEffect(() => {
    //     const fetchProfile = async () => {
    //         setLoading(true);
    //         try {
    //             // const data = await ConsumerProfileService.getProfile();
    //             // Simulate fetching data
    //             const data = { name: "Current User", email: currentUser?.email || "user@example.com", phone: "9876543210" };
    //             setProfileData(data);
    //             // Set notification states based on fetched data if available
    //         } catch (error) {
    //             console.error("Failed to fetch profile:", error);
    //             // Handle error
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     fetchProfile();
    // }, [currentUser]); // Add dependencies if needed
    // --- End Fetching Example ---

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = async (e) => {
         e.preventDefault();
         setLoading(true);
         console.log("Saving Profile Data:", profileData);
         console.log("Saving Notification Settings:", { emailNotifications, smsNotifications, marketingEmails });
         try {
             // await ConsumerProfileService.updateProfile(profileData);
             // // You might need separate API calls to update notification preferences
             alert("Settings saved successfully!"); // Replace with toast
         } catch (error) {
             console.error("Failed to save settings:", error);
             alert("Failed to save settings."); // Replace with toast
         } finally {
             setLoading(false);
         }
    };

    const toggleSetting = (setter) => {
        setter(prev => !prev);
    };


    return (
        <form onSubmit={handleSaveChanges}>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                {/* Title handled by layout */}
                {/* <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2> */}

                {loading && <p className="text-center text-gray-500 mb-4">Loading...</p>}

                <div className="space-y-8"> {/* Increased spacing */}
                    {/* Account Information Section */}
                    <div className="border-b border-gray-200 pb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <i className="fas fa-user-edit text-blue-600"></i>
                            </div>
                            <h3 className="font-bold text-lg text-gray-800">Account Information</h3>
                        </div>
                        <div className="space-y-4 max-w-lg"> {/* Added max-width */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={profileData.name}
                                    onChange={handleInputChange}
                                    placeholder="Your Full Name"
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-orange-500 transition-colors focus:outline-none"
                                />
                            </div>
                            <div>
                                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={profileData.email}
                                    onChange={handleInputChange}
                                    placeholder="your.email@example.com"
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-orange-500 transition-colors focus:outline-none"
                                />
                            </div>
                            <div>
                                 <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={profileData.phone}
                                    onChange={handleInputChange}
                                    placeholder="Your Phone Number"
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-orange-500 transition-colors focus:outline-none"
                                />
                            </div>
                            {/* Add address fields if needed */}
                        </div>
                    </div>

                    {/* Notifications Section */}
                    <div className="border-b border-gray-200 pb-6">
                        <div className="flex items-center gap-3 mb-4">
                             <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                 <i className="fas fa-bell text-purple-600"></i>
                             </div>
                            <h3 className="font-bold text-lg text-gray-800">Notifications</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <span className="text-gray-700 font-medium">Order updates via Email</span>
                                <ToggleSwitch
                                     enabled={emailNotifications}
                                     onChange={() => toggleSetting(setEmailNotifications)}
                                     color="purple"
                                 />
                            </div>
                             <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <span className="text-gray-700 font-medium">Order updates via SMS</span>
                                 <ToggleSwitch
                                     enabled={smsNotifications}
                                     onChange={() => toggleSetting(setSmsNotifications)}
                                     color="purple"
                                 />
                            </div>
                             <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <span className="text-gray-700 font-medium">Promotional & Marketing Emails</span>
                                 <ToggleSwitch
                                     enabled={marketingEmails}
                                     onChange={() => toggleSetting(setMarketingEmails)}
                                     color="purple"
                                 />
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <button
                             type="submit"
                             disabled={loading}
                             className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-8 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default CustomerSettings;