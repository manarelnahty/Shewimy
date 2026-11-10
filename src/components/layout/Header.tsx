"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, User, Menu, X, ShoppingBag } from "lucide-react";
import { ConsultationDrawer } from "@/components/common/ConsultationDrawer";
import { useCart } from "@/lib/cart";
import { useBranches } from "@/lib/firebase";

interface HeaderProps {
  onOpenConsultation?: () => void;
}

export function Header({ onOpenConsultation }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [internalConsultationOpen, setInternalConsultationOpen] = useState(false);
  const pathname = usePathname();
  const { openCart, totalCount } = useCart();
  const { branches } = useBranches();
  const primaryPhone = branches[0]?.phones?.[0] ?? "201005557109";

  const isProductsActive = pathname === "/products";
  const isHomeActive = pathname === "/";

  const handleOpenConsultation = () => {
    if (onOpenConsultation) {
      onOpenConsultation();
      return;
    }

    let handled = false;
    if (typeof window !== "undefined") {
      const event = new CustomEvent("shewimy_open_consultation", {
        cancelable: true,
      });
      window.dispatchEvent(event);
      if (event.defaultPrevented) {
        handled = true;
      }
    }

    if (!handled) {
      setInternalConsultationOpen(true);
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between gap-4 sm:gap-6">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="relative h-10 w-auto shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/images/logo.png"
              alt="شعار مطابخ الشويمي | Al Shewimy Kitchens"
              width={40}
              height={40}
              style={{ width: "auto" }}
              className="h-10 w-auto object-contain drop-shadow-sm"
              priority
            />
          </div>
          <span className="text-lg font-bold text-primary tracking-tight font-readex">
            مطابخ الشويمي
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden lg:flex items-center gap-8"
          aria-label="قائمة التصفح الرئيسية"
        >
          <Link
            href="/"
            className={`transition-colors py-1 px-0.5 text-xs sm:text-sm ${
              isHomeActive
                ? "text-primary font-semibold relative after:absolute after:bottom-[-4px] after:inset-x-0 after:h-[2px] after:bg-[#1F5E4B]"
                : "text-on-surface-variant hover:text-on-surface font-medium"
            }`}
          >
            الرئيسية
          </Link>

          {/* Dedicated Products Tab */}
          <Link
            href="/products"
            className={`transition-colors py-1 px-0.5 text-xs sm:text-sm ${
              isProductsActive
                ? "text-primary font-semibold relative after:absolute after:bottom-[-4px] after:inset-x-0 after:h-[2px] after:bg-[#1F5E4B]"
                : "text-on-surface-variant hover:text-on-surface font-medium"
            }`}
          >
            المنتجات
          </Link>

          <Link
            href="/#portfolio-section"
            className="text-xs sm:text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors py-1 px-0.5"
          >
            أعمالنا المنفذة
          </Link>

          <Link
            href="/#journey-section"
            className="text-xs sm:text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors py-1 px-0.5"
          >
            مصانعنا
          </Link>

          <Link
            href="/#branches-section"
            className="text-xs sm:text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors py-1 px-0.5"
          >
            فروعنا
          </Link>
        </nav>

        {/* CTA & Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Cart Drawer Trigger */}
          <button
            type="button"
            onClick={openCart}
            aria-label="سلة الطلبات والموديلات"
            className="relative p-2 sm:p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-[#1b1c1a] hover:text-[#1F5E4B] transition-all cursor-pointer border border-stone-200/80 flex items-center justify-center group active:scale-95"
            title="سلة الطلبات والموديلات"
          >
            <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform group-hover:scale-110" />
            {totalCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#855224] text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-in zoom-in font-readex">
                {totalCount > 9 ? "9+" : totalCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={handleOpenConsultation}
            className="inline-flex items-center gap-2 bg-[#1F5E4B] hover:bg-[#164638] text-white text-xs sm:text-sm font-semibold py-2.5 px-5 rounded-lg shadow-[0_4px_12px_rgba(31,94,75,0.2)] transition-all cursor-pointer active:translate-y-0.5 whitespace-nowrap animate-glow-emerald hover:-translate-y-0.5"
          >
            <Phone className="w-4 h-4 shrink-0 animate-pulse-subtle" />
            <span>احجز معاينة</span>
          </button>

          <a
            href={`tel:+${primaryPhone}`}
            aria-label="اتصال بالفرع"
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary hover:bg-primary-container transition-colors"
          >
            <User className="w-4 h-4 text-on-primary" />
          </a>

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            className="lg:hidden p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-container-lowest border-t border-surface-container px-5 py-3 space-y-1.5 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block py-2 px-3 rounded-lg text-xs sm:text-sm ${
              isHomeActive
                ? "bg-surface-container-high text-primary font-bold"
                : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            الرئيسية
          </Link>
          <Link
            href="/products"
            onClick={() => setMobileMenuOpen(false)}
            className={`block py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold ${
              isProductsActive
                ? "bg-surface-container-high text-primary font-bold"
                : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            المنتجات
          </Link>
          <Link
            href="/#portfolio-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 rounded-lg text-on-surface-variant hover:bg-surface-container text-xs sm:text-sm"
          >
            أعمالنا المنفذة
          </Link>
          <Link
            href="/#journey-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 rounded-lg text-on-surface-variant hover:bg-surface-container text-xs sm:text-sm"
          >
            مصانعنا
          </Link>
          <Link
            href="/#branches-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 rounded-lg text-on-surface-variant hover:bg-surface-container text-xs sm:text-sm"
          >
            فروعنا
          </Link>

          <div className="pt-2 border-t border-surface-container mt-2 space-y-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openCart();
              }}
              className="w-full inline-flex items-center justify-between bg-stone-100 hover:bg-stone-200 text-[#1b1c1a] text-xs sm:text-sm font-semibold py-2.5 px-4 rounded-lg transition-all"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#1F5E4B]" />
                <span>سلة الطلبات والموديلات</span>
              </div>
              {totalCount > 0 && (
                <span className="bg-[#855224] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {totalCount} موديل
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                handleOpenConsultation();
              }}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#1F5E4B] hover:bg-[#164638] text-white text-xs sm:text-sm font-semibold py-2.5 px-4 rounded-lg shadow-sm transition-all"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>احجز معاينة</span>
            </button>
          </div>
        </div>
      )}

      {/* Internal Fallback Consultation Drawer (Active when no consumer catches the event) */}
      {internalConsultationOpen && (
        <ConsultationDrawer
          isOpen={internalConsultationOpen}
          onClose={() => setInternalConsultationOpen(false)}
        />
      )}
    </header>
  );
}
