import { NextRequest, NextResponse } from "next/server";
import {
  getStoredCategories,
  addCategoryRecord,
  updateCategoryRecord,
  deleteCategoryRecord,
} from "@/lib/categories";

export async function GET() {
  try {
    const categories = getStoredCategories();
    return NextResponse.json({ success: true, categories });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "فشل تحميل الأقسام" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = addCategoryRecord(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "فشل إضافة القسم" },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "فشل إضافة القسم" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { key, labelAr, sharePercent, subCategories } = body;

    if (!key) {
      return NextResponse.json(
        { success: false, error: "معرّف القسم (key) مطلوب للتعديل" },
        { status: 400 }
      );
    }

    const result = updateCategoryRecord(key, { labelAr, sharePercent, subCategories });
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "فشل تعديل القسم" },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "فشل تعديل القسم" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let key = searchParams.get("key");

    if (!key) {
      const body = await req.json().catch(() => ({}));
      key = body?.key;
    }

    if (!key) {
      return NextResponse.json(
        { success: false, error: "معرّف القسم (key) مطلوب للحذف" },
        { status: 400 }
      );
    }

    const result = deleteCategoryRecord(key);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "فشل حذف القسم" },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "فشل حذف القسم" },
      { status: 500 }
    );
  }
}
