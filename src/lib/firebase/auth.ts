import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  Auth,
} from "firebase/auth";
import { initializeApp, getApps, getApp } from "firebase/app";
import { firebaseConfig, isFirebaseConfigured } from "./config";

function getFirebaseApp() {
  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  }
  return getApp();
}

let cachedAuth: Auth | null = null;

export function getFirebaseAuth(): Auth | null {
  if (cachedAuth) return cachedAuth;
  try {
    const app = getFirebaseApp();
    cachedAuth = getAuth(app);
    return cachedAuth;
  } catch (err) {
    console.warn("Firebase Auth initialization error:", err);
    return null;
  }
}

/**
 * Sign in admin user using Email and Password.
 */
export async function signInAdmin(
  email: string,
  pass: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  const auth = getFirebaseAuth();
  if (!auth || !isFirebaseConfigured()) {
    // Development fallback if Firebase auth is not setup or offline
    if (email.trim() && pass.trim()) {
      return {
        success: true,
        user: {
          uid: "dev-admin-uid",
          email: email.trim(),
          displayName: "مدير النظام (الشويمي)",
        } as unknown as User,
      };
    }
    return { success: false, error: "برجاء إدخال البريد الإلكتروني وكلمة المرور" };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), pass);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    let message = "فشل تسجيل الدخول. يرجى التحقق من صحة البيانات.";
    if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
      message = "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
    } else if (error.code === "auth/user-not-found") {
      message = "لا يوجد حساب مسجل بهذا البريد الإلكتروني.";
    } else if (error.code === "auth/too-many-requests") {
      message = "تم حظر المحاولات مؤقتاً لكثرة المحاولات الخاطئة. يرجى المحاولة لاحقاً.";
    }
    return { success: false, error: message };
  }
}

/**
 * Sign out current admin user.
 */
export async function signOutAdmin(): Promise<void> {
  const auth = getFirebaseAuth();
  if (auth) {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("SignOut error:", e);
    }
  }
  // Clear any local simulation
  if (typeof window !== "undefined") {
    localStorage.removeItem("shewimy_admin_session");
  }
}

/**
 * Subscribe to auth state changes.
 */
export function subscribeToAuth(callback: (user: User | null) => void): () => void {
  const auth = getFirebaseAuth();
  if (!auth) {
    // Check if we have local dev session
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("shewimy_admin_session");
      if (saved) {
        try {
          callback(JSON.parse(saved));
          return () => {};
        } catch {
          // ignore
        }
      }
    }
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}
