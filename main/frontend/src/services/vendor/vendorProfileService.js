import { axiosInstance } from "../../lib/axios.js";

const BASE_URL = "/vendor/profile";

export const VendorProfileService = {
  getProfile: async () => {
    const response = await axiosInstance.get(`${BASE_URL}/`);
    return response.data;
  },

  updateProfile: async (profileData) => {
    let brand_logo_1_file;
    let brand_logo_2_file;

    if (profileData.profile.brand_logo_1) {
      let brand_logo_1_metadata;
      if (profileData.profile.brand_logo_1 instanceof File) {
        brand_logo_1_file = profileData.profile.brand_logo_1;
        brand_logo_1_metadata = {
          type: brand_logo_1_file.type,
          size: brand_logo_1_file.size,
        };
      } else if (typeof profileData.profile.brand_logo_1 === String) {
        brand_logo_1_metadata = {
          name: `brand_logo_1`,
          url: profileData.profile.brand_logo_1.url,
        };
      }
      profileData.profile.brand_logo_1 = brand_logo_1_metadata;
    }

    if (profileData.profile.brand_logo_2) {
      let brand_logo_2_metadata;
      if (profileData.profile.brand_logo_2 instanceof File) {
        brand_logo_2_file = profileData.profile.brand_logo_2;
        brand_logo_2_metadata = {
          type: brand_logo_2_file.type,
          size: brand_logo_2_file.size,
        };
      } else if (typeof profileData.profile.brand_logo_2 === String) {
        brand_logo_2_metadata = {
          name: `brand_logo_2`,
          url: profileData.profile.brand_logo_2.url,
        };
      }
      profileData.profile.brand_logo_2 = brand_logo_2_metadata;
    }

    const { data: response } = await axiosInstance.put(
      `${BASE_URL}/update`,
      profileData
    );

    if (response.imgUploadUrls) {
      await VendorProfileService.uploadImages(
        [brand_logo_1_file, brand_logo_2_file],
        Object.values(response.imgUploadUrls)
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
        if (!files[i]) return;
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
