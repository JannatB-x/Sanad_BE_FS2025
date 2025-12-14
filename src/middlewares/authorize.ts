import { Request, Response, NextFunction } from "express";
import { CustomRequest, UserType } from "../type/http";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export function authorize(req: Request, res: Response, next: NextFunction) {
  try {
    const r = req as CustomRequest;
    const header = r.header("authorization");
    const [schema, token] = header?.split(" ") || [];

    if (schema != "Bearer" || !token) {
      return res.status(401).json({ message: "Invalid Authorization" });
    }

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    r.user = {
      id: payload.id,
      role: payload.role,
    };
    next();
  } catch (error) {
    next(error);
  }
}
