"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

function Section({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.section>
  );
}

/* ═══════ O QUE INVESTIGAMOS ═══════ */
function Investigamos() {
  const domains = [
    {
      title: "Memória",
      desc: "Retenção, evocação e reconhecimento de informações",
      color: "#1A7A6D",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A7A6D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
        </svg>
      ),
    },
    {
      title: "Atenção",
      desc: "Sustentada, dividida, alternada e seletiva",
      color: "#E8963E",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E8963E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      title: "Raciocínio",
      desc: "Lógico, abstrato, verbal e perceptual",
      color: "#2E75B6",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2E75B6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        </svg>
      ),
    },
    {
      title: "Emoções",
      desc: "Regulação emocional e comportamento",
      color: "#8B5CF6",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
      ),
    },
  ];

  return (
    <Section className="relative py-24 px-6 md:px-10" style={{ background: "#F5F0E8" }}>
      <div className="max-w-[1100px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <div>
            <p className="font-dm font-semibold text-xs tracking-[.2em] uppercase mb-3" style={{ color: "#1A7A6D" }}>
              O que investigamos
            </p>
            <h2 className="font-fraunces font-bold leading-tight mb-6" style={{ fontSize: "clamp(24px,4vw,42px)", color: "#1A1A1A" }}>
              Um mapeamento completo do funcionamento cognitivo
            </h2>
            <div className="space-y-5 font-dm" style={{ fontSize: "16px", color: "#5C5C5C" }}>
              <p>
                A avaliação neuropsicológica é um processo detalhado onde investigamos as <strong className="text-[#1A1A1A]">funções cognitivas</strong>, como memória, atenção e raciocínio, além de aspectos <strong className="text-[#1A1A1A]">emocionais</strong> e <strong className="text-[#1A1A1A]">comportamentais</strong>.
              </p>
              <p>
                O objetivo é adquirir dados concretos para auxiliar em <strong className="text-[#1A1A1A]">diagnósticos precisos</strong>, estabelecendo uma orientação mais eficaz para o tratamento.
              </p>
            </div>
            <div className="mt-6 rounded-r-xl p-6" style={{ background: "#FDFBF7", borderLeft: "4px solid #1A7A6D" }}>
              <p className="font-fraunces italic text-lg" style={{ color: "#1A1A1A", lineHeight: 1.5 }}>
                &ldquo;Cada protocolo é desenhado especificamente para a demanda do paciente. Não existe avaliação genérica.&rdquo;
              </p>
            </div>
          </div>

          {/* Right: domain cards */}
          <div className="grid grid-cols-2 gap-4">
            {domains.map((d, i) => (
              <motion.div
                key={i}
                className="relative bg-[#FDFBF7] rounded-2xl p-6 text-center overflow-hidden"
                style={{ border: "1px solid #E0DDD5" }}
                whileHover={{ y: -4, boxShadow: "0 10px 28px rgba(0,0,0,0.07)" }}
              >
                <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: d.color }} />
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: `${d.color}14` }}>
                  {d.icon}
                </div>
                <h4 className="font-fraunces font-semibold text-base mb-1" style={{ color: "#1A1A1A" }}>{d.title}</h4>
                <p className="font-dm text-xs" style={{ color: "#5C5C5C", lineHeight: 1.5 }}>{d.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ═══════ POR QUE A ALLOS (dark) ═══════ */
function WhyAllos() {
  const cards = [
    {
      title: "Diagnóstico Preciso",
      desc: "Identificamos as causas reais dos sintomas, permitindo o início imediato de intervenções adequadas, otimizando o tempo e evitando tratamentos desnecessários.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E8963E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
    },
    {
      title: "Plano de Recomendações",
      desc: "Oferecemos recomendações específicas que orientam o trabalho de outros profissionais, como médicos, fonoaudiólogos, psicólogos e pedagogos.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E8963E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
    },
    {
      title: "Orientação Prática",
      desc: "Fornecemos orientações práticas para o contexto escolar, acadêmico ou profissional, visando a redução de prejuízos e o aumento do desempenho.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E8963E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
        </svg>
      ),
    },
  ];

  return (
    <Section
      className="relative py-24 px-6 md:px-10 overflow-hidden"
      style={{ background: "#082925", color: "#FDFBF7" }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 0% 100%, rgba(232,150,62,0.08) 0%, transparent 50%), radial-gradient(ellipse at 100% 0%, rgba(26,122,109,0.12) 0%, transparent 50%)",
      }} />
      <div className="relative z-10 max-w-[1100px] mx-auto">
        <p className="font-dm font-semibold text-xs tracking-[.2em] uppercase mb-3" style={{ color: "#E8963E" }}>
          Por que realizar na Allos?
        </p>
        <h2 className="font-fraunces font-bold leading-tight mb-12" style={{ fontSize: "clamp(28px,4.5vw,48px)" }}>
          Resultados que <em className="italic font-medium" style={{ color: "#E8963E" }}>orientam</em>, não apenas descrevem
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <motion.div
              key={i}
              className="rounded-2xl p-8"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.3)" }}
            >
              <div className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center mb-5" style={{ background: "rgba(232,150,62,0.12)" }}>
                {c.icon}
              </div>
              <h3 className="font-fraunces font-semibold text-lg mb-3" style={{ color: "#E8963E" }}>{c.title}</h3>
              <p className="font-dm text-[15px] leading-relaxed opacity-80">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ═══════ DIFERENCIAIS ═══════ */
