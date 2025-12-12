import { model, Schema } from "mongoose";

const paymentSchema = new Schema({
  riderId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  driverId: {
    type: Schema.Types.ObjectId,
    ref: "Driver",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["cash", "card", "wallet"],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    required: true,
  },
  paymentDate: {
    type: Date,
    required: true,
  },
  paymentRef: {
    type: String,
    required: true,
  },
  paymentType: {
    type: String,
    enum: ["ride", "booking", "other"],
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
  transactionDate: {
    type: Date,
    required: true,
  },
  transactionAmount: {
    type: Number,
    required: true,
  },
});

const Payment = model("Payment", paymentSchema);

export default Payment;
