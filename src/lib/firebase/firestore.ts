import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch,
  Firestore,
} from "firebase/firestore";
import { firebaseConfig, isFirebaseConfigured } from "./config";
import {
  InspectionRequest,
  ShewimyProduct,
  ShowroomBranch,
  MainSection,
  BranchId,
  SiteSettings,
  DEFAULT_SITE_SETTINGS,
} from "@/types/shewimy";
import siteSettingsData from "@/data/siteSettings.json";
import { productsData, Product } from "@/data/products";
import { SHOWROOM_BRANCHES, BRANCHES_LIST, BranchExtended } from "@/data/branches";

// Initialize Firebase App safely for SSR and Client
function getFirebaseApp() {
  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  }
  return getApp();
}

let cachedDb: Firestore | null = null;

export function getDb(): Firestore | null {
  if (cachedDb) return cachedDb;
  try {
    const app = getFirebaseApp();
    cachedDb = getFirestore(app);
    return cachedDb;
  } catch (err) {
    console.warn("Firestore initialization error/skipped:", err);
    return null;
  }
}

/**
 * Normalizes Firestore document data into standard Product entity.
 */
function mapDocToProduct(docId: string, data: Record<string, any>): Product {
  const mainSection = (data.mainSection || data.category || "kitchens") as MainSection;
  const subCategory = data.subCategory || "تصميم مخصص";
  const materials = Array.isArray(data.materials) ? data.materials : [];
  const gallery = Array.isArray(data.galleryImages)
    ? data.galleryImages
    : Array.isArray(data.gallery)
    ? data.gallery
    : [data.coverImage || data.imageUrl];

  return {
    id: docId,
    code: data.code || `SHW-${docId.slice(-3).toUpperCase()}`,
    name: data.title || data.name || "موديل الشويمي",
    title: data.title || data.name,
    slug: data.slug || docId,
    subtitle: data.subtitle || `${subCategory} - جودة استثنائية`,
    category: mainSection,
    mainSection: mainSection,
    categoryLabel: data.categoryLabel || subCategory,
    subCategory: subCategory,
    style: data.style || "modern",
    styleLabel: data.styleLabel || "مودرن حديث",
    material: data.material || "polylac",
    materialLabel: data.materialLabel || materials[0] || "خامات أوروبية معتمدة",
    materials: materials.length > 0 ? materials : ["شاسيه كونتر أوروبي", "لزق ألماني PUR"],
    features: Array.isArray(data.features) ? data.features : [],
    badgePrimary: data.badgePrimary || "تشكيلة الشويمي",
    badgeSecondary: data.badgeSecondary || `ضمان ${data.warrantyYears || 15} سنة`,
    branches: Array.isArray(data.branches) && data.branches.length > 0
      ? data.branches
      : ["mansoura", "mahalla", "samanoud"],
    price: typeof data.basePrice === "number" ? data.basePrice : (typeof data.price === "number" ? data.price : 95000),
    basePrice: data.basePrice ?? data.price ?? null,
    pricingMode: data.pricingMode || "whatsapp_quote",
    status: data.status || "published",
    priceDisplay: data.priceDisplay || (data.basePrice ? `${data.basePrice.toLocaleString()} ج.م` : "طلب مقايسة وتسعير"),
    priceNote: data.priceNote || "السعر يشمل الرفع الهندسي، التصنيع، والتركيب الفندقي",
    description: data.description || "أعمال خشبية ومطابخ حديثة مخصصة وفق أحدث معايير الجودة.",
    specs: Array.isArray(data.specs) ? data.specs : materials,
    imageUrl: data.coverImage || data.imageUrl || "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
    coverImage: data.coverImage || data.imageUrl,
    gallery: gallery,
    galleryImages: gallery,
    dimensions: data.dimensions || "تفصيل حسب أبعاد مساحة العميل بدقة هندسية",
    hardware: data.hardware || "مفصلات ومجاري هيدروليك بلوم نمساوية",
    finish: data.finish || "دهانات وتشطيبات أوروبية معالجة",
    chassis: data.chassis || "كونتر أوروبي مكبوس ألماني",
    leadTime: data.leadTime || "من 25 إلى 35 يوم عمل",
    featured: Boolean(data.isFeatured || data.featured),
    isFeatured: Boolean(data.isFeatured || data.featured),
    warrantyYears: data.warrantyYears || 15,
  };
}

