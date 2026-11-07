"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, User, Menu, X, Sparkles } from "lucide-react";

interface HeaderProps {
  onOpenConsultation?: () => void;
}

export function Header({ onOpenConsultation }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isProductsActive = pathname === "/products";
  const isHomeActive = pathname === "/";

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 sm:h-18 max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between gap-4 sm:gap-6">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="relative h-9 w-9 sm:h-10 sm:w-10 shrink-0 overflow-hidden rounded-lg">
            <Image
              src="/images/logo.png"
              alt="شعار مطابخ الشويمي | Al Shewimy Kitchens"
              width={40}
              height={40}
              className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
              priority
            />
          </div>
          <span className="text-base sm:text-lg text-primary tracking-tight font-bold font-readex">
            مطابخ الشويمي
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden lg:flex items-center gap-5 xl:gap-7"
          aria-label="قائمة التصفح الرئيسية"
        >
          <Link
            href="/"
            className={`transition-colors py-1.5 px-3 rounded-lg text-xs sm:text-sm font-semibold ${
              isHomeActive
                ? "bg-surface-container-high text-on-surface font-bold"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            الرئيسية
          </Link>

          {/* Dedicated Products Tab */}
          <Link
            href="/products"
            className={`transition-all py-1.5 px-3.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 ${
              isProductsActive
                ? "bg-primary text-on-primary shadow-sm"
                : "text-primary hover:bg-surface-container-high hover:text-secondary"
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${isProductsActive ? "text-secondary-fixed" : "text-secondary"}`} />
            <span>المنتجات</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-secondary/15 text-secondary font-bold">
              الكتالوج
            </span>
          </Link>

          <Link
            href="/#portfolio-section"
            className="text-xs sm:text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors py-1.5 px-2.5"
          >
            أعمالنا المنفذة
          </Link>

          <Link
            href="/#journey-section"
            className="text-xs sm:text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors py-1.5 px-2.5"
          >
            مصانعنا
          </Link>

          <Link
            href="/#branches-section"
            className="text-xs sm:text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors py-1.5 px-2.5"
          >
            فروعنا
          </Link>
        </nav>

        {/* CTA & Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenConsultation}
            className="inline-flex items-center gap-2 bg-[#1F5E4B] hover:bg-[#164638] text-white text-xs sm:text-sm font-semibold py-2 sm:py-2.5 px-3.5 sm:px-4.5 rounded shadow-[0_4px_12px_rgba(31,94,75,0.2)] transition-all cursor-pointer active:translate-y-0.5"
          >
            <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="hidden xs:inline">احجز معاينة مجانية</span>
            <span className="xs:hidden">معاينة</span>
          </button>

          <a
            href="tel:+201005557109"
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
            className={`block py-2 px-3 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-between ${
              isProductsActive
                ? "bg-primary text-on-primary font-bold"
                : "text-primary hover:bg-surface-container"
            }`}
          >
            <span>كتالوج المنتجات والأسعار</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary/20 text-secondary">
              جديد
            </span>
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
        </div>
      )}
    </header>
  );
}
