"use client";
import { useEffect, useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import NavBar from "@/components/NavBar";
import HeroSection from "@/components/HeroSection";
import FrentesSection from "@/components/FrentesSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1600); return () => clearTimeout(t); }, []);
  return (
    <>
      <LoadingScreen isLoading={loading}/>
      <NavBar/>
      <main id="main-content">
        {/* 1. CREME — hero */}
        <HeroSection/>
        {/* 2. BEGE QUENTE — frentes */}
        <FrentesSection/>
        {/* 3. CREME — CTA */}
        <CTASection/>
      </main>
      {/* 6. ESCURO #1A1A1A — footer */}
      <Footer/>
    </>
  );
}
