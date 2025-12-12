import type { Request, Response, NextFunction } from "express";

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: `404 - ${req.path} not found` });
};

export default notFoundHandler;
