import { axiosInstance } from "../../lib/axios.js";

const BASE_URL = "/vendor/profile";

export const VendorProfileService = {
  getProfile: async () => {
    const response = await axiosInstance.get(`${BASE_URL}/`);
    return response.data;
  },

  updateProfile: async (profileData) => {
    const { data: response } = await axiosInstance.put(
      `${BASE_URL}/update`,
      profileData
    );

    if (response.brand_logo_1) {
      await VendorProfileService.uploadImages(
        [profileData.brand_logo_1, profileData.brand_logo_2],
        response.imgUploadUrls
      );
    }

    if (response.fileUploadUrls) {
      await VendorProfileService.uploadDocs(
        profileData.documents,
        response.fileUploadUrls
      );
    }

    return response.vendor;
  },

  deleteProfile: async () => {
    const response = await axiosInstance.delete(`${BASE_URL}/delete`);
    return response.data;
  },

  uploadImages: async (files, imgUploadUrls) => {
    await Promise.all(
      imgUploadUrls.map(async (url, i) => {
        const { uploadUrl, fileType } = url;

        await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": fileType },
          body: files[i],
        });
      })
    );
  },

  uploadDocs: async (files, fileUploadUrls) => {
    await Promise.all(
      fileUploadUrls.map(async (url, i) => {
        const { uploadUrl, fileType } = url;

        await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": fileType },
          body: files[i],
        });
      })
    );
  },
};
