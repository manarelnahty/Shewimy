"use client";

import React, { useState } from "react";
import { PenTool, X, CheckCircle2 } from "lucide-react";

interface ConsultationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConsultationDrawer({ isOpen, onClose }: ConsultationDrawerProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    branch: "فرع المنصورة",
    projectType: "مطبخ مودرن كامل",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-primary/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className="relative z-10 w-full max-w-2xl bg-surface-container-lowest shadow-[0_-12px_40px_rgba(0,0,0,0.25)] rounded-t-2xl p-6 lg:p-8 animate-in slide-in-from-bottom duration-300 mx-auto border-t border-outline-variant/20"
      >
        <div className="flex items-center justify-between pb-3.5 border-b border-surface-container">
          <div className="flex items-center gap-2.5">
            <PenTool className="w-5 h-5 text-[#1F5E4B] shrink-0" />
            <h3 id="drawer-title" className="text-base sm:text-lg text-primary font-bold font-readex">
              طلب حجز معاينة وتصميم 3D
            </h3>
          </div>
          <button
            type="button"
            aria-label="إغلاق"
            className="text-on-surface-variant hover:text-primary transition-colors p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary cursor-pointer"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-10 text-center space-y-3.5 animate-in fade-in duration-300">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#1F5E4B]/10 text-[#1F5E4B] flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-[#1F5E4B]" />
            </div>
            <h4 className="text-lg font-bold text-primary font-readex">
              شكراً لك! تم استلام طلبك بنجاح
            </h4>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
              سيتواصل معك أحد مهندسي التصميم المعماري في مطابخ الشويمي خلال ساعة لتأكيد موعد المعاينة ورفع المقاسات.
            </p>
          </div>
        ) : (
          <form className="space-y-3.5 pt-3.5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  الاسم بالكامل
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: أحمد عبد الرحمن"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded bg-surface-container-low text-primary focus:outline-none focus:ring-1 focus:ring-secondary text-xs sm:text-sm border border-transparent focus:border-secondary transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  رقم الهاتف / الواتساب
                </label>
                <input
                  type="tel"
                  required
                  dir="ltr"
                  placeholder="010XXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2 rounded bg-surface-container-low text-primary focus:outline-none focus:ring-1 focus:ring-secondary text-xs sm:text-sm border border-transparent focus:border-secondary text-right transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  الفرع الأقرب لك
                </label>
                <select
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  className="w-full px-3.5 py-2 rounded bg-surface-container-low text-primary focus:outline-none focus:ring-1 focus:ring-secondary text-xs sm:text-sm border border-transparent focus:border-secondary transition-all cursor-pointer"
                >
                  <option value="فرع المنصورة">فرع المنصورة</option>
                  <option value="فرع المحلة الكبرى">فرع المحلة الكبرى</option>
                  <option value="فرع سمنود والمصنع">فرع سمنود والمصنع</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  نوع المشروع
                </label>
                <select
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  className="w-full px-3.5 py-2 rounded bg-surface-container-low text-primary focus:outline-none focus:ring-1 focus:ring-secondary text-xs sm:text-sm border border-transparent focus:border-secondary transition-all cursor-pointer"
                >
                  <option value="مطبخ مودرن كامل">مطبخ مودرن كامل</option>
                  <option value="دريسينج روم فاخرة">دريسينج روم فاخرة</option>
                  <option value="مطبخ + دريسينج روم">مطبخ + دريسينج روم</option>
                  <option value="فرش فيلا / شقة متكامل">فرش فيلا / شقة متكامل</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="text-xs sm:text-sm text-on-surface-variant hover:text-primary px-3.5 py-2 rounded transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="bg-[#1F5E4B] hover:bg-[#164638] text-white text-xs sm:text-sm font-semibold py-2 px-5 rounded shadow transition-all duration-200 cursor-pointer active:translate-y-0.5"
              >
                تأكيد موعد المعاينة
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
