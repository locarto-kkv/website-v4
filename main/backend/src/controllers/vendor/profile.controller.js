import logger from "../../lib/logger.js";
import { getFileUploadUrl, deleteFolder } from "../../services/file.service.js";
import { env } from "../../lib/env.js";
import db from "../../lib/db.js";
import { sendAuthEmail } from "../../services/vendor/email.service.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data } = await db
      .from("vendors")
      .select("*, address: addresses_vendor_id_fkey(*)")
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
    const imgUploadUrls = {};
    const fileUploadUrls = [];

    if (newProfileData.profile.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      newProfileData.profile.password = hashedPassword;
    }

    if (newProfileData.profile.brand_logo_1) {
      const imgUploadUrl = await getFileUploadUrl(
        userId,
        newProfileData.profile.brand_logo_1,
        "brand_logos"
      );

      const imgPublicUrl = `${env.SUPABASE_PROJECT_URL}/storage/v1/object/public/brand-logos/${imgUploadUrl.filePath}`;

      imgUploadUrls.brand_logo_1 = imgUploadUrl;
      newProfileData.profile.brand_logo_1 = imgPublicUrl;
    }

    if (newProfileData.profile.brand_logo_2) {
      const imgUploadUrl = await getFileUploadUrl(
        userId,
        newProfileData.profile.brand_logo_2,
        "brand_logos"
      );

      const imgPublicUrl = `${env.SUPABASE_PROJECT_URL}/storage/v1/object/public/brand-logos/${imgUploadUrl.filePath}`;

      imgUploadUrls.brand_logo_2 = imgUploadUrl;
      newProfileData.profile.brand_logo_2 = imgPublicUrl;
    }

    if (newProfileData.profile.documents) {
      const filePublicUrls = {};

      for (const [key, fileMetadata] of Object.entries(
        newProfileData.profile.documents
      )) {
        const fileUploadUrl = await getFileUploadUrl(
          userId,
          fileMetadata,
          "vendor-documents"
        );

        const publicUrl = `${env.SUPABASE_PROJECT_URL}/storage/v1/object/public/vendor-documents/${fileUploadUrl.filePath}`;

        fileUploadUrls.push(fileUploadUrl);

        filePublicUrls[key] = publicUrl;
      }

      newProfileData.profile.documents = filePublicUrls;
    }

    if (newProfileData.address) {
      const { data, error } = await db
        .from("addresses")
        .upsert(
          { ...newProfileData.address, vendor_id: userId },
          { onConflict: "id" }
        );
      sendAuthEmail({ ...newProfileData, vendor_id: userId });
    }

    const { data: updatedUser, error } = await db
      .from("vendors")
      .update(newProfileData.profile)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;

    res
      .status(200)
      .json({ vendor: updatedUser, imgUploadUrls, fileUploadUrls });
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

    await db.from("vendors").delete().eq("id", userId);
    await db.from("addresses").delete().eq("vendor_id", userId);
    await deleteFolder(userId, "brand-logos");
    await deleteFolder(userId, "vendor-documents");

    return res.status(200).json({ message: "Profile Deleted Successfully" });
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
