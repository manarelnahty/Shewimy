import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ACCOUNT_FILE = path.join(process.cwd(), "src", "data", "adminAccount.json");
const SETTINGS_FILE = path.join(process.cwd(), "src", "data", "siteSettings.json");

interface StoredAccount {
  uid: string;
  email: string;
  password?: string;
  displayName: string;
  role: string;
  updatedAt: string;
  passwordUpdatedAt?: string;
}

function getStoredAccount(): StoredAccount {
  try {
    if (fs.existsSync(ACCOUNT_FILE)) {
      const content = fs.readFileSync(ACCOUNT_FILE, "utf8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Error reading adminAccount.json:", err);
  }
  return {
    uid: "admin-master",
    email: "admin@shewimy.com",
    password: "Shewimy@2026",
    displayName: "مدير النظام (الشويمي)",
    role: "super_admin",
    updatedAt: new Date().toISOString(),
  };
}

function saveAccount(acc: StoredAccount): boolean {
  try {
    fs.writeFileSync(ACCOUNT_FILE, JSON.stringify(acc, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Error writing adminAccount.json:", err);
    return false;
  }
}

function updateSiteSettingsEmail(newEmail: string): void {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const content = fs.readFileSync(SETTINGS_FILE, "utf8");
      const parsed = JSON.parse(content);
      parsed.adminEmail = newEmail;
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(parsed, null, 2), "utf8");
    }
  } catch (err) {
    console.error("Error updating siteSettings.json email:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPass = (password || "").trim();

    const acc = getStoredAccount();
    const storedEmail = (acc.email || "admin@shewimy.com").trim().toLowerCase();
    const storedPass = acc.password || "Shewimy@2026";

    if (cleanEmail === storedEmail) {
      if (cleanPass === storedPass) {
        return NextResponse.json({
          success: true,
          user: {
            uid: acc.uid,
            email: acc.email,
            displayName: acc.displayName,
            role: acc.role,
          },
        });
      } else {
        return NextResponse.json(
          { success: false, error: "كلمة المرور غير صحيحة" },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: "البريد الإلكتروني غير مسجل بحساب المسؤول", notFound: true },
      { status: 404 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to verify credentials" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const acc = getStoredAccount();
    // Return safe account info without exposing raw password
    const safeAccount = {
      uid: acc.uid,
      email: acc.email,
      displayName: acc.displayName,
      role: acc.role,
      updatedAt: acc.updatedAt,
      passwordUpdatedAt: acc.passwordUpdatedAt,
      hasCustomPassword: Boolean(acc.password && acc.password !== "Shewimy@2026"),
    };
    return NextResponse.json({ success: true, account: safeAccount });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to get account info" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, currentPassword, newEmail, newPassword } = body;

    const currentAcc = getStoredAccount();

    // 1. Validate current password
    if (!currentPassword) {
      return NextResponse.json(
        { success: false, error: "يرجى إدخال كلمة المرور الحالية لتأكيد الهوية" },
        { status: 400 }
      );
    }

    const expectedPass = currentAcc.password || "Shewimy@2026";
    if (currentPassword !== expectedPass) {
      return NextResponse.json(
        { success: false, error: "كلمة المرور الحالية غير صحيحة" },
        { status: 403 }
      );
    }

    // 2. Action: update_email
    if (action === "update_email") {
      const cleanEmail = (newEmail || "").trim().toLowerCase();
      if (!cleanEmail || !cleanEmail.includes("@") || !cleanEmail.includes(".")) {
        return NextResponse.json(
          { success: false, error: "يرجى إدخال بريد إلكتروني صالح" },
          { status: 400 }
        );
      }

      currentAcc.email = cleanEmail;
      currentAcc.updatedAt = new Date().toISOString();
      saveAccount(currentAcc);
      updateSiteSettingsEmail(cleanEmail);

      return NextResponse.json({
        success: true,
        message: "تم تحديث البريد الإلكتروني للمسؤول بنجاح وانعكس في السكيما",
        email: cleanEmail,
      });
    }

    // 3. Action: update_password
    if (action === "update_password") {
      const cleanPass = (newPassword || "").trim();
      if (!cleanPass || cleanPass.length < 6) {
        return NextResponse.json(
          { success: false, error: "كلمة المرور الجديدة يجب أن لا تقل عن 6 أحرف أو أرقام" },
          { status: 400 }
        );
      }

      currentAcc.password = cleanPass;
      currentAcc.passwordUpdatedAt = new Date().toISOString();
      currentAcc.updatedAt = new Date().toISOString();
      saveAccount(currentAcc);

      return NextResponse.json({
        success: true,
        message: "تم تحديث كلمة المرور بنجاح وحفظها بأمان",
      });
    }

    return NextResponse.json(
      { success: false, error: "إجراء غير معروف" },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to update account" },
      { status: 500 }
    );
  }
}
