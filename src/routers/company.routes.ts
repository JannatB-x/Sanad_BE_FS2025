import { Router } from "express";
import {
  createCompany,
  getCompanyProfile,
  updateCompanyProfile,
  deleteCompany,
  updateCompanyDrivers,
  deleteCompanyDriver,
  addCompanyDrivers,
} from "../controllers/company.controller";

const router = Router();

router.post("/", createCompany);
router.get("/", getCompanyProfile);
router.put("/:id", updateCompanyProfile);
router.delete("/:id", deleteCompany);
router.put("/:id/drivers", updateCompanyDrivers);
router.delete("/:id/drivers/:driverId", deleteCompanyDriver);
router.post("/:id/drivers", addCompanyDrivers);
export default router;
