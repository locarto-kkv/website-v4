import axios from "axios";
import db from "../lib/db.js";
import { consumers } from "./seedConsumers.js";
import { login_user } from "./seedProducts.js";

const getRandomDeliveryDate = () => {
  const daysToAdd = Math.floor(Math.random() * 7) + 1;
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString();
};

const getRandomPaymentDate = () => {
  const daysToAdd = Math.floor(Math.random() * 7) + 1;
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString();
};

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seedOrders(consumers) {
  // fetch products from DB
  const { data: products, error: productError } = await db
    .from("products")
    .select("id, price");

  if (productError) {
    console.error("❌ Error fetching products:", productError);
    return;
  }

  if (!products || products.length === 0) {
    console.error("❌ No products found in database.");
    return;
  }

  for (let consumer of consumers) {
    const authCookie = await login_user(consumer, "consumer");
    if (!authCookie) continue;

    // Each consumer creates 3 orders
    for (let i = 0; i < 3; i++) {
      const product = getRandomItem(products);
      const delivery_date = getRandomDeliveryDate();

      const payment_mode = getRandomItem(["cod", "credit_card", "paypal"]);
      let payment_date = null;
      let payment_status = "pending";

      if (payment_mode !== "cod") {
        payment_date = getRandomPaymentDate();
        payment_status = "complete"; // match your schema
      }

      const orderData = {
        productId: product.id,
        order: {
          support_status: getRandomItem(["open", "in_progress", "closed"]),
          order_status: getRandomItem([
            "pending",
            "shipped",
            "delivered",
            "cancelled",
          ]),
          delivery_date,
          payment_mode,
          amount: (product.price + 5).toFixed(2), // as string like "84.99"
          payment_date,
          payment_status,
        },
      };

      try {
        const res = await axios.post(
          "http://localhost:5000/api/consumer/order/place-order",
          orderData,
          {
            headers: { Cookie: authCookie },
          }
        );

        console.log(
          `✅ Added order for consumer ${consumer.id} (product ${orderData.productId})`,
          res.data
        );
      } catch (err) {
        console.error(
          `❌ Error adding order for consumer ${consumer.id}:`,
          err.response?.data || err.message
        );
      }
    }
  }
}

seedOrders(consumers);
