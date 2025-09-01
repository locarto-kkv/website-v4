import axios from "axios";
import { consumers } from "./seedConsumers.js";
import { login_user } from "./seedProducts.js";

const getRandomDeliveryDate = () => {
  const daysToAdd = Math.floor(Math.random() * 7) + 1;
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString();
};

async function seedOrders(consumers) {
  for (let consumer of consumers) {
    const authCookie = await login_user(consumer, "consumer");
    if (!authCookie) continue;

    // Each consumer creates 3 orders
    for (let i = 0; i < 3; i++) {
      const delivery_date = getRandomDeliveryDate();
      const order = {
        product_id: Math.floor(Math.random() * (41 - 27 + 1)) + 27, // 27–41
        delivery_date,
        order_status: ["pending", "shipped", "delivered", "cancelled"][
          Math.floor(Math.random() * 4)
        ],
        support_status: ["open", "in_progress", "closed"][
          Math.floor(Math.random() * 3)
        ],
      };

      try {
        const res = await axios.post(
          "http://localhost:5000/api/consumer/order/add",
          order,
          {
            headers: {
              Cookie: authCookie,
            },
          }
        );
        console.log(res.data);

        console.log(
          `✅ Added order for consumer ${order.consumer_id} (product ${order.product_id})`,
          res.data
        );
      } catch (err) {
        console.error(
          `❌ Error adding order for consumer ${order.consumer_id}:`,
          err.response?.data || err.message
        );
      }
    }
  }
}

seedOrders(consumers);
