"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/common/Button";
import { Phone, Menu, X, Compass, ShieldCheck } from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "الرئيسية", href: "#hero" },
    { name: "أعمالنا والمجموعات", href: "#portfolio" },
    { name: "فروعنا والمعارض", href: "#branches" },
    { name: "عن الشويحي", href: "#trust" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-alabaster/90 border-b border-charcoal/10 transition-colors">
      {/* Top micro bar for direct contact / emergency line */}
      <div className="bg-charcoal text-alabaster text-xs py-1.5 px-4">
        <Container className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-alabaster/80">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-bronze" />
              ضمان حقيقي يصل إلى 10 سنوات على الأخشاب الطبيعية
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <a
              href="tel:+201000000000"
              className="hover:text-bronze transition-colors flex items-center gap-1.5"
            >
              <Phone className="w-3 h-3 text-bronze" />
              <span>الخط الساخن: 19XXX</span>
            </a>
          </div>
        </Container>
      </div>

      {/* Main navigation bar */}
      <Container className="flex items-center justify-between h-20">
        {/* Brand identity */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze rounded-lg"
          aria-label="الشويحي للأثاث - الصفحة الرئيسية"
        >
          <div className="w-11 h-11 rounded-xl bg-charcoal text-bronze flex items-center justify-center font-bold text-xl shadow-md group-hover:bg-charcoal-700 transition-colors">
            <Compass className="w-6 h-6 text-bronze group-hover:rotate-45 transition-transform duration-300" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-charcoal font-readex">
              الشويحي
            </span>
            <span className="text-[10px] sm:text-xs text-bronze font-semibold tracking-wider">
              للأثاث والأعمال الخشبية المعمارية
            </span>
          </div>
        </Link>

        {/* Desktop navigation links */}
        <nav
          className="hidden md:flex items-center gap-8"
          aria-label="قائمة التصفح الرئيسية"
        >
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-semibold text-charcoal/80 hover:text-bronze transition-colors duration-150 relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-bronze after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <a
            href="https://wa.me/201000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex"
          >
            <Button variant="emerald" size="sm" icon={<Phone className="w-3.5 h-3.5" />}>
              طلب استشارة وتصميم
            </Button>
          </a>

          {/* Mobile menu trigger */}
          <button
            type="button"
            className="md:hidden p-2.5 rounded-lg text-charcoal hover:bg-charcoal/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-bronze"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </Container>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-charcoal/10 bg-alabaster px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-2">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 text-base font-semibold text-charcoal hover:bg-charcoal/5 rounded-lg transition-colors"
              >
                {item.name}
              </a>
            ))}
          </nav>
          <div className="pt-2">
            <a
              href="https://wa.me/201000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button variant="emerald" size="md" className="w-full">
                طلب استشارة وتصميم
              </Button>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
