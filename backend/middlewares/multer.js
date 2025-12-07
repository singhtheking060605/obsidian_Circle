import multer from "multer";
import ErrorHandler from "./error.js"; // Assumes you have ErrorHandler imported
import path from "path";

// Configure disk storage for temporary file holding before Cloudinary upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Files stored temporarily in 'tmp/' directory
    cb(null, "tmp/");
  },
  filename: function (req, file, cb) {
    // Create unique filename based on user ID and original name
    const userId = req.user._id;
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${userId}-${Date.now()}${extension}`);
  },
});

// File Filter for Validation (ensures only correct file types are accepted)
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "profilePhoto") {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(
        new ErrorHandler(
          "Only image files are allowed for profile photo!",
          400
        ),
        false
      );
    }
  } else if (file.fieldname === "resume") {
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/msword" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      cb(null, true);
    } else {
      cb(
        new ErrorHandler(
          "Only PDF and DOCX files are allowed for resume!",
          400
        ),
        false
      );
    }
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB limit per file
  },
});

export default upload;
