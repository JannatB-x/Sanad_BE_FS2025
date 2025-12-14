import { IUser, UserType } from "./user.type";

interface ICompany extends IUser {
  name: string;
  address: string;
  phone: string;
  website: string;
  logo: string;
  description: string;
  licenseNumber: string;
  licenseExpirationDate: Date;
  licenseImage: string;
  drivers: string[];
  vehicles: string[];
}

export { ICompany };
