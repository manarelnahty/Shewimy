import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  FirebaseStorage,
} from "firebase/storage";
import { initializeApp, getApps, getApp } from "firebase/app";
import { firebaseConfig, isFirebaseConfigured } from "./config";

function getFirebaseApp() {
  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  }
  return getApp();
}

let cachedStorage: FirebaseStorage | null = null;

export function getFirebaseStorage(): FirebaseStorage | null {
  if (cachedStorage) return cachedStorage;
  try {
    const app = getFirebaseApp();
    cachedStorage = getStorage(app);
    return cachedStorage;
  } catch (err) {
    console.warn("Firebase Storage initialization error:", err);
    return null;
  }
}

/**
 * Uploads an image file to Firebase Storage under /catalog or custom folder.
 * Returns public download URL.
 */
export async function uploadImageFile(
  file: File,
  folder: string = "catalog"
): Promise<{ success: boolean; url?: string; error?: string }> {
  const storage = getFirebaseStorage();
  if (!storage || !isFirebaseConfigured()) {
    // If Firebase Storage is not configured or offline, convert to data URL for testing/preview
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({ success: true, url: reader.result as string });
      };
      reader.onerror = () => {
        resolve({ success: false, error: "فشل قراءة ملف الصورة" });
      };
      reader.readAsDataURL(file);
    });
  }

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
  } catch (error: any) {
    console.error("Storage upload error:", error);
    return {
      success: false,
      error: error?.message || "حدث خطأ أثناء رفع الصورة إلى السحابة",
    };
  }
}
