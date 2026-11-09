import { NextResponse } from "next/server";
import { seedFirestore } from "@/lib/firebase/firestore";
import fs from "fs";
import path from "path";

function ensureLocalAdminSeeded() {
  const accountFile = path.join(process.cwd(), "src", "data", "adminAccount.json");
  const defaultAdmin = {
    uid: "admin-master",
    email: "admin@shewimy.com",
    password: "Shewimy@2026",
    displayName: "مدير النظام (الشويمي)",
    role: "super_admin",
    status: "active",
    updatedAt: new Date().toISOString(),
    passwordUpdatedAt: new Date().toISOString(),
  };

  try {
    if (!fs.existsSync(accountFile)) {
      fs.writeFileSync(accountFile, JSON.stringify(defaultAdmin, null, 2), "utf8");
    } else {
      const existing = JSON.parse(fs.readFileSync(accountFile, "utf8"));
      if (!existing.email || !existing.password) {
        fs.writeFileSync(accountFile, JSON.stringify(defaultAdmin, null, 2), "utf8");
      }
    }
  } catch (err) {
    console.error("Error ensuring local admin seeded:", err);
  }
}

export async function GET() {
  ensureLocalAdminSeeded();
  const result = await seedFirestore();
  return NextResponse.json({
    ...result,
    adminEmail: "admin@shewimy.com",
  });
}

export async function POST() {
  ensureLocalAdminSeeded();
  const result = await seedFirestore();
  return NextResponse.json({
    ...result,
    adminEmail: "admin@shewimy.com",
  });
}
