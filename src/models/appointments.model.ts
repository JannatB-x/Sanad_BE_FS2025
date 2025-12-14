import { IAppointment } from "../types/appointment.type";
import mongoose, { Types } from "mongoose";

const appointmentSchema = new mongoose.Schema<IAppointment>({
  userId: { type: Types.ObjectId, required: true, ref: "User" },
  rideId: { type: Types.ObjectId, required: false, ref: "Ride" },
  title: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  description: { type: String, required: false },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IAppointment>("Appointment", appointmentSchema);
