"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ConsultationDrawer } from "@/components/common/ConsultationDrawer";
import { productsData } from "@/data/products";
import {
  Search,
  ChevronDown,
  RotateCcw,
  Sparkles,
  MessageCircle,
  Tag,
  SlidersHorizontal,
} from "lucide-react";

type CategoryFilter = "all" | "kitchens" | "dressing" | "furniture" | "cladding";
type StyleFilter = "all" | "modern" | "classic" | "neoclassic" | "ultramodern";
type MaterialFilter = "all" | "polylac" | "hpl" | "natural_walnut" | "massive_oak" | "fume_glass";
type SortOption = "default" | "price_asc" | "price_desc";
type PriceRangeFilter = "all" | "under_80k" | "80k_to_120k" | "above_120k";

export default function ProductsPage() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<StyleFilter>("all");
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [priceRange, setPriceRange] = useState<PriceRangeFilter>("all");

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setSelectedStyle("all");
    setSelectedMaterial("all");
    setSortBy("default");
    setPriceRange("all");
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let result = [...productsData];

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
  }, [selectedCategory, selectedStyle, selectedMaterial, priceRange, searchQuery, sortBy]);

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
            {/* Category Tabs (Scrollable) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedCategory === "all"
                    ? "bg-primary text-on-primary shadow-sm"
                    : "bg-surface-container-low hover:bg-surface-container text-on-surface"
                }`}
              >
                الكل ({productsData.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory("kitchens")}
                className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedCategory === "kitchens"
                    ? "bg-primary text-on-primary shadow-sm"
                    : "bg-surface-container-low hover:bg-surface-container text-on-surface"
                }`}
              >
                مطابخ حديثة وكلاسيك
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory("dressing")}
                className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedCategory === "dressing"
                    ? "bg-primary text-on-primary shadow-sm"
                    : "bg-surface-container-low hover:bg-surface-container text-on-surface"
                }`}
              >
                دريسينج روم ووحدات تخزين
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory("cladding")}
                className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedCategory === "cladding"
                    ? "bg-primary text-on-primary shadow-sm"
                    : "bg-surface-container-low hover:bg-surface-container text-on-surface"
                }`}
              >
                تجاليد خشبية ووحدات TV
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory("furniture")}
                className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedCategory === "furniture"
                    ? "bg-primary text-on-primary shadow-sm"
                    : "bg-surface-container-low hover:bg-surface-container text-on-surface"
                }`}
              >
                أثاث منزلي مخصص
              </button>
            </div>

            {/* Advanced Filters: Search + Style + Material + Sorting */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-2.5">
              {/* Search Input */}
              <div className="lg:col-span-4 relative">
                <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 pointer-events-none" />
                <input
                  type="text"
                  placeholder="ابحث باسم الموديل، الكود (مثل SHW-204)، أو الخامة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-surface-container-low text-charcoal placeholder:text-charcoal/40 text-xs sm:text-sm pr-9 pl-3.5 py-2 rounded-lg border border-charcoal/15 focus:outline-none focus:border-emerald-cta focus:bg-white transition-all"
                />
              </div>

              {/* Style Dropdown */}
              <div className="lg:col-span-3 relative">
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value as StyleFilter)}
                  className="w-full appearance-none bg-surface-container-low text-charcoal text-xs sm:text-sm pr-3.5 pl-8 py-2 rounded-lg border border-charcoal/15 focus:outline-none focus:border-emerald-cta focus:bg-white cursor-pointer transition-all font-medium"
                >
                  <option value="all">جميع الأنماط الهندسية</option>
                  <option value="modern">مودرن حديث (Modern Minimalist)</option>
                  <option value="classic">كلاسيك فاخر (Classic Royalty)</option>
                  <option value="neoclassic">نيو كلاسيك (Neo-Classic Elegance)</option>
                  <option value="ultramodern">ألترا مودرن بلمسات خشبية</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-charcoal/40 pointer-events-none" />
              </div>

              {/* Material Dropdown */}
              <div className="lg:col-span-3 relative">
                <select
                  value={selectedMaterial}
                  onChange={(e) => setSelectedMaterial(e.target.value as MaterialFilter)}
                  className="w-full appearance-none bg-surface-container-low text-charcoal text-xs sm:text-sm pr-3.5 pl-8 py-2 rounded-lg border border-charcoal/15 focus:outline-none focus:border-emerald-cta focus:bg-white cursor-pointer transition-all font-medium"
                >
                  <option value="all">جميع الخامات والأسطح</option>
                  <option value="polylac">بولاك تركي (Polylac Mat)</option>
                  <option value="hpl">HPL ألماني عالي المقاومة</option>
                  <option value="natural_walnut">خشب جوز طبيعي أمريكي</option>
                  <option value="massive_oak">خشب أرو ماسيف طبيعي</option>
                  <option value="fume_glass">زجاج فاميه وبروفايل إيطالي</option>
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

            {/* Quick Price Pills & Reset Bar */}
            <div className="flex flex-wrap items-center justify-between pt-1 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-on-surface-variant font-semibold flex items-center gap-1">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>تصفية بالسعر:</span>
                </span>
                <button
                  type="button"
                  onClick={() => setPriceRange("all")}
                  className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                    priceRange === "all"
                      ? "bg-secondary text-white font-bold"
                      : "bg-surface-container-low text-charcoal hover:bg-surface-container"
                  }`}
                >
                  الكل
                </button>
                <button
                  type="button"
                  onClick={() => setPriceRange("under_80k")}
                  className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                    priceRange === "under_80k"
                      ? "bg-secondary text-white font-bold"
                      : "bg-surface-container-low text-charcoal hover:bg-surface-container"
                  }`}
                >
                  أقل من 80 ألف
                </button>
                <button
                  type="button"
                  onClick={() => setPriceRange("80k_to_120k")}
                  className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                    priceRange === "80k_to_120k"
                      ? "bg-secondary text-white font-bold"
                      : "bg-surface-container-low text-charcoal hover:bg-surface-container"
                  }`}
                >
                  80 ألف - 120 ألف
                </button>
                <button
                  type="button"
                  onClick={() => setPriceRange("above_120k")}
                  className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                    priceRange === "above_120k"
                      ? "bg-secondary text-white font-bold"
                      : "bg-surface-container-low text-charcoal hover:bg-surface-container"
                  }`}
                >
                  أكثر من 120 ألف
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-charcoal/70">
                  عرض <strong>{filteredProducts.length}</strong> منتج
                </span>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1 text-secondary hover:text-primary transition-colors text-xs font-semibold cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>إعادة ضبط الفلاتر</span>
                </button>
              </div>
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
                {filteredProducts.map((product) => (
                  <article
                    key={product.id}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-charcoal/10"
                  >
                    <div>
                      {/* Image Container with Badges */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-container">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-3 right-3 flex flex-wrap gap-1.5 z-10">
                          <span className="px-2.5 py-1 rounded bg-primary/85 backdrop-blur-md text-on-primary text-[11px] font-semibold">
                            {product.categoryLabel}
                          </span>
                          <span className="px-2.5 py-1 rounded bg-secondary-fixed/90 backdrop-blur-md text-on-secondary-fixed text-[11px] font-bold">
                            ضمان {product.warrantyYears} سنة
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-white/90 backdrop-blur-md text-primary text-[11px] font-bold font-mono border border-charcoal/10">
                          كود: {product.code}
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-5 sm:p-6 space-y-3.5">
                        <div>
                          <div className="flex items-center justify-between text-xs text-secondary font-bold mb-1">
                            <span>{product.styleLabel}</span>
                            <span>{product.materialLabel}</span>
                          </div>
                          <h2 className="text-base sm:text-lg font-bold text-primary group-hover:text-secondary transition-colors font-readex leading-snug">
                            {product.name}
                          </h2>
                        </div>

                        <p className="text-xs sm:text-sm text-on-surface-variant line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>

                        {/* Specs Chips */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {product.specs.map((spec, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px] font-medium"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card Price & Direct Branch Contact (NO Cart / NO Checkout) */}
                    <div className="p-5 sm:p-6 pt-0 space-y-3 border-t border-surface-container mt-2">
                      {/* Explicit Price Display Badge */}
                      <div className="flex items-center justify-between pt-3">
                        <div className="flex items-center gap-1.5 text-xs text-charcoal/60">
                          <Tag className="w-3.5 h-3.5 text-secondary" />
                          <span>{product.priceNote}:</span>
                        </div>
                        <div className="text-base sm:text-lg font-extrabold text-primary font-readex">
                          {product.priceDisplay}
                        </div>
                      </div>

                      {/* Direct WhatsApp Consultation Buttons for Both Branches */}
                      <div className="grid grid-cols-2 gap-2">
                        <a
                          className="inline-flex items-center justify-center gap-1.5 bg-[#25D366]/10 hover:bg-[#25D366] text-[#128C7E] hover:text-white text-xs font-semibold py-2 px-2.5 rounded-xl transition-all duration-200"
                          href={`https://wa.me/201005557109?text=${encodeURIComponent(
                            `مرحباً فرع المنصورة، أود الاستفسار عن كود [${product.code}] - ${product.name} بسعر ${product.priceDisplay}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>واتساب المنصورة</span>
                        </a>

                        <a
                          className="inline-flex items-center justify-center gap-1.5 bg-[#25D366]/10 hover:bg-[#25D366] text-[#128C7E] hover:text-white text-xs font-semibold py-2 px-2.5 rounded-xl transition-all duration-200"
                          href={`https://wa.me/201287153339?text=${encodeURIComponent(
                            `مرحباً فرع سمنود والمحلة، أود الاستفسار عن كود [${product.code}] - ${product.name} بسعر ${product.priceDisplay}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>واتساب سمنود والمحلة</span>
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
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

      {/* Footer */}
      <Footer />
    </div>
  );
}
