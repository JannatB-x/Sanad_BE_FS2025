import type { Request, Response, NextFunction } from "express";
import Ride from "../models/ride";
import Driver from "../models/driver";
import errorHandler from "../middlewares/errorHandler";
import { CustomRequest } from "../type/http";

const getAllRides = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rides = await Ride.find().populate("riderId").populate("driverId");
    res.status(200).json({ message: "Rides found successfully", rides });
  } catch (error) {
    next(error);
  }
};

const getRideById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ride = await Ride.findById(req.params.id)
      .populate("riderId")
      .populate("driverId");
    res.status(200).json({ message: "Ride found successfully", ride });
  } catch (error) {
    next(error);
  }
};

const createRide = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newRide = await Ride.create(req.body);
    res.status(201).json({ message: "Ride created successfully", newRide });
  } catch (error) {
    next(error);
  }
};

const updateRide = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ride = await Ride.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ message: "Ride updated successfully", ride });
  } catch (error) {
    next(error);
  }
};

const deleteRide = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Ride.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Ride deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Helper function to calculate fare, distance, and duration
const calculateFare = async (pickup: any, dropoff: any) => {
  // Simple calculation - in production, use a proper mapping service API
  const R = 6371; // Earth's radius in km
  const dLat = ((dropoff.latitude - pickup.latitude) * Math.PI) / 180;
  const dLon = ((dropoff.longitude - pickup.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((pickup.latitude * Math.PI) / 180) *
      Math.cos((dropoff.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km

  // Simple fare calculation: base fare + (distance * rate per km)
  const baseFare = 5;
  const ratePerKm = 2;
  const fare = baseFare + distance * ratePerKm;

  // Estimate duration: assume average speed of 30 km/h
  const duration = (distance / 30) * 60; // Duration in minutes

  return {
    fare: Math.round(fare * 100) / 100,
    distance: Math.round(distance * 100) / 100,
    duration: Math.round(duration),
  };
};

// Helper function to notify drivers (placeholder - implement with WebSocket/Socket.io)
const notifyDrivers = (drivers: any[], ride: any) => {
  // TODO: Implement WebSocket/Socket.io notification
  console.log(`Notifying ${drivers.length} drivers about ride ${ride._id}`);
};

// Request a ride
const requestRide = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const r = req as CustomRequest;
    const { pickup, dropoff, paymentMethod } = req.body;
    const userId = r.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Calculate fare and distance
    const { fare, distance, duration } = await calculateFare(pickup, dropoff);

    // Find nearby available drivers
    // Note: vehicleInfo and currentLocation are ObjectId references, need to populate
    const nearbyDrivers = await Driver.find({
      isAvailable: true,
    })
      .populate("vehicleInfo")
      .populate("currentLocation")
      .limit(5)
      .lean();

    // Filter by distance manually if geospatial index is not set up
    const driversWithDistance = nearbyDrivers
      .filter(
        (driver) =>
          driver.currentLocation &&
          typeof driver.currentLocation === "object" &&
          "latitude" in driver.currentLocation &&
          "longitude" in driver.currentLocation
      )
      .map((driver) => {
        const currentLocation = driver.currentLocation as any;
        const driverLat = currentLocation.latitude;
        const driverLon = currentLocation.longitude;
        const R = 6371; // Earth's radius in km
        const dLat = ((pickup.latitude - driverLat) * Math.PI) / 180;
        const dLon = ((pickup.longitude - driverLon) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((driverLat * Math.PI) / 180) *
            Math.cos((pickup.latitude * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return { driver, distance };
      })
      .filter((item) => item.distance <= 5) // 5km radius
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5)
      .map((item) => item.driver);

    if (driversWithDistance.length === 0) {
      return res.status(404).json({ message: "No drivers available nearby" });
    }

    // Create ride request
    const newRide = await Ride.create({
      riderId: userId,
      pickup,
      dropoff,
      fare,
      distance,
      duration,
      paymentMethod: paymentMethod || "cash",
      status: "requested",
      requestedAt: new Date(),
    });

    const rideDoc = Array.isArray(newRide) ? newRide[0] : newRide;

    // Notify nearby drivers (via WebSocket/Socket.io)
    notifyDrivers(driversWithDistance, rideDoc);

    res.status(201).json({
      message: "Ride requested successfully",
      ride: rideDoc,
      nearbyDrivers: driversWithDistance,
    });
  } catch (error: any) {
    next(error);
  }
};

// Get ride history
const getRideHistory = async (
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

    const rides = await Ride.find({ riderId: userId })
      .populate("driverId")
      .populate("riderId")
      .sort({ requestedAt: -1 });

    res
      .status(200)
      .json({ message: "Ride history retrieved successfully", rides });
  } catch (error) {
    next(error);
  }
};

// Estimate fare
const estimateFare = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { pickup, dropoff } = req.body;

    if (!pickup || !dropoff) {
      return res
        .status(400)
        .json({ message: "Pickup and dropoff locations are required" });
    }

    const estimate = await calculateFare(pickup, dropoff);
    res.status(200).json({ message: "Fare estimated successfully", estimate });
  } catch (error) {
    next(error);
  }
};

// Get upcoming rides (index)
const getUpcomingRides = async (
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

    const now = new Date();
    const upcomingRides = await Ride.find({
      riderId: userId,
      status: { $in: ["requested", "accepted", "in_progress"] },
      requestedAt: { $gte: now },
    })
      .populate("driverId")
      .populate("riderId")
      .sort({ requestedAt: 1 });

    // Add driver location if driver is assigned
    const ridesWithDriverLocation = await Promise.all(
      upcomingRides.map(async (ride) => {
        const rideObj: any = ride.toObject();
        if (ride.driverId) {
          const driver = await Driver.findById(ride.driverId)
            .populate("currentLocation")
            .lean();
          if (driver && driver.currentLocation) {
            rideObj.driverLocation = driver.currentLocation;
          }
        }
        return rideObj;
      })
    );

    res.status(200).json({
      message: "Upcoming rides retrieved successfully",
      rides: ridesWithDriverLocation,
    });
  } catch (error) {
    next(error);
  }
};

