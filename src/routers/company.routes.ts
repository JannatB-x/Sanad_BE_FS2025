import { Router } from "express";
import {
  getCompanyProfile,
  updateCompanyProfile,
  deleteCompany,
  updateCompanyDrivers,
  deleteCompanyDriver,
  addCompanyDrivers,
} from "../controllers/company.controller";

const router = Router();

router.get("/", getCompanyProfile);
export default router;
