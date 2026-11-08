"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useProducts, useSiteSettings } from "@/lib/firebase";
import { ProductCard, ProductCardSkeleton } from "@/components/products/ProductCard";
import { DEFAULT_SITE_SETTINGS, MainSection } from "@/types/shewimy";

type TabType = "all" | "kitchens" | "dressing_rooms" | "furniture" | "decor" | "windows";

export function Portfolio() {
  const { products, loading } = useProducts({ featuredOnly: true });
  const { settings } = useSiteSettings();
  const [activeTab, setActiveTab] = useState<TabType>("all");

  const filteredProjects = useMemo(() => {
    if (activeTab === "all") return products;
    return products.filter((p) => p.mainSection === activeTab);
  }, [products, activeTab]);

  const badge = settings.portfolioBadge || DEFAULT_SITE_SETTINGS.portfolioBadge;
  const headline = settings.portfolioHeadline || DEFAULT_SITE_SETTINGS.portfolioHeadline;
  const subheadline = settings.portfolioSubheadline || DEFAULT_SITE_SETTINGS.portfolioSubheadline;
  const ctaText = settings.portfolioCtaText || DEFAULT_SITE_SETTINGS.portfolioCtaText;
  const phonePrimary = settings.phonePrimary || DEFAULT_SITE_SETTINGS.phonePrimary;

  return (
    <section className="w-full bg-surface py-16 lg:py-24" id="portfolio-section">
      <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-2">
          <div>
            <span className="text-xs sm:text-sm text-secondary font-semibold uppercase tracking-wider block mb-1.5">
              {badge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary font-readex">
              {headline}
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5 max-w-xl leading-relaxed">
              {subheadline}
            </p>
          </div>

          {/* Filter Tabs (DRD Sections) */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-surface-container overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`text-xs sm:text-sm px-3.5 py-1.5 rounded font-semibold transition-all cursor-pointer ${
                activeTab === "all"
                  ? "text-white bg-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
              }`}
            >
              الكل
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("kitchens")}
              className={`text-xs sm:text-sm px-3.5 py-1.5 rounded font-semibold transition-all cursor-pointer ${
                activeTab === "kitchens"
                  ? "text-white bg-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
              }`}
            >
              مطابخ حديثة
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("dressing_rooms")}
              className={`text-xs sm:text-sm px-3.5 py-1.5 rounded font-semibold transition-all cursor-pointer ${
                activeTab === "dressing_rooms"
                  ? "text-white bg-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
              }`}
            >
              دريسينج روم
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("furniture")}
              className={`text-xs sm:text-sm px-3.5 py-1.5 rounded font-semibold transition-all cursor-pointer ${
                activeTab === "furniture"
                  ? "text-white bg-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
              }`}
            >
              أثاث وديكور
            </button>
          </div>
        </div>

        {/* 3-Column Portfolio Cards with Lazy-loaded Media and Hover Preload */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {loading && filteredProjects.length === 0 ? (
            Array.from({ length: 3 }).map((_, i) => <ProductCardSkeleton key={i} />)
          ) : (
            filteredProjects.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                whatsappPhone={phonePrimary}
                branchName="معرض الشويمي الرئيسي"
                priority={false}
              />
            ))
          )}
        </div>

        {/* View Full Catalog Link Banner */}
        <div className="pt-4 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-container text-on-primary text-xs sm:text-sm font-bold py-3 px-8 rounded-xl shadow-md transition-all hover:-translate-y-0.5"
          >
            <span>
              {ctaText} ({products.length} موديل متاح)
            </span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
