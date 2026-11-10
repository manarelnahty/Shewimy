import fs from "fs";
import path from "path";
import { CategoryInfo } from "@/types/shewimy";

const CATEGORIES_FILE = path.join(process.cwd(), "src", "data", "categories.json");
const PRODUCTS_FILE = path.join(process.cwd(), "src", "data", "products.json");

/**
 * Authoritative 5 DRD core categories built into the Shewimy architectural framework.
 */
export const CORE_CATEGORIES: CategoryInfo[] = [
  {
    key: "kitchens",
    labelAr: "المطابخ الحديثة والميكانزم",
    sharePercent: "60%",
    isCustom: false,
    subCategories: [
      "بولاك مودرن",
      "نيو كلاسيك خشب أرو",
      "عصري HPL",
      "ألمنيوم حديث / كلادينج",
      "مطابخ آيلاند (Island)",
    ],
  },
  {
    key: "dressing_rooms",
    labelAr: "الدريسينج ووحدات التخزين",
    sharePercent: "15%",
    isCustom: false,
    subCategories: [
      "غرف ملابس متكاملة (Walk-in)",
      "دواليب زجاج بروفايل إيطالي",
      "وحدات تخزين مدمجة للمساحات المحدودة",
    ],
  },
  {
    key: "furniture",
    labelAr: "الأثاث المنزلي الراقي",
    sharePercent: "10%",
    isCustom: false,
    subCategories: [
      "غرف نوم رئيسية",
      "غرف سفرة مودرن",
      "طاولات طعام خشب طبيعي",
      "صالونات وأنتريهات نيو كلاسيك",
    ],
  },
  {
    key: "decor",
    labelAr: "الديكورات وتجاليد الحوائط",
    sharePercent: "10%",
    isCustom: false,
    subCategories: [
      "بانوهات بديل خشب ورخام",
      "وحدات تلفزيون جدارية (TV Units)",
      "بارتشن خشب فواصل صالات",
    ],
  },
  {
    key: "windows",
    labelAr: "الشبابيك والقطاعات",
    sharePercent: "5%",
    isCustom: false,
    subCategories: [
      "شبابيك بي في سي (UPVC)",
      "قطاعات ألمنيوم عازل",
      "شبابيك خشب شتر مدمج",
    ],
  },
];

export const DEFAULT_CATEGORIES: CategoryInfo[] = [...CORE_CATEGORIES];

/**
 * Normalizes an Arabic string into a URL-safe, alphanumeric slug.
 */
export function slugifyCategoryKey(rawText: string): string {
  const trimmed = rawText.trim().toLowerCase();
  const commonMap: Record<string, string> = {
    مطابخ: "kitchens",
    دريسينج: "dressing_rooms",
    أثاث: "furniture",
    اثاث: "furniture",
    ديكور: "decor",
    ديكورات: "decor",
    شبابيك: "windows",
    أبواب: "doors",
    ابواب: "doors",
    تجليد: "wall_cladding",
    تجاليد: "wall_cladding",
    برجولات: "pergolas",
    حمامات: "bathrooms",
    مكاتب: "offices",
  };

  for (const [ar, en] of Object.entries(commonMap)) {
    if (trimmed.includes(ar)) {
      return en;
    }
  }

  const clean = trimmed
    .replace(/[^\u0600-\u06FFa-zA-Z0-9_\s-]/g, "")
    .trim()
    .replace(/\s+/g, "_");

  if (/^[a-zA-Z0-9_-]+$/.test(clean) && clean.length > 0) {
    return clean;
  }

  return `cat_${Date.now().toString(36)}`;
}

/**
 * Server-side loader: Returns all categories from disk, guaranteeing core sections exist.
 */
export function getStoredCategories(): CategoryInfo[] {
  let list: CategoryInfo[] = [...CORE_CATEGORIES];

  try {
    if (fs.existsSync(CATEGORIES_FILE)) {
      const content = fs.readFileSync(CATEGORIES_FILE, "utf8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        list = parsed;
      }
    }
  } catch (err) {
    console.error("Error reading categories.json:", err);
  }

  // Ensure core categories are always present if missing
  const existingKeys = new Set(list.map((c) => c.key));
  for (const def of CORE_CATEGORIES) {
    if (!existingKeys.has(def.key)) {
      list.push(def);
      existingKeys.add(def.key);
    }
  }

  return list;
}

/**
 * Saves categories safely to disk.
 */
