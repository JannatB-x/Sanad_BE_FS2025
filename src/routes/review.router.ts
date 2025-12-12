import express from "express";
import {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getReviewsByRide,
  getReviewsByDriver,
} from "../controllers/review.controller";
import { authorize } from "../middlewares/authorize";

const router = express.Router();

router.get("/", getAllReviews);
router.get("/ride/:rideId", getReviewsByRide);
router.get("/driver/:driverId", getReviewsByDriver);
router.get("/:id", getReviewById);
router.post("/", authorize, createReview);
router.put("/:id", authorize, updateReview);
router.delete("/:id", authorize, deleteReview);

export default router;

