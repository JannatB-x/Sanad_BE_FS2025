import type { Request, Response, NextFunction } from "express";
import User from "../models/user";
import errorHandler from "../middlewares/errorHandler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
import { CustomRequest } from "../type/http";

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find().populate("Bookings");
    res.status(200).json({ message: "Users found successfully", users });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id).populate("Bookings");
    res.status(200).json({ message: "User found successfully", user });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({ message: "User created successfully", newUser });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      Email,
      Password,
      Username,
      Name,
      Identification,
      MedicalHistory,
      Disabilities,
      FunctionalNeeds,
      Location,
      EmergencyContact,
      EmergencyContactPhone,
      EmergencyContactRelationship,
    } = req.body;

    // Validate required fields
    if (!Email || !Password) {
      return res
        .status(400)
        .json({ message: "Email and Password are required" });
    }

    // Check if user already exists
    const findUser = await User.findOne({ Email: Email });
    if (findUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Create user with provided data or defaults
    const newUser = await User.create({
      Id: Username || Email.split("@")[0], // Use username or email prefix as ID
      Name: Name || Username || Email.split("@")[0],
      Role: "user",
      Email: Email,
      Password: hashedPassword,
      Identification: Identification || "",
      MedicalHistory: MedicalHistory || "",
      Disabilities: Disabilities || "",
      FunctionalNeeds: FunctionalNeeds || "",
      Location: Location || "",
      EmergencyContact: EmergencyContact || "",
      EmergencyContactPhone: EmergencyContactPhone || "",
      EmergencyContactRelationship: EmergencyContactRelationship || "",
    });

    const userDoc = Array.isArray(newUser) ? newUser[0] : newUser;

    // Generate JWT token
    const token = jwt.sign(
      { id: userDoc._id.toString(), role: "user" },
      JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: userDoc._id,
        email: userDoc.Email,
        name: userDoc.Name,
      },
      token,
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    next(error);
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { Email, Password } = req.body;

    const findUser = await User.findOne({ Email: Email });
    if (findUser) {
      const isMatch = await bcrypt.compare(Password, findUser.Password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid password" });
      }
      const token = jwt.sign(
        { id: findUser._id.toString(), role: "user" },
        JWT_SECRET as string,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: findUser._id,
          email: findUser.Email,
          name: findUser.Name,
          role: findUser.Role,
        },
      });
    } else {
      return res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    next(error);
  }
};

// Get current user profile
const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const r = req as CustomRequest;
    const userId = r.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const user = await User.findById(userId).select("-Password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User profile retrieved successfully",
      user: {
        id: user._id,
        name: user.Name,
        email: user.Email,
        role: user.Role,
        identification: user.Identification,
        location: user.Location,
        medicalHistory: user.MedicalHistory,
        disabilities: user.Disabilities,
        functionalNeeds: user.FunctionalNeeds,
        emergencyContact: user.EmergencyContact,
        emergencyContactPhone: user.EmergencyContactPhone,
        emergencyContactRelationship: user.EmergencyContactRelationship,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update current user profile
const updateCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const r = req as CustomRequest;
    const userId = r.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Don't allow password update through this endpoint
    const { Password, ...updateData } = req.body;

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-Password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.Name,
        email: user.Email,
        role: user.Role,
        identification: user.Identification,
        location: user.Location,
        medicalHistory: user.MedicalHistory,
        disabilities: user.Disabilities,
        functionalNeeds: user.FunctionalNeeds,
        emergencyContact: user.EmergencyContact,
        emergencyContactPhone: user.EmergencyContactPhone,
        emergencyContactRelationship: user.EmergencyContactRelationship,
      },
    });
  } catch (error) {
    next(error);
  }
};

export {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  registerUser,
  loginUser,
  getCurrentUser,
  updateCurrentUser,
};
