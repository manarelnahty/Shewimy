"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ArrowLeft } from "lucide-react";

interface ProjectItem {
  id: string;
  category: "modern" | "dressing" | "furniture";
  categoryLabel: string;
  title: string;
  imageUrl: string;
  tags: string[];
  whatsappMessage: string;
}

const projects: ProjectItem[] = [
  {
    id: "proj-1",
    category: "modern",
    categoryLabel: "مطابخ مودرن",
    title: "مطبخ مودرن شاتوه - مات رمادي وخشب جوز",
    imageUrl:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
    tags: ["HPL ألماني", "رخام طبيعي كلكتا", "إضاءة Smart LED"],
    whatsappMessage: "مرحباً، أود الاستفسار عن تفاصيل وأسعار مطبخ مودرن شاتوه",
  },
  {
    id: "proj-2",
    category: "modern",
    categoryLabel: "مطابخ مودرن",
    title: "مطبخ فيلا المعادي - أسود كربوني وبانوهات خشبية",
    imageUrl:
      "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80",
    tags: ["بولاك ألماني", "كوارتز إسباني", "مفصلات بلوم نمساوي"],
    whatsappMessage: "مرحباً، أود الاستفسار عن تفاصيل مطبخ فيلا المعادي",
  },
  {
    id: "proj-3",
    category: "dressing",
    categoryLabel: "دريسينج روم",
    title: "دريسينج روم فاخرة - زجاج فاميه وإضاءة داخلية",
    imageUrl:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
    tags: ["أخشاب طبيعية", "إكسسوارات إيطالية", "أرفف مخفية"],
    whatsappMessage: "مرحباً، أود الاستفسار عن تفاصيل الدريسينج روم الفاخرة",
  },
  {
    id: "proj-4",
    category: "furniture",
    categoryLabel: "أثاث وديكور",
    title: "تجليد جداري معماري خشب جوز مع وحدة TV مدمجة",
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    tags: ["بانوهات خشب جوز", "شرائح ليد مخفية", "عزل صوتي"],
    whatsappMessage: "مرحباً، أود الاستفسار عن تجليد الجدران المعماري",
  },
  {
    id: "proj-5",
    category: "modern",
    categoryLabel: "مطابخ مودرن",
    title: "مطبخ مينيماليست كلاسيكي - أبيض وأخشاب أرو أوروبي",
    imageUrl:
      "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80",
    tags: ["أرو طبيعي", "مفصلات هيدروليك", "كونترتوب كوارتز"],
    whatsappMessage: "مرحباً، أود الاستفسار عن المطبخ المودرن الأبيض",
  },
  {
    id: "proj-6",
    category: "dressing",
    categoryLabel: "دريسينج روم",
    title: "خزانة ملابس إيطالية متكاملة بقطاعات ألومنيوم سوداء",
    imageUrl:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
    tags: ["قطاعات ألومنيوم", "أدراج مخملية", "مستشعرات إضاءة"],
    whatsappMessage: "مرحباً، أود الاستفسار عن وحدات الدريسينج روم الذكية",
  },
];

export function Portfolio() {
  const [activeTab, setActiveTab] = useState<"all" | "modern" | "dressing" | "furniture">("all");

  const filteredProjects =
    activeTab === "all"
      ? projects
      : projects.filter((p) => p.category === activeTab);

  return (
    <section className="w-full bg-surface py-16 lg:py-24" id="portfolio-section">
      <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-2">
          <div>
            <span className="text-xs sm:text-sm text-secondary font-semibold uppercase tracking-wider block mb-1.5">
              أعمالنا الاستثنائية
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary font-readex">
              أحدث إبداعاتنا المنفذة
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5 max-w-xl leading-relaxed">
              استكشف تشكيلات المطابخ والدريسنج روم التي نفذناها بدقة وإتقان في فلل وقصور عملاء الشويمي.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-surface-container">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`text-xs sm:text-sm px-4 py-2 rounded font-semibold transition-all cursor-pointer ${
                activeTab === "all"
                  ? "text-white bg-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
              }`}
            >
              الكل
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("modern")}
              className={`text-xs sm:text-sm px-4 py-2 rounded font-semibold transition-all cursor-pointer ${
                activeTab === "modern"
                  ? "text-white bg-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
              }`}
            >
              مطابخ مودرن
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("dressing")}
              className={`text-xs sm:text-sm px-4 py-2 rounded font-semibold transition-all cursor-pointer ${
                activeTab === "dressing"
                  ? "text-white bg-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
              }`}
            >
              دريسينج روم
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("furniture")}
              className={`text-xs sm:text-sm px-4 py-2 rounded font-semibold transition-all cursor-pointer ${
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
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group border border-outline-variant/15"
            >
              <div className="relative overflow-hidden aspect-[4/3] bg-surface-container">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <span className="absolute top-3 right-3 bg-primary/85 backdrop-blur-md text-on-primary text-[11px] font-semibold px-2.5 py-1 rounded">
                  {project.categoryLabel}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base sm:text-lg text-primary font-bold group-hover:text-secondary transition-colors font-readex leading-snug">
                    {project.title}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {project.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-surface-container px-2 py-0.5 rounded text-on-surface-variant font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <a
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366] text-[#128C7E] hover:text-white text-xs sm:text-sm font-semibold py-2.5 rounded-lg transition-colors duration-200 cursor-pointer"
                  href={`https://wa.me/201005557109?text=${encodeURIComponent(project.whatsappMessage)}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>استفسر عبر واتساب</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* View Full Catalog Link Banner */}
        <div className="pt-4 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-container text-on-primary text-xs sm:text-sm font-bold py-3 px-8 rounded-xl shadow-md transition-all hover:-translate-y-0.5"
          >
            <span>استعراض كتالوج المنتجات والأسعار كاملة</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
