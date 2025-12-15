// controllers/vehicle.controller.ts
import { Response, NextFunction } from "express";
import Vehicle from "../models/vehicle.model";
import Company from "../models/company.model";
import { CustomRequest } from "../types/http.types";
import { AppError } from "../middleware/errorHandler";
import { VehicleFilterOptions } from "../types/vehicle.type";

export const createVehicle = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      companyId,
      model,
      year,
      plateNumber,
      color,
      capacity,
      vehicleType,
      accessibilityFeatures,
      hasPatientBed,
      hasOxygenSupport,
      hasMedicalEquipment,
      medicalEquipmentList,
      isWheelchairAccessible,
      wheelchairType,
      hasWheelchairRamp,
      hasWheelchairLift,
    } = req.body;

    // Check if company exists
    const company = await Company.findById(companyId);
    if (!company) {
      throw new AppError("Company not found", 404);
    }

    // Check if plate number already exists
    const existingVehicle = await Vehicle.findOne({ plateNumber });
    if (existingVehicle) {
      throw new AppError("Vehicle with this plate number already exists", 400);
    }

    const vehicle = await Vehicle.create({
      companyId,
      model,
      year,
      plateNumber,
      color,
      capacity,
      vehicleType,
      accessibilityFeatures,
      hasPatientBed,
      hasOxygenSupport,
      hasMedicalEquipment,
      medicalEquipmentList,
      isWheelchairAccessible,
      wheelchairType,
      hasWheelchairRamp,
      hasWheelchairLift,
    });

    // Add vehicle to company's vehicles array
    company.vehicles.push(vehicle._id.toString());
    await company.save();

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: vehicle,
    });
  } catch (error) {
    next(error);
  }
};

export const getVehicles = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const vehicles = await Vehicle.find()
      .populate("companyId", "name phone")
      .populate("riderId", "name");

    res.status(200).json({
      success: true,
      data: vehicles,
    });
  } catch (error) {
    next(error);
  }
};

export const getVehicleById = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const vehicle = await Vehicle.findById(id)
      .populate("companyId", "name phone address")
      .populate("riderId", "name profileImage rating");

    if (!vehicle) {
      throw new AppError("Vehicle not found", 404);
    }

    res.status(200).json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    next(error);
  }
};

export const updateVehicle = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Don't allow changing companyId or plateNumber
    delete updateData.companyId;
    delete updateData.plateNumber;

    const vehicle = await Vehicle.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!vehicle) {
      throw new AppError("Vehicle not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: vehicle,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteVehicle = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const vehicle = await Vehicle.findByIdAndDelete(id);

    if (!vehicle) {
      throw new AppError("Vehicle not found", 404);
    }

    // Remove vehicle from company's vehicles array
    await Company.findByIdAndUpdate(vehicle.companyId, {
      $pull: { vehicles: id },
    });

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const searchVehicles = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const filters: VehicleFilterOptions = req.body;
    const query: any = { isActive: true, isAvailable: true };

    // Filter by wheelchair accessibility
    if (filters.needsWheelchair) {
      query.isWheelchairAccessible = true;
    }

    // Filter by wheelchair type
    if (filters.wheelchairType) {
      query.wheelchairType = filters.wheelchairType;
    }

    // Filter by patient bed
    if (filters.needsPatientBed) {
      query.hasPatientBed = true;
    }

    // Filter by medical equipment
    if (filters.needsMedicalEquipment) {
      query.hasMedicalEquipment = true;
    }

    // Filter by capacity
    if (filters.minCapacity) {
      query.capacity = { $gte: filters.minCapacity };
    }

    const vehicles = await Vehicle.find(query)
      .populate("companyId", "name phone address")
      .populate("riderId", "name profileImage rating");

    res.status(200).json({
      success: true,
      data: vehicles,
    });
  } catch (error) {
    next(error);
  }
};

export const getCompanyVehicles = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { companyId } = req.params;

    const vehicles = await Vehicle.find({ companyId }).populate(
      "riderId",
      "name profileImage rating"
    );

    res.status(200).json({
      success: true,
      data: vehicles,
    });
  } catch (error) {
    next(error);
  }
};

export const assignRiderToVehicle = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { riderId } = req.body;

    const vehicle = await Vehicle.findByIdAndUpdate(
      id,
      { riderId },
      { new: true }
    ).populate("riderId", "name profileImage");

    if (!vehicle) {
      throw new AppError("Vehicle not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Rider assigned to vehicle successfully",
      data: vehicle,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleVehicleAvailability = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      throw new AppError("Vehicle not found", 404);
    }

    vehicle.isAvailable = !vehicle.isAvailable;
    await vehicle.save();

    res.status(200).json({
      success: true,
      message: `Vehicle is now ${
        vehicle.isAvailable ? "available" : "unavailable"
      }`,
      data: vehicle,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadVehicleDocuments = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      throw new AppError("No file provided", 400);
    }

    const { documentType } = req.body; // "licensePlate", "registration", "insurance", etc.

    const updateData: any = {};
    updateData[documentType] = req.file.path;

    const vehicle = await Vehicle.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!vehicle) {
      throw new AppError("Vehicle not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Document uploaded successfully",
      data: vehicle,
    });
  } catch (error) {
    next(error);
  }
};
