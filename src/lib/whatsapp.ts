/**
 * ============================================================================
 * WhatsApp Routing Engine Function (DRD Section 5)
 * ============================================================================
 * Provides dynamic WhatsApp deep-link generation for products and branches,
 * guaranteeing direct routing with accurate piece details and 3D preview requests.
 */

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
