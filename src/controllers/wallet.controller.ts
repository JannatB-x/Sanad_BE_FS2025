import type { Request, Response, NextFunction } from "express";
import Wallet from "../models/wallet";
import { CustomRequest } from "../type/http";

const getWallet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const r = req as CustomRequest;
    const userId = r.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    let wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      wallet = await Wallet.create({
        userId,
        balance: 0,
        currency: "KWD",
      });
    }

    res.status(200).json({ message: "Wallet retrieved successfully", wallet });
  } catch (error) {
    next(error);
  }
};

const addFunds = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const r = req as CustomRequest;
    const userId = r.user?.id;
    const { amount, description } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    let wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      wallet = await Wallet.create({
        userId,
        balance: 0,
        currency: "KWD",
      });
    }

    wallet.balance += amount;
    wallet.transactions.push({
      type: "credit",
      amount,
      description: description || "Funds added",
      createdAt: new Date(),
    });
    wallet.updatedAt = new Date();
    await wallet.save();

    res.status(200).json({
      message: "Funds added successfully",
      wallet,
    });
  } catch (error) {
    next(error);
  }
};

const withdrawFunds = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const r = req as CustomRequest;
    const userId = r.user?.id;
    const { amount, description } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    wallet.balance -= amount;
    wallet.transactions.push({
      type: "debit",
      amount,
      description: description || "Funds withdrawn",
      createdAt: new Date(),
    });
    wallet.updatedAt = new Date();
    await wallet.save();

    res.status(200).json({
      message: "Funds withdrawn successfully",
      wallet,
    });
  } catch (error) {
    next(error);
  }
};

const getTransactions = async (
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

    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    const transactions = wallet.transactions.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );

    res.status(200).json({
      message: "Transactions retrieved successfully",
      transactions,
    });
  } catch (error) {
    next(error);
  }
};

export { getWallet, addFunds, withdrawFunds, getTransactions };