/**
 * Fetch all products dynamically from Firestore `items` collection.
 * Gracefully falls back to authoritative local products if offline or unseeded.
 */
export async function fetchProducts(filters?: {
  section?: MainSection;
  branch?: string;
  featuredOnly?: boolean;
}): Promise<Product[]> {
  // 1. Authoritative Firestore read when Firebase is configured
  const db = getDb();
  if (db && isFirebaseConfigured()) {
    try {
      const itemsRef = collection(db, "items");
      let q = query(itemsRef, where("status", "==", "published"));

      if (filters?.section) {
        q = query(q, where("mainSection", "==", filters.section));
      }

      if (filters?.featuredOnly) {
        q = query(q, where("isFeatured", "==", true));
      }

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        let liveProducts = snapshot.docs.map((docSnap) =>
          mapDocToProduct(docSnap.id, docSnap.data())
        );

        if (filters?.branch && filters.branch !== "all") {
          liveProducts = liveProducts.filter((p) =>
            p.branches.includes(filters.branch as any)
          );
        }

        return liveProducts;
      }
    } catch (err) {
      console.warn("Firestore fetchProducts returned error, using fallback:", err);
    }
  }

  // 2. Fetch from /api/products fallback (persisted to disk at src/data/products.json)
  if (typeof window !== "undefined") {
    try {
      const params = new URLSearchParams();
      if (filters?.section) params.set("section", filters.section);
      if (filters?.branch) params.set("branch", filters.branch);
      if (filters?.featuredOnly) params.set("featuredOnly", "true");
      params.set("_t", Date.now().toString());

      const res = await fetch(`/api/products?${params.toString()}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          return data.products;
        }
      }
    } catch (apiErr) {
      console.warn("Could not fetch /api/products:", apiErr);
    }
  }

  // Graceful Local Fallback Data (DRD matrix)
  let fallback = [...productsData];

  if (filters?.section) {
    fallback = fallback.filter((p) => p.mainSection === filters.section);
  }

  if (filters?.featuredOnly) {
    fallback = fallback.filter((p) => p.isFeatured || p.featured);
  }

  if (filters?.branch && filters.branch !== "all") {
    fallback = fallback.filter((p) =>
      p.branches.includes(filters.branch as any)
    );
  }

  return fallback;
}

/**
 * Fetch a single product dynamically by slug and section.
 */
export async function fetchProductBySlug(
  section: string,
  slug: string
): Promise<Product | null> {
  const db = getDb();

  if (db && isFirebaseConfigured()) {
    try {
      const itemsRef = collection(db, "items");
      const q = query(itemsRef, where("slug", "==", slug));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const docSnap = snapshot.docs[0];
        return mapDocToProduct(docSnap.id, docSnap.data());
      }
    } catch (err) {
      console.warn("Firestore fetchProductBySlug error, using fallback:", err);
    }
  }

  // Local fallback lookup
  const localProduct = productsData.find(
    (p) =>
      p.slug.toLowerCase() === slug.toLowerCase() &&
      (p.mainSection.toLowerCase() === section.toLowerCase() ||
        p.category.toLowerCase() === section.toLowerCase())
  );

  return localProduct || null;
}

/**
 * Fetch a single product by ID, code or slug.
 */
export async function fetchProductById(id: string): Promise<Product | null> {
  const db = getDb();

  if (db && isFirebaseConfigured()) {
    try {
      const docRef = doc(db, "items", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return mapDocToProduct(docSnap.id, docSnap.data());
      }

      // Check by code or slug
      const itemsRef = collection(db, "items");
      const qCode = query(itemsRef, where("code", "==", id));
      const snapCode = await getDocs(qCode);
      if (!snapCode.empty) {
        return mapDocToProduct(snapCode.docs[0].id, snapCode.docs[0].data());
      }
    } catch (err) {
      console.warn("Firestore fetchProductById error, using fallback:", err);
    }
  }

  // Local fallback
  const local = productsData.find(
    (p) =>
      p.id.toLowerCase() === id.toLowerCase() ||
      p.code.toLowerCase() === id.toLowerCase() ||
      p.slug.toLowerCase() === id.toLowerCase()
  );

  return local || null;
}

/**
 * Fetch branches dynamically:
 * 1. Reads from /api/branches (persisted to disk at src/data/branches.json).
 * 2. Checks Firestore if configured.
 * 3. Fallback to localStorage or BRANCHES_LIST.
 */
export async function fetchBranches(): Promise<BranchExtended[]> {
  // 1. Check Firestore first if configured
  const db = getDb();
  if (db && isFirebaseConfigured()) {
    try {
      const branchesRef = collection(db, "branches");
      const snapshot = await getDocs(branchesRef);

      if (!snapshot.empty) {
        const liveBranches = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          const branchId = docSnap.id as BranchId;
          const fallbackBranch = SHOWROOM_BRANCHES[branchId] || SHOWROOM_BRANCHES.mansoura;

          return {
            id: branchId,
            name: data.name || fallbackBranch.name,
            address: data.address || fallbackBranch.address,
            phones: Array.isArray(data.phones) ? data.phones : fallbackBranch.phones,
            whatsappNumber: data.whatsappNumber || fallbackBranch.whatsappNumber,
            googleMapsUrl: data.googleMapsUrl || fallbackBranch.googleMapsUrl,
            workingHours: data.workingHours || fallbackBranch.workingHours,
            badge: data.badge || fallbackBranch.badge,
            regionServed: data.regionServed || fallbackBranch.regionServed,
          };
        });
        if (typeof window !== "undefined") {
          localStorage.setItem("shewimy_branches", JSON.stringify(liveBranches));
        }
        return liveBranches;
      }
    } catch (err) {
      console.warn("Firestore fetchBranches error, using fallback:", err);
    }
  }

  // 2. Fetch fresh branches from /api/branches fallback
  if (typeof window !== "undefined") {
    try {
      const res = await fetch(`/api/branches?_t=${Date.now()}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.branches) && data.branches.length > 0) {
          localStorage.setItem("shewimy_branches", JSON.stringify(data.branches));
          return data.branches;
        }
      }
    } catch (apiErr) {
      console.warn("Could not fetch /api/branches:", apiErr);
    }
  }

  // 3. Fallback to localStorage if offline
  if (typeof window !== "undefined") {
    try {
      const local = localStorage.getItem("shewimy_branches");
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
  }

  return BRANCHES_LIST;
}