// Get active driver location for a ride
const getDriverLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const r = req as CustomRequest;
    const userId = r.user?.id;
    const { rideId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const ride = await Ride.findOne({
      _id: rideId,
      riderId: userId,
      status: { $in: ["accepted", "in_progress"] },
    }).populate("driverId");

    if (!ride) {
      return res.status(404).json({
        message: "Ride not found or driver not assigned yet",
      });
    }

    if (!ride.driverId) {
      return res.status(404).json({ message: "No driver assigned to this ride" });
    }

    const driver = await Driver.findById(ride.driverId)
      .populate("currentLocation")
      .lean();

    if (!driver || !driver.currentLocation) {
      return res.status(404).json({ message: "Driver location not available" });
    }

    res.status(200).json({
      message: "Driver location retrieved successfully",
      location: driver.currentLocation,
      driver: {
        id: driver._id,
        isAvailable: driver.isAvailable,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Cancel a ride
const cancelRide = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const r = req as CustomRequest;
    const userId = r.user?.id;
    const { rideId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const ride = await Ride.findOne({
      _id: rideId,
      riderId: userId,
    });

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // Only allow cancellation if ride is not completed
    if (ride.status === "completed") {
      return res
        .status(400)
        .json({ message: "Cannot cancel a completed ride" });
    }

    if (ride.status === "cancelled") {
      return res.status(400).json({ message: "Ride is already cancelled" });
    }

    // If driver is assigned, make them available again
    if (ride.driverId) {
      await Driver.findByIdAndUpdate(ride.driverId, { isAvailable: true });
    }

    ride.status = "cancelled";
    ride.cancelledAt = new Date();
    await ride.save();

    res.status(200).json({
      message: "Ride cancelled successfully",
      ride,
    });
  } catch (error) {
    next(error);
  }
};

// Edit delivery location (dropoff)
const updateDropoffLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const r = req as CustomRequest;
    const userId = r.user?.id;
    const { rideId } = req.params;
    const { dropoff } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!dropoff || !dropoff.address || !dropoff.latitude || !dropoff.longitude) {
      return res.status(400).json({
        message: "Dropoff location with address, latitude, and longitude is required",
      });
    }

    const ride = await Ride.findOne({
      _id: rideId,
      riderId: userId,
    });

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // Only allow editing dropoff if ride hasn't started
    if (ride.status === "in_progress" || ride.status === "completed") {
      return res.status(400).json({
        message: "Cannot change dropoff location after ride has started",
      });
    }

    // Recalculate fare with new dropoff location
    const { fare, distance, duration } = await calculateFare(
      ride.pickup,
      dropoff
    );

    ride.dropoff = dropoff;
    ride.fare = fare;
    ride.distance = distance;
    ride.duration = duration;
    await ride.save();

    res.status(200).json({
      message: "Dropoff location updated successfully",
      ride,
      updatedFare: fare,
    });
  } catch (error) {
    next(error);
  }
};

export {
  getAllRides,
  getRideById,
  createRide,
  updateRide,
  deleteRide,
  requestRide,
  getRideHistory,
  estimateFare,
  getUpcomingRides,
  getDriverLocation,
  cancelRide,
  updateDropoffLocation,
};
