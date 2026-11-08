"use client";

import React, { useState } from "react";
import { SiteSettings } from "@/types/shewimy";
import { SiteSettingsProvider } from "@/lib/SiteSettingsContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { Portfolio } from "@/components/sections/Portfolio";
import { ProcessJourney } from "@/components/sections/ProcessJourney";
import { Branches } from "@/components/sections/Branches";
import { CtaSection } from "@/components/sections/CtaSection";
import { ConsultationDrawer } from "@/components/common/ConsultationDrawer";

interface HomeClientProps {
  initialSettings: SiteSettings;
}

export function HomeClient({ initialSettings }: HomeClientProps) {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  return (
    <SiteSettingsProvider initialSettings={initialSettings}>
      <div className="flex flex-col min-h-screen bg-surface text-on-surface antialiased selection:bg-secondary-container selection:text-on-secondary-container">
        {/* Fixed Sticky Header */}
        <Header onOpenConsultation={() => setIsConsultationOpen(true)} />

        {/* Main Page Flow */}
        <main className="flex-1 w-full bg-surface">
          {/* Section 1: Hero Section */}
          <Hero onOpenConsultation={() => setIsConsultationOpen(true)} />

          {/* Section 2: Guarantees & Values */}
          <TrustBar />

          {/* Section 3: Portfolio & Creations */}
          <Portfolio />

          {/* Section 4: Production Journey */}
          <ProcessJourney />

          {/* Section 5: Showrooms & Factory */}
          <Branches />

          {/* Section 6: Consultation CTA */}
          <CtaSection onOpenConsultation={() => setIsConsultationOpen(true)} />
        </main>

        {/* Slide-Up Consultation Drawer / Modal */}
        <ConsultationDrawer
          isOpen={isConsultationOpen}
          onClose={() => setIsConsultationOpen(false)}
        />

        {/* Luxury Footer */}
        <Footer />
      </div>
    </SiteSettingsProvider>
  );
}
