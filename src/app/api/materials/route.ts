import { NextRequest, NextResponse } from "next/server";
import {
  getStoredMaterials,
  addOrUpdateMaterialRecord,
  deleteMaterialRecord,
} from "@/lib/materials";

export async function GET() {
  try {
    const materials = getStoredMaterials();
    return NextResponse.json({ success: true, materials });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to load materials" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = addOrUpdateMaterialRecord(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to save material" },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to save material" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const result = addOrUpdateMaterialRecord(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to update material" },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to update material" },
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
        { success: false, error: "معرّف الخامة (ID) مطلوب" },
        { status: 400 }
      );
    }

    const result = deleteMaterialRecord(id);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to delete material" },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to delete material" },
      { status: 500 }
    );
  }
}
