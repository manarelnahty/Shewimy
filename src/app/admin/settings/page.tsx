"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Layers,
  Sparkles,
  Phone,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useSiteSettings } from "@/lib/firebase/hooks";
import { updateSiteSettings } from "@/lib/firebase/firestore";
import { SiteSettings, DEFAULT_SITE_SETTINGS } from "@/types/shewimy";

export default function AdminSettingsPage() {
  const { settings, loading, refetch } = useSiteSettings();
  const [formData, setFormData] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (settings) {
      setFormData({
        ...DEFAULT_SITE_SETTINGS,
        ...settings,
        trustBarItems: settings.trustBarItems || DEFAULT_SITE_SETTINGS.trustBarItems,
      });
    }
  }, [settings]);

  const handleTrustItemChange = (index: number, field: "title" | "desc", value: string) => {
    const updated = [...formData.trustBarItems];
    if (updated[index]) {
      updated[index] = { ...updated[index], [field]: value };
      setFormData({ ...formData, trustBarItems: updated });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage(null);
      const res = await updateSiteSettings(formData);
      if (res.success) {
        setMessage({ type: "success", text: "تم تحديث إعدادات ومحتوى الموقع بنجاح!" });
        refetch();
      } else {
        setMessage({ type: "error", text: res.error || "فشل حفظ الإعدادات" });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "حدث خطأ غير متوقع" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-readex">
            إعدادات المحتوى الديناميكي (Site Settings)
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            التحكم في نصوص الهيرو، مميزات شريط الثقة، بيانات الاتصال، وسنوات الضمان
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-[#7a5b3e] hover:bg-[#8f6b49] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md transition-colors cursor-pointer disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>حفظ التعديلات في Firestore</span>
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 animate-fadeIn ${
            message.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
              : "bg-rose-500/10 border border-rose-500/20 text-rose-300"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Brand Info */}
        <div className="bg-[#0c1217] border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white font-readex flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <span>معلومات وهوية العلامة التجارية</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                الاسم التجاري للمنصة
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                className="w-full bg-[#131a21] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#7a5b3e]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                سنوات الضمان الافتراضية
              </label>
              <input
                type="number"
                value={formData.defaultWarrantyYears}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    defaultWarrantyYears: Number(e.target.value),
                  })
                }
                className="w-full bg-[#131a21] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#7a5b3e]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                رقم الهاتف الرئيسي للخدمة
              </label>
              <input
                type="text"
                value={formData.phonePrimary}
                onChange={(e) =>
                  setFormData({ ...formData, phonePrimary: e.target.value })
                }
                className="w-full bg-[#131a21] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#7a5b3e]"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                البريد الإلكتروني المعتمد
              </label>
              <input
                type="email"
                value={formData.emailPrimary}
                onChange={(e) =>
                  setFormData({ ...formData, emailPrimary: e.target.value })
                }
                className="w-full bg-[#131a21] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#7a5b3e]"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        {/* Hero Section Dynamic Texts */}
        <div className="bg-[#0c1217] border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white font-readex flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#d4af37]" />
            <span>نصوص الواجهة الرئيسية (Hero Section)</span>
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  العنوان الرئيسي (Headline)
                </label>
                <input
                  type="text"
                  value={formData.heroHeadline}
                  onChange={(e) =>
                    setFormData({ ...formData, heroHeadline: e.target.value })
                  }
                  className="w-full bg-[#131a21] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#7a5b3e]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  سنوات الخبرة (بالشارة)
                </label>
                <input
                  type="number"
                  value={formData.heroExperienceYears}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      heroExperienceYears: Number(e.target.value),
                    })
                  }
                  className="w-full bg-[#131a21] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#7a5b3e]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                الوصف الترويجي في الهيرو (Subheadline)
              </label>
              <textarea
                rows={3}
                value={formData.heroSubheadline}
                onChange={(e) =>
                  setFormData({ ...formData, heroSubheadline: e.target.value })
                }
                className="w-full bg-[#131a21] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#7a5b3e]"
              />
            </div>
          </div>
        </div>

        {/* Trust Bar Features */}
        <div className="bg-[#0c1217] border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white font-readex flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
            <span>بطاقات الثقة والمميزات الأربعة (Trust Bar)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {formData.trustBarItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#131a21] border border-white/5 rounded-xl p-4 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#d4af37]">
                    البطاقة #{idx + 1}
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">
                    العنوان
                  </label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) =>
                      handleTrustItemChange(idx, "title", e.target.value)
                    }
                    className="w-full bg-[#0c1217] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7a5b3e]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">
                    الوصف المختصر
                  </label>
                  <textarea
                    rows={2}
                    value={item.desc}
                    onChange={(e) =>
                      handleTrustItemChange(idx, "desc", e.target.value)
                    }
                    className="w-full bg-[#0c1217] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7a5b3e]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#7a5b3e] hover:bg-[#8f6b49] text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-xl shadow-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>حفظ الإعدادات والمزامنة الفورية</span>
          </button>
        </div>
      </form>
    </div>
  );
}
