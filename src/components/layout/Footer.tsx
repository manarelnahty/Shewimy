import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Mail,
  PhoneCall,
  Cpu,
  Store,
  Clock,
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
                href="tel:+201002345678"
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
                <a href="#portfolio-section" className="hover:text-secondary-fixed transition-colors block">
                  مطابخ خشب طبيعي مودرن
                </a>
              </li>
              <li>
                <a href="#portfolio-section" className="hover:text-secondary-fixed transition-colors block">
                  مطابخ كلاسيك ونيوكلاسيك
                </a>
              </li>
              <li>
                <a href="#portfolio-section" className="hover:text-secondary-fixed transition-colors block">
                  دريسينج روم ووحدات تخزين فاخرة
                </a>
              </li>
              <li>
                <a href="#portfolio-section" className="hover:text-secondary-fixed transition-colors block">
                  أسطح رخام طبيعي وكوارتز
                </a>
              </li>
              <li>
                <a href="#portfolio-section" className="hover:text-secondary-fixed transition-colors block">
                  إكسسوارات وحلول ذكية
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Factories & Showrooms */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm text-on-primary font-bold font-readex">
              المصانع والفروع
            </h3>
            <div className="space-y-2.5 text-xs sm:text-[13px] text-on-primary-container">
              <div className="flex items-start gap-2">
                <Cpu className="w-4 h-4 text-secondary-fixed shrink-0 mt-0.5" />
                <span>المجمع الصناعي الرئيسي: طريق سمنود، بجوار المجمع الصناعي، الدلتا</span>
              </div>
              <div className="flex items-start gap-2">
                <Store className="w-4 h-4 text-secondary-fixed shrink-0 mt-0.5" />
                <span>صالات العرض: فرع المنصورة (المشاية السفلية)، فرع المحلة الكبرى (شارع البحر)</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-secondary-fixed shrink-0" />
                <span>السبت - الخميس: 10:00 ص - 10:00 م</span>
              </div>
            </div>
          </div>

          {/* Col 4: Private Consultation */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm text-on-primary font-bold font-readex">
              استشارة معمارية خاصة
            </h3>
            <p className="text-xs sm:text-[13px] text-on-primary-container leading-relaxed">
              تواصل مباشرة مع أحد مهندسينا المعماريين لتحديد موعد زيارة للموقع ومعاينة المساحات بدقة.
            </p>
            <a
              href="https://wa.me/201002345678?text=مرحباً%20أود%20طلب%20كتالوج%20الخامات%20والمشاريع"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-secondary-fixed hover:text-on-primary text-xs sm:text-sm font-semibold transition-colors pt-1"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span>طلب كتالوج الخامات والمشاريع</span>
            </a>
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
