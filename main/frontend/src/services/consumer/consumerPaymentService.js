import { axiosInstance } from "../../lib/axios.js";

const BASE_URL = "/consumer/payment";

export const ConsumerPaymentService = {
  initiatePayment: async (profile, orderData) => {
    const { data: options } = await axiosInstance.post(`${BASE_URL}/initiate`, {
      data: orderData,
      profile,
    });

    options.handler = async function (response) {
      try {
        const { data: verify } = await axiosInstance.post(
          `${BASE_URL}/validate`,
          response
        );

        console.log("VERIFY:");

        console.log(verify);

        if (verify.success) {
          // window.location.href = "/payment-success";
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
