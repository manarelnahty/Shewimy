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
import { useBranches } from "@/lib/firebase/hooks";
import { updateBranch } from "@/lib/firebase/firestore";
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
    <div className="space-y-6 max-w-7xl mx-auto font-cairo text-[#1b1c1a]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#e7e5e0]">
        <div>
          <span className="text-xs text-[#855224] font-semibold uppercase tracking-wider block mb-1">
            شبكة معارض الدلتا
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1b1c1a] font-readex">
            إدارة الفروع والمعارض (Showrooms)
          </h1>
          <p className="text-xs sm:text-sm text-[#5e6368] mt-1">
            التحكم في أرقام الواتساب الموجهة، العناوين، مواعيد العمل، وروابط خرائط جوجل
          </p>
        </div>

        <div className="text-xs text-[#5e6368] bg-white border border-[#e7e5e0] px-4 py-2 rounded-xl shadow-xs">
          الفروع النشطة: <span className="font-bold text-[#855224] font-mono">{branches.length} فروع</span>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 animate-fadeIn ${
            message.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-rose-50 border border-rose-200 text-rose-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {/* Branches Cards Grid (Light Mode) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {branches.map((b) => {
          const isSelected = editingBranch?.id === b.id;
          return (
            <div
              key={b.id}
              className={`bg-white border rounded-2xl p-6 flex flex-col justify-between transition-all ${
                isSelected
                  ? "border-[#855224] ring-2 ring-[#855224]/20 shadow-md"
                  : "border-[#e7e5e0] hover:border-[#855224]/50 hover:shadow-md shadow-xs"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-[11px] font-bold text-[#855224] bg-[#855224]/10 px-2.5 py-1 rounded-full font-readex border border-[#855224]/20">
                    {b.badge || "معرض رئيسي"}
                  </span>
                  <span className="text-xs font-mono text-[#5e6368] uppercase">
                    {b.id}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#1b1c1a] font-readex mb-2.5">
                  {b.name}
                </h3>

                <div className="space-y-3 text-xs text-[#1b1c1a] border-t border-[#e7e5e0] pt-3.5">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#855224] shrink-0 mt-0.5" />
                    <span className="text-[#44474a] leading-relaxed">{b.address}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#1F5E4B] shrink-0" />
                    <span className="font-mono text-[#1b1c1a] font-semibold">
                      {b.phones && b.phones.length > 0 ? b.phones.join(" / ") : "—"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-[#1F5E4B] shrink-0" />
                    <span className="text-[#5e6368]">واتساب التوجيه:</span>
                    <span className="font-mono text-[#1F5E4B] font-bold" dir="ltr">
                      +{b.whatsappNumber}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#5e6368] shrink-0" />
                    <span className="text-[#5e6368]">{b.workingHours}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3.5 border-t border-[#e7e5e0] flex items-center justify-between">
                {b.googleMapsUrl && (
                  <a
                    href={b.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#5e6368] hover:text-[#1b1c1a] flex items-center gap-1 font-medium transition-colors"
                  >
                    <span>الخريطة</span>
                    <ExternalLink className="w-3 h-3 text-[#855224]" />
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => startEdit(b)}
                  className="bg-[#f5f3ef] hover:bg-[#eae8e4] border border-[#d6d3cd] text-[#1b1c1a] text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
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
        <div className="bg-white border border-[#855224]/40 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#e7e5e0] pb-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-[#1b1c1a] font-readex">
                تعديل بيانات {editingBranch.name} ({editingBranch.id})
              </h2>
              <p className="text-xs text-[#5e6368] mt-0.5">
                تحديث أرقام التوجيه والعناوين المحفوظة في مجموعة branches بفايربيس
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEditingBranch(null)}
              className="text-xs text-[#5e6368] hover:text-[#1b1c1a] font-medium"
            >
              إلغاء
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1b1c1a] mb-1 font-readex">
                  اسم الفرع
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2.5 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#855224] focus:ring-1 focus:ring-[#855224]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1b1c1a] mb-1 font-readex">
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
                  className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2.5 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#855224] focus:ring-1 focus:ring-[#855224]"
                  dir="ltr"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#1b1c1a] mb-1 font-readex">
                  العنوان التفصيلي
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2.5 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#855224] focus:ring-1 focus:ring-[#855224]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1b1c1a] mb-1 font-readex">
                  أرقام الهواتف (مفصولة بفاصلة)
                </label>
                <input
                  type="text"
                  value={formData.phonesText}
                  onChange={(e) =>
                    setFormData({ ...formData, phonesText: e.target.value })
                  }
                  placeholder="01005557109, 01287153339"
                  className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2.5 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#855224] focus:ring-1 focus:ring-[#855224]"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1b1c1a] mb-1 font-readex">
                  ساعات العمل
                </label>
                <input
                  type="text"
                  value={formData.workingHours}
                  onChange={(e) =>
                    setFormData({ ...formData, workingHours: e.target.value })
                  }
                  placeholder="يومياً من 11:00 ص إلى 11:00 م"
                  className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2.5 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#855224] focus:ring-1 focus:ring-[#855224]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#1b1c1a] mb-1 font-readex">
                  رابط موقع المعرض على Google Maps
                </label>
                <input
                  type="url"
                  value={formData.googleMapsUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, googleMapsUrl: e.target.value })
                  }
                  placeholder="https://maps.app.goo.gl/..."
                  className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2.5 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#855224] focus:ring-1 focus:ring-[#855224]"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e7e5e0]">
              <button
                type="button"
                onClick={() => setEditingBranch(null)}
                className="px-4 py-2.5 rounded-xl text-xs text-[#5e6368] hover:text-[#1b1c1a] font-medium"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 bg-[#1F5E4B] hover:bg-[#164638] text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-xs hover:shadow transition-all cursor-pointer disabled:opacity-50"
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
