import { IUser, UserType } from "./user.type";

interface IDriver {
  name: string;
  email: string;
  password: string;
  userType: UserType;
  statusDocument: string;
  statusDocuments: string[];
  userId: string;
  licenseNumber: string;
  vehicleInfo: string;
  currentLocation: ILocation;
  isAvailable: boolean;
  rating: number;
  rideHistory: string[];
  rideRatings: string[];
  appointments: string[];
  earnings: string[];
  createdAt: Date;
  updatedAt: Date;
}
interface ILocation {
  lat: number;
  lng: number;
  address?: string;
}

export { IDriver, ILocation };
