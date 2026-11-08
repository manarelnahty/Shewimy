"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Star,
  ExternalLink,
  Upload,
  X,
  Check,
  AlertCircle,
  Loader2,
  Filter,
} from "lucide-react";
import { useAdminProducts } from "@/lib/firebase/hooks";
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/firebase/firestore";
import { uploadImageFile } from "@/lib/firebase/storage";
import { Product } from "@/data/products";
import { MAIN_SECTIONS_INFO, MainSection } from "@/types/shewimy";

interface ProductFormData {
  id?: string;
  code: string;
  name: string;
  slug: string;
  mainSection: MainSection;
  subCategory: string;
  materialsText: string;
  hardware: string;
  price: number;
  priceDisplay: string;
  pricingMode: "whatsapp_quote" | "per_meter" | "fixed_price";
  priceNote: string;
  warrantyYears: number;
  imageUrl: string;
  description: string;
  isFeatured: boolean;
  status: "published" | "draft" | "archived";
}

const initialForm: ProductFormData = {
  code: "",
  name: "",
  slug: "",
  mainSection: "kitchens",
  subCategory: "بولاك مودرن",
  materialsText: "شاسيه كونتر أوروبي، لزق ألماني PUR، مفصلات بلوم",
  hardware: "مفصلات ومجاري هيدروليك بلوم نمساوي أصلي",
  price: 95000,
  priceDisplay: "طلب مقايسة وتسعير",
  pricingMode: "whatsapp_quote",
  priceNote: "السعر يشمل الرفع الهندسي، التصنيع، والتركيب الفندقي",
  warrantyYears: 15,
  imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
  description: "تصميم وتنفيذ بأحدث الماكينات الإيطالية وخامات أوروبية معتمدة 100% مع ضمان حقيقي 15 سنة.",
  isFeatured: false,
  status: "published",
};

