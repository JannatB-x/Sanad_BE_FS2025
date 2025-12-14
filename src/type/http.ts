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

// Auth-related types
export interface RegisterDTO {
  Email: string;
  Password: string;
  Username?: string;
  Name?: string;
  Identification?: string;
  MedicalHistory?: string;
  Disabilities?: string;
  FunctionalNeeds?: string;
  Location?: string;
  EmergencyContact?: string;
  EmergencyContactPhone?: string;
  EmergencyContactRelationship?: string;
}

export interface LoginDTO {
  Email: string;
  Password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
}

export interface JwtPayload {
  id: string;
  role: string;
  email?: string;
}

export interface AuthRequest extends CustomRequest {
  user?: UserType;
}
