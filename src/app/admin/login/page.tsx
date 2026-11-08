"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Lock, Mail, ArrowRight, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { useAdminAuth } from "@/lib/firebase";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAdminAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        router.push("/admin");
      } else {
        setError(res.error || "تعذر تسجيل الدخول");
      }
    } catch (err: any) {
      setError(err?.message || "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setEmail("admin@shewimy.com");
    setPassword("Shewimy@2026");
    setLoading(true);
    setError(null);
    const res = await login("admin@shewimy.com", "Shewimy@2026");
    setLoading(false);
    if (res.success) {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-[#070b0e] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-cairo">
      {/* Decorative Glows */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#7a5b3e]/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-[#1F5E4B]/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#0c1217] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10 backdrop-blur-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#7a5b3e] to-[#a37953] flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-[#7a5b3e]/30">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white font-readex tracking-tight">
            لوحة الإدارة الذكية
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1.5">
            مطابخ وديكورات الشويمي • منصة التحكم السحابية
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200 text-xs flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@shewimy.com"
                required
                className="w-full bg-[#131a21] border border-white/10 rounded-xl px-4 py-3 pl-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#7a5b3e] focus:ring-1 focus:ring-[#7a5b3e] transition-all"
                dir="ltr"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#131a21] border border-white/10 rounded-xl px-4 py-3 pl-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#7a5b3e] focus:ring-1 focus:ring-[#7a5b3e] transition-all"
                dir="ltr"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#7a5b3e] hover:bg-[#8f6b49] text-white font-medium py-3 rounded-xl shadow-lg shadow-[#7a5b3e]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري تسجيل الدخول...</span>
              </>
            ) : (
              <span>تسجيل الدخول</span>
            )}
          </button>
        </form>

        {/* Quick Demo Access Button */}
        <div className="mt-5 pt-5 border-t border-white/10 text-center">
          <p className="text-[11px] text-gray-400 mb-3">
            للتجربة السريعة والإدارة الفورية دون تسجيل في الكونسول:
          </p>
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            disabled={loading}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>تسجيل دخول سريع بصلاحية المسؤول (Admin)</span>
          </button>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة إلى الموقع الرئيسي</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
