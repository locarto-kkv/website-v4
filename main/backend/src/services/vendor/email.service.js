import nodemailer from "nodemailer";
import logger from "../../lib/logger.js";
import { env } from "../../lib/env.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

export const sendAuthEmail = async (payload) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "it@locarto.in",
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        refreshToken: env.GOOGLE_REFRESH_TOKEN,
      },
    });

    const to = "team@locarto.in";

    await transporter.sendMail({
      from: "it@locarto.in",
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
