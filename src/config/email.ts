import nodemailer from "nodemailer";
import { config } from "./environment";

// Create email transporter
export const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: false, // true for 465, false for other ports
  auth: {
    user: config.email.user,
    pass: config.email.password,
  },
});

// Verify connection
transporter.verify((error: any, success: any) => {
  if (error) {
    console.error("❌ Email configuration error:", error);
  } else {
    console.log("✅ Email server ready");
  }
});

// Email templates
export const sendWelcomeEmail = async (to: string, name: string) => {
  try {
    await transporter.sendMail({
      from: `"${config.email.fromName}" <${config.email.fromEmail}>`,
      to,
      subject: "Welcome to Sanad Transportation!",
      html: `<h1>Welcome ${name}!</h1><p>Thank you for joining us.</p>`,
    });
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw error;
  }
};

export const sendRideConfirmation = async (to: string, rideDetails: any) => {
  try {
    await transporter.sendMail({
      from: `"${config.email.fromName}" <${config.email.fromEmail}>`,
      to,
      subject: "Ride Confirmed",
      html: `<h1>Your ride is confirmed!</h1><p>Details: ${JSON.stringify(
        rideDetails
      )}</p>`,
    });
  } catch (error) {
    console.error("Error sending ride confirmation email:", error);
    throw error;
  }
};

export default transporter;
