import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { InspectionRequest } from "@/types/shewimy";

const REQUESTS_FILE = path.join(process.cwd(), "src", "data", "requests.json");

function getStoredRequests(): InspectionRequest[] {
  try {
    if (fs.existsSync(REQUESTS_FILE)) {
      const content = fs.readFileSync(REQUESTS_FILE, "utf8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading requests.json:", err);
  }
  return [];
}

function saveRequests(requests: InspectionRequest[]): boolean {
  try {
    fs.writeFileSync(REQUESTS_FILE, JSON.stringify(requests, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Error writing requests.json:", err);
    return false;
  }
}

export async function GET() {
  try {
    const requests = getStoredRequests();
    return NextResponse.json({ success: true, requests });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to load requests" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data.clientName || !data.phoneNumber) {
      return NextResponse.json(
        { success: false, error: "الاسم ورقم الهاتف مطلوبان" },
        { status: 400 }
      );
    }

    const requests = getStoredRequests();

    const newRequest: InspectionRequest = {
      id: `req-${Date.now()}`,
      clientName: data.clientName.trim(),
      phoneNumber: data.phoneNumber.trim(),
      selectedBranch: data.selectedBranch || "mansoura",
      requestedService: data.requestedService || "kitchen_3d",
      customerNotes: data.customerNotes?.trim() || "",
      status: "new",
      createdAt: new Date().toISOString(),
    };

    requests.unshift(newRequest);
    saveRequests(requests);

    return NextResponse.json({ success: true, request: newRequest, requests });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to save request" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "معرف الطلب والحالة مطلوبان" },
        { status: 400 }
      );
    }

    const requests = getStoredRequests();
    const index = requests.findIndex((r) => r.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "الطلب غير موجود" },
        { status: 404 }
      );
    }

    requests[index] = {
      ...requests[index],
      status,
      updatedAt: new Date().toISOString(),
    } as any;

    saveRequests(requests);

    return NextResponse.json({ success: true, request: requests[index], requests });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to update request" },
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
        { success: false, error: "معرف الطلب مطلوب (id)" },
        { status: 400 }
      );
    }

    const requests = getStoredRequests();
    const filtered = requests.filter((r) => r.id !== id);

    saveRequests(filtered);

    return NextResponse.json({ success: true, requests: filtered });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to delete request" },
      { status: 500 }
    );
  }
}
