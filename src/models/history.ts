import { model, Schema } from "mongoose";

const historySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["ride", "payment", "booking", "service", "other"],
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  relatedId: {
    type: Schema.Types.ObjectId,
  },
  metadata: {
    type: Schema.Types.Mixed,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const History = model("History", historySchema);

export default History;

