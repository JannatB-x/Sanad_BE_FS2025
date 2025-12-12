import { model, Schema } from "mongoose";

const serviceSchema = new Schema({
  Title: {
    type: String,
    required: true,
  },
  Logo: {
    type: String,
    required: true,
  },
  Location: {
    type: String,
    required: true,
  },
  Bookings: [
    {
      type: Schema.Types.ObjectId,
      ref: "Bookings",
    },
  ],
});

const Service = model("Service", serviceSchema);

export default Service;
