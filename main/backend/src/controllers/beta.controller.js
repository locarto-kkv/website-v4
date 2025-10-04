import dotenv from "dotenv";
import logger from "../lib/logger.js";
dotenv.config();

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

import db from "../lib/db.js";

export const submitEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const { data, error } = await db.from("beta").insert({ email });

    if (error) return res.status(400).json({ message: "Email already exists" });

    res.status(201).json({ message: "Email Submitted" });
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "submitEmail",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};
