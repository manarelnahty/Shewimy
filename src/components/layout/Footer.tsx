"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Mail,
  PhoneCall,
  ArrowLeft,
} from "lucide-react";
import { useBranches } from "@/lib/firebase";
import { generateWhatsAppLink } from "@/lib/whatsapp";

export function Footer() {
  const [currentYear, setCurrentYear] = useState(2026);
  const { branches } = useBranches();
  const primaryPhone = branches[0]?.phones?.[0] ?? "201005557109";

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full bg-primary-container text-inverse-on-surface">
      <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-12 border-b border-outline-variant/20">
          {/* Col 1: Brand Info & Logo */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-3.5 sm:gap-4">
              <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 flex items-center justify-center rounded-2xl bg-surface-container-lowest p-2 shadow-sm">
                <Image
                  src="/images/logo.png"
                  alt="شعار مطابخ الشويمي"
                  width={64}
                  height={64}
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-xl sm:text-2xl text-on-primary font-bold font-readex">
                مطابخ الشويمي
              </span>
            </div>
            <p className="text-xs sm:text-[13px] text-on-primary-container leading-relaxed">
              تصاميم معمارية فاخرة ومطابخ خشبية وميكانزم إيطالي وألماني، دريسينج روم، وأثاث مخصص بأعلى معايير الجودة العالمية وضمان ١٥ سنة حقيقي.
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="#branches-section"
                aria-label="الموقع الجغرافي"
                className="w-8 h-8 rounded-full bg-surface-container-high/10 hover:bg-secondary flex items-center justify-center text-inverse-on-surface transition-colors"
              >
                <MapPin className="w-4 h-4" />
              </a>
              <a
                href="mailto:info@shewimy.com"
                aria-label="البريد الإلكتروني"
                className="w-8 h-8 rounded-full bg-surface-container-high/10 hover:bg-secondary flex items-center justify-center text-inverse-on-surface transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href={`tel:+${primaryPhone}`}
                aria-label="رقم الهاتف"
                className="w-8 h-8 rounded-full bg-surface-container-high/10 hover:bg-secondary flex items-center justify-center text-inverse-on-surface transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Collections & Taxonomy (5 Sections DRD) */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm text-on-primary font-bold font-readex">
              التشكيلات والتصاميم
            </h3>
            <ul className="space-y-2 text-xs sm:text-[13px] text-on-primary-container">
              <li>
                <Link href="/products?category=kitchens" className="hover:text-secondary-fixed transition-colors block">
                  المطابخ الحديثة والميكانزم (60%)
                </Link>
              </li>
              <li>
                <Link href="/products?category=dressing_rooms" className="hover:text-secondary-fixed transition-colors block">
                  الدريسينج ووحدات التخزين
                </Link>
              </li>
              <li>
                <Link href="/products?category=furniture" className="hover:text-secondary-fixed transition-colors block">
                  الأثاث المنزلي الراقي
                </Link>
              </li>
              <li>
                <Link href="/products?category=decor" className="hover:text-secondary-fixed transition-colors block">
                  الديكورات وتجاليد الحوائط
                </Link>
              </li>
              <li>
                <Link href="/products?category=windows" className="hover:text-secondary-fixed transition-colors block">
                  الشبابيك والقطاعات UPVC
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-secondary-fixed transition-colors block font-semibold text-secondary-fixed pt-1">
                  استعراض الكتالوج والأسعار ←
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Branches Showrooms & Factories (Dynamic from Firestore) */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm text-on-primary font-bold font-readex">
              فروع ومصانع الشويمي ({branches.length} فروع)
            </h3>
            <div className="space-y-3 text-xs text-on-primary-container">
              {branches.map((branch) => (
                <div key={branch.id} className="border-b border-outline-variant/15 pb-2 last:border-0">
                  <span className="font-bold text-on-primary block">{branch.name}:</span>
                  <span className="block text-secondary-fixed font-mono text-[11px]" dir="ltr">
                    {branch.phones.join(" / ")}
                  </span>
                  <span className="block text-on-primary-container/80 text-[11px] leading-relaxed">
                    {branch.address}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Col 4: Private Consultation & WhatsApp Direct Conversion */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm text-on-primary font-bold font-readex">
              استشارة معمارية وتصميم 3D
            </h3>
            <p className="text-xs sm:text-[13px] text-on-primary-container leading-relaxed">
              تواصل مباشرة مع مسؤولي الفروع لتحديد موعد زيارة للموقع ومعاينة المساحات بدقة مع رسم وتخطيط ثلاثي الأبعاد 3D.
            </p>
            <div className="space-y-2 pt-1">
              {branches.map((b) => (
                <a
                  key={b.id}
                  href={generateWhatsAppLink(b.whatsappNumber, b.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-secondary-fixed hover:text-on-primary text-xs font-semibold transition-colors block"
                >
                  <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
                  <span>واتساب {b.name.split("(")[0].trim()}: {b.phones[0]}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-on-primary-container/80">
          <p>© {currentYear} مطابخ الشويمي. جميع الحقوق محفوظة. تنفيذ وتصميم مخصص بأعلى معايير الجودة وضمان ١٥ سنة.</p>
          <div className="flex items-center gap-5">
            <Link href="#" className="hover:text-inverse-on-surface transition-colors">
              سياسة الخصوصية
            </Link>
            <Link href="#" className="hover:text-inverse-on-surface transition-colors">
              الشروط والأحكام
            </Link>
            <Link href="#" className="hover:text-inverse-on-surface transition-colors">
              الضمان وخدمات ما بعد البيع
            </Link>
            <Link
              href="/admin"
              className="text-on-primary-container/50 hover:text-inverse-on-surface transition-colors flex items-center gap-1"
            >
              <span>لوحة الإدارة</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
