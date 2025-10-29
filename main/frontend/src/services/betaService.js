import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";

const BASE_URL = "/consumer/submit-beta";

export const submitBeta = async (form) => {
  try {
    await axiosInstance.post(`${BASE_URL}/`, form);
    toast.success(`Email Submitted: ${form.email} for ${form.name}`);
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
