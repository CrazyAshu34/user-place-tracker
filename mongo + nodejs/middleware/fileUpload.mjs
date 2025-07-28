import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import path from "node:path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // like .png
    cb(null, uuidv4() + ext); // <-- ✅ call the function
  },
});

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter: imageFilter }); // <-- ✅ key should be fileFilter

export default upload;
