import logger from "../../lib/logger.js";
import db from "../../lib/db.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

export const getImgUploadUrl = async (blogId, file) => {
  try {
    const fileType = file.type;
    const fileName = file.name;
    const fileSize = file.size;

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const formattedFileName = `${blogId}_${timestamp}_${fileName}`;

    const filePath = `${blogId}/${formattedFileName}`;

    const { data, error } = await db.storage
      .from("brand-logos")
      .createSignedUploadUrl(filePath);

    if (error) throw error;

    return {
      uploadUrl: data.signedUrl,
      filePath,
      fileType,
      fileSize,
    };
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "getImgUploadUrl",
    });
  }
};

export const deleteImgFolder = async (blogId) => {
  const { data: files } = await db.storage
    .from("brand-logos")
    .list(blogId, { limit: 100 });

  const filePaths = files.map((file) => `${blogId}/${file.name}`);

  await db.storage.from("brand-logos").remove(filePaths);
};
