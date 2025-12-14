import express, { Request, Response } from "express";
import http from "http";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { Server } from "socket.io";

// Routes
import calendarRouter from "./routes/calendar.router";
import rideRouter from "./routes/ride.router";
import driverRouter from "./routes/driver.router";
import userRouter from "./routes/user.router";
import serviceRouter from "./routes/service.router";
import paymentRouter from "./routes/payment.router";
import reviewRouter from "./routes/review.router";
import notificationRouter from "./routes/notification.router";
import walletRouter from "./routes/wallet.router";
import historyRouter from "./routes/history.router";

// Middleware
import errorHandler from "./middlewares/errorHandler";
import notFoundHandler from "./middlewares/notFoundHandler";

// Load environment variables
const result = dotenv.config();
if (result.error) {
  console.warn("⚠️  Warning: Error loading .env file:", result.error.message);
} else if (result.parsed) {
  console.log(
    `✅ Loaded ${Object.keys(result.parsed).length} environment variables`
  );
}

// Initialize Express app
const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (MONGO_URI) {
  // Validate MongoDB URI format
  if (
    !MONGO_URI.startsWith("mongodb://") &&
    !MONGO_URI.startsWith("mongodb+srv://")
  ) {
    console.error(
      "❌ Invalid MongoDB URI format. Must start with 'mongodb://' or 'mongodb+srv://'"
    );
  } else {
    mongoose
      .connect(MONGO_URI)
      .then(() => {
        console.log("✅ MongoDB connected successfully");
        console.log(`📊 Database: ${mongoose.connection.name}`);
      })
      .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message);

        // Provide helpful error messages
        if (
          err.message.includes("authentication failed") ||
          err.code === 8000
        ) {
          console.error("💡 Authentication failed. Please check:");
          console.error(
            "   1. Username and password in MONGODB_URI are correct"
          );
          console.error(
            "   2. Special characters in password are URL-encoded (e.g., @ becomes %40)"
          );
          console.error(
            "   3. Database user has proper permissions in MongoDB Atlas"
          );
          console.error(
            "   4. IP address is whitelisted in MongoDB Atlas Network Access"
          );
        } else if (
          err.message.includes("ENOTFOUND") ||
          err.message.includes("getaddrinfo")
        ) {
          console.error("💡 Network error. Please check:");
          console.error("   1. Internet connection is active");
          console.error("   2. MongoDB Atlas cluster is running");
          console.error(
            "   3. Cluster hostname in connection string is correct"
          );
        }

        console.log("⚠️  Server will continue without database connection");
      });
  }
} else {
  console.warn(
    "⚠️  WARNING: MONGO_URI or MONGODB_URI not found in environment variables"
  );
  console.warn(
    "   Please ensure your .env file contains: MONGODB_URI=mongodb+srv://..."
  );
}

// Middleware Setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

// Static Files
const uploadsPath = path.join(process.cwd(), "uploads");
app.use("/uploads", express.static(uploadsPath));

// Root Route
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Transportation API",
    version: "1.0.0",
    endpoints: {
      users: "/api/users",
      rides: "/api/rides",
      drivers: "/api/drivers",
      services: "/api/services",
      payments: "/api/payments",
      calendar: "/api/calendar",
      reviews: "/api/reviews",
      notifications: "/api/notifications",
      wallet: "/api/wallet",
      history: "/api/history",
    },
  });
});

// API Info Route (for mobile app connection check)
app.get("/api", (req: Request, res: Response) => {
  res.json({
    message: "Sanad Transportation API",
    version: "1.0.0",
    status: "online",
    endpoints: {
      users: "/api/users",
      rides: "/api/rides",
      drivers: "/api/drivers",
      services: "/api/services",
      payments: "/api/payments",
      calendar: "/api/calendar",
      reviews: "/api/reviews",
      notifications: "/api/notifications",
      wallet: "/api/wallet",
      history: "/api/history",
    },
  });
});

// API Routes
app.use("/api/users", userRouter);
app.use("/api/rides", rideRouter);
app.use("/api/drivers", driverRouter);
app.use("/api/services", serviceRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/calendar", calendarRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/wallet", walletRouter);
app.use("/api/history", historyRouter);

// Error Handlers (Must be last!)
app.use(notFoundHandler);
app.use(errorHandler);

// Create HTTP Server
const server = http.createServer(app);

// Socket.io Setup for Real-time Features
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"],
  },
});

// Socket.io Connection Handler
io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  // Driver location updates
  socket.on("updateLocation", (data) => {
    console.log("📍 Location update:", data);
    socket.broadcast.to(data.rideId).emit("driverLocation", data);
  });

  // Join ride room
  socket.on("joinRide", (rideId: string) => {
    socket.join(rideId);
    console.log(`🚗 Joined ride room: ${rideId}`);
  });

  // Leave ride room
  socket.on("leaveRide", (rideId: string) => {
    socket.leave(rideId);
    console.log(`🚪 Left ride room: ${rideId}`);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// Start Server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || "development"}`);
});

// Export for testing
export { app, io };
export default server;
