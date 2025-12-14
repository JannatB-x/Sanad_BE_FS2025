import { IRide, RideStatus } from "../types/ride.type";
import { PaymentStatus, PaymentMethod } from "../types/payment.type";
import { ILocation } from "../types/ride.type";
import mongoose from "mongoose";

const rideSchema = new mongoose.Schema<IRide>({
  userId: { type: String, required: true },
  driverId: { type: String, required: true },
  pickupLocation: { type: Object, required: true },
  dropoffLocation: { type: Object, required: true },
  status: {
    type: String,
    required: true,
    enum: Object.values(RideStatus),
    default: RideStatus.REQUESTED,
  },
  price: { type: Number, required: true },
  paymentAmount: { type: Number, required: true },
  paymentStatus: {
    type: String,
    required: true,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING,
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: Object.values(PaymentMethod),
    default: PaymentMethod.CASH,
  },
  paymentDate: { type: Date, required: true },
  paymentTime: { type: String, required: true },
});

export default mongoose.model<IRide>("Ride", rideSchema);
