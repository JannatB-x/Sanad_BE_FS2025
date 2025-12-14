import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/user";
import { RegisterDTO, LoginDTO, AuthResponse, JwtPayload } from "../type/http";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

export class AuthService {
  async register(data: RegisterDTO): Promise<AuthResponse> {
    const {
      Email,
      Password,
      Username,
      Name,
      Identification,
      MedicalHistory,
      Disabilities,
      FunctionalNeeds,
      Location,
      EmergencyContact,
      EmergencyContactPhone,
      EmergencyContactRelationship,
    } = data;

    // Validate required fields
    if (!Email || !Password) {
      throw new Error("Email and Password are required");
    }

    // Check if user already exists
    const existingUser = await User.findOne({ Email });
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Create new user
    const user = await User.create({
      Id: Username || Email.split("@")[0],
      Name: Name || Username || Email.split("@")[0],
      Role: "user",
      Email,
      Password: hashedPassword,
      Identification: Identification || "",
      MedicalHistory: MedicalHistory || "",
      Disabilities: Disabilities || "",
      FunctionalNeeds: FunctionalNeeds || "",
      Location: Location || "",
      EmergencyContact: EmergencyContact || "",
      EmergencyContactPhone: EmergencyContactPhone || "",
      EmergencyContactRelationship: EmergencyContactRelationship || "",
    });

    const userDoc = Array.isArray(user) ? user[0] : user;

    // Generate token
    const token = this.generateToken({
      id: userDoc._id.toString(),
      role: userDoc.Role,
    });

    return {
      user: {
        id: userDoc._id.toString(),
        email: userDoc.Email,
        name: userDoc.Name,
      },
      token,
    };
  }

  async login(data: LoginDTO): Promise<AuthResponse> {
    const { Email, Password } = data;

    // Find user
    const user = await User.findOne({ Email });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Check password
    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    // Generate token
    const token = this.generateToken({
      id: user._id.toString(),
      role: user.Role,
    });

    return {
      user: {
        id: user._id.toString(),
        email: user.Email,
        name: user.Name,
      },
      token,
    };
  }

  async getProfile(userId: string) {
    const user = await User.findById(userId).select("-Password");
    if (!user) {
      throw new Error("User not found");
    }

    return {
      id: user._id.toString(),
      email: user.Email,
      name: user.Name,
      role: user.Role,
      identification: user.Identification,
      medicalHistory: user.MedicalHistory,
      disabilities: user.Disabilities,
      functionalNeeds: user.FunctionalNeeds,
      location: user.Location,
      emergencyContact: user.EmergencyContact,
      emergencyContactPhone: user.EmergencyContactPhone,
      emergencyContactRelationship: user.EmergencyContactRelationship,
      avatar: user.Avatar || "",
      documents: user.Documents || [],
    };
  }

  private generateToken(payload: JwtPayload): string {
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    } as SignOptions);
  }
}

export const authService = new AuthService();
