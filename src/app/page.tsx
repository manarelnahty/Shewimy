import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { Portfolio } from "@/components/sections/Portfolio";
import { Branches } from "@/components/sections/Branches";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-alabaster text-charcoal">
      <Header />
      <main className="flex-1">
        <Hero />
        <TrustBar />
        <Portfolio />
        <Branches />
      </main>
      <Footer />
    </div>
  );
}
