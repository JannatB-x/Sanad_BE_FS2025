// types/vehicle.type.ts
import { Types } from "mongoose";

export interface IVehicle {
  _id?: Types.ObjectId;
  companyId: Types.ObjectId;
  riderId?: Types.ObjectId; // assigned rider

  // Basic vehicle info
  model: string;
  year: number;
  plateNumber: string;
  color: string;
  capacity: number; // passenger capacity

  // Accessibility features
  vehicleType: VehicleAccessibilityType;
  accessibilityFeatures: AccessibilityFeature[];

  // Medical equipment
  hasPatientBed: boolean;
  hasOxygenSupport: boolean;
  hasMedicalEquipment: boolean;
  medicalEquipmentList?: string[]; // ["oxygen tank", "first aid kit", "defibrillator"]

  // Wheelchair specifications
  isWheelchairAccessible: boolean;
  wheelchairType?: WheelchairType[]; // can accommodate multiple types
  hasWheelchairRamp: boolean;
  hasWheelchairLift: boolean;

  // Documents
  licensePlateImage?: string;
  registrationDocument?: string;
  insuranceDocument?: string;
  insuranceExpiryDate?: Date;
  accessibilityCertificate?: string;
  medicalTransportLicense?: string;

  // Status
  isActive: boolean;
  isAvailable: boolean;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export enum VehicleAccessibilityType {
  STANDARD = "standard", // Regular car
  WHEELCHAIR_ACCESSIBLE = "wheelchair_accessible", // Wheelchair ramp/lift
  PATIENT_BED = "patient_bed", // Stretcher/bed for lying down patients
  AMBULANCE = "ambulance", // Full medical ambulance
  MEDICAL_TRANSPORT = "medical_transport", // Medical transport van
}

export enum WheelchairType {
  MANUAL = "manual", // Manual wheelchair
  ELECTRIC = "electric", // Electric wheelchair
  MOBILITY_SCOOTER = "mobility_scooter", // Mobility scooter
  BARIATRIC = "bariatric", // Heavy-duty wheelchair
}

export enum AccessibilityFeature {
  // Wheelchair features
  WHEELCHAIR_RAMP = "wheelchair_ramp",
  WHEELCHAIR_LIFT = "wheelchair_lift",
  WHEELCHAIR_SECUREMENT = "wheelchair_securement",

  // Medical features
  PATIENT_BED = "patient_bed",
  STRETCHER = "stretcher",
  OXYGEN_SUPPORT = "oxygen_support",
  MEDICAL_MONITORING = "medical_monitoring",

  // Comfort features
  LOWERED_FLOOR = "lowered_floor",
  WIDE_DOORS = "wide_doors",
  HAND_CONTROLS = "hand_controls",
  ADJUSTABLE_SEATS = "adjustable_seats",

  // Safety features
  EMERGENCY_EQUIPMENT = "emergency_equipment",
  FIRST_AID_KIT = "first_aid_kit",
  FIRE_EXTINGUISHER = "fire_extinguisher",

  // Communication
  HEARING_LOOP = "hearing_loop",
  VISUAL_ALERTS = "visual_alerts",
}

export interface VehicleFilterOptions {
  needsWheelchair?: boolean;
  needsPatientBed?: boolean;
  wheelchairType?: WheelchairType;
  needsMedicalEquipment?: boolean;
  minCapacity?: number;
}
