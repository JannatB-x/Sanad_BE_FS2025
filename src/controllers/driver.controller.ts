import type { Request, Response, NextFunction } from "express";
import Driver from "../models/driver";
import Ride from "../models/ride";
import { CustomRequest } from "../type/http";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

// Helper functions (placeholders - implement with WebSocket/Socket.io)
const notifyRider = (riderId: any, data: any) => {
  // TODO: Implement WebSocket/Socket.io notification
  console.log(`Notifying rider ${riderId}`, data);
};

const broadcastLocationToRider = (riderId: any, location: any) => {
  // TODO: Implement WebSocket/Socket.io location broadcast
  console.log(`Broadcasting location to rider ${riderId}`, location);
};

const processPayment = async (ride: any) => {
  // TODO: Implement payment processing
  console.log(`Processing payment for ride ${ride._id}`);
};

// Accept ride
const acceptRide = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const r = req as CustomRequest;
    const { rideId } = req.params;
    const driverId = r.user?.id;

    if (!driverId) {
      return res.status(401).json({ message: "Driver not authenticated" });
    }

    const ride = await Ride.findById(rideId);

    if (!ride || ride.status !== "requested") {
      return res.status(400).json({ message: "Ride not available" });
    }

    ride.driverId = driverId as any;
    ride.status = "accepted";
    ride.acceptedAt = new Date();
    await ride.save();

    // Update driver availability
    await Driver.findByIdAndUpdate(driverId, { isAvailable: false });

    // Notify rider (via WebSocket)
    notifyRider(ride.riderId, { ride, driver: r.user });

    res.status(200).json({ message: "Ride accepted successfully", ride });
  } catch (error: any) {
    next(error);
  }
};

// Update location (called frequently)
const updateLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const r = req as CustomRequest;
    const { latitude, longitude } = req.body;
    const driverId = r.user?.id;

    if (!driverId) {
      return res.status(401).json({ message: "Driver not authenticated" });
    }

    await Driver.findByIdAndUpdate(driverId, {
      currentLocation: { latitude, longitude },
    });

    // Broadcast location to rider if on active ride
    const activeRide = await Ride.findOne({
      driverId,
      status: { $in: ["accepted", "in_progress"] },
    });

    if (activeRide) {
      broadcastLocationToRider(activeRide.riderId, { latitude, longitude });
    }

    res
      .status(200)
      .json({ message: "Location updated successfully", success: true });
  } catch (error: any) {
    next(error);
  }
};

// Complete ride
const completeRide = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const r = req as CustomRequest;
    const { rideId } = req.params;
    const driverId = r.user?.id;

    if (!driverId) {
      return res.status(401).json({ message: "Driver not authenticated" });
    }

    const ride = await Ride.findOne({ _id: rideId, driverId });

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    ride.status = "completed";
    ride.completedAt = new Date();
    await ride.save();

    // Update driver stats
    await Driver.findByIdAndUpdate(driverId, {
      isAvailable: true,
      $inc: { earnings: ride.fare },
    });

    // Process payment
    await processPayment(ride);

    res.status(200).json({ message: "Ride completed successfully", ride });
  } catch (error: any) {
    next(error);
  }
};

// Register driver
const registerDriver = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      userId,
      licenseNumber,
      vehicleInfo,
      isAvailable,
      earnings,
      rating,
    } = req.body;

    const findDriver = await Driver.findOne({ userId });
    if (findDriver) {
      return res.status(400).json({ message: "Driver already exists" });
    }

    const newDriver = await Driver.create({
      userId,
      licenseNumber,
      vehicleInfo,
      isAvailable: isAvailable || false,
      earnings: earnings || 0,
      rating: rating || 0,
    });

    const driverDoc = Array.isArray(newDriver) ? newDriver[0] : newDriver;

    const token = jwt.sign(
      { id: driverDoc._id.toString(), role: "driver" },
      JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Driver registered successfully",
      driver: driverDoc,
      token,
    });
  } catch (error: any) {
    next(error);
  }
};

// Toggle availability
const toggleAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const r = req as CustomRequest;
    const driverId = r.user?.id;

    if (!driverId) {
      return res.status(401).json({ message: "Driver not authenticated" });
    }

    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    driver.isAvailable = !driver.isAvailable;
    await driver.save();

    res.status(200).json({
      message: "Availability updated successfully",
      isAvailable: driver.isAvailable,
    });
  } catch (error: any) {
    next(error);
  }
};

// Get nearby rides
const getNearbyRides = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const r = req as CustomRequest;
    const driverId = r.user?.id;

    if (!driverId) {
      return res.status(401).json({ message: "Driver not authenticated" });
    }

    // Get rides that are requested and not yet accepted
    const nearbyRides = await Ride.find({
      status: "requested",
      driverId: { $exists: false },
    })
      .populate("riderId")
      .sort({ requestedAt: -1 })
      .limit(10);

    res.status(200).json({
      message: "Nearby rides retrieved successfully",
      rides: nearbyRides,
    });
  } catch (error: any) {
    next(error);
  }
};

// Start ride
const startRide = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const r = req as CustomRequest;
    const { rideId } = req.params;
    const driverId = r.user?.id;

    if (!driverId) {
      return res.status(401).json({ message: "Driver not authenticated" });
    }

    const ride = await Ride.findOne({ _id: rideId, driverId });

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    if (ride.status !== "accepted") {
      return res.status(400).json({ message: "Ride must be accepted first" });
    }

    ride.status = "in_progress";
    await ride.save();

    res.status(200).json({ message: "Ride started successfully", ride });
  } catch (error: any) {
    next(error);
  }
};

// Get earnings
const getEarnings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const r = req as CustomRequest;
    const driverId = r.user?.id;

    if (!driverId) {
      return res.status(401).json({ message: "Driver not authenticated" });
    }

    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    // Get completed rides for this driver
    const completedRides = await Ride.find({
      driverId,
      status: "completed",
    });

    const totalEarnings = completedRides.reduce(
      (sum, ride) => sum + ride.fare,
      0
    );

    res.status(200).json({
      message: "Earnings retrieved successfully",
      earnings: driver.earnings,
      totalEarnings,
      completedRides: completedRides.length,
    });
  } catch (error: any) {
    next(error);
  }
};

export {
  acceptRide,
  updateLocation,
  completeRide,
  registerDriver,
  toggleAvailability,
  getNearbyRides,
  startRide,
  getEarnings,
};
