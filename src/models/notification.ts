import { model, Schema } from "mongoose";

const notificationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["ride", "payment", "booking", "system", "other"],
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  relatedId: {
    type: Schema.Types.ObjectId,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = model("Notification", notificationSchema);

export default Notification;

