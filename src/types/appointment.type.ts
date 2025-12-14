// types/appointment.type.ts
import { Types } from "mongoose";

export interface IAppointment {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  rideId?: Types.ObjectId;
  title: string;
  date: Date;
  time: string;
  description?: string;
  status?: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt?: Date;
  updatedAt?: Date;
}

export enum AppointmentStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
  COMPLETED = "completed",
}
