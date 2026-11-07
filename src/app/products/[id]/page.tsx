import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { productsData } from "@/data/products";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductDetailClient } from "@/components/products/ProductDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return productsData.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = productsData.find(
    (p) => p.id === id || p.code.toLowerCase() === id.toLowerCase()
  );

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

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = productsData.find(
    (p) => p.id === id || p.code.toLowerCase() === id.toLowerCase()
  );

  if (!product) {
    notFound();
  }

  const relatedProducts = productsData.filter(
    (p) => p.category === product.category && p.id !== product.id
  );

  return (
    <div className="flex flex-col min-h-screen bg-surface text-on-surface antialiased selection:bg-secondary-container selection:text-on-secondary-container">
      <Header />

      <main className="flex-1 w-full pt-20 sm:pt-24 pb-16 lg:pb-24">
        <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12">
          <ProductDetailClient
            product={product}
            relatedProducts={relatedProducts}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
