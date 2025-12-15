// routes/vehicle.routes.ts
import { Router } from "express";
import {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  searchVehicles,
  getCompanyVehicles,
  assignRiderToVehicle,
  toggleVehicleAvailability,
  uploadVehicleDocuments,
} from "../controllers/vehicles.controller";
import { authenticate } from "../middleware/authenticate";
import { uploadProfileImage } from "../middleware/upload";

const router = Router();

// Public routes
router.post("/search", searchVehicles); // Search available vehicles
router.get("/:id", getVehicleById); // Get vehicle details

// Protected routes (require authentication)
router.use(authenticate);

router.get("/", getVehicles); // Get all vehicles
router.post("/", createVehicle); // Create new vehicle
router.put("/:id", updateVehicle); // Update vehicle
router.delete("/:id", deleteVehicle); // Delete vehicle

// Company-specific routes
router.get("/company/:companyId", getCompanyVehicles); // Get company's vehicles

// Rider assignment
router.put("/:id/assign-rider", assignRiderToVehicle); // Assign rider to vehicle

// Availability toggle
router.put("/:id/toggle-availability", toggleVehicleAvailability);

// Document uploads
router.put("/:id/upload-document", uploadProfileImage, uploadVehicleDocuments);

export default router;
