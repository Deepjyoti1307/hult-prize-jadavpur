"use client";

import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import { renderCanvas, stopCanvas } from "@/components/ui/canvas";

export default function Home() {
  useEffect(() => {
    renderCanvas();
    return () => stopCanvas();
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0f] relative">
      {/* Full-page canvas background */}
      <canvas
        className="pointer-events-none fixed inset-0 z-0"
        id="canvas"
      />

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
