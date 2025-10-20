import nodemailer from "nodemailer";
import logger from "../../lib/logger";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

export const sendAuthEmail = async (payload) => {
  try {
    const payload = payload;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const to = "it@locarto.in";

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: `Verification Email From ${payload.businessName}`,
      text: payload,
    });
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "sendAuthEmail",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};
