import dotenv from "dotenv";
dotenv.config();

import express, { Application, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import rateLimit from "express-rate-limit";

// Import routes
import authRoutes from "./routers/auth.routes";
import userRoutes from "./routers/user.routes";
import riderRoutes from "./routers/rider.routes";
import rideRoutes from "./routers/ride.routes";
import appointmentRoutes from "./routers/appointment.routes";
import companyRoutes from "./routers/company.routes";

// Import middleware
import { errorHandler, notFound } from "./middleware/errorHandler";

// Initialize express app
const app: Application = express();

// ============================================
// MIDDLEWARE CONFIGURATION
// ============================================

// Security Headers
app.use(helmet());

// CORS Configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body Parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// HTTP Request Logger (only in development)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || "15") * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"), // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", limiter);

// Static Files (for uploaded images, documents)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ============================================
// DATABASE CONNECTION
// ============================================

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/sanad-app";

    await mongoose.connect(mongoURI);

    console.log("✅ MongoDB Connected Successfully");
    console.log(`📊 Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// MongoDB connection events
mongoose.connection.on("disconnected", () => {
  console.log("⚠️  MongoDB Disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB Error:", err);
});

// ============================================
// HEALTH CHECK ROUTE
// ============================================

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Sanad API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

app.get("/health", (req: Request, res: Response) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: new Date().toISOString(),
    database:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    environment: process.env.NODE_ENV,
  };

  res.status(200).json(healthCheck);
});

// ============================================
// API ROUTES
// ============================================

const API_VERSION = "/api/v1";

// Auth routes
app.use(`${API_VERSION}/auth`, authRoutes);

// User routes
app.use(`${API_VERSION}/users`, userRoutes);

// Rider routes (drivers)
app.use(`${API_VERSION}/riders`, riderRoutes);

// Ride routes
app.use(`${API_VERSION}/rides`, rideRoutes);

// Appointment routes
app.use(`${API_VERSION}/appointments`, appointmentRoutes);

// Company routes
app.use(`${API_VERSION}/companies`, companyRoutes);

// ============================================
// 404 HANDLER
// ============================================

app.use(notFound);

// ============================================
// GLOBAL ERROR HANDLER
// ============================================

app.use(errorHandler);

// ============================================
// GRACEFUL SHUTDOWN
// ============================================

const gracefulShutdown = async () => {
  console.log("\n🛑 Shutting down gracefully...");

  try {
    await mongoose.connection.close();
    console.log("✅ MongoDB connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
    process.exit(1);
  }
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.error("❌ Unhandled Promise Rejection:", err);
  gracefulShutdown();
});

// Handle uncaught exceptions
process.on("uncaughtException", (err: Error) => {
  console.error("❌ Uncaught Exception:", err);
  gracefulShutdown();
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
});

// ============================================
// EXPORT APP
// ============================================

export default app;
