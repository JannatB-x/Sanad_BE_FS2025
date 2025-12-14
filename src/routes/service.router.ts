import express from "express";
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../controllers/service.controller";
import { authorize } from "../middlewares/authorize";

const router = express.Router();

// Public read routes (services can be viewed by anyone)
router.get("/", getAllServices);
router.get("/:id", getServiceById);

// Protected write routes (only authenticated users can create/update/delete)
router.post("/", authorize, createService);
router.put("/:id", authorize, updateService);
router.delete("/:id", authorize, deleteService);

export default router;
