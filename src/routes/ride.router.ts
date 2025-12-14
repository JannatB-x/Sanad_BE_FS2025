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

// Specific routes (must be before /:id to avoid conflicts)
router.get("/history/all", authorize, getRideHistory);
router.get("/upcoming/index", authorize, getUpcomingRides);
router.get("/:rideId/driver/location", authorize, getDriverLocation);
router.post("/request", authorize, requestRide);
router.post("/estimate", authorize, estimateFare);
router.put("/:rideId/cancel", authorize, cancelRide);
router.put("/:rideId/dropoff", authorize, updateDropoffLocation);

// General CRUD routes (protected)
router.get("/", authorize, getAllRides);
router.get("/:id", authorize, getRideById);
router.post("/", authorize, createRide);
router.put("/:id", authorize, updateRide);
router.delete("/:id", authorize, deleteRide);

export default router;
