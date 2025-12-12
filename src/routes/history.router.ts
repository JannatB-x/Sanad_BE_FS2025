import express from "express";
import {
  getAllHistory,
  getHistoryById,
  createHistory,
  getHistoryByType,
  deleteHistory,
} from "../controllers/history.controller";
import { authorize } from "../middlewares/authorize";

const router = express.Router();

router.get("/", authorize, getAllHistory);
router.get("/type/:type", authorize, getHistoryByType);
router.get("/:id", authorize, getHistoryById);
router.post("/", authorize, createHistory);
router.delete("/:id", authorize, deleteHistory);

export default router;

