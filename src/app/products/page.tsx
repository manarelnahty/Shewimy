"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ConsultationDrawer } from "@/components/common/ConsultationDrawer";
import { BranchSelectionModal } from "@/components/common/BranchSelectionModal";
import { productsData, Product, BranchKey } from "@/data/products";
import {
  Search,
  ChevronDown,
  MapPin,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

function WhatsAppIcon({ className = "w-4 h-4 shrink-0" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662a11.835 11.835 0 005.712 1.465h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.483-8.413z" />
    </svg>
  );
}

function ReloadIcon({ className = "w-3.5 h-3.5 shrink-0" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

type CategoryFilter = "all" | "kitchens" | "dressing" | "furniture" | "cladding";
type StyleFilter = "all" | "modern" | "classic" | "neoclassic" | "ultramodern";
type MaterialFilter = "all" | "polylac" | "hpl" | "natural_walnut" | "massive_oak" | "fume_glass";
type SortOption = "default" | "price_asc" | "price_desc";
type PriceRangeFilter = "all" | "under_80k" | "80k_to_120k" | "above_120k";
type BranchFilter = "all" | BranchKey;

export default function ProductsPage() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [branchModalProduct, setBranchModalProduct] = useState<Product | null>(null);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");
  const [selectedBranch, setSelectedBranch] = useState<BranchFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<StyleFilter>("all");
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [priceRange, setPriceRange] = useState<PriceRangeFilter>("all");

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSelectedBranch("all");
    setSearchQuery("");
    setSelectedStyle("all");
    setSelectedMaterial("all");
    setSortBy("default");
    setPriceRange("all");
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let result = [...productsData];

    // Branch filter
    if (selectedBranch !== "all") {
      result = result.filter((p) => p.branches.includes(selectedBranch));
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Style filter
    if (selectedStyle !== "all") {
      result = result.filter((p) => p.style === selectedStyle);
    }

    // Material filter
    if (selectedMaterial !== "all") {
      result = result.filter((p) => p.material === selectedMaterial);
    }

    // Price range filter
    if (priceRange === "under_80k") {
      result = result.filter((p) => p.price < 80000);
    } else if (priceRange === "80k_to_120k") {
      result = result.filter((p) => p.price >= 80000 && p.price <= 120000);
    } else if (priceRange === "above_120k") {
      result = result.filter((p) => p.price > 120000);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.materialLabel.toLowerCase().includes(q) ||
          p.specs.some((s) => s.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === "price_asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [selectedCategory, selectedBranch, selectedStyle, selectedMaterial, priceRange, searchQuery, sortBy]);

  return (
    <div className="flex flex-col min-h-screen bg-surface text-on-surface antialiased selection:bg-secondary-container selection:text-on-secondary-container">
      {/* Header with consultation trigger */}
      <Header onOpenConsultation={() => setIsConsultationOpen(true)} />

      <main className="flex-1 w-full pt-20">
        {/* SUB-HERO SECTION */}
        <section className="w-full bg-surface-container-low/70 py-10 lg:py-14 border-b border-charcoal/10">
          <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12">
            {/* Breadcrumb Navigation */}
            <nav
              aria-label="مسار التصفح"
              className="flex items-center gap-2 mb-4 text-xs font-semibold text-on-surface-variant"
            >
              <Link href="/" className="hover:text-primary transition-colors">
                الرئيسية
              </Link>
              <span className="text-outline-variant font-bold">/</span>
              <span className="text-secondary font-bold">كتالوج أعمال ومنتجات الشويمي</span>
            </nav>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-fixed/50 text-secondary text-xs font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  <span>الأسعار الاسترشادية الشاملة للتصنيع والتركيب</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary font-readex leading-tight">
                  كتالوج منتجات ومطابخ الشويمي .. <br />
                  <span className="text-secondary">الأصل، النظام، ودقة الصنعة</span>
                </h1>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  تصفح تشكيلاتنا مع الأسعار التقديرية لكل موديل وفق المقاييس القياسية. جميع المنتجات تصنع بماكينات إيطالية وخامات أوروبية 100% مع ضمان حقيقي 15 سنة.
                </p>
              </div>

              {/* Quick Highlights Bar */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-white rounded-xl shadow-sm shrink-0 border border-charcoal/10" dir="rtl">
                <div className="flex flex-col items-center justify-center p-2.5 text-center rounded-lg bg-surface-container-low" dir="rtl">
                  <span className="text-lg sm:text-xl font-bold text-primary font-readex">
                    {productsData.length}
                  </span>
                  <span className="text-[11px] text-on-surface-variant mt-0.5 font-semibold font-cairo">
                    موديل معروض
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-2.5 text-center rounded-lg bg-surface-container-low" dir="rtl">
                  <span className="text-lg sm:text-xl font-bold text-[#1F5E4B] font-readex">
                    100%
                  </span>
                  <span className="text-[11px] text-on-surface-variant mt-0.5 font-semibold font-cairo">
                    خامات أوروبية
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-2.5 text-center rounded-lg bg-surface-container-low" dir="rtl">
                  <span className="text-lg sm:text-xl font-bold text-secondary font-readex">
                    15 سنة
                  </span>
                  <span className="text-[11px] text-on-surface-variant mt-0.5 font-semibold font-cairo">
                    ضمان حقيقي
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STICKY FILTER & SEARCH BAR */}
        <section
          id="filter-bar"
          className="bg-[#fbf9f5] z-30 sticky top-20 border-b border-gray-200/80 shadow-sm py-3 w-full"
          style={{ backgroundColor: "#fbf9f5" }}
        >
          <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 space-y-3">
            {/* Category Tabs (Pills with exact Stitch AI style) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  selectedCategory === "all"
                    ? "bg-[#1E2225] text-white shadow-sm"
                    : "bg-[#F3EFEA] hover:bg-[#eae5de] text-charcoal"
                }`}
              >
                الكل (+48)
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory("kitchens")}
                className={`shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedCategory === "kitchens"
                    ? "bg-[#1E2225] text-white shadow-sm"
                    : "bg-[#F3EFEA] hover:bg-[#eae5de] text-charcoal"
                }`}
              >
                مطابخ حديثة (28)
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory("dressing")}
                className={`shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedCategory === "dressing"
                    ? "bg-[#1E2225] text-white shadow-sm"
                    : "bg-[#F3EFEA] hover:bg-[#eae5de] text-charcoal"
                }`}
              >
                دريسينج روم ووحدات تخزين (9)
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory("furniture")}
                className={`shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedCategory === "furniture"
                    ? "bg-[#1E2225] text-white shadow-sm"
                    : "bg-[#F3EFEA] hover:bg-[#eae5de] text-charcoal"
                }`}
              >
                أثاث منزلي مخصص (5)
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory("cladding")}
                className={`shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedCategory === "cladding"
                    ? "bg-[#1E2225] text-white shadow-sm"
                    : "bg-[#F3EFEA] hover:bg-[#eae5de] text-charcoal"
                }`}
              >
                ديكورات وتجاليد خشبية (4)
              </button>
            </div>

            {/* Advanced Filters: Search + Branch + Style + Material + Sorting */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-2.5">
              {/* Search Input */}
              <div className="lg:col-span-3 relative">
                <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="ابحث بالاسم أو الكود..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white text-gray-700 placeholder:text-gray-400 text-sm pr-9 pl-3.5 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#1F5E4B] transition-all"
                />
              </div>

              {/* Branch Selector Dropdown */}
              <div className="lg:col-span-3 relative">
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value as BranchFilter)}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-lg pr-9 pl-8 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#1F5E4B] cursor-pointer transition-all font-semibold"
                >
                  <option value="all">كافة الفروع</option>
                  <option value="mansoura">فرع المنصورة</option>
                  <option value="samanoud_mahalla">فرع سمنود والمحلة</option>
                </select>
                <MapPin className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-[#1F5E4B] pointer-events-none" />
                <ChevronDown className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* Style Dropdown */}
              <div className="lg:col-span-2 relative">
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value as StyleFilter)}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 pl-8 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#1F5E4B] cursor-pointer transition-all font-medium"
                >
                  <option value="all">كافة الأنماط</option>
                  <option value="modern">مودرن حديث</option>
                  <option value="classic">كلاسيك فاخر</option>
                  <option value="neoclassic">نيو كلاسيك</option>
                  <option value="ultramodern">ألترا مودرن</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* Material Dropdown */}
              <div className="lg:col-span-2 relative">
                <select
                  value={selectedMaterial}
                  onChange={(e) => setSelectedMaterial(e.target.value as MaterialFilter)}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 pl-8 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#1F5E4B] cursor-pointer transition-all font-medium"
                >
                  <option value="all">كافة الخامات</option>
                  <option value="polylac">بولاك تركي</option>
                  <option value="hpl">HPL ألماني</option>
                  <option value="natural_walnut">جوز أمريكي</option>
                  <option value="massive_oak">أرو ماسيف</option>
                  <option value="fume_glass">زجاج فاميه</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* Sort Select */}
              <div className="lg:col-span-2 relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 pl-8 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#1F5E4B] cursor-pointer transition-all font-medium"
                >
                  <option value="default">الترتيب الافتراضي</option>
                  <option value="price_asc">السعر: من الأقل للأعلى</option>
                  <option value="price_desc">السعر: من الأعلى للأقل</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Filter Status & Reset Sub-bar (Stitch AI Layout) */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200/50 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-pulse" />
                <span className="text-gray-700 font-medium">
                  عرض <strong>{filteredProducts.length}</strong> من إجمالي <strong>{productsData.length}</strong> تصميماً جاهزاً للمعاينة
                </span>
              </div>

              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 text-gray-500 hover:text-primary transition-colors text-xs font-semibold cursor-pointer"
              >
                <ReloadIcon className="w-3.5 h-3.5" />
                <span>إعادة ضبط الفلاتر</span>
              </button>
            </div>
          </div>
        </section>

        {/* PRODUCTS GRID */}
        <section className="w-full py-10 lg:py-14">
          <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12">
            {filteredProducts.length === 0 ? (
              /* Empty State */
              <div className="py-20 text-center space-y-4 bg-white rounded-2xl border border-charcoal/10 p-8">
                <div className="w-16 h-16 mx-auto rounded-full bg-surface-container flex items-center justify-center text-charcoal/40">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-primary font-readex">
                  لم يتم العثور على منتجات مطابقة لخيارات البحث
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto">
                  جرب تغيير كلمات البحث، أو اختر خامة أو نمطاً مختلفاً، أو أعد ضبط الفلاتر للاطلاع على كامل الموديلات.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-2 bg-[#1F5E4B] text-white text-xs sm:text-sm font-semibold py-2.5 px-6 rounded-xl hover:bg-[#164638] transition-colors cursor-pointer shadow-sm"
                >
                  <ReloadIcon className="w-4 h-4" />
                  <span>عرض كافة المنتجات</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredProducts.map((product) => {
                  const isBothBranches = product.branches.length === 2;
                  const isMansouraOnly =
                    product.branches.length === 1 && product.branches[0] === "mansoura";
                  const isSamanoudOnly =
                    product.branches.length === 1 && product.branches[0] === "samanoud_mahalla";

                  return (
                    <article
                      key={product.id}
                      className="group bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col border border-charcoal/10"
                    >
                      <div>
                        {/* Image Container with Badges */}
                        <Link href={`/products/${product.id}`} className="block relative w-full h-64 overflow-hidden rounded-t-xl bg-[#ECE8E1]">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="w-full h-64 object-cover rounded-t-xl transition-transform duration-700 group-hover:scale-105"
                          />
                          {/* Top Badges */}
                          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                            <span className="px-2.5 py-1 rounded-md bg-[#1E2225]/90 backdrop-blur-md text-white text-[11px] font-semibold shadow-2xs">
                              {product.badgePrimary}
                            </span>
                            <span className="px-2.5 py-1 rounded-md bg-[#F5E6D3]/95 backdrop-blur-md text-[#8C5D33] text-[11px] font-bold shadow-2xs">
                              {product.badgeSecondary}
                            </span>
                          </div>

                          {/* Bottom Left Code Badge */}
                          <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded bg-white/95 backdrop-blur-md text-primary text-[11px] font-bold font-mono border border-charcoal/10 shadow-2xs">
                            كود : {product.code}
                          </div>
                        </Link>

                        {/* Content Area - Right Aligned with zero dead space */}
                        <div className="p-4 sm:p-5 text-right space-y-2">
                          {/* Subheading & Branch Tag */}
                          <div className="flex items-center justify-between gap-2 text-xs">
                            <span className="text-secondary font-bold tracking-wide">
                              {product.subtitle}
                            </span>
                            {isBothBranches && (
                              <span className="text-[11px] text-[#1F5E4B] font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                                متوفر بالفرعين
                              </span>
                            )}
                            {isMansouraOnly && (
                              <span className="text-[11px] text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded">
                                فرع المنصورة
                              </span>
                            )}
                            {isSamanoudOnly && (
                              <span className="text-[11px] text-blue-800 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                                فرع سمنود
                              </span>
                            )}
                          </div>

                          {/* Title (Clickable) */}
                          <Link href={`/products/${product.id}`} className="block">
                            <h2 className="text-base sm:text-lg font-bold text-primary hover:text-secondary transition-colors font-readex leading-snug">
                              {product.name}
                            </h2>
                          </Link>

                          {/* Description */}
                          <p className="text-xs text-charcoal/70 line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>

                          {/* Specs Chips - Right Aligned (Side) */}
                          <div className="flex flex-wrap items-center justify-start gap-1.5 pt-1">
                            {product.specs.map((spec, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded bg-surface-container-low border border-charcoal/10 text-charcoal/80 text-[11px] font-medium"
                              >
                                {spec}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons - Compact gap right below specs chips */}
                      <div className="p-4 sm:p-5 pt-2 space-y-2 border-t border-charcoal/5 mt-1">
                        {/* WhatsApp Button */}
                        {isBothBranches ? (
                          <button
                            type="button"
                            onClick={() => setBranchModalProduct(product)}
                            className="w-full inline-flex items-center justify-center gap-2 bg-[#E8F8F0] hover:bg-[#d6f2e4] text-[#1F5E4B] text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl transition-colors duration-200 cursor-pointer border border-[#1F5E4B]/15"
                          >
                            <WhatsAppIcon className="w-4 h-4 shrink-0 text-[#1F5E4B]" />
                            <span>استفسر عن الموديل بالواتساب</span>
                          </button>
                        ) : isMansouraOnly ? (
                          <a
                            className="w-full inline-flex items-center justify-center gap-2 bg-[#E8F8F0] hover:bg-[#d6f2e4] text-[#1F5E4B] text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl transition-colors duration-200 border border-[#1F5E4B]/15"
                            href={`https://wa.me/201005557109?text=${encodeURIComponent(
                              `السلام عليكم مطابخ الشويمي (فرع المنصورة)، أود الاستفسار عن كود [${product.code}] - ${product.name}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <WhatsAppIcon className="w-4 h-4 shrink-0 text-[#1F5E4B]" />
                            <span>استفسر عن الموديل بالواتساب</span>
                          </a>
                        ) : (
                          <a
                            className="w-full inline-flex items-center justify-center gap-2 bg-[#E8F8F0] hover:bg-[#d6f2e4] text-[#1F5E4B] text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl transition-colors duration-200 border border-[#1F5E4B]/15"
                            href={`https://wa.me/201287153339?text=${encodeURIComponent(
                              `السلام عليكم مطابخ الشويمي (فرع سمنود والمحلة)، أود الاستفسار عن كود [${product.code}] - ${product.name}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <WhatsAppIcon className="w-4 h-4 shrink-0 text-[#1F5E4B]" />
                            <span>استفسر عن الموديل بالواتساب</span>
                          </a>
                        )}

                        {/* Secondary Button: Navigates to Product Details Page */}
                        <Link
                          href={`/products/${product.id}`}
                          className="w-full inline-flex items-center justify-center gap-2 bg-[#F5F4F0] hover:bg-[#EAE8E2] text-charcoal text-xs sm:text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors duration-200 border border-charcoal/5"
                        >
                          <span>تفاصيل الموديل والمقاسات</span>
                          <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* BESPOKE CUSTOMIZATION CTA BANNER */}
        <section className="w-full bg-primary py-12 lg:py-16 text-inverse-on-surface">
          <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12">
            <div className="bg-primary-container p-6 sm:p-10 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-white/5">
              <div className="space-y-2 text-center md:text-right">
                <span className="text-xs text-secondary-fixed font-bold tracking-wider uppercase block">
                  تصميم وتصنيع خاص بالملي
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-on-primary font-readex">
                  ملقتش التصميم أو المقاس اللي يناسب بيتك؟
                </h3>
                <p className="text-xs sm:text-sm text-on-primary-container max-w-xl">
                  يقوم مهندسونا بتصميم وتنفيذ أي مقاس أو خامة تناسب مخطط منزلك بالكامل مع رسم ثلاثي الأبعاد 3D مجاني قبل البدء.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsConsultationOpen(true)}
                className="inline-flex items-center gap-2 bg-[#1F5E4B] hover:bg-[#164638] text-white text-xs sm:text-sm font-bold py-3 px-6 rounded-xl shadow-md transition-transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap active:translate-y-0"
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>طلب معاينة وتصميم خاص</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Consultation Modal */}
      <ConsultationDrawer
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />

      {/* Branch Selection Modal for items available in both branches */}
      <BranchSelectionModal
        isOpen={Boolean(branchModalProduct)}
        product={branchModalProduct}
        onClose={() => setBranchModalProduct(null)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
