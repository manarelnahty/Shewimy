"use client";

import React, { useState } from "react";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Button } from "@/components/common/Button";
import type { Item, ItemCategory } from "@/types/schema";
import { Sparkles, ArrowLeft } from "lucide-react";

// Mock DRD Items adhering strictly to the Item schema
const initialItems: Item[] = [
  {
    id: "item-1",
    title: "Royal Oak Dining Set",
    titleAr: "طاولة طعام رويال من خشب البلوط الطبيعي",
    description: "Solid natural oak table with hand-carved accents and 8 bespoke chairs upholstered in velvet.",
    descriptionAr: "طاولة طعام فاخرة تسع 10 أفراد من خشب البلوط الأوروبي الصلب مع كراسي مكسوة بالمخمل المقاوم للبقع.",
    category: "dining_room",
    woodType: "بلوط أوروبي صلب (Oak)",
    featured: true,
    imageUrl: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80",
    gallery: [],
    tags: ["سفرة", "خشب بلوط", "تشطيب يدوي", "مقاوم للحرارة"],
    status: "available",
    estimatedDeliveryWeeks: 3,
    price: {
      amount: 85000,
      currency: "EGP",
      isStartingFrom: true,
    },
    createdAt: "2026-01-10T12:00:00.000Z",
    updatedAt: "2026-01-10T12:00:00.000Z",
  },
  {
    id: "item-2",
    title: "Walnut & Brass Architectural Wall Cladding",
    titleAr: "تجليد جداري معماري من خشب الجوز والنحاس",
    description: "Custom geometric wall cladding with integrated ambient warm LED backlighting.",
    descriptionAr: "تجليد جدران متكامل بدقة هندسية يدمج ألواح الجوز الطبيعي مع شرائح النحاس المصقول والإضاءة المخفية.",
    category: "architectural_woodwork",
    woodType: "جوز تركي وأمريكي (Walnut)",
    featured: true,
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    gallery: [],
    tags: ["تجليد جدران", "إضاءة مخفية", "نحاس طبيعي", "عزل صوتي"],
    status: "made_to_order",
    estimatedDeliveryWeeks: 4,
    price: {
      amount: 120000,
      currency: "EGP",
      isStartingFrom: true,
    },
    createdAt: "2026-01-12T12:00:00.000Z",
    updatedAt: "2026-01-12T12:00:00.000Z",
  },
  {
    id: "item-3",
    title: "Imperial Master Bedroom Suite",
    titleAr: "جناح نوم إمبيريال من خشب الزان الروماني",
    description: "Luxury king bed with extended headboard paneling, nightstands, and customized wardrobe.",
    descriptionAr: "غرفة نوم ماستر متكاملة تشمل سرير ملكي مع ظهر ممتد من الخشب والقماش، وخزانة ملابس ذكية مدمجة.",
    category: "bedroom",
    woodType: "زان أحمر روماني مجفف",
    featured: true,
    imageUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
    gallery: [],
    tags: ["غرفة نوم", "زان روماني", "دولاب ذكي", "تشطيب مط"],
    status: "made_to_order",
    estimatedDeliveryWeeks: 5,
    price: {
      amount: 145000,
      currency: "EGP",
      isStartingFrom: true,
    },
    createdAt: "2026-01-15T12:00:00.000Z",
    updatedAt: "2026-01-15T12:00:00.000Z",
  },
  {
    id: "item-4",
    title: "Contemporary Minimalist Salon",
    titleAr: "صالون مودرن معاصر بتفاصيل أرو ماسيف",
    description: "Sculptural living room seating arrangement prioritizing comfort and timeless aesthetics.",
    descriptionAr: "طقم صالون بتصميم إيطالي انسيابي مع قواعد خشبية بارزة وإسفنج عالي الكثافة لراحة استثنائية.",
    category: "living_room",
    woodType: "أرو أمريكي وقواعد زان",
    featured: false,
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
    gallery: [],
    tags: ["صالون", "أقمشة مستوردة", "تصميم إيطالي", "ألوان ترابية"],
    status: "available",
    estimatedDeliveryWeeks: 2,
    price: {
      amount: 95000,
      currency: "EGP",
      isStartingFrom: true,
    },
    createdAt: "2026-01-18T12:00:00.000Z",
    updatedAt: "2026-01-18T12:00:00.000Z",
  },
];

