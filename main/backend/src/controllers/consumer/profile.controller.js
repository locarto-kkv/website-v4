import logger from "../../lib/logger.js";
import db from "../../lib/db.js";
import bcrypt from "bcryptjs";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data } = await db
      .from("consumers")
      .select("*, address: addresses_consumer_id_fkey(*)")
      .eq("id", userId)
      .single();

    const { password, ...userProfile } = data;

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

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const newProfileData = req.body;

    if (newProfileData.profile?.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      newProfileData.profile.password = hashedPassword;
    }

    if (newProfileData.address) {
      console.log(newProfileData.address);

      const { data, error } = await db
        .from("addresses")
        .upsert(
          { ...newProfileData.address, consumer_id: userId },
          { onConflict: "id" }
        );
      if (error) throw error;
    }

    const { data: updatedUser, error } = await db
      .from("consumers")
      .update(newProfileData.profile)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;

    getProfile(req, res);
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

export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const userId = req.user.id;

    await db
      .from("addresses")
      .delete()
      .eq("id", addressId)
      .eq("consumer_id", userId);

    res.status(200).json({ message: "Address Deleted Successfully" });
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "deleteAddress",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    await db.from("consumers").delete().eq("id", userId);
    await db.from("addresses").delete().eq("consumer_id", userId);

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
