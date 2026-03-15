import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import DarkHero from "@/components/DarkHero";
import PsicoterapiaContent from "@/components/clinica/PsicoterapiaContent";

export const metadata = {
  title: "Psicoterapia | Clínica Allos",
  description:
    "Psicoterapia de qualidade com valores acessíveis. Terapeutas selecionados por competência, supervisão obrigatória e atendimento 100% online.",
};

export default function PsicoterapiaPage() {
  return (
    <>
      <NavBar />
      <main id="main-content">
        <DarkHero
          titleLine1="Psicoterapia"
          titleLine2="de verdade"
          titleLine2Italic={true}
          subtitle="Não acreditamos na separação entre estagiário e profissional formado. Acreditamos em psicologia bem feita — e construímos um método inteiro para garantir isso."
          cta={{ href: "https://bit.ly/terapiasite", label: "Agendar Sessão" }}
        />
        <PsicoterapiaContent />
      </main>
      <Footer />
    </>
  );
}
