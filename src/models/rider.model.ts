import { IDriver } from "../types/rider.type";
import mongoose from "mongoose";
import { UserType } from "../types/user.type";

const driverSchema = new mongoose.Schema<IDriver>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: {
    type: String,
    required: true,
    enum: Object.values(UserType),
    default: UserType.DRIVER,
  },
  statusDocument: { type: String, required: false },
  statusDocuments: { type: [String], required: false },
  userId: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  vehicleInfo: { type: String, required: true },
  currentLocation: { type: Object, required: true },
  isAvailable: { type: Boolean, required: true },
  rating: { type: Number, required: true },
  rideHistory: { type: [String], required: true },
  rideRatings: { type: [String], required: true },
  appointments: { type: [String], required: true },
  earnings: { type: [String], required: true },
});

export default mongoose.model<IDriver>("Driver", driverSchema);
