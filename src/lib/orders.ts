import fs from "fs";
import path from "path";
import { CustomerOrder, OrderStatus, BranchId } from "@/types/shewimy";
import { BRANCHES_LIST } from "@/data/branches";

const ORDERS_FILE = path.join(process.cwd(), "src", "data", "orders.json");

/**
 * Server-side loader: Returns all stored customer orders from disk.
 */
export function getStoredOrders(): CustomerOrder[] {
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const content = fs.readFileSync(ORDERS_FILE, "utf8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
    }
  } catch (err) {
    console.error("Error reading orders.json:", err);
  }
  return [];
}

/**
 * Persists orders list safely to disk.
 */
export function saveOrdersToDisk(orders: CustomerOrder[]): boolean {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Error writing orders.json:", err);
    return false;
  }
}

/**
 * Generates an architectural human-readable order number (e.g. #SHW-8492).
 */
export function generateOrderNumber(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `#SHW-${num}`;
}

/**
 * Creates and registers a new customer order.
 */
export function createOrderRecord(
  payload: Omit<CustomerOrder, "id" | "orderNumber" | "createdAt" | "updatedAt" | "paymentMethod"> & {
    paymentMethod?: "cash_on_contract";
  }
): { success: boolean; order?: CustomerOrder; error?: string } {
  try {
    if (!payload.clientName?.trim()) {
      return { success: false, error: "اسم العميل بالكامل مطلوب" };
    }
    if (!payload.phoneNumber?.trim()) {
      return { success: false, error: "رقم الهاتف / الواتساب مطلوب للتواصل" };
    }
    if (!payload.items || payload.items.length === 0) {
      return { success: false, error: "سلة الطلبات فارغة" };
    }

    const branch = BRANCHES_LIST.find((b) => b.id === payload.selectedBranch) || BRANCHES_LIST[0];
    const now = new Date().toISOString();
    const id = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const orderNumber = generateOrderNumber();

    const newOrder: CustomerOrder = {
      id,
      orderNumber,
      clientName: payload.clientName.trim(),
      phoneNumber: payload.phoneNumber.trim(),
      alternatePhone: payload.alternatePhone?.trim() || "",
      city: payload.city?.trim() || "غير محدد",
      addressDetails: payload.addressDetails?.trim() || "",
      selectedBranch: (branch.id as BranchId) || "mansoura",
      branchName: payload.branchName || branch.name,
      branchWhatsapp: payload.branchWhatsapp || branch.whatsappNumber,
      paymentMethod: "cash_on_contract", // Strictly Cash Only
      items: payload.items,
      totalItemsCount: payload.items.reduce((acc, it) => acc + (it.quantity || 1), 0),
      estimatedTotal: payload.estimatedTotal || 0,
      customerNotes: payload.customerNotes?.trim() || "",
      priceDisclaimerAcknowledged: true,
      status: "new",
      statusNotes: "طلب جديد وارد من الموقع الإلكتروني بانتظار اتصال خدمة العملاء.",
      createdAt: now,
      updatedAt: now,
    };

    const orders = getStoredOrders();
    orders.unshift(newOrder);
    saveOrdersToDisk(orders);

    return { success: true, order: newOrder };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "فشل تسجيل الطلب";
    console.error("createOrderRecord error:", err);
    return { success: false, error: msg };
  }
}

/**
 * Updates an order's status and management notes.
 */
export function updateOrderStatusRecord(
  orderId: string,
  status: OrderStatus,
  statusNotes?: string
): { success: boolean; order?: CustomerOrder; error?: string } {
  try {
    const orders = getStoredOrders();
    const idx = orders.findIndex((o) => o.id === orderId);

    if (idx === -1) {
      return { success: false, error: "الطلب غير موجود" };
    }

    orders[idx] = {
      ...orders[idx],
      status,
      ...(statusNotes !== undefined ? { statusNotes: statusNotes.trim() } : {}),
      updatedAt: new Date().toISOString(),
    };

    saveOrdersToDisk(orders);
    return { success: true, order: orders[idx] };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "فشل تحديث حالة الطلب";
    return { success: false, error: msg };
  }
}

/**
 * Deletes an order permanently from disk.
 */
export function deleteOrderRecord(orderId: string): { success: boolean; error?: string } {
  try {
    let orders = getStoredOrders();
    const beforeCount = orders.length;
    orders = orders.filter((o) => o.id !== orderId);

    if (orders.length === beforeCount) {
      return { success: false, error: "الطلب غير موجود" };
    }

    saveOrdersToDisk(orders);
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "فشل حذف الطلب";
    return { success: false, error: msg };
  }
}
