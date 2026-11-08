"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ArrowLeft, Sparkles, Layers } from "lucide-react";
import { Product } from "@/data/products";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { isValidImageUrl } from "@/lib/image";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80";

interface ProductCardProps {
  product: Product;
  branchName?: string;
  whatsappPhone?: string;
  onWhatsAppClick?: (product: Product) => void;
  className?: string;
  priority?: boolean;
}

export function ProductCard({
  product,
  branchName = "المركز الرئيسي",
  whatsappPhone = "01005557109",
  onWhatsAppClick,
  className = "",
  priority = false,
}: ProductCardProps) {
  // Extract all distinct valid images for cycling: coverImage first, then galleryImages
  const rawCover = product.coverImage || product.imageUrl;
  const primaryCover = isValidImageUrl(rawCover) ? (rawCover as string) : FALLBACK_IMAGE;
  const validGallery = (product.galleryImages || product.gallery || []).filter(
    (url): url is string => Boolean(url && isValidImageUrl(url) && url !== primaryCover)
  );
  const allImages = [primaryCover, ...validGallery];
  const hasMultipleImages = allImages.length > 1;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [shouldLoadGallery, setShouldLoadGallery] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-cycling slideshow on hover or touch
  useEffect(() => {
    if (isHovered && hasMultipleImages && shouldLoadGallery) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % allImages.length);
      }, 1300);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // Reset smoothly to primary cover image when leaving
      setCurrentIndex(0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovered, hasMultipleImages, shouldLoadGallery, allImages.length]);

  const handleMouseEnter = () => {
    setShouldLoadGallery(true);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleTouchStart = () => {
    setShouldLoadGallery(true);
    setIsHovered((prev) => !prev);
  };

  const waUrl = generateWhatsAppLink(whatsappPhone, branchName, {
    title: product.title || product.name,
    slug: product.slug,
    section: product.mainSection,
  });

  const detailUrl = `/catalog/${product.mainSection}/${product.slug}`;

  return (
    <article
      className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-[#e7e5e0] hover:border-[#1F5E4B]/30 ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
    >
      {/* Media Showcase with Auto-Cycling on Hover/Touch */}
      <div className="relative overflow-hidden aspect-[4/3] bg-gradient-to-tr from-[#ece8e1] to-[#f5f3ef] select-none">
        {/* 1. Primary Cover Image (Lazy-loaded by default, or priority if specified) */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
            currentIndex === 0 ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          <Image
            src={allImages[0]}
            alt={`${product.name} - صورة الغلاف`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            priority={priority}
            loading={priority ? undefined : "lazy"}
          />
        </div>

        {/* 2. On-Demand Gallery Preload: Mount additional slideshow images ONLY when hovered or touched */}
        {hasMultipleImages && shouldLoadGallery && (
          allImages.slice(1).map((imgSrc, sliceIdx) => {
            const idx = sliceIdx + 1;
            return (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                  idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <Image
                  src={imgSrc}
                  alt={`${product.name} - صورة ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
              </div>
            );
          })
        )}

        {/* Top Floating Badges */}
        <div className="absolute top-3 right-3 left-3 z-20 flex items-center justify-between pointer-events-none">
          <span className="bg-[#1b1c1a]/85 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-xs">
            {product.subCategory || "تصميم مخصص"}
          </span>

          <span className="bg-white/95 backdrop-blur-md text-[#1F5E4B] text-[11px] font-bold px-2.5 py-1 rounded-lg border border-[#e7e5e0] shadow-xs">
            ضمان {product.warrantyYears || 15} سنة
          </span>
        </div>

        {/* Visual Dots Indicator when Hovered or Multiple Images Exist */}
        {hasMultipleImages && (
          <div className="absolute bottom-2.5 inset-x-0 z-20 flex items-center justify-center gap-1.5 pointer-events-none">
            <div className="bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 transition-all">
              {allImages.map((_, dotIdx) => (
                <span
                  key={dotIdx}
                  className={`block rounded-full transition-all duration-300 ${
                    dotIdx === currentIndex
                      ? "w-4 h-1.5 bg-white shadow-xs"
                      : "w-1.5 h-1.5 bg-white/50"
                  }`}
                />
              ))}
              <span className="text-[10px] text-white/90 font-mono font-bold mr-1">
                {currentIndex + 1}/{allImages.length}
              </span>
            </div>
          </div>
        )}

        {/* Hover Hint Badge on Desktop */}
        {hasMultipleImages && !isHovered && (
          <div className="absolute bottom-2.5 left-2.5 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center gap-1 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-md">
            <Layers className="w-3 h-3 text-[#ffdcc3]" />
            <span>{allImages.length} صور</span>
          </div>
        )}
      </div>

      {/* Content & Action Buttons */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] font-mono font-bold text-[#855224] uppercase tracking-wider">
              {product.code || "SHW-PROD"}
            </span>
            {product.priceDisplay && (
              <span className="text-xs font-bold text-[#1F5E4B] font-mono">
                {product.price ? `${product.price.toLocaleString()} ج.م` : product.priceDisplay}
              </span>
            )}
          </div>

          <Link href={detailUrl} className="block">
            <h3 className="text-base sm:text-lg text-[#1b1c1a] font-bold group-hover:text-[#855224] transition-colors font-readex leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Key Materials Tags */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {(product.materials || []).slice(0, 3).map((mat, i) => (
              <span
                key={i}
                className="text-[11px] bg-[#f8f6f2] border border-[#e7e5e0] px-2 py-0.5 rounded-md text-[#5e6368] font-medium"
              >
                ✓ {mat}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-2 pt-3 border-t border-[#e7e5e0]">
          {onWhatsAppClick ? (
            <button
              type="button"
              onClick={() => onWhatsAppClick(product)}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366] text-[#128C7E] hover:text-white text-xs sm:text-sm font-semibold py-2.5 rounded-xl transition-all duration-200 cursor-pointer shadow-2xs hover:shadow"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>استفسر عبر واتساب الموديل</span>
            </button>
          ) : (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366] text-[#128C7E] hover:text-white text-xs sm:text-sm font-semibold py-2.5 rounded-xl transition-all duration-200 cursor-pointer shadow-2xs hover:shadow"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>استفسر عبر واتساب الموديل</span>
            </a>
          )}

          <Link
            href={detailUrl}
            className="w-full inline-flex items-center justify-center gap-1.5 text-xs text-[#5e6368] hover:text-[#1F5E4B] font-bold py-1.5 transition-colors"
          >
            <span>عرض تفاصيل الموديل والمقايسة</span>
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}

/**
 * High-performance luxury skeleton loader for ProductCard to ensure Zero CLS.
 */
export function ProductCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#e7e5e0] flex flex-col justify-between animate-pulse"
    >
      {/* Aspect Ratio 4/3 Image Shimmer Placeholder */}
      <div className="relative aspect-[4/3] w-full bg-gradient-to-tr from-[#ece8e1] via-[#f4f2ee] to-[#ece8e1]">
        <div className="absolute top-3 right-3 h-5 w-20 rounded-lg bg-white/60" />
        <div className="absolute top-3 left-3 h-5 w-24 rounded-lg bg-white/60" />
      </div>

      {/* Content Shimmer Area */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="h-3.5 w-16 bg-[#e4e0d8] rounded" />
            <div className="h-3.5 w-20 bg-[#e4e0d8] rounded" />
          </div>
          <div className="h-5 w-4/5 bg-[#dcd7ce] rounded" />
          <div className="flex gap-1.5 pt-1">
            <div className="h-4 w-16 bg-[#ece8e1] rounded-md" />
            <div className="h-4 w-20 bg-[#ece8e1] rounded-md" />
            <div className="h-4 w-14 bg-[#ece8e1] rounded-md" />
          </div>
        </div>

        {/* Buttons Shimmer */}
        <div className="space-y-2 pt-3 border-t border-[#e7e5e0]">
          <div className="h-10 w-full bg-[#e8e4dc] rounded-xl" />
          <div className="h-4 w-1/2 mx-auto bg-[#ece8e1] rounded" />
        </div>
      </div>
    </div>
  );
}
