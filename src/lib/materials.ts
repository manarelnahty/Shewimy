import fs from "fs";
import path from "path";
import { MaterialItem } from "@/types/shewimy";
import defaultMaterialsData from "@/data/materials.json";

const MATERIALS_FILE = path.join(process.cwd(), "src", "data", "materials.json");

export const DEFAULT_MATERIALS: MaterialItem[] = defaultMaterialsData as MaterialItem[];

/**
 * Normalizes an Arabic string into a URL-safe, lowercase alphanumeric key/id.
 */
export function slugifyMaterialId(rawText: string): string {
  const trimmed = rawText.trim().toLowerCase();
  const commonMap: Record<string, string> = {
    بولاك: "polylac",
    بولي: "polylac",
    أرو: "massive_oak",
    ارو: "massive_oak",
    زان: "beech_wood",
    جوز: "natural_walnut",
    زجاج: "fume_glass",
    أكريليك: "acrylic",
    اكريليك: "acrylic",
    كونتر: "counter_wood",
    رخام: "marble",
    بورسلين: "porcelain",
    كوارتز: "quartz",
    شبابيك: "upvc",
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

  return `mat_${Date.now().toString(36)}`;
}

/**
 * Reads materials safely from disk, with fallback to default materials.
 */
export function getStoredMaterials(): MaterialItem[] {
  try {
    if (fs.existsSync(MATERIALS_FILE)) {
      const content = fs.readFileSync(MATERIALS_FILE, "utf8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not read materials.json, falling back:", err);
  }

  return DEFAULT_MATERIALS;
}

/**
 * Saves materials safely to disk.
 */
export function saveMaterialsToDisk(materials: MaterialItem[]): boolean {
  try {
    fs.writeFileSync(MATERIALS_FILE, JSON.stringify(materials, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Error writing materials.json:", err);
    return false;
  }
}

/**
 * Adds or updates a material record.
 */
export function addOrUpdateMaterialRecord(payload: {
  id?: string;
  name: string;
  origin?: string;
  description?: string;
  order?: number;
}): { success: boolean; material?: MaterialItem; materials: MaterialItem[]; error?: string } {
  const cleanName = (payload.name || "").trim();
  if (!cleanName) {
    return {
      success: false,
      materials: getStoredMaterials(),
      error: "اسم الخامة مطلوب بالعربية",
    };
  }

  let finalId = (payload.id || "").trim().toLowerCase();
  if (!finalId) {
    finalId = slugifyMaterialId(cleanName);
  }

  finalId = finalId.replace(/[^a-zA-Z0-9_-]/g, "_").replace(/_+/g, "_");
  if (!finalId) {
    finalId = `mat_${Date.now().toString(36)}`;
  }

  const current = getStoredMaterials();
  const existingIdx = current.findIndex((m) => m.id === finalId);

  const materialItem: MaterialItem = {
    id: finalId,
    name: cleanName,
    origin: payload.origin?.trim() || "أوروبي معتمد",
    description: payload.description?.trim() || "",
    isCustom: true,
    order: payload.order ?? (existingIdx >= 0 ? current[existingIdx].order : current.length + 1),
  };

  let updatedList: MaterialItem[];
  if (existingIdx >= 0) {
    updatedList = [...current];
    updatedList[existingIdx] = {
      ...current[existingIdx],
      ...materialItem,
    };
  } else {
    updatedList = [...current, materialItem];
  }

  const saved = saveMaterialsToDisk(updatedList);
  if (!saved) {
    return {
      success: false,
      materials: current,
      error: "فشل حفظ الخامة على القرص",
    };
  }

  return {
    success: true,
    material: materialItem,
    materials: updatedList,
  };
}

/**
 * Deletes a material by ID.
 */
export function deleteMaterialRecord(id: string): {
  success: boolean;
  materials: MaterialItem[];
  error?: string;
} {
  const current = getStoredMaterials();
  const updatedList = current.filter((m) => m.id !== id);

  if (updatedList.length === current.length) {
    return { success: false, materials: current, error: "الخامة غير موجودة" };
  }

  const saved = saveMaterialsToDisk(updatedList);
  if (!saved) {
    return { success: false, materials: current, error: "فشل حذف الخامة" };
  }

  return { success: true, materials: updatedList };
}
