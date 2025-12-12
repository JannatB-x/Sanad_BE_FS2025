import type { Request, Response, NextFunction } from "express";
import Calendar from "../models/calendar";
import { CustomRequest } from "../type/http";

/**
 * Middleware that checks for upcoming bookings and attaches notification information to the request
 * Notifications are sent for bookings within the next 24 hours (configurable)
 */
const bookingNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const r = req as CustomRequest;
    const now = new Date();
    const notificationWindow = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const futureDate = new Date(now.getTime() + notificationWindow);

    // Find calendar events with bookings that are upcoming within the notification window
    const upcomingBookings = await Calendar.find({
      Date: {
        $gte: now,
        $lte: futureDate,
      },
    })
      .populate("Bookings")
      .populate("ItemsRequired")
      .sort({ Date: 1, Time: 1 });

    if (upcomingBookings.length > 0) {
      // Format notification data
      const notifications = upcomingBookings.map((calendar) => {
        const bookingDate = new Date(calendar.Date);
        const hoursUntilBooking = Math.round(
          (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60)
        );

        return {
          id: calendar._id.toString(),
          title: calendar.Title,
          location: calendar.Location,
          date: calendar.Date,
          time: calendar.Time,
          hoursUntil: hoursUntilBooking,
          itemsRequired: calendar.ItemsRequired || [],
          bookings: calendar.Bookings || [],
          message: `Upcoming booking: ${calendar.Title} at ${calendar.Location} in ${hoursUntilBooking} hour(s)`,
        };
      });

      // Attach notifications to request object for use in controllers
      r.upcomingBookings = notifications;

      // Log notifications (you can replace this with actual notification service like email, push, etc.)
      console.log("📅 Upcoming Booking Notifications:");
      notifications.forEach((notification) => {
        console.log(`  - ${notification.message}`);
      });
    } else {
      r.upcomingBookings = [];
    }

    next();
  } catch (error) {
    // Don't block the request if notification check fails
    console.error("Error checking booking notifications:", error);
    const r = req as CustomRequest;
    r.upcomingBookings = [];
    next();
  }
};

export default bookingNotification;
