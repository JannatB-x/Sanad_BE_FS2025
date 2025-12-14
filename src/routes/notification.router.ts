import express from "express";
import {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
} from "../controllers/notification.controller";
import { authorize } from "../middlewares/authorize";

const router = express.Router();

// Specific routes (must be before /:id to avoid conflicts)
router.get("/unread/count", authorize, getUnreadCount);
router.put("/read/all", authorize, markAllAsRead);
router.put("/:id/read", authorize, markAsRead); // Must be before /:id

// General routes
router.get("/", authorize, getAllNotifications);
router.get("/:id", authorize, getNotificationById);
router.post("/", authorize, createNotification); // Protected - only authenticated users can create
router.put("/:id", authorize, updateNotification);
router.delete("/:id", authorize, deleteNotification);

export default router;
