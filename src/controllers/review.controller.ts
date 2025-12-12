import type { Request, Response, NextFunction } from "express";
import Review from "../models/review";
import { CustomRequest } from "../type/http";

const getAllReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reviews = await Review.find()
      .populate("userId")
      .populate("driverId")
      .populate("rideId")
      .sort({ createdAt: -1 });
    res.status(200).json({ message: "Reviews found successfully", reviews });
  } catch (error) {
    next(error);
  }
};

const getReviewById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("userId")
      .populate("driverId")
      .populate("rideId");
    res.status(200).json({ message: "Review found successfully", review });
  } catch (error) {
    next(error);
  }
};

const createReview = async (
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

    const newReview = await Review.create({
      ...req.body,
      userId,
    });
    res.status(201).json({ message: "Review created successfully", newReview });
  } catch (error) {
    next(error);
  }
};

const updateReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ message: "Review updated successfully", review });
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const getReviewsByRide = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reviews = await Review.find({ rideId: req.params.rideId })
      .populate("userId")
      .populate("driverId")
      .sort({ createdAt: -1 });
    res.status(200).json({ message: "Reviews found successfully", reviews });
  } catch (error) {
    next(error);
  }
};

const getReviewsByDriver = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reviews = await Review.find({ driverId: req.params.driverId })
      .populate("userId")
      .populate("rideId")
      .sort({ createdAt: -1 });
    res.status(200).json({ message: "Reviews found successfully", reviews });
  } catch (error) {
    next(error);
  }
};

export {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getReviewsByRide,
  getReviewsByDriver,
};

