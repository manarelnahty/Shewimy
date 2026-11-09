import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { BranchExtended } from "@/data/branches";
import { getLatestBranches } from "@/lib/serverSettings";

const BRANCHES_FILE = path.join(process.cwd(), "src", "data", "branches.json");

export async function GET() {
  const branches = getLatestBranches();
  return NextResponse.json({ success: true, branches });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { branchId, id, ...updates } = body;
    const targetId = (branchId || id) as string;

    if (!targetId) {
      return NextResponse.json(
        { success: false, error: "معرف الفرع مطلوب (branchId)" },
        { status: 400 }
      );
    }

    const currentBranches = getLatestBranches();
    const index = currentBranches.findIndex((b) => b.id === targetId);

    let updatedBranch: BranchExtended;

    if (index >= 0) {
      updatedBranch = {
        ...currentBranches[index],
        ...updates,
        id: targetId,
      };
      currentBranches[index] = updatedBranch;
    } else {
      updatedBranch = {
        id: targetId,
        name: updates.name || targetId,
        address: updates.address || "",
        phones: updates.phones || [],
        whatsappNumber: updates.whatsappNumber || "",
        googleMapsUrl: updates.googleMapsUrl || "",
        workingHours: updates.workingHours || "",
        badge: updates.badge || "فرع معتمد",
        regionServed: updates.regionServed || "",
        ...updates,
      };
      currentBranches.push(updatedBranch);
    }

    fs.writeFileSync(BRANCHES_FILE, JSON.stringify(currentBranches, null, 2), "utf8");

    return NextResponse.json({
      success: true,
      branch: updatedBranch,
      branches: currentBranches,
    });
  } catch (err: any) {
    console.error("Error saving branches.json:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to update branch" },
      { status: 500 }
    );
  }
}
