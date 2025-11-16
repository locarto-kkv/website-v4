import { axiosInstance } from "../../lib/axios.js";

const BASE_URL = "/consumer/payment";

export const ConsumerPaymentService = {
  initiatePayment: async (profile, orderData) => {
    const { data: options } = await axiosInstance.post(`${BASE_URL}/initiate`, {
      data: orderData,
      profile,
    });

    return options;
  },

  validatePayment: async (paymentResponse) => {
    const { data } = await axiosInstance.post(
      `${BASE_URL}/validate`,
      paymentResponse
    );

    return data;
  },
};
