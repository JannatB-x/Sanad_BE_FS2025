import express from "express";
import { authorize } from "../middlewares/authorize";
import { driverMiddleware } from "../middlewares/driverMiddleware";
import * as driverController from "../controllers/driver.controller";

const router = express.Router();

// Driver registration
router.post("/register", authorize, driverController.registerDriver);

// Driver actions
router.post(
  "/available",
  authorize,
  driverMiddleware,
  driverController.toggleAvailability
);
router.post(
  "/location",
  authorize,
  driverMiddleware,
  driverController.updateLocation
);
router.get(
  "/nearby-rides",
  authorize,
  driverMiddleware,
  driverController.getNearbyRides
);
router.put(
  "/ride/:rideId/accept",
  authorize,
  driverMiddleware,
  driverController.acceptRide
);
router.put(
  "/ride/:rideId/start",
  authorize,
  driverMiddleware,
  driverController.startRide
);
router.put(
  "/ride/:rideId/complete",
  authorize,
  driverMiddleware,
  driverController.completeRide
);

// Earnings
router.get(
  "/earnings",
  authorize,
  driverMiddleware,
  driverController.getEarnings
);

export default router;
