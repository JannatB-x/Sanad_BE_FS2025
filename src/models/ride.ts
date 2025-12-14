import { model, Schema } from "mongoose";

const rideSchema = new Schema({
  riderId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  driverId: {
    type: Schema.Types.ObjectId,
    ref: "Driver",
  },
  status: {
    type: String,
    enum: ["requested", "accepted", "in_progress", "completed", "cancelled"],
    required: true,
  },
  pickup: {
    address: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  dropoff: {
    address: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  fare: {
    type: Number,
    required: true,
  },
  distance: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["cash", "card", "wallet"],
    required: true,
  },
  requestedAt: {
    type: Date,
    required: true,
  },
  acceptedAt: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
  cancelledAt: {
    type: Date,
  },
});

const Ride = model("Ride", rideSchema);

export default Ride;
