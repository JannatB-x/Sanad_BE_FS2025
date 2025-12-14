import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import { AuthRequest } from "../type/http";

export class AuthController {
  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({
        message: "User registered successfully",
        ...result,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Registration failed";
      res.status(400).json({ message });
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.login(req.body);
      res.status(200).json({
        message: "Login successful",
        ...result,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      res.status(401).json({ message });
    }
  }

  async getProfile(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Not authenticated" });
        return;
      }

      const profile = await authService.getProfile(req.user.id);
      res.status(200).json({
        message: "Profile retrieved successfully",
        user: profile,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to get profile";
      res.status(400).json({ message });
    }
  }
}

export const authController = new AuthController();
