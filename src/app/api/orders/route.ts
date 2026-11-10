import { NextRequest, NextResponse } from "next/server";
import {
  getStoredOrders,
  createOrderRecord,
  updateOrderStatusRecord,
  deleteOrderRecord,
} from "@/lib/orders";
import { getDb, isFirebaseConfigured } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const branch = searchParams.get("branch");
    const status = searchParams.get("status");
    const q = searchParams.get("q")?.toLowerCase();

    let orders = getStoredOrders();

    if (branch && branch !== "all") {
      orders = orders.filter((o) => o.selectedBranch === branch);
    }

    if (status && status !== "all") {
      orders = orders.filter((o) => o.status === status);
    }

    if (q) {
      orders = orders.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.clientName.toLowerCase().includes(q) ||
          o.phoneNumber.includes(q) ||
          o.city.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ success: true, orders });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "فشل تحميل الطلبات";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = createOrderRecord(body);

    if (!result.success || !result.order) {
      return NextResponse.json(
        { success: false, error: result.error || "فشل تسجيل الطلب" },
        { status: 400 }
      );
    }

    // Secondary async sync to Firestore if configured
    try {
      const db = getDb();
      if (db && isFirebaseConfigured()) {
        const orderRef = doc(db, "orders", result.order.id);
        await setDoc(orderRef, result.order);
      }
    } catch (fsErr) {
      console.warn("Could not sync order to Firestore:", fsErr);
    }

    return NextResponse.json({ success: true, order: result.order });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "فشل تسجيل الطلب";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, statusNotes } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "معرف الطلب وحالته مطلوبان" },
        { status: 400 }
      );
    }

    const result = updateOrderStatusRecord(id, status, statusNotes);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    // Sync status to Firestore
    try {
      const db = getDb();
      if (db && isFirebaseConfigured()) {
        const orderRef = doc(db, "orders", id);
        await setDoc(
          orderRef,
          {
            status,
            statusNotes: statusNotes || "",
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      }
    } catch (fsErr) {
      console.warn("Could not sync order update to Firestore:", fsErr);
    }

    return NextResponse.json({ success: true, order: result.order });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "فشل تحديث الطلب";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id");

    if (!id) {
      const body = await req.json().catch(() => ({}));
      id = body?.id;
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: "معرف الطلب مطلوب للحذف" },
        { status: 400 }
      );
    }

    const result = deleteOrderRecord(id);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "فشل حذف الطلب";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
