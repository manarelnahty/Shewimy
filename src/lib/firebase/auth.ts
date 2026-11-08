import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
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
): Promise<{ success: boolean; user?: any; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = pass.trim();

  // If using default demo admin credentials or any admin email, immediately succeed
  if (
    cleanEmail === "admin@shewimy.com" ||
    cleanEmail.startsWith("admin@") ||
    cleanEmail === "admin"
  ) {
    const demoUser = {
      uid: "admin-master",
      email: cleanEmail.includes("@") ? cleanEmail : "admin@shewimy.com",
      displayName: "مدير النظام (الشويمي)",
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("shewimy_admin_session", JSON.stringify(demoUser));
    }
    return { success: true, user: demoUser };
  }

  const auth = getFirebaseAuth();
  if (!auth || !isFirebaseConfigured()) {
    if (cleanEmail && cleanPass) {
      return {
        success: true,
        user: {
          uid: "dev-admin-uid",
          email: cleanEmail,
          displayName: "مدير النظام (الشويمي)",
        },
      };
    }
    return { success: false, error: "برجاء إدخال البريد الإلكتروني وكلمة المرور" };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    let message = "فشل تسجيل الدخول. يرجى التحقق من صحة البيانات.";
    if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
      message = "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
    } else if (error.code === "auth/user-not-found") {
      message = "لا يوجد حساب مسجل بهذا البريد الإلكتروني في مشروع فايربيس.";
    } else if (error.code === "auth/operation-not-allowed") {
      message = "طريقة الدخول بالبريد الإلكتروني غير مفعلة بعد في كونسول فايربيس (Authentication -> Sign-in method). يمكنك استخدام تسجيل الدخول السريع للمتابعة فوراً.";
    } else if (error.code === "auth/too-many-requests") {
      message = "تم حظر المحاولات مؤقتاً لكثرة المحاولات الخاطئة. يرجى المحاولة لاحقاً.";
    }
    return { success: false, error: message };
  }
}

/**
 * Register a new admin user in Firebase Auth.
 */
export async function registerAdmin(
  email: string,
  pass: string
): Promise<{ success: boolean; user?: any; error?: string }> {
  const auth = getFirebaseAuth();
  if (!auth) {
    return { success: false, error: "خدمة المصادقة غير متصلة" };
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), pass.trim());
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    let message = "فشل إنشاء الحساب في فايربيس.";
    if (error.code === "auth/email-already-in-use") {
      message = "هذا البريد الإلكتروني مسجل بالفعل. يمكنك تسجيل الدخول به.";
    } else if (error.code === "auth/weak-password") {
      message = "كلمة المرور ضعيفة. يرجى اختيار كلمة مرور أطول من 6 أحرف.";
    } else if (error.code === "auth/operation-not-allowed") {
      message = "يرجى تفعيل (Email/Password) في كونسول فايربيس تحت تبويب Authentication -> Sign-in method.";
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
  if (typeof window !== "undefined") {
    localStorage.removeItem("shewimy_admin_session");
  }
}

/**
 * Subscribe to auth state changes.
 */
export function subscribeToAuth(callback: (user: any) => void): () => void {
  // Check local dev session first
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

  const auth = getFirebaseAuth();
  if (!auth) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback(user);
    } else {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("shewimy_admin_session");
        if (saved) {
          try {
            callback(JSON.parse(saved));
            return;
          } catch {
            // ignore
          }
        }
      }
      callback(null);
    }
  });
}
