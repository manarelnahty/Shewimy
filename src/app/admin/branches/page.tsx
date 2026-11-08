"use client";

import React, { useState } from "react";
import {
  Building2,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  ExternalLink,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useBranches, updateBranch } from "@/lib/firebase";
import { BranchExtended } from "@/data/branches";
import { BranchId } from "@/types/shewimy";

export default function AdminBranchesPage() {
  const { branches, loading, refetch } = useBranches();
  const [editingBranch, setEditingBranch] = useState<BranchExtended | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    address: string;
    phonesText: string;
    whatsappNumber: string;
    googleMapsUrl: string;
    workingHours: string;
    badge: string;
    regionServed: string;
  }>({
    name: "",
    address: "",
    phonesText: "",
    whatsappNumber: "",
    googleMapsUrl: "",
    workingHours: "",
    badge: "",
    regionServed: "",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const startEdit = (branch: BranchExtended) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      address: branch.address,
      phonesText: (branch.phones || []).join(", "),
      whatsappNumber: branch.whatsappNumber || "",
      googleMapsUrl: branch.googleMapsUrl || "",
      workingHours: branch.workingHours || "",
      badge: branch.badge || "",
      regionServed: branch.regionServed || "",
    });
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBranch) return;

    try {
      setSaving(true);
      setMessage(null);

      const phones = formData.phonesText
        .split(/[،,]/)
        .map((p) => p.trim())
        .filter(Boolean);

      const res = await updateBranch(editingBranch.id as BranchId, {
        name: formData.name,
        address: formData.address,
        phones: phones,
        whatsappNumber: formData.whatsappNumber.replace(/[^0-9]/g, ""),
        googleMapsUrl: formData.googleMapsUrl,
        workingHours: formData.workingHours,
        badge: formData.badge,
        regionServed: formData.regionServed,
      } as any);

      if (res.success) {
        setMessage({ type: "success", text: `تم تحديث فرع "${formData.name}" بنجاح!` });
        setEditingBranch(null);
        refetch();
      } else {
        setMessage({ type: "error", text: res.error || "فشل تحديث بيانات الفرع" });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "حدث خطأ غير متوقع" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-readex">
            إدارة الفروع والمعارض (Showroom Branches)
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            التحكم في أرقام الواتساب الموجهة، العناوين، مواعيد العمل، وروابط خرائط جوجل
          </p>
        </div>

        <div className="text-xs text-gray-400 bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl">
          الفروع النشطة: <span className="font-bold text-white font-mono">{branches.length} فروع</span>
        </div>
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

      {/* Branches Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {branches.map((b) => {
          const isSelected = editingBranch?.id === b.id;
          return (
            <div
              key={b.id}
              className={`bg-[#0c1217] border rounded-2xl p-5 flex flex-col justify-between transition-all ${
                isSelected
                  ? "border-[#7a5b3e] ring-1 ring-[#7a5b3e]"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold text-[#d4af37] bg-[#d4af37]/10 px-2.5 py-1 rounded-full">
                    {b.badge || "معرض رئيسي"}
                  </span>
                  <span className="text-xs font-mono text-gray-500 uppercase">
                    {b.id}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white font-readex mb-2">
                  {b.name}
                </h3>

                <div className="space-y-2.5 text-xs text-gray-300 border-t border-white/5 pt-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#7a5b3e] shrink-0 mt-0.5" />
                    <span>{b.address}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-mono text-gray-200">
                      {b.phones && b.phones.length > 0 ? b.phones.join(" / ") : "—"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-gray-400">واتساب التوجيه:</span>
                    <span className="font-mono text-emerald-300 font-bold" dir="ltr">
                      +{b.whatsappNumber}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="text-gray-400">{b.workingHours}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                {b.googleMapsUrl && (
                  <a
                    href={b.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
                  >
                    <span>الخريطة</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => startEdit(b)}
                  className="bg-[#7a5b3e] hover:bg-[#8f6b49] text-white text-xs font-medium px-4 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  تعديل الفرع
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Form */}
      {editingBranch && (
        <div className="bg-[#0c1217] border border-[#7a5b3e]/40 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-white font-readex">
                تعديل بيانات {editingBranch.name} ({editingBranch.id})
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                تحديث أرقام التوجيه والعناوين المحفوظة في مجموعة branches بفايربيس
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEditingBranch(null)}
              className="text-xs text-gray-400 hover:text-white"
            >
              إلغاء
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  اسم الفرع
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#131a21] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#7a5b3e]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  رقم واتساب التوجيه (بالصيغة الدولية بدون +)
                </label>
                <input
                  type="text"
                  required
                  value={formData.whatsappNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, whatsappNumber: e.target.value })
                  }
                  placeholder="201005557109"
                  className="w-full bg-[#131a21] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#7a5b3e]"
                  dir="ltr"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  العنوان التفصيلي
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full bg-[#131a21] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#7a5b3e]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  أرقام الهواتف (مفصولة بفاصلة)
                </label>
                <input
                  type="text"
                  value={formData.phonesText}
                  onChange={(e) =>
                    setFormData({ ...formData, phonesText: e.target.value })
                  }
                  placeholder="01005557109, 01287153339"
                  className="w-full bg-[#131a21] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#7a5b3e]"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  ساعات العمل
                </label>
                <input
                  type="text"
                  value={formData.workingHours}
                  onChange={(e) =>
                    setFormData({ ...formData, workingHours: e.target.value })
                  }
                  placeholder="يومياً من 11:00 ص إلى 11:00 م"
                  className="w-full bg-[#131a21] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#7a5b3e]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  رابط موقع المعرض على Google Maps
                </label>
                <input
                  type="url"
                  value={formData.googleMapsUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, googleMapsUrl: e.target.value })
                  }
                  placeholder="https://maps.app.goo.gl/..."
                  className="w-full bg-[#131a21] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#7a5b3e]"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setEditingBranch(null)}
                className="px-4 py-2.5 rounded-xl text-xs text-gray-400 hover:text-white"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 bg-[#7a5b3e] hover:bg-[#8f6b49] text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>حفظ التعديلات في قاعدة البيانات</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
