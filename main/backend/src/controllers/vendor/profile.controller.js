import dotenv from "dotenv";
dotenv.config();

import db from "../../lib/db.js";

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

export const getDocUploadUrl = async (userId, files) => {
  try {
    const docUploadUrls = [];

    for (const file of files) {
      const fileType = file.type;
      const fileName = file.name;
      const fileSize = file.size;

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const formattedFileName = `${userId}_${timestamp}_${fileName}`;

      const filePath = `${userId}/${formattedFileName}`;

      const { data, error } = await db.storage
        .from("vendor-documents")
        .createSignedUploadUrl(filePath);

      if (error) throw error;

      docUploadUrls.push({
        uploadUrl: data.signedUrl,
        filePath,
        fileType,
        fileSize,
      });
    }

    return docUploadUrls;
  } catch (err) {
    console.log("Error in getDocUploadUrl:", err);
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
