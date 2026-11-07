import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Mail,
  PhoneCall,
  ArrowLeft,
} from "lucide-react";

export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="w-full bg-primary-container text-inverse-on-surface">
      <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-12 border-b border-outline-variant/20">
          {/* Col 1: Brand Info & Logo */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-surface-container-lowest p-1 shadow-sm">
                <Image
                  src="/images/logo.png"
                  alt="شعار مطابخ الشويمي"
                  width={36}
                  height={36}
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-base sm:text-lg text-on-primary font-bold font-readex">
                مطابخ الشويمي
              </span>
            </div>
            <p className="text-xs sm:text-[13px] text-on-primary-container leading-relaxed">
              تصاميم معمارية فاخرة ومطابخ خشبية مخصصة تجمع بين الحرفية اليدوية الرفيعة وأحدث التقنيات الأوروبية للمنازل الراقية.
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
                href="tel:+201005557109"
                aria-label="رقم الهاتف"
                className="w-8 h-8 rounded-full bg-surface-container-high/10 hover:bg-secondary flex items-center justify-center text-inverse-on-surface transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Collections & Designs */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm text-on-primary font-bold font-readex">
              التشكيلات والتصاميم
            </h3>
            <ul className="space-y-2 text-xs sm:text-[13px] text-on-primary-container">
              <li>
                <Link href="/products?category=kitchens" className="hover:text-secondary-fixed transition-colors block">
                  مطابخ خشب طبيعي مودرن
                </Link>
              </li>
              <li>
                <Link href="/products?category=kitchens" className="hover:text-secondary-fixed transition-colors block">
                  مطابخ كلاسيك ونيوكلاسيك
                </Link>
              </li>
              <li>
                <Link href="/products?category=dressing" className="hover:text-secondary-fixed transition-colors block">
                  دريسينج روم ووحدات تخزين فاخرة
                </Link>
              </li>
              <li>
                <Link href="/products?category=cladding" className="hover:text-secondary-fixed transition-colors block">
                  تجاليد حوائط وديكورات خشبية
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-secondary-fixed transition-colors block font-semibold text-secondary-fixed">
                  استعراض كتالوج المنتجات والأسعار ←
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Factories & Showrooms */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm text-on-primary font-bold font-readex">
              فروع الشويمي
            </h3>
            <div className="space-y-2.5 text-xs sm:text-[13px] text-on-primary-container">
              <div>
                <span className="font-bold text-on-primary block">فرع المنصورة:</span>
                <span className="block text-secondary-fixed" dir="ltr">01005557109 / 01012623138</span>
                <span className="block text-on-primary-container/80">شارع المشاية السفلية، أمام حديقة شجر الدر</span>
              </div>
              <div className="pt-1">
                <span className="font-bold text-on-primary block">فرع سمنود والمحلة:</span>
                <span className="block text-secondary-fixed" dir="ltr">01287153339 / 01098199288</span>
                <span className="block text-on-primary-container/80">طريق سمنود الرئيسي، بجوار المجمع الصناعي</span>
              </div>
            </div>
          </div>

          {/* Col 4: Private Consultation */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm text-on-primary font-bold font-readex">
              استشارة معمارية وتصميم 3D
            </h3>
            <p className="text-xs sm:text-[13px] text-on-primary-container leading-relaxed">
              تواصل مباشرة مع مهندسينا المعماريين لتحديد موعد زيارة للموقع ومعاينة المساحات بدقة مع رسم ثلاثي الأبعاد مجاني.
            </p>
            <div className="space-y-1.5 pt-1">
              <a
                href="https://wa.me/201005557109?text=مرحباً%20فرع%20المنصورة%20أود%20طلب%20استشارة"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-secondary-fixed hover:text-on-primary text-xs font-semibold transition-colors block"
              >
                <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
                <span>واتساب فرع المنصورة: 01005557109</span>
              </a>
              <a
                href="https://wa.me/201287153339?text=مرحباً%20فرع%20سمنود%20والمحلة%20أود%20طلب%20استشارة"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-secondary-fixed hover:text-on-primary text-xs font-semibold transition-colors block"
              >
                <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
                <span>واتساب فرع سمنود والمحلة: 01287153339</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-on-primary-container/80">
          <p>© {currentYear} مطابخ الشويمي. جميع الحقوق محفوظة. تنفيذ وتصميم مخصص بأعلى معايير الجودة.</p>
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
          </div>
        </div>
      </div>
    </footer>
  );
}
