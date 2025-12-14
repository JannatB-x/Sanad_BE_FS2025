import express from "express";
import { authorize } from "../middlewares/authorize";
import { driverMiddleware } from "../middlewares/driverMiddleware";
import { upload } from "../config/multer";
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

// File upload routes
router.post(
  "/license",
  authorize,
  driverMiddleware,
  upload.single("license"),
  driverController.uploadLicense
);
router.post(
  "/documents",
  authorize,
  driverMiddleware,
  upload.array("documents", 10),
  driverController.uploadDocuments
);
router.delete(
  "/license",
  authorize,
  driverMiddleware,
  driverController.deleteLicense
);
router.delete(
  "/documents/:documentPath",
  authorize,
  driverMiddleware,
  driverController.deleteDocument
);

export default router;
