import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import HeroPS from "@/components/processo/HeroPS";
import IntroPS from "@/components/processo/IntroPS";
import RequisitosPS from "@/components/processo/RequisitosPS";
import EtapasPS from "@/components/processo/EtapasPS";
import AvaliAllosSection from "@/components/processo/AvaliAllosSection";
import DesenvolvimentoPS from "@/components/processo/DesenvolvimentoPS";
import EstruturaPS from "@/components/processo/EstruturaPS";
import CompetenciasPS from "@/components/processo/CompetenciasPS";
import PraticaPS from "@/components/processo/PraticaPS";
import ConvitePS from "@/components/processo/ConvitePS";
import FinalCTAPS from "@/components/processo/FinalCTAPS";

export default function ProcessoSeletivoPage() {
  return (
    <>
      <NavBar/>
      <main id="main-content">
        {/* 1. CREME — hero */}
        <HeroPS/>
        {/* 2. BEGE — intro */}
        <IntroPS/>
        {/* 3. CREME — requisitos */}
        <RequisitosPS/>
        {/* 4. BEGE — etapas */}
        <EtapasPS/>
        {/* 5. ESCURO #1A1A1A — AvaliAllos + scoring + stats */}
        <AvaliAllosSection/>
        {/* 6. BEGE — sobre o processo */}
        <DesenvolvimentoPS/>
        {/* 7. CREME — estrutura */}
        <EstruturaPS/>
        {/* 8. BEGE — competências */}
        <CompetenciasPS/>
        {/* 9. CREME — filosofia + expectativas */}
        <PraticaPS/>
        {/* 10. BEGE — convite/grupos */}
        <ConvitePS/>
        {/* 11. ESCURO #1A1A1A — CTA final */}
        <FinalCTAPS/>
      </main>
      {/* ESCURO #1A1A1A — footer */}
      <Footer/>
    </>
  );
}
