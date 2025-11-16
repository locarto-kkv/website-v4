import Razorpay from "razorpay";
import { env } from "../lib/env";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";

const razorpay = new Razorpay({
  key_id: env.RAZORPAY_API_ID,
  key_secret: env.RAZORPAY_API_KEY,
});

const options = { amount: amount * 100, currency, receipt, notes };
const order = await razorpay.orders.create(options);

const orderData = {
  razorpay_id: order.id,
  amount: order.amount,
  currency: order.currency,
  receipt: order.receipt,
  status: "created",
};

// send orderData to frontend
