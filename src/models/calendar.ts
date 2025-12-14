import { model, Schema } from "mongoose";

const calendarSchema = new Schema({
  Title: {
    type: String,
    required: true,
  },
  Location: {
    type: String,
    required: true,
  },
  Date: {
    type: Date,
    required: true,
  },
  Time: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false, // Optional for backward compatibility
  },
  ItemsRequired: [
    {
      type: Schema.Types.ObjectId,
      ref: "Paperwork",
    },
  ],
  Bookings: [
    {
      type: Schema.Types.ObjectId,
      ref: "Bookings",
    },
  ],
});

const Calendar = model("Calendar", calendarSchema);

export default Calendar;
