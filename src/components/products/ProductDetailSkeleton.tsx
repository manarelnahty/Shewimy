import React from "react";

export function ProductDetailSkeleton() {
  return (
    <div className="w-full animate-pulse" aria-label="جاري تحميل تفاصيل الموديل...">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 w-14 rounded bg-surface-container-high/60" />
        <span className="text-charcoal/20">/</span>
        <div className="h-4 w-16 rounded bg-surface-container-high/60" />
        <span className="text-charcoal/20">/</span>
        <div className="h-4 w-32 rounded bg-surface-container-high/70" />
      </div>

      {/* Main Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Right Gallery Skeleton (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] w-full rounded-2xl bg-surface-container-high/60 border border-charcoal/5" />
          <div className="space-y-2">
            <div className="h-3 w-40 rounded bg-surface-container-high/40" />
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-[4/3] rounded-xl bg-surface-container-high/40 border border-charcoal/5"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Left Info Skeleton (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <div className="h-6 w-28 rounded-full bg-surface-container-high/50" />
            <div className="h-9 w-4/5 rounded-xl bg-surface-container-high/70" />
            <div className="h-4 w-2/3 rounded bg-surface-container-high/40" />
          </div>

          {/* Price Box Skeleton */}
          <div className="p-5 rounded-2xl bg-surface-container-high/30 border border-charcoal/5 space-y-2">
            <div className="h-4 w-24 rounded bg-surface-container-high/50" />
            <div className="h-8 w-44 rounded-lg bg-surface-container-high/70" />
          </div>

          {/* Branch Status Skeleton */}
          <div className="p-4 rounded-xl bg-surface-container-high/20 border border-charcoal/5 h-16" />

          {/* Action Buttons Skeleton */}
          <div className="space-y-2.5">
            <div className="h-12 w-full rounded-xl bg-surface-container-high/70" />
            <div className="h-11 w-full rounded-xl bg-surface-container-high/40" />
          </div>

          {/* Technical Specs Grid Skeleton */}
          <div className="space-y-3 pt-2">
            <div className="h-4 w-32 rounded bg-surface-container-high/50" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-surface-container-high/30 border border-charcoal/5 h-20"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
