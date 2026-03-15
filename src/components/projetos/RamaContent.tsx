"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import basePath from "@/lib/basePath";

const EASE = [0.22, 1, 0.36, 1];

const C = {
  terracotta: "#C84B31",
  terracottaDark: "#A33D27",
  cream: "#FDFBF7",
  creamAlt: "#F5F0E8",
  dark: "#111111",
  darkDeep: "#161616",
  textLight: "rgba(253,251,247,0.75)",
  textMuted: "rgba(253,251,247,0.45)",
  border: "rgba(253,251,247,0.07)",
};

const GRAIN = "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
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
      setV(Math.round(e * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to]);
  return <span ref={ref}>{v}{suffix}</span>;
}

const atividades = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.terracotta} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: "Dinâmicas de conversa",
    desc: "Rodas de diálogo que promovem troca de experiências e construção de vínculos entre as participantes.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.terracotta} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        <path d="M12 5.67L8 10h8l-4-4.33z" opacity="0" />
      </svg>
    ),
    title: "Acolhimento",
    desc: "Escuta qualificada e espaço seguro para expressão de emoções, dificuldades e conquistas da maternidade.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.terracotta} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    title: "Percepção e autocuidado",
    desc: "Atividades que desenvolvem a capacidade de autopercepção e práticas de cuidado consigo mesma.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.terracotta} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Fortalecimento emocional",
    desc: "Estratégias para lidar com os desafios do cotidiano e construir resiliência emocional.",
  },
];

const territories = [
  { name: "Vigário Geral", sub: "Zona Norte, Rio de Janeiro" },
  { name: "Parada de Lucas", sub: "Zona Norte, Rio de Janeiro" },
  { name: "Jardim América", sub: "Zona Norte, Rio de Janeiro" },
];

/* ══════════════════════════════════════════════
   1. ABOUT SECTION
══════════════════════════════════════════════ */
function AboutSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <section
      className="relative py-20 md:py-28 px-6 md:px-10 overflow-hidden"
      style={{ background: `radial-gradient(ellipse at 50% 0%,rgba(200,75,49,.04) 0%,transparent 50%),${C.dark}` }}
    >
      {/* Grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[.025]" style={{ backgroundImage: GRAIN }} />

      {/* Decorative circles */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 1.2, ease: EASE }}
        className="absolute right-10 top-16 hidden lg:block pointer-events-none"
      >
        <svg width="200" height="200" viewBox="0 0 240 240" fill="none" opacity="0.05">
          <circle cx="120" cy="120" r="116" stroke={C.terracotta} strokeWidth="0.8" strokeDasharray="8 5" />
          <circle cx="120" cy="120" r="80" stroke={C.terracotta} strokeWidth="0.7" strokeDasharray="4 6" />
          <circle cx="120" cy="120" r="45" stroke={C.terracotta} strokeWidth="0.8" />
          <circle cx="120" cy="120" r="13" stroke={C.terracotta} strokeWidth="0.8" />
          <circle cx="120" cy="120" r="3" fill={C.terracotta} />
        </svg>
      </motion.div>

      <div className="relative z-10 max-w-[1200px] mx-auto">
        <div ref={ref} className="max-w-[800px]">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="font-dm font-semibold text-[11px] tracking-[.26em] uppercase mb-4"
            style={{ color: C.terracotta }}
          >
            Sobre o projeto
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.08, duration: 0.7, ease: EASE }}
            className="font-dm leading-relaxed mb-6"
            style={{ fontSize: "clamp(16px,1.8vw,19px)", color: C.textLight }}
          >
            A Rede RAMA — Rede de Apoio a Mães e Acompanhantes — é um projeto desenvolvido em
            parceria com o PROINEPE nos territórios de Vigário Geral, Parada de Lucas e Jardim América,
            no Rio de Janeiro.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.14, duration: 0.6 }}
            className="font-dm leading-relaxed mb-6"
            style={{ fontSize: "15px", color: C.textMuted }}
          >
            A Allos atua desde setembro de 2025 oferecendo grupos de acolhimento e fortalecimento
            emocional para mães em situação de vulnerabilidade social. O projeto promove espaços
            seguros de escuta, troca e desenvolvimento de estratégias de enfrentamento, contribuindo
            para a saúde mental materna e o fortalecimento de vínculos comunitários.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-dm leading-relaxed mb-10"
            style={{ fontSize: "15px", color: C.textMuted }}
          >
            A atuação integra dinâmicas de conversa, atividades de autocuidado e percepção emocional,
            sempre em diálogo com a realidade e as demandas das participantes.
          </motion.p>

          {/* Quote callout */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.7, ease: EASE }}
            className="rounded-xl p-6"
            style={{
              borderLeft: `4px solid ${C.terracotta}`,
              background: "rgba(253,251,247,0.03)",
            }}
          >
            <p className="font-fraunces italic leading-relaxed" style={{ fontSize: "clamp(15px,1.6vw,18px)", color: C.textLight }}>
              &ldquo;Criar rede é reconhecer que nenhuma mãe precisa caminhar sozinha — juntas,
              transformamos vulnerabilidade em potência.&rdquo;
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   2. TERRITORIES SECTION
══════════════════════════════════════════════ */
function TerritoriesSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });
  return (
    <section
      className="py-20 md:py-28 px-6 md:px-10"
      style={{ background: C.darkDeep }}
    >
      <div className="max-w-[1200px] mx-auto">
        <motion.p
          ref={ref}
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="font-dm font-semibold text-[11px] tracking-[.26em] uppercase mb-4"
          style={{ color: C.terracotta }}
        >
          Onde atuamos
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.08, duration: 0.7, ease: EASE }}
          className="font-fraunces font-bold leading-snug mb-12"
          style={{ fontSize: "clamp(24px,3.5vw,36px)", color: C.cream }}
        >
          Territórios de atuação
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {territories.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.65, ease: EASE }}
              whileHover={{ y: -5, transition: { duration: 0.25 } }}
              className="group relative rounded-2xl overflow-hidden"
              style={{ background: "rgba(253,251,247,0.03)", border: `1px solid ${C.border}` }}
            >
              <div
                className="h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                style={{ background: `linear-gradient(to right,${C.terracotta},rgba(200,75,49,0))` }}
              />
              <div className="p-8 flex items-start gap-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.terracotta} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-1">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <div>
                  <h3 className="font-fraunces font-bold text-lg mb-1" style={{ color: C.cream }}>
                    {t.name}
                  </h3>
                  <p className="font-dm text-sm" style={{ color: C.textMuted }}>
                    {t.sub}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   3. IMPACT STATS
