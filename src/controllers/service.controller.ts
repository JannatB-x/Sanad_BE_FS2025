import type { Request, Response, NextFunction } from "express";
import Service from "../models/service";
import errorHandler from "../middlewares/errorHandler";

const getAllServices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const services = await Service.find().populate("Bookings");
    res.status(200).json({ message: "Services found successfully", services });
  } catch (error) {
    next(error);
  }
};

const getServiceById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const service = await Service.findById(req.params.id).populate("Bookings");
    res.status(200).json({ message: "Service found successfully", service });
  } catch (error) {
    next(error);
  }
};

const createService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newService = await Service.create(req.body);
    res
      .status(201)
      .json({ message: "Service created successfully", newService });
  } catch (error) {
    next(error);
  }
};

const updateService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ message: "Service updated successfully", service });
  } catch (error) {
    next(error);
  }
};

const deleteService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};

