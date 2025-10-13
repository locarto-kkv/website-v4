import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios.js";

const BASE_URL = "/vendor/product";

export const VendorProductService = {
  uploadImage: async (files, imgUploadUrls) => {
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

  addProduct: async (productData) => {
    // console.log(productData.product_images);

    try {
      if (productData.product_images.length > 0) {
        const images_metadata = productData.product_images.map((file) => ({
          type: file.type,
          name: file.name,
          size: file.size,
        }));

        productData = { ...productData, images_metadata };
      }

      const { data: response } = await axiosInstance.post(
        `${BASE_URL}/add`,
        productData
      );

      // console.log(response.product);

      if (response.imgUploadUrls) {
        await VendorProductService.uploadImage(
          productData.product_images,
          response.imgUploadUrls
        );
      }
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || "Add Product failed");
      console.log("Error in addProduct:", error.response?.data?.message);
    }
  },

  editProduct: async (productId, productData) => {
    const response = await axiosInstance.put(`${BASE_URL}/${productId}`, {
      productData,
    });
    return response.data;
  },

  removeProduct: async (productId) => {
    const response = await axiosInstance.delete(`${BASE_URL}/${productId}`);
    return response.data;
  },
};
