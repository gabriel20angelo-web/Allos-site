"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

/* ─── Animated section wrapper ─── */
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

/* ═══════ SOCIAL PROOF ═══════ */
function SocialProof() {
  const proofs = [
    { value: "9,4", label: "Nota de Satisfação", detail: "Média atribuída pelos pacientes em pesquisa contínua de qualidade (NPS)", color: "#1A7A6D" },
    { value: "4,9", label: "Nota no Google", detail: "Mais de 122 avaliações públicas de pacientes e familiares", color: "#E8963E" },
    { value: "300+", label: "Pacientes Ativos", detail: "Em acompanhamento terapêutico contínuo neste momento", color: "#8B5CF6" },
  ];
  return (
    <Section className="relative py-24 px-6 md:px-10" style={{ background: "#F5F0E8" }}>
      <div className="max-w-[1100px] mx-auto">
        <p className="font-dm font-semibold text-xs tracking-[.2em] uppercase mb-3" style={{ color: "#1A7A6D" }}>
          Nossos resultados
        </p>
        <h2 className="font-fraunces font-bold leading-tight mb-4" style={{ fontSize: "clamp(28px,4.5vw,48px)", color: "#1A1A1A" }}>
          A qualidade que nossos pacientes confirmam
        </h2>
        <p className="font-dm mb-12" style={{ fontSize: "17px", color: "#5C5C5C", maxWidth: 700 }}>
          Números que não são promessas, e sim o reflexo de um compromisso diário com cada pessoa que confia no nosso trabalho.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {proofs.map((p) => (
            <motion.div
              key={p.value}
              className="relative bg-[#FDFBF7] rounded-[20px] p-9 text-center overflow-hidden"
              style={{ border: "1px solid #E0DDD5" }}
              whileHover={{ y: -4, boxShadow: "0 10px 28px rgba(0,0,0,0.07)" }}
            >
              <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: p.color }} />
              <p className="font-fraunces font-bold leading-none mb-1" style={{ fontSize: "3rem", color: p.color }}>
                {p.value}
              </p>
              <p className="font-dm font-semibold text-sm uppercase tracking-wide mb-1" style={{ color: "#1A1A1A" }}>
                {p.label}
              </p>
              <p className="font-dm text-sm" style={{ color: "#5C5C5C", lineHeight: 1.4 }}>{p.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ═══════ MANIFESTO ═══════ */
function Manifesto() {
  const pillars = [
    {
      title: "Avaliação Prática Rigorosa",
      desc: "12 competências clínicas avaliadas em cenários de roleplay real. Menos de 5% são aprovados na primeira tentativa.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A7A6D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
      ),
    },
    {
      title: "Supervisão Individual",
      desc: "Todo terapeuta é supervisionado por profissionais experientes. Sem exceção.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A7A6D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
    },
    {
      title: "Decisões Baseadas em Dados",
      desc: "Monitoramos indicadores de qualidade, satisfação e evolução clínica. A psicologia que fazemos é mensurável.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A7A6D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
    },
    {
      title: "Grupos de Desenvolvimento",
      desc: "Seminários, estudos de caso e comunidades de prática. O aprendizado é contínuo e coletivo.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A7A6D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
        </svg>
      ),
    },
  ];

  return (
    <Section className="relative py-24 px-6 md:px-10" style={{ background: "#FDFBF7" }}>
      <div className="max-w-[1100px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <div>
            <p className="font-dm font-semibold text-xs tracking-[.2em] uppercase mb-3" style={{ color: "#1A7A6D" }}>
              O Método Allos
            </p>
            <h2 className="font-fraunces font-bold leading-tight mb-6" style={{ fontSize: "clamp(24px,4vw,42px)", color: "#1A1A1A" }}>
              Não existe terapeuta bom e terapeuta barato. Existe psicologia{" "}
              <em className="italic font-medium" style={{ color: "#1A7A6D" }}>bem feita.</em>
            </h2>
            <div className="space-y-5 font-dm" style={{ fontSize: "16px", color: "#5C5C5C" }}>
              <p>
                Na Allos, cada terapeuta passa por uma <strong className="text-[#1A1A1A]">avaliação prática rigorosa</strong> antes de atender. Testamos escuta, manejo de crise, formulação de caso: 12 competências clínicas em cenários reais.
              </p>
              <p>
                Depois de aprovado, o acompanhamento é contínuo: <strong className="text-[#1A1A1A]">supervisão individual, monitoramento por indicadores de qualidade e grupos de desenvolvimento.</strong> Seu terapeuta nunca está sozinho.
              </p>
              <p>
                Esse sistema existe para uma razão simples: garantir que cada sessão entregue o cuidado que você merece, com <strong className="text-[#1A1A1A]">rigor técnico e atenção real.</strong>
              </p>
            </div>
            <div className="mt-6 rounded-r-xl p-6" style={{ background: "#F5F0E8", borderLeft: "4px solid #1A7A6D" }}>
              <p className="font-fraunces italic text-lg" style={{ color: "#1A1A1A", lineHeight: 1.5 }}>
                &ldquo;Cada terapeuta que atende aqui provou, na prática, que está preparado. E é acompanhado continuamente para continuar estando.&rdquo;
              </p>
            </div>
          </div>

          {/* Right: pillar cards */}
          <div>
            <h3 className="font-fraunces font-semibold text-xl mb-4" style={{ color: "#1A1A1A" }}>O Método Allos</h3>
            <div className="flex flex-col gap-5">
              {pillars.map((p, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-5 rounded-2xl p-6"
                  style={{ background: "#F5F0E8", border: "1px solid #E0DDD5" }}
                  whileHover={{ y: -3, boxShadow: "0 8px 20px rgba(0,0,0,0.06)" }}
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(26,122,109,0.08)" }}>
                    {p.icon}
                  </div>
                  <div>
                    <h4 className="font-fraunces font-semibold text-base mb-1" style={{ color: "#1A1A1A" }}>{p.title}</h4>
                    <p className="font-dm text-sm" style={{ color: "#5C5C5C", lineHeight: 1.5 }}>{p.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
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
      title: "Obsessão por Qualidade",
      desc: "NPS de 9,4 e nota 4,9 no Google não acontecem por acaso. Avaliamos, supervisionamos e acompanhamos cada terapeuta porque a excelência é inegociável.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E8963E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
    {
      title: "Acessibilidade Real",
      desc: "Como associação sem fins lucrativos, nosso modelo permite oferecer psicoterapia com valores muito abaixo do mercado, sem sacrificar um milímetro de qualidade.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E8963E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><path d="M16 8h-6a2 2 0 100 4h4a2 2 0 010 4H8" /><line x1="12" y1="6" x2="12" y2="8" /><line x1="12" y1="16" x2="12" y2="18" />
        </svg>
      ),
    },
    {
      title: "Diversidade de Abordagens",
      desc: "Não acreditamos em abordagem certa ou errada. Acreditamos em psicologia bem feita. Nossos terapeutas trabalham com múltiplas abordagens, e o que importa é a qualidade do cuidado.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E8963E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 20V10M12 20V4M6 20v-6" />
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
          Por que a Allos?
        </p>
        <h2 className="font-fraunces font-bold leading-tight mb-12" style={{ fontSize: "clamp(28px,4.5vw,48px)" }}>
          Qualidade que você pode <em className="italic font-medium" style={{ color: "#E8963E" }}>comprovar</em>
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

/* ═══════ SELEÇÃO / FUNIL ═══════ */
function SelectionFunnel() {
  const funnel = [
    { pct: "Formação gratuita", label: "Modelo de ensino aberto que atrai talentos de toda BH", width: "100%" },
    { pct: "Pool de candidatos", label: "Profissionais em desenvolvimento contínuo conosco", width: "75%" },
    { pct: "Roleplay clínico", label: "Avaliação prática em 12 competências reais", width: "55%" },
    { pct: "< 5%", label: "Aprovados para atender pacientes", width: "38%" },
  ];
  const colors = ["#2CA89A", "#1A7A6D", "#0D3B36", "#082925"];
  const badges = ["12 competências", "< 5% aprovação", "Supervisão contínua"];

  return (
    <Section className="relative py-24 px-6 md:px-10" style={{ background: "#F5F0E8" }}>
      <div className="max-w-[1100px] mx-auto">
        <p className="font-dm font-semibold text-xs tracking-[.2em] uppercase mb-3" style={{ color: "#1A7A6D" }}>
          Como encontramos nossos terapeutas
        </p>
        <h2 className="font-fraunces font-bold leading-tight mb-12" style={{ fontSize: "clamp(28px,4.5vw,48px)", color: "#1A1A1A" }}>
          Encontrar talentos. Desenvolver com rigor.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Funnel visual */}
          <div className="flex flex-col items-center">
            {funnel.map((f, i) => (
              <motion.div
                key={i}
                className="text-center text-white font-semibold py-6 px-8"
                style={{
                  background: colors[i],
                  width: f.width,
                  borderRadius: i === 0 ? "16px 16px 0 0" : i === funnel.length - 1 ? "0 0 16px 16px" : undefined,
                  fontSize: "0.92rem",
                }}
                whileHover={{ scale: 1.03 }}
              >
                <span className="font-fraunces text-xl font-bold block leading-tight">{f.pct}</span>
                <span className="text-xs opacity-85 font-normal block mt-0.5">{f.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Text */}
          <div>
            <h3 className="font-fraunces font-bold text-2xl mb-4 leading-snug" style={{ color: "#1A1A1A" }}>
              Formação gratuita para encontrar <em className="italic font-medium" style={{ color: "#1A7A6D" }}>os melhores</em>
            </h3>
            <div className="space-y-4 font-dm" style={{ fontSize: "16px", color: "#5C5C5C", lineHeight: 1.7 }}>
              <p>
                O Método Allos começa antes do consultório. Mantemos um <strong className="text-[#1A1A1A]">programa de ensino clínico gratuito</strong> que atrai psicólogos e graduandos, criando uma pool de talentos que se desenvolvem conosco.
              </p>
              <p>
                Desse grupo, avaliamos cada candidato em <strong className="text-[#1A1A1A]">atividades práticas de roleplay clínico</strong>: cenários que simulam atendimentos reais, testando escuta ativa, manejo de crise, formulação de caso, vínculo terapêutico e mais.
              </p>
              <p>
                Somos extremamente rigorosos: <strong className="text-[#1A1A1A]">menos de 5% são aprovados na primeira tentativa.</strong> Quem passa, entra em um ciclo contínuo de supervisão individual, abordagens orientadas por dados e grupos de desenvolvimento.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
              {badges.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1.5 font-dm font-semibold text-xs rounded-full px-4 py-2"
                  style={{ background: "rgba(26,122,109,0.08)", border: "1px solid rgba(26,122,109,0.15)", color: "#1A7A6D" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ═══════ COMO FUNCIONA (teal timeline) ═══════ */
function ComoFunciona() {
  const steps = [
    { n: 1, title: "Fale com a gente", desc: "Mande uma mensagem pelo WhatsApp, pode ser um simples 'oi'. Nossa equipe responde rápido, tira suas dúvidas e entende o que você precisa. Sem formulário, sem burocracia." },
    { n: 2, title: "Encontramos seu terapeuta", desc: "Fazemos o matching entre sua demanda e o terapeuta mais indicado, considerando perfil, abordagem e disponibilidade." },
    { n: 3, title: "Sua terapia começa", desc: "Sessões online semanais com um terapeuta supervisionado e acompanhado continuamente pela nossa equipe." },
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
          Da primeira mensagem à sua sessão
        </h2>
        <p className="font-dm mb-12" style={{ fontSize: "17px", color: "rgba(255,255,255,0.7)", maxWidth: 700 }}>
          Um processo simples e direto para você começar sua terapia online.
        </p>
        <div className="relative grid grid-cols-1 md:grid-cols-3">
          {/* connecting line */}
          <div className="hidden md:block absolute top-9 left-[16%] right-[16%] h-0.5" style={{ background: "rgba(255,255,255,0.15)" }} />
          {steps.map((s) => (
            <div key={s.n} className="text-center relative px-6 mb-10 md:mb-0">
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

/* ═══════ DIFERENCIAIS ═══════ */
function Diferenciais() {
  const diffs = [
    {
      title: "Competência, não Diploma",
      desc: "Nossos terapeutas são avaliados pela capacidade clínica demonstrada na prática, não pelo status acadêmico. Formados e graduandos passam pelo mesmo crivo.",
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1A7A6D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
    {
      title: "Supervisão Obrigatória",
      desc: "100% dos terapeutas têm supervisão individual com profissionais experientes. Isso não é diferencial, é requisito mínimo do nosso método.",
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1A7A6D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
    },
    {
      title: "Qualidade Mensurável",
      desc: "Sistemas próprios de gestão clínica com dashboards, NPS contínuo e indicadores de evolução. Não adivinhamos se está funcionando: medimos.",
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1A7A6D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
    },
    {
      title: "Transparência Total",
      desc: "Você sabe como funciona nosso processo, como seus terapeutas foram selecionados e como monitoramos a qualidade. Sem segredos.",
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
          O que faz a Allos diferente
        </h2>
        <p className="font-dm mb-12" style={{ fontSize: "17px", color: "#5C5C5C", maxWidth: 700 }}>
          Combinamos o rigor de uma instituição de formação com a sensibilidade de uma clínica que coloca o paciente no centro.
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

/* ═══════ INVESTIMENTO ═══════ */
function Investimento() {
  return (
    <Section className="relative py-24 px-6 md:px-10" style={{ background: "#F5F0E8" }}>
      <div className="max-w-[1100px] mx-auto">
        <p className="font-dm font-semibold text-xs tracking-[.2em] uppercase mb-3" style={{ color: "#1A7A6D" }}>
          Investimento
        </p>
        <h2 className="font-fraunces font-bold leading-tight mb-12" style={{ fontSize: "clamp(28px,4.5vw,48px)", color: "#1A1A1A" }}>
          Psicoterapia acessível, sem abrir mão da qualidade
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Price card */}
          <div className="bg-[#FDFBF7] rounded-3xl p-12 text-center" style={{ border: "2px solid #1A7A6D" }}>
            <p className="font-dm font-semibold text-xs tracking-[.2em] uppercase mb-4" style={{ color: "#1A7A6D" }}>
              Psicoterapia Individual Online
            </p>
            <p className="font-fraunces font-bold text-3xl mb-4" style={{ color: "#1A7A6D", lineHeight: 1.2 }}>
              Valor social acessível
            </p>
            <p className="font-dm text-[15px] leading-relaxed mb-6" style={{ color: "#5C5C5C" }}>
              Como associação sem fins lucrativos, nosso modelo permite oferecer terapia com valores significativamente abaixo do mercado, mantendo o mesmo compromisso com excelência clínica.
            </p>
            <div className="w-[60px] h-0.5 mx-auto my-6" style={{ background: "#E0DDD5" }} />
            <ul className="space-y-3">
              {["Sessões semanais com frequência regular", "Pagamento facilitado via PIX ou cartão", "Consulte valores entrando em contato"].map((item) => (
                <li key={item} className="flex items-center justify-center gap-2 font-dm text-[15px]" style={{ color: "#5C5C5C" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A7A6D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Modalities */}
          <div className="flex flex-col gap-5">
            <h3 className="font-fraunces font-semibold text-xl mb-1" style={{ color: "#1A1A1A" }}>
              Atendimento 100% Online
            </h3>
            {[
              {
                title: "Sessões por Videoconferência",
                desc: "Sessões em plataforma segura, com total sigilo profissional. Terapia de qualidade de onde você estiver.",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A7A6D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                ),
              },
              {
                title: "Flexibilidade de Horários",
                desc: "Horários pensados para caber na sua rotina. Nossa equipe trabalha para encontrar o melhor encaixe para você.",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A7A6D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
                  </svg>
                ),
              },
              {
                title: "Terapeuta Acompanhado",
                desc: "Seu terapeuta tem supervisão individual e é monitorado por indicadores de qualidade. Você nunca está sozinho no processo.",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A7A6D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                ),
              },
            ].map((m, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-5 rounded-2xl p-6 bg-[#FDFBF7]"
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

/* ═══════ DEPOIMENTOS ═══════ */
function Depoimentos() {
  const testimonials = [
    { name: "Rayane A.", text: "Minha experiência foi enriquecedora. Os profissionais da Allos nos proporcionam muito acolhimento e ajudam de maneira incondicional no autoconhecimento." },
    { name: "J.K.", text: "Faço terapia online e estou muito satisfeita com o profissional tanto quanto a gestão da Allos." },
    { name: "André L.", text: "A Allos é muito boa! São pessoas realmente comprometidas com provocar mudanças na vida das pessoas!" },
    { name: "Marcos C.", text: "Oferecem serviços de atendimento clínico a preço social, ensino de psicologia e aprimoramento clínico excelentes! O ambiente é acolhedor e a equipe é de altíssima qualidade." },
  ];

  return (
    <Section className="relative py-24 px-6 md:px-10" style={{ background: "#FDFBF7" }}>
      <div className="max-w-[1100px] mx-auto">
        <p className="font-dm font-semibold text-xs tracking-[.2em] uppercase mb-3" style={{ color: "#1A7A6D" }}>
          O que dizem nossos pacientes
        </p>
        <h2 className="font-fraunces font-bold leading-tight mb-12" style={{ fontSize: "clamp(28px,4.5vw,48px)", color: "#1A1A1A" }}>
          Quem passou pela Allos, recomenda
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="relative rounded-2xl p-8"
              style={{ background: "#F5F0E8", border: "1px solid #E0DDD5" }}
              whileHover={{ y: -3, boxShadow: "0 8px 20px rgba(0,0,0,0.06)" }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="mb-4 opacity-20">
                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" fill="#1A7A6D" />
                <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" fill="#1A7A6D" />
              </svg>
              <p className="font-dm text-[15px] leading-relaxed mb-4" style={{ color: "#5C5C5C" }}>
                {t.text}
              </p>
              <p className="font-dm font-semibold text-sm" style={{ color: "#1A1A1A" }}>
                {t.name}
              </p>
            </motion.div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-2 mt-8">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#E8963E" stroke="none">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <p className="font-dm text-sm" style={{ color: "#5C5C5C" }}>
            Nota 4,9 no Google · 122+ avaliações
          </p>
        </div>
      </div>
    </Section>
  );
}

/* ═══════ FAQ ═══════ */
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "2px solid rgba(26,122,109,0.15)" }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-6 text-left cursor-pointer"
      >
        <h4 className="font-fraunces font-semibold text-lg pr-4" style={{ color: "#1A1A1A" }}>
          {question}
        </h4>
        <motion.svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1A7A6D"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="flex-shrink-0"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <polyline points="6 9 12 15 18 9" />
        </motion.svg>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <p className="font-dm text-[15px] leading-relaxed pb-6" style={{ color: "#5C5C5C" }}>
          {answer}
        </p>
      </motion.div>
    </div>
  );
}

function FAQ() {
  const faqs = [
    {
      question: "Como funciona a primeira sessão?",
      answer: "Sua primeira sessão acontece online, por videoconferência. Você recebe um link do Google Meet com o horário marcado. É um momento para conhecer seu terapeuta, contar o que te trouxe até aqui e entender como a terapia vai funcionar. Sem pressão: o objetivo é você se sentir confortável.",
    },
    {
      question: "Posso trocar de terapeuta se não me adaptar?",
      answer: "Sim, sem nenhum custo adicional. O vínculo terapêutico é fundamental para o processo funcionar. Se você sentir que não houve conexão, é só entrar em contato com nossa equipe e fazemos um novo matching.",
    },
    {
      question: "Os terapeutas são formados?",
      answer: "Temos terapeutas formados e em formação, mas todos passam pela mesma avaliação prática rigorosa. Menos de 5% dos candidatos são aprovados na primeira tentativa, e todos os terapeutas têm supervisão individual contínua. Na Allos, o critério é competência clínica demonstrada, não status de diploma.",
    },
    {
      question: "Quanto custa a terapia?",
      answer: "Atendemos a preço social. Nossos valores são significativamente abaixo do mercado por sermos uma associação sem fins lucrativos. Entre em contato pelo WhatsApp para consultar os valores atuais e condições de pagamento.",
    },
  ];

  return (
    <Section className="relative py-24 px-6 md:px-10" style={{ background: "#FDFBF7" }}>
      <div className="max-w-[800px] mx-auto">
        <p className="font-dm font-semibold text-xs tracking-[.2em] uppercase mb-3" style={{ color: "#1A7A6D" }}>
          Dúvidas frequentes
        </p>
        <h2 className="font-fraunces font-bold leading-tight mb-12" style={{ fontSize: "clamp(28px,4.5vw,48px)", color: "#1A1A1A" }}>
          Perguntas que você pode ter
        </h2>
        <div>
          {faqs.map((f, i) => (
            <FaqItem key={i} question={f.question} answer={f.answer} />
          ))}
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
        Pronto para dar o <em className="italic font-medium" style={{ color: "#1A7A6D" }}>primeiro passo</em>?
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="font-dm mx-auto mb-10"
        style={{ fontSize: "17px", color: "#5C5C5C", maxWidth: 620 }}
      >
        Fale com a nossa equipe. Vamos entender o que você precisa e conectar você ao terapeuta certo. Sem burocracia.
      </motion.p>
      <motion.a
        href="https://bit.ly/terapiasite"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 font-dm font-semibold text-white rounded-full"
        style={{ background: "#1A7A6D", padding: "18px 40px", fontSize: "17px", boxShadow: "0 4px 20px rgba(26,122,109,0.3)" }}
        whileHover={{ y: -2, boxShadow: "0 8px 28px rgba(26,122,109,0.4)" }}
        whileTap={{ scale: 0.97 }}
      >
        Agendar Sessão
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </motion.a>
    </section>
  );
}

/* ═══════ MAIN EXPORT ═══════ */
export default function PsicoterapiaContent() {
  return (
    <>
      <SocialProof />
      <Manifesto />
      <WhyAllos />
      <SelectionFunnel />
      <ComoFunciona />
      <Diferenciais />
      <Depoimentos />
      <Investimento />
      <FAQ />
      <CtaSection />
    </>
  );
}
