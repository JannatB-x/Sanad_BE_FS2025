import { IUser } from "../types/user.type";
import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";

// Extend IUser interface to include methods
interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  userType: { type: String, required: true },
  diseases: { type: [String], required: false },
  disabilityLevel: { type: String, required: false },
  statusDocument: { type: String, required: false },
  statusDocuments: { type: [String], required: false },
  emergencyContact: { type: String, required: false },
  emergencyContactPhone: { type: String, required: false },
  emergencyContactRelation: { type: String, required: false },
});

// Hash password before saving
userSchema.pre<IUserDocument>("save", async function (next: any) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUserDocument>("User", userSchema);
