import type { Request, Response, NextFunction } from "express";
import History from "../models/history";
import { CustomRequest } from "../type/http";

const getAllHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const r = req as CustomRequest;
    const userId = r.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const history = await History.find({ userId })
      .sort({ createdAt: -1 })
      .limit(100);
    res.status(200).json({ message: "History retrieved successfully", history });
  } catch (error) {
    next(error);
  }
};

const getHistoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const history = await History.findById(req.params.id);
    res.status(200).json({ message: "History item found successfully", history });
  } catch (error) {
    next(error);
  }
};

const createHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const r = req as CustomRequest;
    const userId = r.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const newHistory = await History.create({
      ...req.body,
      userId,
    });
    res.status(201).json({
      message: "History item created successfully",
      newHistory,
    });
  } catch (error) {
    next(error);
  }
};

const getHistoryByType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const r = req as CustomRequest;
    const userId = r.user?.id;
    const { type } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const history = await History.find({ userId, type })
      .sort({ createdAt: -1 })
      .limit(50);
    res.status(200).json({
      message: "History retrieved successfully",
      history,
    });
  } catch (error) {
    next(error);
  }
};

const deleteHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await History.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "History item deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export {
  getAllHistory,
  getHistoryById,
  createHistory,
  getHistoryByType,
  deleteHistory,
};

