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
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "placeholder-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "dawrah-test.firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ?? "https://dawrah-test-default-rtdb.firebaseio.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "dawrah-test",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "dawrah-test.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "613358099601",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "1:613358099601:web:2112a3eb4e3fdf5ae83330",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "G-5XBMQN24BV",
};

/**
 * Returns true if real Firebase environment credentials have been supplied.
 */
export function isFirebaseConfigured(): boolean {
  const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  return (
    Boolean(key) &&
    key !== "placeholder-api-key" &&
    !key?.toLowerCase().includes("placeholder") &&
    !key?.toLowerCase().includes("yourkey") &&
    !key?.toLowerCase().includes("youractualapikey")
  );
}
