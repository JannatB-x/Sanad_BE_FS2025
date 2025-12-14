// middlewares/uploadMiddleware.ts
import multer from "multer";
import path from "path";
import fs from "fs";

// Create uploads directory if it doesn't exist
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "uploads/";

    // Organize by type
    if (file.fieldname === "profileImage") {
      folder += "profiles/";
    } else if (file.fieldname === "driverLicense") {
      folder += "licenses/";
    } else if (file.fieldname === "vehicleImage") {
      folder += "vehicles/";
    } else if (file.fieldname === "statusDocument") {
      folder += "status-documents/";
    } else {
      folder += "others/";
    }

    // Create folder if it doesn't exist
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    cb(null, folder);
  },
  filename: (req, file, cb) => {
    // Create unique filename: timestamp-random-originalname
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// File filter - only allow images (for profile, vehicle, etc.)
const imageFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp)"));
  }
};

// File filter - allow images AND PDFs (for status documents)
const documentFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|pdf/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = /image\/(jpeg|jpg|png|gif|webp)|application\/pdf/.test(
    file.mimetype
  );

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only image files (jpeg, jpg, png, gif, webp) and PDF files are allowed"
      )
    );
  }
};

// Configure multer for images only
const uploadImage = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Configure multer for documents (images + PDFs)
const uploadDocument = multer({
  storage: storage,
  fileFilter: documentFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for documents
  },
});

// Export different upload configurations
export const uploadProfileImage = uploadImage.single("profileImage");
export const uploadDriverLicense = uploadImage.single("driverLicense");
export const uploadVehicleImage = uploadImage.single("vehicleImage");
export const uploadStatusDocument = uploadDocument.single("statusDocument"); // NEW: For user status
export const uploadMultipleStatusDocuments = uploadDocument.array(
  "statusDocuments",
  5
); // NEW: Multiple status docs
export const uploadMultipleImages = uploadImage.array("images", 5); // Max 5 images

export default uploadImage;
