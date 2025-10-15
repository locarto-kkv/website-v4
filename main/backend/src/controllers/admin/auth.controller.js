import bcrypt from "bcryptjs";
import logger from "../../lib/logger.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

import db from "../../lib/db.js";
import { generateToken } from "../../lib/utils.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const { data: user, error } = await db
      .from("admins")
      .select()
      .eq("email", email)
      .limit(1)
      .single();

    if (!user) return res.status(400).json({ message: "User does not exist" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid Credentials" });

    generateToken(user.id, "admin", res);

    res.status(200).json({ id: user.id, type: "admin" });
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "login",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "logout",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};
