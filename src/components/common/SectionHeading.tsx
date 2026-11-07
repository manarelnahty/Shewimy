import React from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "right";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className = "",
}: SectionHeadingProps) {
  const alignmentClass =
    align === "center"
      ? "text-center mx-auto items-center"
      : "text-right items-start";

  return (
    <div className={`flex flex-col max-w-3xl mb-12 sm:mb-16 ${alignmentClass} ${className}`}>
      {eyebrow && (
        <span className="text-xs sm:text-sm font-semibold tracking-wider text-bronze uppercase mb-2 inline-flex items-center gap-2">
          <span className="w-6 h-0.5 bg-bronze/60 rounded-full" />
          {eyebrow}
          <span className="w-6 h-0.5 bg-bronze/60 rounded-full" />
        </span>
      )}
      <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-charcoal">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-sm sm:text-base lg:text-lg text-charcoal/70 leading-relaxed font-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
}
