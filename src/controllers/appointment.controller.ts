import type { Request, Response, NextFunction } from "express";
import Appointment from "../models/appointments.model";
import { AppError } from "../middleware/errorHandler";
import { CustomRequest } from "../types/http.types";

const getAppointments = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointments = await Appointment.find({ userId: req.params.id });
    res.status(200).json({ appointments });
  } catch (error) {
    next(error);
  }
};

const createAppointment = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointment = await Appointment.create(req.body);
    res.status(201).json({ appointment });
  } catch (error) {
    next(error);
  }
};

const updateAppointment = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ appointment });
  } catch (error) {
    next(error);
  }
};

const deleteAppointment = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    res.status(200).json({ appointment });
  } catch (error) {
    next(error);
  }
};

export {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
};
