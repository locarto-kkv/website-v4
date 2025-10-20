import nodemailer from "nodemailer";
import logger from "../../lib/logger.js";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

export const sendSupportEmail = async (req, res) => {
  try {
    const payload = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const to = "it@locarto.in";

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: `Support Email From ${payload.name}`,
      text: payload,
    });
    console.log(`Email OTP sent to ${to}`);
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "sendSupportEmail",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};
