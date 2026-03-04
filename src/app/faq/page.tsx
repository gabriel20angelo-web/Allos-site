import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import HeroFaq from "@/components/faq/HeroFaq";
import FaqAccordion from "@/components/faq/FaqAccordion";
import FaqCTA from "@/components/faq/FaqCTA";
import type { FaqGroup } from "@/components/faq/FaqAccordion";

const faqData: FaqGroup[] = [
  {
    label: "Institucional",
    items: [
      {
        q: "O que é a Allos?",
        a: "A Associação Allos é uma ONG sem fins lucrativos fundada em 2023, sediada em Belo Horizonte (MG), com atuação em nível nacional. Atua como instituição de ensino e impacto social, conectando estudantes e voluntários a comunidades em situação de vulnerabilidade. Desenvolvemos formação prática supervisionada remunerada nas áreas da saúde, especialmente Psicologia e Nutrição, articulando projetos sociais, pesquisa, serviços institucionais e produção científica e cultural.",
      },
      {
        q: "Como a Allos é financiada?",
        a: "A principal fonte de receita da Allos são parcerias institucionais, por meio das quais prestamos serviços de psicologia para empresas, órgãos públicos e instituições, além da receita proveniente dos atendimentos clínicos realizados pela Clínica Social.",
      },
      {
        q: "Se a Allos não tem fins lucrativos, por que os serviços são pagos?",
        a: "A Allos possui custos operacionais necessários para manter seus projetos. Os atendimentos são cobrados em valores inferiores aos praticados no mercado, respeitando nosso caráter social. Toda a receita é integralmente reinvestida na instituição — incluindo contratação de professores, supervisores, realização de eventos científicos, concessão de bolsas, apoio a projetos sociais e incentivo à pesquisa.",
      },
    ],
  },
  {
    label: "Clínica",
    items: [
      {
        q: "O que é a Clínica Social da Allos?",
        a: "A Clínica Social da Allos oferece atendimentos psicológicos e avaliações neuropsicológicas a preços acessíveis, realizados por estagiários em formação supervisionada. O projeto alia formação clínica responsável com compromisso social, ampliando o acesso ao cuidado em saúde mental.",
      },
      {
        q: "Como é feito o pagamento dos atendimentos?",
        a: "Os atendimentos psicológicos são pagos mensalmente, em valor fixo, via PIX. Avaliações neuropsicológicas podem ser pagas por PIX ou cartão de crédito.",
      },
      {
        q: "Quais demandas vocês atendem?",
        a: "Aceitamos todo tipo de demanda clínica.",
      },
      {
        q: "O atendimento é confidencial?",
        a: "Sim. Todos os atendimentos seguem rigorosamente o Código de Ética do Psicólogo, garantindo sigilo e proteção da intimidade das pessoas atendidas.",
      },
      {
        q: "Qual abordagem psicoterapêutica vocês utilizam?",
        a: "A Allos trabalha com múltiplas abordagens, como Psicanálise, Junguiana, Abordagem Centrada na Pessoa, Comportamental, Neuropsicologia, entre outras. Isso permite diversidade teórica e maior adequação às necessidades de cada paciente e estudante.",
      },
      {
        q: "O atendimento é online ou presencial?",
        a: "Oferecemos atendimento online para todo o Brasil e atendimento presencial em Belo Horizonte, na Rua Rio Negro, 1048 – Barroca.",
      },
    ],
  },
  {
    label: "Estágios",
    items: [
      {
        q: "Como faço para conseguir estágio na Allos?",
        a: (
          <>
            O processo seletivo para estágio em psicologia clínica está detalhado em:{" "}
            <a
              href="https://allos.org.br/processoseletivopsi/"
              target="_blank"
              rel="noreferrer"
              className="text-[#C84B31] font-semibold hover:underline"
            >
              allos.org.br/processoseletivopsi
            </a>
          </>
        ),
      },
      {
        q: "A Allos pode permitir legalmente que estagiários atendam?",
        a: "Sim. A Allos e seus supervisores clínicos possuem registro no Conselho Regional de Psicologia. O atendimento realizado por graduandos segue integralmente as normas legais e éticas vigentes.",
      },
      {
        q: "Como funciona a bolsa de estágio?",
        a: "A bolsa base para estagiários de Psicologia e Nutrição Clínica é de R$ 500,00, com vale-transporte para atividades presenciais. O valor pode aumentar conforme ampliação da carga de pacientes ou atuação em funções institucionais adicionais.",
      },
      {
        q: "A supervisão é gratuita?",
        a: "Sim. A supervisão clínica é obrigatória, exclusiva para estagiários da Allos e oferecida gratuitamente.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <NavBar />
      <main id="main-content">
        {/* 1. ESCURO — hero */}
        <HeroFaq />

        {/* 2. ESCURO com leve textura — conteúdo FAQ */}
        <section
          className="py-20 md:py-28 px-6 md:px-10"
          style={{
            background:
              "radial-gradient(ellipse at 5% 0%, rgba(200,75,49,0.04) 0%, transparent 50%), #161616",
          }}
        >
          <div className="max-w-[860px] mx-auto">
            <FaqAccordion groups={faqData} />
          </div>
        </section>

        {/* 3. ESCURO — CTA */}
        <FaqCTA />
      </main>
      <Footer />
    </>
  );
}
