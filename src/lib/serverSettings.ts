import fs from "fs";
import path from "path";
import { DEFAULT_SITE_SETTINGS, SiteSettings } from "@/types/shewimy";

const SETTINGS_FILE = path.join(process.cwd(), "src", "data", "siteSettings.json");

/**
 * Server-only utility to fetch the absolute latest site settings directly from disk.
 * Bypasses bundler/module caching so every SSR request renders the latest edits immediately
 * with zero hydration mismatch and zero visual flicker.
 */
export function getLatestSiteSettings(): SiteSettings {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const content = fs.readFileSync(SETTINGS_FILE, "utf8");
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === "object") {
        return {
          ...DEFAULT_SITE_SETTINGS,
          ...parsed,
          heroStats: {
            ...DEFAULT_SITE_SETTINGS.heroStats,
            ...(parsed.heroStats || {}),
          },
          trustBarItems:
            Array.isArray(parsed.trustBarItems) && parsed.trustBarItems.length > 0
              ? parsed.trustBarItems
              : DEFAULT_SITE_SETTINGS.trustBarItems,
          processSteps:
            Array.isArray(parsed.processSteps) && parsed.processSteps.length > 0
              ? parsed.processSteps
              : DEFAULT_SITE_SETTINGS.processSteps,
          socialLinks: {
            ...DEFAULT_SITE_SETTINGS.socialLinks,
            ...(parsed.socialLinks || {}),
          },
        };
      }
    }
  } catch (err) {
    console.error("Error reading siteSettings.json in getLatestSiteSettings:", err);
  }

  return DEFAULT_SITE_SETTINGS;
}
