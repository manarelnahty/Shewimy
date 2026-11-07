"use client";

import React from "react";
import { X, MapPin, MessageCircle, Building2 } from "lucide-react";
import { Product, BRANCH_CONTACTS } from "@/data/products";

interface BranchSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export function BranchSelectionModal({
  isOpen,
  onClose,
  product,
}: BranchSelectionModalProps) {
  if (!isOpen || !product) return null;

  const handleSelectBranch = (branchKey: "mansoura" | "samanoud_mahalla") => {
    const branch = BRANCH_CONTACTS[branchKey];
    const textMessage = `السلام عليكم مطابخ الشويمي، أود الاستفسار عن الموديل:
• كود المنتج: ${product.code}
• اسم المنتج: ${product.name}
• السعر: ${product.priceDisplay}
• الفرع الأقرب لي: ${branch.name}`;

    const whatsappUrl = `https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(textMessage)}`;
    window.open(whatsappUrl, "_blank");
    onClose();
  };

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
        aria-labelledby="branch-modal-title"
        className="relative z-10 w-full max-w-lg bg-white shadow-2xl rounded-2xl p-6 sm:p-7 animate-in fade-in zoom-in-95 duration-200 border border-charcoal/10 my-auto text-charcoal"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-charcoal/10 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0 border border-secondary/20 shadow-sm">
              <Building2 className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3
                id="branch-modal-title"
                className="text-lg sm:text-xl font-bold text-charcoal font-readex"
              >
                اختر الفرع الأقرب لك
              </h3>
              <p className="text-xs text-charcoal/60 mt-0.5">
                هذا الموديل متوفر وجاهز للمعاينة في كلا فرعينا
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

        {/* Selected Product Summary */}
        <div className="my-4 p-3 rounded-xl bg-surface-container-low border border-outline-variant/15 flex items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-[11px] text-charcoal/50 block font-mono">
              كود: {product.code}
            </span>
            <span className="font-bold text-primary font-readex line-clamp-1">
              {product.name}
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-white font-extrabold text-primary shadow-sm border border-charcoal/10 whitespace-nowrap">
            {product.priceDisplay}
          </span>
        </div>

        {/* Branch Choices */}
        <div className="space-y-3 pt-1">
          {/* Mansoura Branch Option */}
          <button
            type="button"
            onClick={() => handleSelectBranch("mansoura")}
            className="w-full text-right p-4 rounded-xl border-2 border-charcoal/15 hover:border-[#1F5E4B] bg-white hover:bg-emerald-50/40 transition-all duration-200 group cursor-pointer shadow-sm hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#1F5E4B]" />
                <span className="font-bold text-sm text-charcoal group-hover:text-[#1F5E4B] font-readex transition-colors">
                  فرع المنصورة
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-[#1F5E4B] font-bold">
                  متاح الآن
                </span>
              </div>
              <p className="text-xs text-charcoal/60 pr-6">
                شارع قناة السويس / المشاية • أرقام الهاتف: 01005557109 / 01012623138
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 self-end sm:self-auto px-3.5 py-2 rounded-lg bg-[#25D366] text-white text-xs font-bold group-hover:bg-[#1eb956] shadow-sm transition-colors shrink-0">
              <MessageCircle className="w-3.5 h-3.5 shrink-0" />
              <span>واتساب المنصورة</span>
            </div>
          </button>

          {/* Samanoud & Mahalla Branch Option */}
          <button
            type="button"
            onClick={() => handleSelectBranch("samanoud_mahalla")}
            className="w-full text-right p-4 rounded-xl border-2 border-charcoal/15 hover:border-[#1F5E4B] bg-white hover:bg-emerald-50/40 transition-all duration-200 group cursor-pointer shadow-sm hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#1F5E4B]" />
                <span className="font-bold text-sm text-charcoal group-hover:text-[#1F5E4B] font-readex transition-colors">
                  فرع سمنود والمحلة الكبرى
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-[#1F5E4B] font-bold">
                  متاح الآن
                </span>
              </div>
              <p className="text-xs text-charcoal/60 pr-6">
                طريق سمنود - المحلة • أرقام الهاتف: 01287153339 / 01098199288
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 self-end sm:self-auto px-3.5 py-2 rounded-lg bg-[#25D366] text-white text-xs font-bold group-hover:bg-[#1eb956] shadow-sm transition-colors shrink-0">
              <MessageCircle className="w-3.5 h-3.5 shrink-0" />
              <span>واتساب سمنود والمحلة</span>
            </div>
          </button>
        </div>

        {/* Footer cancel button */}
        <div className="pt-4 mt-4 flex items-center justify-end border-t border-charcoal/10">
          <button
            type="button"
            onClick={onClose}
            className="text-xs sm:text-sm text-charcoal/60 hover:text-charcoal hover:bg-charcoal/5 px-4 py-2 rounded-xl transition-colors cursor-pointer font-medium"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}
