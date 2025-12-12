import express from "express";
import {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  registerBooking,
  loginBooking,
} from "../controllers/calendar.controller";

const router = express.Router();

router.get("/", getBookings);
router.get("/:id", getBookingById);
router.post("/", createBooking);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);
router.post("/register", registerBooking);
router.post("/login", loginBooking);

export default router;
