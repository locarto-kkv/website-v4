import multer from "multer";

// const backendURL =
// process.env.NODE_ENV === "development" ? process.env.BACKEND_URL : "/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // console.log("upload.multer: ", file);

    file.upload_path =
      file.fieldname === "product_images"
        ? `uploads/products/${req.body.id}/`
        : `uploads/documents/${req.user.id}/`;

    cb(null, file.upload_path);
  },
  filename: (req, file, cb) => {
    file.file_name =
      file.fieldname === "product_images"
        ? file.originalname
        : file.fieldname + "-" + file.originalname;

    const backendURL = process.env.BACKEND_URL;
    file.backend_filepath = `${backendURL}/${file.upload_path}/${file.file_name}`;

    cb(null, file.file_name);
  },
});

export const upload = multer({
  storage,
});
