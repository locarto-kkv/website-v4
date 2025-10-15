import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios.js";

const BASE_URL = "/admin/product";

export const AdminProductService = {
  restrictProduct: async (productId, status) => {
    try {
      const response = await axiosInstance.patch(
        `${BASE_URL}/restrict/${productId}`,
        status
      );

      toast.success("Product Restricted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Restrict Product failed");
      console.log("Error in restrictProduct:", error);
    }
  },
};
