import type { Request, Response, NextFunction } from "express";
import Payment from "../models/payment";
import errorHandler from "../middlewares/errorHandler";
import { createCharge, verifyPayment } from "../appServices/payment.services";
import { CustomRequest } from "../type/http";

const getAllPayments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payments = await Payment.find()
      .populate("riderId")
      .populate("driverId");
    res.status(200).json({ message: "Payments found successfully", payments });
  } catch (error) {
    next(error);
  }
};

const getPaymentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("riderId")
      .populate("driverId");
    res.status(200).json({ message: "Payment found successfully", payment });
  } catch (error) {
    next(error);
  }
};

const createPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newPayment = await Payment.create(req.body);
    res
      .status(201)
      .json({ message: "Payment created successfully", newPayment });
  } catch (error) {
    next(error);
  }
};

const updatePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ message: "Payment updated successfully", payment });
  } catch (error) {
    next(error);
  }
};

const deletePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await Payment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Process payment
const processPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const r = req as CustomRequest;
    const { rideId, amount, driverId } = req.body;
    const userId = r.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Create charge with Tap
    const charge = await createCharge(amount, "KWD", userId);

    // Save payment record
    const newPayment = await Payment.create({
      riderId: userId,
      driverId: driverId || req.body.driverId,
      amount,
      paymentMethod: "card",
      paymentStatus: "pending",
      paymentDate: new Date(),
      paymentRef: charge.id,
      paymentType: "ride",
      transactionId: charge.id,
      transactionDate: new Date(),
      transactionAmount: amount,
    });

    const paymentDoc = Array.isArray(newPayment) ? newPayment[0] : newPayment;

    // Return payment URL for user to complete
    res.status(200).json({
      message: "Payment initiated successfully",
      paymentUrl: charge.transaction?.url || charge.redirect?.url,
      chargeId: charge.id,
      payment: paymentDoc,
    });
  } catch (error: any) {
    next(error);
  }
};

// Payment callback
const paymentCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { tap_id } = req.query; // Tap sends charge ID

    if (!tap_id) {
      return res.status(400).json({ message: "Payment ID is required" });
    }

    // Verify payment with Tap
    const isVerified = await verifyPayment(tap_id as string);

    if (isVerified) {
      // Update payment status
      await Payment.findOneAndUpdate(
        { transactionId: tap_id },
        { paymentStatus: "completed" }
      );

      res.redirect("/payment-success");
    } else {
      // Update payment status to failed
      await Payment.findOneAndUpdate(
        { transactionId: tap_id },
        { paymentStatus: "failed" }
      );

      res.redirect("/payment-failed");
    }
  } catch (error: any) {
    next(error);
  }
};

export {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
  processPayment,
  paymentCallback,
};

