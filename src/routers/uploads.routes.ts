import { Router } from "express";
import { updateUser } from "../controllers/user.controller";
import {
  uploadProfileImage,
  uploadDriverLicense,
  uploadStatusDocument,
  uploadMultipleStatusDocuments,
} from "../middleware/upload";

const router = Router();

// Upload profile image
router.put("/:id/profile-image", uploadProfileImage, updateUser);

// Upload driver license
router.put("/:id/driver-license", uploadDriverLicense, updateUser);

// Upload single status document (PDF or image)
router.put("/:id/status-document", uploadStatusDocument, updateUser);

// Upload multiple status documents (PDFs or images)
router.put("/:id/status-documents", uploadMultipleStatusDocuments, updateUser);

export default router;
