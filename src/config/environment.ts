import dotenv from "dotenv";

// Load environment variables
const result = dotenv.config();
if (result.error) {
  console.warn(
    "⚠️  Warning: Error loading .env file in environment config:",
    result.error.message
  );
}

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGODB_URI!,

  client: {
    url: process.env.CLIENT_URL || "*",
  },

  email: {
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    user: process.env.EMAIL_USER || "",
    password: process.env.EMAIL_PASSWORD || "",
    fromEmail: process.env.EMAIL_FROM_EMAIL || "",
    fromName: process.env.EMAIL_FROM_NAME || "Sanad Transportation",
  },

  jwt: {
    secret: process.env.JWT_SECRET!,
    expire: process.env.JWT_EXPIRE || "7d",
  },

  googleMaps: {
    apiKey: process.env.GOOGLE_MAPS_API_KEY!,
  },

  tap: {
    secretKey: process.env.TAP_SECRET_KEY!,
    publicKey: process.env.TAP_PUBLIC_KEY!,
    merchantId: process.env.TAP_MERCHANT_ID!,
  },

  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID!,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
  },

  pricing: {
    baseFare: parseFloat(process.env.BASE_FARE || "1.5"),
    perKmRate: parseFloat(process.env.PER_KM_RATE || "0.5"),
    perMinuteRate: parseFloat(process.env.PER_MINUTE_RATE || "0.2"),
  },
};

// Validate required env vars
const requiredEnvVars = [
  "MONGODB_URI",
  "JWT_SECRET",
  "GOOGLE_MAPS_API_KEY",
  "TAP_SECRET_KEY",
];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});
