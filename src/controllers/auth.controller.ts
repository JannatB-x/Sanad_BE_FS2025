import { Request, Response } from "express";
import User from "../models/user.model";
import { AppError } from "../middleware/errorHandler";
import jwt from "jsonwebtoken";
import { IUser, UserType } from "../types/user.type";
import { CustomRequest } from "../types/http.types";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

// Generate JWT Token
const generateToken = (userId: string): string => {
  const JWT_SECRET =
    process.env.JWT_SECRET || "your-secret-key-change-in-production";
  const JWT_EXPIRE = process.env.JWT_EXPIRE || "7d";

  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  } as jwt.SignOptions);
};

// Register new user
export const register = async (req: Request, res: Response): Promise<void> => {
  if (!req.body) {
    throw new AppError(
      "Request body is missing. Ensure Content-Type is application/json",
      400
    );
  }

  const { name, email, password, userType, diseases, disabilityLevel } =
    req.body;

  if (!name || !email || !password) {
    throw new AppError("Name, email, and password are required", 400);
  }

  if (password.length < 6) {
    throw new AppError("Password must be at least 6 characters long", 400);
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("User with this email already exists", 400);
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    userType: userType || UserType.USER,
    diseases: diseases || [],
    disabilityLevel: disabilityLevel || "",
  });

  // Generate token
  const token = generateToken(user._id.toString());

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        userType: user.userType,
        diseases: user.diseases,
        disabilityLevel: user.disabilityLevel,
      },
      token,
    },
  });
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  if (!req.body) {
    throw new AppError(
      "Request body is missing. Ensure Content-Type is application/json",
      400
    );
  }

  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  // Find user and include password field
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  // Generate token
  const token = generateToken(user._id.toString());

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        userType: user.userType,
        diseases: user.diseases,
        disabilityLevel: user.disabilityLevel,
      },
      token,
    },
  });
};

// Get current user (protected route)
export const getMe = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  // req.user is set by the auth middleware
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("User not authenticated", 401);
  }

  const user = await User.findById(userId).select("-password -__v");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    data: user,
  });
};

// Logout (client-side token removal, but we can add token blacklisting here if needed)
export const logout = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    throw new AppError("Email is required", 400);
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const resetToken = generateToken(user._id.toString());

  res.status(200).json({
    success: true,
    message: "Reset token generated successfully",
    data: {
      resetToken,
    },
  });
};
