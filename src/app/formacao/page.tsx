import { redirect } from "next/navigation";

export const metadata = {
  title: "Formações e Cursos — Associação Allos",
  description: "Conteúdos críticos e existenciais para a prática clínica. Cursos gravados, ao vivo e formação síncrona contínua.",
};

export default function FormacaoPage() {
  redirect("https://allos.org.br/formacao");
}
