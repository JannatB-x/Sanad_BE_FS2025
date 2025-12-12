import { config } from "./environment";

// Note: @tap-payments/node package needs to be installed
// Placeholder for Tap Payment SDK
let tap: any = null;

// Initialize Tap Payment
const initializeTap = () => {
  if (!tap) {
    // TODO: Uncomment when @tap-payments/node is installed
    // const TapPayment = require('@tap-payments/node');
    // tap = new TapPayment({
    //   apiKey: config.tap.secretKey,
    //   environment: config.nodeEnv === 'production' ? 'production' : 'sandbox',
    // });
    throw new Error(
      "@tap-payments/node package is not installed. Please install it: npm install @tap-payments/node"
    );
  }
  return tap;
};

export { initializeTap };

// Payment helper functions
export const PAYMENT_METHODS = {
  KNET: "src_kw.knet",
  VISA: "src_card",
  MASTERCARD: "src_card",
  APPLE_PAY: "src_apple_pay",
};

export const CURRENCIES = {
  KUWAIT: "KWD",
  UAE: "AED",
  SAUDI: "SAR",
};

// Export tap instance getter
export const getTapInstance = () => initializeTap();
