import { Router } from "express";
import {
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
} from "../controllers/rider.controller";

const router = Router();

router.get("/", getRiders);
router.get("/:id", getRiderById);
router.post("/", createRider);
router.put("/:id", updateRider);
router.delete("/:id", deleteRider);
router.get("/:id/ride-history", getRiderRideHistory);
router.get("/:id/ride-ratings", getRiderRideRatings);
router.get("/:id/earnings", getRiderEarnings);
router.get("/:id/location", updateRiderLocation);
router.get("/:id/status", updateRiderStatus);
router.get("/:id/availability", toggleRiderAvailability);

export default router;
