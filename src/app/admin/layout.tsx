"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  Layers,
} from "lucide-react";
import { useAdminAuth } from "@/lib/firebase";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, isAuthenticated, logout } = useAdminAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If on login page, render bare layout
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-[#070b0e] text-white">{children}</div>;
  }

  // Guard: if unauthenticated and finished loading, show prompt or redirect
  if (!loading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070b0e] flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="w-16 h-16 rounded-2xl bg-[#7a5b3e]/20 border border-[#7a5b3e]/40 flex items-center justify-center text-[#d4af37] mb-4">
          <Shield className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold font-readex mb-2">منطقة الإدارة محمية</h1>
        <p className="text-gray-400 max-w-sm mb-6 text-sm">
          يرجى تسجيل الدخول بحساب مسؤول لوحة تحكم مطابخ وديكورات الشويمي للمتابعة.
        </p>
        <Link
          href="/admin/login"
          className="inline-flex items-center justify-center bg-[#7a5b3e] hover:bg-[#8f6b49] text-white font-medium px-6 py-2.5 rounded-lg shadow-lg transition-colors text-sm"
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
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#070b0e] text-gray-100 flex flex-col lg:flex-row antialiased font-cairo">
      {/* Mobile Top Header */}
      <header className="lg:hidden flex items-center justify-between px-5 py-4 bg-[#0d1318] border-b border-white/10 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#7a5b3e] flex items-center justify-center text-white font-bold font-readex">
            ش
          </div>
          <div>
            <h2 className="text-sm font-bold text-white font-readex">الشويمي</h2>
            <p className="text-[11px] text-gray-400">لوحة الإدارة الذكية</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-white/5 text-gray-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } lg:flex lg:flex-col lg:w-72 bg-[#0c1217] border-l border-white/10 shrink-0 z-40 fixed lg:sticky top-0 h-auto lg:h-screen w-full`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10 hidden lg:flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7a5b3e] to-[#a37953] flex items-center justify-center text-white font-bold text-lg font-readex shadow-md">
              ش
            </div>
            <div>
              <h1 className="text-base font-bold text-white font-readex tracking-tight">
                مطابخ الشويمي
              </h1>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-[#d4af37]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
                لوحة الإدارة السحابية
              </span>
            </div>
          </div>
        </div>

        {/* User Info Bar */}
        <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
          <p className="text-xs text-gray-400">مرحباً بك،</p>
          <p className="text-sm font-semibold text-gray-200 truncate">
            {user?.email || "مدير النظام"}
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
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#7a5b3e] text-white shadow-lg shadow-[#7a5b3e]/20"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className={isActive ? "text-white" : "text-[#a37953]"}>
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors border border-white/5"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-gray-400" />
              مشاهدة الموقع الحي
            </span>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300">
              Live
            </span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-xs text-rose-300 hover:text-rose-100 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto p-5 sm:p-8 lg:p-10 bg-[#070b0e]">
        {children}
      </main>
    </div>
  );
}
