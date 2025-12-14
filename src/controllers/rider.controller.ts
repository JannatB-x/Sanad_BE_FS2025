import type { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import { AppError } from "../middleware/errorHandler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
import { CustomRequest } from "../types/http.types";

const getRiders = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

const getRiderById = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

const createRider = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};

const updateRider = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

const deleteRider = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

const getRiderRideHistory = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.params.id).populate("rideHistory");
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

const getRiderRideRatings = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.params.id).populate("rideRatings");
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

const updateRiderLocation = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

const updateRiderStatus = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

const toggleRiderAvailability = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

const getRiderEarnings = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.params.id).populate("earnings");
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export {
  getRiders,
  getRiderById,
  createRider,
  updateRider,
  deleteRider,
  getRiderRideHistory,
  getRiderRideRatings,
  getRiderEarnings,
  updateRiderLocation,
  updateRiderStatus,
  toggleRiderAvailability,
};
