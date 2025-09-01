import axios from "axios";
import { consumers } from "./seedConsumers.js";
import { login_user } from "./seedProducts.js";

// utils
const getRandomDeliveryDate = () => {
  const daysToAdd = Math.floor(Math.random() * 7) + 1;
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString();
};

const getRandomPaymentStatus = () => {
  return Math.random() > 0.5 ? "pending" : "complete";
};

const getRandomProduct = async () => {
  const productId = Math.floor(Math.random() * (41 - 27 + 1)) + 27;
  const product = await axios.get(
    `http://localhost:5000/api/consumer/product?id=${productId}`
  );
  //   console.log(product.data);

  return product.data;
};

// seed function
export const seedTransaction = async () => {
  try {
    for (let consumer of consumers) {
      const authCookie = await login_user(consumer, "consumer");
      if (!authCookie) continue;

      // prepare req.product for transaction
      const product = await getRandomProduct();

      // prepare req.body for order
      const order = {
        order_status: "pending",
        support_status: "open",
        delivery_date: getRandomDeliveryDate(),
      };

      // prepare req.body for transaction
      const transaction = {
        payment_date: order.delivery_date,
        payment_status: getRandomPaymentStatus(),
      };

      // call addOrder to create order
      const newTransaction = await axios.post(
        "http://localhost:5000/api/consumer/transaction/add",
        { transaction, order, product },
        {
          headers: {
            Cookie: authCookie,
          },
        }
      );

      //   console.log(newTransaction);
    }
  } catch (error) {
    console.log("Error in seedTransaction controller: ", error);
  }
};

seedTransaction();
// getRandomProduct();
