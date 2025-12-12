import type { Request } from "express";

export interface UserType {
  id: string;
  role: string;
}

export interface BookingNotification {
  id: string;
  title: string;
  location: string;
  date: Date;
  time: string;
  hoursUntil: number;
  itemsRequired: any[];
  bookings: any[];
  message: string;
}

export interface CustomRequest extends Request {
  user?: UserType;
  upcomingBookings?: BookingNotification[];
}

export interface UserType {
  id: string;
  role: string;
}

export interface CustomRequest extends Request {
  user?: UserType;
}
