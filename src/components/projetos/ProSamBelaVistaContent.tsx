"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef, useState } from "react";

const EASE = [0.22, 1, 0.36, 1];

/* Colors matching the HTML design */
const C = {
  teal: "#1A7A6D",
  tealDark: "#0D3B36",
  tealDeep: "#082925",
  tealLight: "#2CA89A",
  tealGlow: "#3ECFBE",
  accent: "#E8963E",
  accentDark: "#C67A2E",
  cream: "#FDFBF7",
  creamAlt: "#F5F0E8",
  text: "#1A1A1A",
  textMuted: "#5C5C5C",
  border: "#E0DDD5",
  danger: "#C0392B",
  blue: "#2E75B6",
};

function CountUp({ to, suffix = "", prefix = "", decimals = 0 }: { to: number; suffix?: string; prefix?: string; decimals?: number }) {
  const [v, setV] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true });
  const started = useRef(false);
  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const dur = 1600, start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      const val = e * to;
      setV(decimals > 0 ? parseFloat(val.toFixed(decimals)) : Math.round(val));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to, decimals]);
  return <span ref={ref}>{prefix}{decimals > 0 ? v.toFixed(decimals).replace(".", ",") : v}{suffix}</span>;
}

/* ══════════════════════════════════════════════
   1. HERO — cream background, centered stats
══════════════════════════════════════════════ */
function HeroSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <section
      ref={ref}
      className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-6 py-20 overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 20% 80%, rgba(26,122,109,0.10) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, rgba(232,150,62,0.06) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 50%, rgba(26,122,109,0.04) 0%, transparent 70%),
          ${C.cream}`,
      }}
    >
      {/* Grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[.03]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

      {/* Program identity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.1, duration: 0.6, ease: EASE }}
        className="relative z-10 mb-6 flex flex-col items-center gap-2"
      >
        <span className="font-dm font-semibold text-[0.72rem] uppercase tracking-[0.2em]" style={{ color: C.teal }}>
          Saúde Pública · Desde 2024
        </span>
        <span className="font-dm" style={{ fontSize: "1rem", color: C.textMuted }}>
          ProSam — Bela Vista de Minas
        </span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2, duration: 0.8, ease: EASE }}
        className="font-fraunces font-bold leading-[1.08] mb-6 max-w-[900px] relative z-10"
        style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)", color: C.text }}
      >
        Cuidar de quem cuida <em className="not-italic italic font-medium" style={{ color: C.teal }}>da cidade</em>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4, duration: 0.8, ease: EASE }}
        className="font-dm max-w-[640px] mb-12 relative z-10"
        style={{ fontSize: "1.2rem", color: C.textMuted }}
      >
        Programa de Saúde Mental para servidores públicos. Resultados reais, impacto mensurável, excelência comprovada.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6, duration: 0.8, ease: EASE }}
        className="flex flex-wrap justify-center gap-10 md:gap-14 relative z-10"
      >
        {[
          { num: "9,5", small: "/10", label: "Nota de\nsatisfação" },
          { num: "1.230+", small: "", label: "Sessões\nrealizadas" },
          { num: "~940", small: "", label: "Vidas\nimpactadas" },
          { num: "+57%", small: "", label: "Crescimento\norgânico" },
        ].map((s, i) => (
          <div key={i} className="text-center">
            <div className="font-fraunces font-bold leading-none" style={{ fontSize: "3.5rem", color: C.teal }}>
              {s.num}
              {s.small && <span className="font-normal" style={{ fontSize: "0.45em", color: C.textMuted }}>{s.small}</span>}
            </div>
            <div className="font-dm text-[0.8rem] uppercase tracking-[0.12em] mt-2 whitespace-pre-line" style={{ color: C.textMuted }}>
              {s.label}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 1, duration: 0.6 }}
        className="relative z-10 mt-16 flex flex-col items-center gap-2"
        style={{ color: C.textMuted }}
      >
        <span className="font-dm text-[0.72rem] uppercase tracking-[0.15em]">Conheça os resultados</span>
        <motion.svg
          animate={{ y: [0, 6, 3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </motion.svg>
      </motion.div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   2. CRISIS — deep teal background
══════════════════════════════════════════════ */
function CrisisSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const crisisCards = [
    { num: "546 mil", desc: "afastamentos por saúde mental em 2025 — recorde histórico pelo 2º ano consecutivo", source: "INSS / Ministério da Previdência Social" },
    { num: "R$ 3,5 bi", desc: "pagos pelo INSS em benefícios por incapacidade relacionados a transtornos mentais", source: "Data Cajuína / INSS 2025" },
    { num: "83 mil", desc: "afastamentos em Minas Gerais — o 2º estado mais afetado do país", source: "INSS / G1" },
  ];

  return (
    <section className="relative py-24 md:py-28 px-6 md:px-10 overflow-hidden" style={{ background: C.tealDeep, color: C.cream }}>
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 0% 100%, rgba(232,150,62,0.08) 0%, transparent 50%), radial-gradient(ellipse at 100% 0%, rgba(26,122,109,0.12) 0%, transparent 50%)"
      }} />

      <div className="max-w-[1100px] mx-auto relative z-10">
        <motion.span initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="block font-dm font-semibold text-[0.72rem] uppercase tracking-[0.2em] mb-3" style={{ color: C.accent }}>
          O cenário nacional
        </motion.span>
        <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.08, duration: 0.7, ease: EASE }}
          className="font-fraunces font-bold leading-[1.15] mb-0" style={{ fontSize: "clamp(1.9rem, 4.5vw, 3rem)", color: C.cream }}>
          O Brasil vive uma crise silenciosa de saúde mental no trabalho
        </motion.h2>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {crisisCards.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.65, ease: EASE }}
              whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.3)", transition: { duration: 0.3 } }}
              className="rounded-2xl p-8 overflow-hidden"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="font-fraunces font-bold leading-none mb-2" style={{ fontSize: "2.8rem", color: C.accent }}>{c.num}</div>
              <p className="font-dm leading-[1.5] mb-4" style={{ fontSize: "0.95rem", opacity: 0.8 }}>{c.desc}</p>
              <p className="font-dm text-[0.72rem] uppercase tracking-[0.08em]" style={{ opacity: 0.45 }}>{c.source}</p>
            </motion.div>
          ))}
        </div>

        {/* Callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7, ease: EASE }}
          className="mt-12 rounded-2xl flex items-start gap-6 p-8 md:px-10"
          style={{ background: "rgba(192,57,43,0.12)", border: `1px solid rgba(192,57,43,0.2)` }}
        >
          <div className="flex-shrink-0 leading-none">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <p className="font-dm leading-[1.6]" style={{ fontSize: "1.1rem", opacity: 0.9 }}>
            <strong style={{ color: C.accent }}>Antes dos afastamentos formais, existe um contingente enorme de trabalhadores em sofrimento psíquico</strong> — com queda de produtividade, conflitos e erros — que ainda não entrou nas estatísticas. É nessa janela que a prevenção é decisiva.
            <br />
            <em className="font-dm" style={{ opacity: 0.55, fontSize: "0.82rem" }}>— ANAMT, 2026</em>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   3. ABOUT — two-column layout
══════════════════════════════════════════════ */
function AboutSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const pillars = [
    {
      icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" /></svg>,
      title: "Seleção Rigorosa",
      desc: "Apenas 5% dos terapeutas aprovados na 1ª tentativa. Avaliação por banca em 12 competências.",
    },
    {
      icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 010-4h14v4" /><path d="M3 5v14a2 2 0 002 2h16v-5" /><path d="M18 12a2 2 0 000 4h4v-4h-4z" /></svg>,
      title: "Gestão por Dados",
      desc: "Plataforma Hamilton: prontuários digitais, KPIs, rastreamento de desfechos clínicos em tempo real.",
    },
    {
      icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>,
      title: "Supervisão Técnica",
      desc: "Todos os atendimentos supervisionados. Qualidade clínica monitorada continuamente.",
    },
    {
      icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
      title: "Modelo Preventivo",
      desc: "Intervir antes do afastamento. Ações individuais, grupais e institucionais integradas.",
    },
  ];

  return (
    <section className="py-24 md:py-28 px-6 md:px-10" style={{ background: C.creamAlt }}>
      <div className="max-w-[1100px] mx-auto">
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Left: text */}
          <div>
            <motion.span initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="block font-dm font-semibold text-[0.72rem] uppercase tracking-[0.2em] mb-3" style={{ color: C.teal }}>
              Sobre o programa
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.08, duration: 0.7, ease: EASE }}
              className="font-fraunces font-bold leading-[1.15] mb-6" style={{ fontSize: "clamp(1.9rem, 4.5vw, 3rem)", color: C.text }}>
              ProSam: prevenção com excelência clínica
            </motion.h2>
            <motion.div initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.14, duration: 0.6 }}>
              <p className="font-dm mb-5 leading-[1.7]" style={{ fontSize: "1.05rem", color: C.textMuted }}>
                O ProSam é um programa de atenção psicológica preventiva para servidores públicos, operado pela Associação Allos — uma clínica-escola que forma e seleciona terapeutas com rigor acima do mercado.
              </p>
              <p className="font-dm mb-5 leading-[1.7]" style={{ fontSize: "1.05rem", color: C.textMuted }}>
                Diferente de soluções genéricas de bem-estar, o programa opera com <strong className="text-[#1A1A1A]">supervisão técnica obrigatória</strong>, gestão digital por plataforma proprietária (Hamilton) e avaliação contínua de qualidade.
              </p>
              <p className="font-dm mb-0 leading-[1.7]" style={{ fontSize: "1.05rem", color: C.textMuted }}>
                O modelo é quinquenal e preventivo: intervir <strong className="text-[#1A1A1A]">antes</strong> que o sofrimento psíquico se converta em afastamento, judicialização ou colapso institucional.
              </p>
            </motion.div>

            {/* Quote box */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.25, duration: 0.6, ease: EASE }}
              className="mt-8 rounded-r-xl p-8"
              style={{ background: C.cream, borderLeft: `4px solid ${C.teal}` }}
            >
              <p className="font-fraunces italic font-normal leading-[1.5]" style={{ fontSize: "1.4rem", color: C.text }}>
                &ldquo;Transformar talentos em legado — e proteger quem sustenta o serviço público.&rdquo;
              </p>
              <cite className="block mt-3 font-dm not-italic" style={{ fontSize: "0.85rem", color: C.textMuted }}>— Missão Allos</cite>
            </motion.div>
          </div>

          {/* Right: 4 pillar cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pillars.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.6, ease: EASE }}
                whileHover={{ y: -3, boxShadow: "0 8px 20px rgba(0,0,0,0.06)", transition: { duration: 0.3 } }}
                className="rounded-xl p-5"
                style={{ background: C.cream, border: `1px solid ${C.border}` }}
              >
                <div className="mb-2">{p.icon}</div>
                <h4 className="font-fraunces font-semibold mb-1" style={{ fontSize: "1rem", color: C.text }}>{p.title}</h4>
                <p className="font-dm leading-[1.5]" style={{ fontSize: "0.82rem", color: C.textMuted }}>{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   4. THREE LENSES — detailed cards
══════════════════════════════════════════════ */
function LensesSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const lenses = [
    {
      color: C.teal,
      icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>,
      label: "Alcance humano",
      number: "~940",
      unit: "pontos de contato",
      details: [
        { k: "Servidores atendidos", v: "70+" },
        { k: "Familiares impactados", v: "~145" },
        { k: "Participações coletivas", v: "724" },
        { k: "Palestras + Grupos", v: "25 + 28" },
      ],
    },
    {
      color: C.accent,
      icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>,
      label: "Economia projetada",
      number: "R$ 138-276k",
      unit: "em custo evitado",
      details: [
        { k: "Afastamentos evitados", v: "7 a 14" },
        { k: "Dias recuperados", v: "672 a 1.344" },
        { k: "Custo/afastamento", v: "R$ 6.568" },
        { k: "Fator indireto", v: "2x (conserv.)" },
      ],
    },
    {
      color: C.blue,
      icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
      label: "Excelência",
      number: "NPS +90",
      unit: "Zona de Encantamento",
      details: [
        { k: "Nota média", v: "9,5 / 10" },
        { k: "NPS de saída", v: "+100" },
        { k: "Taxa de realização", v: "75,4%" },
        { k: "Terapeutas alocados", v: "26" },
      ],
    },
  ];

  return (
    <section className="py-24 md:py-28 px-6 md:px-10" style={{ background: C.cream }}>
      <div className="max-w-[1100px] mx-auto">
        <motion.span initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="block font-dm font-semibold text-[0.72rem] uppercase tracking-[0.2em] mb-3" style={{ color: C.teal }}>
          Impacto mensurado
        </motion.span>
        <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.08, duration: 0.7, ease: EASE }}
          className="font-fraunces font-bold leading-[1.15] mb-6" style={{ fontSize: "clamp(1.9rem, 4.5vw, 3rem)", color: C.text }}>
          Resultados em três dimensões
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.14, duration: 0.6 }}
          className="font-dm max-w-[700px] mb-8" style={{ fontSize: "1.1rem", color: C.textMuted }}>
          Medimos o impacto do ProSam em alcance humano, economia projetada e excelência operacional — com cálculos conservadores e fontes auditáveis.
        </motion.p>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {lenses.map((l, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.7, ease: EASE }}
              whileHover={{ y: -6, boxShadow: "0 16px 40px rgba(0,0,0,0.08)", transition: { duration: 0.4 } }}
              className="relative rounded-[20px] text-center overflow-hidden"
              style={{ background: C.creamAlt, border: `1px solid ${C.border}`, padding: "2.5rem 2rem" }}
            >
              {/* Bottom accent bar */}
              <div className="absolute bottom-0 left-0 right-0 h-[4px]" style={{ background: l.color }} />

              <span className="block mb-4">{l.icon}</span>
              <div className="font-dm font-bold text-[0.7rem] uppercase tracking-[0.2em] mb-4" style={{ color: l.color }}>{l.label}</div>
              <div className="font-fraunces font-bold leading-none mb-1" style={{ fontSize: "3.2rem", color: C.text }}>{l.number}</div>
              <div className="font-dm mb-6" style={{ fontSize: "0.9rem", color: C.textMuted }}>{l.unit}</div>

              <ul className="text-left pt-5" style={{ borderTop: `1px solid ${C.border}` }}>
                {l.details.map((d, j) => (
                  <li key={j} className="flex justify-between py-[0.4rem] font-dm" style={{ fontSize: "0.88rem", color: C.textMuted }}>
                    <span>{d.k}</span>
                    <strong className="font-semibold" style={{ color: C.text }}>{d.v}</strong>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   5. STATS BANNER — teal gradient
══════════════════════════════════════════════ */
function StatsBanner() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  return (
    <section
      ref={ref}
      className="relative py-20 px-6 md:px-10 text-center text-white overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${C.teal} 0%, ${C.tealDark} 100%)` }}
    >
      {/* Grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[.06]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

      <div className="relative z-10 max-w-[1100px] mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          className="font-fraunces font-medium leading-[1.3] mb-12 max-w-[750px] mx-auto"
          style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)" }}
        >
          Os números mostram o que a prevenção pode fazer por uma cidade inteira
        </motion.h2>

        <div className="flex flex-wrap justify-center gap-12 md:gap-20">
          {[
            { v: 1230, s: "+", l: "Sessões realizadas" },
            { v: 25, s: "", l: "Palestras temáticas" },
            { v: 17, s: "", l: "Plantões emergenciais" },
            { v: 26, s: "", l: "Terapeutas mobilizados" },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.6 }} className="text-center">
              <span className="block font-fraunces font-bold" style={{ fontSize: "4rem", lineHeight: 1 }}>
                <CountUp to={s.v} suffix={s.s} />
              </span>
              <span className="block font-dm text-[0.85rem] mt-2" style={{ opacity: 0.85 }}>{s.l}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   6. EVOLUTION — full 12-month bar chart
══════════════════════════════════════════════ */
function EvolutionSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const months = [
    { m: "Jan", y24: 0, y25: 58 },
    { m: "Fev", y24: 4, y25: 69 },
    { m: "Mar", y24: 25, y25: 66 },
    { m: "Abr", y24: 33, y25: 70 },
    { m: "Mai", y24: 29, y25: 50 },
    { m: "Jun", y24: 40, y25: 43 },
    { m: "Jul", y24: 45, y25: 45 },
    { m: "Ago", y24: 53, y25: 55 },
    { m: "Set", y24: 60, y25: 67 },
    { m: "Out", y24: 74, y25: 78 },
    { m: "Nov", y24: 66, y25: 86 },
    { m: "Dez", y24: 50, y25: 64 },
  ];
  const max = 86;

  return (
    <section className="py-24 md:py-28 px-6 md:px-10" style={{ background: C.creamAlt }}>
      <div className="max-w-[1100px] mx-auto">
        <motion.span initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="block font-dm font-semibold text-[0.72rem] uppercase tracking-[0.2em] mb-3" style={{ color: C.teal }}>
          Evolução
        </motion.span>
        <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.08, duration: 0.7, ease: EASE }}
          className="font-fraunces font-bold leading-[1.15] mb-6" style={{ fontSize: "clamp(1.9rem, 4.5vw, 3rem)", color: C.text }}>
          Crescimento orgânico: a demanda fala por si
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.14, duration: 0.6 }}
          className="font-dm max-w-[700px] mb-8" style={{ fontSize: "1.1rem", color: C.textMuted }}>
          O crescimento de +57% entre 2024 e 2025 aconteceu sem campanhas de captação — os próprios servidores procuraram o programa por indicação e confiança.
        </motion.p>

        <div ref={ref} className="rounded-[20px] p-6 md:p-10" style={{ background: C.cream, border: `1px solid ${C.border}` }}>
          {/* Legend */}
          <div className="flex gap-8 mb-8 font-dm text-[0.85rem]">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ background: "rgba(26,122,109,0.3)" }} /> 2024
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ background: C.teal }} /> 2025
            </span>
          </div>

          {/* Bars */}
          <div className="flex items-end gap-[6px] pb-8 relative" style={{ height: "260px", borderBottom: `1px solid ${C.border}` }}>
            {months.map((m, i) => (
              <div key={i} className="flex-1 flex gap-[2px] items-end h-full relative">
                {/* 2024 bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={inView ? { height: `${(m.y24 / max) * 100}%` } : {}}
                  transition={{ delay: 0.2 + i * 0.05, duration: 1, ease: EASE }}
                  className="flex-1 rounded-t min-w-[4px]"
                  style={{ background: "rgba(26,122,109,0.3)" }}
                  title={`${m.m}/2024: ${m.y24}`}
                />
                {/* 2025 bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={inView ? { height: `${(m.y25 / max) * 100}%` } : {}}
                  transition={{ delay: 0.25 + i * 0.05, duration: 1, ease: EASE }}
                  className="flex-1 rounded-t min-w-[4px]"
                  style={{ background: `linear-gradient(to top, ${C.teal}, ${C.tealLight})` }}
                  title={`${m.m}/2025: ${m.y25}`}
                />
                {/* Month label */}
                <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 font-dm text-[0.65rem] uppercase tracking-[0.05em] whitespace-nowrap" style={{ color: C.textMuted }}>
                  {m.m}
                </span>
              </div>
            ))}
          </div>

          {/* Growth summary */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 mt-10">
            {[
              { val: "479", lbl: "Total 2024" },
              { val: "751", lbl: "Total 2025" },
              { val: "+57%", lbl: "Crescimento" },
              { val: "86", lbl: "Pico mensal (Nov/25)" },
            ].map((g, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8 + i * 0.08, duration: 0.5, ease: EASE }}
                className="text-center">
                <div className="font-fraunces font-bold" style={{ fontSize: "2rem", color: C.teal }}>{g.val}</div>
                <div className="font-dm text-[0.78rem] uppercase tracking-[0.1em]" style={{ color: C.textMuted }}>{g.lbl}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   7. EVIDENCE — cards with left border on hover
══════════════════════════════════════════════ */
function EvidenceSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const cards = [
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
      title: "Psicoterapia reduz afastamentos em 40%",
      desc: "Estudo com 14.530 pacientes mostrou redução de 34 para 20 dias de afastamento/ano após intervenção psicoterapêutica ambulatorial.",
      source: "Psychological Medicine, Cambridge, 2023",
    },
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>,
      title: "Cada $1 investido retorna $4",
      desc: "A OMS estima retorno de US$ 4 em produtividade e saúde para cada US$ 1 investido em programas de saúde mental no trabalho.",
      source: "Organização Mundial da Saúde (OMS)",
    },
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>,
      title: "27% menos absenteísmo",
      desc: "Iniciativas estruturadas de saúde mental no trabalho reduzem absenteísmo em 27% e custos com saúde em 26%.",
      source: "OMS — Workplace Health",
    },
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="8.5" cy="7" r="4" /><path d="M20 8v6M23 11h-6" /></svg>,
      title: "48% dos trabalhadores em risco",
      desc: "Pesquisa com 8.980 trabalhadores brasileiros revelou que quase metade apresenta risco para transtornos de saúde mental.",
      source: "Pipo Saúde / Valor Econômico, 2024",
    },
  ];

  return (
    <section className="py-24 md:py-28 px-6 md:px-10" style={{ background: C.cream }}>
      <div className="max-w-[1100px] mx-auto">
        <motion.span initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="block font-dm font-semibold text-[0.72rem] uppercase tracking-[0.2em] mb-3" style={{ color: C.teal }}>
          Base científica
        </motion.span>
        <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.08, duration: 0.7, ease: EASE }}
          className="font-fraunces font-bold leading-[1.15] mb-6" style={{ fontSize: "clamp(1.9rem, 4.5vw, 3rem)", color: C.text }}>
          Evidências que sustentam cada número
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.14, duration: 0.6 }}
          className="font-dm max-w-[700px] mb-8" style={{ fontSize: "1.1rem", color: C.textMuted }}>
          Todas as extrapolações deste relatório são conservadoras e baseadas em literatura científica revisada por pares e dados oficiais.
        </motion.p>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {cards.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.65, ease: EASE }}
              whileHover={{ y: -3, boxShadow: "0 10px 24px rgba(0,0,0,0.06)", transition: { duration: 0.3 } }}
              className="group relative rounded-2xl p-8 overflow-hidden"
              style={{ background: C.creamAlt, border: `1px solid ${C.border}` }}
            >
              {/* Left border on hover */}
              <div className="absolute top-0 left-0 w-[4px] h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: C.teal }} />

              <span className="block mb-3">{c.icon}</span>
              <h4 className="font-fraunces font-semibold mb-2" style={{ fontSize: "1.15rem", color: C.text }}>{c.title}</h4>
              <p className="font-dm leading-[1.6] mb-3" style={{ fontSize: "0.92rem", color: C.textMuted }}>{c.desc}</p>
              <div className="font-dm font-semibold text-[0.72rem] uppercase tracking-[0.08em]" style={{ color: C.teal }}>{c.source}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   8. NR-1 — two-column with checklist
