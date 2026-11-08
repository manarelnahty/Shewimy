import fs from "fs";
import path from "path";
import { Product, productsData } from "@/data/products";
import { BranchExtended, BRANCHES_LIST } from "@/data/branches";
import { MainSection } from "@/types/shewimy";

const PRODUCTS_FILE = path.join(process.cwd(), "src", "data", "products.json");
const BRANCHES_FILE = path.join(process.cwd(), "src", "data", "branches.json");

/**
 * Server-only utility to fetch products directly from disk.
 * Always returns the absolute latest saved edits immediately with zero delay.
 */
export function getServerProducts(filters?: {
  section?: MainSection;
  branch?: string;
  featuredOnly?: boolean;
}): Product[] {
  let products: Product[] = productsData;
  try {
    if (fs.existsSync(PRODUCTS_FILE)) {
      const content = fs.readFileSync(PRODUCTS_FILE, "utf8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        products = parsed;
      }
    }
  } catch (err) {
    console.error("Error reading products.json in getServerProducts:", err);
  }

  if (filters?.section && (filters.section as string) !== "all") {
    products = products.filter(
      (p) => p.mainSection === filters.section || p.category === filters.section
    );
  }

  if (filters?.featuredOnly) {
    products = products.filter((p) => p.isFeatured || p.featured);
  }

  if (filters?.branch && filters.branch !== "all") {
    products = products.filter((p) => p.branches?.includes(filters.branch as any));
  }

  return products;
}

/**
 * Server-only utility to fetch a single product by section and slug.
 */
export function getServerProductBySlug(
  section: string,
  slug: string
): Product | null {
  const products = getServerProducts();
  const found = products.find(
    (p) =>
      p.slug.toLowerCase() === slug.toLowerCase() &&
      (p.mainSection.toLowerCase() === section.toLowerCase() ||
        p.category.toLowerCase() === section.toLowerCase())
  );
  return found || null;
}

/**
 * Server-only utility to fetch a single product by ID, code, or slug.
 */
export function getServerProductById(id: string): Product | null {
  const products = getServerProducts();
  const found = products.find(
    (p) =>
      p.id.toLowerCase() === id.toLowerCase() ||
      p.code.toLowerCase() === id.toLowerCase() ||
      p.slug.toLowerCase() === id.toLowerCase()
  );
  return found || null;
}

/**
 * Server-only utility to fetch branches directly from disk.
 */
export function getServerBranches(): BranchExtended[] {
  try {
    if (fs.existsSync(BRANCHES_FILE)) {
      const content = fs.readFileSync(BRANCHES_FILE, "utf8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading branches.json in getServerBranches:", err);
  }
  return BRANCHES_LIST;
}