export default function AdminProductsPage() {
  const { products, loading, error, refetch } = useAdminProducts();

  const [activeSection, setActiveSection] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSection =
      activeSection === "all" ||
      p.mainSection === activeSection ||
      (p.category as any) === activeSection;

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      (p.code && p.code.toLowerCase().includes(q)) ||
      (p.subCategory && p.subCategory.toLowerCase().includes(q)) ||
      p.materials.some((m) => m.toLowerCase().includes(q));

    return matchesSection && matchesSearch;
  });

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      ...initialForm,
      code: `SHW-${Math.floor(100 + Math.random() * 900)}`,
    });
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      id: product.id,
      code: product.code || "",
      name: product.name,
      slug: product.slug,
      mainSection: product.mainSection || (product.category as MainSection) || "kitchens",
      subCategory: product.subCategory || "",
      materialsText: product.materials.join("، "),
      hardware: product.hardware || "مفصلات ومجاري هيدروليك بلوم",
      price: product.price || 0,
      priceDisplay: product.priceDisplay || "",
      pricingMode: product.pricingMode || "whatsapp_quote",
      priceNote: product.priceNote || "",
      warrantyYears: product.warrantyYears || 15,
      imageUrl: product.imageUrl || product.coverImage || "",
      description: product.description || "",
      isFeatured: Boolean(product.isFeatured || product.featured),
      status: product.status || "published",
    });
    setModalOpen(true);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const res = await uploadImageFile(file, "catalog");
      if (res.success && res.url) {
        setFormData((prev) => ({ ...prev, imageUrl: res.url! }));
        setMessage({ type: "success", text: "تم رفع الصورة بنجاح!" });
      } else {
        setMessage({ type: "error", text: res.error || "فشل رفع الصورة" });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "خطأ أثناء رفع الملف" });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      setMessage({ type: "error", text: "يرجى كتابة اسم الموديل" });
      return;
    }

    try {
      setSubmitting(true);
      setMessage(null);

      const materialsArray = formData.materialsText
        .split(/[،,]/)
        .map((m) => m.trim())
        .filter(Boolean);

      const generatedSlug =
        formData.slug ||
        formData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "") ||
        `item-${Date.now()}`;

      const payload: Partial<Product> = {
        name: formData.name,
        title: formData.name,
        code: formData.code,
        slug: generatedSlug,
        mainSection: formData.mainSection,
        category: formData.mainSection as any,
        subCategory: formData.subCategory,
        materials: materialsArray,
        hardware: formData.hardware,
        price: Number(formData.price),
        basePrice: Number(formData.price),
        priceDisplay: formData.priceDisplay,
        pricingMode: formData.pricingMode,
        priceNote: formData.priceNote,
        warrantyYears: Number(formData.warrantyYears),
        imageUrl: formData.imageUrl,
        coverImage: formData.imageUrl,
        description: formData.description,
        isFeatured: formData.isFeatured,
        featured: formData.isFeatured,
        status: formData.status,
      };

      if (editingId) {
        const res = await updateProduct(editingId, payload);
        if (res.success) {
          setMessage({ type: "success", text: "تم تحديث المنتج بنجاح!" });
          setModalOpen(false);
          refetch();
        } else {
          setMessage({ type: "error", text: res.error || "فشل تحديث المنتج" });
        }
      } else {
        const res = await createProduct(payload);
        if (res.success) {
          setMessage({ type: "success", text: "تمت إضافة المنتج بنجاح إلى Firestore!" });
          setModalOpen(false);
          refetch();
        } else {
          setMessage({ type: "error", text: res.error || "فشل إضافة المنتج" });
        }
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "حدث خطأ غير متوقع" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من رغبتك في حذف "${name}" نهائياً من قاعدة البيانات؟`)) {
      return;
    }
    const res = await deleteProduct(id);
    if (res.success) {
      setMessage({ type: "success", text: `تم حذف "${name}" بنجاح.` });
      refetch();
    } else {
      setMessage({ type: "error", text: res.error || "فشل حذف المنتج" });
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    const current = Boolean(product.isFeatured || product.featured);
    await updateProduct(product.id, { isFeatured: !current, featured: !current });
    refetch();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-readex">
            إدارة الكتالوج والمنتجات
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            إضافة وتعديل وحذف الموديلات المتزامنة فورياً مع صفحات الكتالوج
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-[#7a5b3e] hover:bg-[#8f6b49] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة منتج جديد</span>
        </button>
      </div>

      {/* Notifications */}
      {message && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between animate-fadeIn ${
            message.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
              : "bg-rose-500/10 border border-rose-500/20 text-rose-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            )}
            <span>{message.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filters and Search Bar */}
      <div className="bg-[#0c1217] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Section Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveSection("all")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeSection === "all"
                  ? "bg-[#7a5b3e] text-white"
                  : "bg-white/5 text-gray-400 hover:text-white"
              }`}
            >
              الكل ({products.length})
            </button>
            {(Object.keys(MAIN_SECTIONS_INFO) as MainSection[]).map((secKey) => (
              <button
                key={secKey}
                type="button"
                onClick={() => setActiveSection(secKey)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  activeSection === secKey
                    ? "bg-[#7a5b3e] text-white"
                    : "bg-white/5 text-gray-400 hover:text-white"
                }`}
              >
                {MAIN_SECTIONS_INFO[secKey].labelAr.split(" ")[0]} (
                {products.filter((p) => p.mainSection === secKey).length})
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث بالاسم، الكود، أو الخامات..."
              className="w-full bg-[#131a21] border border-white/10 rounded-xl px-4 py-2 pl-9 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#7a5b3e]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#0c1217] border border-white/10 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-gray-400 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#7a5b3e]" />
            <p className="text-xs">جاري تحميل المنتجات من Firestore...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            <Package className="w-12 h-12 mx-auto text-gray-600 mb-3" />
            <p className="text-sm font-medium">لم يتم العثور على منتجات مطابقة للبحث</p>
            <button
              type="button"
              onClick={openCreateModal}
              className="mt-3 text-xs text-[#d4af37] hover:underline"
            >
              + إضافة أول موديل في هذا القسم
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-white/[0.02] border-b border-white/10 text-gray-400">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">الموديل والرمز</th>
                  <th className="py-3.5 px-4 font-semibold">القسم والتصنيف</th>
                  <th className="py-3.5 px-4 font-semibold">السعر / الوحدة</th>
                  <th className="py-3.5 px-4 font-semibold">الضمان</th>
                  <th className="py-3.5 px-4 font-semibold">المميز في الهيرو</th>
                  <th className="py-3.5 px-4 font-semibold">الحالة</th>
                  <th className="py-3.5 px-4 font-semibold text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-200">
                {filteredProducts.map((p) => {
                  const isFeat = Boolean(p.isFeatured || p.featured);
                  const img = p.imageUrl || p.coverImage || "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80";

                  return (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Image & Title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-black/40">
                            <Image
                              src={img}
                              alt={p.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-white line-clamp-1">
                              {p.name}
                            </p>
                            <span className="text-[10px] font-mono text-[#d4af37]">
                              {p.code}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Section & Category */}
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-white/5 text-gray-300 mb-1">
                          {MAIN_SECTIONS_INFO[p.mainSection]?.labelAr || p.mainSection}
                        </span>
                        <p className="text-[11px] text-gray-400 line-clamp-1">
                          {p.subCategory || "تصميم مخصص"}
                        </p>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4">
                        <p className="font-medium text-white font-mono">
                          {p.price ? `${p.price.toLocaleString()} ج.م` : p.priceDisplay}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {p.pricingMode === "whatsapp_quote" ? "طلب مقايسة" : "سعر محدد"}
                        </p>
                      </td>

                      {/* Warranty */}
                      <td className="py-3 px-4">
                        <span className="text-emerald-400 font-medium">
                          {p.warrantyYears || 15} سنة
                        </span>
                      </td>

                      {/* Featured Toggle */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(p)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isFeat
                              ? "bg-amber-500/20 text-amber-300"
                              : "bg-white/5 text-gray-500 hover:text-gray-300"
                          }`}
                          title={isFeat ? "معروض في الرئيسية (انقر للإلغاء)" : "إبراز في المعرض"}
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${
                            p.status === "published"
                              ? "bg-emerald-500/10 text-emerald-300"
                              : p.status === "draft"
                              ? "bg-amber-500/10 text-amber-300"
                              : "bg-gray-500/10 text-gray-400"
                          }`}
                        >
                          {p.status === "published"
                            ? "منشور"
                            : p.status === "draft"
                            ? "مسودة"
                            : "مؤرشف"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <a
                            href={`/catalog/${p.mainSection}/${p.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-white/5 text-gray-300 hover:text-white transition-colors"
                            title="معاينة الصفحة الحية"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            type="button"
                            onClick={() => openEditModal(p)}
                            className="p-1.5 rounded-lg bg-white/5 text-gray-300 hover:text-white transition-colors"
                            title="تعديل الموديل"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                            title="حذف الموديل"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0c1217] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <h2 className="text-lg font-bold text-white font-readex">
                {editingId ? "تعديل الموديل في الكتالوج" : "إضافة موديل جديد إلى الكتالوج"}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    اسم الموديل *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="مثال: مطبخ إيطالي بولاك آيلاند"
                    className="w-full bg-[#131a21] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#7a5b3e]"
                  />
                </div>

                {/* Code */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    كود الموديل
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="SHW-101"
                    className="w-full bg-[#131a21] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#7a5b3e]"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    الرابط الإنجليزي (Slug)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="pollak-island-italian"
                    className="w-full bg-[#131a21] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#7a5b3e]"
                    dir="ltr"
                  />
                </div>

                {/* Main Section */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    القسم الرئيسي (DRD) *
                  </label>
                  <select
                    value={formData.mainSection}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mainSection: e.target.value as MainSection,
                      })
                    }
                    className="w-full bg-[#131a21] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#7a5b3e]"
                  >
                    {(Object.keys(MAIN_SECTIONS_INFO) as MainSection[]).map((k) => (
                      <option key={k} value={k}>
                        {MAIN_SECTIONS_INFO[k].labelAr} ({MAIN_SECTIONS_INFO[k].sharePercent})
                      </option>
                    ))}
                  </select>
                </div>

                {/* SubCategory */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    التصنيف الفرعي
                  </label>
                  <input
                    type="text"
                    value={formData.subCategory}
                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                    placeholder="مثال: نيو كلاسيك خشب أرو"
                    className="w-full bg-[#131a21] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#7a5b3e]"
                  />
                </div>

                {/* Warranty */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    سنوات الضمان
                  </label>
                  <input
                    type="number"
                    value={formData.warrantyYears}
                    onChange={(e) =>
                      setFormData({ ...formData, warrantyYears: Number(e.target.value) })
                    }
                    className="w-full bg-[#131a21] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#7a5b3e]"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    السعر التقديري (ج.م)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: Number(e.target.value) })
                    }
                    className="w-full bg-[#131a21] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#7a5b3e]"
                  />
                </div>

                {/* Price Display */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    نص عرض السعر
                  </label>
                  <input
                    type="text"
                    value={formData.priceDisplay}
                    onChange={(e) =>
                      setFormData({ ...formData, priceDisplay: e.target.value })
                    }
                    placeholder="طلب مقايسة وتسعير"
                    className="w-full bg-[#131a21] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#7a5b3e]"
                  />
                </div>
              </div>

              {/* Materials */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  الخامات الأساسية (مفصولة بفواصل)
                </label>
                <input
                  type="text"
                  value={formData.materialsText}
                  onChange={(e) => setFormData({ ...formData, materialsText: e.target.value })}
                  placeholder="شاسيه كونتر أوروبي، لزق ألماني PUR، رخام كلكتا"
                  className="w-full bg-[#131a21] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#7a5b3e]"
                />
              </div>

              {/* Hardware */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  المفصلات والإكسسوارات الميكانيكية
                </label>
                <input
                  type="text"
                  value={formData.hardware}
                  onChange={(e) => setFormData({ ...formData, hardware: e.target.value })}
                  placeholder="مفصلات ومجاري هيدروليك بلوم نمساوية أصلية"
                  className="w-full bg-[#131a21] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#7a5b3e]"
                />
              </div>

              {/* Image URL & Upload */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  صورة الغلاف (رابط مباشر أو رفع ملف)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 bg-[#131a21] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#7a5b3e]"
                    dir="ltr"
                  />
                  <label className="cursor-pointer bg-white/10 hover:bg-white/15 px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 text-gray-200">
                    <Upload className="w-4 h-4 text-[#d4af37]" />
                    <span>{uploadingImage ? "جاري الرفع..." : "رفع صورة"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  الوصف والمواصفات الفنية
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#131a21] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#7a5b3e]"
                />
              </div>

              {/* Status and Featured Checks */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/10">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      setFormData({ ...formData, isFeatured: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-[#7a5b3e] focus:ring-0 bg-[#131a21] border-white/20"
                  />
                  <span className="text-xs text-gray-300">
                    إبراز الموديل في الصفحة الرئيسية (Featured Portfolio)
                  </span>
                </label>

                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-400">حالة النشر:</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as any,
                      })
                    }
                    className="bg-[#131a21] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white"
                  >
                    <option value="published">منشور (حي على الموقع)</option>
                    <option value="draft">مسودة</option>
                    <option value="archived">مؤرشف</option>
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs text-gray-400 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-[#7a5b3e] hover:bg-[#8f6b49] text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingId ? "حفظ التعديلات" : "إضافة المنتج الآن"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
