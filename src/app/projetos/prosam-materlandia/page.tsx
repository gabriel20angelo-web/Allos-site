import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import DarkHero from "@/components/DarkHero";
import ProSamMaterlandiaContent from "@/components/projetos/ProSamMaterlandiaContent";

export const metadata = {
  title: "ProSam Materlândia — Associação Allos",
  description: "Programa de Saúde Mental para servidores públicos de Materlândia, MG.",
};

export default function ProSamMaterlandiaPage() {
  return (
    <>
      <NavBar />
      <main id="main-content">
        <DarkHero
          titleLine1="ProSam"
          titleLine2="Materlândia"
          titleLine2Italic={true}
          subtitle="Expansão do Programa de Saúde Mental para servidores públicos do município de Materlândia, Minas Gerais."
          meta="Saúde Pública · Desde 2026"
        />
        <ProSamMaterlandiaContent />
      </main>
      <Footer />
    </>
  );
}
