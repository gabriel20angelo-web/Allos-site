import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import DarkHero from "@/components/DarkHero";
import ProjetosGallery from "@/components/projetos/ProjetosGallery";

export const metadata = {
  title: "Projetos — Associação Allos",
  description: "Projetos de impacto social em saúde mental da Associação Allos — programas para servidores públicos e comunidades vulneráveis.",
};

export default function ProjetosPage() {
  return (
    <>
      <NavBar />
      <main id="main-content">
        <DarkHero
          titleLine1="Nossos"
          titleLine2="Projetos"
          titleLine2Italic={true}
          subtitle="Iniciativas de impacto social em saúde mental, desenvolvidas em parceria com redes públicas e organizações comunitárias."
          meta="Saúde Pública · Comunidade"
        />
        <ProjetosGallery />
      </main>
      <Footer />
    </>
  );
}
