import express from "express";
import {
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
} from "../controllers/ride.controller";
import { authorize } from "../middlewares/authorize";

const router = express.Router();

// Public/Admin routes
router.get("/", getAllRides);
router.get("/:id", getRideById);

// Authenticated user routes
router.get("/history/all", authorize, getRideHistory);
router.get("/upcoming/index", authorize, getUpcomingRides);
router.get("/:rideId/driver/location", authorize, getDriverLocation);
router.post("/request", authorize, requestRide);
router.post("/estimate", authorize, estimateFare);
router.put("/:rideId/cancel", authorize, cancelRide);
router.put("/:rideId/dropoff", authorize, updateDropoffLocation);

// General CRUD routes
router.post("/", authorize, createRide);
router.put("/:id", authorize, updateRide);
router.delete("/:id", authorize, deleteRide);

export default router;
