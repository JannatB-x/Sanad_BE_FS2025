import type { Request, Response, NextFunction } from "express";
import Calendar from "../models/calendar";
import errorHandler from "../middlewares/errorHandler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
import { CustomRequest } from "../type/http";

const getBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const r = req as CustomRequest;
    const userId = r.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Not Authorized" });
    }

    // Users can see their own bookings, admins can see all
    // For now, allow all authenticated users to see all bookings
    // TODO: Filter by userId for regular users if needed
    const Bookings = await Calendar.find().populate("Bookings");
    res
      .status(200)
      .json({ message: "Bookings retrieved successfully", bookings: Bookings });
  } catch (error) {
    next(error);
  }
};

const getBookingById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const r = req as CustomRequest;
    const userId = r.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Not Authorized" });
    }

    const booking = await Calendar.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res
      .status(200)
      .json({ message: "Booking retrieved successfully", booking });
  } catch (error) {
    next(error);
  }
};

const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const r = req as CustomRequest;
    const userId = r.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Not Authorized" });
    }

    // Allow users with role "user" or "admin" to create bookings
    // Associate the booking with the user
    const bookingData = {
      ...req.body,
      userId: userId, // Associate booking with the authenticated user
    };

    const newBooking = await Calendar.create(bookingData);
    const bookingDoc = Array.isArray(newBooking) ? newBooking[0] : newBooking;

    res.status(201).json({
      message: "Booking created successfully",
      booking: bookingDoc,
    });
  } catch (error) {
    next(error);
  }
};

const updateBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const r = req as CustomRequest;
    const userId = r.user?.id;
    const userRole = r.user?.role;

    if (!userId) {
      return res.status(401).json({ message: "Not Authorized" });
    }

    const booking = await Calendar.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Users can only update their own bookings, admins can update any
    // Check if booking has userId field and match it, or allow admin role
    const bookingUserId = (booking as any).userId?.toString();
    if (userRole !== "admin" && bookingUserId && bookingUserId !== userId) {
      return res.status(403).json({
        message: "Forbidden: You can only update your own bookings",
      });
    }

    const updatedBooking = await Calendar.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      message: "Booking updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const r = req as CustomRequest;
    const userId = r.user?.id;
    const userRole = r.user?.role;

    if (!userId) {
      return res.status(401).json({ message: "Not Authorized" });
    }

    const booking = await Calendar.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Users can only delete their own bookings, admins can delete any
    // Check if booking has userId field and match it, or allow admin role
    const bookingUserId = (booking as any).userId?.toString();
    if (userRole !== "admin" && bookingUserId && bookingUserId !== userId) {
      return res.status(403).json({
        message: "Forbidden: You can only delete your own bookings",
      });
    }

    await Calendar.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const registerBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, password } = req.body;
    const findBooking = await Calendar.findOne({ Title: name });
    console.log(findBooking);
    if (findBooking) {
      return res.status(400).json({ message: "Booking already exists" });
    } else {
      const newBooking = await Calendar.create(req.body);
      const bookingDoc = Array.isArray(newBooking) ? newBooking[0] : newBooking;

      const token = jwt.sign(
        { id: bookingDoc._id.toString(), role: "booking" },
        JWT_SECRET as string,
        { expiresIn: "1h" }
      );

      res.status(201).json({ booking: bookingDoc, token });
    }
  } catch (error) {
    next(error);
  }
};

const loginBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, password } = req.body;

    const findBooking = await Calendar.findOne({ Title: name });
    if (findBooking) {
      const token = jwt.sign(
        { id: findBooking._id.toString(), role: "booking" },
        JWT_SECRET as string,
        { expiresIn: "1h" }
      );
      res.status(200).json({ token });
    } else {
      return res.status(400).json({ message: "Booking not found" });
    }
  } catch (error) {
    next(error);
  }
};

export {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  registerBooking,
  loginBooking,
};
