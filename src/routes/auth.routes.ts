import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { authorize } from "../middlewares/authorize";

const router = Router();

// POST /api/auth/register
router.post("/register", (req, res, next) => {
  authController.register(req, res, next);
});

// POST /api/auth/login
router.post("/login", (req, res, next) => {
  authController.login(req, res, next);
});

// GET /api/auth/profile (protected)
router.get("/profile", authorize, (req, res, next) => {
  authController.getProfile(req, res, next);
});

export default router;
