import db from "./db.js";

const uploadVendorDocs = async (req, res) => {
  try {
    // await db.storage.from("vendor-documents");
    // next();
  } catch (error) {
    console.log("Error in uploadVendorDocs: ", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default uploadVendorDocs;
