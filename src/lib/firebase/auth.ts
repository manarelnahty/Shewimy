import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  User,
  Auth,
} from "firebase/auth";
import { initializeApp, getApps, getApp } from "firebase/app";
import { firebaseConfig, isFirebaseConfigured } from "./config";
import { syncAdminAccountToFirestore } from "./firestore";

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
 * Supports:
 * 1. Disk persistence / schema sync check via `/api/admin/account`
 * 2. Firebase Authentication
 * 3. Default dev session fallback
 */
export async function signInAdmin(
  email: string,
  pass: string
): Promise<{ success: boolean; user?: any; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = pass.trim();

  if (!cleanEmail || !cleanPass) {
    return { success: false, error: "برجاء إدخال البريد الإلكتروني وكلمة المرور" };
  }

  // 1. Verify against current stored admin account (persisted to src/data/adminAccount.json)
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/admin/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password: cleanPass }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        localStorage.setItem("shewimy_admin_session", JSON.stringify(data.user));
        // Also sign into Firebase Auth in background if available
        const auth = getFirebaseAuth();
        if (auth && isFirebaseConfigured()) {
          signInWithEmailAndPassword(auth, cleanEmail, cleanPass).catch(() => {});
        }
        return { success: true, user: data.user };
      } else if (data.error && !data.notFound) {
        // Wrong password for the registered admin email
        return { success: false, error: data.error };
      }
    } catch (apiErr) {
      console.warn("Could not check /api/admin/account:", apiErr);
    }
  }

  // 2. Direct Firebase Auth attempt
  const auth = getFirebaseAuth();
  if (auth && isFirebaseConfigured()) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
      const userObj = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName || "مدير النظام (الشويمي)",
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("shewimy_admin_session", JSON.stringify(userObj));
      }
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      let message = "فشل تسجيل الدخول. يرجى التحقق من صحة البيانات.";
      if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
        message = "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
      } else if (error.code === "auth/user-not-found") {
        message = "لا يوجد حساب مسجل بهذا البريد الإلكتروني.";
      } else if (error.code === "auth/operation-not-allowed") {
        message = "طريقة الدخول بالبريد الإلكتروني غير مفعلة بعد في كونسول فايربيس.";
      } else if (error.code === "auth/too-many-requests") {
        message = "تم حظر المحاولات مؤقتاً لكثرة المحاولات الخاطئة. يرجى المحاولة لاحقاً.";
      }
      return { success: false, error: message };
    }
  }

  // 3. Fallback for demo admin credentials
  if (
    cleanEmail === "admin@shewimy.com" &&
    (cleanPass === "Shewimy@2026" || cleanPass === "admin")
  ) {
    const demoUser = {
      uid: "admin-master",
      email: "admin@shewimy.com",
      displayName: "مدير النظام (الشويمي)",
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("shewimy_admin_session", JSON.stringify(demoUser));
    }
    return { success: true, user: demoUser };
  }

  return { success: false, error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };
}

/**
 * Change Admin Email and synchronize with Firebase Auth, Firestore, and Schema.
 */
