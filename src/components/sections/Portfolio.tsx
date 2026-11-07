"use client";

import React, { useState } from "react";
import Image from "next/image";

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
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDBAQBoMgePU5EkpY28MeJBMbBHzHwXdqSNsN5essXjxlYVDCyd2BbkCnoHsr-4pWz6HHbJ5_bpbf4Rq6km7CklupE5540gB_t7FiSH7jgphV5hSbglerw8oDdGAEBxHtP8R6Pe9wD4YK31Kr0-IxLVdkbqZJBqARxE6mpvfwL6D-D0tnnZaCvslyiq0oJNtwknKybkF6_lwl0biBCFkkbmXhPvxbDX__JPkFAppS0",
    tags: ["HPL ألماني", "رخام طبيعي كلكتا", "إضاءة Smart LED"],
    whatsappMessage: "مرحباً، أود الاستفسار عن تفاصيل وأسعار مطبخ مودرن شاتوه",
  },
  {
    id: "proj-2",
    category: "modern",
    categoryLabel: "مطابخ مودرن",
    title: "مطبخ فيلا المعادي - أسود كربوني وبانوهات خشبية",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDrl2yP2VykpkKgYshjhQR3-WMJ1OxkC7THuF66GdkzQ_WTifViLlIT1bYTXlS0ok5Dgwwo6y_KFYS5HwntgOGpxd_4bwIm--kXwgBS7BwSFmzN6kdbiSKguU0ItSmnOg7i5rUDGLiqOyqH6uAzne6DdVRccaGIVOwzP8C85pEnm8Og31MXnV1ImHOL-ONZkQLg1S5fX75BadtAB16XRABhzPyINbLmiKuDI1fL4rI",
    tags: ["بولاك ألماني", "كوارتز إسباني", "مفصلات بلوم نمساوي"],
    whatsappMessage: "مرحباً، أود الاستفسار عن تفاصيل مطبخ فيلا المعادي",
  },
  {
    id: "proj-3",
    category: "dressing",
    categoryLabel: "دريسينج روم",
    title: "دريسينج روم فاخرة - زجاج فاميه وإضاءة داخلية",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBXN8DNG20jjInUk91vYG81tR2cOfrwX5NLF9ZCXxGGbh4NE_CnBHjxZpWkkAQq17HX5IV1fTWM4ynOvSep-YZW_a1fFPTeXjSglO9o63ruFo8rfBzUlrNBrveUfZcCXVbop4slPnEhnEvx0uKKhxgJHqg2hk2vRpAEFSVFCJ_muomayXwIDXpZKzZOIa3RaMOYgEtS9jX7s92FCGkfX-68ULmt7xKliLcfru_mnsg",
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
    <section className="w-full bg-surface py-20 lg:py-28" id="portfolio-section">
      <div className="max-w-[1380px] mx-auto px-6 lg:px-12 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4">
          <div>
            <span className="font-label-md text-label-md text-secondary font-semibold uppercase tracking-wider block mb-2">
              أعمالنا الاستثنائية
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary font-bold font-readex">
              أحدث إبداعاتنا المنفذة
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-xl">
              استكشف تشكيلات المطابخ والدريسنج روم التي نفذناها بدقة وإتقان في فلل وقصور عملاء الشويمي.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-lg bg-surface-container">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`font-label-md text-label-md px-5 py-2.5 rounded font-semibold transition-all cursor-pointer ${
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
              className={`font-label-md text-label-md px-5 py-2.5 rounded font-semibold transition-all cursor-pointer ${
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
              className={`font-label-md text-label-md px-5 py-2.5 rounded font-semibold transition-all cursor-pointer ${
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
              className={`font-label-md text-label-md px-5 py-2.5 rounded font-semibold transition-all cursor-pointer ${
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group border border-outline-variant/20"
            >
              <div className="relative overflow-hidden aspect-[4/3] bg-surface-container">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <span className="absolute top-4 right-4 bg-primary/80 backdrop-blur-md text-on-primary font-label-sm text-label-sm px-3 py-1 rounded">
                  {project.categoryLabel}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-primary font-bold group-hover:text-secondary transition-colors font-readex">
                    {project.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="font-label-sm text-label-sm bg-surface-container px-2.5 py-1 rounded text-on-surface-variant"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <a
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366] text-[#128C7E] hover:text-white font-label-md text-label-md py-3 rounded-lg transition-colors duration-200 cursor-pointer"
                  href={`https://wa.me/201002345678?text=${encodeURIComponent(project.whatsappMessage)}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                  <span>استفسر عبر واتساب</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
