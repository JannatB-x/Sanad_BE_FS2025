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

router.get("/", authorize, getAllNotifications);
router.get("/unread/count", authorize, getUnreadCount);
router.get("/:id", authorize, getNotificationById);
router.post("/", createNotification);
router.put("/:id", authorize, updateNotification);
router.put("/:id/read", authorize, markAsRead);
router.put("/read/all", authorize, markAllAsRead);
router.delete("/:id", authorize, deleteNotification);

export default router;

