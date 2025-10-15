import { axiosInstance } from "../../lib/axios.js";

const BASE_URL = "/admin/order";

export const AdminOrderService = {
  getOrderById: async (orderId) => {
    const response = await axiosInstance.get(`${BASE_URL}/${orderId}`);
    return response.data;
  },

  editOrder: async (orderId, orderData) => {
    const { data: response } = await axiosInstance.put(
      `${BASE_URL}/edit/${orderId}`,
      orderData
    );

    if (response.fileUploadUrl) {
      await AdminOrderService.uploadInvoice(
        orderData.invoice,
        response.fileUploadUrl
      );
    }
    return response.data;
  },

  uploadInvoice: async (files, fileUploadUrl) => {
    await Promise.all(
      fileUploadUrl.map(async (url, i) => {
        const { uploadUrl, fileType } = url;

        await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": fileType },
          body: files[i],
        });
      })
    );
  },
};