export function saveCategoriesToDisk(categories: CategoryInfo[]): boolean {
  try {
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Error writing categories.json:", err);
    return false;
  }
}

/**
 * Adds a new custom category.
 */
export function addCategoryRecord(newCat: {
  key?: string;
  labelAr: string;
  sharePercent?: string;
}): { success: boolean; category?: CategoryInfo; categories: CategoryInfo[]; error?: string } {
  const cleanLabel = (newCat.labelAr || "").trim();
  if (!cleanLabel) {
    return {
      success: false,
      categories: getStoredCategories(),
      error: "اسم القسم مطلوب بالعربية",
    };
  }

  let finalKey = (newCat.key || "").trim().toLowerCase();
  if (!finalKey) {
    finalKey = slugifyCategoryKey(cleanLabel);
  }

  finalKey = finalKey.replace(/[^a-zA-Z0-9_-]/g, "_").replace(/_+/g, "_");
  if (!finalKey) {
    finalKey = `cat_${Date.now().toString(36)}`;
  }

  const current = getStoredCategories();
  const existingIdx = current.findIndex((c) => c.key === finalKey);

  const categoryItem: CategoryInfo = {
    key: finalKey,
    labelAr: cleanLabel,
    sharePercent: newCat.sharePercent?.trim() || "تصنيف مخصص",
    isCustom: !CORE_CATEGORIES.some((c) => c.key === finalKey),
    subCategories: ["تصميم مخصص", "تنفيذ حسب الطلب"],
  };

  if (existingIdx !== -1) {
    current[existingIdx] = { ...current[existingIdx], ...categoryItem };
  } else {
    current.push(categoryItem);
  }

  saveCategoriesToDisk(current);

  return {
    success: true,
    category: categoryItem,
    categories: current,
  };
}

/**
 * Updates an existing category (label, share percent, subCategories).
 */
export function updateCategoryRecord(
  key: string,
  updates: {
    labelAr?: string;
    sharePercent?: string;
    subCategories?: string[];
  }
): { success: boolean; category?: CategoryInfo; categories: CategoryInfo[]; error?: string } {
  const current = getStoredCategories();
  const idx = current.findIndex((c) => c.key === key);

  if (idx === -1) {
    return {
      success: false,
      categories: current,
      error: "القسم المطلوب تعديله غير موجود",
    };
  }

  const updated: CategoryInfo = {
    ...current[idx],
    ...(updates.labelAr && updates.labelAr.trim()
      ? { labelAr: updates.labelAr.trim() }
      : {}),
    ...(updates.sharePercent !== undefined
      ? { sharePercent: updates.sharePercent.trim() }
      : {}),
    ...(Array.isArray(updates.subCategories)
      ? { subCategories: updates.subCategories }
      : {}),
  };

  current[idx] = updated;
  saveCategoriesToDisk(current);

  return {
    success: true,
    category: updated,
    categories: current,
  };
}

/**
 * Deletes a category by key.
 * Core kitchen section is protected. Any products referencing the deleted category
 * are safely reassigned to 'kitchens'.
 */
export function deleteCategoryRecord(
  key: string
): { success: boolean; categories: CategoryInfo[]; error?: string } {
  if (key === "kitchens") {
    return {
      success: false,
      categories: getStoredCategories(),
      error: "لا يمكن حذف قسم المطابخ الأساسي لأنه الركيزة الرئيسية للمصنع",
    };
  }

  let current = getStoredCategories();
  const exists = current.some((c) => c.key === key);
  if (!exists) {
    return {
      success: false,
      categories: current,
      error: "القسم غير موجود بالفعل",
    };
  }

  current = current.filter((c) => c.key !== key);
  saveCategoriesToDisk(current);

  // Reassign any products referencing this key
  try {
    if (fs.existsSync(PRODUCTS_FILE)) {
      const pContent = fs.readFileSync(PRODUCTS_FILE, "utf8");
      const products = JSON.parse(pContent);
      if (Array.isArray(products)) {
        let changed = false;
        for (const p of products) {
          if (p.mainSection === key || p.category === key) {
            p.mainSection = "kitchens";
            p.category = "kitchens";
            p.categoryLabel = "المطابخ الحديثة والميكانزم";
            changed = true;
          }
        }
        if (changed) {
          fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf8");
        }
      }
    }
  } catch (pErr) {
    console.warn("Could not reassign products on category delete:", pErr);
  }

  return {
    success: true,
    categories: current,
  };
}
