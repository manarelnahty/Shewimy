"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, User, Menu, X } from "lucide-react";

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
      <div className="h-20 sm:h-22 lg:h-24 max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between gap-4 sm:gap-6">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3.5 sm:gap-4 shrink-0 group">
          <div className="relative h-14 w-14 sm:h-16 sm:w-16 lg:h-18 lg:w-18 shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/images/logo.png"
              alt="شعار مطابخ الشويمي | Al Shewimy Kitchens"
              width={80}
              height={80}
              className="h-full w-full object-contain drop-shadow-sm"
              priority
            />
          </div>
          <span className="text-xl sm:text-2xl text-primary tracking-tight font-black font-readex">
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
          <button
            type="button"
            onClick={onOpenConsultation}
            className="inline-flex items-center gap-2 bg-[#1F5E4B] hover:bg-[#164638] text-white text-xs sm:text-sm font-semibold py-2.5 px-5 rounded-lg shadow-[0_4px_12px_rgba(31,94,75,0.2)] transition-all cursor-pointer active:translate-y-0.5 whitespace-nowrap"
          >
            <Phone className="w-4 h-4 shrink-0" />
            <span>احجز معاينة مجانية</span>
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
        </div>
      )}
    </header>
  );
}
