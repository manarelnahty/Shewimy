"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
  onOpenConsultation?: () => void;
}

export function Header({ onOpenConsultation }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 max-w-[1380px] mx-auto px-6 lg:px-12 flex items-center justify-between gap-6">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3.5 shrink-0 group">
          <div className="relative h-10 w-10 sm:h-11 sm:w-11 shrink-0 overflow-hidden rounded-lg">
            <Image
              src="/images/logo.png"
              alt="شعار مطابخ الشويمي | Al Shewimy Kitchens"
              width={44}
              height={44}
              className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
              priority
            />
          </div>
          <span className="font-title text-title text-primary tracking-tight font-bold font-readex">
            مطابخ الشويمي
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden lg:flex items-center gap-8"
          aria-label="قائمة التصفح الرئيسية"
        >
          <a
            href="#"
            className="transition-colors py-2 px-3 bg-surface-container-high text-on-surface font-bold rounded-lg text-sm"
          >
            الرئيسية
          </a>
          <a
            href="#portfolio-section"
            className="font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors py-2 px-3"
          >
            مطابخ حديثة
          </a>
          <a
            href="#portfolio-section"
            className="font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors py-2 px-3"
          >
            دريسينج روم
          </a>
          <a
            href="#journey-section"
            className="font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors py-2 px-3"
          >
            مصانعنا
          </a>
          <a
            href="#branches-section"
            className="font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors py-2 px-3"
          >
            فروعنا
          </a>
        </nav>

        {/* CTA & Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenConsultation}
            className="inline-flex items-center gap-2 bg-[#1F5E4B] hover:bg-[#164638] text-white font-label-lg text-label-lg py-2.5 px-4 sm:px-5 rounded shadow-[0_4px_12px_rgba(31,94,75,0.2)] transition-all cursor-pointer active:translate-y-0.5"
          >
            <span className="material-symbols-outlined text-[20px]">call</span>
            <span className="hidden xs:inline">احجز معاينة مجانية</span>
            <span className="xs:hidden">معاينة</span>
          </button>

          <a
            href="tel:+201002345678"
            aria-label="اتصال مباشر"
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary hover:bg-primary-container transition-colors"
          >
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </a>

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-container-lowest border-t border-surface-container px-6 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <a
            href="#"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 px-3 rounded-lg bg-surface-container-high text-primary font-bold text-sm"
          >
            الرئيسية
          </a>
          <a
            href="#portfolio-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 px-3 rounded-lg text-on-surface-variant hover:bg-surface-container text-sm"
          >
            مطابخ حديثة
          </a>
          <a
            href="#portfolio-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 px-3 rounded-lg text-on-surface-variant hover:bg-surface-container text-sm"
          >
            دريسينج روم
          </a>
          <a
            href="#journey-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 px-3 rounded-lg text-on-surface-variant hover:bg-surface-container text-sm"
          >
            مصانعنا
          </a>
          <a
            href="#branches-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 px-3 rounded-lg text-on-surface-variant hover:bg-surface-container text-sm"
          >
            فروعنا
          </a>
        </div>
      )}
    </header>
  );
}
