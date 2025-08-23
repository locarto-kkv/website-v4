import { axiosInstance } from "../../lib/axios.js";

const BASE_URL = "/api/vendor/products";

export const VendorProductService = {
  // GET /api/vendor/products/
  getProducts: async () => {
    const response = await axiosInstance.get(`${BASE_URL}/`);
    return response.data;
  },

  // GET /api/vendor/products/:id
  getProductById: async (id) => {
    const response = await axiosInstance.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // POST /api/vendor/products/add
  addProduct: async (productData) => {
    const response = await axiosInstance.post(`${BASE_URL}/add`, productData);
    return response.data;
  },

  // POST /api/vendor/products/upload
  uploadImages: async (formData) => {
    const response = await axiosInstance.post(`${BASE_URL}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // PUT /api/vendor/products/:id
  editProduct: async (id, productData) => {
    const response = await axiosInstance.put(`${BASE_URL}/${id}`, productData);
    return response.data;
  },

  // DELETE /api/vendor/products/:id
  removeProduct: async (id) => {
    const response = await axiosInstance.delete(`${BASE_URL}/${id}`);
    return response.data;
  },
};
