import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios.js";

const BASE_URL = "/admin/vendor";

export const AdminVendorService = {
  authoriseVendor: async (vendorId, status) => {
    try {
      const response = await axiosInstance.patch(
        `${BASE_URL}/authorise/${vendorId}`,
        status
      );

      toast.success("Updated Vendor Authorisation");
    } catch (error) {
      toast.error(error.response?.data?.message || "Authorise Vendor failed");
      console.log("Error in authoriseVendor:", error);
    }
  },
};
