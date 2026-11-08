import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  query,
  where,
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
} from "@/types/shewimy";
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
 * Fetch branches dynamically from Firestore `branches` collection (DRD Section 4).
 */
export async function fetchBranches(): Promise<BranchExtended[]> {
  const db = getDb();

  if (db && isFirebaseConfigured()) {
    try {
      const branchesRef = collection(db, "branches");
      const snapshot = await getDocs(branchesRef);

      if (!snapshot.empty) {
        return snapshot.docs.map((docSnap) => {
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
      }
    } catch (err) {
      console.warn("Firestore fetchBranches error, using fallback:", err);
    }
  }

  return BRANCHES_LIST;
}

/**
 * Creates a new inspection request in Firestore collection `inspection_requests` (DRD Section 6).
 */
export async function createInspectionRequest(
  data: Omit<InspectionRequest, "id" | "createdAt" | "status">
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const db = getDb();
    if (!db || !isFirebaseConfigured()) {
      return { success: true, id: `local-${Date.now()}` };
    }

    const docRef = await addDoc(collection(db, "inspection_requests"), {
      clientName: data.clientName.trim(),
      phoneNumber: data.phoneNumber.trim(),
      selectedBranch: data.selectedBranch,
      requestedService: data.requestedService,
      customerNotes: data.customerNotes?.trim() || "",
      status: "new",
      createdAt: serverTimestamp(),
    });

    return { success: true, id: docRef.id };
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

    await batch.commit();

    return {
      success: true,
      seededItems: productsData.length,
      seededBranches: BRANCHES_LIST.length,
      message: "Firestore collections (items, branches) seeded successfully with DRD data.",
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
