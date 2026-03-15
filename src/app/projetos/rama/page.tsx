import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import DarkHero from "@/components/DarkHero";
import RamaContent from "@/components/projetos/RamaContent";

export const metadata = {
  title: "Rede RAMA — Associação Allos",
  description: "Grupos de apoio para mães em territórios vulneráveis do Rio de Janeiro, em parceria com o PROINEPE.",
};

export default function RamaPage() {
  return (
    <>
      <NavBar />
      <main id="main-content">
        <DarkHero
          titleLine1="Rede"
          titleLine2="RAMA"
          titleLine2Italic={true}
          subtitle="Rede de Apoio a Mães e Acompanhantes — grupos de acolhimento e fortalecimento emocional em territórios vulneráveis do Rio de Janeiro."
          meta="Comunidade · Desde Setembro 2024"
        />
        <RamaContent />
      </main>
      <Footer />
    </>
  );
}
