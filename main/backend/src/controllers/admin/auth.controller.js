import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

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
      .from("admins")
      .insert(newUser)
      .select()
      .single();

    if (error) return res.status(400).json({ message: "Admin already exists" });

    fs.mkdirSync(`./uploads/documents/${user.id}`);

    generateToken(user.id, "admin", res);

    return res.status(201).json({ user, type: "admin" });
  } catch (error) {
    console.log("Error in signup controller: ", error.message);
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
      .from("admins")
      .select()
      .eq("email", email)
      .limit(1)
      .single();

    if (!user) {
      console.log(error);
      return res.status(400).json({ message: "Admin does not exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid Credentials" });

    generateToken(user.id, "admin", res);

    res.status(200).json({ user, type: "admin" });
  } catch (error) {
    console.log("Error in login controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
