// src/pages/vendor/dashboard/VendorEditProfile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVendorData } from '../../../context/vendor/vendorDataContext';
import { VendorProfileService } from '../../../services/vendor/vendorProfileService';
import toast from 'react-hot-toast';

const VendorEditProfile = () => {
    const navigate = useNavigate();
    const { profile, getProfile, dataLoading } = useVendorData();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone_no: '',
        // Add other relevant profile fields here based on your data structure
        // e.g., businessName, description, address details, brand_logo_1, brand_logo_2, documents etc.
        address: { // Example nested structure
          address_line_1: '',
          address_line_2: '',
          city: '',
          state: '',
          pincode: '',
          country: '',
        },
        brand_logo_1_file: null, // For file input
        brand_logo_2_file: null, // For file input
        documents_files: [], // For multiple document uploads
    });
    const [loading, setLoading] = useState(false);
    const [imagePreview1, setImagePreview1] = useState(null);
    const [imagePreview2, setImagePreview2] = useState(null);

    // Populate form with existing profile data
    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                email: profile.email || '',
                phone_no: profile.phone_no || '',
                address: { // Assuming the last address is the primary one
                    address_line_1: profile.address?.[profile.address.length - 1]?.address_line_1 || '',
                    address_line_2: profile.address?.[profile.address.length - 1]?.address_line_2 || '',
                    city: profile.address?.[profile.address.length - 1]?.city || '',
                    state: profile.address?.[profile.address.length - 1]?.state || '',
                    pincode: profile.address?.[profile.address.length - 1]?.pincode || '',
                    country: profile.address?.[profile.address.length - 1]?.country || '',
                },
                 // Add other fields from profile
                 // Initialize file fields as null, set previews
                 brand_logo_1_file: null,
                 brand_logo_2_file: null,
                 documents_files: [],
            });
            setImagePreview1(profile.brand_logo_1 || null); // Set initial image preview
            setImagePreview2(profile.brand_logo_2 || null); // Set initial image preview
        }
    }, [profile]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value,
                }
            }));
        } else if (type === 'file') {
             if (name === 'brand_logo_1_file') {
                const file = files[0];
                setFormData(prev => ({ ...prev, brand_logo_1_file: file }));
                setImagePreview1(file ? URL.createObjectURL(file) : profile.brand_logo_1 || null); // Update preview
            } else if (name === 'brand_logo_2_file') {
                 const file = files[0];
                setFormData(prev => ({ ...prev, brand_logo_2_file: file }));
                setImagePreview2(file ? URL.createObjectURL(file) : profile.brand_logo_2 || null); // Update preview
            } else if (name === 'documents_files') {
                setFormData(prev => ({ ...prev, documents_files: [...files] }));
                // Handle document previews if needed
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };

     const handleRemoveImage = (logoNumber) => {
        if (logoNumber === 1) {
            setFormData(prev => ({ ...prev, brand_logo_1_file: null }));
            setImagePreview1(null); // Clear preview
             // Here you might need to send a flag to the backend to remove the existing image
        } else if (logoNumber === 2) {
             setFormData(prev => ({ ...prev, brand_logo_2_file: null }));
            setImagePreview2(null); // Clear preview
             // Similar backend flag logic might be needed
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        toast.loading('Updating profile...');

        // Construct the payload for the API
        // Separate files from other data
        const payload = {
            profile: {
                name: formData.name,
                // Add any other direct profile fields
            },
            address: { // Send only the address object
                 label: "Main", // Assuming this is the main address
                ...formData.address
            },
            extra: {
                 // Add fields from 'extra' object if needed, e.g., businessType, website
            },
             // Pass files directly if your service handles FormData or separate upload
             brand_logo_1: formData.brand_logo_1_file,
             brand_logo_2: formData.brand_logo_2_file,
             documents: formData.documents_files, // Pass array of document files
        };


        try {
            // Adjust the service call based on how it handles file uploads
            // It might need FormData or separate upload logic after profile update
            await VendorProfileService.updateProfile(payload);
            await getProfile(); // Refresh profile data in context
            toast.dismiss();
            toast.success('Profile updated successfully!');
            navigate('/vendor/dashboard/profile'); // Navigate back to profile view
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.dismiss();
            toast.error(error.response?.data?.message || 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    if (dataLoading && !profile) {
        return <div className="text-center p-10">Loading profile data...</div>;
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl md:text-2xl font-bold text-gray-800">Edit Profile</h2>
                 <button
                    onClick={() => navigate('/vendor/dashboard/profile')}
                    className="text-gray-500 hover:text-gray-700 text-sm font-medium flex items-center gap-1"
                 >
                     <i className="fas fa-times"></i> Cancel
                 </button>
             </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal/Business Info */}
                 <section className="border-b pb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Basic Information</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                             <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">Business Name *</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
                        </div>
                         <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">Contact Email *</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
                         </div>
                         <div>
                            <label htmlFor="phone_no" className="block text-sm font-medium text-gray-600 mb-1">Contact Phone *</label>
                            <input type="tel" id="phone_no" name="phone_no" value={formData.phone_no} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
                         </div>
                         {/* Add other basic fields here */}
                     </div>
                 </section>

                 {/* Address Info */}
                 <section className="border-b pb-6">
                     <h3 className="text-lg font-semibold text-gray-700 mb-4">Primary Address</h3>
                     <div className="space-y-4">
                         <div>
                             <label htmlFor="address_line_1" className="block text-sm font-medium text-gray-600 mb-1">Address Line 1 *</label>
                             <input type="text" id="address_line_1" name="address.address_line_1" value={formData.address.address_line_1} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
                         </div>
                         <div>
                             <label htmlFor="address_line_2" className="block text-sm font-medium text-gray-600 mb-1">Address Line 2</label>
                             <input type="text" id="address_line_2" name="address.address_line_2" value={formData.address.address_line_2} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                 <label htmlFor="city" className="block text-sm font-medium text-gray-600 mb-1">City *</label>
                                 <input type="text" id="city" name="address.city" value={formData.address.city} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
                             </div>
                             <div>
                                 <label htmlFor="state" className="block text-sm font-medium text-gray-600 mb-1">State *</label>
                                 <input type="text" id="state" name="address.state" value={formData.address.state} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
                             </div>
                              <div>
                                 <label htmlFor="pincode" className="block text-sm font-medium text-gray-600 mb-1">Pincode *</label>
                                 <input type="text" id="pincode" name="address.pincode" value={formData.address.pincode} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
                             </div>
                         </div>
                          <div>
                            <label htmlFor="country" className="block text-sm font-medium text-gray-600 mb-1">Country *</label>
                            {/* You might want a dropdown here */}
                            <input type="text" id="country" name="address.country" value={formData.address.country} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
                         </div>
                     </div>
                 </section>

                {/* Branding & Documents */}
                 <section>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Branding & Documents</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         {/* Brand Logo 1 */}
                        <div>
                            <label htmlFor="brand_logo_1_file" className="block text-sm font-medium text-gray-600 mb-2">Brand Logo 1</label>
                            <div className="flex items-center gap-4">
                                {imagePreview1 && (
                                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
                                         <img src={imagePreview1} alt="Logo 1 Preview" className="w-full h-full object-contain" />
                                         <button type="button" onClick={() => handleRemoveImage(1)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">&times;</button>
                                     </div>
                                )}
                                <input type="file" id="brand_logo_1_file" name="brand_logo_1_file" accept="image/*" onChange={handleChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"/>
                             </div>
                         </div>

                         {/* Brand Logo 2 */}
                         <div>
                            <label htmlFor="brand_logo_2_file" className="block text-sm font-medium text-gray-600 mb-2">Brand Logo 2 (Optional)</label>
                            <div className="flex items-center gap-4">
                                {imagePreview2 && (
                                     <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
                                         <img src={imagePreview2} alt="Logo 2 Preview" className="w-full h-full object-contain" />
                                         <button type="button" onClick={() => handleRemoveImage(2)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">&times;</button>
                                     </div>
                                )}
                                <input type="file" id="brand_logo_2_file" name="brand_logo_2_file" accept="image/*" onChange={handleChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"/>
                             </div>
                         </div>

                          {/* Documents */}
                         <div className="md:col-span-2">
                             <label htmlFor="documents_files" className="block text-sm font-medium text-gray-600 mb-2">Business Documents</label>
                             <input type="file" id="documents_files" name="documents_files" multiple onChange={handleChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                              <p className="text-xs text-gray-500 mt-1">Upload relevant documents (e.g., GST, FSSAI). Hold Ctrl/Cmd to select multiple.</p>
                             {/* Display current documents if needed */}
                             {profile?.documents && profile.documents.length > 0 && (
                                 <div className="mt-2 text-xs text-gray-600">
                                     Current documents: {profile.documents.map(doc => doc.name || 'document').join(', ')}
                                 </div>
                             )}
                         </div>
                     </div>
                 </section>

                <div className="flex justify-end pt-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-70"
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VendorEditProfile;