import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Product, productsData } from "@/data/products";

const PRODUCTS_FILE = path.join(process.cwd(), "src", "data", "products.json");

function getStoredProducts(): Product[] {
  try {
    if (fs.existsSync(PRODUCTS_FILE)) {
      const content = fs.readFileSync(PRODUCTS_FILE, "utf8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading products.json:", err);
  }
  return productsData;
}

function saveProducts(products: Product[]): boolean {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Error writing products.json:", err);
    return false;
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const section = searchParams.get("section");
    const featuredOnly = searchParams.get("featuredOnly") === "true";
    const branch = searchParams.get("branch");

    let products = getStoredProducts();

    if (section && section !== "all") {
      products = products.filter((p) => p.mainSection === section || p.category === section);
    }

    if (featuredOnly) {
      products = products.filter((p) => p.isFeatured || p.featured);
    }

    if (branch && branch !== "all") {
      products = products.filter((p) => p.branches?.includes(branch as any));
    }

    return NextResponse.json({ success: true, products });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const newProduct = (await req.json()) as Partial<Product>;
    const products = getStoredProducts();

    const id = newProduct.id || `prod-${Date.now()}`;
    const code = newProduct.code || `SHW-${id.slice(-3).toUpperCase()}`;

    const fullProduct: Product = {
      id,
      code,
      name: newProduct.name || newProduct.title || "موديل الشويمي الجديد",
      title: newProduct.title || newProduct.name || "موديل الشويمي الجديد",
      slug: newProduct.slug || id,
      subtitle: newProduct.subtitle || "تصميم فاخر وجودة استثنائية",
      category: newProduct.mainSection || "kitchens",
      mainSection: newProduct.mainSection || "kitchens",
      categoryLabel: newProduct.categoryLabel || "مطابخ الشويمي",
      subCategory: newProduct.subCategory || "تصميم مخصص",
      style: newProduct.style || "modern",
      styleLabel: newProduct.styleLabel || "مودرن",
      material: newProduct.material || "polylac",
      materialLabel: newProduct.materialLabel || "بولاي لاك أوروبي",
      materials: newProduct.materials || [],
      features: newProduct.features || [],
      badgePrimary: newProduct.badgePrimary || "تصميم حصري",
      badgeSecondary: newProduct.badgeSecondary || "ضمان معتمد",
      branches: newProduct.branches || ["mansoura", "mahalla", "samanoud"],
      price: newProduct.price || newProduct.basePrice || 0,
      basePrice: newProduct.basePrice || newProduct.price || 0,
      pricingMode: newProduct.pricingMode || "whatsapp_quote",
      status: newProduct.status || "published",
      priceDisplay: newProduct.priceDisplay || "عند الطلب",
      priceNote: newProduct.priceNote || "شامل المعاينة الهندسية",
      description: newProduct.description || "",
      specs: newProduct.specs || [],
      imageUrl: newProduct.coverImage || newProduct.imageUrl || "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
      coverImage: newProduct.coverImage || newProduct.imageUrl,
      gallery: newProduct.galleryImages || newProduct.gallery || [],
      galleryImages: newProduct.galleryImages || newProduct.gallery || [],
      dimensions: newProduct.dimensions || "",
      hardware: newProduct.hardware || "",
      finish: newProduct.finish || "",
      chassis: newProduct.chassis || "",
      leadTime: newProduct.leadTime || "من 25 إلى 35 يوم عمل",
      featured: Boolean(newProduct.isFeatured || newProduct.featured),
      isFeatured: Boolean(newProduct.isFeatured || newProduct.featured),
      warrantyYears: newProduct.warrantyYears || 15,
    };

    products.unshift(fullProduct);
    saveProducts(products);

    return NextResponse.json({ success: true, product: fullProduct, products });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to add product" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const updates = (await req.json()) as Partial<Product> & { id: string };
    if (!updates.id) {
      return NextResponse.json(
        { success: false, error: "معرف المنتج مطلوب (id)" },
        { status: 400 }
      );
    }

    const products = getStoredProducts();
    const index = products.findIndex((p) => p.id === updates.id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "المنتج غير موجود" },
        { status: 404 }
      );
    }

    const existing = products[index];
    const merged: Product = {
      ...existing,
      ...updates,
      name: updates.name || updates.title || existing.name,
      title: updates.title || updates.name || existing.title,
      coverImage: updates.coverImage || updates.imageUrl || existing.coverImage,
      imageUrl: updates.coverImage || updates.imageUrl || existing.imageUrl,
      gallery: updates.galleryImages || updates.gallery || existing.gallery,
      galleryImages: updates.galleryImages || updates.gallery || existing.galleryImages,
      isFeatured: updates.isFeatured !== undefined ? updates.isFeatured : updates.featured !== undefined ? updates.featured : existing.isFeatured,
      featured: updates.isFeatured !== undefined ? updates.isFeatured : updates.featured !== undefined ? updates.featured : existing.featured,
    };

    products[index] = merged;
    saveProducts(products);

    return NextResponse.json({ success: true, product: merged, products });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "معرف المنتج مطلوب (id)" },
        { status: 400 }
      );
    }

    const products = getStoredProducts();
    const filtered = products.filter((p) => p.id !== id);

    saveProducts(filtered);

    return NextResponse.json({ success: true, products: filtered });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
