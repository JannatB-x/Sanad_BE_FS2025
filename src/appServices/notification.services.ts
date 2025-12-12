import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : {
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url:
          "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
      };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

interface NotificationMessage {
  title: string;
  body: string;
  data?: Record<string, string>;
}

export const sendNotification = async (
  deviceToken: string,
  message: NotificationMessage
) => {
  try {
    await admin.messaging().send({
      token: deviceToken,
      notification: {
        title: message.title,
        body: message.body,
      },
      data: message.data || {},
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
};

export const sendNotificationToMultiple = async (
  deviceTokens: string[],
  message: NotificationMessage
) => {
  try {
    const response = await admin.messaging().sendEachForMulticast({
      tokens: deviceTokens,
      notification: {
        title: message.title,
        body: message.body,
      },
      data: message.data || {},
    });
    return response;
  } catch (error) {
    console.error("Error sending notifications:", error);
    throw error;
  }
};
