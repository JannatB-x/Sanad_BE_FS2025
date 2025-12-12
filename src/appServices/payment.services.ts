import dotenv from "dotenv";
dotenv.config();

// Note: @tap-payments/node package needs to be installed
// If using a different Tap Payments SDK, adjust imports accordingly
// For now, using a placeholder interface

interface TapCharge {
  id: string;
  status: string;
  transaction?: {
    url?: string;
  };
  redirect?: {
    url?: string;
  };
}

// Placeholder for Tap Payment SDK - replace with actual import when package is installed
// import TapPayment from '@tap-payments/node';

let tap: any = null;

const initializeTap = () => {
  if (!tap) {
    const apiKey = process.env.TAP_SECRET_KEY;
    if (!apiKey) {
      throw new Error("TAP_SECRET_KEY is not set in environment variables");
    }

    // TODO: Uncomment when @tap-payments/node is installed
    // const TapPayment = require('@tap-payments/node');
    // tap = new TapPayment({
    //   apiKey,
    //   environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
    // });

    // For now, throw error if trying to use without package
    throw new Error(
      "@tap-payments/node package is not installed. Please install it: npm install @tap-payments/node"
    );
  }
  return tap;
};

export const createCharge = async (
  amount: number,
  currency: string = "KWD",
  customerId: string
): Promise<TapCharge> => {
  try {
    const tapClient = initializeTap();
    const callbackUrl =
      process.env.PAYMENT_CALLBACK_URL ||
      "https://yourapp.com/payment/callback";

    const charge = await tapClient.charges.create({
      amount,
      currency,
      customer: {
        id: customerId,
      },
      source: {
        id: "src_kw.knet", // K-Net for Kuwait
      },
      redirect: {
        url: callbackUrl,
      },
    });

    return charge;
  } catch (error) {
    console.error("Tap payment error:", error);
    throw error;
  }
};

export const verifyPayment = async (chargeId: string): Promise<boolean> => {
  try {
    const tapClient = initializeTap();
    const charge = await tapClient.charges.retrieve(chargeId);
    return charge.status === "CAPTURED";
  } catch (error) {
    console.error("Payment verification error:", error);
    throw error;
  }
};
