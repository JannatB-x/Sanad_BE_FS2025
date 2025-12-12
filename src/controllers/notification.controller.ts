import type { Request, Response, NextFunction } from "express";
import Notification from "../models/notification";
import { CustomRequest } from "../type/http";
import { sendNotification } from "../appServices/notification.services";

const getAllNotifications = async (
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

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);
    res
      .status(200)
      .json({ message: "Notifications found successfully", notifications });
  } catch (error) {
    next(error);
  }
};

const getNotificationById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const notification = await Notification.findById(req.params.id);
    res
      .status(200)
      .json({ message: "Notification found successfully", notification });
  } catch (error) {
    next(error);
  }
};

const createNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newNotification = await Notification.create(req.body);
    res.status(201).json({
      message: "Notification created successfully",
      newNotification,
    });
  } catch (error) {
    next(error);
  }
};

const updateNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res
      .status(200)
      .json({ message: "Notification updated successfully", notification });
  } catch (error) {
    next(error);
  }
};

const deleteNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.status(200).json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    next(error);
  }
};

const markAllAsRead = async (
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

    await Notification.updateMany({ userId, isRead: false }, { isRead: true });
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    next(error);
  }
};

const getUnreadCount = async (
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

    const count = await Notification.countDocuments({
      userId,
      isRead: false,
    });
    res.status(200).json({ message: "Unread count retrieved", count });
  } catch (error) {
    next(error);
  }
};

export {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
};

