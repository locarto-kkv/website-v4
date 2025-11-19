import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios.js";
import { useAuthStore } from "../../store/useAuthStore.jsx";

const BASE_URL = "/consumer/list";

// Helper to verify if the current user is a consumer
const ensureConsumerAuth = () => {
  const { currentUser } = useAuthStore.getState();
  if (!currentUser || currentUser.type !== "consumer") {
    toast.error("Unauthorized: Please login as a Consumer");
    throw new Error("Unauthorized: Please login as a Consumer");
  }
};

export const ConsumerListService = {
  getLists: async () => {
    ensureConsumerAuth();

    const response = await axiosInstance.get(`${BASE_URL}/`);
    return response.data;
  },

  updateList: async (type, quantity, productId) => {
    ensureConsumerAuth();

    const response = await axiosInstance.put(
      `${BASE_URL}/update/${productId}`,
      {
        type,
        quantity,
      }
    );

    return response.data;
  },

  removeFromList: async (type, productId) => {
    ensureConsumerAuth();

    const response = await axiosInstance.delete(
      `${BASE_URL}/delete/${productId}`,
      {
        data: { type },
      }
    );
    return response.data;
  },

  clearList: async (type) => {
    ensureConsumerAuth();

    const response = await axiosInstance.delete(`${BASE_URL}/clear/`, {
      data: { type },
    });
    return response.data;
  },
};
