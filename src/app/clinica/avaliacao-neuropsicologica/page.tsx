import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import DarkHero from "@/components/DarkHero";
import AvaliacaoNeuroContent from "@/components/clinica/AvaliacaoNeuroContent";

export const metadata = {
  title: "Avaliação Neuropsicológica | Clínica Allos",
  description:
    "Avaliação neuropsicológica com rigor técnico e atendimento humanizado. Diagnósticos precisos para orientar o melhor caminho de tratamento.",
};

export default function AvaliacaoNeuropsicologicaPage() {
  return (
    <>
      <NavBar />
      <main id="main-content">
        <DarkHero
          titleLine1="Avaliação"
          titleLine2="Neuropsicológica"
          titleLine2Italic={true}
          subtitle="Avaliação neuropsicológica com rigor técnico e atendimento humanizado. Diagnósticos precisos para orientar o melhor caminho de tratamento."
          meta="Presencial e Online"
          cta={{ href: "https://wa.me/5524998503894", label: "Agendar avaliação" }}
        />
        <AvaliacaoNeuroContent />
      </main>
      <Footer />
    </>
  );
}
