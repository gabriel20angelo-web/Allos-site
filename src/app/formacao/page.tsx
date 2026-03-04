import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import HeroFormacao from "@/components/formacao/HeroFormacao";
import DestaqueCards from "@/components/formacao/DestaqueCards";
import CursosGrid from "@/components/formacao/CursosGrid";
import { FormacaoSincrona, PilaresSection } from "@/components/formacao/FormacaoSincrona";

export const metadata = {
  title: "Formações e Cursos — Associação Allos",
  description: "Conteúdos críticos e existenciais para a prática clínica. Cursos gravados, ao vivo e formação síncrona contínua.",
};

export default function FormacaoPage() {
  return (
    <>
      <NavBar />
      <main id="main-content">
        {/* 1 — Hero escuro com gradiente em movimento */}
        <HeroFormacao />

        {/* 2 — Destaques */}
        <DestaqueCards />

        {/* 3 — Grid com filtro animado */}
        <CursosGrid />

        {/* 4 — Formação síncrona (dark #1A1A1A) */}
        <FormacaoSincrona />

        {/* 5 — Pilares */}
        <PilaresSection />
      </main>
      <Footer />
    </>
  );
}
