import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchProductById, fetchProducts } from "@/lib/firebase";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductDetailClient } from "@/components/products/ProductDetailClient";
import { ProductDetailSkeleton } from "@/components/products/ProductDetailSkeleton";
import { productsData } from "@/data/products";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return productsData.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProductById(id);

  if (!product) {
    return {
      title: "المنتج غير موجود | مطابخ الشويمي",
    };
  }

  return {
    title: `${product.name} [كود: ${product.code}] | مطابخ الشويمي`,
    description: product.description,
  };
}

async function ProductDetailContent({ params }: PageProps) {
  const { id } = await params;
  const product = await fetchProductById(id);

  if (!product) {
    notFound();
  }

  const allProducts = await fetchProducts({ section: product.mainSection });
  const relatedProducts = allProducts.filter((p) => p.id !== product.id);

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}

export default function ProductPage({ params }: PageProps) {
  return (
    <div className="flex flex-col min-h-screen bg-surface text-on-surface antialiased selection:bg-secondary-container selection:text-on-secondary-container">
      <Header />

      <main className="flex-1 w-full pt-18 sm:pt-20 pb-16 lg:pb-24">
        <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12">
          <Suspense fallback={<ProductDetailSkeleton />}>
            <ProductDetailContent params={params} />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
