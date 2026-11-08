"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { useProducts } from "@/lib/firebase";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { MainSection } from "@/types/shewimy";

type TabType = "all" | "kitchens" | "dressing_rooms" | "furniture" | "decor" | "windows";

export function Portfolio() {
  const { products, loading } = useProducts({ featuredOnly: true });
  const [activeTab, setActiveTab] = useState<TabType>("all");

  const filteredProjects = useMemo(() => {
    if (activeTab === "all") return products;
    return products.filter((p) => p.mainSection === activeTab);
  }, [products, activeTab]);

  return (
    <section className="w-full bg-surface py-16 lg:py-24" id="portfolio-section">
      <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-2">
          <div>
            <span className="text-xs sm:text-sm text-secondary font-semibold uppercase tracking-wider block mb-1.5">
              أعمالنا الاستثنائية (محدثة مباشرة من قاعدة البيانات)
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary font-readex">
              أحدث إبداعاتنا المنفذة بمصانع الشويمي
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5 max-w-xl leading-relaxed">
              استكشف تشكيلات المطابخ والدريسينج روم والأثاث الراقي التي نفذناها بدقة وإتقان في فلل وقصور عملاء الشويمي.
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

        {/* 3-Column Portfolio Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredProjects.map((item) => {
            const waUrl = generateWhatsAppLink("01005557109", "فرع المنصورة", {
              title: item.title || item.name,
              slug: item.slug,
              section: item.mainSection,
            });

            return (
              <div
                key={item.id}
                className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group border border-outline-variant/15"
              >
                <div className="relative overflow-hidden aspect-[4/3] bg-surface-container">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span className="bg-primary/85 backdrop-blur-md text-on-primary text-[11px] font-semibold px-2.5 py-1 rounded-md">
                      {item.subCategory}
                    </span>
                    <span className="bg-white/90 backdrop-blur-md text-[#1F5E4B] text-[11px] font-bold px-2 py-0.5 rounded-md">
                      ضمان {item.warrantyYears} سنة
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <Link href={`/catalog/${item.mainSection}/${item.slug}`} className="block">
                      <h3 className="text-base sm:text-lg text-primary font-bold group-hover:text-secondary transition-colors font-readex leading-snug">
                        {item.name}
                      </h3>
                    </Link>
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {item.materials.slice(0, 3).map((mat, i) => (
                        <span
                          key={i}
                          className="text-[11px] bg-surface-container px-2 py-0.5 rounded text-on-surface-variant font-medium"
                        >
                          ✓ {mat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-charcoal/5">
                    <a
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366] text-[#128C7E] hover:text-white text-xs sm:text-sm font-semibold py-2.5 rounded-xl transition-colors duration-200 cursor-pointer"
                      href={waUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <MessageCircle className="w-4 h-4 shrink-0" />
                      <span>استفسر عبر واتساب الموديل</span>
                    </a>

                    <Link
                      href={`/catalog/${item.mainSection}/${item.slug}`}
                      className="w-full inline-flex items-center justify-center gap-1.5 text-xs text-charcoal/70 hover:text-primary font-bold py-1.5 transition-colors"
                    >
                      <span>عرض تفاصيل الموديل والمقايسة</span>
                      <ArrowLeft className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View Full Catalog Link Banner */}
        <div className="pt-4 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-container text-on-primary text-xs sm:text-sm font-bold py-3 px-8 rounded-xl shadow-md transition-all hover:-translate-y-0.5"
          >
            <span>استعراض كتالوج المنتجات والأسعار كاملة ({products.length} موديل متاح)</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
