import multer from "multer";

// const backendURL =
// process.env.NODE_ENV === "development" ? process.env.BACKEND_URL : "/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // console.log("upload.multer: ", file);

    file.upload_path = `uploads/reviews/${req.user.id}/${req.body.id}`;

    cb(null, file.upload_path);
  },
  filename: (req, file, cb) => {
    file.file_name = file.fieldname + "-" + file.originalname;

    const backendURL = process.env.BACKEND_URL;
    file.backend_filepath = `${backendURL}/${file.upload_path}/${file.file_name}`;

    cb(null, file.file_name);
  },
});

export const upload = multer({
  storage,
});
