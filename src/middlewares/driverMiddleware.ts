import type { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../type/http";

export function driverMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const r = req as CustomRequest;
    if (r.user?.role !== "driver") {
      return res.status(403).json({ message: "Access denied. Driver role required." });
    }
    next();
  } catch (error) {
    next(error);
  }
}

