"use client";

import React from "react";
import { ShieldCheck, Cpu, Droplets, Box } from "lucide-react";
import { motion, useReducedMotion, Variants } from "framer-motion";
import { useSiteSettings } from "@/lib/firebase";

const EASE_CUBIC = [0.16, 1, 0.3, 1] as const;

export function TrustBar() {
  const { settings } = useSiteSettings();
  const shouldReduceMotion = useReducedMotion();

  const iconList = [
    <ShieldCheck key="shield" className="w-5 h-5 text-secondary" />,
    <Cpu key="cpu" className="w-5 h-5 text-secondary" />,
    <Droplets key="droplet" className="w-5 h-5 text-secondary" />,
    <Box key="box" className="w-5 h-5 text-secondary" />,
  ];

  const items =
    settings.trustBarItems && settings.trustBarItems.length > 0
      ? settings.trustBarItems
      : [
          {
            title: "ضمان 15 سنة",
            desc: "ضمان حقيقي شامل الخامات والإكسسوارات والمفصلات دون أي شروط خفية.",
          },
          {
            title: "مصانعنا الخاصة - أول يد",
            desc: "إنتاج مباشر بدون وسطاء بأفضل سعر تصنيع وجودة تفصيلية مضمونة ومطابقة للمواصفات.",
          },
          {
            title: "ماكينات إيطالي ولزق ألماني",
            desc: "تقنيات PUR الألمانية المقاومة للمياه والحرارة بالكامل لحماية حواف الخشب لسنوات.",
          },
          {
            title: "تصميم هندسي 3D",
            desc: "معاينة واقعية لمطبخك وتوزيع مثلث الحركة الذكي قبل بدء خط التصنيع الفعلي.",
          },
        ];

  // Staggered viewport entrance variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.5,
        ease: EASE_CUBIC,
      },
    },
  };

  return (
    <section className="w-full bg-surface-container-low py-10 sm:py-12 overflow-hidden">
      <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {items.map((card, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : {
                      y: -6,
                      transition: { duration: 0.25, ease: "easeOut" },
                    }
              }
              className="group bg-surface-container-lowest p-5 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-outline-variant/10 hover:border-secondary/30 cursor-default"
            >
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary mb-3.5 transition-transform duration-300 ease-out group-hover:scale-110">
                {iconList[idx % iconList.length]}
              </div>
              <div>
                <h3 className="text-base sm:text-lg text-primary mb-1.5 font-bold font-readex transition-colors duration-200 group-hover:text-secondary">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-[13px] text-on-surface-variant leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
