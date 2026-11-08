"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  MapPin,
  ShieldCheck,
  Calendar,
  Ruler,
  Layers,
  Wrench,
  Clock,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Product, BRANCH_CONTACTS } from "@/data/products";
import { BRANCHES_LIST, SHOWROOM_BRANCHES } from "@/data/branches";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { ConsultationDrawer } from "@/components/common/ConsultationDrawer";
import { BranchSelectionModal } from "@/components/common/BranchSelectionModal";
import { useBranches } from "@/lib/firebase";
import { isValidImageUrl } from "@/lib/image";

const FALLBACK_DETAIL_IMG = "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80";

function WhatsAppIcon({ className = "w-4 h-4 shrink-0" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662a11.835 11.835 0 005.712 1.465h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.483-8.413z" />
    </svg>
  );
}

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const galleryImages = useMemo(() => {
    const raw = [
      product.coverImage || product.imageUrl,
      ...(product.galleryImages || product.gallery || []),
    ].filter((u): u is string => Boolean(u && isValidImageUrl(u)));
    if (raw.length > 0) {
      return Array.from(new Set(raw));
    }
    return [FALLBACK_DETAIL_IMG];
  }, [product.gallery, product.galleryImages, product.imageUrl, product.coverImage]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);

  const { branches } = useBranches();

  const availableBranches = useMemo(() => {
    return branches.filter((b) => product.branches?.includes(b.id as any));
  }, [branches, product.branches]);

  const handlePrevImage = () => {
    setActiveImageIndex((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  const buildWhatsappUrl = (phone: string, branchName: string) => {
    return generateWhatsAppLink(phone, branchName, {
      title: product.title || product.name,
      slug: product.slug,
      section: product.mainSection || product.category,
    });
  };

  const activeImageUrl = galleryImages[activeImageIndex] || product.imageUrl;

  return (
    <div className="w-full">
      {/* Breadcrumb Navigation */}
      <nav
        aria-label="مسار التصفح"
        className="flex items-center gap-2 mb-6 text-xs font-semibold text-charcoal/60"
      >
        <Link href="/" className="hover:text-primary transition-colors">
          الرئيسية
        </Link>
        <span className="text-charcoal/30">/</span>
        <Link href="/products" className="hover:text-primary transition-colors">
          المنتجات
        </Link>
        <span className="text-charcoal/30">/</span>
        <span className="text-secondary font-bold line-clamp-1">
          {product.name}
        </span>
      </nav>

      {/* Main Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* RIGHT COLUMN (RTL): Multi-Image Interactive Gallery (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Featured Image with Carousel Navigation */}
          <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[#ECE8E1] border border-charcoal/10 shadow-md group">
            <Image
              src={activeImageUrl}
              alt={`${product.name} - صورة ${activeImageIndex + 1}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover transition-all duration-500 group-hover:scale-102"
            />

            {/* Overlay Navigation Arrows */}
            {galleryImages.length > 1 && (
              <>
                {/* Right Arrow (Previous / Right in RTL) */}
                <button
                  type="button"
                  onClick={handlePrevImage}
                  aria-label="الصورة السابقة"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-md cursor-pointer z-20 hover:scale-110 active:scale-95"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Left Arrow (Next / Left in RTL) */}
                <button
                  type="button"
                  onClick={handleNextImage}
                  aria-label="الصورة التالية"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-md cursor-pointer z-20 hover:scale-110 active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Top Badges */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10 pointer-events-none">
              <span className="px-3 py-1 rounded-lg bg-[#1E2225]/90 backdrop-blur-md text-white text-xs font-semibold shadow-sm">
                {product.badgePrimary}
              </span>
              <span className="px-3 py-1 rounded-lg bg-[#F5E6D3]/95 backdrop-blur-md text-[#8C5D33] text-xs font-bold shadow-sm">
                {product.badgeSecondary}
              </span>
            </div>

            {/* Bottom Left: Product Code */}
            <div className="absolute bottom-4 left-4 px-3 py-1 rounded-lg bg-white/95 backdrop-blur-md text-primary text-xs font-bold font-mono border border-charcoal/10 shadow-sm z-10 pointer-events-none">
              كود الموديل : {product.code}
            </div>

            {/* Bottom Right: Image Counter Badge */}
            {galleryImages.length > 1 && (
              <div className="absolute bottom-4 right-4 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-medium font-mono z-10 shadow-sm border border-white/10 pointer-events-none">
                {activeImageIndex + 1} / {galleryImages.length}
              </div>
            )}
          </div>

          {/* Thumbnails Row (Multiple angles, interior details, hardware) */}
          {galleryImages.length > 1 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-charcoal/70 block">
                معرض زوايا وتفاصيل الموديل (اضغط للمعاينة):
              </span>
              <div className="grid grid-cols-4 gap-3">
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-[#ECE8E1] ${
                      activeImageIndex === idx
                        ? "ring-2 ring-[#1F5E4B] border-transparent shadow-sm scale-102"
                        : "border-charcoal/10 hover:border-charcoal/30 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={imgUrl}
                      alt={`${product.name} - زاوية ${idx + 1}`}
                      fill
                      sizes="150px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* LEFT COLUMN (RTL): Product Meta, Price, Branch WhatsApp & Actions (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header & Subtitle */}
          <div className="space-y-2 text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold">
              <span>{product.subtitle}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary font-readex leading-tight">
              {product.name}
            </h1>
            <p className="text-xs sm:text-sm text-charcoal/70 leading-relaxed pt-1">
              {product.description}
            </p>
          </div>

          {/* EXPLICIT PRICE SECTION (Appears inside the details page as requested) */}
          <div className="p-5 rounded-2xl bg-surface-container-low border border-charcoal/10 space-y-3">
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <span className="text-xs text-charcoal/60 block font-medium">
                  السعر الاسترشادي للموديل
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#1F5E4B] font-readex">
                  {product.priceDisplay}
                </span>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-100 text-[#1F5E4B] font-bold">
                شامل التصنيع والتركيب
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed border-t border-charcoal/10 pt-2.5 font-normal">
              {product.priceNote}. يشمل السعر التصميم الهندسي 3D المخصص لمساحتك، الشاسيه الداخلي، المفصلات الهيدروليكية، التوريد وضمان 15 سنة.
            </p>
          </div>

          {/* Approved Materials Badges (DRD Section 2 & 3) */}
          {product.materials && product.materials.length > 0 && (
            <div className="p-4 rounded-xl bg-surface-container-low border border-charcoal/10 space-y-2">
              <span className="text-xs font-bold text-primary block">
                الخامات المعتمدة (جودة وتصنيع أوروبي):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {product.materials.map((mat, mIdx) => (
                  <span
                    key={mIdx}
                    className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-white text-[#1F5E4B] border border-charcoal/10 shadow-2xs"
                  >
                    ✓ {mat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Branch Display & Availability (3 Branches DRD Section 4) */}
          <div className="p-4 rounded-xl bg-white border border-charcoal/10 space-y-2">
            <span className="text-xs font-bold text-primary block flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-secondary" />
              <span>جاهزية الموديل للمعاينة في الفروع:</span>
            </span>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {availableBranches.map((b) => (
                <span
                  key={b.id}
                  className="px-3 py-1 rounded-lg bg-emerald-50 text-[#1F5E4B] font-bold border border-emerald-200"
                >
                  متوفر بـ {b.name}
                </span>
              ))}
            </div>
          </div>

          {/* Dynamic Branch WhatsApp & Consultation CTAs */}
          <div className="space-y-2.5 pt-1">
            <div className="space-y-2">
              <span className="text-xs font-bold text-charcoal/70 block">
                تواصل مباشر وفوري عبر واتساب الفرع:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableBranches.slice(0, 2).map((branch) => (
                  <a
                    key={branch.id}
                    href={buildWhatsappUrl(branch.whatsappNumber, branch.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[#E8F8F0] hover:bg-[#d6f2e4] text-[#1F5E4B] text-xs font-bold py-3 px-3 rounded-xl transition-colors border border-[#1F5E4B]/15 shadow-2xs"
                  >
                    <WhatsAppIcon className="w-4 h-4 shrink-0" />
                    <span>واتساب {branch.id === "mansoura" ? "المنصورة" : branch.id === "mahalla" ? "المحلة" : "سمنود"}</span>
                  </a>
                ))}
              </div>
              {availableBranches.length > 2 && (
                <button
                  type="button"
                  onClick={() => setIsBranchModalOpen(true)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#E8F8F0] hover:bg-[#d6f2e4] text-[#1F5E4B] text-xs font-bold py-2.5 px-3 rounded-xl transition-colors border border-[#1F5E4B]/15 shadow-2xs cursor-pointer"
                >
                  <WhatsAppIcon className="w-4 h-4 shrink-0" />
                  <span>تواصل مع فرع سمنود والمصانع أو اختر فرعاً آخر</span>
                </button>
              )}
            </div>

            {/* Book 3D Consultation Button with Calendar Icon */}
            <button
              type="button"
              onClick={() => setIsConsultationOpen(true)}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#1F5E4B] hover:bg-[#164638] text-white text-xs sm:text-sm font-bold py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer active:translate-y-0.5"
            >
              <Calendar className="w-4 h-4 shrink-0" />
              <span>احجز معاينة ورفع مقاسات 3D لهذا الموديل</span>
            </button>
          </div>

          {/* Quick Assurance Badges */}
          <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-charcoal/75">
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container-low/70 border border-charcoal/5">
              <ShieldCheck className="w-4 h-4 text-secondary shrink-0" />
              <span className="font-semibold">ضمان 15 سنة حقيقي</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container-low/70 border border-charcoal/5">
              <CheckCircle2 className="w-4 h-4 text-[#1F5E4B] shrink-0" />
              <span className="font-semibold">تصنيع بماكينات إيطالية</span>
            </div>
          </div>
        </div>
      </div>

      {/* FULL TECHNICAL SPECIFICATIONS GRID */}
      <section className="mt-14 pt-10 border-t border-charcoal/10 space-y-6">
        <div>
          <span className="text-xs text-secondary font-bold uppercase tracking-wider block">
            المواصفات الهندسية الدقيقة
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-primary font-readex mt-1">
            تفاصيل الخامات وأنظمة الحركة لموديل [{product.code}]
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1: Dimensions */}
          <div className="p-5 rounded-2xl bg-white border border-charcoal/10 shadow-2xs space-y-2 text-right">
            <div className="w-9 h-9 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
              <Ruler className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-primary font-readex">
              المقاسات والأبعاد المقترحة
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed font-normal">
              {product.dimensions || "يتم تفصيل وتعديل كافة المقاسات بدقة بالملي لتطابق مساحة مطبخك ومنزلك."}
            </p>
          </div>

          {/* Card 2: Materials & Finish */}
          <div className="p-5 rounded-2xl bg-white border border-charcoal/10 shadow-2xs space-y-2 text-right">
            <div className="w-9 h-9 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-primary font-readex">
              الخامة السطحية والتشطيب
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed font-normal">
              {product.materialLabel} — {product.finish || "تشطيب فائق الجودة مقاوم للحرارة والخدوش والزيوت اليومية."}
            </p>
          </div>

          {/* Card 3: Hardware & Mechanisms */}
          <div className="p-5 rounded-2xl bg-white border border-charcoal/10 shadow-2xs space-y-2 text-right">
            <div className="w-9 h-9 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-primary font-readex">
              المفصلات والإكسسوارات
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed font-normal">
              {product.hardware || "مفصلات ومجاري أدراج Blum النمساوية الأصلية سوفت كلوز صامتة وعالية التحمل."}
            </p>
          </div>

          {/* Card 4: Chassis & Core */}
          <div className="p-5 rounded-2xl bg-white border border-charcoal/10 shadow-2xs space-y-2 text-right">
            <div className="w-9 h-9 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-primary font-readex">
              الشاسيه الداخلي والعزل
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed font-normal">
              {product.chassis || "كونتر جودوود مستورد معزول HPL ألماني 100% ضد المياه والرطوبة."}
            </p>
          </div>

          {/* Card 5: Lead Time */}
          <div className="p-5 rounded-2xl bg-white border border-charcoal/10 shadow-2xs space-y-2 text-right">
            <div className="w-9 h-9 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-primary font-readex">
              مدة التصنيع والتسليم
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed font-normal">
              {product.leadTime || "من 25 إلى 35 يوم عمل شامل التصميم والمعاينة والتصنيع والتركيب الفندقي."}
            </p>
          </div>

          {/* Card 6: Warranty */}
          <div className="p-5 rounded-2xl bg-white border border-charcoal/10 shadow-2xs space-y-2 text-right">
            <div className="w-9 h-9 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-primary font-readex">
              الضمان وخدمات ما بعد البيع
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed font-normal">
              ضمان {product.warrantyYears} سنة معتمد رسمياً وموثق بعقد، مع صيانة دورية مجانية وتوفير قطع غيار أصلية.
            </p>
          </div>
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 pt-10 border-t border-charcoal/10 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-primary font-readex">
              موديلات وتصاميم مشابهة قد تهمك
            </h2>
            <Link
              href="/products"
              className="text-xs font-bold text-secondary hover:text-primary transition-colors inline-flex items-center gap-1"
            >
              <span>مشاهدة كافة المنتجات</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.slice(0, 3).map((rel) => {
              const relImg = isValidImageUrl(rel.coverImage || rel.imageUrl)
                ? (rel.coverImage || rel.imageUrl)
                : FALLBACK_DETAIL_IMG;
              return (
                <Link
                  key={rel.id}
                  href={`/products/${rel.id}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-charcoal/10 shadow-2xs hover:shadow-lg transition-all duration-300 block"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#ECE8E1]">
                    <Image
                      src={relImg}
                      alt={rel.name}
                      fill
                      sizes="350px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-white/95 text-primary text-[10px] font-bold font-mono">
                      كود: {rel.code}
                    </div>
                  </div>
                  <div className="p-4 space-y-1.5 text-right">
                    <span className="text-[11px] text-secondary font-bold block">
                      {rel.subtitle}
                    </span>
                    <h3 className="text-sm font-bold text-primary group-hover:text-secondary transition-colors font-readex line-clamp-1">
                      {rel.name}
                    </h3>
                    <p className="text-xs text-charcoal/60 line-clamp-1">
                      {rel.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Consultation Modal */}
      <ConsultationDrawer
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        defaultBranch={product.branches[0]}
      />

      {/* Branch Selection Modal */}
      <BranchSelectionModal
        isOpen={isBranchModalOpen}
        product={product}
        onClose={() => setIsBranchModalOpen(false)}
      />
    </div>
  );
}
