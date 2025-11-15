import { axiosInstance } from "../../lib/axios.js";

const BASE_URL = "/consumer/payment";

export const ConsumerPaymentService = {
  initiatePayment: async (product) => {
    const { data: options } = await axiosInstance.post(
      `${BASE_URL}/initiate`,
      product
    );

    options.handler = async function (response) {
      try {
        const { data: verify } = await axiosInstance.post(
          `${BASE_URL}/validate`,
          response
        );
        if (verify.status === "ok") {
          window.location.href = "/payment-success";
        } else {
          alert("Payment verification failed");
        }
      } catch (err) {
        console.error("Error verifying payment:", err);
        alert("Error verifying payment");
      }
    };

    return options;
  },
};
