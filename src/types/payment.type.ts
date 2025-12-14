enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

enum PaymentMethod {
  CASH = "CASH",
  CARD = "CARD",
  MOBILE_WALLET = "MOBILE_WALLET",
  ONLINE = "ONLINE",
}

export { PaymentStatus, PaymentMethod };

