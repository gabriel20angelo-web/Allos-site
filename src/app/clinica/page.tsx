import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import DarkHero from "@/components/DarkHero";
import ClinicaContent from "@/components/clinica/ClinicaContent";

export const metadata = {
  title: "Clínica da Associação Allos",
  description: "Psicoterapia acessível e avaliação neuropsicológica com rigor técnico. Excelência clínica, formação supervisionada e compromisso social.",
};

export default function ClinicaPage() {
  return (
    <>
      <NavBar />
      <main id="main-content">
        <DarkHero
          titleLine1="Clínica da"
          titleLine2="Associação Allos"
          titleLine2Italic={true}
          subtitle="Excelência clínica, formação supervisionada e atendimento psicológico acessível — integrando prática rigorosa, diversidade teórica e compromisso social."
          meta="Belo Horizonte · Todo o Brasil"
        />
        <ClinicaContent />
      </main>
      <Footer />
    </>
  );
}
