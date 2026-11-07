import React from "react";

export type ButtonVariant = "emerald" | "bronze" | "charcoal" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: "start" | "end";
}

const variantStyles: Record<ButtonVariant, string> = {
  emerald:
    "bg-emerald-cta text-white hover:bg-emerald-800 shadow-sm shadow-emerald-950/20 active:translate-y-0.5",
  bronze:
    "bg-bronze-accent text-white hover:bg-bronze-700 shadow-sm shadow-bronze-900/20 active:translate-y-0.5",
  charcoal:
    "bg-charcoal text-alabaster hover:bg-charcoal-700 shadow-sm active:translate-y-0.5",
  outline:
    "border border-charcoal/20 text-charcoal hover:bg-charcoal/5 active:translate-y-0.5",
  ghost:
    "text-charcoal hover:bg-charcoal/5 active:translate-y-0.5",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs font-medium rounded-md gap-1.5",
  md: "px-5 py-2.5 text-sm font-semibold rounded-lg gap-2",
  lg: "px-7 py-3.5 text-base font-semibold rounded-xl gap-2.5",
};

export function Button({
  variant = "emerald",
  size = "md",
  children,
  icon,
  iconPosition = "start",
  className = "",
  disabled = false,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center font-cairo transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {icon && iconPosition === "start" && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === "end" && <span className="inline-flex shrink-0">{icon}</span>}
    </button>
  );
}
