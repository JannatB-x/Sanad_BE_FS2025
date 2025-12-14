import type { Request, Response, NextFunction } from "express";
import Ride from "../models/ride.model";
import { AppError } from "../middleware/errorHandler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
import { CustomRequest } from "../types/http.types";
import Rider from "../models/rider.model";

const getRides = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const rides = await Ride.find({ CompanyId: req.params.id });
    res.status(200).json({ rides });
  } catch (error) {
    next(error);
  }
};
const createRide = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const ride = await Ride.create(req.body);
    res.status(201).json({ ride });
  } catch (error) {
    next(error);
  }
};

const updateRide = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const ride = await Ride.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ ride });
  } catch (error) {
    next(error);
  }
};

const updateRideStatus = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const ride = await Ride.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ ride });
  } catch (error) {
    next(error);
  }
};

const cancelRide = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const ride = await Ride.findByIdAndUpdate(
      req.params.id,
      { Status: "Cancelled" },
      { new: true }
    );
    res.status(200).json({ ride });
  } catch (error) {
    next(error);
  }
};

const rateRide = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const ride = await Ride.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ ride });
  } catch (error) {
    next(error);
  }
};

const getNearestDriver = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const driver = await Rider.findOne({
      status: "Available",
      userType: "driver",
    });
    res.status(200).json({ driver });
  } catch (error) {
    next(error);
  }
};

const completeRide = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const ride = await Ride.findByIdAndUpdate(
      req.params.id,
      { Status: "Completed" },
      { new: true }
    );
    res.status(200).json({ ride });
  } catch (error) {
    next(error);
  }
};

const calculatePrice = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { pickupLocation, dropoffLocation } = req.body;

    // Calculate distance in kilometers (you'll need a distance calculation function)
    const distance = calculateDistance(
      pickupLocation.lat,
      pickupLocation.lng,
      dropoffLocation.lat,
      dropoffLocation.lng
    );

    const baseFare = 2; // Base fare in your currency
    const pricePerKilometer = 1.5; // Price per km

    const price = baseFare + distance * pricePerKilometer;

    res.status(200).json({
      price: price.toFixed(2),
      distance: distance.toFixed(2),
      breakdown: {
        baseFare,
        distanceFare: (distance * pricePerKilometer).toFixed(2),
        total: price.toFixed(2),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

const paymentType = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const ride = await Ride.findById(req.params.id);
    const paymentType = ride?.paymentMethod;
    res.status(200).json({ paymentType });
  } catch (error) {
    next(error);
  }
};

const paymentStatus = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const ride = await Ride.findById(req.params.id);
    const paymentStatus = ride?.paymentStatus;
    res.status(200).json({ paymentStatus });
  } catch (error) {
    next(error);
  }
};

const paymentMethod = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const ride = await Ride.findById(req.params.id);
    const paymentMethod = ride?.paymentMethod;
    res.status(200).json({ paymentMethod });
  } catch (error) {
    next(error);
  }
};

const paymentAmount = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const ride = await Ride.findById(req.params.id);
    const paymentAmount = ride?.paymentAmount;
    res.status(200).json({ paymentAmount });
  } catch (error) {
    next(error);
  }
};

const paymentDate = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const ride = await Ride.findById(req.params.id);
    const paymentDate = ride?.paymentDate;
    res.status(200).json({ paymentDate });
  } catch (error) {
    next(error);
  }
};

const paymentTime = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const ride = await Ride.findById(req.params.id);
    const paymentTime = ride?.paymentTime;
    res.status(200).json({ paymentTime });
  } catch (error) {
    next(error);
  }
};

export {
  getRides,
  createRide,
  updateRide,
  updateRideStatus,
  cancelRide,
  rateRide,
  getNearestDriver,
  completeRide,
  calculatePrice,
  paymentType,
  paymentStatus,
  paymentMethod,
  paymentAmount,
  paymentDate,
  paymentTime,
};
