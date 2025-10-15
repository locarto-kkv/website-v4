import bcrypt from "bcryptjs";
import logger from "../../lib/logger.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

import db from "../../lib/db.js";
import { generateToken } from "../../lib/utils.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    } else if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 8 characters" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      name,
      email,
      password: hashedPassword,
    };

    const { data: user, error } = await db
      .from("vendors")
      .insert(newUser)
      .select()
      .single();

    if (error) return res.status(400).json({ message: "User already exists" });

    generateToken(user.id, "vendor", res);

    res.status(201).json({ id: user.id, type: "vendor" });
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "signup",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const { data: user, error } = await db
      .from("vendors")
      .select()
      .eq("email", email)
      .limit(1)
      .single();

    if (!user) return res.status(400).json({ message: "User does not exist" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid Credentials" });

    generateToken(user.id, "vendor", res);

    res.status(200).json({ id: user.id, type: "vendor" });
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
