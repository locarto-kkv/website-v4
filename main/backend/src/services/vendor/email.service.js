import nodemailer from "nodemailer";
import logger from "../../lib/logger.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

export const sendAuthEmail = async (payload) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const to = "vrushankssj@gmail.com";

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: `Profile Verification Email From ${payload.profile.name}`,
      text: JSON.stringify(payload, null, "\t"),
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
