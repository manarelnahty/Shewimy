"use client";

import React, { useState } from "react";
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
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  Tag,
  SlidersHorizontal,
} from "lucide-react";
import { useAdminProducts, useCategories } from "@/lib/firebase/hooks";
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/firebase/firestore";
import { uploadImageFile, ensureStoredUrl } from "@/lib/firebase/storage";
import { isValidImageUrl } from "@/lib/image";
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
  originalPrice: number | null;
  priceDisplay: string;
  pricingMode: "whatsapp_quote" | "per_meter" | "fixed_price";
  priceNote: string;
  warrantyYears: number;
  coverImage: string;
  galleryImages: string[];
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
  originalPrice: null,
  priceDisplay: "طلب مقايسة وتسعير",
  pricingMode: "whatsapp_quote",
  priceNote: "السعر يشمل الرفع الهندسي، التصنيع، والتركيب الفندقي",
  warrantyYears: 15,
  coverImage: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
  galleryImages: [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
  ],
  description: "تصميم وتنفيذ بأحدث الماكينات الإيطالية وخامات أوروبية معتمدة 100% مع ضمان حقيقي 15 سنة.",
  isFeatured: false,
  status: "published",
};

export default function AdminProductsPage() {
  const { products, loading, refetch } = useAdminProducts();
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();

  const [activeSection, setActiveSection] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newGalleryUrlInput, setNewGalleryUrlInput] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Category modal state
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [catModalMode, setCatModalMode] = useState<"add" | "list">("add");
  const [catEditKey, setCatEditKey] = useState<string | null>(null);
  const [catFormLabelAr, setCatFormLabelAr] = useState("");
  const [catFormSharePercent, setCatFormSharePercent] = useState("");
  const [catSaving, setCatSaving] = useState(false);
  const [catMessage, setCatMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleOpenCatModal = (mode: "add" | "list") => {
    setCatModalMode(mode);
    setCatEditKey(null);
    setCatFormLabelAr("");
    setCatFormSharePercent("");
    setCatMessage(null);
    setCatModalOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!catFormLabelAr.trim()) {
      setCatMessage({ type: "error", text: "يرجى كتابة اسم القسم بالعربية" });
      return;
    }
    setCatSaving(true);
    setCatMessage(null);
    try {
      if (catEditKey) {
        const res = await updateCategory(catEditKey, {
          labelAr: catFormLabelAr.trim(),
          sharePercent: catFormSharePercent.trim() || undefined,
        });
        if (res.success) {
          setCatMessage({ type: "success", text: "تم تحديث القسم بنجاح!" });
          setCatEditKey(null);
          setCatFormLabelAr("");
          setCatFormSharePercent("");
        } else {
          setCatMessage({ type: "error", text: res.error || "فشل تحديث القسم" });
        }
      } else {
        const res = await addCategory({
          labelAr: catFormLabelAr.trim(),
          sharePercent: catFormSharePercent.trim() || undefined,
        });
        if (res.success) {
          setCatMessage({ type: "success", text: "تمت إضافة القسم بنجاح!" });
          setCatFormLabelAr("");
          setCatFormSharePercent("");
        } else {
          setCatMessage({ type: "error", text: res.error || "فشل إضافة القسم" });
        }
      }
    } finally {
      setCatSaving(false);
    }
  };

  const handleDeleteCategory = async (key: string, label: string) => {
    if (!confirm(`هل أنت متأكد من حذف قسم "${label}"؟`)) return;
    const res = await deleteCategory(key);
    if (res.success) {
      setCatMessage({ type: "success", text: `تم حذف القسم "${label}"` });
    } else {
      setCatMessage({ type: "error", text: res.error || "فشل حذف القسم" });
    }
  };

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
      galleryImages: [],
    });
    setNewGalleryUrlInput("");
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingId(product.id);
    const cover = product.coverImage || product.imageUrl || "";
    const rawGallery = product.galleryImages || product.gallery || [];
    const galleryClean = rawGallery.filter((url) => Boolean(url) && url !== cover);

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
      originalPrice: product.originalPrice ?? null,
      priceDisplay: product.priceDisplay || "",
      pricingMode: product.pricingMode || "whatsapp_quote",
      priceNote: product.priceNote || "",
      warrantyYears: product.warrantyYears || 15,
      coverImage: cover,
      galleryImages: galleryClean,
      description: product.description || "",
      isFeatured: Boolean(product.isFeatured || product.featured),
      status: product.status || "published",
    });
    setNewGalleryUrlInput("");
    setModalOpen(true);
  };

  // Upload Cover Image
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const res = await uploadImageFile(file, "catalog");
      if (res.success && res.url) {
        setFormData((prev) => ({ ...prev, coverImage: res.url! }));
        setMessage({ type: "success", text: "تم رفع صورة الغلاف بنجاح!" });
      } else {
        setMessage({ type: "error", text: res.error || "فشل رفع الصورة" });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "حدث خطأ أثناء رفع الصورة" });
    } finally {
      setUploadingImage(false);
    }
  };

  // Upload additional Gallery images
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingImage(true);
      const newUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const res = await uploadImageFile(files[i], "catalog/gallery");
        if (res.success && res.url) {
          newUrls.push(res.url);
        }
      }

      if (newUrls.length > 0) {
        setFormData((prev) => ({
          ...prev,
          galleryImages: [...prev.galleryImages, ...newUrls],
        }));
        setMessage({
          type: "success",
          text: `تم رفع ${newUrls.length} صورة إلى المعرض بنجاح!`,
        });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "فشل رفع بعض الصور" });
    } finally {
      setUploadingImage(false);
    }
  };

  // Add gallery image by URL
  const handleAddGalleryUrl = () => {
    const trimmed = newGalleryUrlInput.trim();
    if (!trimmed) return;
    if (formData.galleryImages.includes(trimmed) || formData.coverImage === trimmed) {
      setMessage({ type: "error", text: "هذه الصورة موجودة بالفعل" });
      return;
    }
    setFormData((prev) => ({
      ...prev,
      galleryImages: [...prev.galleryImages, trimmed],
    }));
    setNewGalleryUrlInput("");
  };

  // Set any gallery image as Cover Image
  const handleSetAsCover = (index: number) => {
    const selectedImage = formData.galleryImages[index];
    if (!selectedImage) return;

    const oldCover = formData.coverImage;
    const updatedGallery = formData.galleryImages.filter((_, i) => i !== index);
    if (oldCover) {
      updatedGallery.push(oldCover);
    }

    setFormData((prev) => ({
      ...prev,
      coverImage: selectedImage,
      galleryImages: updatedGallery,
    }));
    setMessage({ type: "success", text: "تم تعيين الصورة كغلاف أساسي للمشروع!" });
  };

  // Remove image from gallery
  const handleRemoveGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) {
      setMessage({ type: "error", text: "يرجى كتابة اسم الموديل والرابط الإنجليزي" });
      return;
    }

    if (!formData.coverImage) {
      setMessage({ type: "error", text: "يرجى تحديد صورة الغلاف الأساسية للموديل" });
      return;
    }

    try {
      setSubmitting(true);
      setMessage(null);

      const cleanCover = await ensureStoredUrl(formData.coverImage, "cover");
      const cleanGalleryList: string[] = [];
      for (let i = 0; i < formData.galleryImages.length; i++) {
        cleanGalleryList.push(await ensureStoredUrl(formData.galleryImages[i], `gallery_${i}`));
      }

      const materialsArray = formData.materialsText
        .split(/[،,]/)
        .map((m) => m.trim())
        .filter(Boolean);

      const allGallery = [cleanCover, ...cleanGalleryList].filter(Boolean);

      const payload: Partial<Product> = {
        code: formData.code,
        name: formData.name,
        slug: formData.slug,
        mainSection: formData.mainSection,
        category: formData.mainSection as any,
        subCategory: formData.subCategory,
        materials: materialsArray,
        hardware: formData.hardware,
        price: Number(formData.price),
        basePrice: Number(formData.price),
        originalPrice: formData.originalPrice != null && formData.originalPrice > 0
          ? Number(formData.originalPrice)
          : null,
        priceDisplay: formData.priceDisplay,
        pricingMode: formData.pricingMode,
        priceNote: formData.priceNote,
        warrantyYears: Number(formData.warrantyYears),
        imageUrl: cleanCover,
        coverImage: cleanCover,
        gallery: allGallery,
        galleryImages: allGallery,
        description: formData.description,
        isFeatured: formData.isFeatured,
        featured: formData.isFeatured,
        status: formData.status,
      };

      if (editingId) {
        const res = await updateProduct(editingId, payload);
        if (res.success) {
          setMessage({ type: "success", text: "تم تحديث المنتج وصوره بنجاح!" });
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
    <div className="space-y-6 max-w-7xl mx-auto font-cairo text-[#1b1c1a]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#e7e5e0]">
        <div>
          <span className="text-xs text-[#855224] font-semibold uppercase tracking-wider block mb-1">
            الكتالوج السحابي وإدارة المعرض
          </span>
          <h1 className="text-2xl font-bold text-[#1b1c1a] font-readex">
            إدارة الموديلات والمشاريع والأسعار
          </h1>
          <p className="text-xs sm:text-sm text-[#5e6368] mt-1">
            التحكم في كافة المنتجات المعروضة، الأسعار، صورة الغلاف، ومعرض الصور التفاعلي المتحرك
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-[#1F5E4B] hover:bg-[#164638] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl shadow-xs hover:shadow transition-all cursor-pointer"
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
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-rose-50 border border-rose-200 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span className="font-medium">{message.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="text-[#5e6368] hover:text-[#1b1c1a]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filters and Search Bar */}
      <div className="bg-white border border-[#e7e5e0] rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Section Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#f8f6f2] border border-[#e7e5e0] overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveSection("all")}
              className={`text-xs px-3.5 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeSection === "all"
                  ? "bg-[#1F5E4B] text-white shadow-xs"
                  : "text-[#5e6368] hover:text-[#1b1c1a] hover:bg-white"
              }`}
            >
              الكل ({products.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveSection(cat.key)}
                className={`text-xs px-3.5 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeSection === cat.key
                    ? "bg-[#1F5E4B] text-white shadow-xs"
                    : "text-[#5e6368] hover:text-[#1b1c1a] hover:bg-white"
                }`}
              >
                {cat.labelAr.split(" ")[0]} (
                {products.filter((p) => p.mainSection === cat.key).length})
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
              className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-4 py-2 pl-9 text-xs text-[#1b1c1a] placeholder-[#9ca3af] focus:outline-none focus:border-[#855224] focus:ring-1 focus:ring-[#855224]"
            />
            <Search className="w-4 h-4 text-[#855224] absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-[#e7e5e0] rounded-2xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-20 text-center text-[#5e6368] flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#855224]" />
            <p className="text-xs">جاري تحميل المنتجات من Firestore...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center text-[#5e6368]">
            <Package className="w-12 h-12 mx-auto text-[#9ca3af] mb-3" />
            <p className="text-sm font-medium text-[#1b1c1a]">لم يتم العثور على منتجات مطابقة للبحث</p>
            <button
              type="button"
              onClick={openCreateModal}
              className="mt-3 text-xs text-[#855224] hover:underline font-semibold"
            >
              + إضافة أول موديل في هذا القسم
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#f5f3ef] border-b border-[#e7e5e0] text-[#5e6368]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold font-readex">الموديل والرمز</th>
                  <th className="py-3.5 px-4 font-semibold font-readex">القسم والتصنيف</th>
                  <th className="py-3.5 px-4 font-semibold font-readex">السعر وطريقة العرض</th>
                  <th className="py-3.5 px-4 font-semibold font-readex">الصور والمعرض</th>
                  <th className="py-3.5 px-4 font-semibold font-readex">المميز</th>
                  <th className="py-3.5 px-4 font-semibold font-readex">الحالة</th>
                  <th className="py-3.5 px-4 font-semibold text-center font-readex">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e7e5e0] text-[#1b1c1a]">
                {filteredProducts.map((p) => {
                  const isFeat = Boolean(p.isFeatured || p.featured);
                  const img = p.coverImage || p.imageUrl || "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80";
                  const totalImagesCount = (p.galleryImages || p.gallery || []).length || 1;

                  return (
                    <tr key={p.id} className="hover:bg-[#fbf9f5] transition-colors">
                      {/* Image & Title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-[#e7e5e0] bg-[#f8f6f2]">
                            {isValidImageUrl(img) ? (
                              <img
                                src={img}
                                alt={p.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.currentTarget as HTMLElement).style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[9px] text-[#5e6368]">
                                -
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-[#1b1c1a] font-readex line-clamp-1">
                              {p.name}
                            </p>
                            <span className="text-[10px] font-mono text-[#855224] font-semibold">
                              {p.code}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Section & Category */}
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-[#855224]/10 text-[#855224] font-medium border border-[#855224]/20 mb-1">
                          {MAIN_SECTIONS_INFO[p.mainSection]?.labelAr || p.mainSection}
                        </span>
                        <p className="text-[11px] text-[#5e6368] line-clamp-1">
                          {p.subCategory || "تصميم مخصص"}
                        </p>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4">
                        <p className="font-bold text-[#1b1c1a] font-mono">
                          {p.price ? `${p.price.toLocaleString()} ج.م` : p.priceDisplay}
                        </p>
                        <p className="text-[10px] text-[#5e6368]">
                          {p.pricingMode === "whatsapp_quote"
                            ? "طلب مقايسة"
                            : p.pricingMode === "per_meter"
                            ? "بالمتر الطولي"
                            : "سعر محدد"}
                        </p>
                      </td>

                      {/* Gallery count */}
                      <td className="py-3 px-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#f5f3ef] border border-[#e7e5e0] text-[#1b1c1a] font-semibold text-[11px]">
                          <Layers className="w-3.5 h-3.5 text-[#855224]" />
                          <span>{totalImagesCount} صور</span>
                        </div>
                      </td>

                      {/* Featured Toggle */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(p)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer border ${
                            isFeat
                              ? "bg-amber-50 text-amber-600 border-amber-200"
                              : "bg-[#f5f3ef] text-[#9ca3af] hover:text-[#1b1c1a] border-[#e7e5e0]"
                          }`}
                          title={isFeat ? "معروض في الرئيسية (انقر للإلغاء)" : "إبراز في المعرض"}
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                            p.status === "published"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : p.status === "draft"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-gray-100 text-gray-600 border-gray-200"
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
                            className="p-1.5 rounded-lg bg-[#f5f3ef] hover:bg-[#eae8e4] text-[#44474a] hover:text-[#1b1c1a] border border-[#e7e5e0] transition-colors"
                            title="معاينة الصفحة الحية"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            type="button"
                            onClick={() => openEditModal(p)}
                            className="p-1.5 rounded-lg bg-[#f5f3ef] hover:bg-[#eae8e4] text-[#44474a] hover:text-[#1b1c1a] border border-[#e7e5e0] transition-colors cursor-pointer"
                            title="تعديل الموديل والصور"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-[#e7e5e0] rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative text-[#1b1c1a]">
            <div className="flex items-center justify-between border-b border-[#e7e5e0] pb-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-[#1b1c1a] font-readex">
                  {editingId ? "تعديل الموديل ومعرض الصور" : "إضافة موديل جديد مع معرض صور متحرك"}
                </h2>
                <p className="text-xs text-[#5e6368] mt-0.5">
                  تحكم كامل في الأسعار، المواصفات، صورة الغلاف، وبقية صور السلايدر التفاعلي
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-[#5e6368] hover:text-[#1b1c1a] p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* SECTION 1: Product Basic Data */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-[#855224] uppercase tracking-wider font-readex">
                  1. البيانات الأساسية والتصنيف
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Title */}
                  <div>
                    <label className="block text-xs font-semibold text-[#1b1c1a] mb-1 font-readex">
                      اسم الموديل *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="مثال: مطبخ إيطالي بولاك آيلاند"
                      className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2.5 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#855224] focus:ring-1 focus:ring-[#855224]"
                    />
                  </div>

                  {/* Code */}
                  <div>
                    <label className="block text-xs font-semibold text-[#1b1c1a] mb-1 font-readex">
                      كود الموديل
                    </label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      placeholder="SHW-101"
                      className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2.5 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#855224] focus:ring-1 focus:ring-[#855224]"
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-xs font-semibold text-[#1b1c1a] mb-1 font-readex">
                      الرابط الإنجليزي (Slug) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="pollak-island-italian"
                      className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2.5 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#855224] focus:ring-1 focus:ring-[#855224]"
                      dir="ltr"
                    />
                  </div>

                  {/* Main Section */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-[#1b1c1a] font-readex">
                        القسم الرئيسي *
                      </label>
                      <button
                        type="button"
                        onClick={() => handleOpenCatModal("add")}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1F5E4B] hover:text-[#164638] hover:underline cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>إضافة قسم</span>
                      </button>
                    </div>
                    <select
                      value={formData.mainSection}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mainSection: e.target.value as MainSection,
                        })
                      }
                      className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2.5 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#855224] focus:ring-1 focus:ring-[#855224]"
                    >
                      {categories.map((c) => (
                        <option key={c.key} value={c.key}>
                          {c.labelAr} {c.sharePercent ? `(${c.sharePercent})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* SubCategory */}
                  <div>
                    <label className="block text-xs font-semibold text-[#1b1c1a] mb-1 font-readex">
                      التصنيف الفرعي
                    </label>
                    <input
                      type="text"
                      value={formData.subCategory}
                      onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                      placeholder="مثال: نيو كلاسيك خشب أرو"
                      className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2.5 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#855224] focus:ring-1 focus:ring-[#855224]"
                    />
                  </div>

                  {/* Warranty */}
                  <div>
                    <label className="block text-xs font-semibold text-[#1b1c1a] mb-1 font-readex">
                      سنوات الضمان
                    </label>
                    <input
                      type="number"
                      value={formData.warrantyYears}
                      onChange={(e) =>
                        setFormData({ ...formData, warrantyYears: Number(e.target.value) })
                      }
                      className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2.5 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#855224] focus:ring-1 focus:ring-[#855224]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: Pricing Control */}
              <div className="space-y-4 pt-4 border-t border-[#e7e5e0]">
                <h3 className="text-xs font-bold text-[#855224] uppercase tracking-wider font-readex">
                  2. نظام الأسعار وطريقة العرض
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1b1c1a] mb-1 font-readex">
                      طريقة التسعير *
                    </label>
                    <select
                      value={formData.pricingMode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pricingMode: e.target.value as any,
                        })
                      }
                      className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2.5 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#855224] focus:ring-1 focus:ring-[#855224]"
                    >
                      <option value="whatsapp_quote">طلب مقايسة واستفسار واتساب</option>
                      <option value="per_meter">تسعير بالمتر الطولي/المربع</option>
                      <option value="fixed_price">سعر ثابت محدد</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1b1c1a] mb-1 font-readex">
                      السعر الرقمي (ج.م)
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: Number(e.target.value) })
                      }
                      className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2.5 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#855224] focus:ring-1 focus:ring-[#855224]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1b1c1a] mb-1 font-readex">
                      السعر قبل الخصم (اختياري)
                    </label>
                    <input
                      type="number"
                      value={formData.originalPrice ?? ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          originalPrice: e.target.value ? Number(e.target.value) : null,
                        })
                      }
                      placeholder="اتركه فارغاً إذا لا يوجد خصم"
                      className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2.5 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#855224] focus:ring-1 focus:ring-[#855224]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1b1c1a] mb-1 font-readex">
                      نص عرض السعر في البطاقة
                    </label>
                    <input
                      type="text"
                      value={formData.priceDisplay}
                      onChange={(e) =>
                        setFormData({ ...formData, priceDisplay: e.target.value })
                      }
                      placeholder="طلب مقايسة وتسعير"
                      className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2.5 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#855224] focus:ring-1 focus:ring-[#855224]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1b1c1a] mb-1 font-readex">
                    ملاحظة شمول السعر والتركيب
                  </label>
                  <input
                    type="text"
                    value={formData.priceNote}
                    onChange={(e) =>
                      setFormData({ ...formData, priceNote: e.target.value })
                    }
                    placeholder="السعر يشمل الرفع الهندسي، التصنيع، والتركيب الفندقي"
                    className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2.5 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#855224] focus:ring-1 focus:ring-[#855224]"
                  />
                </div>
              </div>

              {/* SECTION 3: Multi-Image Management (Cover + Gallery) */}
              <div className="space-y-4 pt-4 border-t border-[#e7e5e0]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-[#855224] uppercase tracking-wider font-readex">
                      3. إدارة صور المشروع (صورة الغلاف + صور السلايدر التفاعلي)
                    </h3>
                    <p className="text-[11px] text-[#5e6368] mt-0.5">
                      الصورة الأولى ستكون الغلاف الدائم، وبقية الصور ستقلب تلقائياً كلما مر مؤشر الماوس أو اللمس على المشروع
                    </p>
                  </div>
                  {uploadingImage && (
                    <span className="text-xs text-[#855224] flex items-center gap-1.5 animate-pulse font-medium">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      جاري رفع الصور...
                    </span>
                  )}
                </div>

                {/* Primary Cover Image Box */}
                <div className="bg-[#f8f6f2] border border-[#e7e5e0] rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1F5E4B] flex items-center gap-1.5 font-readex">
                      <CheckCircle2 className="w-4 h-4 text-[#1F5E4B]" />
                      صورة الغلاف الأساسية (Cover Image)
                    </span>
                    <span className="text-[10px] text-[#5e6368]">
                      تظهر كأول صورة ثابتة للبطاقة والمشروع
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    {isValidImageUrl(formData.coverImage) ? (
                      <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-[#d6d3cd] shrink-0 bg-white">
                        <img
                          src={formData.coverImage}
                          alt="Cover Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = "none";
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-16 rounded-lg border border-dashed border-[#d6d3cd] flex items-center justify-center text-xs text-[#9ca3af] shrink-0 bg-white">
                        بلا غلاف
                      </div>
                    )}

                    <input
                      type="url"
                      value={formData.coverImage}
                      onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                      placeholder="رابط صورة الغلاف أو ارفع ملف من الزر..."
                      className="flex-1 w-full bg-white border border-[#d6d3cd] rounded-xl px-3.5 py-2 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#855224]"
                      dir="ltr"
                    />

                    <label className="cursor-pointer bg-white hover:bg-[#eae8e4] border border-[#d6d3cd] px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 text-[#1b1c1a] font-medium transition-colors shrink-0">
                      <Upload className="w-3.5 h-3.5 text-[#855224]" />
                      <span>رفع غلاف جديد</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverUpload}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>
                </div>

                {/* Additional Gallery Images */}
                <div className="bg-[#f8f6f2] border border-[#e7e5e0] rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1b1c1a] flex items-center gap-1.5 font-readex">
                      <Layers className="w-4 h-4 text-[#855224]" />
                      صور المعرض الإضافية ({formData.galleryImages.length} صور)
                    </span>

                    <label className="cursor-pointer bg-[#1F5E4B] hover:bg-[#164638] text-white px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 font-semibold transition-colors shadow-2xs">
                      <Plus className="w-3.5 h-3.5" />
                      <span>رفع صور متعددة</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryUpload}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>

                  {/* Add Image by URL input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={newGalleryUrlInput}
                      onChange={(e) => setNewGalleryUrlInput(e.target.value)}
                      placeholder="أو أضف رابط صورة إضافية هنا..."
                      className="flex-1 bg-white border border-[#d6d3cd] rounded-lg px-3 py-1.5 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#855224]"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={handleAddGalleryUrl}
                      className="bg-white hover:bg-[#eae8e4] border border-[#d6d3cd] px-3 py-1.5 rounded-lg text-xs font-semibold text-[#1b1c1a] transition-colors"
                    >
                      + إضافة للصور
                    </button>
                  </div>

                  {/* Gallery Thumbnails List */}
                  {formData.galleryImages.length === 0 ? (
                    <p className="text-[11px] text-[#5e6368] py-2 text-center">
                      لا توجد صور إضافية بعد. يمكنك رفع عدة صور لتقلب تلقائياً مع صورة الغلاف عند تمرير الماوس.
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      {formData.galleryImages.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className="group relative bg-white border border-[#d6d3cd] rounded-xl overflow-hidden shadow-2xs p-1 flex flex-col justify-between"
                        >
                          <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[#f5f3ef]">
                            {isValidImageUrl(imgUrl) ? (
                              <img
                                src={imgUrl}
                                alt={`Gallery ${idx + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.currentTarget as HTMLElement).style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-[#5e6368]">
                                رابط غير صالح
                              </div>
                            )}
                            <span className="absolute top-1 right-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                              #{idx + 1}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-1 pt-1.5">
                            <button
                              type="button"
                              onClick={() => handleSetAsCover(idx)}
                              className="text-[10px] text-[#1F5E4B] hover:underline font-semibold"
                              title="تبديل هذه الصورة لتصبح الغلاف الرئيسي"
                            >
                              تعيين كغلاف
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(idx)}
                              className="text-[10px] text-rose-600 hover:text-rose-800 p-1"
                              title="حذف من المعرض"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 4: Materials & Specs */}
              <div className="space-y-4 pt-4 border-t border-[#e7e5e0]">
                <h3 className="text-xs font-bold text-[#855224] uppercase tracking-wider font-readex">
                  4. الخامات والمواصفات الفنية
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-[#1b1c1a] mb-1 font-readex">
                    الخامات الأساسية (مفصولة بفواصل)
                  </label>
                  <input
                    type="text"
                    value={formData.materialsText}
                    onChange={(e) => setFormData({ ...formData, materialsText: e.target.value })}
                    placeholder="شاسيه كونتر أوروبي، لزق ألماني PUR، رخام كلكتا"
                    className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2.5 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#855224] focus:ring-1 focus:ring-[#855224]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1b1c1a] mb-1 font-readex">
                    المفصلات والإكسسوارات الميكانيكية
                  </label>
                  <input
                    type="text"
                    value={formData.hardware}
                    onChange={(e) => setFormData({ ...formData, hardware: e.target.value })}
                    placeholder="مفصلات ومجاري هيدروليك بلوم نمساوية أصلية"
                    className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2.5 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#855224] focus:ring-1 focus:ring-[#855224]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1b1c1a] mb-1 font-readex">
                    الوصف والمواصفات الفنية
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl p-3 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#855224] focus:ring-1 focus:ring-[#855224]"
                  />
                </div>
              </div>

              {/* Status and Featured Checks */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#e7e5e0]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      setFormData({ ...formData, isFeatured: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-[#1F5E4B] focus:ring-0 bg-[#fbf9f5] border-[#d6d3cd]"
                  />
                  <span className="text-xs text-[#1b1c1a] font-medium">
                    إبراز الموديل في الصفحة الرئيسية (Featured Portfolio)
                  </span>
                </label>

                <div className="flex items-center gap-2">
                  <label className="text-xs text-[#5e6368] font-medium">حالة النشر:</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as any,
                      })
                    }
                    className="bg-[#fbf9f5] border border-[#d6d3cd] rounded-lg px-2.5 py-1 text-xs text-[#1b1c1a]"
                  >
                    <option value="published">منشور (حي على الموقع)</option>
                    <option value="draft">مسودة</option>
                    <option value="archived">مؤرشف</option>
                  </select>
                </div>
              </div>

              {/* Bottom Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e7e5e0]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs text-[#5e6368] hover:text-[#1b1c1a] font-medium transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-[#1F5E4B] hover:bg-[#164638] text-white text-xs font-semibold px-6 py-2.5 rounded-xl shadow-xs hover:shadow transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingId ? "حفظ التعديلات والصور" : "إضافة المنتج الآن"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Management Modal */}
      {catModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-[#e7e5e0] rounded-2xl w-full max-w-lg p-6 shadow-2xl relative text-[#1b1c1a]">
            <div className="flex items-center justify-between border-b border-[#e7e5e0] pb-4 mb-5">
              <div>
                <h2 className="text-base font-bold text-[#1b1c1a] font-readex flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#855224]" />
                  {catModalMode === "add" ? "إضافة قسم جديد" : "إدارة الأقسام"}
                </h2>
                <p className="text-xs text-[#5e6368] mt-0.5">
                  الأقسام تظهر في فلاتر الموقع ولوحة إدارة المنتجات
                </p>
              </div>
              <button
                type="button"
                onClick={() => { setCatModalOpen(false); setCatMessage(null); }}
                className="text-[#5e6368] hover:text-[#1b1c1a] p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {catMessage && (
              <div className={`mb-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
                catMessage.type === "success"
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                  : "bg-rose-50 border border-rose-200 text-rose-800"
              }`}>
                {catMessage.type === "success"
                  ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                <span>{catMessage.text}</span>
              </div>
            )}

            {/* Add / Edit Form */}
            <div className="space-y-3 mb-5">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-[#1b1c1a] mb-1 font-readex">
                    {catEditKey ? "تعديل اسم القسم" : "اسم القسم بالعربية"}
                  </label>
                  <input
                    type="text"
                    value={catFormLabelAr}
                    onChange={(e) => setCatFormLabelAr(e.target.value)}
                    placeholder="مثال: مطابخ حديثة"
                    className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2.5 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#855224] focus:ring-1 focus:ring-[#855224]"
                  />
                </div>
                <div className="w-24">
                  <label className="block text-xs font-semibold text-[#1b1c1a] mb-1 font-readex">
                    النسبة %
                  </label>
                  <input
                    type="text"
                    value={catFormSharePercent}
                    onChange={(e) => setCatFormSharePercent(e.target.value)}
                    placeholder="60%"
                    className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3 py-2.5 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#855224]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSaveCategory}
                  disabled={catSaving}
                  className="inline-flex items-center gap-1.5 bg-[#1F5E4B] hover:bg-[#164638] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {catSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>{catEditKey ? "تحديث" : "إضافة"}</span>
                </button>
              </div>
              {catEditKey && (
                <button
                  type="button"
                  onClick={() => { setCatEditKey(null); setCatFormLabelAr(""); setCatFormSharePercent(""); }}
                  className="text-xs text-[#5e6368] hover:underline"
                >
                  إلغاء التعديل
                </button>
              )}
            </div>

            {/* Existing Categories List */}
            <div className="border-t border-[#e7e5e0] pt-4 space-y-2">
              <p className="text-xs font-semibold text-[#5e6368] mb-2">الأقسام الحالية ({categories.length})</p>
              {categories.map((cat) => (
                <div key={cat.key} className="flex items-center justify-between bg-[#fbf9f5] border border-[#e7e5e0] rounded-xl px-3.5 py-2">
                  <div>
                    <span className="text-xs font-semibold text-[#1b1c1a]">{cat.labelAr}</span>
                    {cat.sharePercent && (
                      <span className="mr-2 text-[10px] text-[#855224] font-mono">({cat.sharePercent})</span>
                    )}
                    <span className="mr-2 text-[10px] text-[#9ca3af] font-mono">{cat.key}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setCatEditKey(cat.key);
                        setCatFormLabelAr(cat.labelAr);
                        setCatFormSharePercent(cat.sharePercent || "");
                        setCatModalMode("add");
                      }}
                      className="p-1.5 rounded-lg bg-white border border-[#e7e5e0] text-[#5e6368] hover:text-[#1b1c1a] transition-colors cursor-pointer"
                      title="تعديل"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat.key, cat.labelAr)}
                      className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                      title="حذف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
