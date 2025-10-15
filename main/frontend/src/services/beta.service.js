import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";

const BASE_URL = "/consumer/submit-beta-email";

export const submitEmail = async (email) => {
  try {
    await axiosInstance.post(`${BASE_URL}/`, { email });
    toast.success(`Email Submitted: ${email}`);
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
