import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { SiteSettings } from "@/types/shewimy";
import { getLatestSiteSettings } from "@/lib/serverSettings";

const SETTINGS_FILE = path.join(process.cwd(), "src", "data", "siteSettings.json");

export async function GET() {
  const settings = getLatestSiteSettings();
  return NextResponse.json({ success: true, settings });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newSettings = (body.settings || body) as Partial<SiteSettings>;

    const current = getLatestSiteSettings();
    const merged: SiteSettings = {
      ...current,
      ...newSettings,
      heroStats: {
        ...current.heroStats,
        ...(newSettings.heroStats || {}),
      },
      trustBarItems:
        newSettings.trustBarItems && newSettings.trustBarItems.length > 0
          ? newSettings.trustBarItems
          : current.trustBarItems,
      processSteps:
        newSettings.processSteps && newSettings.processSteps.length > 0
          ? newSettings.processSteps
          : current.processSteps,
      socialLinks: {
        ...current.socialLinks,
        ...(newSettings.socialLinks || {}),
      },
    };

    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(merged, null, 2), "utf8");

    return NextResponse.json({ success: true, settings: merged });
  } catch (err: any) {
    console.error("Error saving siteSettings.json:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to save settings" },
      { status: 500 }
    );
  }
}
