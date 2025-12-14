import { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserRideHistory,
  getUserRideRatings,
  getUserAppointments,
  updateUserLocation,
  getUserLocation,
} from "../controllers/user.controller";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.get("/:id/ride-history", getUserRideHistory);
router.get("/:id/ride-ratings", getUserRideRatings);
router.get("/:id/appointments", getUserAppointments);
router.put("/:id/location", updateUserLocation);
router.get("/:id/location", getUserLocation);

export default router;