══════════════════════════════════════════════ */
function NR1Section() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const checks = [
    "Mapeamento de riscos psicossociais por setor",
    "Atendimento individual com registro digital",
    "Grupos terapêuticos e palestras de sensibilização",
    "Plantões emergenciais para crises agudas",
    "Relatórios periódicos com KPIs e desfechos",
    "Supervisão técnica obrigatória de todos os atendimentos",
    "Plataforma digital de gestão clínica (Hamilton)",
  ];

  return (
    <section className="relative py-24 md:py-28 px-6 md:px-10" style={{ background: C.tealDeep, color: C.cream }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 80% 50%, rgba(232,150,62,0.06) 0%, transparent 50%)"
      }} />

      <div className="max-w-[1100px] mx-auto relative z-10">
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Left: text */}
          <div>
            <motion.span initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="block font-dm font-semibold text-[0.72rem] uppercase tracking-[0.2em] mb-3" style={{ color: C.accent }}>
              Conformidade legal
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.08, duration: 0.7, ease: EASE }}
              className="font-fraunces font-bold leading-[1.15] mb-6" style={{ fontSize: "clamp(1.9rem, 4.5vw, 3rem)", color: C.cream }}>
              NR-1 atualizada: riscos psicossociais são obrigação legal
            </motion.h2>
            <motion.div initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.14, duration: 0.6 }}>
              <p className="font-dm leading-[1.7] mb-5" style={{ fontSize: "1.05rem", opacity: 0.85 }}>
                A atualização da Norma Regulamentadora nº 1 (NR-1) incluiu a gestão de <strong style={{ color: C.accent }}>riscos psicossociais</strong> como obrigação de todas as organizações — incluindo a administração pública.
              </p>
              <p className="font-dm leading-[1.7]" style={{ fontSize: "1.05rem", opacity: 0.85 }}>
                O ProSam não apenas atende essa exigência, mas vai além: opera um sistema preventivo contínuo que transforma conformidade em vantagem institucional.
              </p>
            </motion.div>
          </div>

          {/* Right: checklist */}
          <ul className="space-y-3">
            {checks.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.06, duration: 0.5, ease: EASE }}
                whileHover={{ x: 4, background: "rgba(255,255,255,0.08)", transition: { duration: 0.3 } }}
                className="flex items-start gap-4 p-4 rounded-xl"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", fontSize: "0.95rem", opacity: 0.9 }}
              >
                <span className="font-bold text-[1.1rem] flex-shrink-0" style={{ color: C.tealGlow }}>✓</span>
                <span className="font-dm">{item}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   9. SATISFACTION — NPS two-column display
