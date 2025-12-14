import express from "express";
import {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
  processPayment,
  paymentCallback,
} from "../controllers/payment.controller";
import { authorize } from "../middlewares/authorize";

const router = express.Router();

// Payment processing routes (should be before /:id route)
router.post("/process", authorize, processPayment);
router.post("/callback", paymentCallback); // Webhook - no auth needed

// CRUD routes (all protected)
router.get("/", authorize, getAllPayments);
router.get("/:id", authorize, getPaymentById);
router.post("/", authorize, createPayment);
router.put("/:id", authorize, updatePayment);
router.delete("/:id", authorize, deletePayment);

export default router;