export async function changeAdminEmail(
  newEmail: string,
  currentPassword: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  const cleanEmail = newEmail.trim().toLowerCase();
  const cleanPass = currentPassword.trim();

  if (!cleanEmail || !cleanEmail.includes("@") || !cleanEmail.includes(".")) {
    return { success: false, error: "يرجى إدخال بريد إلكتروني صالح" };
  }
  if (!cleanPass) {
    return { success: false, error: "يرجى إدخال كلمة المرور الحالية للتأكيد" };
  }

  // 1. Update via server API (persists to src/data/adminAccount.json and siteSettings.json)
  try {
    const res = await fetch("/api/admin/account", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update_email",
        currentPassword: cleanPass,
        newEmail: cleanEmail,
      }),
    });
    const data = await res.json();
    if (!data.success) {
      return { success: false, error: data.error || "فشل تحديث البريد الإلكتروني" };
    }
  } catch (err: any) {
    return { success: false, error: err?.message || "فشل الاتصال بالخادم" };
  }

  // 2. Synchronize with Firebase Auth if logged in
  const auth = getFirebaseAuth();
  if (auth && auth.currentUser && isFirebaseConfigured()) {
    try {
      const cred = EmailAuthProvider.credential(auth.currentUser.email || cleanEmail, cleanPass);
      await reauthenticateWithCredential(auth.currentUser, cred);
      await updateEmail(auth.currentUser, cleanEmail);
    } catch (fbErr: any) {
      console.warn("Firebase Auth updateEmail warning:", fbErr?.message);
    }
  }

  // 3. Synchronize with Firestore `admins` collection & site settings
  await syncAdminAccountToFirestore({
    uid: auth?.currentUser?.uid || "admin-master",
    email: cleanEmail,
    displayName: "مدير النظام (الشويمي)",
    role: "super_admin",
  });

  // 4. Update local session & notify app components
  if (typeof window !== "undefined") {
    const session = {
      uid: auth?.currentUser?.uid || "admin-master",
      email: cleanEmail,
      displayName: "مدير النظام (الشويمي)",
    };
    localStorage.setItem("shewimy_admin_session", JSON.stringify(session));
    window.dispatchEvent(new CustomEvent("shewimy_admin_updated", { detail: session }));
    window.dispatchEvent(new CustomEvent("shewimy_settings_updated", { detail: { adminEmail: cleanEmail } }));
  }

  return {
    success: true,
    message: "تم تحديث البريد الإلكتروني بنجاح وانعكس في السكيما وفايربيس",
  };
}

/**
 * Change Admin Password and synchronize with Firebase Auth, Firestore, and Schema.
 */
export async function changeAdminPassword(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  const cleanCurrent = currentPassword.trim();
  const cleanNew = newPassword.trim();

  if (!cleanCurrent) {
    return { success: false, error: "يرجى إدخال كلمة المرور الحالية للتأكيد" };
  }
  if (!cleanNew || cleanNew.length < 6) {
    return { success: false, error: "كلمة المرور الجديدة يجب أن لا تقل عن 6 أحرف أو أرقام" };
  }

  // 1. Update via server API (persists to src/data/adminAccount.json)
  try {
    const res = await fetch("/api/admin/account", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update_password",
        currentPassword: cleanCurrent,
        newPassword: cleanNew,
      }),
    });
    const data = await res.json();
    if (!data.success) {
      return { success: false, error: data.error || "فشل تحديث كلمة المرور" };
    }
  } catch (err: any) {
    return { success: false, error: err?.message || "فشل الاتصال بالخادم" };
  }

  // 2. Synchronize with Firebase Auth if logged in
  const auth = getFirebaseAuth();
  if (auth && auth.currentUser && isFirebaseConfigured()) {
    try {
      const cred = EmailAuthProvider.credential(auth.currentUser.email || "", cleanCurrent);
      await reauthenticateWithCredential(auth.currentUser, cred);
      await updatePassword(auth.currentUser, cleanNew);
    } catch (fbErr: any) {
      console.warn("Firebase Auth updatePassword warning:", fbErr?.message);
    }
  }

  // 3. Update Firestore audit timestamp
  await syncAdminAccountToFirestore({
    uid: auth?.currentUser?.uid || "admin-master",
    email: auth?.currentUser?.email || "admin@shewimy.com",
    passwordUpdatedAt: new Date().toISOString(),
  });

  return {
    success: true,
    message: "تم تحديث كلمة المرور بنجاح وحفظها في السكيما وفايربيس",
  };
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
    window.dispatchEvent(new CustomEvent("shewimy_admin_updated", { detail: null }));
  }
}

/**
 * Subscribe to auth state changes.
 */
export function subscribeToAuth(callback: (user: any) => void): () => void {
  // Check local session first
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("shewimy_admin_session");
    if (saved) {
      try {
        callback(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }

  const auth = getFirebaseAuth();
  if (!auth) {
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
