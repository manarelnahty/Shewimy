"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lock, Mail, ArrowRight, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { useAdminAuth } from "@/lib/firebase/hooks";

export default function AdminLoginPage() {
  const { login, loginDemo } = useAdminAuth();

  const [email, setEmail] = useState("admin@shewimy.com");
  const [password, setPassword] = useState("Shewimy@2026");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/account?_t=" + Date.now())
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.account?.email) {
          setEmail(data.account.email);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await login(email, password);
      if (res.success) {
        window.location.href = "/admin";
      } else {
        setError(res.error || "تعذر تسجيل الدخول");
      }
    } catch (err: any) {
      setError(err?.message || "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = () => {
    loginDemo();
    window.location.href = "/admin";
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-cairo text-[#1b1c1a]">
      {/* Subtle Ambient Decorative Accents */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#855224]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-[#1F5E4B]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-white border border-[#e7e5e0] rounded-2xl p-6 sm:p-8 shadow-xl relative z-10">
        {/* Brand Header & Real Shewimy Logo */}
        <div className="text-center mb-7">
          <div className="relative h-16 w-16 mx-auto mb-3.5 bg-[#f8f6f2] p-2 rounded-2xl shadow-xs border border-[#e7e5e0] flex items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="شعار مطابخ الشويمي"
              width={54}
              height={54}
              style={{ width: "auto", height: "auto" }}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1b1c1a] font-readex tracking-tight">
            لوحة الإدارة الذكية
          </h1>
          <p className="text-xs text-[#5e6368] mt-1.5 font-medium">
            مطابخ وديكورات الشويمي • منصة التحكم السحابية
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1b1c1a] mb-1.5 font-readex">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@shewimy.com"
                required
                className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-4 py-2.5 pl-10 text-xs sm:text-sm text-[#1b1c1a] placeholder-[#9ca3af] focus:outline-none focus:border-[#855224] focus:ring-1 focus:ring-[#855224] transition-all"
                dir="ltr"
              />
              <Mail className="w-4 h-4 text-[#855224] absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1b1c1a] mb-1.5 font-readex">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-4 py-2.5 pl-10 text-xs sm:text-sm text-[#1b1c1a] placeholder-[#9ca3af] focus:outline-none focus:border-[#855224] focus:ring-1 focus:ring-[#855224] transition-all"
                dir="ltr"
              />
              <Lock className="w-4 h-4 text-[#855224] absolute left-3.5 top-3" />
            </div>
          </div>

          {/* Primary CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#1F5E4B] hover:bg-[#164638] text-white font-medium py-3 rounded-xl shadow-md hover:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs sm:text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري التحقق...</span>
              </>
            ) : (
              <span>تسجيل الدخول</span>
            )}
          </button>
        </form>

        {/* Quick Demo Access Button */}
        <div className="mt-5 pt-5 border-t border-[#e7e5e0] text-center">
          <p className="text-[11px] text-[#5e6368] mb-2.5">
            للدخول الفوري والإدارة السريعة:
          </p>
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full bg-[#f5f3ef] hover:bg-[#eae8e4] border border-[#d6d3cd] text-[#1b1c1a] text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer font-medium"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#855224]" />
            <span>تسجيل دخول فوري بصلاحية المسؤول (Admin)</span>
          </button>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#5e6368] hover:text-[#1b1c1a] font-medium transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة إلى الصفحة الرئيسية</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
