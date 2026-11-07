"use client";

import React, { useState } from "react";
import { Sparkles, X, CheckCircle2, ChevronDown, Phone, MessageCircle } from "lucide-react";

interface ConsultationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConsultationDrawer({ isOpen, onClose }: ConsultationDrawerProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    branch: "فرع المنصورة (المشاية السفلية)",
    projectType: "مطبخ مودرن كامل",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
        className="fixed inset-0 bg-[#070b0e]/70 backdrop-blur-md transition-opacity duration-300"
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
                معاينة هندسية مجانية ورفع مقاسات دقيق بالليزر لمساحتك
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
                شكراً لك! تم استلام طلبك بنجاح
              </h4>
              <p className="text-xs sm:text-sm text-charcoal/70 max-w-md mx-auto leading-relaxed">
                سيتواصل معك أحد مهندسي التصميم المعماري في مطابخ الشويمي خلال ساعة لتأكيد موعد المعاينة وتقديم الاستشارة المجانية.
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
              {/* Preferred Branch */}
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5">
                  الفرع الأقرب لك
                </label>
                <div className="relative">
                  <select
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full pr-3.5 pl-9 py-2.5 rounded-xl bg-white text-charcoal font-medium text-xs sm:text-sm border border-charcoal/20 hover:border-charcoal/40 focus:border-emerald-cta focus:outline-none focus:ring-4 focus:ring-emerald-cta/10 transition-all appearance-none cursor-pointer shadow-sm"
                  >
                    <option value="فرع المنصورة (المشاية السفلية)">فرع المنصورة (المشاية السفلية)</option>
                    <option value="فرع المحلة الكبرى (شارع البحر)">فرع المحلة الكبرى (شارع البحر)</option>
                    <option value="فرع سمنود والمجمع الصناعي">فرع سمنود والمجمع الصناعي</option>
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
                  </select>
                  <ChevronDown className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex items-center justify-between border-t border-charcoal/10 gap-3">
              <a
                href="https://wa.me/201002345678?text=مرحباً%20أود%20حجز%20معاينة%20مباشرة%20لمطبخي"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#128C7E] hover:text-[#0b6459] font-semibold transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>أو تواصل فورياً عبر واتساب</span>
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
                  className="bg-emerald-cta hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold py-2.5 px-5 rounded-xl shadow-md shadow-emerald-950/20 transition-all duration-200 cursor-pointer active:translate-y-0.5"
                >
                  تأكيد موعد المعاينة
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
