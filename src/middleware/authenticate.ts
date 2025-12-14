import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { AppError } from "./errorHandler";
import { CustomRequest } from "../types/http.types";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
  } catch (error) {
    next(error);
  }
};
export default authenticate;
