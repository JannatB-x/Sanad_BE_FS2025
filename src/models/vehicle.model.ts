// models/vehicle.model.ts
import mongoose, { Schema, Model } from "mongoose";
import {
  IVehicle,
  VehicleAccessibilityType,
  WheelchairType,
  AccessibilityFeature,
} from "../types/vehicle.type";

const vehicleSchema = new Schema<IVehicle>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    riderId: {
      type: Schema.Types.ObjectId,
      ref: "Rider",
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
    },
    plateNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    vehicleType: {
      type: String,
      enum: Object.values(VehicleAccessibilityType),
      required: true,
    },
    accessibilityFeatures: [
      {
        type: String,
        enum: Object.values(AccessibilityFeature),
      },
    ],
    hasPatientBed: {
      type: Boolean,
      default: false,
    },
    hasOxygenSupport: {
      type: Boolean,
      default: false,
    },
    hasMedicalEquipment: {
      type: Boolean,
      default: false,
    },
    medicalEquipmentList: [String],
    isWheelchairAccessible: {
      type: Boolean,
      default: false,
    },
    wheelchairType: [
      {
        type: String,
        enum: Object.values(WheelchairType),
      },
    ],
    hasWheelchairRamp: {
      type: Boolean,
      default: false,
    },
    hasWheelchairLift: {
      type: Boolean,
      default: false,
    },
    licensePlateImage: String,
    registrationDocument: String,
    insuranceDocument: String,
    insuranceExpiryDate: Date,
    accessibilityCertificate: String,
    medicalTransportLicense: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    lastMaintenanceDate: Date,
    nextMaintenanceDate: Date,
  },
  {
    timestamps: true,
  }
);

const Vehicle: Model<IVehicle> = mongoose.model<IVehicle>(
  "Vehicle",
  vehicleSchema
);

export default Vehicle;