══════════════════════════════════════════════ */
function ImpactStats() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  return (
    <section
      ref={ref}
      className="py-20 md:py-28 px-6 md:px-10 relative overflow-hidden text-center"
      style={{ background: `linear-gradient(135deg,${C.terracotta} 0%,${C.terracottaDark} 100%)` }}
    >
      {/* Grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[.06]" style={{ backgroundImage: GRAIN }} />

      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-[.08]" style={{ border: "1px solid white" }} />
      <div className="absolute -bottom-12 -left-12 w-56 h-56 rounded-full opacity-[.06]" style={{ border: "1px solid white" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-[.04]" style={{ border: "1px solid white" }} />

      <div className="relative z-10 max-w-[1000px] mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          className="font-fraunces font-light text-white italic mb-12"
          style={{ fontSize: "clamp(19px,3vw,30px)" }}
        >
          Impacto nos territórios —{" "}
          <span className="font-bold not-italic">construindo rede, fortalecendo vidas</span>
        </motion.h2>
        <div className="flex flex-wrap justify-center gap-12 md:gap-20">
          {[
            { v: 50, s: "+", l: "Mães atendidas" },
            { v: 3, s: "", l: "Territórios" },
            { v: 6, s: "+", l: "Meses de atuação" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.6 }}
              className="text-center"
            >
              <span
                className="block font-fraunces font-bold text-white"
                style={{ fontSize: "clamp(52px,7vw,72px)", lineHeight: 1 }}
              >
                <CountUp to={s.v} suffix={s.s} />
              </span>
              <span className="block font-dm text-white/80 text-sm mt-2.5 uppercase tracking-wider">
                {s.l}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   4. PHOTO GALLERY
══════════════════════════════════════════════ */
function PhotoGallery() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <section
      className="py-20 md:py-28 px-6 md:px-10 relative overflow-hidden"
      style={{ background: `radial-gradient(ellipse at 80% 20%, rgba(200,75,49,0.04) 0%, transparent 50%),${C.creamAlt}` }}
    >
      <div className="max-w-[1200px] mx-auto">
        <div ref={ref} className="mb-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="font-dm font-semibold text-[11px] tracking-[.26em] uppercase mb-4"
            style={{ color: C.terracotta }}
          >
            Registro
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.08, duration: 0.7, ease: EASE }}
            className="font-fraunces font-bold text-[#1A1A1A] leading-snug"
            style={{ fontSize: "clamp(24px,3.5vw,36px)" }}
          >
            Momentos do projeto
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-6">
          {["projetoRAMA1.jpeg", "projetoRAMA2.jpeg"].map((img, i) => (
            <motion.div
              key={img}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.7, ease: EASE }}
              whileHover={{ scale: 1.03, transition: { duration: 0.4 } }}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden"
              style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}
            >
              <Image
                src={`${basePath}/${img}`}
                alt={`Rede RAMA — Registro ${i + 1}`}
                fill
                className="object-cover"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   5. ACTIVITIES SECTION
