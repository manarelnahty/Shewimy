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
  RotateCcw,
  Sparkles,
  MessageSquare,
  MapPin,
  ArrowLeft,
} from "lucide-react";

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

      <main className="flex-1 w-full pt-16 sm:pt-20">
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
              <div className="grid grid-cols-3 gap-3 p-3 bg-white rounded-xl shadow-sm shrink-0 border border-charcoal/10">
                <div className="flex flex-col items-center justify-center p-2.5 text-center rounded-lg bg-surface-container-low">
                  <span className="text-lg sm:text-xl font-bold text-primary font-readex">
                    {productsData.length}
                  </span>
                  <span className="text-[11px] text-on-surface-variant mt-0.5 font-medium">
                    موديل معروض
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-2.5 text-center rounded-lg bg-surface-container-low">
                  <span className="text-lg sm:text-xl font-bold text-[#1F5E4B] font-readex">
                    100%
                  </span>
                  <span className="text-[11px] text-on-surface-variant mt-0.5 font-medium">
                    أخشاب أوروبية
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-2.5 text-center rounded-lg bg-surface-container-low">
                  <span className="text-lg sm:text-xl font-bold text-secondary font-readex">
                    15 سنة
                  </span>
                  <span className="text-[11px] text-on-surface-variant mt-0.5 font-medium">
                    ضمان معتمد
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STICKY FILTER & SEARCH BAR */}
        <section className="sticky top-16 sm:top-18 z-30 w-full bg-white shadow-sm border-b border-charcoal/10">
          <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 py-3.5 space-y-3">
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
                <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 pointer-events-none" />
                <input
                  type="text"
                  placeholder="ابحث بالاسم أو الكود..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-surface-container-low text-charcoal placeholder:text-charcoal/40 text-xs sm:text-sm pr-9 pl-3.5 py-2 rounded-lg border border-charcoal/15 focus:outline-none focus:border-emerald-cta focus:bg-white transition-all"
                />
              </div>

              {/* Branch Selector Dropdown */}
              <div className="lg:col-span-3 relative">
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value as BranchFilter)}
                  className="w-full appearance-none bg-surface-container-low text-charcoal text-xs sm:text-sm pr-9 pl-8 py-2 rounded-lg border border-charcoal/15 focus:outline-none focus:border-emerald-cta focus:bg-white cursor-pointer transition-all font-semibold"
                >
                  <option value="all">كافة الفروع</option>
                  <option value="mansoura">فرع المنصورة</option>
                  <option value="samanoud_mahalla">فرع سمنود والمحلة</option>
                </select>
                <MapPin className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-[#1F5E4B] pointer-events-none" />
                <ChevronDown className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-charcoal/40 pointer-events-none" />
              </div>

              {/* Style Dropdown */}
              <div className="lg:col-span-2 relative">
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value as StyleFilter)}
                  className="w-full appearance-none bg-surface-container-low text-charcoal text-xs sm:text-sm pr-3.5 pl-8 py-2 rounded-lg border border-charcoal/15 focus:outline-none focus:border-emerald-cta focus:bg-white cursor-pointer transition-all font-medium"
                >
                  <option value="all">كافة الأنماط</option>
                  <option value="modern">مودرن حديث</option>
                  <option value="classic">كلاسيك فاخر</option>
                  <option value="neoclassic">نيو كلاسيك</option>
                  <option value="ultramodern">ألترا مودرن</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-charcoal/40 pointer-events-none" />
              </div>

              {/* Material Dropdown */}
              <div className="lg:col-span-2 relative">
                <select
                  value={selectedMaterial}
                  onChange={(e) => setSelectedMaterial(e.target.value as MaterialFilter)}
                  className="w-full appearance-none bg-surface-container-low text-charcoal text-xs sm:text-sm pr-3.5 pl-8 py-2 rounded-lg border border-charcoal/15 focus:outline-none focus:border-emerald-cta focus:bg-white cursor-pointer transition-all font-medium"
                >
                  <option value="all">كافة الخامات</option>
                  <option value="polylac">بولاك تركي</option>
                  <option value="hpl">HPL ألماني</option>
                  <option value="natural_walnut">جوز أمريكي</option>
                  <option value="massive_oak">أرو ماسيف</option>
                  <option value="fume_glass">زجاج فاميه</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-charcoal/40 pointer-events-none" />
              </div>

              {/* Sort Select */}
              <div className="lg:col-span-2 relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full appearance-none bg-surface-container-low text-charcoal text-xs sm:text-sm pr-3.5 pl-8 py-2 rounded-lg border border-charcoal/15 focus:outline-none focus:border-emerald-cta focus:bg-white cursor-pointer transition-all font-medium"
                >
                  <option value="default">الترتيب الافتراضي</option>
                  <option value="price_asc">السعر: من الأقل للأعلى</option>
                  <option value="price_desc">السعر: من الأعلى للأقل</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-charcoal/40 pointer-events-none" />
              </div>
            </div>

            {/* Filter Status & Reset Sub-bar (Stitch AI Layout) */}
            <div className="flex items-center justify-between pt-2 border-t border-charcoal/5 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-pulse" />
                <span className="text-charcoal/80 font-medium">
                  عرض <strong>{filteredProducts.length}</strong> من إجمالي <strong>{productsData.length}</strong> تصميماً جاهزاً للمعاينة
                </span>
              </div>

              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 text-charcoal/60 hover:text-primary transition-colors text-xs font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
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
                  className="inline-flex items-center gap-2 bg-primary text-on-primary text-xs sm:text-sm font-semibold py-2.5 px-6 rounded-xl hover:bg-primary-container transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
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
                      className="group bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-charcoal/10"
                    >
                      <div>
                        {/* Image Container with Exact Stitch AI Badges */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#ECE8E1]">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
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
                        </div>

                        {/* Content Area - Center Aligned exactly like Stitch AI */}
                        <div className="p-5 sm:p-6 text-center space-y-2.5">
                          {/* Subheading Tag */}
                          <span className="text-xs text-secondary font-bold tracking-wide block">
                            {product.subtitle}
                          </span>

                          {/* Title */}
                          <h2 className="text-base sm:text-lg font-bold text-primary group-hover:text-secondary transition-colors font-readex leading-snug">
                            {product.name}
                          </h2>

                          {/* Price Tag & Branch Notice */}
                          <div className="flex flex-wrap items-center justify-center gap-2 pt-0.5">
                            <span className="px-2.5 py-0.5 rounded-md bg-surface-container-low border border-charcoal/10 text-xs font-bold text-primary font-mono">
                              السعر: {product.priceDisplay}
                            </span>
                            {isBothBranches && (
                              <span className="text-[11px] text-[#1F5E4B] font-semibold">
                                (متوفر بكلا الفرعين)
                              </span>
                            )}
                            {isMansouraOnly && (
                              <span className="text-[11px] text-amber-800 font-semibold">
                                (فرع المنصورة فقط)
                              </span>
                            )}
                            {isSamanoudOnly && (
                              <span className="text-[11px] text-blue-800 font-semibold">
                                (فرع سمنود والمحلة فقط)
                              </span>
                            )}
                          </div>

                          {/* Description */}
                          <p className="text-xs text-charcoal/70 line-clamp-2 leading-relaxed max-w-sm mx-auto">
                            {product.description}
                          </p>

                          {/* Specs Chips - Centered */}
                          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
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

                      {/* Action Buttons - Stacked 2 Buttons (Stitch AI Layout) */}
                      <div className="p-5 sm:p-6 pt-0 space-y-2 mt-auto">
                        {/* WhatsApp Button (Mint green with Message icon) */}
                        {isBothBranches ? (
                          <button
                            type="button"
                            onClick={() => setBranchModalProduct(product)}
                            className="w-full inline-flex items-center justify-center gap-2 bg-[#E8F8F0] hover:bg-[#d6f2e4] text-[#1F5E4B] text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl transition-colors duration-200 cursor-pointer border border-[#1F5E4B]/15"
                          >
                            <MessageSquare className="w-4 h-4 shrink-0 text-[#1F5E4B]" />
                            <span>استفسر عن الموديل بالواتساب</span>
                          </button>
                        ) : isMansouraOnly ? (
                          <a
                            className="w-full inline-flex items-center justify-center gap-2 bg-[#E8F8F0] hover:bg-[#d6f2e4] text-[#1F5E4B] text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl transition-colors duration-200 border border-[#1F5E4B]/15"
                            href={`https://wa.me/201005557109?text=${encodeURIComponent(
                              `السلام عليكم مطابخ الشويمي (فرع المنصورة)، أود الاستفسار عن كود [${product.code}] - ${product.name} (السعر: ${product.priceDisplay})`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MessageSquare className="w-4 h-4 shrink-0 text-[#1F5E4B]" />
                            <span>استفسر عن الموديل بالواتساب</span>
                          </a>
                        ) : (
                          <a
                            className="w-full inline-flex items-center justify-center gap-2 bg-[#E8F8F0] hover:bg-[#d6f2e4] text-[#1F5E4B] text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl transition-colors duration-200 border border-[#1F5E4B]/15"
                            href={`https://wa.me/201287153339?text=${encodeURIComponent(
                              `السلام عليكم مطابخ الشويمي (فرع سمنود والمحلة)، أود الاستفسار عن كود [${product.code}] - ${product.name} (السعر: ${product.priceDisplay})`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MessageSquare className="w-4 h-4 shrink-0 text-[#1F5E4B]" />
                            <span>استفسر عن الموديل بالواتساب</span>
                          </a>
                        )}

                        {/* Secondary Button: Details & Dimensions */}
                        <button
                          type="button"
                          onClick={() => setIsConsultationOpen(true)}
                          className="w-full inline-flex items-center justify-center gap-2 bg-[#F5F4F0] hover:bg-[#EAE8E2] text-charcoal text-xs sm:text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors duration-200 cursor-pointer border border-charcoal/5"
                        >
                          <span>تفاصيل الموديل والمقاسات</span>
                          <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
                        </button>
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
