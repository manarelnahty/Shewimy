"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useProducts, useSiteSettings, useCategories } from "@/lib/firebase";
import { ProductCard, ProductCardSkeleton } from "@/components/products/ProductCard";
import { DEFAULT_SITE_SETTINGS } from "@/types/shewimy";

export function Portfolio() {
  const { products, loading } = useProducts({ featuredOnly: true });
  const { categories } = useCategories();
  const { settings } = useSiteSettings();
  const shouldReduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<string>("all");

  const tabs = useMemo(() => {
    const list: { id: string; label: string }[] = [{ id: "all", label: "الكل" }];
    for (const cat of categories) {
      const hasProducts = products.some(
        (p) =>
          p.mainSection === cat.key ||
          (p.category as any) === cat.key ||
          (cat.key === "dressing_rooms" && (p.category as any) === "dressing") ||
          (cat.key === "decor" && (p.category as any) === "cladding")
      );
      if (
        hasProducts ||
        cat.key === "kitchens" ||
        cat.key === "dressing_rooms" ||
        cat.key === "furniture"
      ) {
        list.push({ id: cat.key, label: cat.labelAr.split(" ")[0] || cat.labelAr });
      }
    }
    return list;
  }, [categories, products]);

  const filteredProjects = useMemo(() => {
    if (activeTab === "all") return products;
    return products.filter(
      (p) =>
        p.mainSection === activeTab ||
        (p.category as any) === activeTab ||
        (activeTab === "dressing_rooms" && (p.category as any) === "dressing") ||
        (activeTab === "decor" && (p.category as any) === "cladding")
    );
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

          {/* Filter Tabs with Seamless Layout Morph */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-surface-container overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className="relative text-xs sm:text-sm px-3.5 py-1.5 rounded font-semibold transition-colors cursor-pointer select-none"
                >
                  {isActive && (
                    <motion.span
                      layoutId="portfolioActiveTab"
                      className="absolute inset-0 bg-primary rounded shadow-sm z-0"
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 35,
                      }}
                    />
                  )}
                  <span
                    className={`relative z-10 transition-colors duration-200 ${
                      isActive
                        ? "text-white"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3-Column Portfolio Cards with AnimatePresence & Layout Morph */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7"
        >
          <AnimatePresence mode="popLayout">
            {loading && filteredProjects.length === 0 ? (
              Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProductCardSkeleton />
                </motion.div>
              ))
            ) : (
              filteredProjects.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.3,
                    ease: "easeOut",
                  }}
                  className="h-full"
                >
                  <ProductCard
                    product={item}
                    whatsappPhone={phonePrimary}
                    branchName="معرض الشويمي الرئيسي"
                    priority={false}
                  />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>

        {/* View Full Catalog Link Banner */}
        <div className="pt-4 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-container text-on-primary text-xs sm:text-sm font-bold py-3 px-8 rounded-xl shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0"
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
