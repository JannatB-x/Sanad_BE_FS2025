import express from "express";
import {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
} from "../controllers/calendar.controller";
import { authorize } from "../middlewares/authorize";

const router = express.Router();

// Debug: Log when router is loaded
console.log("📅 Calendar router loaded");

// Health check route (no auth required for testing)
router.get("/health", (req: express.Request, res: express.Response) => {
  res.json({
    message: "Calendar route is accessible",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// All calendar/booking routes require authentication
// Note: Controllers have additional role checks, but middleware ensures user is authenticated
router.get("/", authorize, getBookings);
router.get("/:id", authorize, getBookingById);
router.post("/", authorize, createBooking);
router.put("/:id", authorize, updateBooking);
router.delete("/:id", authorize, deleteBooking);

// Removed incorrect /register and /login routes - these don't belong in calendar router
// Calendar bookings should not have their own authentication system

export default router;
