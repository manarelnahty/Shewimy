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
    <div className="space-y-6 max-w-7xl mx-auto font-cairo">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-outline-variant/20">
        <div>
          <span className="text-xs text-secondary font-semibold uppercase tracking-wider block mb-1">
            الكتالوج السحابي
          </span>
          <h1 className="text-2xl font-bold text-primary font-readex">
            إدارة الموديلات والمنتجات
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            إضافة وتعديل وحذف الموديلات المتزامنة فورياً مع صفحات الكتالوج
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-[#1F5E4B] hover:bg-[#164638] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl shadow-[0_4px_12px_rgba(31,94,75,0.2)] transition-all cursor-pointer"
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
              ? "bg-emerald-50 border border-emerald-200 text-[#1F5E4B]"
              : "bg-rose-50 border border-rose-200 text-rose-700"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? (
              <Check className="w-4 h-4 text-[#1F5E4B]" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span className="font-medium">{message.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="text-on-surface-variant hover:text-primary"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filters and Search Bar (Exact Landing Page Filter Pills) */}
      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Section Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-container overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveSection("all")}
              className={`text-xs px-3.5 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeSection === "all"
                  ? "bg-primary text-white shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
              }`}
            >
              الكل ({products.length})
            </button>
            {(Object.keys(MAIN_SECTIONS_INFO) as MainSection[]).map((secKey) => (
              <button
                key={secKey}
                type="button"
                onClick={() => setActiveSection(secKey)}
                className={`text-xs px-3.5 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeSection === secKey
                    ? "bg-primary text-white shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
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
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-2 pl-9 text-xs text-primary placeholder:text-on-surface-variant/50 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
            />
            <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-on-surface-variant flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-secondary" />
            <p className="text-xs">جاري تحميل المنتجات من Firestore...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center text-on-surface-variant">
            <Package className="w-12 h-12 mx-auto text-outline-variant mb-3" />
            <p className="text-sm font-medium">لم يتم العثور على منتجات مطابقة للبحث</p>
            <button
              type="button"
              onClick={openCreateModal}
              className="mt-3 text-xs text-secondary hover:underline font-semibold"
            >
              + إضافة أول موديل في هذا القسم
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-surface-container-low border-b border-outline-variant/20 text-on-surface-variant">
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
              <tbody className="divide-y divide-outline-variant/10 text-on-surface">
                {filteredProducts.map((p) => {
                  const isFeat = Boolean(p.isFeatured || p.featured);
                  const img = p.imageUrl || p.coverImage || "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80";

                  return (
                    <tr key={p.id} className="hover:bg-surface-container-low/60 transition-colors">
                      {/* Image & Title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-outline-variant/20 bg-surface-container">
                            <Image
                              src={img}
                              alt={p.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-primary font-readex line-clamp-1">
                              {p.name}
                            </p>
                            <span className="text-[10px] font-mono text-secondary font-semibold">
                              {p.code}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Section & Category */}
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-surface-container text-on-surface font-medium mb-1">
                          {MAIN_SECTIONS_INFO[p.mainSection]?.labelAr || p.mainSection}
                        </span>
                        <p className="text-[11px] text-on-surface-variant line-clamp-1">
                          {p.subCategory || "تصميم مخصص"}
                        </p>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4">
                        <p className="font-bold text-primary font-mono">
                          {p.price ? `${p.price.toLocaleString()} ج.م` : p.priceDisplay}
                        </p>
                        <p className="text-[10px] text-on-surface-variant">
                          {p.pricingMode === "whatsapp_quote" ? "طلب مقايسة" : "سعر محدد"}
                        </p>
                      </td>

                      {/* Warranty */}
                      <td className="py-3 px-4">
                        <span className="text-[#1F5E4B] font-bold">
                          {p.warrantyYears || 15} سنة
                        </span>
                      </td>

                      {/* Featured Toggle */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(p)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            isFeat
                              ? "bg-amber-100 text-amber-600"
                              : "bg-surface-container text-outline-variant hover:text-on-surface"
                          }`}
                          title={isFeat ? "معروض في الرئيسية (انقر للإلغاء)" : "إبراز في المعرض"}
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.status === "published"
                              ? "bg-emerald-50 text-emerald-700"
                              : p.status === "draft"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-gray-100 text-gray-600"
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
                            className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
                            title="معاينة الصفحة الحية"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            type="button"
                            onClick={() => openEditModal(p)}
                            className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors cursor-pointer"
                            title="تعديل الموديل"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative text-on-surface">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4 mb-6">
              <h2 className="text-lg font-bold text-primary font-readex">
                {editingId ? "تعديل الموديل في الكتالوج" : "إضافة موديل جديد إلى الكتالوج"}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-on-surface-variant hover:text-primary p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1 font-readex">
                    اسم الموديل *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="مثال: مطبخ إيطالي بولاك آيلاند"
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-xs text-primary focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                  />
                </div>

                {/* Code */}
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1 font-readex">
                    كود الموديل
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="SHW-101"
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-xs text-primary focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1 font-readex">
                    الرابط الإنجليزي (Slug)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="pollak-island-italian"
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-xs text-primary focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                    dir="ltr"
                  />
                </div>

                {/* Main Section */}
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1 font-readex">
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
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-xs text-primary focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
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
                  <label className="block text-xs font-semibold text-on-surface mb-1 font-readex">
                    التصنيف الفرعي
                  </label>
                  <input
                    type="text"
                    value={formData.subCategory}
                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                    placeholder="مثال: نيو كلاسيك خشب أرو"
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-xs text-primary focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                  />
                </div>

                {/* Warranty */}
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1 font-readex">
                    سنوات الضمان
                  </label>
                  <input
                    type="number"
                    value={formData.warrantyYears}
                    onChange={(e) =>
                      setFormData({ ...formData, warrantyYears: Number(e.target.value) })
                    }
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-xs text-primary focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1 font-readex">
                    السعر التقديري (ج.م)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: Number(e.target.value) })
                    }
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-xs text-primary focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                  />
                </div>

                {/* Price Display */}
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1 font-readex">
                    نص عرض السعر
                  </label>
                  <input
                    type="text"
                    value={formData.priceDisplay}
                    onChange={(e) =>
                      setFormData({ ...formData, priceDisplay: e.target.value })
                    }
                    placeholder="طلب مقايسة وتسعير"
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-xs text-primary focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                  />
                </div>
              </div>

              {/* Materials */}
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1 font-readex">
                  الخامات الأساسية (مفصولة بفواصل)
                </label>
                <input
                  type="text"
                  value={formData.materialsText}
                  onChange={(e) => setFormData({ ...formData, materialsText: e.target.value })}
                  placeholder="شاسيه كونتر أوروبي، لزق ألماني PUR، رخام كلكتا"
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-xs text-primary focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                />
              </div>

              {/* Hardware */}
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1 font-readex">
                  المفصلات والإكسسوارات الميكانيكية
                </label>
                <input
                  type="text"
                  value={formData.hardware}
                  onChange={(e) => setFormData({ ...formData, hardware: e.target.value })}
                  placeholder="مفصلات ومجاري هيدروليك بلوم نمساوية أصلية"
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-xs text-primary focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                />
              </div>

              {/* Image URL & Upload */}
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1 font-readex">
                  صورة الغلاف (رابط مباشر أو رفع ملف)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-xs text-primary focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                    dir="ltr"
                  />
                  <label className="cursor-pointer bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 text-primary font-medium">
                    <Upload className="w-4 h-4 text-secondary" />
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
                <label className="block text-xs font-semibold text-on-surface mb-1 font-readex">
                  الوصف والمواصفات الفنية
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-3 text-xs text-primary focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                />
              </div>

              {/* Status and Featured Checks */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-outline-variant/20">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      setFormData({ ...formData, isFeatured: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-[#1F5E4B] focus:ring-0 bg-surface-container border-outline-variant"
                  />
                  <span className="text-xs text-on-surface font-medium">
                    إبراز الموديل في الصفحة الرئيسية (Featured Portfolio)
                  </span>
                </label>

                <div className="flex items-center gap-2">
                  <label className="text-xs text-on-surface-variant font-medium">حالة النشر:</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as any,
                      })
                    }
                    className="bg-surface-container-low border border-outline-variant/30 rounded-lg px-2.5 py-1 text-xs text-primary"
                  >
                    <option value="published">منشور (حي على الموقع)</option>
                    <option value="draft">مسودة</option>
                    <option value="archived">مؤرشف</option>
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs text-on-surface-variant hover:text-primary font-medium"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-[#1F5E4B] hover:bg-[#164638] text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
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