const categoryTabs: { label: string; value: ItemCategory | "all" }[] = [
  { label: "كافة الأعمال", value: "all" },
  { label: "غرف المعيشة والصالون", value: "living_room" },
  { label: "غرف الطعام والمآدب", value: "dining_room" },
  { label: "أجنحة النوم الفاخرة", value: "bedroom" },
  { label: "الأعمال الخشبية والتجاليد", value: "architectural_woodwork" },
];

export function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | "all">("all");

  const filteredItems =
    selectedCategory === "all"
      ? initialItems
      : initialItems.filter((item) => item.category === selectedCategory);

  return (
    <section id="portfolio" className="py-20 sm:py-28 bg-alabaster">
      <Container>
        <SectionHeading
          eyebrow="سابقة الأعمال والمجموعات"
          title="قطع متميزة تعكس جوهر الفخامة والأصالة"
          subtitle="تصفح مختارات من أحدث مشاريعنا المنفذة بدقة استثنائية وبأيدي أمهر الحرفيين المصريين وفق المعايير العالمية."
        />

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {categoryTabs.map((tab) => {
            const isActive = selectedCategory === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setSelectedCategory(tab.value)}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-charcoal text-alabaster shadow-md"
                    : "bg-alabaster-200/60 text-charcoal/70 hover:bg-alabaster-200 hover:text-charcoal"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="group bg-white rounded-2xl overflow-hidden border border-charcoal/10 hover:border-bronze/40 hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Image banner with status tag */}
              <div className="relative aspect-[16/10] overflow-hidden bg-charcoal-50">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${item.imageUrl})` }}
                  role="img"
                  aria-label={item.titleAr}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Status Badge */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-md text-xs font-semibold bg-charcoal/90 text-alabaster backdrop-blur-sm">
                    {item.woodType}
                  </span>
                </div>

                {item.featured && (
                  <div className="absolute top-4 left-4">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-bronze text-white flex items-center gap-1 shadow-sm">
                      <Sparkles className="w-3 h-3" />
                      تصميم حصري
                    </span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-8 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-charcoal font-readex group-hover:text-bronze transition-colors">
                    {item.titleAr}
                  </h3>
                  <p className="mt-3 text-sm text-charcoal/70 leading-relaxed">
                    {item.descriptionAr}
                  </p>

                  {/* Tags */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-1 rounded bg-alabaster text-charcoal/80 border border-charcoal/10 font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer with Price and CTA */}
                <div className="mt-6 pt-5 border-t border-charcoal/10 flex items-center justify-between">
                  <div>
                    {item.price && (
                      <div className="text-xs text-charcoal/60">
                        {item.price.isStartingFrom ? "يبدأ من: " : "السعر: "}
                        <span className="text-base sm:text-lg font-bold text-charcoal font-readex">
                          {item.price.amount.toLocaleString("ar-EG")} {item.price.currency}
                        </span>
                      </div>
                    )}
                  </div>

                  <a
                    href="https://wa.me/201000000000"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="emerald" size="sm" icon={<ArrowLeft className="w-4 h-4" />} iconPosition="end">
                      طلب تسعير
                    </Button>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA for custom bespoke projects */}
        <div className="mt-16 text-center p-8 rounded-2xl bg-gradient-to-r from-charcoal via-charcoal-700 to-charcoal text-alabaster border border-charcoal/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-right">
            <h4 className="text-xl font-bold font-readex text-alabaster">
              هل لديك تصميم معماري أو مخطط خاص وتريد تنفيذه؟
            </h4>
            <p className="text-sm text-alabaster/70 mt-1">
              يقوم مهندسونا المتخصصون بمراجعة المخططات وتقديم جداول كميات وعينات أخشاب مطابقة لمواصفاتك.
            </p>
          </div>
          <a href="https://wa.me/201000000000" target="_blank" rel="noopener noreferrer">
            <Button variant="bronze" size="md" className="whitespace-nowrap">
              إرسال المخطط للمراجعة الهندسية
            </Button>
          </a>
        </div>
      </Container>
    </section>
  );
}
