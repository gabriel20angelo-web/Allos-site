"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const DOT_GRID = {
  backgroundImage: "radial-gradient(circle, rgba(200,75,49,0.06) 1px, transparent 1px)",
  backgroundSize: "32px 32px",
};

const IcoGraduate = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C84B31" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);
const IcoHeart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C84B31" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const IcoBuilding = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C84B31" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>
  </svg>
);
const IcoCheck = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" stroke="#C84B31" strokeWidth="1.5"/>
    <path d="M8 12l3 3 5-5" stroke="#C84B31" strokeWidth="2"/>
  </svg>
);

function ContentCard({ index, label, title, paragraphs, icon }: {
  index: number; label: string; title: string; paragraphs: string[]; icon: React.ReactNode;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reversed = index % 2 === 1;
  const num = String(index + 1).padStart(2, "0");
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.1, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: "rgba(253,251,247,0.025)",
        borderTop: "1px solid rgba(253,251,247,0.07)",
        borderRight: "1px solid rgba(253,251,247,0.07)",
        borderBottom: "1px solid rgba(253,251,247,0.07)",
        borderLeft: reversed ? "3px solid rgba(200,75,49,0.5)" : "1px solid rgba(253,251,247,0.07)",
      }}>
      <div className="absolute top-2 right-5 font-fraunces font-bold pointer-events-none select-none"
        style={{ fontSize: "118px", color: "rgba(200,75,49,0.055)", lineHeight: 1, zIndex: 0 }}>
        {num}
      </div>
      <div className={"relative z-10 flex flex-col " + (reversed ? "md:flex-row-reverse" : "md:flex-row")}>
        <div className="md:w-5/12 p-8 md:p-10 flex flex-col justify-center"
          style={{
            borderRight: reversed ? undefined : "1px solid rgba(253,251,247,0.05)",
            borderLeft: reversed ? "1px solid rgba(253,251,247,0.05)" : undefined,
          }}>
          <motion.div className="inline-flex items-center justify-center w-11 h-11 rounded-xl mb-6"
            style={{ background: "rgba(200,75,49,.1)", border: "1px solid rgba(200,75,49,.2)" }}
            whileHover={{ y: -2 }} transition={{ duration: 0.25 }}>
            {icon}
          </motion.div>
          <span className="font-dm font-semibold text-xs tracking-widest text-[#C84B31] uppercase mb-1 pb-2 inline-block"
            style={{ borderBottom: "2px solid rgba(200,75,49,0.4)" }}>
            {label}
          </span>
          <h3 className="font-fraunces font-bold text-[#FDFBF7] leading-snug mt-4"
            style={{ fontSize: "clamp(18px,2.2vw,23px)", letterSpacing: "-0.02em" }}>
            {title}
          </h3>
        </div>
        <div className="md:w-7/12 p-8 md:p-10 flex flex-col justify-center">
          {paragraphs.map((p, i) => (
            <p key={i} className="font-dm leading-relaxed mb-4 last:mb-0"
              style={{ fontSize: "15px", color: "rgba(253,251,247,0.55)" }}>{p}</p>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ExcelenciaSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const diferenciais = [
    "Supervisão por psicólogos sênores",
    "Múltiplas abordagens teóricas",
    "Acompanhamento de casos em tempo real",
    "Seleção rigorosa de terapeutas",
  ];
  const tags = ["Supervisão contínua","Diversidade teórica","Ética profissional","Compromisso social"];
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-3xl overflow-hidden flex flex-col md:flex-row"
      style={{ border: "1px solid rgba(200,75,49,0.2)", minHeight: "400px" }}>
      <div className="md:w-1/2 relative p-10 md:p-14 flex flex-col justify-center"
        style={{ background: "rgba(200,75,49,.07)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 60% at 20% 50%,rgba(200,75,49,.1) 0%,transparent 70%)" }} />
        <div className="absolute inset-0 pointer-events-none opacity-[.025]" style={{ backgroundImage: GRAIN }} />
        <div className="relative z-10">
          <span className="font-dm font-semibold text-xs tracking-widest text-[#C84B31] uppercase mb-1 pb-2 inline-block"
            style={{ borderBottom: "2px solid rgba(200,75,49,0.4)" }}>
            Princípio Fundador
          </span>
          <h2 className="font-fraunces font-bold text-[#FDFBF7] leading-tight mt-4 mb-7"
            style={{ fontSize: "clamp(22px,3vw,36px)", letterSpacing: "-0.02em" }}>
            Excelência Clínica <span className="italic text-[#C84B31]">como princípio</span>
          </h2>
          <div className="space-y-4 font-dm leading-relaxed mb-8"
            style={{ fontSize: "clamp(14px,1.4vw,15px)", color: "rgba(253,251,247,0.65)" }}>
            <p>Investimos continuamente na formação técnica, ética e humana de nossos psicoterapeutas. Esse compromisso sustenta uma prática clínica <strong className="text-[#FDFBF7]">honesta, atualizada e sensível</strong> às transformações sociais.</p>
            <p>A Associação Allos consolida-se como referência em projetos clínicos que promovem saúde mental e <strong className="text-[#FDFBF7]">ambientes mais saudáveis</strong> em empresas, instituições e políticas públicas.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <motion.span key={t}
                className="font-dm text-xs px-3 py-1.5 rounded-full cursor-default"
                style={{ background: "rgba(200,75,49,.1)", border: "1px solid rgba(200,75,49,.2)", color: "rgba(253,251,247,0.6)" }}
                whileHover={{ backgroundColor: "rgba(200,75,49,.18)", borderColor: "rgba(200,75,49,.45)", color: "rgba(253,251,247,0.9)" }}>
                {t}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
      <div className="md:w-1/2 p-10 md:p-14 flex flex-col justify-center"
        style={{ background: "rgba(253,251,247,0.018)", borderLeft: "1px solid rgba(200,75,49,0.15)" }}>
        <p className="font-dm font-semibold text-xs tracking-widest uppercase mb-8"
          style={{ color: "rgba(253,251,247,0.3)" }}>
          Por que escolher a Allos
        </p>
        <div className="space-y-5">
          {diferenciais.map((d, i) => (
            <motion.div key={d}
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "rgba(200,75,49,.08)", border: "1px solid rgba(200,75,49,.2)" }}>
                <IcoCheck />
              </div>
              <p className="font-dm font-medium"
                style={{ fontSize: "15px", color: "rgba(253,251,247,0.7)", letterSpacing: "-0.01em" }}>
                {d}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function Metric({ value, label, sublabel, delay = 0 }: {
  value: string; label: string; sublabel: string; delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="text-center flex flex-col items-center">
      <div className="w-14 h-0.5 mb-5 rounded-full overflow-hidden"
        style={{ background: "rgba(253,251,247,0.08)" }}>
        <motion.div className="h-full rounded-full bg-[#C84B31]"
          initial={{ width: "0%" }}
          animate={inView ? { width: "100%" } : {}}
          transition={{ delay: delay + 0.2, duration: 1.2, ease: [0.22, 1, 0.36, 1] }} />
      </div>
      <motion.p className="font-fraunces font-bold text-[#C84B31] leading-none mb-3"
        style={{ fontSize: "clamp(48px,6vw,72px)", letterSpacing: "-0.03em" }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: delay + 0.1, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}>
        {value}
      </motion.p>
      <p className="font-dm font-medium mb-1"
        style={{ fontSize: "14px", color: "rgba(253,251,247,0.6)", maxWidth: "160px" }}>{label}</p>
      <p className="font-dm"
        style={{ fontSize: "11px", color: "rgba(253,251,247,0.3)", maxWidth: "150px" }}>{sublabel}</p>
    </motion.div>
  );
}

function ClinicaCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section ref={ref} className="relative py-32 px-6 md:px-10 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #1A1A1A 0%, #0F0F0F 100%)" }}>
      <div className="absolute inset-0 pointer-events-none opacity-[.025]" style={{ backgroundImage: GRAIN }} />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[280px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at bottom,rgba(200,75,49,.12) 0%,transparent 70%)" }} />
      <div className="relative z-10 max-w-[680px] mx-auto text-center">
        <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={inView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 0.7 }}
          className="flex items-center justify-center gap-3 mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-[#C84B31] opacity-50" />
          <div className="h-px w-12 bg-[#C84B31] opacity-20" />
          <div className="w-2 h-2 rounded-full bg-[#C84B31]" />
          <div className="h-px w-12 bg-[#C84B31] opacity-20" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#C84B31] opacity-50" />
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-fraunces font-bold text-[#FDFBF7] leading-tight mb-5"
          style={{ fontSize: "clamp(32px,5vw,60px)", letterSpacing: "-0.03em" }}>
          Agende seu <span className="italic text-[#C84B31]">atendimento</span>
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.22, duration: 0.6 }}
          className="font-dm leading-relaxed mb-10"
          style={{ fontSize: "clamp(15px,1.6vw,17px)", color: "rgba(253,251,247,0.45)" }}>
          O cuidado psicológico na Allos é pensado a partir da realidade de cada pessoa, oferecendo escuta qualificada, acompanhamento responsável e respeito à singularidade de cada história.
        </motion.p>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.5 }}>
          <motion.a href="https://bit.ly/terapiasite" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 font-dm font-semibold text-white bg-[#C84B31] rounded-full"
            style={{ padding: "17px 52px", fontSize: "15px" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            animate={{ boxShadow: ["0 0 0 0px rgba(200,75,49,0.5)","0 0 0 14px rgba(200,75,49,0)","0 0 0 0px rgba(200,75,49,0)"] }}
            transition={{ boxShadow: { duration: 2.2, repeat: Infinity, ease: "easeOut" } }}>
            Agendar Sessão
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.a>
        </motion.div>
        {/* Subtle FAQ reference */}
        <p className="font-dm text-[12px] mt-8" style={{ color: "rgba(253,251,247,0.25)" }}>
          Dúvidas sobre a clínica?{" "}
          <Link href="/faq" className="text-[rgba(253,251,247,0.4)] hover:text-[#C84B31] transition-colors underline" style={{ textUnderlineOffset: "3px" }}>
            Consulte nosso FAQ
          </Link>
        </p>
      </div>
    </section>
  );
}

function ServiceCards() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const services = [
    {
      href: "/clinica/psicoterapia",
      title: "Psicoterapia",
      subtitle: "de verdade",
      desc: "Terapeutas selecionados por competência, supervisão obrigatória e atendimento 100% online com valores acessíveis.",
      cta: "Conhecer a psicoterapia",
      color: "#2E9E8F",
    },
    {
      href: "/clinica/avaliacao-neuropsicologica",
      title: "Avaliação",
      subtitle: "Neuropsicológica",
      desc: "Avaliação com rigor técnico e atendimento humanizado. Diagnósticos precisos para orientar o melhor caminho de tratamento.",
      cta: "Conhecer a avaliação",
      color: "#C84B31",
    },
  ];
  return (
    <section ref={ref} className="relative py-20 px-6 md:px-10" style={{ background: "#1A1A1A" }}>
      <div className="absolute inset-0 pointer-events-none opacity-[.025]" style={{ backgroundImage: GRAIN }} />
      <div className="relative z-10 max-w-[1200px] mx-auto">
        <motion.p initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="font-dm leading-relaxed max-w-[680px] mb-14"
          style={{ fontSize: "clamp(16px,1.8vw,19px)", color: "rgba(253,251,247,0.55)" }}>
          A Associação Allos mantém um compromisso rigoroso com a excelência clínica, a ética profissional e o cuidado responsável em saúde mental, integrando prática supervisionada, diversidade teórica e compromisso social.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1 max-w-[64px]"
            style={{ background: "linear-gradient(to right,transparent,rgba(200,75,49,0.5))" }} />
          <p className="font-dm font-semibold text-xs tracking-widest text-[#C84B31] uppercase">Nossos Serviços</p>
          <div className="h-px flex-1"
            style={{ background: "linear-gradient(to right,rgba(200,75,49,0.5),transparent)" }} />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}>
              <Link href={s.href} className="block group">
                <div className="relative rounded-2xl overflow-hidden p-10 md:p-12 transition-transform duration-300 group-hover:-translate-y-1"
                  style={{
                    background: "rgba(253,251,247,0.025)",
                    border: `1px solid rgba(253,251,247,0.07)`,
                    borderLeft: `3px solid ${s.color}`,
                    minHeight: 280,
                  }}>
                  <div className="absolute top-4 right-6 font-fraunces font-bold pointer-events-none select-none"
                    style={{ fontSize: "100px", color: `${s.color}10`, lineHeight: 1, zIndex: 0 }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="relative z-10">
                    <h3 className="font-fraunces font-bold text-[#FDFBF7] leading-tight mb-1"
                      style={{ fontSize: "clamp(24px,3vw,36px)" }}>
                      {s.title}
                    </h3>
                    <h3 className="font-fraunces font-bold italic leading-tight mb-6"
                      style={{ fontSize: "clamp(24px,3vw,36px)", color: s.color }}>
                      {s.subtitle}
                    </h3>
                    <p className="font-dm leading-relaxed mb-8"
                      style={{ fontSize: "15px", color: "rgba(253,251,247,0.55)", maxWidth: 420 }}>
                      {s.desc}
                    </p>
                    <span className="inline-flex items-center gap-2 font-dm font-semibold text-sm transition-colors"
                      style={{ color: s.color }}>
                      {s.cta}
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ClinicaContent() {
  const introRef = useRef(null);
  const introInView = useInView(introRef, { once: true, margin: "-40px" });
  const cards = [
    {
      label: "Formação", title: "Clínica Escola e Formação Supervisionada", icon: <IcoGraduate />,
      paragraphs: [
        "Os atendimentos são realizados por terapeutas em formação avançada, supervisionados por profissionais experientes e registrados nos conselhos competentes — garantindo cuidado clínico atento, fundamentado cientificamente e alinhado às melhores práticas da psicologia.",
        "A clínica funciona como espaço de aprendizado contínuo, onde teoria e prática se articulam de forma ética, reflexiva e comprometida com a singularidade de cada pessoa atendida.",
      ],
    },
    {
      label: "Acessibilidade", title: "Atendimento Clínico Acessível e Responsável", icon: <IcoHeart />,
      paragraphs: [
        "A Allos oferece atendimentos psicológicos a valores sociais, mantendo padrão técnico rigoroso e acompanhamento constante dos casos. O objetivo é ampliar o acesso ao cuidado em saúde mental sem comprometer a qualidade clínica.",
        "Atuamos com diferentes abordagens psicoterapeúticas, possibilitando que cada paciente seja acolhido de acordo com suas demandas, contexto e necessidades subjetivas.",
      ],
    },
    {
      label: "Institucional", title: "Projetos Clínicos e Atuação Institucional", icon: <IcoBuilding />,
      paragraphs: [
        "Para além do consultório tradicional, a Allos desenvolve projetos clínicos em contextos diversos: instituições privadas, prefeituras, residências terapêuticas, organizações sociais e ambientes que demandam atenção psicológica qualificada.",
        "Esses projetos refletem nossa visão de uma psicologia que ultrapassa muros, alcança territórios negligenciados e atua de forma ética diante das urgências contemporâneas em saúde mental.",
      ],
    },
  ];
  const metrics = [
    { value: "200+", label: "pacientes em atendimento ativo", sublabel: "em acompanhamento este mês" },
    { value: "80+", label: "terapeutas associados", sublabel: "distribuídos em todo o Brasil" },
    { value: "2/3", label: "dos atendimentos chegam", sublabel: "por indicação de pacientes" },
  ];
  return (
    <>
      <ServiceCards />
      <section className="relative py-4 pb-16 px-6 md:px-10" style={{ background: "#1A1A1A" }}>
        <div className="absolute inset-0 pointer-events-none opacity-[.025]" style={{ backgroundImage: GRAIN }} />
        <div className="relative z-10 max-w-[1200px] mx-auto space-y-6">
          {cards.map((c, i) => <ContentCard key={i} index={i} {...c} />)}
        </div>
      </section>
      <section className="relative py-6 pb-20 px-6 md:px-10" style={{ background: "#1A1A1A" }}>
        <div className="relative z-10 max-w-[1200px] mx-auto">
          <ExcelenciaSection />
        </div>
      </section>
      <section className="relative py-28 px-6 md:px-10"
        style={{ background: "linear-gradient(to bottom, #1A1A1A, #141414)" }}>
        <div className="absolute inset-0 pointer-events-none" style={DOT_GRID} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(26,26,26,0) 0%, #1A1A1A 80%)" }} />
        <div className="relative z-10 max-w-[1200px] mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.6 }} className="flex items-center gap-4 mb-20">
            <div className="h-px flex-1 max-w-[64px]"
              style={{ background: "linear-gradient(to right,transparent,rgba(200,75,49,0.5))" }} />
            <p className="font-dm font-semibold text-xs tracking-widest text-[#C84B31] uppercase">Números da Clínica</p>
            <div className="h-px flex-1"
              style={{ background: "linear-gradient(to right,rgba(200,75,49,0.5),transparent)" }} />
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-16 gap-x-8">
            {metrics.map((m, i) => <Metric key={m.value} {...m} delay={i * 0.15} />)}
          </div>
        </div>
      </section>
      <ClinicaCTA />
    </>
  );
}
