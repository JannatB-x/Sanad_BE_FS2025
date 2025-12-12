import express from "express";
import {
  getWallet,
  addFunds,
  withdrawFunds,
  getTransactions,
} from "../controllers/wallet.controller";
import { authorize } from "../middlewares/authorize";

const router = express.Router();

router.get("/", authorize, getWallet);
router.get("/transactions", authorize, getTransactions);
router.post("/add", authorize, addFunds);
router.post("/withdraw", authorize, withdrawFunds);

export default router;

