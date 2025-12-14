import type { Request, Response, NextFunction } from "express";

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  console.log(`❌ Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ message: "Route not found" });
};

export default notFoundHandler;
