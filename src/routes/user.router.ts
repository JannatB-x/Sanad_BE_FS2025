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
} from "../controllers/user.controller";
import { authorize } from "../middlewares/authorize";

const router = express.Router();

// Authentication routes (should be before /:id route)
router.post("/register", registerUser);
router.post("/login", loginUser);

// Current user profile routes (should be before /:id route)
router.get("/me", authorize, getCurrentUser);
router.put("/me", authorize, updateCurrentUser);

// CRUD routes
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", authorize, createUser);
router.put("/:id", authorize, updateUser);
router.delete("/:id", authorize, deleteUser);

export default router;
