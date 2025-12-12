import admin from "firebase-admin";
import { config } from "./environment";

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: config.firebase.projectId,
    privateKey: config.firebase.privateKey,
    clientEmail: config.firebase.clientEmail,
  }),
});

export const messaging = admin.messaging();
export const firestore = admin.firestore();
export const auth = admin.auth();

export default admin;
