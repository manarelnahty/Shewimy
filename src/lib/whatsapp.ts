/**
 * ============================================================================
 * WhatsApp Routing Engine Function (DRD Section 5)
 * ============================================================================
 * Provides dynamic WhatsApp deep-link generation for products and branches,
 * guaranteeing direct routing with accurate piece details and 3D preview requests.
 */

import { CustomerOrder } from "@/types/shewimy";

export interface WhatsAppProductPayload {
  title: string;
  slug: string;
  section: string;
}

/**
 * Standard WhatsApp link generator as defined in Section 5 of Al Shewimy DRD.
 */
export function generateWhatsAppLink(
  branchPhone: string,
  branchName: string,
  item?: WhatsAppProductPayload
): string {
  const cleanPhone = branchPhone.replace(/[^0-9]/g, "");

  let message = `السلام عليكم، بتواصل مع ${branchName} بخصوص الاستفسار عن تفاصيل المعاينة والتسعير.`;

  if (item) {
    message =
      `السلام عليكم، بتواصل مع ${branchName} بخصوص:\n` +
      `• القطعة: ${item.title}\n` +
      `• القسم: ${item.section}\n` +
      `• الرابط: https://shewimy.com/catalog/${item.section}/${item.slug}\n` +
      `حابب أعرف تفاصيل الخامات والمواعيد المتاحة للمعاينة الهندسية.`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Helper to generate WhatsApp deep-link for Inspection / 3D Consultation requests.
 */
export function generateConsultationWhatsAppLink(
  branchPhone: string,
  branchName: string,
  request: {
    clientName: string;
    phoneNumber: string;
    serviceNameAr: string;
    notes?: string;
  }
): string {
  const cleanPhone = branchPhone.replace(/[^0-9]/g, "");

  let message =
    `السلام عليكم ${branchName}، أود حجز موعد معاينة ورفع مقاسات 3D:\n` +
    `• الاسم: ${request.clientName}\n` +
    `• الهاتف: ${request.phoneNumber}\n` +
    `• الخدمة المطلوبة: ${request.serviceNameAr}`;

  if (request.notes && request.notes.trim().length > 0) {
    message += `\n• ملاحظات إضافية: ${request.notes.trim()}`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates an authoritative WhatsApp dispatch deep-link for customer orders
 * routed specifically to the selected branch representative.
 */
export function generateOrderWhatsAppLink(order: CustomerOrder): string {
  const cleanPhone = (order.branchWhatsapp || "+201005557109").replace(/[^0-9]/g, "");

  let itemsText = "";
  order.items.forEach((it, idx) => {
    const qtyText = it.quantity > 1 ? ` (العدد: ${it.quantity})` : "";
    const priceText = it.price > 0 ? ` - ${it.priceDisplay}` : "";
    const matText = it.selectedMaterial ? `\n   [خامة: ${it.selectedMaterial}]` : "";
    const dimText = it.customDimensions ? `\n   [مقاسات: ${it.customDimensions}]` : "";
    itemsText += `\n${idx + 1}. [${it.code}] ${it.name}${qtyText}${priceText}${matText}${dimText}`;
  });

  const totalText =
    order.estimatedTotal > 0
      ? `\n💵 *إجمالي السعر الاسترشادي:* ${order.estimatedTotal.toLocaleString("ar-EG")} ج.م`
      : "";

  let message =
    `*طلب حجز ومعاينة جديد | مطابخ وأثاث الشويمي*\n` +
    `----------------------------------------\n` +
    `*رقم الطلب:* ${order.orderNumber}\n` +
    `*الفرع الموجه إليه:* ${order.branchName}\n\n` +
    `👤 *بيانات العميل:*\n` +
    `• *الاسم:* ${order.clientName}\n` +
    `• *رقم الهاتف:* ${order.phoneNumber}\n` +
    (order.alternatePhone ? `• *هاتف بديل:* ${order.alternatePhone}\n` : "") +
    `• *المدينة / العنوان:* ${order.city} - ${order.addressDetails}\n\n` +
    `📋 *الموديلات المطلوبة (${order.totalItemsCount}):*${itemsText}\n` +
    totalText +
    `\n💳 *طريقة الدفع:* نقداً عند المعاينة والتعاقد (Cash Only)\n`;

  if (order.customerNotes) {
    message += `\n📝 *ملاحظات العميل:*\n${order.customerNotes}\n`;
  }

  message +=
    `\n⚠️ *ملاحظة معمارية:* الأسعار استرشادية وتتحدد بدقة حسب الرفع الهندسي لمساحتكم على الطبيعة والخامات والميكانزمات المختارة عند التعاقد.\n` +
    `----------------------------------------\n` +
    `تم إرسال هذا الطلب عبر الموقع الإلكتروني الرسمي لمطابخ وأثاث الشويمي.`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

