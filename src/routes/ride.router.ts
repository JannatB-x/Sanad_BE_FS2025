import express from "express";
import {
  getAllRides,
  getRideById,
  createRide,
  updateRide,
  deleteRide,
} from "../controllers/ride.controller";

const router = express.Router();

router.get("/", getAllRides);
router.get("/:id", getRideById);
router.post("/", createRide);
router.put("/:id", updateRide);
router.delete("/:id", deleteRide);

export default router;
