import logger from "../../lib/logger.js";
import { env } from "../../lib/env.js";
import Razorpay from "razorpay";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const FRONTEND_URL =
  env.BACKEND_NODE_ENV === "development"
    ? env.FRONTEND_URL
    : env.PRODUCTION_URL;

// import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";

const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET,
});

export const initiatePayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const product = req.body;
    var date = new Date();
    date = date.toISOString();

    const options = {
      amount: product.price * 100,
      currency: "INR",
      receipt: `${userId}_${product.id}_${date}`,
    };

    console.log(options);

    const order = await razorpay.orders.create(options);

    const orderData = {
      key: env.RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Locarto",
      description: "Test Transaction",
      order_id: order.id,
      callback_url: `${FRONTEND_URL}/payment/success`, // Frontend success URL
      prefill: {
        name: "Your Name",
        email: "your.email@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#F37254",
      },
    };

    console.log(orderData);

    res.status(200).json(orderData);
  } catch (error) {
    logger({
      level: "error",
      message: error,
      location: __filename,
      func: "initiatePayment",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const validatePayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // Verify payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        razorpay_order_id,
        razorpay_payment_id,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid signature, payment verification failed",
      });
    }
  } catch (error) {
    logger({
      level: "error",
      message: error,
      location: __filename,
      func: "validatePayment",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// export const razorpayWebhook = async (req, res) => {
//   try {
//     const webhookSecret = env.RAZORPAY_WEBHOOK_SECRET;

//     const signature = req.headers["x-razorpay-signature"];
//     const shasum = crypto.createHmac("sha256", webhookSecret);
//     shasum.update(JSON.stringify(req.body));
//     const digest = shasum.digest("hex");

//     if (digest === signature) {
//       console.log("✅ Webhook verified successfully:", req.body.event);
//       // You can store or update your DB here based on payment status
//       res.status(200).json({ received: true });
//     } else {
//       console.log("❌ Invalid webhook signature");
//       res.status(400).json({ message: "Invalid webhook signature" });
//     }
//   } catch (error) {
//     logger({
//       level: "error",
//       message: error.message,
//       location: __filename,
//       func: "razorpayWebhook",
//     });
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
