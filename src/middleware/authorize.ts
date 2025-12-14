import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { AppError } from "./errorHandler";
import { CustomRequest } from "../types/http.types";

// Protect routes - verify JWT token
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new AppError("Not authorized to access this route", 401);
  }

  try {
    // Verify token
    const JWT_SECRET =
      process.env.JWT_SECRET || "your-secret-key-change-in-production";
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    // Get user from token
    const user = await User.findById(decoded.id).select("-__v");

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Attach user to request
    (req as CustomRequest).user = {
      id: user._id.toString(),
      role: "user", // You can add role field to User model if needed
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError("Invalid token", 401);
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError("Token expired", 401);
    }
    throw error;
  }
};

// Optional: Role-based authorization (for future use)
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = (req as CustomRequest).user?.role;

    if (!userRole || !roles.includes(userRole)) {
      throw new AppError(
        `User role '${userRole}' is not authorized to access this route`,
        403
      );
    }

    next();
  };
};
