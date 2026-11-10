"use client";

import React, { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

interface AnimatedCounterProps {
  value: string | number;
  duration?: number;
  className?: string;
}

interface ParsedNumber {
  prefix: string;
  target: number;
  suffix: string;
  hasCommas: boolean;
}

function parseValueString(raw: string | number): ParsedNumber | null {
  const str = String(raw).trim();
  // Match prefix, number with optional commas, and suffix
  // Example: "+3,500" -> prefix: "+", num: "3,500", suffix: ""
  // Example: "3 فروع" -> prefix: "", num: "3", suffix: " فروع"
  // Example: "100%" -> prefix: "", num: "100", suffix: "%"
  const match = str.match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/);
  if (!match) return null;

  const prefix = match[1] || "";
  const numStr = match[2] || "";
  const suffix = match[3] || "";
  const hasCommas = numStr.includes(",");
  const cleanNum = parseFloat(numStr.replace(/,/g, ""));

  if (isNaN(cleanNum)) return null;

  return {
    prefix,
    target: cleanNum,
    suffix,
    hasCommas,
  };
}

export function AnimatedCounter({
  value,
  duration = 2,
  className = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const shouldReduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState<string>(() => {
    // Start with 0 formatted or the static value if no numbers
    const parsed = parseValueString(value);
    if (!parsed) return String(value);
    return `${parsed.prefix}0${parsed.suffix}`;
  });

  useEffect(() => {
    const parsed = parseValueString(value);

    // If no numbers or user prefers reduced motion, show exact value immediately
    if (!parsed || shouldReduceMotion) {
      setDisplayValue(String(value));
      return;
    }

    if (!isInView) return;

    const controls = animate(0, parsed.target, {
      duration,
      ease: [0.16, 1, 0.3, 1] as const, // Smooth exponential ease-out
      onUpdate: (latest) => {
        const rounded = Math.round(latest);
        const formattedNum = parsed.hasCommas
          ? rounded.toLocaleString("en-US")
          : rounded.toString();
        setDisplayValue(`${parsed.prefix}${formattedNum}${parsed.suffix}`);
      },
      onComplete: () => {
        // Ensure final exact formatting
        const formattedNum = parsed.hasCommas
          ? parsed.target.toLocaleString("en-US")
          : parsed.target.toString();
        setDisplayValue(`${parsed.prefix}${formattedNum}${parsed.suffix}`);
      },
    });

    return () => controls.stop();
  }, [isInView, value, duration, shouldReduceMotion]);

  return (
    <span ref={ref} className={className} aria-label={String(value)}>
      {displayValue}
    </span>
  );
}
