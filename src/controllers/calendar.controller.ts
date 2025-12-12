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
    console.log(r.user);
    if (r.user?.role != "author") {
      res.status(401).json("Not Authorized");
    }
    const Bookings = await Calendar.find().populate("Bookings");
    res.status(200).json(Bookings);
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
    const booking = await Calendar.findById(req.params.id);
    res.status(200).json(booking);
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
    console.log(r.user);
    if (r.user?.role != "booking") {
      res.status(401).json("Not Authorized");
    }
    console.log("first");
    const newBooking = await Calendar.create(req.body);
    res.status(201).json(newBooking);
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
    console.log(r.user);
    if (r.user?.role != "booking") {
      res.status(401).json("Not Authorized");
    }
    const booking = await Calendar.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(booking);
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
    console.log(r.user);
    if (r.user?.role != "booking") {
      res.status(401).json("Not Authorized");
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