══════════════════════════════════════════════ */
function SatisfactionSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const npsDetails = [
    { val: "9,5", label: "Nota média de satisfação (de 0 a 10)" },
    { val: "+100", label: "NPS de saída — todos os servidores que encerraram são promotores" },
    { val: "75,4%", label: "Taxa de realização das consultas agendadas" },
  ];

  return (
    <section className="py-24 md:py-28 px-6 md:px-10" style={{ background: C.creamAlt }}>
      <div className="max-w-[1100px] mx-auto">
        <motion.span initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="block font-dm font-semibold text-[0.72rem] uppercase tracking-[0.2em] mb-3" style={{ color: C.teal }}>
          Satisfação
        </motion.span>
        <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.08, duration: 0.7, ease: EASE }}
          className="font-fraunces font-bold leading-[1.15] mb-6" style={{ fontSize: "clamp(1.9rem, 4.5vw, 3rem)", color: C.text }}>
          O que dizem os servidores
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.14, duration: 0.6 }}
          className="font-dm max-w-[700px] mb-8" style={{ fontSize: "1.1rem", color: C.textMuted }}>
          NPS (Net Promoter Score) na faixa de marcas como Apple e Netflix. Os servidores não apenas aprovam — eles recomendam.
        </motion.p>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 mt-12 items-center">
          {/* NPS big display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
            className="text-center rounded-3xl p-12"
            style={{ background: C.cream, border: `1px solid ${C.border}` }}
          >
            <div className="font-fraunces font-bold leading-none" style={{ fontSize: "6rem", color: C.teal }}>+90</div>
            <div className="font-dm text-[0.75rem] uppercase tracking-[0.2em] mt-2" style={{ color: C.textMuted }}>Net Promoter Score</div>
            <div
              className="inline-block mt-4 px-5 py-2 rounded-full font-dm font-semibold"
              style={{ fontSize: "0.85rem", background: "rgba(26,122,109,0.1)", color: C.teal }}
            >
              Zona de Encantamento
            </div>
          </motion.div>

          {/* NPS detail cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {npsDetails.map((d, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.6, ease: EASE }}
                whileHover={{ y: -3, boxShadow: "0 8px 20px rgba(0,0,0,0.05)", transition: { duration: 0.3 } }}
                className="rounded-[14px] p-6"
                style={{ background: C.cream, border: `1px solid ${C.border}` }}
              >
                <div className="font-fraunces font-bold" style={{ fontSize: "2rem", color: C.teal }}>{d.val}</div>
                <div className="font-dm mt-1" style={{ fontSize: "0.82rem", color: C.textMuted }}>{d.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   10. ROI BANNER — accent/orange gradient
══════════════════════════════════════════════ */
function ROIBanner() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  return (
    <section
      ref={ref}
      className="relative py-20 px-6 md:px-10 text-center text-white overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${C.accent} 0%, ${C.accentDark} 100%)` }}
    >
      {/* Grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[.06]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

      <div className="relative z-10 max-w-[1000px] mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          className="font-fraunces font-medium italic leading-[1.35] mb-8 max-w-[800px] mx-auto"
          style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)" }}
        >
          &ldquo;Cuidar de quem cuida da cidade é a estratégia mais eficiente para melhorar o atendimento à população.&rdquo;
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.85 } : {}}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="font-dm mb-12" style={{ fontSize: "0.9rem" }}
        >
          — Tese central do Programa ProSam
        </motion.p>

        <div className="flex flex-wrap justify-center gap-10 md:gap-16">
          {[
            { val: "US$ 4 : 1", lbl: "ROI estimado pela OMS" },
            { val: "R$ 6.568", lbl: "Custo médio/afastamento (INSS)" },
            { val: "96 dias", lbl: "Duração média de afastamento" },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }} className="text-center">
              <span className="block font-fraunces font-bold" style={{ fontSize: "3.5rem", lineHeight: 1 }}>{s.val}</span>
              <span className="block font-dm mt-1" style={{ fontSize: "0.82rem", opacity: 0.85 }}>{s.lbl}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   11. CTA — cream background
══════════════════════════════════════════════ */
function CTASection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  return (
    <section className="py-24 md:py-28 px-6 md:px-10" style={{ background: C.cream }}>
      <div className="max-w-[800px] mx-auto text-center">
        <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}>
          <h2 className="font-fraunces font-bold leading-snug mb-4" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: C.text }}>
            Pronto para transformar a saúde mental do seu <em className="not-italic italic font-medium" style={{ color: C.teal }}>município</em>?
          </h2>
          <p className="font-dm mb-10 max-w-[620px] mx-auto" style={{ fontSize: "1.1rem", color: C.textMuted }}>
            Converse com a equipe da Allos e conheça como o ProSam pode ser implantado na sua cidade — com governança, dados e resultados comprovados.
          </p>
          <motion.a
            href="mailto:institucional@allos.org.br"
            whileHover={{ y: -2, boxShadow: `0 8px 28px rgba(26,122,109,0.4)`, transition: { duration: 0.3 } }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-3 font-dm font-semibold text-white rounded-full transition-colors"
            style={{
              background: C.teal,
              padding: "1.25rem 2.5rem",
              fontSize: "1.1rem",
              boxShadow: `0 4px 20px rgba(26,122,109,0.3)`,
            }}
          >
            Falar com a equipe Allos
            <motion.svg
              width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </motion.svg>
          </motion.a>
          <p className="font-dm mt-6" style={{ fontSize: "0.88rem", color: C.textMuted }}>
            institucional@allos.org.br
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
export default function ProSamBelaVistaContent() {
  return (
    <>
      <HeroSection />
      <CrisisSection />
      <AboutSection />
      <LensesSection />
      <StatsBanner />
      <EvolutionSection />
      <EvidenceSection />
      <NR1Section />
      <SatisfactionSection />
      <ROIBanner />
      <CTASection />
    </>
  );
}
