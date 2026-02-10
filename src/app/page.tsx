"use client";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] relative">
      {/* Content */}
      <div className="relative z-10">
        <Header />
        <Hero />
        <HowItWorks />
        <Footer />
      </div>
    </main>
  );
}
