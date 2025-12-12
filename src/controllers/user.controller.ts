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
    const { Email, Password } = req.body;
    const findUser = await User.findOne({ Email: Email });
    console.log(findUser);
    if (findUser) {
      return res.status(400).json({ message: "User already exists" });
    } else {
      const hashedPassword = await bcrypt.hash(Password, 10);
      console.log("Hashed Password");
      const newUser = await User.create({
        ...req.body,
        Password: hashedPassword,
      });
      const userDoc = Array.isArray(newUser) ? newUser[0] : newUser;
      console.log("New User Created");

      const token = jwt.sign(
        { id: userDoc._id.toString(), role: "user" },
        JWT_SECRET as string,
        { expiresIn: "1h" }
      );

      res.status(201).json({ user: userDoc, token });
    }
  } catch (error) {
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
      res.status(200).json({ token });
    } else {
      return res.status(400).json({ message: "User not found" });
    }
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
};