══════════════════════════════════════════════ */
function AtividadeCard({ item, index }: { item: typeof atividades[0]; index: number }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });
  const num = String(index + 1).padStart(2, "0");
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.65, ease: EASE }}
      whileHover={{ y: -5, transition: { duration: 0.25 } }}
      className="group relative rounded-2xl overflow-hidden flex flex-col"
      style={{ background: "rgba(253,251,247,0.03)", border: `1px solid ${C.border}` }}
    >
      <div
        className="h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
        style={{ background: `linear-gradient(to right,${C.terracotta},rgba(200,75,49,0))` }}
      />
      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-5">
          <span>{item.icon}</span>
          <span className="font-dm font-bold text-xs tracking-[.15em]" style={{ color: C.terracotta }}>
            {num}
          </span>
        </div>
        <h3
          className="font-fraunces font-bold mb-4 leading-snug"
          style={{ fontSize: "clamp(17px,1.8vw,20px)", color: C.cream }}
        >
          {item.title}
        </h3>
        <p
          className="font-dm leading-relaxed flex-1"
          style={{ fontSize: "15px", color: C.textMuted }}
        >
          {item.desc}
        </p>
      </div>
    </motion.div>
  );
}

function ActivitiesSection() {
  return (
    <section
      className="py-20 md:py-28 px-6 md:px-10"
      style={{ background: `radial-gradient(ellipse at 95% 0%,rgba(200,75,49,.04) 0%,transparent 50%),${C.darkDeep}` }}
    >
      <div className="max-w-[1200px] mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="font-fraunces font-bold mb-3 leading-snug"
          style={{ fontSize: "clamp(24px,3.5vw,36px)", color: C.cream }}
        >
          Nossas Atividades
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="flex items-center gap-6 mb-12 origin-left"
        >
          <div className="h-px flex-1" style={{ background: C.border }} />
          <span className="font-dm text-[10px] tracking-[.28em] uppercase flex-shrink-0" style={{ color: "rgba(253,251,247,0.25)" }}>
            O que fazemos
          </span>
          <div className="h-px flex-1" style={{ background: C.border }} />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {atividades.map((item, i) => (
            <AtividadeCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   6. CTA SECTION
══════════════════════════════════════════════ */
function CTASection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  return (
    <section
      ref={ref}
      className="py-20 md:py-28 px-6 md:px-10 text-center"
      style={{ background: C.creamAlt }}
    >
      <div className="max-w-[600px] mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          className="font-fraunces font-bold text-[#1A1A1A] leading-snug mb-4"
          style={{ fontSize: "clamp(24px,3.5vw,36px)" }}
        >
          Quer conhecer o projeto RAMA?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="font-dm text-[#5C5C5C] mb-8 leading-relaxed"
          style={{ fontSize: "clamp(14px,1.6vw,17px)" }}
        >
          Acompanhe nossas atividades, conheça as histórias das participantes e saiba como apoiar o projeto.
        </motion.p>
        <motion.a
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          href="https://www.instagram.com/associacaoallos/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 font-dm font-semibold text-white rounded-full"
          style={{
            background: C.terracotta,
            padding: "14px 32px",
            fontSize: "15px",
            boxShadow: `0 6px 22px rgba(200,75,49,.35), inset 0 1px 0 rgba(255,255,255,.1)`,
          }}
          whileHover={{ scale: 1.04, boxShadow: "0 10px 32px rgba(200,75,49,.5)" }}
          whileTap={{ scale: 0.97 }}
        >
          Siga no Instagram
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.a>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════ */
export default function RamaContent() {
  return (
    <>
      <AboutSection />
      <TerritoriesSection />
      <ImpactStats />
      <PhotoGallery />
      <ActivitiesSection />
      <CTASection />
    </>
  );
}
