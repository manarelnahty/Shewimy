"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  CalendarCheck,
  Building2,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
} from "lucide-react";
import { useAdminAuth } from "@/lib/firebase/hooks";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, isAuthenticated, logout } = useAdminAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If on login page, render bare layout in light mode
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">{children}</div>;
  }

  // Guard: if unauthenticated and finished loading, show prompt or redirect
  if (!loading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fbf9f5] flex flex-col items-center justify-center p-6 text-center text-[#1b1c1a]">
        <div className="w-16 h-16 rounded-2xl bg-[#855224]/10 border border-[#855224]/20 flex items-center justify-center text-[#855224] mb-4 shadow-sm">
          <Shield className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold font-readex text-[#1b1c1a] mb-2">منطقة الإدارة محمية</h1>
        <p className="text-[#5e6368] max-w-sm mb-6 text-sm">
          يرجى تسجيل الدخول بحساب مسؤول لوحة تحكم مطابخ وديكورات الشويمي للمتابعة.
        </p>
        <Link
          href="/admin/login"
          className="inline-flex items-center justify-center bg-[#1F5E4B] hover:bg-[#164638] text-white font-medium px-6 py-2.5 rounded-xl shadow-md transition-all text-sm cursor-pointer"
        >
          الانتقال إلى صفحة تسجيل الدخول
        </Link>
      </div>
    );
  }

  const navLinks = [
    {
      href: "/admin",
      label: "لوحة التحكم العامة",
      icon: <LayoutDashboard className="w-5 h-5" />,
      exact: true,
    },
    {
      href: "/admin/products",
      label: "إدارة المنتجات والكتالوج",
      icon: <Package className="w-5 h-5" />,
      exact: false,
    },
    {
      href: "/admin/requests",
      label: "طلبات المعاينة والحجز",
      icon: <CalendarCheck className="w-5 h-5" />,
      exact: false,
    },
    {
      href: "/admin/branches",
      label: "إدارة الفروع والمعارض",
      icon: <Building2 className="w-5 h-5" />,
      exact: false,
    },
    {
      href: "/admin/settings",
      label: "إعدادات محتوى الموقع",
      icon: <Settings className="w-5 h-5" />,
      exact: false,
    },
  ];

  const handleLogout = async () => {
    await logout();
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a] flex flex-col lg:flex-row antialiased font-cairo">
      {/* Mobile Top Header */}
      <header className="lg:hidden flex items-center justify-between px-5 py-4 bg-white text-[#1b1c1a] sticky top-0 z-50 shadow-sm border-b border-[#e7e5e0]">
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 bg-[#f8f6f2] rounded-lg p-1 shrink-0 flex items-center justify-center border border-[#e7e5e0]">
            <Image
              src="/images/logo.png"
              alt="الشويمي"
              width={32}
              height={32}
              style={{ width: "auto", height: "auto" }}
              className="object-contain"
            />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#1b1c1a] font-readex">مطابخ الشويمي</h2>
            <p className="text-[11px] text-[#855224] font-medium">لوحة الإدارة السحابية</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-[#f5f3ef] text-[#1b1c1a] hover:bg-[#eae8e4] transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Light Mode Elegant Sidebar */}
      <aside
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } lg:flex lg:flex-col lg:w-72 bg-white text-[#1b1c1a] shrink-0 z-40 fixed lg:sticky top-0 h-auto lg:h-screen w-full shadow-sm border-l border-[#e7e5e0]`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-[#e7e5e0] hidden lg:flex items-center justify-between bg-white">
          <div className="flex items-center gap-3.5">
            <div className="relative h-11 w-11 rounded-xl bg-[#f8f6f2] border border-[#e7e5e0] p-1.5 shrink-0 flex items-center justify-center shadow-xs">
              <Image
                src="/images/logo.png"
                alt="شعار مطابخ الشويمي"
                width={38}
                height={38}
                style={{ width: "auto", height: "auto" }}
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-base font-bold text-[#1b1c1a] font-readex tracking-tight">
                مطابخ الشويمي
              </h1>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-[#855224] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#855224] animate-pulse" />
                لوحة الإدارة السحابية
              </span>
            </div>
          </div>
        </div>

        {/* User Info Bar */}
        <div className="px-6 py-4 border-b border-[#e7e5e0] bg-[#faf8f5]">
          <p className="text-[11px] text-[#6e7276]">مرحباً بك،</p>
          <p className="text-xs font-semibold text-[#1b1c1a] truncate font-readex">
            {user?.email || "مدير النظام (الشويمي)"}
          </p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#1F5E4B] text-white shadow-md shadow-[#1F5E4B]/20 font-semibold"
                    : "text-[#44474a] hover:text-[#1b1c1a] hover:bg-[#f5f3ef]"
                }`}
              >
                <span className={isActive ? "text-white" : "text-[#855224]"}>
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-[#e7e5e0] space-y-2 bg-[#faf8f5]">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-xs text-[#44474a] hover:text-[#1b1c1a] hover:bg-white transition-colors border border-[#e7e5e0] bg-white shadow-xs"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#855224]" />
              <span>مشاهدة الموقع الرئيسي</span>
            </span>
            <span className="text-[10px] bg-[#855224]/10 text-[#855224] px-2 py-0.5 rounded font-mono font-bold">
              Live
            </span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area (Clean Light Mode Canvas) */}
      <main className="flex-1 min-w-0 overflow-y-auto p-5 sm:p-8 lg:p-10 bg-[#fbf9f5]">
        {children}
      </main>
    </div>
  );
}
