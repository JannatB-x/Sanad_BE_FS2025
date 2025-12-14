enum UserType {
  USER = "user",
  DRIVER = "driver",
  COMPANY = "company",
}
interface IUser {
  name: string;
  email: string;
  password: string;
  userType: UserType;
  diseases: string[];
  disabilityLevel: string;
  statusDocument: string;
  statusDocuments: string[];
  emergencyContact?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  location: string;
  rideHistory: string[];
  rideRatings: string[];
  appointments: string[];
  earnings: string[];
  createdAt: Date;
  updatedAt: Date;
}

export { IUser, UserType };
