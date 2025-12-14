import { Request } from "express";

export interface UserType {
  id: string;
  role: string;
}

export interface CustomRequest extends Request {
  user?: UserType;
}

// Extend Request to include multer file
export interface RequestWithFile extends Request {
  file?: Express.Multer.File;
  files?:
    | Express.Multer.File[]
    | { [fieldname: string]: Express.Multer.File[] };
}
