"use client";

import React, { useState } from "react";
import { Sparkles, X, CheckCircle2, ChevronDown, Phone, MessageCircle } from "lucide-react";

interface ConsultationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  defaultBranch?: "mansoura" | "samanoud_mahalla";
}

export function ConsultationDrawer({
  isOpen,
  onClose,
  defaultBranch = "mansoura",
}: ConsultationDrawerProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    branch: defaultBranch,
    projectType: "مطبخ مودرن كامل",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Map branch selection to designated branch WhatsApp numbers
    const branchPhoneMap: Record<string, string> = {
      mansoura: "201005557109",
      samanoud_mahalla: "201287153339",
    };

    const branchNameMap: Record<string, string> = {
      mansoura: "فرع المنصورة (📞 01005557109)",
      samanoud_mahalla: "فرع سمنود والمحلة (📞 01287153339)",
    };

    const targetNumber = branchPhoneMap[formData.branch] ?? "201005557109";
    const branchName = branchNameMap[formData.branch] ?? "فرع المنصورة";

    // Formatted WhatsApp message with lead details
    const textMessage = `السلام عليكم مطابخ الشويمي، أود حجز موعد معاينة وتصميم 3D:
• الاسم: ${formData.fullName.trim()}
• الهاتف: ${formData.phone.trim()}
• الفرع: ${branchName}
• نوع المشروع: ${formData.projectType}`;

    const whatsappUrl = `https://wa.me/${targetNumber}?text=${encodeURIComponent(textMessage)}`;

    // Open WhatsApp directly with the pre-filled data
    window.open(whatsappUrl, "_blank");

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop with elegant blur */}
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
        className="relative z-10 w-full max-w-xl bg-white shadow-2xl rounded-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 border border-charcoal/10 my-auto text-charcoal"
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
                طلب حجز معاينة وتصميم 3D
              </h3>
              <p className="text-xs text-charcoal/60 mt-0.5">
                يتم تحويل البيانات مباشرة إلى واتساب الفرع المختص لتأكيد الموعد فورياً
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
          /* Success Screen */
          <div className="py-10 text-center space-y-4 animate-in fade-in duration-300">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-cta flex items-center justify-center border border-emerald-200 shadow-sm">
              <CheckCircle2 className="w-9 h-9 text-emerald-cta" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-xl font-bold text-charcoal font-readex">
                جاري التحويل إلى محادثة واتساب الفرع...
              </h4>
              <p className="text-xs sm:text-sm text-charcoal/70 max-w-md mx-auto leading-relaxed">
                تم تجهيز بياناتك في رسالة واتساب، يرجى الضغط على إرسال داخل واتساب للتواصل مع مهندس الفرع فوراً.
              </p>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form className="space-y-4 pt-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5">
                  الاسم بالكامل <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: أحمد عبد الرحمن"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white text-charcoal font-medium text-xs sm:text-sm border border-charcoal/20 hover:border-charcoal/40 focus:border-emerald-cta focus:outline-none focus:ring-4 focus:ring-emerald-cta/10 transition-all placeholder:text-charcoal/40 shadow-sm"
                />
              </div>

              {/* Phone / WhatsApp */}
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5">
                  رقم الهاتف / الواتساب <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    placeholder="010XXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white text-charcoal font-medium text-xs sm:text-sm border border-charcoal/20 hover:border-charcoal/40 focus:border-emerald-cta focus:outline-none focus:ring-4 focus:ring-emerald-cta/10 transition-all placeholder:text-charcoal/40 text-right shadow-sm"
                  />
                  <Phone className="w-4 h-4 text-charcoal/30 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Preferred Branch with Phone Numbers */}
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5">
                  الفرع الأقرب لك <span className="text-secondary font-normal">(اختر لتوجيه الرسالة)</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.branch}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        branch: e.target.value as "mansoura" | "samanoud_mahalla",
                      })
                    }
                    className="w-full pr-3.5 pl-9 py-2.5 rounded-xl bg-white text-charcoal font-medium text-xs sm:text-sm border border-charcoal/20 hover:border-charcoal/40 focus:border-emerald-cta focus:outline-none focus:ring-4 focus:ring-emerald-cta/10 transition-all appearance-none cursor-pointer shadow-sm"
                  >
                    <option value="mansoura">فرع المنصورة (01005557109)</option>
                    <option value="samanoud_mahalla">فرع سمنود والمحلة (01287153339)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Project Type */}
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5">
                  نوع المشروع المطلوب
                </label>
                <div className="relative">
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full pr-3.5 pl-9 py-2.5 rounded-xl bg-white text-charcoal font-medium text-xs sm:text-sm border border-charcoal/20 hover:border-charcoal/40 focus:border-emerald-cta focus:outline-none focus:ring-4 focus:ring-emerald-cta/10 transition-all appearance-none cursor-pointer shadow-sm"
                  >
                    <option value="مطبخ مودرن كامل">مطبخ مودرن كامل</option>
                    <option value="دريسينج روم فاخرة">دريسينج روم فاخرة</option>
                    <option value="مطبخ + دريسينج روم">مطبخ + دريسينج روم</option>
                    <option value="فرش فيلا / شقة متكامل">فرش فيلا / شقة متكامل</option>
                    <option value="تجاليد وأعمال خشبية معمارية">تجاليد وأعمال خشبية معمارية</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Branch Numbers Note */}
            <div className="p-3 rounded-xl bg-surface-container-low text-[11px] sm:text-xs text-charcoal/75 space-y-1 border border-outline-variant/10">
              <span className="font-bold text-primary block">أرقام التواصل المباشرة للفروع:</span>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span>📍 المنصورة: 01005557109 / 01012623138</span>
                <span>📍 سمنود والمحلة: 01287153339 / 01098199288</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex items-center justify-between border-t border-charcoal/10 gap-3">
              <a
                href={
                  formData.branch === "mansoura"
                    ? "https://wa.me/201005557109?text=مرحباً%20فرع%20المنصورة%20أود%20الاستفسار%20عن%20المطابخ"
                    : "https://wa.me/201287153339?text=مرحباً%20فرع%20سمنود%20والمحلة%20أود%20الاستفسار%20عن%20المطابخ"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#128C7E] hover:text-[#0b6459] font-semibold transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                <span>محادثة فورية بالفرع</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs sm:text-sm text-charcoal/60 hover:text-charcoal hover:bg-charcoal/5 px-3.5 py-2 rounded-xl transition-colors cursor-pointer font-medium"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-[#1F5E4B] hover:bg-[#164638] text-white text-xs sm:text-sm font-bold py-2.5 px-5 rounded-xl shadow-md shadow-emerald-950/20 transition-all duration-200 cursor-pointer active:translate-y-0.5"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>تأكيد وتحويل للواتساب</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
