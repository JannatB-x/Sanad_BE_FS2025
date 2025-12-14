import type { Request, Response, NextFunction } from "express";
import Company from "../models/company.model";
import { AppError } from "../middleware/errorHandler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
import { CustomRequest } from "../types/http.types";

const getCompanyProfile = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const company = await Company.findOne({ CompanyId: req.params.id });
    res.status(200).json({ company });
  } catch (error) {
    next(error);
  }
};

const updateCompanyProfile = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ company });
  } catch (error) {
    next(error);
  }
};

const deleteCompany = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    res.status(200).json({ company });
  } catch (error) {
    next(error);
  }
};

const updateCompanyDrivers = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ company });
  } catch (error) {
    next(error);
  }
};

const deleteCompanyDriver = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ company });
  } catch (error) {
    next(error);
  }
};

const addCompanyDrivers = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ company });
  } catch (error) {
    next(error);
  }
};

export {
  getCompanyProfile,
  updateCompanyProfile,
  deleteCompany,
  updateCompanyDrivers,
  deleteCompanyDriver,
  addCompanyDrivers,
};
