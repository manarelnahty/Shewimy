"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ConsultationDrawer } from "@/components/common/ConsultationDrawer";
import { BranchSelectionModal } from "@/components/common/BranchSelectionModal";
import { productsData, Product, BranchKey } from "@/data/products";
import { BRANCHES_LIST } from "@/data/branches";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { useProducts, useBranches, useCategories, useMaterials } from "@/lib/firebase";
import { ProductCard, ProductCardSkeleton } from "@/components/products/ProductCard";
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

type CategoryFilter = string;

type StyleFilter = "all" | "modern" | "classic" | "neoclassic" | "ultramodern";
type MaterialFilter = string;

type SortOption = "default" | "price_asc" | "price_desc";
type PriceRangeFilter = "all" | "under_80k" | "80k_to_120k" | "above_120k";
type BranchFilter = "all" | "mansoura" | "mahalla" | "samanoud" | "samanoud_mahalla";

export default function ProductsPage() {
  const { products: allProducts, loading } = useProducts();
  const { branches } = useBranches();
  const { categories } = useCategories();
  const { materials } = useMaterials();

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

  // Filtered & Sorted Products (Dynamic from Firestore)
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Branch filter
    if (selectedBranch !== "all") {
      const targetBranch =
        selectedBranch === "samanoud_mahalla" ? "mahalla" : selectedBranch;
      result = result.filter((p) =>
        p.branches.some((b) => b === targetBranch || b === selectedBranch)
      );
    }

    // Category filter (mapping legacy dressing -> dressing_rooms, cladding -> decor)
    if (selectedCategory !== "all") {
      result = result.filter((p) => {
        if (selectedCategory === "dressing" || selectedCategory === "dressing_rooms") {
          return p.mainSection === "dressing_rooms" || p.category === "dressing" || p.category === "dressing_rooms";
        }
        if (selectedCategory === "cladding" || selectedCategory === "decor") {
          return p.mainSection === "decor" || p.category === "cladding" || p.category === "decor";
        }
        return p.mainSection === selectedCategory || p.category === selectedCategory;
      });
    }

    // Style filter
    if (selectedStyle !== "all") {
      result = result.filter((p) => p.style === selectedStyle);
    }

    // Material filter (Dynamic matching by ID, label, or tagged materials)
    if (selectedMaterial !== "all") {
      const matObj = materials.find((m) => m.id === selectedMaterial);
      const targetName = matObj ? matObj.name.toLowerCase() : selectedMaterial.toLowerCase();
      result = result.filter((p) => {
        return (
          p.material === selectedMaterial ||
          (p.materialLabel && p.materialLabel.toLowerCase().includes(targetName)) ||
          p.materials.some(
            (m) =>
              m.toLowerCase().includes(targetName) ||
              m.toLowerCase().includes(selectedMaterial.toLowerCase())
          )
        );
      });
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
          p.subCategory.toLowerCase().includes(q) ||
          p.materials.some((m) => m.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === "price_asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [
    selectedCategory,
    selectedBranch,
    selectedStyle,
    selectedMaterial,
    priceRange,
    searchQuery,
    sortBy,
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-surface text-on-surface antialiased selection:bg-secondary-container selection:text-on-secondary-container">
      {/* Header */}
      <Header onOpenConsultation={() => setIsConsultationOpen(true)} />

      <main className="flex-1 w-full pt-20">
        {/* HERO BANNER SECTION */}
        <section className="bg-primary text-inverse-on-surface py-12 sm:py-16 relative overflow-hidden border-b border-charcoal/10">
          <div className="absolute inset-0 z-0">
            <div
              className="w-full h-full bg-cover bg-center opacity-30 mix-blend-luminosity scale-105"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1920&q=80')",
              }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/85 to-primary/60" />
          </div>

          <div className="relative z-10 max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high/15 backdrop-blur-md border border-white/10 text-xs font-semibold text-secondary-fixed">
                <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse" />
                <span>شجرة التصنيف الموحدة • ضمان 15 سنة حقيقي</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-on-primary font-readex leading-tight">
                أثاث ومطابخ الشويمي
              </h1>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl">
                استعرض تشكيلاتنا المعتمدة (الأثاث الراقي، المطابخ الحديثة والميكانزم، الدريسينج روم، الديكورات، والشبابيك UPVC). تواصل مباشرة مع واتساب الفرع الأقرب إليك للتسعير الفوري وحجز المعاينة.
              </p>
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
            {/* Category Tabs (Dynamic from categories registry: defaults + custom) */}
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
                كافة الأقسام ({allProducts.length})
              </button>
              {categories.map((cat) => {
                const isSelected =
                  selectedCategory === cat.key ||
                  (cat.key === "dressing_rooms" && selectedCategory === "dressing") ||
                  (cat.key === "decor" && selectedCategory === "cladding");

                const count = allProducts.filter(
                  (p) =>
                    p.mainSection === cat.key ||
                    (p.category as any) === cat.key ||
                    (cat.key === "dressing_rooms" && p.category === "dressing") ||
                    (cat.key === "decor" && p.category === "cladding")
                ).length;

                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#1E2225] text-white shadow-sm"
                        : "bg-[#F3EFEA] hover:bg-[#eae5de] text-charcoal"
                    }`}
                  >
                    {cat.labelAr} {count > 0 ? `(${count})` : cat.sharePercent ? `(${cat.sharePercent})` : ""}
                  </button>
                );
              })}
            </div>

            {/* Advanced Filters: Search + Branch + Style + Material + Sorting */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-2.5">
              {/* Search Input */}
              <div className="lg:col-span-3 relative">
                <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="ابحث بالاسم أو الكود أو الخامة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white text-gray-700 placeholder:text-gray-400 text-sm pr-9 pl-3.5 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#1F5E4B] transition-all"
                />
              </div>

              {/* Branch Selector Dropdown (3 Branches DRD Section 4) */}
              <div className="lg:col-span-3 relative">
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value as BranchFilter)}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-lg pr-9 pl-8 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#1F5E4B] cursor-pointer transition-all font-semibold"
                >
                  <option value="all">كافة الفروع ({branches.length} فروع)</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
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

              {/* Material Dropdown (Dynamic from materials registry) */}
              <div className="lg:col-span-2 relative">
                <select
                  value={selectedMaterial}
                  onChange={(e) => setSelectedMaterial(e.target.value as MaterialFilter)}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 pl-8 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#1F5E4B] cursor-pointer transition-all font-medium"
                >
                  <option value="all">كافة الخامات ({materials.length})</option>
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
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
          </div>
        </section>

        {/* RESULTS STATS & ACTIVE FILTERS BAR */}
        <section className="py-4 border-b border-gray-200/50 bg-[#faf8f4]">
          <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-charcoal/70">
            <div className="flex items-center gap-2">
              <span>عرض</span>
              <span className="font-bold text-primary font-mono text-sm">
                {filteredProducts.length}
              </span>
              <span>من أصل</span>
              <span className="font-bold text-primary font-mono text-sm">
                {allProducts.length}
              </span>
              <span>موديل متاح للتفصيل والمعاينة</span>
            </div>

            {(selectedCategory !== "all" ||
              selectedBranch !== "all" ||
              selectedStyle !== "all" ||
              selectedMaterial !== "all" ||
              priceRange !== "all" ||
              searchQuery.trim()) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 text-secondary hover:text-primary font-semibold transition-colors cursor-pointer"
              >
                <ReloadIcon className="w-3.5 h-3.5" />
                <span>إعادة تعيين كافة الفلاتر</span>
              </button>
            )}
          </div>
        </section>

        {/* PRODUCT CATALOG GRID */}
        <section className="py-10 lg:py-16">
          <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12">
            {loading && filteredProducts.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-20 text-center space-y-4 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-[#f0eae1] flex items-center justify-center mx-auto text-charcoal/40">
                  <Search className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-primary font-readex">
                    لا توجد منتجات تطابق هذه الفلاتر
                  </h3>
                  <p className="text-xs text-charcoal/60 leading-relaxed">
                    جرّب تغيير معايير البحث أو اختيار فرع أو قسم آخر لعرض المنتجات.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-2 bg-[#1F5E4B] hover:bg-[#164638] text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  <ReloadIcon className="w-3.5 h-3.5" />
                  <span>عرض كافة المعروضات</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredProducts.map((product, idx) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onWhatsAppClick={(prod) => setBranchModalProduct(prod)}
                    priority={idx < 2}
                  />
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
                  يقوم مهندسونا بتصميم وتنفيذ أي مقاس أو خامة تناسب مخطط منزلك بالكامل مع رسم ثلاثي الأبعاد 3D قبل البدء.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsConsultationOpen(true)}
                className="inline-flex items-center gap-2 bg-[#1F5E4B] hover:bg-[#164638] text-white text-xs sm:text-sm font-bold py-3 px-6 rounded-xl shadow-md transition-transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap active:translate-y-0"
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>طلب معاينة وتصميم 3D خاص</span>
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

      {/* Branch Selection Modal for items */}
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
