import { model, Schema } from "mongoose";

const driverSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  licenseNumber: {
    type: String,
    required: true,
  },
  vehicleInfo: {
    type: Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true,
  },
  isAvailable: {
    type: Boolean,
    required: true,
  },
  currentLocation: {
    type: Schema.Types.ObjectId,
    ref: "Location",
  },
  earnings: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  bookings: [
    {
      type: Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],
});

const Driver = model("Driver", driverSchema);

export default Driver;
