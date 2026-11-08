import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductDetailClient } from "@/components/products/ProductDetailClient";
import { ProductDetailSkeleton } from "@/components/products/ProductDetailSkeleton";
import { getServerProductBySlug, getServerProducts } from "@/lib/serverData";
import { MainSection } from "@/types/shewimy";

interface CatalogPageProps {
  params: Promise<{ section: string; slug: string }>;
}

export function generateStaticParams() {
  return getServerProducts().map((product) => ({
    section: product.mainSection,
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: CatalogPageProps): Promise<Metadata> {
  const { section, slug } = await params;
  const product = getServerProductBySlug(section, slug);

  if (!product) {
    return {
      title: "الموديل غير موجود | كتالوج مطابخ الشويمي",
    };
  }

  return {
    title: `${product.name} [${product.subCategory}] | كتالوج الشويمي للمطابخ والديكورات`,
    description: product.description,
  };
}

async function CatalogDetailContent({ params }: CatalogPageProps) {
  const { section, slug } = await params;
  const product = getServerProductBySlug(section, slug);

  if (!product) {
    notFound();
  }

  const sectionProducts = getServerProducts({ section: product.mainSection as MainSection });
  const relatedProducts = sectionProducts.filter((p) => p.id !== product.id);

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}

export default function CatalogItemPage({ params }: CatalogPageProps) {
  return (
    <div className="flex flex-col min-h-screen bg-surface text-on-surface antialiased selection:bg-secondary-container selection:text-on-secondary-container">
      <Header />

      <main className="flex-1 w-full pt-18 sm:pt-20 pb-16 lg:pb-24">
        <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12">
          <Suspense fallback={<ProductDetailSkeleton />}>
            <CatalogDetailContent params={params} />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
