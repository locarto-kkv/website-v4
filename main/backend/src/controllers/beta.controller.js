import logger from "../lib/logger.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

import db from "../lib/db.js";

export const submitBeta = async (req, res) => {
  try {
    const { name, email } = req.body;
    const { data, error } = await db.from("beta").insert({ name, email });

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
