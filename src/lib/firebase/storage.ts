import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  FirebaseStorage,
} from "firebase/storage";
import { firebaseConfig, isFirebaseConfigured, getFirebaseApp } from "./config";

let cachedStorage: FirebaseStorage | null = null;

export function getFirebaseStorage(): FirebaseStorage | null {
  if (!isFirebaseConfigured()) return null;
  if (cachedStorage) return cachedStorage;
  try {
    const app = getFirebaseApp();
    if (!app) return null;
    cachedStorage = getStorage(app);
    return cachedStorage;
  } catch (err) {
    console.warn("Firebase Storage initialization error:", err);
    return null;
  }
}

/**
 * Uploads an image file:
 * 1. Attempts Firebase Storage if configured.
 * 2. Seamlessly falls back to local API storage (/api/upload) which optimizes
 *    via sharp and returns a lightweight /uploads/... static URL (never a massive Base64 Data URL).
 */
export async function uploadImageFile(
  file: File,
  folder: string = "catalog"
): Promise<{ success: boolean; url?: string; error?: string }> {
  const storage = getFirebaseStorage();

  // If Firebase Storage is configured, attempt upload
  if (storage && isFirebaseConfigured()) {
    try {
      const timestamp = Date.now();
      const cleanName = file.name.replace(/[^a-zA-Z0-9_.-]/g, "_");
      const filePath = `${folder}/${timestamp}_${cleanName}`;
      const fileRef = ref(storage, filePath);

      const snapshot = await uploadBytes(fileRef, file, {
        contentType: file.type,
      });

      const downloadUrl = await getDownloadURL(snapshot.ref);
      return { success: true, url: downloadUrl };
    } catch (firebaseErr: any) {
      console.warn("Firebase Storage failed, falling back to local server upload:", firebaseErr?.message);
    }
  }

  // Fallback: Upload to local server /api/upload -> saved to /public/uploads/
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.success && data.url) {
      return { success: true, url: data.url };
    }
    return { success: false, error: data.error || "فشل رفع الصورة عبر الخادم" };
  } catch (err: any) {
    console.error("Local upload error:", err);
    return {
      success: false,
      error: err?.message || "فشل رفع الصورة إلى الخادم",
    };
  }
}

/**
 * Ensures any image URL or legacy Base64 Data URL is converted into a lightweight,
 * permanent static URL (/uploads/...) before writing to Firestore, preventing the
 * 1MB Firestore field size limit error.
 */
export async function ensureStoredUrl(
  urlOrBase64: string,
  name: string = "image"
): Promise<string> {
  if (!urlOrBase64 || typeof urlOrBase64 !== "string") {
    return urlOrBase64 || "";
  }

  // If it's a Base64 data URL, send to /api/upload to convert into a WebP file
  if (urlOrBase64.startsWith("data:image/") || urlOrBase64.length > 2000) {
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64: urlOrBase64, name }),
      });
      const data = await res.json();
      if (data.success && data.url) {
        return data.url;
      }
    } catch (err) {
      console.error("Error converting base64 to stored URL:", err);
    }
  }

  return urlOrBase64;
}
