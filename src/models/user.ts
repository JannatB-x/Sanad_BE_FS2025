import { model, Schema } from "mongoose";

const userSchema = new Schema({
  Id: {
    type: String,
    required: true,
  },
  Name: {
    type: String,
    required: true,
  },
  Role: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Identification: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
  MedicalHistory: {
    type: String,
    required: true,
  },
  Disabilities: {
    type: String,
    required: true,
  },
  FunctionalNeeds: {
    type: String,
    required: true,
  },
  Location: {
    type: String,
    required: true,
  },
  Bookings: [
    {
      type: Schema.Types.ObjectId,
      ref: "Bookings",
    },
  ],
  EmergencyContact: {
    type: String,
    required: true,
  },
  EmergencyContactPhone: {
    type: String,
    required: true,
  },
  EmergencyContactRelationship: {
    type: String,
    required: true,
  },
  SavedServices: [
    {
      type: Schema.Types.ObjectId,
      ref: "Services",
    },
  ],
  SavedTransporters: [
    {
      type: Schema.Types.ObjectId,
      ref: "Transporters",
    },
  ],
  SavedLocations: [
    {
      type: Schema.Types.ObjectId,
      ref: "SavedLocations",
    },
  ],
});

const User = model("User", userSchema);

export default User;
