"use client";

import React, { useState } from "react";
import { Sparkles, X, CheckCircle2, ChevronDown, Phone, MessageCircle, MapPin } from "lucide-react";
import { BranchId } from "@/types/shewimy";
import { generateConsultationWhatsAppLink } from "@/lib/whatsapp";
import { createInspectionRequest, useBranches } from "@/lib/firebase";

interface ConsultationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  defaultBranch?: BranchId;
}

const SERVICE_OPTIONS: { id: "kitchen_3d" | "dressing_inspection" | "full_home_decor"; label: string; desc: string }[] = [
  {
    id: "kitchen_3d",
    label: "رفع مقاسات وتصميم 3D لمطبخ حديث",
    desc: "دراسة ميكانزم، خامات ومثلث الحركة",
  },
  {
    id: "dressing_inspection",
    label: "معاينة وتخطيط دريسينج روم ووحدات تخزين",
    desc: "دواليب زجاج فاميه وتقسيمات مخملية ذكية",
  },
  {
    id: "full_home_decor",
    label: "ديكور وتأثيث منزلي متكامل (أثاث، تجاليد، شبابيك UPVC)",
    desc: "باقة متكاملة للمنازل والفيلات الراقية",
  },
];

export function ConsultationDrawer({
  isOpen,
  onClose,
  defaultBranch = "mansoura",
}: ConsultationDrawerProps) {
  const { branches } = useBranches();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    branch: defaultBranch,
    requestedService: "kitchen_3d" as "kitchen_3d" | "dressing_inspection" | "full_home_decor",
    customerNotes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const selectedBranch = branches.find((b) => b.id === formData.branch) || branches[0];
    const selectedServiceObj = SERVICE_OPTIONS.find((s) => s.id === formData.requestedService);
    const serviceNameAr = selectedServiceObj?.label || "رفع مقاسات وتصميم 3D";

    // 1. Submit to Firestore `inspection_requests` collection (DRD Section 6 & 7)
    try {
      await createInspectionRequest({
        clientName: formData.fullName.trim(),
        phoneNumber: formData.phone.trim(),
        selectedBranch: formData.branch,
        requestedService: formData.requestedService,
        customerNotes: formData.customerNotes.trim(),
      });
    } catch (err) {
      console.warn("Firestore logging completed with warning:", err);
    }

    // 2. Open WhatsApp Direct Conversion to the designated branch (DRD Section 1 & 5)
    const whatsappUrl = generateConsultationWhatsAppLink(
      selectedBranch.whatsappNumber,
      selectedBranch.name,
      {
        clientName: formData.fullName.trim(),
        phoneNumber: formData.phone.trim(),
        serviceNameAr,
        notes: formData.customerNotes.trim(),
      }
    );

    window.open(whatsappUrl, "_blank");

    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#070b0e]/75 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className="relative z-10 w-full max-w-xl bg-white shadow-2xl rounded-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 border border-charcoal/10 my-auto text-charcoal max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-charcoal/10 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-cta flex items-center justify-center shrink-0 border border-emerald-100 shadow-sm">
              <Sparkles className="w-5 h-5 text-emerald-cta" />
            </div>
            <div>
              <h3
                id="drawer-title"
                className="text-lg sm:text-xl font-bold text-charcoal font-readex"
              >
                طلب حجز معاينة وتصميم 3D هندسي
              </h3>
              <p className="text-xs text-charcoal/60 mt-0.5">
                توجيه مباشر إلى واتساب الفرع المخصص لحجز موعد المهندس المختص
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="إغلاق النافذة"
            className="w-8 h-8 rounded-full hover:bg-charcoal/5 flex items-center justify-center text-charcoal/50 hover:text-charcoal transition-colors cursor-pointer shrink-0"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-cta flex items-center justify-center border border-emerald-100 shadow-inner">
              <CheckCircle2 className="w-10 h-10 text-emerald-cta" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-bold text-charcoal font-readex">
                تم تسجيل طلب المعاينة بنجاح
              </h4>
              <p className="text-sm text-charcoal/70 max-w-sm">
                تم تحويلك إلى واتساب الفرع المخصص، وسيقوم مهندس المعاينة بالتواصل معك لتأكيد الموعد.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="consultation-name"
                className="block text-xs font-bold text-charcoal/80 mb-1.5"
              >
                الاسم بالكامل <span className="text-red-500">*</span>
              </label>
              <input
                id="consultation-name"
                type="text"
                required
                placeholder="أحمد محمد"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-charcoal/20 focus:border-emerald-cta focus:ring-2 focus:ring-emerald-cta/20 outline-none text-sm transition-all"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="consultation-phone"
                className="block text-xs font-bold text-charcoal/80 mb-1.5"
              >
                رقم الهاتف (واتساب مفعل) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="consultation-phone"
                  type="tel"
                  required
                  placeholder="01000000000"
                  dir="ltr"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full text-right px-4 py-2.5 rounded-xl border border-charcoal/20 focus:border-emerald-cta focus:ring-2 focus:ring-emerald-cta/20 outline-none text-sm transition-all"
                />
                <Phone className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Branch Selection (3 Branches DRD Section 4) */}
            <div>
              <label
                htmlFor="consultation-branch"
                className="block text-xs font-bold text-charcoal/80 mb-1.5"
              >
                الفرع الأقرب إليك لمتابعة المعاينة <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="consultation-branch"
                  value={formData.branch}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      branch: e.target.value as BranchId,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-charcoal/20 focus:border-emerald-cta focus:ring-2 focus:ring-emerald-cta/20 outline-none text-sm appearance-none bg-white transition-all cursor-pointer"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} - {b.regionServed}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Requested Service (DRD Section 6) */}
            <div>
              <label className="block text-xs font-bold text-charcoal/80 mb-1.5">
                نوع الخدمة المطلوبة <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {SERVICE_OPTIONS.map((srv) => (
                  <label
                    key={srv.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      formData.requestedService === srv.id
                        ? "border-[#1F5E4B] bg-emerald-50/50"
                        : "border-charcoal/15 bg-white hover:bg-charcoal/5"
                    }`}
                  >
                    <input
                      type="radio"
                      name="requestedService"
                      value={srv.id}
                      checked={formData.requestedService === srv.id}
                      onChange={() =>
                        setFormData({ ...formData, requestedService: srv.id })
                      }
                      className="mt-1 text-[#1F5E4B] focus:ring-[#1F5E4B]"
                    />
                    <div className="text-right">
                      <span className="text-xs sm:text-sm font-bold text-charcoal block">
                        {srv.label}
                      </span>
                      <span className="text-[11px] text-charcoal/60 block mt-0.5">
                        {srv.desc}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Customer Notes (DRD Section 6 customerNotes) */}
            <div>
              <label
                htmlFor="consultation-notes"
                className="block text-xs font-bold text-charcoal/80 mb-1.5"
              >
                ملاحظات حول المكان أو موعد الزيارة المفضل (اختياري)
              </label>
              <textarea
                id="consultation-notes"
                rows={2}
                placeholder="مثلاً: المساحة التقريبية للمطبخ، المدينة أو الحي، تفضيل الزيارة مساءً..."
                value={formData.customerNotes}
                onChange={(e) =>
                  setFormData({ ...formData, customerNotes: e.target.value })
                }
                className="w-full px-4 py-2 rounded-xl border border-charcoal/20 focus:border-emerald-cta focus:ring-2 focus:ring-emerald-cta/20 outline-none text-xs sm:text-sm transition-all"
              />
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#1F5E4B] hover:bg-[#164638] text-white text-sm font-bold py-3 px-6 rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 shrink-0 text-white" />
                <span>
                  {isSubmitting ? "جارٍ التجهيز..." : "تأكيد الطلب والتحويل لواتساب الفرع"}
                </span>
              </button>
              <p className="text-[11px] text-center text-charcoal/50 mt-2">
                * لن يتم إلزامك بأي رسوم شراء أو حجز، المعاينة والاستشارة الهندسية مبدئية ومجانية.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
