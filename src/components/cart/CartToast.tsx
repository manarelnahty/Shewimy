"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Check, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/lib/cart";

export function CartToast() {
  const { recentlyAddedItem, clearRecentlyAdded, openCart } = useCart();

  useEffect(() => {
    if (!recentlyAddedItem) return;
    const timer = setTimeout(() => {
      clearRecentlyAdded();
    }, 4500);
    return () => clearTimeout(timer);
  }, [recentlyAddedItem, clearRecentlyAdded]);

  if (!recentlyAddedItem) return null;

  return (
    <div
      dir="rtl"
      className="fixed bottom-6 left-6 z-50 max-w-sm w-full bg-white rounded-2xl shadow-2xl border border-emerald-200 p-3.5 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-stone-100 border border-stone-200">
        <Image
          src={recentlyAddedItem.coverImage}
          alt={recentlyAddedItem.name}
          fill
          sizes="48px"
          className="object-cover"
        />
      </div>

      <div className="flex-1 min-w-0 space-y-0.5">
        <div className="flex items-center gap-1.5 text-emerald-700 text-[11px] font-bold">
          <Check className="w-3.5 h-3.5" />
          <span>تمت الإضافة لسلة الطلبات</span>
        </div>
        <p className="text-xs font-bold text-[#1b1c1a] truncate font-readex">
          {recentlyAddedItem.name}
        </p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => {
            clearRecentlyAdded();
            openCart();
          }}
          className="bg-[#1F5E4B] hover:bg-[#164638] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          عرض السلة
        </button>
        <button
          type="button"
          onClick={clearRecentlyAdded}
          aria-label="إغلاق التنبيه"
          className="w-6 h-6 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-700 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
