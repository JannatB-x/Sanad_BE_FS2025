import { Server } from "socket.io";
import { Server as HTTPServer } from "http";
import { config } from "./environment";

export const initializeSocket = (server: HTTPServer) => {
  const io = new Server(server, {
    cors: {
      origin: config.client.url,
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Connection handler
  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    // Join ride room
    socket.on("joinRide", (rideId: string) => {
      socket.join(rideId);
      console.log(`🚗 Socket ${socket.id} joined ride ${rideId}`);
    });

    // Update location
    socket.on("updateLocation", (data) => {
      socket.to(data.rideId).emit("driverLocation", data);
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });

  return io;
};
