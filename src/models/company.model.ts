import { ICompany } from "../types/company.type";
import mongoose from "mongoose";
import { UserType } from "../types/user.type";
import { Schema } from "mongoose";

const companySchema = new mongoose.Schema<ICompany>({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  website: { type: String, required: true },
  logo: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  licenseExpirationDate: { type: Date, required: true },
  licenseImage: { type: String, required: true },
  description: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: {
    type: String,
    required: true,
    enum: Object.values(UserType),
    default: UserType.COMPANY,
  },
  drivers: { type: [String], required: true },
  vehicles: [{ type: Schema.Types.ObjectId, ref: "Vehicle", required: true }],
});

export default mongoose.model<ICompany>("Company", companySchema);
