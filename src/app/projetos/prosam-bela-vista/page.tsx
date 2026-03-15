import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ProSamBelaVistaContent from "@/components/projetos/ProSamBelaVistaContent";

export const metadata = {
  title: "ProSam Bela Vista de Minas — Associação Allos",
  description: "Programa de Saúde Mental para servidores públicos de Bela Vista de Minas — 1230+ atendimentos e NPS acima de 90.",
};

export default function ProSamBelaVistaPage() {
  return (
    <>
      <NavBar />
      <main id="main-content">
        <ProSamBelaVistaContent />
      </main>
      <Footer />
    </>
  );
}