/**
 * Creates a new inspection request:
 * 1. Persists to /api/requests (saved to src/data/requests.json on disk).
 * 2. Broadcasts 'shewimy_requests_updated' event for instant multi-tab sync.
 * 3. Persists to Firestore if configured.
 */
export async function createInspectionRequest(
  data: Omit<InspectionRequest, "id" | "createdAt" | "status">
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    let createdId = `req-${Date.now()}`;

    // 1. Persist to /api/requests
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/requests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const resData = await res.json();
          if (resData.request?.id) {
            createdId = resData.request.id;
          }
        }
        window.dispatchEvent(new CustomEvent("shewimy_requests_updated"));
      } catch (apiErr) {
        console.warn("Could not save to /api/requests:", apiErr);
      }
    }

    // 2. Persist to Firestore if configured
    const db = getDb();
    if (db && isFirebaseConfigured()) {
      try {
        const docRef = await addDoc(collection(db, "inspection_requests"), {
          clientName: data.clientName.trim(),
          phoneNumber: data.phoneNumber.trim(),
          selectedBranch: data.selectedBranch,
          requestedService: data.requestedService,
          customerNotes: data.customerNotes?.trim() || "",
          status: "new",
          createdAt: serverTimestamp(),
        });
        createdId = docRef.id;
      } catch (fsErr) {
        console.warn("Firestore inspection request warning:", fsErr);
      }
    }

    return { success: true, id: createdId };
  } catch (error) {
    console.error("Error creating inspection request:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Seeds Firestore with the initial authoritative DRD data for `items` and `branches`.
 */
export async function seedFirestore(): Promise<{
  success: boolean;
  seededItems: number;
  seededBranches: number;
  seededSettings?: boolean;
  seededAdmin?: boolean;
  message: string;
}> {
  const db = getDb();
  if (!db) {
    return {
      success: false,
      seededItems: 0,
      seededBranches: 0,
      message: "Firebase is not configured or initialized.",
    };
  }

  try {
    const batch = writeBatch(db);

    // 1. Seed Branches (DRD Section 4)
    for (const branch of BRANCHES_LIST) {
      const branchRef = doc(db, "branches", branch.id);
      batch.set(
        branchRef,
        {
          id: branch.id,
          name: branch.name,
          address: branch.address,
          phones: branch.phones,
          whatsappNumber: branch.whatsappNumber,
          googleMapsUrl: branch.googleMapsUrl,
          workingHours: branch.workingHours,
          badge: branch.badge,
          regionServed: branch.regionServed,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }

    // 2. Seed Items / Products (DRD Section 2 & 3)
    for (const product of productsData) {
      const itemRef = doc(db, "items", product.id);
      batch.set(
        itemRef,
        {
          id: product.id,
          code: product.code,
          title: product.name,
          slug: product.slug,
          mainSection: product.mainSection,
          subCategory: product.subCategory,
          materials: product.materials,
          features: product.features || [],
          coverImage: product.imageUrl,
          galleryImages: product.gallery,
          warrantyYears: product.warrantyYears,
          isFeatured: product.isFeatured ?? product.featured,
          status: product.status || "published",
          pricingMode: product.pricingMode,
          basePrice: product.basePrice,
          priceDisplay: product.priceDisplay,
          priceNote: product.priceNote,
          description: product.description,
          dimensions: product.dimensions,
          hardware: product.hardware,
          finish: product.finish,
          chassis: product.chassis,
          leadTime: product.leadTime,
          branches: product.branches,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }

    // 3. Seed Site Settings (DRD Section 1 & 7)
    const settingsRef = doc(db, "site_settings", "general");
    batch.set(
      settingsRef,
      {
        ...siteSettingsData,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    // 4. Seed Super Admin Account profile (DRD Section 8)
    const adminRef = doc(db, "admins", "admin-master");
    batch.set(
      adminRef,
      {
        uid: "admin-master",
        email: "admin@shewimy.com",
        displayName: "مدير النظام (الشويمي)",
        role: "super_admin",
        status: "active",
        permissions: [
          "all",
          "manage_catalog",
          "manage_branches",
          "manage_requests",
          "manage_settings",
        ],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    await batch.commit();

    return {
      success: true,
      seededItems: productsData.length,
      seededBranches: BRANCHES_LIST.length,
      seededSettings: true,
      seededAdmin: true,
      message:
        "Firestore collections (items, branches, site_settings, admins) seeded successfully with DRD data.",
    };
  } catch (error) {
    console.error("Error seeding Firestore:", error);
    return {
      success: false,
      seededItems: 0,
      seededBranches: 0,
      message: error instanceof Error ? error.message : "Error seeding Firestore",
    };
  }
}

/**
 * Fetch all products for Admin panel (including drafts and archived items).
 */
export async function fetchAllProductsAdmin(): Promise<Product[]> {
  // 1. Check Firestore first if configured
  const db = getDb();
  if (db && isFirebaseConfigured()) {
    try {
      const itemsRef = collection(db, "items");
      const snapshot = await getDocs(itemsRef);
      if (!snapshot.empty) {
        return snapshot.docs.map((docSnap) =>
          mapDocToProduct(docSnap.id, docSnap.data())
        );
      }
    } catch (err) {
      console.warn("Firestore fetchAllProductsAdmin error, falling back:", err);
    }
  }

  // 2. Fallback to /api/products
  if (typeof window !== "undefined") {
    try {
      const res = await fetch(`/api/products?_t=${Date.now()}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          return data.products;
        }
      }
    } catch (apiErr) {
      console.warn("Could not fetch /api/products for admin:", apiErr);
    }
  }

  return [...productsData];
}

/**
 * Create or add a new product.
 * 1. Persists to /api/products (saved to disk at src/data/products.json).
 * 2. Broadcasts 'shewimy_products_updated' event.
 * 3. Persists to Firestore if configured.
 */
export async function createProduct(
  data: Partial<Product>
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const docId = data.id || `prod-${Date.now()}`;
    const slug =
      data.slug ||
      (data.name || "item")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") ||
      docId;

    // 1. Persist to /api/products
    if (typeof window !== "undefined") {
      try {
        await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, id: docId, slug }),
        });
        window.dispatchEvent(new CustomEvent("shewimy_products_updated"));
      } catch (apiErr) {
        console.warn("Could not save to /api/products:", apiErr);
      }
    }

    // 2. Persist to Firestore if available
    const db = getDb();
    if (db && isFirebaseConfigured()) {
      try {
        const itemRef = doc(db, "items", docId);
        const payload = {
          ...data,
          id: docId,
          slug,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        await setDoc(itemRef, payload, { merge: true });
      } catch (fsErr) {
        console.warn("Firestore setDoc product warning:", fsErr);
      }
    }

    return { success: true, id: docId };
  } catch (error: any) {
    console.error("Error creating product:", error);
    return { success: false, error: error?.message || "فشل إضافة المنتج" };
  }
}

/**
 * Update existing product.
 * 1. Persists to /api/products (saved to disk at src/data/products.json).
 * 2. Broadcasts 'shewimy_products_updated' event.
 * 3. Persists to Firestore if configured.
 */
export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Persist to /api/products
    if (typeof window !== "undefined") {
      try {
        await fetch("/api/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, ...updates }),
        });
        window.dispatchEvent(new CustomEvent("shewimy_products_updated"));
      } catch (apiErr) {
        console.warn("Could not update /api/products:", apiErr);
      }
    }

    // 2. Persist to Firestore if available
    const db = getDb();
    if (db && isFirebaseConfigured()) {
      try {
        const itemRef = doc(db, "items", id);
        const payload: Record<string, any> = {
          ...updates,
          updatedAt: serverTimestamp(),
        };
        if (updates.name !== undefined) payload.title = updates.name;
        if (updates.title !== undefined) payload.title = updates.title;
        if (updates.coverImage !== undefined) payload.imageUrl = updates.coverImage;
        if (updates.galleryImages !== undefined) payload.gallery = updates.galleryImages;

        await updateDoc(itemRef, payload);
      } catch (fsErr) {
        console.warn("Firestore updateDoc product warning:", fsErr);
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error updating product:", error);
    return { success: false, error: error?.message || "فشل تحديث المنتج" };
  }
}

/**
 * Delete product.
 * 1. Persists deletion to /api/products.
 * 2. Broadcasts 'shewimy_products_updated' event.
 * 3. Persists to Firestore if configured.
 */
export async function deleteProduct(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Delete from /api/products
    if (typeof window !== "undefined") {
      try {
        await fetch(`/api/products?id=${encodeURIComponent(id)}`, {
          method: "DELETE",
        });
        window.dispatchEvent(new CustomEvent("shewimy_products_updated"));
      } catch (apiErr) {
        console.warn("Could not delete from /api/products:", apiErr);
      }
    }

    // 2. Delete from Firestore if available
    const db = getDb();
    if (db && isFirebaseConfigured()) {
      try {
        const itemRef = doc(db, "items", id);
        await deleteDoc(itemRef);
      } catch (fsErr) {
        console.warn("Firestore deleteDoc product warning:", fsErr);
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return { success: false, error: error?.message || "فشل حذف المنتج" };
  }
}

/**
 * Fetch all inspection requests for Admin:
 * 1. Reads from /api/requests (persisted to src/data/requests.json on disk).
 * 2. Checks Firestore if configured.
 */
export async function fetchInspectionRequests(): Promise<InspectionRequest[]> {
  // 1. Authoritative Firestore read when configured
  const db = getDb();
  if (db && isFirebaseConfigured()) {
    try {
      const colRef = collection(db, "inspection_requests");
      const q = query(colRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<InspectionRequest, "id">),
        }));
      }
    } catch (err) {
      console.warn("Error fetching inspection requests with orderBy:", err);
      try {
        const colRef = collection(db, "inspection_requests");
        const snapshot = await getDocs(colRef);
        if (!snapshot.empty) {
          return snapshot.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<InspectionRequest, "id">),
          }));
        }
      } catch (e) {
        console.warn("Fallback query error:", e);
      }
    }
  }

  // 2. Fallback to /api/requests
  if (typeof window !== "undefined") {
    try {
      const res = await fetch(`/api/requests?_t=${Date.now()}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.requests)) {
          return data.requests;
        }
      }
    } catch (apiErr) {
      console.warn("Could not fetch /api/requests:", apiErr);
    }
  }

  return [];
}

/**
 * Update inspection request status (new, contacted, visit_scheduled, deal_closed).
 */
export async function updateInspectionRequestStatus(
  id: string,
  status: InspectionRequest["status"]
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Persist to /api/requests
    if (typeof window !== "undefined") {
      try {
        await fetch("/api/requests", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status }),
        });
        window.dispatchEvent(new CustomEvent("shewimy_requests_updated"));
      } catch (apiErr) {
        console.warn("Could not update /api/requests:", apiErr);
      }
    }

    // 2. Persist to Firestore if configured
    const db = getDb();
    if (db && isFirebaseConfigured()) {
      try {
        const docRef = doc(db, "inspection_requests", id);
        await updateDoc(docRef, {
          status,
          updatedAt: serverTimestamp(),
        });
      } catch (fsErr) {
        console.warn("Firestore updateDoc request warning:", fsErr);
      }
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "فشل تحديث حالة الطلب" };
  }
}

/**
 * Delete inspection request.
 */
export async function deleteInspectionRequest(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Delete from /api/requests
    if (typeof window !== "undefined") {
      try {
        await fetch(`/api/requests?id=${encodeURIComponent(id)}`, {
          method: "DELETE",
        });
        window.dispatchEvent(new CustomEvent("shewimy_requests_updated"));
      } catch (apiErr) {
        console.warn("Could not delete from /api/requests:", apiErr);
      }
    }

    // 2. Delete from Firestore if configured
    const db = getDb();
    if (db && isFirebaseConfigured()) {
      try {
        const docRef = doc(db, "inspection_requests", id);
        await deleteDoc(docRef);
      } catch (fsErr) {
        console.warn("Firestore deleteDoc request warning:", fsErr);
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting request:", error);
    return { success: false, error: error?.message || "فشل حذف الطلب" };
  }
}

/**
 * Update branch details:
 * 1. Persists to /api/branches (saved to src/data/branches.json on disk).
 * 2. Updates browser localStorage and broadcasts 'shewimy_branches_updated' custom event.
 * 3. Persists to Firestore if db is available.
 */
export async function updateBranch(
  branchId: BranchId,
  data: Partial<ShowroomBranch>
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. In browser, save to localStorage and broadcast event for instant multi-tab sync
    if (typeof window !== "undefined") {
      try {
        const existing = localStorage.getItem("shewimy_branches");
        const prev: BranchExtended[] = existing ? JSON.parse(existing) : BRANCHES_LIST;
        const updated = prev.map((b) => (b.id === branchId ? { ...b, ...data } : b));
        localStorage.setItem("shewimy_branches", JSON.stringify(updated));
        window.dispatchEvent(
          new CustomEvent("shewimy_branches_updated", {
            detail: { branchId, data, branches: updated },
          })
        );
      } catch (storageErr) {
        console.warn("localStorage branch save error:", storageErr);
      }

      // 2. Persist to server /api/branches
      try {
        await fetch("/api/branches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ branchId, ...data }),
        });
      } catch (apiErr) {
        console.warn("Could not save to /api/branches:", apiErr);
      }
    }

    // 3. Persist to Firestore if available
    const db = getDb();
    if (db && isFirebaseConfigured()) {
      try {
        const docRef = doc(db, "branches", branchId);
        await setDoc(
          docRef,
          {
            ...data,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (fsErr) {
        console.warn("Firestore setDoc branch warning:", fsErr);
      }
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "فشل تحديث بيانات الفرع" };
  }
}

/**
 * Fetch dynamic site settings from Firestore (site_settings/general).
 */
/**
 * Fetch dynamic site settings:
 * 1. Reads from /api/settings (which persists to src/data/siteSettings.json).
 * 2. In browser, checks localStorage for instant zero-latency cache.
 * 3. Checks Firestore if configured.
 * 4. Gracefully defaults to DEFAULT_SITE_SETTINGS.
 */
export async function fetchSiteSettings(): Promise<SiteSettings> {
  // 1. Authoritative Firestore read when configured
  const db = getDb();
  if (db && isFirebaseConfigured()) {
    try {
      const docRef = doc(db, "site_settings", "general");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as Partial<SiteSettings>;
        const merged: SiteSettings = {
          ...DEFAULT_SITE_SETTINGS,
          ...data,
          heroStats: {
            ...DEFAULT_SITE_SETTINGS.heroStats,
            ...(data.heroStats || {}),
          },
          trustBarItems:
            data.trustBarItems && data.trustBarItems.length > 0
              ? data.trustBarItems
              : DEFAULT_SITE_SETTINGS.trustBarItems,
          processSteps:
            data.processSteps && data.processSteps.length > 0
              ? data.processSteps
              : DEFAULT_SITE_SETTINGS.processSteps,
          id: docSnap.id,
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("shewimy_site_settings", JSON.stringify(merged));
        }
        return merged;
      }
    } catch (err) {
      console.warn("fetchSiteSettings Firestore error:", err);
    }
  }

  // 2. Fetch fresh authoritative settings from /api/settings fallback
  if (typeof window !== "undefined") {
    try {
      const res = await fetch(`/api/settings?_t=${Date.now()}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.settings) {
          localStorage.setItem("shewimy_site_settings", JSON.stringify(data.settings));
          return data.settings;
        }
      }
    } catch (apiErr) {
      console.warn("Could not fetch /api/settings:", apiErr);
    }
  }

  // 3. Fallback to localStorage if network/API failed
  if (typeof window !== "undefined") {
    try {
      const local = localStorage.getItem("shewimy_site_settings");
      if (local) {
        const parsed = JSON.parse(local);
        if (parsed && typeof parsed === "object") {
          return {
            ...DEFAULT_SITE_SETTINGS,
            ...parsed,
            heroStats: {
              ...DEFAULT_SITE_SETTINGS.heroStats,
              ...(parsed.heroStats || {}),
            },
            trustBarItems:
              parsed.trustBarItems && parsed.trustBarItems.length > 0
                ? parsed.trustBarItems
                : DEFAULT_SITE_SETTINGS.trustBarItems,
            processSteps:
              parsed.processSteps && parsed.processSteps.length > 0
                ? parsed.processSteps
                : DEFAULT_SITE_SETTINGS.processSteps,
          };
        }
      }
    } catch {
      // ignore
    }
  }

  return (siteSettingsData as unknown as SiteSettings) || DEFAULT_SITE_SETTINGS;
}

/**
 * Update dynamic site settings:
 * 1. Persists to /api/settings (saved to src/data/siteSettings.json).
 * 2. Updates browser localStorage and broadcasts 'shewimy_settings_updated' custom event.
 * 3. Persists to Firestore if db is available.
 */
export async function updateSiteSettings(
  settings: Partial<SiteSettings>
): Promise<{ success: boolean; error?: string }> {
  try {
    const sanitized: Record<string, any> = { ...settings };

    // Deep check for oversized string payloads (like raw base64 data URLs > 1MB)
    for (const [key, val] of Object.entries(sanitized)) {
      if (typeof val === "string" && val.length > 500000) {
        return {
          success: false,
          error: `حجم الصورة في (${key}) كبير جداً كـ Base64، يرجى إعادة رفعها عبر زر الرفع لتتحول لمسار ملف.`,
        };
      }
    }

    // 1. In browser, save to localStorage and broadcast event for instant multi-tab sync
    if (typeof window !== "undefined") {
      try {
        const existing = localStorage.getItem("shewimy_site_settings");
        const prev = existing ? JSON.parse(existing) : DEFAULT_SITE_SETTINGS;
        const merged = { ...prev, ...sanitized };
        localStorage.setItem("shewimy_site_settings", JSON.stringify(merged));
        window.dispatchEvent(
          new CustomEvent("shewimy_settings_updated", { detail: merged })
        );
      } catch (storageErr) {
        console.warn("localStorage save error:", storageErr);
      }

      // 2. Persist to server /api/settings
      try {
        await fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sanitized),
        });
      } catch (apiErr) {
        console.warn("Could not save to /api/settings:", apiErr);
      }
    }

    // 3. Persist to Firestore if available
    const db = getDb();
    if (db) {
      try {
        const docRef = doc(db, "site_settings", "general");
        await setDoc(
          docRef,
          {
            ...sanitized,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (fsErr) {
        console.warn("Firestore setDoc warning:", fsErr);
      }
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "فشل تحديث إعدادات الموقع" };
  }
}

/**
 * Sync Admin Account to Firestore `admins` collection & `settings/site`
 */
export async function syncAdminAccountToFirestore(account: {
  uid?: string;
  email: string;
  displayName?: string;
  role?: string;
  passwordUpdatedAt?: string;
}): Promise<{ success: boolean; error?: string }> {
  const db = getDb();
  if (!db) {
    return { success: true };
  }
  try {
    const adminRef = doc(db, "admins", account.uid || "admin-master");
    await setDoc(
      adminRef,
      {
        uid: account.uid || "admin-master",
        email: account.email,
        displayName: account.displayName || "مدير النظام (الشويمي)",
        role: account.role || "super_admin",
        updatedAt: serverTimestamp(),
        ...(account.passwordUpdatedAt ? { passwordUpdatedAt: account.passwordUpdatedAt } : {}),
      },
      { merge: true }
    );

    // Also sync adminEmail into settings collection
    try {
      const settingsRef = doc(db, "site_settings", "general");
      await setDoc(settingsRef, { adminEmail: account.email, updatedAt: serverTimestamp() }, { merge: true });
    } catch {
      // ignore
    }

    return { success: true };
  } catch (err: any) {
    console.warn("Firestore syncAdminAccount error:", err);
    return { success: false, error: err?.message };
  }
}

