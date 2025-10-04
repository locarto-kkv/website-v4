import logger from "../../lib/logger.js";
import db from "../../lib/db.js";
import bcrypt from "bcryptjs";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: userProfile, error } = await db
      .from("consumers")
      .select("id, created_at, name, email, phone_no, address")
      .eq("id", userId)
      .single();

    res.status(200).json(userProfile);
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "getProfile",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { data: updatedUser } = await db
      .from("consumers")
      .update({ password: hashedPassword })
      .eq("id", userId)
      .select()
      .single();

    res.status(200).json(updatedUser);
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "updatePassword",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const newProfileData = req.body;

    const { data: updatedUser } = await db
      .from("consumers")
      .update(newProfileData)
      .eq("id", userId)
      .select()
      .single();

    res.status(200).json(updatedUser);
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "updateProfile",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await db
      .from("consumers")
      .delete()
      .eq("id", userId);

    res.status(200).json({ message: "Profile Deleted Successfully" });
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "deleteProfile",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};
