import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios.js";

const BASE_URL = "/vendor/product";

export const VendorProductService = {
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

  addProduct: async (productData) => {
    try {
      let product_images_files = [];

      const images_metadata = productData.product_images.map((image, index) => {
        if (image.file) {
          product_images_files.push(image.file);
          return {
            name: `product_image_${index + 1}`,
            type: image.file.type,
            size: image.file.size,
          };
        } else if (image.url) {
          return {
            name: `product_image_${index + 1}`,
            url: image.url,
          };
        }
      });

      const payload = {
        ...productData,
        product_images: images_metadata,
      };

      const { data: response } = await axiosInstance.post(
        `${BASE_URL}/add`,
        payload
      );

      if (response.imgUploadUrls && product_images_files.length > 0) {
        await VendorProductService.uploadImages(
          product_images_files,
          response.imgUploadUrls
        );
      }
      toast.success("Product Added");
      return response.product;
    } catch (error) {
      toast.error(error.response?.data?.message || "Add Product failed");
      console.error("Error in addProduct:", error.response?.data?.message);
    }
  },

  addProductVariant: async (productData) => {
    try {
      let product_images_files = [];

      const images_metadata = productData.product_images.map((image, index) => {
        if (image.file) {
          product_images_files.push(image.file);
          return {
            name: `product_image_${index + 1}`,
            type: image.file.type,
            size: image.file.size,
          };
        } else if (image.url) {
          return {
            name: `product_image_${index + 1}`,
            url: image.url,
          };
        }
      });

      const payload = {
        ...productData,
        product_images: images_metadata,
      };

      const { data: response } = await axiosInstance.post(
        `${BASE_URL}/add-variant`,
        payload
      );

      if (response.imgUploadUrls && product_images_files.length > 0) {
        await VendorProductService.uploadImages(
          product_images_files,
          response.imgUploadUrls
        );
      }
      toast.success("Product Added");
      return response.product;
    } catch (error) {
      toast.error(error.response?.data?.message || "Add Product failed");
      console.error("Error in addProduct:", error.response?.data?.message);
    }
  },

  editProduct: async (productId, productData, imagesUpdated) => {
    try {
      let product_images_files = [];

      if (imagesUpdated) {
        const images_metadata = productData.product_images.map(
          (image, index) => {
            if (image.file) {
              product_images_files.push(image.file);
              return {
                name: `product_image_${index + 1}`,
                type: image.file.type,
                size: image.file.size,
              };
            } else if (image.url) {
              return {
                name: `product_image_${index + 1}`,
                url: image.url,
              };
            }
          }
        );

        productData.product_images = images_metadata;
      }

      const { data: response } = await axiosInstance.put(
        `${BASE_URL}/edit/${productId}`,
        { productData, imagesUpdated }
      );

      if (response.imgUploadUrls && product_images_files.length > 0) {
        await VendorProductService.uploadImages(
          product_images_files,
          response.imgUploadUrls
        );
      }
      toast.success("Product Edited");
      return response.product;
    } catch (error) {
      toast.error(error.response?.data?.message || "Edit Product failed");
      console.error("Error in editProduct:", error);
    }
  },

  deleteProduct: async (productId) => {
    try {
      const response = await axiosInstance.delete(
        `${BASE_URL}/delete/${productId}`
      );
      toast.success("Product Deleted");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete Product failed");
      console.error("Error in deleteProduct:", error.response?.data?.message);
    }
  },
};
