import mongoose from "mongoose";
import { config } from "./environment";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log("✅ MongoDB connected successfully");

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB disconnected");
    });
  } catch (error) {
    console.error("❌ Could not connect to MongoDB:", error);
    process.exit(1); // Exit if DB fails
  }
};

export default connectDB;
