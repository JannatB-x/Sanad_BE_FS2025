// server.ts
import app from "./app";

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log("=".repeat(50));
  console.log(`🚀 Server is running`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log(`📚 API: http://localhost:${PORT}/api/v1`);
  console.log("=".repeat(50));
});

// Export server for testing
export default server;
