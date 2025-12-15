import { Router } from "express";
import {
  getRides,
  createRide,
  updateRide,
  editRide,
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
} from "../controllers/ride.controller";

const router = Router();

router.get("/", getRides);
router.post("/", createRide);
router.put("/:id", updateRide);
router.patch("/:id", editRide);
router.put("/:id/status", updateRideStatus);
router.put("/:id/cancel", cancelRide);
router.put("/:id/rate", rateRide);
router.get("/:id/nearest-driver", getNearestDriver);
router.put("/:id/complete", completeRide);
router.get("/:id/calculate-price", calculatePrice);
router.get("/:id/payment-type", paymentType);
router.get("/:id/payment-status", paymentStatus);
router.get("/:id/payment-method", paymentMethod);
router.get("/:id/payment-amount", paymentAmount);
router.get("/:id/payment-date", paymentDate);
router.get("/:id/payment-time", paymentTime);

export default router;
