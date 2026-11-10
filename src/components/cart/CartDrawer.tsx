"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  Banknote,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import { useCart } from "@/lib/cart";
import { CheckoutModal } from "./CheckoutModal";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
    totalCount,
    estimatedTotal,
    hasQuoteOnlyItems,
  } = useCart();

  const [checkoutOpen, setCheckoutOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Drawer Panel */}
      <aside
        className="fixed inset-y-0 left-0 z-60 w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out border-r border-[#e7e5e0]"
        dir="rtl"
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#e7e5e0] flex items-center justify-between bg-[#fbf9f5]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#1F5E4B] text-white flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#1b1c1a] font-readex">
                  سلة الطلبات والموديلات
                </h3>
                <span className="text-[11px] font-bold bg-[#1F5E4B]/10 text-[#1F5E4B] px-2 py-0.5 rounded-full">
                  {totalCount} موديل
                </span>
              </div>
              <p className="text-[11px] text-[#5e6368]">
                الدفع نقداً فقط عند المعاينة وتوقيع العقد
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeCart}
            aria-label="إغلاق السلة"
            className="w-8 h-8 rounded-full bg-white border border-[#e7e5e0] hover:bg-[#f0eee9] flex items-center justify-center text-[#5e6368] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-[#fbf9f5] border border-[#e7e5e0] flex items-center justify-center text-stone-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-[#1b1c1a] font-readex">
                سلة الطلبات فارغة حالياً
              </h4>
              <p className="text-xs text-[#5e6368] max-w-xs leading-relaxed">
                استعرض كتالوج مطابخ وأثاث الشويمي وأضف الموديلات التي ترغب في معاينتها وطلب تسعيرها.
              </p>
            </div>
            <Link
              href="/products"
              onClick={closeCart}
              className="inline-flex items-center gap-2 bg-[#1F5E4B] hover:bg-[#164638] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-xs"
            >
              <span>تصفح كتالوج الموديلات</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 divide-y divide-[#f0eee9]">
            {/* List of items */}
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-[#fbf9f5] border border-[#e7e5e0] flex gap-3 items-center"
                >
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-stone-200 border border-stone-200">
                    <Image
                      src={item.coverImage}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-mono text-[#855224] bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        {item.code}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                        title="حذف من السلة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="text-xs font-bold text-[#1b1c1a] truncate font-readex">
                      {item.name}
                    </h4>

                    {item.selectedMaterial && (
                      <p className="text-[10px] text-[#5e6368] truncate">
                        الخامة: {item.selectedMaterial}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-bold text-[#1F5E4B]">
                        {item.price > 0
                          ? `${(item.price * item.quantity).toLocaleString("ar-EG")} ج.م`
                          : item.priceDisplay}
                      </span>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-1.5 bg-white border border-[#d6d3cd] rounded-lg px-2 py-0.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-stone-500 hover:text-[#1b1c1a] p-0.5 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-stone-500 hover:text-[#1b1c1a] p-0.5 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cash Only & Price Notice Cards */}
            <div className="pt-4 space-y-2.5">
              {/* Cash Notice */}
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-2.5">
                <Banknote className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-xs text-emerald-950">
                  <p className="font-bold">طريقة الدفع: نقداً فقط (Cash Only)</p>
                  <p className="text-[11px] text-emerald-900/80 leading-relaxed">
                    يتم سداد دفعة التعاقد نقداً عند موعد المعاينة الهندسية وتوقيع العقد الرسمي.
                  </p>
                </div>
              </div>

              {/* Price Disclaimer */}
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-xs text-amber-950">
                  <p className="font-bold">ملاحظة معمارية بخصوص الأسعار</p>
                  <p className="text-[10px] text-amber-900/80 leading-relaxed">
                    الأسعار استرشادية لمساحات قياسية، وتتغير القيمة الفعلية وفقاً للرفع الهندسي
                    الدقيق لمساحتكم على الطبيعة والخامات والميكانزمات المختارة.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#5e6368] pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1F5E4B]" />
                  <span>ضمان رسمي موثق بعقد</span>
                </span>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-stone-400 hover:text-rose-600 underline cursor-pointer"
                >
                  إفراغ السلة
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Drawer Footer (Actions & Total) */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[#e7e5e0] bg-[#fbf9f5] space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-[#5e6368] block">إجمالي السعر الاسترشادي:</span>
                <span className="text-[10px] text-amber-800 font-semibold">
                  {hasQuoteOnlyItems ? "* يشمل قطع تتحدد بالمقايسة" : "* خاضع للرفع الهندسي"}
                </span>
              </div>
              <div className="text-left" dir="ltr">
                <span className="text-lg sm:text-xl font-extrabold text-[#1b1c1a] font-readex">
                  {estimatedTotal > 0
                    ? `${estimatedTotal.toLocaleString("ar-EG")} ج.م`
                    : "حسب الرفع الهندسي"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCheckoutOpen(true)}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#1F5E4B] hover:bg-[#164638] text-white text-xs sm:text-sm font-bold py-3.5 px-6 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <span>متابعة تأكيد الطلب وحجز المعاينة</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        )}
      </aside>

      {/* Checkout Modal */}
      <CheckoutModal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </>
  );
}
