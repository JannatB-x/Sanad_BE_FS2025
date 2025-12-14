import { PaymentStatus, PaymentMethod } from "./payment.type";

enum RideStatus {
  REQUESTED = "REQUESTED",
  ACCEPTED = "ACCEPTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}
interface IRide {
  userId: string;
  driverId: string;
  pickupLocation: ILocation;
  dropoffLocation: ILocation;
  status: RideStatus;
  price: number;
  paymentAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentDate: Date;
  paymentTime: string;
}
interface ILocation {
  lat: number;
  lng: number;
  address?: string;
}

export { IRide, ILocation, RideStatus };
