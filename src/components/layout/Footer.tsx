import React from "react";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="w-full bg-primary-container text-inverse-on-surface">
      <div className="max-w-[1380px] mx-auto px-6 lg:px-12 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-14 border-b border-outline-variant/20">
          {/* Col 1: Brand Info & Logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-surface-container-lowest p-1 shadow-sm">
                <Image
                  src="/images/logo.png"
                  alt="شعار مطابخ الشويمي"
                  width={40}
                  height={40}
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="font-title text-title text-on-primary font-bold font-readex">
                مطابخ الشويمي
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-primary-container leading-relaxed">
              تصاميم معمارية فاخرة ومطابخ خشبية مخصصة تجمع بين الحرفية اليدوية الرفيعة وأحدث التقنيات الأوروبية للمنازل الراقية.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#branches-section"
                aria-label="الموقع الجغرافي"
                className="w-9 h-9 rounded-full bg-surface-container-high/10 hover:bg-secondary flex items-center justify-center text-inverse-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">location_on</span>
              </a>
              <a
                href="mailto:info@shewimy.com"
                aria-label="البريد الإلكتروني"
                className="w-9 h-9 rounded-full bg-surface-container-high/10 hover:bg-secondary flex items-center justify-center text-inverse-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">mail</span>
              </a>
              <a
                href="tel:+201002345678"
                aria-label="رقم الهاتف"
                className="w-9 h-9 rounded-full bg-surface-container-high/10 hover:bg-secondary flex items-center justify-center text-inverse-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">phone_in_talk</span>
              </a>
            </div>
          </div>

          {/* Col 2: Collections & Designs */}
          <div className="space-y-4">
            <h3 className="font-label-lg text-label-lg text-on-primary font-semibold">
              التشكيلات والتصاميم
            </h3>
            <ul className="space-y-2.5 font-body-sm text-body-sm text-on-primary-container">
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
          <div className="space-y-4">
            <h3 className="font-label-lg text-label-lg text-on-primary font-semibold">
              المصانع والفروع
            </h3>
            <div className="space-y-3 font-body-sm text-body-sm text-on-primary-container">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-secondary-fixed text-[18px] mt-1 shrink-0">
                  factory
                </span>
                <span>المجمع الصناعي الرئيسي: طريق سمنود، بجوار المجمع الصناعي، الدلتا</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-secondary-fixed text-[18px] mt-1 shrink-0">
                  storefront
                </span>
                <span>صالات العرض: فرع المنصورة (المشاية السفلية)، فرع المحلة الكبرى (شارع البحر)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary-fixed text-[18px] shrink-0">
                  schedule
                </span>
                <span>السبت - الخميس: 10:00 ص - 10:00 م</span>
              </div>
            </div>
          </div>

          {/* Col 4: Private Consultation */}
          <div className="space-y-4">
            <h3 className="font-label-lg text-label-lg text-on-primary font-semibold">
              استشارة معمارية خاصة
            </h3>
            <p className="font-body-sm text-body-sm text-on-primary-container">
              تواصل مباشرة مع أحد مهندسينا المعماريين لتحديد موعد زيارة للموقع ومعاينة المساحات بدقة.
            </p>
            <a
              href="https://wa.me/201002345678?text=مرحباً%20أود%20طلب%20كتالوج%20الخامات%20والمشاريع"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-secondary-fixed hover:text-on-primary font-label-md text-label-md transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              <span>طلب كتالوج الخامات والمشاريع</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-body-sm text-body-sm text-on-primary-container/80">
          <p>© {currentYear} مطابخ الشويمي. جميع الحقوق محفوظة. تنفيذ وتصميم مخصص بأعلى معايير الجودة.</p>
          <div className="flex items-center gap-6">
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