function Diferenciais() {
  const diffs = [
    {
      title: "Atendimento Personalizado",
      desc: "Protocolos de investigação desenhados especificamente para cada demanda. Nenhuma avaliação é idêntica à outra.",
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1A7A6D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="8.5" cy="7" r="4" /><path d="M20 8v6M23 11h-6" />
        </svg>
      ),
    },
    {
      title: "Expertise Multidisciplinar",
      desc: "Avaliação especializada em todo o espectro do neurodesenvolvimento e saúde mental: TDAH, TEA, Depressão, Ansiedade, Dificuldades de Aprendizagem, Personalidade, Bipolaridade e mais.",
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1A7A6D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
        </svg>
      ),
    },
    {
      title: "Rigor Técnico",
      desc: "Aplicação de instrumentos validados (testes, escalas e inventários) para medir as funções cognitivas e investigar o comportamento e emoções com precisão.",
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1A7A6D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
    {
      title: "Transparência Total",
      desc: "Você participa de cada etapa, entendendo não apenas os resultados, mas o raciocínio por trás de cada conclusão clínica.",
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1A7A6D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
  ];

  return (
    <Section className="relative py-24 px-6 md:px-10" style={{ background: "#FDFBF7" }}>
      <div className="max-w-[1100px] mx-auto">
        <p className="font-dm font-semibold text-xs tracking-[.2em] uppercase mb-3" style={{ color: "#1A7A6D" }}>
          Nossos diferenciais
        </p>
        <h2 className="font-fraunces font-bold leading-tight mb-4" style={{ fontSize: "clamp(28px,4.5vw,48px)", color: "#1A1A1A" }}>
          Excelência em cada etapa da avaliação
        </h2>
        <p className="font-dm mb-12" style={{ fontSize: "17px", color: "#5C5C5C", maxWidth: 700 }}>
          Combinamos rigor científico com atenção individualizada para entregar resultados que realmente fazem diferença na vida do paciente.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {diffs.map((d, i) => (
            <motion.div
              key={i}
              className="relative rounded-2xl p-8 overflow-hidden"
              style={{ background: "#F5F0E8", border: "1px solid #E0DDD5" }}
              whileHover={{ y: -3, boxShadow: "0 10px 24px rgba(0,0,0,0.06)" }}
            >
              <div className="mb-3">{d.icon}</div>
              <h4 className="font-fraunces font-semibold text-lg mb-2" style={{ color: "#1A1A1A" }}>{d.title}</h4>
              <p className="font-dm text-[15px] leading-relaxed" style={{ color: "#5C5C5C" }}>{d.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ═══════ PROCEDIMENTOS (teal timeline) ═══════ */
function Procedimentos() {
  const steps = [
    { n: 1, title: "Entrevista / Anamnese", desc: "Levantamento detalhado do histórico de desenvolvimento, queixas e demandas do paciente." },
    { n: 2, title: "Testagem", desc: "Aplicação de instrumentos (testes, escalas e inventários) específicos para cada demanda." },
    { n: 3, title: "Análise de Dados", desc: "Mensuração quantitativa e qualitativa dos resultados, além de entrevistas externas quando necessário." },
    { n: 4, title: "Entrega do Laudo", desc: "Relatório com todos os resultados interpretados, sugestões de tratamento e esclarecimento de dúvidas." },
  ];

  return (
    <Section
      className="relative py-24 px-6 md:px-10 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #1A7A6D 0%, #0D3B36 100%)", color: "white" }}
    >
      <div className="absolute inset-0 pointer-events-none opacity-[.06]" style={{ backgroundImage: GRAIN }} />
      <div className="relative z-10 max-w-[1100px] mx-auto">
        <p className="font-dm font-semibold text-xs tracking-[.2em] uppercase mb-3" style={{ color: "#E8963E" }}>
          Como funciona
        </p>
        <h2 className="font-fraunces font-bold leading-tight mb-4" style={{ fontSize: "clamp(28px,4.5vw,48px)" }}>
          Procedimentos da avaliação
        </h2>
        <p className="font-dm mb-12" style={{ fontSize: "17px", color: "rgba(255,255,255,0.7)", maxWidth: 700 }}>
          Um processo estruturado em quatro etapas, do primeiro contato até a entrega do laudo completo.
        </p>
        <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          <div className="hidden md:block absolute top-9 left-[12.5%] right-[12.5%] h-0.5" style={{ background: "rgba(255,255,255,0.15)" }} />
          {steps.map((s) => (
            <div key={s.n} className="text-center relative px-4 mb-10 md:mb-0">
              <div
                className="w-[72px] h-[72px] rounded-full flex items-center justify-center mx-auto mb-5 relative z-10"
                style={{ background: "rgba(255,255,255,0.08)", border: "2px solid rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}
              >
                <span className="font-fraunces text-2xl font-bold" style={{ color: "#E8963E" }}>{s.n}</span>
              </div>
              <h4 className="font-fraunces font-semibold text-lg mb-2">{s.title}</h4>
              <p className="font-dm text-sm opacity-75 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ═══════ EQUIPE ═══════ */
function Equipe() {
  const team = [
    {
      initials: "AS",
      name: "Amanda Soares Alves",
      role: "Diretora do Núcleo",
      creds: [
        "Psicóloga pela PUC Minas — CRP 04/84772",
        "Atua com avaliação neuropsicológica de crianças, adolescentes e adultos desde 2023",
        "Monitora no LEAPS — PUC Minas",
        "Duas iniciações científicas em avaliação neuropsicológica — CTMM/UFMG",
      ],
    },
    {
      initials: "JG",
      name: "Julia Mattos Goulart",
      role: "Equipe de Avaliação",
      creds: [
        "Graduada em Psicologia pela PUC Minas",
        "Monitora do LEPAP — PUC Minas",
        "Monitora de Psicodiagnóstico — PUC Minas",
        "Participante da normatização da Escala RIAS-2",
      ],
    },
    {
      initials: "VR",
      name: "Victoria Braga Resende",
      role: "Equipe de Avaliação",
      creds: [
        "Graduanda de Psicologia pela UNA",
        "Coordenadora da Família Temática de Neuropsicologia — UNA",
        "Ligante da LIAP — UFMG",
        "Iniciação Científica no LND — UFMG",
      ],
    },
  ];

  return (
    <Section className="relative py-24 px-6 md:px-10" style={{ background: "#F5F0E8" }}>
      <div className="max-w-[1100px] mx-auto">
        <p className="font-dm font-semibold text-xs tracking-[.2em] uppercase mb-3" style={{ color: "#1A7A6D" }}>
          Conheça nossa equipe
        </p>
        <h2 className="font-fraunces font-bold leading-tight mb-4" style={{ fontSize: "clamp(28px,4.5vw,48px)", color: "#1A1A1A" }}>
          Profissionais dedicadas à neuropsicologia
        </h2>
        <p className="font-dm mb-12" style={{ fontSize: "17px", color: "#5C5C5C", maxWidth: 700 }}>
          Formação acadêmica sólida, experiência em pesquisa e compromisso com a excelência clínica.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {team.map((t) => (
            <motion.div
              key={t.initials}
              className="relative bg-[#FDFBF7] rounded-[20px] p-10 pt-10 text-center overflow-hidden"
              style={{ border: "1px solid #E0DDD5" }}
              whileHover={{ y: -6, boxShadow: "0 16px 40px rgba(0,0,0,0.08)" }}
            >
              <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: "#1A7A6D" }} />
              <div
                className="w-[88px] h-[88px] rounded-full flex items-center justify-center mx-auto mb-5 font-fraunces text-2xl font-bold text-white"
                style={{ background: "linear-gradient(135deg, #1A7A6D, #2CA89A)" }}
              >
                {t.initials}
              </div>
              <h4 className="font-fraunces font-semibold text-lg mb-1" style={{ color: "#1A1A1A" }}>{t.name}</h4>
              <p className="font-dm font-semibold text-xs uppercase tracking-wider mb-4" style={{ color: "#1A7A6D" }}>{t.role}</p>
              <ul className="text-left space-y-2 pt-4" style={{ borderTop: "1px solid #E0DDD5" }}>
                {t.creds.map((c, i) => (
                  <li key={i} className="flex items-start gap-2.5 font-dm text-sm" style={{ color: "#5C5C5C", lineHeight: 1.4 }}>
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={{ background: "#1A7A6D" }} />
                    {c}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ═══════ INVESTIMENTO ═══════ */
function Investimento() {
  return (
    <Section className="relative py-24 px-6 md:px-10" style={{ background: "#FDFBF7" }}>
      <div className="max-w-[1100px] mx-auto">
        <p className="font-dm font-semibold text-xs tracking-[.2em] uppercase mb-3" style={{ color: "#1A7A6D" }}>
          Investimento
        </p>
        <h2 className="font-fraunces font-bold leading-tight mb-12" style={{ fontSize: "clamp(28px,4.5vw,48px)", color: "#1A1A1A" }}>
          Acessível e com facilidades de pagamento
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Price card */}
          <div className="bg-[#F5F0E8] rounded-3xl p-12 text-center" style={{ border: "2px solid #1A7A6D" }}>
            <p className="font-dm font-semibold text-xs tracking-[.2em] uppercase mb-2" style={{ color: "#1A7A6D" }}>
              Avaliação Neuropsicológica Completa
            </p>
            <p className="font-fraunces font-bold leading-none mb-0" style={{ fontSize: "4rem", color: "#1A7A6D" }}>
              R$ 1.000<span className="text-base font-normal" style={{ color: "#5C5C5C" }}>,00</span>
            </p>
            <div className="w-[60px] h-0.5 mx-auto my-6" style={{ background: "#E0DDD5" }} />
            <ul className="space-y-3">
              <li className="flex items-center justify-center gap-2 font-dm text-[15px]" style={{ color: "#5C5C5C" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A7A6D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                PIX à vista: R$ 950 <span className="font-semibold text-sm" style={{ color: "#1A7A6D" }}>(5% de desconto)</span>
              </li>
              <li className="flex items-center justify-center gap-2 font-dm text-[15px]" style={{ color: "#5C5C5C" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A7A6D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Até 4x de R$ 250 no cartão
              </li>
            </ul>
          </div>

          {/* Modalities */}
          <div className="flex flex-col gap-5">
            <h3 className="font-fraunces font-semibold text-xl mb-1" style={{ color: "#1A1A1A" }}>
              Modalidades de Atendimento
            </h3>
            {[
              {
                title: "Atendimento Presencial",
                desc: "Realizado em consultório na Associação Allos, em espaço planejado para garantir foco e privacidade na aplicação dos testes e entrevistas.",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A7A6D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                ),
              },
              {
                title: "Atendimento Online",
                desc: "Ofertado por meio de plataformas de videoconferência, garantindo sigilo profissional e segurança das informações.",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A7A6D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                ),
              },
            ].map((m, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-5 rounded-2xl p-6 bg-[#F5F0E8]"
                style={{ border: "1px solid #E0DDD5" }}
                whileHover={{ y: -3, boxShadow: "0 8px 20px rgba(0,0,0,0.06)" }}
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(26,122,109,0.08)" }}>
                  {m.icon}
                </div>
                <div>
                  <h4 className="font-fraunces font-semibold text-base mb-1" style={{ color: "#1A1A1A" }}>{m.title}</h4>
                  <p className="font-dm text-sm" style={{ color: "#5C5C5C", lineHeight: 1.5 }}>{m.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ═══════ CTA ═══════ */
function CtaSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section
      ref={ref}
      className="relative py-28 px-6 md:px-10 text-center"
      style={{
        background: "radial-gradient(ellipse at 30% 50%, rgba(26,122,109,0.06) 0%, transparent 50%), radial-gradient(ellipse at 70% 50%, rgba(232,150,62,0.04) 0%, transparent 50%), #FDFBF7",
      }}
    >
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="font-fraunces font-bold leading-tight mb-4 mx-auto"
        style={{ fontSize: "clamp(28px,5vw,48px)", color: "#1A1A1A", maxWidth: 700 }}
      >
        Pronto para dar o <em className="italic font-medium" style={{ color: "#1A7A6D" }}>próximo passo</em>?
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="font-dm mx-auto mb-10"
        style={{ fontSize: "17px", color: "#5C5C5C", maxWidth: 620 }}
      >
        Entre em contato com a equipe do Núcleo de Avaliação Neuropsicológica da Allos. Estamos prontos para acolher você.
      </motion.p>
      <motion.a
        href="https://wa.me/5524998503894"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 font-dm font-semibold text-white rounded-full"
        style={{ background: "#1A7A6D", padding: "18px 40px", fontSize: "17px", boxShadow: "0 4px 20px rgba(26,122,109,0.3)" }}
        whileHover={{ y: -2, boxShadow: "0 8px 28px rgba(26,122,109,0.4)" }}
        whileTap={{ scale: 0.97 }}
      >
        Falar pelo WhatsApp
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </motion.a>
    </section>
  );
}

/* ═══════ MAIN EXPORT ═══════ */
export default function AvaliacaoNeuroContent() {
  return (
    <>
      <Investigamos />
      <WhyAllos />
      <Diferenciais />
      <Procedimentos />
      <Equipe />
      <Investimento />
      <CtaSection />
    </>
  );
}
