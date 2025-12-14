import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  registerUser,
  loginUser,
  getCurrentUser,
  updateCurrentUser,
  uploadAvatar,
  uploadDocuments,
  deleteAvatar,
  deleteDocument,
} from "../controllers/user.controller";
import { authorize } from "../middlewares/authorize";
import { upload } from "../config/multer";

const router = express.Router();

// Authentication routes (should be before /:id route)
router.post("/register", registerUser);
router.post("/login", loginUser);

// Current user profile routes (should be before /:id route)
router.get("/me", authorize, getCurrentUser);
router.put("/me", authorize, updateCurrentUser);
router.get("/profile", authorize, getCurrentUser);
router.put("/profile", authorize, updateCurrentUser);

// File upload routes (should be before /:id route)
router.post("/me/avatar", authorize, upload.single("avatar"), uploadAvatar);
router.post(
  "/me/documents",
  authorize,
  upload.array("documents", 10),
  uploadDocuments
);
router.delete("/me/avatar", authorize, deleteAvatar);
router.delete("/me/documents/:documentPath", authorize, deleteDocument);

// Alternative profile routes for file uploads
router.post(
  "/profile/avatar",
  authorize,
  upload.single("avatar"),
  uploadAvatar
);
router.post(
  "/profile/documents",
  authorize,
  upload.array("documents", 10),
  uploadDocuments
);
router.delete("/profile/avatar", authorize, deleteAvatar);
router.delete("/profile/documents/:documentPath", authorize, deleteDocument);

// CRUD routes (protected - users should only access their own data or admin access)
router.get("/", authorize, getAllUsers);
router.get("/:id", authorize, getUserById);
router.post("/", authorize, createUser);
router.put("/:id", authorize, updateUser);
router.delete("/:id", authorize, deleteUser);

export default router;
