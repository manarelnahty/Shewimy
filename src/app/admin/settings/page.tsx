"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Layers,
  Sparkles,
  ShieldCheck,
  Compass,
  Headset,
  Upload,
  Globe,
  SlidersHorizontal,
  Briefcase,
  PhoneCall,
  Calendar,
  Lock,
  KeyRound,
  LogOut,
  Mail,
  UserCheck,
  ShieldAlert,
  Eye,
  EyeOff,
  Server,
  Database,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Tag,
  Box,
} from "lucide-react";
import { useSiteSettings, useAdminAuth, useMaterials } from "@/lib/firebase";
import { updateSiteSettings } from "@/lib/firebase/firestore";
import { uploadImageFile, ensureStoredUrl } from "@/lib/firebase/storage";
import { isValidImageUrl } from "@/lib/image";
import { SiteSettings, DEFAULT_SITE_SETTINGS, MaterialItem } from "@/types/shewimy";

type ActiveTab =
  | "hero"
  | "trust"
  | "portfolio"
  | "process"
  | "cta"
  | "brand"
  | "materials"
  | "account";

export default function AdminSettingsPage() {
  const { settings, loading, refetch } = useSiteSettings();
  const { user, logout, changeEmail, changePassword } = useAdminAuth();
  const [formData, setFormData] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [activeTab, setActiveTab] = useState<ActiveTab>("hero");
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Super Admin Account Management State
  const [newEmail, setNewEmail] = useState("");
  const [currentPasswordForEmail, setCurrentPasswordForEmail] = useState("");
  const [emailUpdating, setEmailUpdating] = useState(false);

  const [currentPasswordForPass, setCurrentPasswordForPass] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Dynamic Materials Management State & Hook
  const {
    materials,
    loading: loadingMaterials,
    saveMaterial,
    deleteMaterial,
  } = useMaterials();
  const [materialSearch, setMaterialSearch] = useState("");
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [editingMaterialId, setEditingMaterialId] = useState<string | null>(null);
  const [materialName, setMaterialName] = useState("");
  const [materialId, setMaterialId] = useState("");
  const [materialOrigin, setMaterialOrigin] = useState("");
  const [materialDesc, setMaterialDesc] = useState("");
  const [materialSaving, setMaterialSaving] = useState(false);
  const [materialError, setMaterialError] = useState<string | null>(null);

  const handleOpenAddMaterial = () => {
    setEditingMaterialId(null);
    setMaterialName("");
    setMaterialId("");
    setMaterialOrigin("أوروبي معتمد");
    setMaterialDesc("");
    setMaterialError(null);
    setShowMaterialModal(true);
  };

  const handleOpenEditMaterial = (m: MaterialItem) => {
    setEditingMaterialId(m.id);
    setMaterialName(m.name);
    setMaterialId(m.id);
    setMaterialOrigin(m.origin || "");
    setMaterialDesc(m.description || "");
    setMaterialError(null);
    setShowMaterialModal(true);
  };

  const handleSaveMaterialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialName.trim()) {
      setMaterialError("يرجى إدخال اسم الخامة بالعربية");
      return;
    }
    setMaterialSaving(true);
    setMaterialError(null);

    const res = await saveMaterial({
      id: materialId.trim() || undefined,
      name: materialName.trim(),
      origin: materialOrigin.trim(),
      description: materialDesc.trim(),
    });

    setMaterialSaving(false);
    if (res.success && res.material) {
      setShowMaterialModal(false);
      setMessage({
        type: "success",
        text: `تم حفظ الخامة "${res.material.name}" بنجاح وانعكاسها فوراً على الموقع والكتالوج!`,
      });
    } else {
      setMaterialError(res.error || "فشل حفظ الخامة");
    }
  };

  const handleDeleteMaterialItem = async (m: MaterialItem) => {
    if (!confirm(`هل أنت متأكد من رغبتك في حذف خامة "${m.name}" من سجل الخامات المعتمدة؟`)) {
      return;
    }
    const res = await deleteMaterial(m.id);
    if (res.success) {
      setMessage({
        type: "success",
        text: `تم حذف خامة "${m.name}" بنجاح.`,
      });
    } else {
      setMessage({
        type: "error",
        text: res.error || "فشل حذف الخامة",
      });
    }
  };

  const filteredMaterialsList = materials.filter((m) => {
    const q = materialSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      m.name.toLowerCase().includes(q) ||
      m.id.toLowerCase().includes(q) ||
      (m.origin && m.origin.toLowerCase().includes(q)) ||
      (m.description && m.description.toLowerCase().includes(q))
    );
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        ...DEFAULT_SITE_SETTINGS,
        ...settings,
        heroStats: {
          ...DEFAULT_SITE_SETTINGS.heroStats,
          ...(settings.heroStats || {}),
        },
        trustBarItems:
          settings.trustBarItems && settings.trustBarItems.length > 0
            ? settings.trustBarItems
            : DEFAULT_SITE_SETTINGS.trustBarItems,
        processSteps:
          settings.processSteps && settings.processSteps.length > 0
            ? settings.processSteps
            : DEFAULT_SITE_SETTINGS.processSteps,
        socialLinks: {
          ...DEFAULT_SITE_SETTINGS.socialLinks,
          ...(settings.socialLinks || {}),
        },
      });
    }
  }, [settings]);

  // Upload an image specifically for one of the landing page slots
  const handleUploadSlot = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldKey: "heroBgImage" | "heroShowcaseImage" | "ctaBgImage"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(fieldKey);
      const res = await uploadImageFile(file, "landing");
      if (res.success && res.url) {
        setFormData((prev) => ({ ...prev, [fieldKey]: res.url! }));
        setMessage({ type: "success", text: "تم رفع صورة الديكور بنجاح!" });
      } else {
        setMessage({ type: "error", text: res.error || "فشل رفع الصورة" });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "حدث خطأ أثناء رفع الصورة" });
    } finally {
      setUploadingImage(null);
    }
  };

  const handleTrustItemChange = (index: number, field: "title" | "desc", value: string) => {
    const updated = [...formData.trustBarItems];
    if (updated[index]) {
      updated[index] = { ...updated[index], [field]: value };
      setFormData({ ...formData, trustBarItems: updated });
    }
  };

  const handleProcessStepChange = (index: number, field: "title" | "desc", value: string) => {
    const updated = [...formData.processSteps];
    if (updated[index]) {
      updated[index] = { ...updated[index], [field]: value };
      setFormData({ ...formData, processSteps: updated });
    }
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      window.location.href = "/admin/login";
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "فشل تسجيل الخروج" });
      setLoggingOut(false);
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newEmail.includes("@")) {
      setMessage({ type: "error", text: "يرجى كتابة بريد إلكتروني صالح" });
      return;
    }
    if (!currentPasswordForEmail) {
      setMessage({ type: "error", text: "يرجى إدخال كلمة المرور الحالية لتأكيد الهوية" });
      return;
    }

    try {
      setEmailUpdating(true);
      setMessage(null);
      const res = await changeEmail(newEmail, currentPasswordForEmail);
      if (res.success) {
        setMessage({
          type: "success",
          text: res.message || "تم تحديث البريد الإلكتروني للمسؤول وانعكس في السكيما وفايربيس بنجاح!",
        });
        setNewEmail("");
        setCurrentPasswordForEmail("");
        refetch();
      } else {
        setMessage({ type: "error", text: res.error || "فشل تحديث البريد الإلكتروني" });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "حدث خطأ أثناء تحديث البريد" });
    } finally {
      setEmailUpdating(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPasswordForPass) {
      setMessage({ type: "error", text: "يرجى إدخال كلمة المرور الحالية" });
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setMessage({ type: "error", text: "كلمة المرور الجديدة يجب أن لا تقل عن 6 أحرف" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "كلمة المرور الجديدة غير متطابقة مع خانة التأكيد" });
      return;
    }

    try {
      setPasswordUpdating(true);
      setMessage(null);
      const res = await changePassword(currentPasswordForPass, newPassword);
      if (res.success) {
        setMessage({
          type: "success",
          text: res.message || "تم تحديث كلمة المرور وحفظها في فايربيس والسكيما بنجاح!",
        });
        setCurrentPasswordForPass("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage({ type: "error", text: res.error || "فشل تحديث كلمة المرور" });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "حدث خطأ أثناء تحديث كلمة المرور" });
    } finally {
      setPasswordUpdating(false);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      setMessage(null);

      // Pre-process any images that might be raw Base64 data URLs:
      const cleanHeroBg = await ensureStoredUrl(formData.heroBgImage, "hero_bg");
      const cleanHeroShowcase = await ensureStoredUrl(
        formData.heroShowcaseImage,
        "hero_showcase"
      );
      const cleanCtaBg = formData.ctaBgImage
        ? await ensureStoredUrl(formData.ctaBgImage, "cta_bg")
        : "";

      const cleanFormData: SiteSettings = {
        ...formData,
        heroBgImage: cleanHeroBg,
        heroShowcaseImage: cleanHeroShowcase,
        ctaBgImage: cleanCtaBg,
      };

      setFormData(cleanFormData);

      const res = await updateSiteSettings(cleanFormData);
      if (res.success) {
        if (res.settings) {
          setFormData((prev) => ({ ...prev, ...res.settings }));
        }
        setMessage({
          type: "success",
          text: "تم حفظ وتحديث كافة إعدادات وصور ونصوص الصفحة الرئيسية بنجاح!",
        });
        refetch();
      } else {
        setMessage({ type: "error", text: res.error || "فشل حفظ التعديلات" });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "حدث خطأ غير متوقع أثناء الحفظ" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-cairo text-[#1b1c1a]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#e7e5e0]">
        <div>
          <span className="text-xs text-[#855224] font-semibold uppercase tracking-wider block mb-1">
            نظام إدارة المحتوى التفاعلي (Landing Page CMS)
          </span>
          <h1 className="text-2xl font-bold text-[#1b1c1a] font-readex">
            تخصيص محتوى وصور وزخارف الـ Landing Page
          </h1>
          <p className="text-xs sm:text-sm text-[#5e6368] mt-1">
            تحكم كامل في نصوص الواجهة، صور الديكور المعمارية، شريط الثقة، ومراحل العمل
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleSave()}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-[#1F5E4B] hover:bg-[#164638] text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-xl shadow-xs hover:shadow transition-all cursor-pointer disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{saving ? "جاري الحفظ..." : "حفظ التعديلات فورياً"}</span>
        </button>
      </div>

      {/* Notifications */}
      {message && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between animate-fadeIn ${
            message.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-rose-50 border border-rose-200 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span className="font-medium">{message.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="text-[#5e6368] hover:text-[#1b1c1a] text-xs"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#f8f6f2] border border-[#e7e5e0] overflow-x-auto shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab("hero")}
          className={`flex items-center gap-2 text-xs px-4 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "hero"
              ? "bg-[#1F5E4B] text-white shadow-xs"
              : "text-[#5e6368] hover:text-[#1b1c1a] hover:bg-white"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>الهيرو وصور الديكور المعمارية</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("trust")}
          className={`flex items-center gap-2 text-xs px-4 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "trust"
              ? "bg-[#1F5E4B] text-white shadow-xs"
              : "text-[#5e6368] hover:text-[#1b1c1a] hover:bg-white"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>شريط الثقة (4 بطاقات)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("portfolio")}
          className={`flex items-center gap-2 text-xs px-4 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "portfolio"
              ? "bg-[#1F5E4B] text-white shadow-xs"
              : "text-[#5e6368] hover:text-[#1b1c1a] hover:bg-white"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>قسم أعمالنا (Portfolio)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("process")}
          className={`flex items-center gap-2 text-xs px-4 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "process"
              ? "bg-[#1F5E4B] text-white shadow-xs"
              : "text-[#5e6368] hover:text-[#1b1c1a] hover:bg-white"
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>رحلة التصنيع (4 خطوات)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("cta")}
          className={`flex items-center gap-2 text-xs px-4 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "cta"
              ? "bg-[#1F5E4B] text-white shadow-xs"
              : "text-[#5e6368] hover:text-[#1b1c1a] hover:bg-white"
          }`}
        >
          <Headset className="w-4 h-4" />
          <span>قسم الاستشارة والحجز (CTA)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("brand")}
          className={`flex items-center gap-2 text-xs px-4 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "brand"
              ? "bg-[#1F5E4B] text-white shadow-xs"
              : "text-[#5e6368] hover:text-[#1b1c1a] hover:bg-white"
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>الهوية والتواصل العام</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("materials")}
          className={`flex items-center gap-2 text-xs px-4 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "materials"
              ? "bg-[#1F5E4B] text-white shadow-xs"
              : "text-[#5e6368] hover:text-[#1b1c1a] hover:bg-white"
          }`}
        >
          <Box className="w-4 h-4" />
          <span>إدارة الخامات والمواصفات ({materials.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("account")}
          className={`flex items-center gap-2 text-xs px-4 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer border ${
            activeTab === "account"
              ? "bg-[#855224] text-white border-[#855224] shadow-xs"
              : "text-[#855224] bg-[#855224]/5 border-[#855224]/20 hover:bg-[#855224]/10"
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>الأمان وحساب المسؤول</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* TAB 1: HERO & ARCHITECTURAL DECOR */}
        {activeTab === "hero" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Decoration Images Settings */}
            <div className="bg-white border border-[#e7e5e0] rounded-2xl p-6 space-y-5 shadow-xs">
              <div>
                <h2 className="text-base font-bold text-[#1b1c1a] font-readex flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#855224]" />
                  <span>صور الديكور المعمارية في قسم الهيرو</span>
                </h2>
                <p className="text-xs text-[#5e6368] mt-1">
                  يمكنك تخصيص كل من خلفية الديكور المعمارية وصورة كارد العرض الرئيسي بنقرة واحدة
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Ambient Background Decoration */}
                <div className="bg-[#f8f6f2] border border-[#e7e5e0] rounded-xl p-4 space-y-3">
                  <span className="text-xs font-bold text-[#1F5E4B] block font-readex">
                    صورة خلفية الديكور المعمارية (Ambient Texture)
                  </span>

                  <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden border border-[#d6d3cd] bg-black/10">
                    {isValidImageUrl(formData.heroBgImage) ? (
                      <img
                        src={formData.heroBgImage}
                        alt="Hero Decor Background"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-xs text-[#5e6368]">
                        {formData.heroBgImage ? "رابط الصورة غير صالح" : "لا توجد صورة محددة"}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={formData.heroBgImage}
                      onChange={(e) =>
                        setFormData({ ...formData, heroBgImage: e.target.value })
                      }
                      placeholder="رابط مباشر..."
                      className="flex-1 bg-white border border-[#d6d3cd] rounded-xl px-3 py-2 text-xs text-[#1b1c1a]"
                      dir="ltr"
                    />

                    <label className="cursor-pointer bg-white hover:bg-[#eae8e4] border border-[#d6d3cd] px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 text-[#1b1c1a] font-semibold shrink-0">
                      <Upload className="w-3.5 h-3.5 text-[#855224]" />
                      <span>{uploadingImage === "heroBgImage" ? "رفع..." : "رفع ملف"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleUploadSlot(e, "heroBgImage")}
                        className="hidden"
                        disabled={uploadingImage !== null}
                      />
                    </label>
                  </div>
                </div>

                {/* 2. Focal Showcase Card Image */}
                <div className="bg-[#f8f6f2] border border-[#e7e5e0] rounded-xl p-4 space-y-3">
                  <span className="text-xs font-bold text-[#855224] block font-readex">
                    صورة كارد العرض الرئيسي (Showcase Card)
                  </span>

                  <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden border border-[#d6d3cd] bg-black/10">
                    {isValidImageUrl(formData.heroShowcaseImage) ? (
                      <img
                        src={formData.heroShowcaseImage}
                        alt="Hero Showcase Image"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-xs text-[#5e6368]">
                        {formData.heroShowcaseImage ? "رابط الصورة غير صالح" : "لا توجد صورة محددة"}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={formData.heroShowcaseImage}
                      onChange={(e) =>
                        setFormData({ ...formData, heroShowcaseImage: e.target.value })
                      }
                      placeholder="رابط مباشر..."
                      className="flex-1 bg-white border border-[#d6d3cd] rounded-xl px-3 py-2 text-xs text-[#1b1c1a]"
                      dir="ltr"
                    />

                    <label className="cursor-pointer bg-white hover:bg-[#eae8e4] border border-[#d6d3cd] px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 text-[#1b1c1a] font-semibold shrink-0">
                      <Upload className="w-3.5 h-3.5 text-[#855224]" />
                      <span>
                        {uploadingImage === "heroShowcaseImage" ? "رفع..." : "رفع ملف"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleUploadSlot(e, "heroShowcaseImage")}
                        className="hidden"
                        disabled={uploadingImage !== null}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Showcase Card Metadata Texts */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-[#e7e5e0]">
                <div>
                  <label className="block text-xs font-semibold text-[#1b1c1a] mb-1 font-readex">
                    بادج كارد العرض (Tag)
                  </label>
                  <input
                    type="text"
                    value={formData.heroShowcaseTag}
                    onChange={(e) =>
                      setFormData({ ...formData, heroShowcaseTag: e.target.value })
                    }
                    placeholder="تصميم حصري 2026"
                    className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2 text-xs text-[#1b1c1a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1b1c1a] mb-1 font-readex">
                    عنوان كارد العرض
                  </label>
                  <input
                    type="text"
                    value={formData.heroShowcaseTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, heroShowcaseTitle: e.target.value })
                    }
                    placeholder="طراز بولاك ألترا مودرن"
                    className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2 text-xs text-[#1b1c1a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1b1c1a] mb-1 font-readex">
                    الميزة الميكانيكية المذكورة
                  </label>
                  <input
                    type="text"
                    value={formData.heroShowcaseFeature}
                    onChange={(e) =>
                      setFormData({ ...formData, heroShowcaseFeature: e.target.value })
                    }
                    placeholder="ميكانزم بلوم نمساوي أصلي"
                    className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2 text-xs text-[#1b1c1a]"
                  />
                </div>
              </div>
            </div>

            {/* Hero Main Copy & CTAs */}
            <div className="bg-white border border-[#e7e5e0] rounded-2xl p-6 space-y-4 shadow-xs">
              <h2 className="text-base font-bold text-[#1b1c1a] font-readex flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#855224]" />
                <span>نصوص الهيرو والعناوين وأزرار الدعوة</span>
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1b1c1a] mb-1.5 font-readex">
                      البادج العلوي
                    </label>
                    <input
                      type="text"
                      value={formData.heroBadgeText}
                      onChange={(e) =>
                        setFormData({ ...formData, heroBadgeText: e.target.value })
                      }
                      placeholder="خبرة 24 عاماً • ضمان 15 سنة حقيقي"
                      className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2.5 text-xs text-[#1b1c1a]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1b1c1a] mb-1.5 font-readex">
                      سنوات الخبرة (بالأرقام)
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
                      className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2.5 text-xs text-[#1b1c1a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1b1c1a] mb-1.5 font-readex">
                    العنوان الرئيسي (Headline)
                  </label>
                  <input
                    type="text"
                    value={formData.heroHeadline}
                    onChange={(e) =>
                      setFormData({ ...formData, heroHeadline: e.target.value })
                    }
                    className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2.5 text-xs text-[#1b1c1a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1b1c1a] mb-1.5 font-readex">
                    الوصف الترويجي في الهيرو (Subheadline)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.heroSubheadline}
                    onChange={(e) =>
                      setFormData({ ...formData, heroSubheadline: e.target.value })
                    }
                    className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl p-3 text-xs text-[#1b1c1a]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1b1c1a] mb-1.5 font-readex">
                      نص الزر الرئيسي (Primary CTA)
                    </label>
                    <input
                      type="text"
                      value={formData.heroCtaPrimaryText}
                      onChange={(e) =>
                        setFormData({ ...formData, heroCtaPrimaryText: e.target.value })
                      }
                      placeholder="صمم مطبخك الآن"
                      className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2 text-xs text-[#1b1c1a]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1b1c1a] mb-1.5 font-readex">
                      نص الزر الثانوي (Secondary CTA)
                    </label>
                    <input
                      type="text"
                      value={formData.heroCtaSecondaryText}
                      onChange={(e) =>
                        setFormData({ ...formData, heroCtaSecondaryText: e.target.value })
                      }
                      placeholder="تصفح أعمالنا"
                      className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2 text-xs text-[#1b1c1a]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stat Counters */}
            <div className="bg-white border border-[#e7e5e0] rounded-2xl p-6 space-y-4 shadow-xs">
              <h2 className="text-base font-bold text-[#1b1c1a] font-readex flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#855224]" />
                <span>العدادات الإحصائية الثلاثة (Hero Stats)</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#f8f6f2] p-3 rounded-xl border border-[#e7e5e0] space-y-2">
                  <span className="text-[11px] font-bold text-[#855224]">الإحصائية #1</span>
                  <input
                    type="text"
                    value={formData.heroStats?.stat1Value || "+3,500"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        heroStats: {
                          ...formData.heroStats,
                          stat1Value: e.target.value,
                        },
                      })
                    }
                    placeholder="+3,500"
                    className="w-full bg-white border border-[#d6d3cd] rounded-lg px-2.5 py-1.5 text-xs font-bold"
                  />
                  <input
                    type="text"
                    value={formData.heroStats?.stat1Label || "مطبخ منفّذ"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        heroStats: {
                          ...formData.heroStats,
                          stat1Label: e.target.value,
                        },
                      })
                    }
                    placeholder="مطبخ منفّذ"
                    className="w-full bg-white border border-[#d6d3cd] rounded-lg px-2.5 py-1 text-xs"
                  />
                </div>

                <div className="bg-[#f8f6f2] p-3 rounded-xl border border-[#e7e5e0] space-y-2">
                  <span className="text-[11px] font-bold text-[#855224]">الإحصائية #2</span>
                  <input
                    type="text"
                    value={formData.heroStats?.stat2Value || "3 فروع"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        heroStats: {
                          ...formData.heroStats,
                          stat2Value: e.target.value,
                        },
                      })
                    }
                    placeholder="3 فروع"
                    className="w-full bg-white border border-[#d6d3cd] rounded-lg px-2.5 py-1.5 text-xs font-bold"
                  />
                  <input
                    type="text"
                    value={formData.heroStats?.stat2Label || "بمنطقة الدلتا"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        heroStats: {
                          ...formData.heroStats,
                          stat2Label: e.target.value,
                        },
                      })
                    }
                    placeholder="بمنطقة الدلتا"
                    className="w-full bg-white border border-[#d6d3cd] rounded-lg px-2.5 py-1 text-xs"
                  />
                </div>

                <div className="bg-[#f8f6f2] p-3 rounded-xl border border-[#e7e5e0] space-y-2">
                  <span className="text-[11px] font-bold text-[#855224]">الإحصائية #3</span>
                  <input
                    type="text"
                    value={formData.heroStats?.stat3Value || "100%"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        heroStats: {
                          ...formData.heroStats,
                          stat3Value: e.target.value,
                        },
                      })
                    }
                    placeholder="100%"
                    className="w-full bg-white border border-[#d6d3cd] rounded-lg px-2.5 py-1.5 text-xs font-bold"
                  />
                  <input
                    type="text"
                    value={formData.heroStats?.stat3Label || "خامات أوروبية"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        heroStats: {
                          ...formData.heroStats,
                          stat3Label: e.target.value,
                        },
                      })
                    }
                    placeholder="خامات أوروبية"
                    className="w-full bg-white border border-[#d6d3cd] rounded-lg px-2.5 py-1 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TRUST BAR */}
        {activeTab === "trust" && (
          <div className="bg-white border border-[#e7e5e0] rounded-2xl p-6 space-y-4 shadow-xs animate-fadeIn">
            <h2 className="text-base font-bold text-[#1b1c1a] font-readex flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#855224]" />
              <span>بطاقات شريط الثقة الأربعة (Trust Bar)</span>
            </h2>
            <p className="text-xs text-[#5e6368]">
              تظهر أسفل الهيرو مباشرة وتبرز الضمان والمصانع والماكينات الإيطالية والتصميم ثلاثي الأبعاد
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {formData.trustBarItems.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#f8f6f2] border border-[#e7e5e0] rounded-xl p-4 space-y-2.5"
                >
                  <span className="text-[11px] font-bold text-[#855224] font-readex block">
                    البطاقة #{idx + 1}
                  </span>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#1b1c1a] mb-1">
                      العنوان
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) =>
                        handleTrustItemChange(idx, "title", e.target.value)
                      }
                      className="w-full bg-white border border-[#d6d3cd] rounded-lg px-3 py-2 text-xs text-[#1b1c1a]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#1b1c1a] mb-1">
                      الوصف المختصر
                    </label>
                    <textarea
                      rows={2}
                      value={item.desc}
                      onChange={(e) =>
                        handleTrustItemChange(idx, "desc", e.target.value)
                      }
                      className="w-full bg-white border border-[#d6d3cd] rounded-lg px-3 py-2 text-xs text-[#1b1c1a]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PORTFOLIO SECTION */}
        {activeTab === "portfolio" && (
          <div className="bg-white border border-[#e7e5e0] rounded-2xl p-6 space-y-4 shadow-xs animate-fadeIn">
            <h2 className="text-base font-bold text-[#1b1c1a] font-readex flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#855224]" />
              <span>نصوص قسم سابقة الأعمال والكتالوج (Portfolio)</span>
            </h2>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-[#1b1c1a] mb-1 font-readex">
                  البادج الترويجي للقسم
                </label>
                <input
                  type="text"
                  value={formData.portfolioBadge}
                  onChange={(e) =>
                    setFormData({ ...formData, portfolioBadge: e.target.value })
                  }
                  className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2.5 text-xs text-[#1b1c1a]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1b1c1a] mb-1 font-readex">
                  العنوان الرئيسي لقسم الأعمال
                </label>
                <input
                  type="text"
                  value={formData.portfolioHeadline}
                  onChange={(e) =>
                    setFormData({ ...formData, portfolioHeadline: e.target.value })
                  }
                  className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2.5 text-xs text-[#1b1c1a]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1b1c1a] mb-1 font-readex">
                  الوصف التوضيحي
                </label>
                <textarea
                  rows={2}
                  value={formData.portfolioSubheadline}
                  onChange={(e) =>
                    setFormData({ ...formData, portfolioSubheadline: e.target.value })
                  }
                  className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl p-3 text-xs text-[#1b1c1a]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1b1c1a] mb-1 font-readex">
                  نص زر استعراض كامل الكتالوج في الأسفل
                </label>
                <input
                  type="text"
                  value={formData.portfolioCtaText}
                  onChange={(e) =>
                    setFormData({ ...formData, portfolioCtaText: e.target.value })
                  }
                  className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2.5 text-xs text-[#1b1c1a]"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PROCESS JOURNEY */}
        {activeTab === "process" && (
          <div className="bg-white border border-[#e7e5e0] rounded-2xl p-6 space-y-4 shadow-xs animate-fadeIn">
            <h2 className="text-base font-bold text-[#1b1c1a] font-readex flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#855224]" />
              <span>مراحل رحلة تصنيع المطبخ (Process Journey)</span>
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1b1c1a] mb-1 font-readex">
                    بادج القسم
                  </label>
                  <input
                    type="text"
                    value={formData.processBadge}
                    onChange={(e) =>
                      setFormData({ ...formData, processBadge: e.target.value })
                    }
                    className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2 text-xs text-[#1b1c1a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1b1c1a] mb-1 font-readex">
                    عنوان رحلة التصنيع
                  </label>
                  <input
                    type="text"
                    value={formData.processHeadline}
                    onChange={(e) =>
                      setFormData({ ...formData, processHeadline: e.target.value })
                    }
                    className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2 text-xs text-[#1b1c1a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1b1c1a] mb-1 font-readex">
                  الوصف التمهيدي
                </label>
                <textarea
                  rows={2}
                  value={formData.processSubheadline}
                  onChange={(e) =>
                    setFormData({ ...formData, processSubheadline: e.target.value })
                  }
                  className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl p-3 text-xs text-[#1b1c1a]"
                />
              </div>

              {/* 4 Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {formData.processSteps.map((stepItem, idx) => (
                  <div
                    key={idx}
                    className="bg-[#f8f6f2] border border-[#e7e5e0] rounded-xl p-4 space-y-2"
                  >
                    <span className="text-[11px] font-bold text-[#1F5E4B] font-mono">
                      الخطوة {stepItem.step}
                    </span>

                    <input
                      type="text"
                      value={stepItem.title}
                      onChange={(e) =>
                        handleProcessStepChange(idx, "title", e.target.value)
                      }
                      placeholder="عنوان الخطوة"
                      className="w-full bg-white border border-[#d6d3cd] rounded-lg px-3 py-1.5 text-xs text-[#1b1c1a] font-bold"
                    />

                    <textarea
                      rows={2}
                      value={stepItem.desc}
                      onChange={(e) =>
                        handleProcessStepChange(idx, "desc", e.target.value)
                      }
                      placeholder="تفاصيل الخطوة"
                      className="w-full bg-white border border-[#d6d3cd] rounded-lg px-3 py-1.5 text-xs text-[#1b1c1a]"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CONSULTATION CTA */}
        {activeTab === "cta" && (
          <div className="bg-white border border-[#e7e5e0] rounded-2xl p-6 space-y-4 shadow-xs animate-fadeIn">
            <h2 className="text-base font-bold text-[#1b1c1a] font-readex flex items-center gap-2">
              <Headset className="w-4 h-4 text-[#855224]" />
              <span>قسم الاستشارة المعمارية والدعوة للحجز (CTA Section)</span>
            </h2>

            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1b1c1a] mb-1 font-readex">
                    البادج العلوي
                  </label>
                  <input
                    type="text"
                    value={formData.ctaBadge}
                    onChange={(e) =>
                      setFormData({ ...formData, ctaBadge: e.target.value })
                    }
                    className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2.5 text-xs text-[#1b1c1a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1b1c1a] mb-1 font-readex">
                    العنوان الرئيسي
                  </label>
                  <input
                    type="text"
                    value={formData.ctaHeadline}
                    onChange={(e) =>
                      setFormData({ ...formData, ctaHeadline: e.target.value })
                    }
                    className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2.5 text-xs text-[#1b1c1a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1b1c1a] mb-1 font-readex">
                  نص الدعوة والوصف
                </label>
                <textarea
                  rows={2}
                  value={formData.ctaSubheadline}
                  onChange={(e) =>
                    setFormData({ ...formData, ctaSubheadline: e.target.value })
                  }
                  className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl p-3 text-xs text-[#1b1c1a]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1b1c1a] mb-1 font-readex">
                    نص زر حجز المعاينة
                  </label>
                  <input
                    type="text"
                    value={formData.ctaPrimaryBtnText}
                    onChange={(e) =>
                      setFormData({ ...formData, ctaPrimaryBtnText: e.target.value })
                    }
                    className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2.5 text-xs text-[#1b1c1a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1b1c1a] mb-1 font-readex">
                    نص زر الواتساب المباشر
                  </label>
                  <input
                    type="text"
                    value={formData.ctaWhatsappBtnText}
                    onChange={(e) =>
                      setFormData({ ...formData, ctaWhatsappBtnText: e.target.value })
                    }
                    className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2.5 text-xs text-[#1b1c1a]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: BRAND & GENERAL */}
        {activeTab === "brand" && (
          <div className="bg-white border border-[#e7e5e0] rounded-2xl p-6 space-y-4 shadow-xs animate-fadeIn">
            <h2 className="text-base font-bold text-[#1b1c1a] font-readex flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#855224]" />
              <span>هوية العلامة التجارية والبيانات العامة</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-[#1b1c1a] mb-1.5 font-readex">
                  الاسم التجاري للمنصة
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2.5 text-xs text-[#1b1c1a]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1b1c1a] mb-1.5 font-readex">
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
                  className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2.5 text-xs text-[#1b1c1a]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1b1c1a] mb-1.5 font-readex">
                  رقم الهاتف الرئيسي للخدمة
                </label>
                <input
                  type="text"
                  value={formData.phonePrimary}
                  onChange={(e) =>
                    setFormData({ ...formData, phonePrimary: e.target.value })
                  }
                  className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2.5 text-xs text-[#1b1c1a]"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1b1c1a] mb-1.5 font-readex">
                  البريد الإلكتروني المعتمد
                </label>
                <input
                  type="email"
                  value={formData.emailPrimary}
                  onChange={(e) =>
                    setFormData({ ...formData, emailPrimary: e.target.value })
                  }
                  className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2.5 text-xs text-[#1b1c1a]"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-4 border-t border-[#e7e5e0] space-y-3">
              <span className="text-xs font-bold text-[#855224] block font-readex">
                روابط التواصل الاجتماعي
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#5e6368] mb-1">
                    فيسبوك
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks?.facebook || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialLinks: {
                          ...formData.socialLinks,
                          facebook: e.target.value,
                        },
                      })
                    }
                    className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3 py-2 text-xs text-[#1b1c1a]"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#5e6368] mb-1">
                    إنستجرام
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks?.instagram || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialLinks: {
                          ...formData.socialLinks,
                          instagram: e.target.value,
                        },
                      })
                    }
                    className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3 py-2 text-xs text-[#1b1c1a]"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: MATERIALS & SPECS CMS */}
        {activeTab === "materials" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Toolbar */}
            <div className="bg-white border border-[#e7e5e0] rounded-2xl p-6 sm:p-7 shadow-xs">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-[#e7e5e0]">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F5E4B]/10 text-[#1F5E4B] text-xs font-bold mb-2">
                    <Box className="w-3.5 h-3.5" />
                    <span>سجل الخامات والمواصفات المعتمدة (Materials Registry)</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#1b1c1a] font-readex">
                    التحكم في خامات ومواصفات الكتالوج
                  </h3>
                  <p className="text-xs text-[#5e6368] mt-1">
                    أي إضافة أو تعديل هنا ينعكس فورياً على فلاتر الكتالوج، كروت المنتجات، وتفاصيل المواصفات الفنية.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenAddMaterial}
                  className="inline-flex items-center gap-2 bg-[#1F5E4B] hover:bg-[#164638] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl shadow-xs hover:shadow transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة خامة جديدة</span>
                </button>
              </div>

              {/* Search Bar & Counter */}
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    value={materialSearch}
                    onChange={(e) => setMaterialSearch(e.target.value)}
                    placeholder="ابحث بالاسم، المعرّف، أو بلد المنشأ..."
                    className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-4 py-2.5 pl-9 text-xs text-[#1b1c1a] placeholder-[#9ca3af] focus:outline-none focus:border-[#1F5E4B] focus:ring-1 focus:ring-[#1F5E4B]"
                  />
                  <Search className="w-4 h-4 text-[#855224] absolute left-3 top-3 pointer-events-none" />
                </div>
                <div className="text-xs text-[#5e6368] font-medium self-end sm:self-center">
                  عرض <span className="font-bold text-[#1F5E4B] font-mono">{filteredMaterialsList.length}</span> من أصل <span className="font-bold text-[#1b1c1a] font-mono">{materials.length}</span> خامة
                </div>
              </div>
            </div>

            {/* Materials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMaterialsList.map((m) => (
                <div
                  key={m.id}
                  className="bg-white border border-[#e7e5e0] hover:border-[#1F5E4B]/40 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-[#1b1c1a] font-readex">
                        {m.name}
                      </h4>
                      <span className="text-[10px] font-mono font-semibold text-[#855224] bg-[#855224]/10 border border-[#855224]/20 px-2 py-0.5 rounded-md shrink-0">
                        {m.id}
                      </span>
                    </div>

                    {m.origin && (
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#1F5E4B] bg-[#1F5E4B]/8 border border-[#1F5E4B]/15 px-2.5 py-0.5 rounded-lg">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{m.origin}</span>
                      </div>
                    )}

                    {m.description && (
                      <p className="text-xs text-[#5e6368] leading-relaxed line-clamp-3">
                        {m.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#e7e5e0] flex items-center justify-between">
                    <span className="text-[10px] text-[#5e6368]">
                      {m.isCustom ? "مخصصة من الإدارة" : "خامة معتمدة أساسية"}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEditMaterial(m)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1F5E4B] hover:text-[#164638] hover:bg-[#1F5E4B]/5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                        title="تعديل بيانات الخامة"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>تعديل</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteMaterialItem(m)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                        title="حذف الخامة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>حذف</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredMaterialsList.length === 0 && (
              <div className="bg-white border border-[#e7e5e0] rounded-2xl p-12 text-center text-[#5e6368] space-y-3">
                <Box className="w-10 h-10 mx-auto text-[#9ca3af]" />
                <p className="text-sm font-semibold text-[#1b1c1a]">
                  لم يتم العثور على خامات مطابقة للبحث
                </p>
                <button
                  type="button"
                  onClick={handleOpenAddMaterial}
                  className="text-xs text-[#1F5E4B] hover:underline font-bold"
                >
                  + إضافة خامة جديدة الآن
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 8: ACCOUNT, SECURITY & SIGN OUT */}
        {activeTab === "account" && (
          <div className="space-y-6 animate-fadeIn">
            {/* 1. Current Session & Sign Out Card */}
            <div className="bg-white border border-[#e7e5e0] rounded-2xl p-6 sm:p-7 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-6 border-b border-[#e7e5e0]">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#855224]/10 border border-[#855224]/20 flex items-center justify-center text-[#855224] shrink-0">
                    <UserCheck className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base sm:text-lg font-bold text-[#1b1c1a] font-readex">
                        حساب المسؤول العام (Super Admin)
                      </h2>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        جلسة نشطة
                      </span>
                    </div>
                    <p className="text-xs text-[#5e6368] mt-1">
                      البريد الحالي المسجل للنظام:{" "}
                      <span className="font-mono font-bold text-[#1b1c1a] bg-[#f8f6f2] px-2 py-0.5 rounded border border-[#e7e5e0]">
                        {user?.email || formData.adminEmail || "admin@shewimy.com"}
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="inline-flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-2xs hover:shadow-xs disabled:opacity-50"
                >
                  {loggingOut ? (
                    <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                  ) : (
                    <LogOut className="w-4 h-4 text-rose-600" />
                  )}
                  <span>تسجيل الخروج من الحساب</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5 text-xs">
                <div className="p-3.5 rounded-xl bg-[#fbf9f5] border border-[#e7e5e0]">
                  <span className="text-[#6e7276] block mb-1">المعرف السحابي (UID):</span>
                  <span className="font-mono font-bold text-[#1b1c1a] truncate block">
                    {user?.uid || "admin-master"}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#fbf9f5] border border-[#e7e5e0]">
                  <span className="text-[#6e7276] block mb-1">صلاحية الحساب:</span>
                  <span className="font-semibold text-emerald-800">
                    تحكم كامل بكافة المجموعات والكتالوج
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#fbf9f5] border border-[#e7e5e0]">
                  <span className="text-[#6e7276] block mb-1">مزامنة السكيما:</span>
                  <span className="font-semibold text-[#855224]">
                    متطابقة مع فايربيس وملف الإعدادات
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Change Admin Email Card */}
            <div className="bg-white border border-[#e7e5e0] rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
              <div>
                <h3 className="text-base font-bold text-[#1b1c1a] font-readex flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#855224]" />
                  <span>تغيير البريد الإلكتروني للمسؤول (Admin Email)</span>
                </h3>
                <p className="text-xs text-[#5e6368] mt-1">
                  تحديث البريد الإلكتروني ينعكس فوراً في سكيما الموقع ومجموعة فايربيس السحابية (admins) وحساب الدخول.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1b1c1a] mb-1.5 font-readex">
                    البريد الإلكتروني الحالي
                  </label>
                  <input
                    type="text"
                    disabled
                    value={user?.email || formData.adminEmail || "admin@shewimy.com"}
                    className="w-full bg-[#f8f6f2] border border-[#d6d3cd] rounded-xl px-3.5 py-2.5 text-xs text-[#5e6368] font-mono cursor-not-allowed"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1b1c1a] mb-1.5 font-readex">
                    البريد الإلكتروني الجديد *
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="مثال: ceo@shewimy.com"
                    className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2.5 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#855224] focus:ring-1 focus:ring-[#855224] transition-all"
                    dir="ltr"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-[#1b1c1a] mb-1.5 font-readex">
                    كلمة المرور الحالية لتأكيد الهوية *
                  </label>
                  <input
                    type="password"
                    value={currentPasswordForEmail}
                    onChange={(e) => setCurrentPasswordForEmail(e.target.value)}
                    placeholder="أدخل كلمة المرور الحالية لتأكيد التغيير"
                    className="w-full max-w-md bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2.5 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#855224] focus:ring-1 focus:ring-[#855224] transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleUpdateEmail}
                  disabled={emailUpdating || !newEmail || !currentPasswordForEmail}
                  className="inline-flex items-center gap-2 bg-[#1F5E4B] hover:bg-[#164638] text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-xl shadow-xs hover:shadow transition-all cursor-pointer disabled:opacity-50"
                >
                  {emailUpdating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>تحديث البريد في السكيما وفايربيس</span>
                </button>
              </div>
            </div>

            {/* 3. Change Admin Password Card */}
            <div className="bg-white border border-[#e7e5e0] rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
              <div>
                <h3 className="text-base font-bold text-[#1b1c1a] font-readex flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-[#855224]" />
                  <span>تغيير كلمة المرور (Admin Password)</span>
                </h3>
                <p className="text-xs text-[#5e6368] mt-1">
                  قم بتعيين كلمة مرور قوية لتأمين لوحة التحكم. التغيير يطبق فورياً على جلسات الدخول القادمة.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1b1c1a] mb-1.5 font-readex">
                    كلمة المرور الحالية *
                  </label>
                  <input
                    type="password"
                    value={currentPasswordForPass}
                    onChange={(e) => setCurrentPasswordForPass(e.target.value)}
                    placeholder="كلمة المرور الحالية"
                    className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2.5 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#855224] focus:ring-1 focus:ring-[#855224] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1b1c1a] mb-1.5 font-readex">
                    كلمة المرور الجديدة *
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="6 أحرف أو أرقام على الأقل"
                      className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2.5 pl-9 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#855224] focus:ring-1 focus:ring-[#855224] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute left-2.5 top-2.5 text-[#5e6368] hover:text-[#1b1c1a]"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1b1c1a] mb-1.5 font-readex">
                    تأكيد كلمة المرور الجديدة *
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="أعد كتابة كلمة المرور الجديدة"
                    className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2.5 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#855224] focus:ring-1 focus:ring-[#855224] transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleUpdatePassword}
                  disabled={passwordUpdating || !currentPasswordForPass || !newPassword || !confirmPassword}
                  className="inline-flex items-center gap-2 bg-[#855224] hover:bg-[#6e431c] text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-xl shadow-xs hover:shadow transition-all cursor-pointer disabled:opacity-50"
                >
                  {passwordUpdating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                  <span>تحديث كلمة المرور وتأمين الحساب</span>
                </button>
              </div>
            </div>

            {/* 4. Architecture & Firebase Connectivity Status Card */}
            <div className="bg-[#f8f6f2] border border-[#e7e5e0] rounded-2xl p-5 sm:p-6 space-y-3">
              <h4 className="text-xs sm:text-sm font-bold text-[#1b1c1a] font-readex flex items-center gap-2">
                <Database className="w-4 h-4 text-[#1F5E4B]" />
                <span>حالة مزامنة السكيما وفايربيس السحابية</span>
              </h4>
              <p className="text-[11px] sm:text-xs text-[#5e6368] leading-relaxed">
                كل تعديل تقوم به على بريد أو كلمة مرور المسؤول ينعكس على ثلاث طبقات أمان موحدة:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
                <div className="p-3 rounded-xl bg-white border border-[#e7e5e0] space-y-1">
                  <div className="font-bold text-[#1F5E4B]">1. Firebase Auth</div>
                  <p className="text-[11px] text-[#5e6368]">
                    تحديث بيانات الاعتماد الرسمية عبر دوال Firebase Authentication السحابية.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#e7e5e0] space-y-1">
                  <div className="font-bold text-[#855224]">2. Firestore Schema</div>
                  <p className="text-[11px] text-[#5e6368]">
                    توثيق التعديل في مجموعة <code className="font-mono text-[10px] bg-black/5 px-1 rounded">admins/{`{uid}`}</code> ومجموعة <code className="font-mono text-[10px] bg-black/5 px-1 rounded">site_settings</code>.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#e7e5e0] space-y-1">
                  <div className="font-bold text-[#1b1c1a]">3. Local-First Persistence</div>
                  <p className="text-[11px] text-[#5e6368]">
                    حفظ نسخة دائمة على القرص تضمن استمرار تسجيل الدخول حتى في حالات انقطاع الشبكة.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Save Button Bar at bottom */}
        {activeTab !== "account" && activeTab !== "materials" && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-[#e7e5e0]">
            <div>
              {message && (
                <div
                  className={`px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 animate-fadeIn ${
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
                  <span className="font-semibold">{message.text}</span>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 bg-[#1F5E4B] hover:bg-[#164638] text-white text-xs sm:text-sm font-semibold px-8 py-3 rounded-xl shadow-xs hover:shadow transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{saving ? "جاري الحفظ والتحديث..." : "حفظ الإعدادات والمزامنة السحابية الفورية"}</span>
            </button>
          </div>
        )}
      </form>

      {/* Dynamic Material Add / Edit Modal */}
      {showMaterialModal && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#e7e5e0] animate-in fade-in zoom-in-95 duration-200 font-cairo">
            <div className="flex items-center justify-between pb-4 border-b border-[#e7e5e0]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#1F5E4B]/10 text-[#1F5E4B] flex items-center justify-center">
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#1b1c1a] font-readex">
                    {editingMaterialId ? "تعديل بيانات الخامة" : "إضافة خامة معتمدة جديدة"}
                  </h3>
                  <p className="text-[11px] text-[#5e6368]">
                    تنعكس التعديلات فوراً على الكتالوج وفلاتر الموقع
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowMaterialModal(false)}
                className="w-8 h-8 rounded-full bg-[#f8f6f2] hover:bg-[#ece8df] flex items-center justify-center text-[#5e6368] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMaterialSubmit} className="space-y-4 pt-4">
              {materialError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{materialError}</span>
                </div>
              )}

              {/* Material Arabic Name */}
              <div>
                <label className="block text-xs font-semibold text-[#1b1c1a] mb-1 font-readex">
                  اسم الخامة بالعربية *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={materialName}
                  onChange={(e) => setMaterialName(e.target.value)}
                  placeholder="مثال: أكريليك إسباني لامع، رخام كوارتز نانو..."
                  className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2.5 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#1F5E4B] focus:ring-1 focus:ring-[#1F5E4B]"
                />
              </div>

              {/* Material Slug / Key */}
              <div>
                <label className="block text-xs font-semibold text-[#1b1c1a] mb-1 font-readex">
                  معرّف الخامة الإنجليزي (ID / Slug)
                </label>
                <input
                  type="text"
                  value={materialId}
                  onChange={(e) => setMaterialId(e.target.value)}
                  placeholder="مثال: spanish_acrylic (يُنشأ تلقائياً إن تُرِك فارغاً)"
                  dir="ltr"
                  disabled={Boolean(editingMaterialId)}
                  className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2.5 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#1F5E4B] focus:ring-1 focus:ring-[#1F5E4B] disabled:opacity-60"
                />
                <span className="text-[10px] text-[#5e6368] mt-1 block">
                  يُستخدم كمعرّف آمن للفلترة والربط في قاعدة البيانات.
                </span>
              </div>

              {/* Material Origin / Quality */}
              <div>
                <label className="block text-xs font-semibold text-[#1b1c1a] mb-1 font-readex">
                  بلد المنشأ وجودة التصنيع
                </label>
                <input
                  type="text"
                  value={materialOrigin}
                  onChange={(e) => setMaterialOrigin(e.target.value)}
                  placeholder="مثال: إسباني أصلي مقاوم للحرارة، ألماني معتمد 100%..."
                  className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2.5 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#1F5E4B] focus:ring-1 focus:ring-[#1F5E4B]"
                />
              </div>

              {/* Material Description */}
              <div>
                <label className="block text-xs font-semibold text-[#1b1c1a] mb-1 font-readex">
                  الوصف والمواصفات الفنية
                </label>
                <textarea
                  rows={3}
                  value={materialDesc}
                  onChange={(e) => setMaterialDesc(e.target.value)}
                  placeholder="مواصفات الخامة، مميزاتها، ومقاومتها للاستخدام اليومي..."
                  className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl p-3 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#1F5E4B] focus:ring-1 focus:ring-[#1F5E4B]"
                />
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#e7e5e0]">
                <button
                  type="button"
                  onClick={() => setShowMaterialModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#5e6368] hover:text-[#1b1c1a] font-medium transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={materialSaving || !materialName.trim()}
                  className="inline-flex items-center gap-1.5 bg-[#1F5E4B] hover:bg-[#164638] text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {materialSaving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>{editingMaterialId ? "حفظ التعديلات" : "إضافة الخامة وسريانها فوراً"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
