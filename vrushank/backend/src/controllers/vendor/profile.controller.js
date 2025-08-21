import dotenv from "dotenv";
dotenv.config();

import db from "../../lib/vendor/db.js";

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: userProfile, error } = await db
      .from("vendors")
      .select("id, created_at, name, email, phone_no, address, documents")
      .eq("id", userId)
      .single();

    res.status(200).json(userProfile);
  } catch (error) {
    console.log("Error in getProfile controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const newProfileData = req.body;

    const { data: updatedUser } = await db
      .from("vendors")
      .update(newProfileData)
      .eq("id", userId)
      .select()
      .single();

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in updateProfile controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const uploadDocs = async (req, res) => {
  try {
    const files = req.files;
    const userId = req.user.id;

    // console.log(files);

    const documents = {};

    for (const key in files) {
      const file = files[key][0];
      documents[key] = file.backend_filepath;
    }

    const { data: updatedUser } = await db
      .from("vendors")
      .update({ documents })
      .eq("id", userId)
      .select()
      .single();

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in uploadDocs controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await db.from("vendors").delete().eq("id", userId);

    return res.status(200).json({ message: "Profile Deleted Successfully" });
  } catch (error) {
    console.log("Error in deleteProfile controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
