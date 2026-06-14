/**
 * ─────────────────────────────────────────────────────────────────
 * FIREBASE CONFIG — Replace with your app's config.
 *
 * Used by FirebaseLoginModel for auth reads.
 * ─────────────────────────────────────────────────────────────────
 */

import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? "",
};

function assertFirebaseConfig() {
  const missing: string[] = [];
  if (!firebaseConfig.apiKey) missing.push("EXPO_PUBLIC_FIREBASE_API_KEY");
  if (!firebaseConfig.authDomain) missing.push("EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN");
  if (!firebaseConfig.projectId) missing.push("EXPO_PUBLIC_FIREBASE_PROJECT_ID");
  if (!firebaseConfig.appId) missing.push("EXPO_PUBLIC_FIREBASE_APP_ID");
  if (missing.length > 0) {
    throw new Error(
      `[firebase-config] Missing required env vars: ${missing.join(", ")}. ` +
        "Set runtime vars via config manager and restart Expo.",
    );
  }
}

let firebaseApp: FirebaseApp | undefined;
let firebaseAuth: Auth | undefined;

export function initializeFirebaseApp(): FirebaseApp {
  if (firebaseApp) return firebaseApp;
  assertFirebaseConfig();
  firebaseApp = getApps()[0] ?? initializeApp(firebaseConfig);
  return firebaseApp;
}

export function getFirebaseApp(): FirebaseApp {
  return initializeFirebaseApp();
}

export function getFirebaseAuth(): Auth {
  if (firebaseAuth) return firebaseAuth;
  const app = getFirebaseApp();
  firebaseAuth = getAuth(app);
  return firebaseAuth;
}
