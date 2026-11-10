import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";

/**
 * Firebase Client & Service Configuration
 * Follows security-by-design principles: sensitive keys are guarded via environment variables.
 */

export interface FirebaseClientConfig {
  readonly apiKey: string;
  readonly authDomain: string;
  readonly databaseURL?: string;
  readonly projectId: string;
  readonly storageBucket: string;
  readonly messagingSenderId: string;
  readonly appId: string;
  readonly measurementId?: string;
}

export const firebaseConfig: FirebaseClientConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "placeholder-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "shewimy-app.firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://shewimy-app-default-rtdb.firebaseio.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "shewimy-app",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "shewimy-app.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789012:web:abcdef1234567890abcdef",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-XXXXXXXXXX",
};

/**
 * Returns true only if real Firebase environment credentials have been supplied.
 * Strict check prevents invalid API keys from hanging SDK network calls.
 */
export function isFirebaseConfigured(): boolean {
  const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || firebaseConfig.apiKey;
  return (
    typeof key === "string" &&
    key.trim().length > 15 &&
    key !== "placeholder-api-key" &&
    !key.toLowerCase().includes("placeholder") &&
    !key.toLowerCase().includes("yourkey") &&
    !key.toLowerCase().includes("youractualapikey")
  );
}

let cachedApp: FirebaseApp | null = null;

/**
 * Safe singleton getter for FirebaseApp.
 * Returns null immediately if Firebase credentials are missing or placeholders,
 * preventing SDK auth/invalid-api-key errors and hanging network loops.
 */
export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) {
    return null;
  }
  if (cachedApp) return cachedApp;
  try {
    if (!getApps().length) {
      cachedApp = initializeApp(firebaseConfig);
    } else {
      cachedApp = getApp();
    }
    return cachedApp;
  } catch (err) {
    console.warn("Firebase App initialization skipped:", err);
    return null;
  }
}
