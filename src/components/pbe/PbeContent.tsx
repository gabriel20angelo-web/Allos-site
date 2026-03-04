"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ── constants ── */
const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = [0.34, 1.56, 0.64, 1] as const;
const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const COLORS = {
  estrutura: "#C84B31",
  relacao: "#D4854A",
  formulacao: "#B84060",
  performance: "#8B5CF6",
};

/* ── reusable components ── */

function Grain({ opacity = 0.025 }: { opacity?: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ backgroundImage: GRAIN, opacity }}
    />
  );
}

function GlowTL() {
  return (
    <div
      className="absolute top-0 left-0 w-[600px] h-[500px] pointer-events-none"
      style={{
        background:
          "radial-gradient(ellipse at top left,rgba(200,75,49,.1) 0%,transparent 65%)",
      }}
    />
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-12">
      <div
        className="h-px w-12"
        style={{
          background:
            "linear-gradient(to right,transparent,rgba(200,75,49,0.4))",
        }}
      />
      <p className="font-dm font-semibold text-[11px] tracking-[.26em] text-[#C84B31] uppercase">
        {label}
      </p>
      <div
        className="h-px flex-1 max-w-[200px]"
        style={{
          background:
            "linear-gradient(to right,rgba(200,75,49,0.4),transparent)",
        }}
      />
    </div>
  );
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Ornament() {
  return (
    <div className="flex items-center justify-center gap-3 py-12">
      <div className="w-1.5 h-1.5 rounded-full bg-[#C84B31] opacity-50" />
      <div className="h-px w-12 bg-[#C84B31] opacity-20" />
      <div className="w-2 h-2 rounded-full bg-[#C84B31]" />
      <div className="h-px w-12 bg-[#C84B31] opacity-20" />
      <div className="w-1.5 h-1.5 rounded-full bg-[#C84B31] opacity-50" />
    </div>
  );
}

function QuoteBlock({
  children,
  author,
}: {
  children: React.ReactNode;
  author?: string;
}) {
  return (
    <div
      className="relative rounded-2xl p-8 pl-10"
      style={{
        background: "rgba(200,75,49,0.06)",
        border: "1px solid rgba(200,75,49,0.15)",
      }}
    >
      <span
        className="absolute top-2 left-4 font-fraunces text-[64px] text-[#C84B31] opacity-30 leading-none select-none"
        aria-hidden
      >
        &ldquo;
      </span>
      <p className="font-dm text-sm leading-relaxed italic" style={{ color: "rgba(253,251,247,0.65)" }}>
        {children}
      </p>
      {author && (
        <p className="font-dm text-[13px] font-semibold text-[#C84B31] mt-3 not-italic">
          {author}
        </p>
      )}
    </div>
  );
}

function Card({
  children,
  className = "",
  accent = false,
  terra = false,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  accent?: boolean;
  terra?: boolean;
  style?: React.CSSProperties;
}) {
  const base: React.CSSProperties = terra
    ? {
        background: "rgba(200,75,49,0.06)",
        border: "1px solid rgba(200,75,49,0.15)",
        borderLeft: "3px solid rgba(200,75,49,0.5)",
      }
    : {
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        ...(accent ? { borderLeft: "3px solid #C84B31" } : {}),
      };
  return (
    <motion.div
      className={`rounded-xl p-7 ${className}`}
      style={{ ...base, ...style }}
      whileHover={{ y: -3, transition: { duration: 0.25 } }}
    >
      {children}
    </motion.div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-dm font-semibold text-[11px] tracking-[.26em] text-[#C84B31] uppercase mb-3">
      {children}
    </p>
  );
}

function CompCard({
  name,
  category,
  color,
}: {
  name: string;
  category: string;
  color: string;
}) {
  return (
    <motion.div
      className="rounded-xl py-4 px-5"
      style={{
        background: "rgba(253,251,247,0.022)",
        border: "1px solid rgba(253,251,247,0.055)",
        borderLeft: `3px solid ${color}`,
      }}
      whileHover={{ y: -2, background: "rgba(253,251,247,0.04)" }}
      transition={{ duration: 0.25 }}
    >
      <p
        className="font-dm text-[10px] font-semibold tracking-[.2em] uppercase mb-1"
        style={{ color }}
      >
        {category}
      </p>
      <p className="font-dm text-sm" style={{ color: "rgba(253,251,247,0.55)" }}>
        {name}
      </p>
    </motion.div>
  );
}

/* ── SVG: graph ── */
function StagnationGraph() {
  return (
    <svg viewBox="0 0 280 160" fill="none" className="w-full h-auto">
      <line x1="40" y1="140" x2="270" y2="140" stroke="rgba(253,251,247,.1)" strokeWidth="1" />
      <line x1="40" y1="100" x2="270" y2="100" stroke="rgba(253,251,247,.05)" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="40" y1="60" x2="270" y2="60" stroke="rgba(253,251,247,.05)" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="40" y1="20" x2="270" y2="20" stroke="rgba(253,251,247,.05)" strokeWidth="1" strokeDasharray="4 4" />
      <path d="M40 130 Q100 120 140 80 Q180 40 260 25" stroke="rgba(253,251,247,.2)" strokeWidth="1.5" strokeDasharray="6 4" fill="none" />
      <path d="M40 130 Q80 120 120 115 Q160 112 200 115 Q240 118 260 120" stroke="#C84B31" strokeWidth="2.5" fill="none" />
      <text x="260" y="18" fill="rgba(253,251,247,.3)" fontSize="9" fontFamily="DM Sans" textAnchor="end">Esperado</text>
      <text x="260" y="135" fill="#C84B31" fontSize="9" fontFamily="DM Sans" textAnchor="end">Real</text>
      <text x="150" y="156" fill="rgba(253,251,247,.3)" fontSize="9" fontFamily="DM Sans" textAnchor="middle">Anos de experiência</text>
    </svg>
  );
}

/* ── dot grid bg ── */
const DOT_GRID = {
  backgroundImage:
    "radial-gradient(circle, rgba(200,75,49,0.04) 1px, transparent 1px)",
  backgroundSize: "32px 32px",
};

/* ══════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════ */

export default function PbeContent() {
  return (
    <div className="relative">
      {/* ─── TOC NAV (sticky) ─── */}
      <nav
        className="hidden lg:flex sticky top-[68px] z-50 items-center justify-center gap-6 py-3 px-6"
        style={{
          background: "rgba(26,26,26,0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(253,251,247,0.06)",
        }}
      >
        {[
          ["#historia", "História da PBE"],
          ["#debate", "O Debate"],
          ["#estagnacao", "Estagnação"],
          ["#miller", "Scott Miller"],
          ["#pratica", "Prática Deliberada"],
          ["#allos", "Método Allos"],
          ["#avaliallos", "AvaliAllos"],
        ].map(([href, label]) => (
          <a
            key={href}
            href={href}
            className="font-dm text-xs font-medium transition-colors hover:text-[#C84B31]"
            style={{ color: "rgba(253,251,247,0.45)", letterSpacing: ".02em" }}
          >
            {label}
          </a>
        ))}
      </nav>

      {/* ═══════════════════════════════════════
          CAPÍTULO 01 — HISTÓRIA DA PBE
          ═══════════════════════════════════════ */}
      <section id="historia" className="relative py-20 md:py-28" style={{ background: "#1A1A1A" }}>
        <Grain />
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <SectionDivider label="Capítulo 01" />

          <Reveal>
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
              {/* left */}
              <div>
                <h2 className="font-fraunces font-bold text-[#FDFBF7] mb-6" style={{ fontSize: "clamp(28px,4vw,48px)", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
                  A História da Psicologia{" "}
                  <span className="italic text-[#C84B31]">Baseada em Evidências</span>
                </h2>
                <p className="font-dm leading-relaxed" style={{ color: "rgba(253,251,247,0.55)" }}>
                  O movimento da Psicologia Baseada em Evidências (PBE) nasceu da tentativa de aplicar o modelo médico à psicoterapia. Assim como a medicina compara intervenções e utiliza a eficácia clínica para avaliar o que funciona, a psicologia passou a buscar evidências em ensaios clínicos randomizados.
                </p>
                <p className="font-dm leading-relaxed" style={{ color: "rgba(253,251,247,0.55)" }}>
                  Os estudos geralmente iniciam com um transtorno específico, como a depressão, e comparam o impacto de diferentes tratamentos, como a psicanálise e a TCC. Essa metodologia tornou-se a forma padrão de produzir conhecimento sobre intervenções. Além da eficácia, outros critérios como plausibilidade e solidez teórica poderiam ser considerados — mas não foram incluídos nessas pesquisas.
                </p>
              </div>

              {/* right */}
              <div className="flex flex-col gap-5">
                <Card terra>
                  <Label>Modelo Médico</Label>
                  <p className="font-dm text-sm" style={{ color: "rgba(253,251,247,0.55)" }}>
                    Diagnóstico específico → Tratamento específico → Resultado mensurável. A psicologia tentou replicar essa lógica importando a estrutura dos ensaios clínicos randomizados da medicina farmacêutica e adotando o DSM como base.
                  </p>
                </Card>
                <Card>
                  <Label>DSM como Base</Label>
                  <p className="font-dm text-sm" style={{ color: "rgba(253,251,247,0.55)" }}>
                    O DSM categorizou transtornos psicológicos em categorias diagnósticas distintas, permitindo que pesquisadores testassem tratamentos para cada categoria — mas com problemas fundamentais de delimitação.
                  </p>
                </Card>
              </div>
            </div>
          </Reveal>

          {/* 2 PROBLEMAS */}
          <Reveal className="mt-16 md:mt-24">
            <h3 className="font-fraunces font-semibold text-[#FDFBF7] mb-3" style={{ fontSize: "clamp(20px,2.5vw,28px)", letterSpacing: "-0.02em" }}>
              Os Dois Grandes Problemas
            </h3>
            <p className="font-dm text-sm mb-10" style={{ color: "rgba(253,251,247,0.45)", maxWidth: 700 }}>
              Dois problemas fundamentais surgiram ao tentar encaixar a psicoterapia no modelo médico:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Problem 1 */}
              <div className="flex gap-5">
                <div
                  className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center font-fraunces font-bold text-lg text-[#C84B31]"
                  style={{ background: "rgba(200,75,49,0.1)", border: "1px solid rgba(200,75,49,0.25)" }}
                >
                  1
                </div>
                <div>
                  <h4 className="font-fraunces font-semibold text-[#FDFBF7] text-lg mb-2">
                    Definir o Transtorno
                  </h4>
                  <p className="font-dm text-sm" style={{ color: "rgba(253,251,247,0.5)" }}>
                    Na medicina, é fácil diferenciar um tumor cerebral de uma gripe. Em psicologia, conceitos como vício e transtorno borderline se confundem com uma sobreposição de cerca de <strong className="text-[#C84B31]">80%</strong>. A psicometria define a existência pelo que não se correlaciona discretamente com outra coisa — evidenciando a dificuldade do DSM em delimitar os fenômenos.
                  </p>
                </div>
              </div>

              {/* Problem 2 */}
              <div className="flex gap-5">
                <div
                  className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center font-fraunces font-bold text-lg text-[#C84B31]"
                  style={{ background: "rgba(200,75,49,0.1)", border: "1px solid rgba(200,75,49,0.25)" }}
                >
                  2
                </div>
                <div>
                  <h4 className="font-fraunces font-semibold text-[#FDFBF7] text-lg mb-2">
                    Medir o Sucesso Terapêutico
                  </h4>
                  <p className="font-dm text-sm" style={{ color: "rgba(253,251,247,0.5)" }}>
                    Contar cortes em casos de automutilação pode não captar a real melhora — o paciente pode parar de se cortar e se autodestruir de outras formas. Questionários são enviesados e muitas pessoas não têm plena consciência de seus sentimentos, tornando impreciso assumir que o indivíduo conhece completamente seu estado emocional.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CAPÍTULO 02 — O GRANDE DEBATE
          ═══════════════════════════════════════ */}
      <section id="debate" className="relative py-20 md:py-28" style={{ background: "#141414" }}>
        <Grain />
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <SectionDivider label="Capítulo 02" />

          <Reveal>
            <h2 className="font-fraunces font-bold text-[#FDFBF7] mb-4" style={{ fontSize: "clamp(28px,4vw,48px)", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
              O Grande Debate:{" "}
              <span className="italic text-[#C84B31]">Barlow vs. Wampold</span>
            </h2>
            <p className="font-dm mb-12" style={{ color: "rgba(253,251,247,0.45)", maxWidth: 720 }}>
              No coração da PBE há uma disputa que moldou décadas de pesquisa. Barlow defendia que existem métodos superiores a outros, enquanto Wampold argumentava que, se a avaliação não se basear no DSM, todas as abordagens mostram impacto — pois os fatores comuns é que promovem a cura.
            </p>
          </Reveal>

          {/* comparison */}
          <Reveal>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Barlow */}
              <div
                className="rounded-2xl p-8 relative overflow-hidden"
                style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <h3 className="font-fraunces font-semibold text-xl mb-1" style={{ color: "rgba(253,251,247,0.85)" }}>
                  David Barlow
                </h3>
                <p className="font-dm text-[13px] font-semibold text-[#C84B31] mb-4">
                  Tratamentos específicos importam
                </p>
                <p className="font-dm text-sm mb-4" style={{ color: "rgba(253,251,247,0.5)" }}>
                  Defende que determinadas abordagens são superiores a outras para transtornos específicos. Conduz pesquisas para identificar quais intervenções produzem resultados, classificando as ineficazes como pseudociência — em alguns casos usando recursos legais para impedir sua continuidade.
                </p>
                <ul className="space-y-2">
                  {["O método importa mais que o terapeuta", "Protocolos manualizados por diagnóstico DSM", "Abordagens ineficazes são pseudociência", "Base: modelo médico aplicado à psicologia"].map((t, i) => (
                    <li key={i} className="font-dm text-sm flex gap-2" style={{ color: "rgba(253,251,247,0.45)", borderBottom: "1px solid rgba(253,251,247,0.06)", paddingBottom: 8 }}>
                      <span className="text-[#C84B31] font-semibold">→</span> {t}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Wampold */}
              <div
                className="rounded-2xl p-8 relative overflow-hidden"
                style={{ background: "rgba(200,75,49,0.06)", border: "1px solid rgba(200,75,49,0.25)" }}
              >
                <h3 className="font-fraunces font-semibold text-xl text-[#FDFBF7] mb-1">
                  Bruce Wampold
                </h3>
                <p className="font-dm text-[13px] font-semibold text-[#C84B31] mb-4">
                  A abordagem não é o fator decisivo
                </p>
                <p className="font-dm text-sm mb-4" style={{ color: "rgba(253,251,247,0.55)" }}>
                  Quando a avaliação não está vinculada a um construto específico do DSM — que ele considera um instrumento inadequado —, todas as abordagens terapêuticas mostram impacto similar. Os <strong className="text-[#FDFBF7]">fatores comuns</strong> são os que realmente promovem a cura.
                </p>
                <ul className="space-y-2">
                  {["Fatores comuns impulsionam a cura", "Aliança terapêutica é o preditor central", "O terapeuta importa mais que a técnica", "Base: meta-análises e dados transversais"].map((t, i) => (
                    <li key={i} className="font-dm text-sm flex gap-2" style={{ color: "rgba(253,251,247,0.55)", borderBottom: "1px solid rgba(253,251,247,0.06)", paddingBottom: 8 }}>
                      <span className="text-[#C84B31] font-semibold">→</span> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          {/* insight */}
          <Reveal className="mt-10">
            <div
              className="rounded-2xl p-8 relative"
              style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.2)", borderLeft: "4px solid #8B5CF6" }}
            >
              <p className="font-dm font-semibold text-[11px] tracking-[.26em] uppercase mb-3" style={{ color: "#8B5CF6" }}>
                Implicação Fundamental
              </p>
              <p className="font-dm text-sm" style={{ color: "rgba(253,251,247,0.65)" }}>
                Se Wampold está correto — e os dados consistentemente apontam nessa direção — o foco da formação deveria sair dos protocolos específicos e ir para o <strong className="text-[#FDFBF7]">desenvolvimento do terapeuta como instrumento de cura</strong>. A pergunta não é &ldquo;qual técnica usar?&rdquo;, mas &ldquo;como formar terapeutas excelentes?&rdquo;
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CAPÍTULO 03 — ESTAGNAÇÃO
          ═══════════════════════════════════════ */}
      <section id="estagnacao" className="relative py-20 md:py-28" style={{ background: "#1A1A1A" }}>
        <Grain />
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <SectionDivider label="Capítulo 03" />

          <Reveal>
            <h2 className="font-fraunces font-bold text-[#FDFBF7] mb-6" style={{ fontSize: "clamp(28px,4vw,48px)", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
              Terapeutas Não Melhoram{" "}
              <span className="italic text-[#C84B31]">com Experiência</span>
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {/* left col */}
            <Reveal>
              <p className="font-dm leading-relaxed mb-4" style={{ color: "rgba(253,251,247,0.55)" }}>
                Uma das descobertas mais perturbadoras é que <strong className="text-[#FDFBF7]">clínicos não melhoram com o tempo</strong>. O gráfico de Wampold indica que, com o passar dos anos, os resultados dos profissionais mais experientes são praticamente iguais aos dos iniciantes — em média, os clínicos tendem a piorar um pouco.
              </p>
              <p className="font-dm leading-relaxed mb-8" style={{ color: "rgba(253,251,247,0.45)" }}>
                Isso contraria profundamente a intuição. Afinal, em quase todas as profissões, a experiência melhora o desempenho.
              </p>

              {/* highlight box: 3 explanations */}
              <div
                className="rounded-2xl p-8 relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg,rgba(200,75,49,0.06),rgba(200,75,49,0.02))",
                  border: "1px solid rgba(200,75,49,0.25)",
                }}
              >
                <span
                  className="absolute -right-5 -bottom-5 font-fraunces font-bold text-[#FDFBF7] pointer-events-none select-none"
                  style={{ fontSize: "clamp(60px,10vw,120px)", opacity: 0.025, lineHeight: 1 }}
                  aria-hidden
                >
                  Por quê?
                </span>

                <h4 className="font-fraunces font-semibold text-[#FDFBF7] text-lg mb-5">
                  Três Explicações Complementares
                </h4>

                <div className="space-y-5">
                  <div>
                    <p className="font-dm text-[13px] font-semibold text-[#C84B31] mb-1">
                      1. A Analogia do Basquete
                    </p>
                    <p className="font-dm text-sm" style={{ color: "rgba(253,251,247,0.55)" }}>
                      Se alguém treina vendado, sem ver a trajetória da bola, não progride. Segundo a tese de Reis, a melhoria depende do conhecimento profundo das consequências das próprias intervenções. Sem esse retorno, o terapeuta age às cegas.
                    </p>
                  </div>
                  <div>
                    <p className="font-dm text-[13px] font-semibold text-[#C84B31] mb-1">
                      2. A Cristalização do Conhecimento
                    </p>
                    <p className="font-dm text-sm" style={{ color: "rgba(253,251,247,0.55)" }}>
                      Inspirado em Jung: não há diferença real entre conhecimento e a cristalização de preconceitos. O terapeuta para de ouvir, acha que já sabe. Em terapia de casal, a intervenção frequentemente consiste em promover a escuta mútua — justamente para combater essa cristalização.
                    </p>
                  </div>
                  <div>
                    <p className="font-dm text-[13px] font-semibold text-[#C84B31] mb-1">
                      3. O Ensino Incorreto
                    </p>
                    <p className="font-dm text-sm" style={{ color: "rgba(253,251,247,0.55)" }}>
                      A psicologia é ensinada de forma que não produz aprendizado real. Nenhuma universidade ensina de fato, e a formação acaba não fazendo diferença nenhuma na prática clínica.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* right col */}
            <Reveal delay={0.15}>
              <Card className="text-center !p-10 mb-6">
                <Label>A curva de melhora esperada vs. real</Label>
                <div className="max-w-[280px] mx-auto mt-4 mb-4">
                  <StagnationGraph />
                </div>
                <p className="font-dm text-xs mt-4" style={{ color: "rgba(253,251,247,0.3)" }}>
                  A linha terracota mostra a realidade: eficácia estagnada ou em leve declínio ao longo da carreira.
                </p>
              </Card>

              <QuoteBlock>
                A experiência sem feedback é apenas repetição de hábitos — bons ou ruins.
              </QuoteBlock>

              <Card accent className="mt-6">
                <p className="font-dm text-sm" style={{ color: "rgba(253,251,247,0.5)" }}>
                  <strong className="text-[#FDFBF7]">O dado mais impactante:</strong> Scott Miller comparou alunos ingressantes com formados e encontrou diferença praticamente irrelevante. A experiência clínica acumulada e os métodos de ensino atualmente adotados não parecem fazer a diferença desejada — o que chocou muitos na área.
                </p>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CAPÍTULO 04 — SCOTT MILLER
          ═══════════════════════════════════════ */}
      <section
        id="miller"
        className="relative py-20 md:py-28"
        style={{ background: "#141414", ...DOT_GRID }}
      >
        <Grain />
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <SectionDivider label="Capítulo 04" />

          <Reveal>
            <h2 className="font-fraunces font-bold text-[#FDFBF7] mb-4" style={{ fontSize: "clamp(28px,4vw,48px)", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
              As Descobertas de{" "}
              <span className="italic text-[#C84B31]">Scott Miller</span>
            </h2>
            <p className="font-dm mb-12" style={{ color: "rgba(253,251,247,0.45)", maxWidth: 720 }}>
              Passaram a focar pesquisas nos clínicos experientes, mas o próprio estudo de Miller demonstrou que o grau de formação não diferencia os profissionais. Então, começaram a comparar terapeutas cujos pacientes melhoraram muito com aqueles cujos resultados foram piores.
            </p>
          </Reveal>

          <Reveal>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <Card>
                <Label>Diferença entre Terapeutas</Label>
                <p className="font-dm text-sm" style={{ color: "rgba(253,251,247,0.5)" }}>
                  As diferenças são enormes: terapeutas de alto desempenho apresentam taxas de suicídio dos pacientes até <strong className="text-[#C84B31]">10 vezes menores</strong>. Não é marginal — é o abismo entre vida e morte.
                </p>
              </Card>
              <Card>
                <Label>Autoavaliação de Empatia</Label>
                <p className="font-dm text-sm" style={{ color: "rgba(253,251,247,0.5)" }}>
                  Quando o terapeuta se avalia como sensível, <strong className="text-[#C84B31]">não há correlação</strong> com sucesso clínico. Porém, quando o <em>paciente</em> relata que seu terapeuta é sensível, há forte correlação com melhores resultados. A percepção do paciente é tudo.
                </p>
              </Card>
            </div>
          </Reveal>

          {/* Timeline */}
          <Reveal>
            <h3 className="font-fraunces font-semibold text-[#FDFBF7] text-xl mb-8">
              Achados Contraintuitivos
            </h3>
            <div className="relative pl-8 space-y-10">
              {/* vertical line */}
              <div
                className="absolute left-[11px] top-0 bottom-0 w-[2px] rounded-full"
                style={{ background: "linear-gradient(to bottom,#C84B31,rgba(200,75,49,0.1))" }}
              />

              {[
                {
                  title: "O Melhor Preditor: Insegurança",
                  text: "Cerca de 80% dos psicólogos acreditam atender acima da média. Curiosamente, um dos fatores que mais se correlaciona com bom desempenho é não ter essa certeza. Terapeutas inseguros sentem necessidade de se esforçar mais — estudam, treinam, revisam — por um mecanismo semelhante à síndrome do impostor.",
                },
                {
                  title: "Aliança: Rupturas e Reparações",
                  text: "As melhores alianças terapêuticas são marcadas por constantes rupturas e reestabelecimentos. Uma relação estável demais — acolhimento passivo constante ou postura sempre agressiva — tende a ser menos produtiva. O padrão ideal envolve conflitos seguidos de reparação, permitindo que a relação evolua e reflita a complexidade das relações reais.",
                },
                {
                  title: "A Formação Acadêmica Não Distingue",
                  text: "Apesar da ênfase em pesquisas com clínicos de pós-doutorado, o estudo de Miller demonstrou que o grau de formação não diferencia os profissionais. A formação acadêmica não distingue um clínico de outro. O que distingue é outra coisa.",
                },
              ].map((item, i) => (
                <div key={i} className="relative">
                  <div
                    className="absolute -left-8 top-[6px] w-6 h-6 rounded-full"
                    style={{ background: "#1A1A1A", border: "2px solid #C84B31" }}
                  />
                  <div
                    className="absolute -left-[25px] top-[13px] w-[10px] h-[10px] rounded-full bg-[#C84B31]"
                  />
                  <h4 className="font-fraunces font-semibold text-[#FDFBF7] text-lg mb-2">
                    {item.title}
                  </h4>
                  <p className="font-dm text-sm" style={{ color: "rgba(253,251,247,0.5)" }}>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CAPÍTULO 05 — PRÁTICA DELIBERADA
          ═══════════════════════════════════════ */}
      <section id="pratica" className="relative py-20 md:py-28" style={{ background: "#1A1A1A" }}>
        <Grain />
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <SectionDivider label="Capítulo 05" />

          <Reveal>
            <h2 className="font-fraunces font-bold text-[#FDFBF7] mb-6" style={{ fontSize: "clamp(28px,4vw,48px)", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
              Prática Deliberada{" "}
              <span className="italic text-[#C84B31]">em Psicoterapia</span>
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            <Reveal>
              <p className="font-dm leading-relaxed mb-4" style={{ color: "rgba(253,251,247,0.55)" }}>
                É um conceito que vem da psicologia do esporte e propõe diferenciar <strong className="text-[#FDFBF7]">performance</strong> de <strong className="text-[#FDFBF7]">treino</strong>. Na performance, como numa pelada de vôlei, a pessoa realiza várias ações sem saber exatamente o que funciona — é o basquete vendado. No treino, o treinador fornece feedback específico sobre cada movimento.
              </p>
              <p className="font-dm leading-relaxed mb-4" style={{ color: "rgba(253,251,247,0.55)" }}>
                Pessoas clinicamente excelentes, seja de forma intuitiva ou consciente, treinam de maneira específica, recebendo feedback externo e repetindo movimentos, quebrando aspectos complexos e simples das suas habilidades.
              </p>
              <p className="font-dm leading-relaxed mb-4" style={{ color: "rgba(253,251,247,0.55)" }}>
                Na graduação, a prática vem depois da teoria. É como se, numa aula de natação, ao invés de entrar na piscina com boias, o aluno estudasse a história da natação e fosse jogado direto na água. A proposta: desenvolver um modelo que privilegie prática deliberada com feedback específico e repetição.
              </p>
              <p className="font-dm leading-relaxed" style={{ color: "rgba(253,251,247,0.55)" }}>
                Receber feedback em um caso concreto torna possível identificar com clareza os erros. A teoria é útil para explicar por que certas intervenções funcionam, mas o que realmente faz a diferença é a repetição do exercício, não o simples conhecimento teórico.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <Card terra className="mb-6">
                <Label>Formação Tradicional</Label>
                <p className="font-dm text-sm mb-4" style={{ color: "rgba(253,251,247,0.55)" }}>
                  <strong className="text-[#FDFBF7]">1° ao 5° ano:</strong> Teoria, teoria, teoria
                  <br />
                  <strong className="text-[#FDFBF7]">6° ano:</strong> Estágio supervisionado (primeira prática real)
                </p>
                <p className="font-dm text-[13px] italic" style={{ color: "rgba(253,251,247,0.3)" }}>
                  Alunos ouvem ideias dos professores ou autores sem a oportunidade de praticar imediatamente. Quando finalmente praticam, cristalizaram vícios difíceis de corrigir.
                </p>
              </Card>

              <h4 className="font-fraunces font-semibold text-[#FDFBF7] text-lg mt-8 mb-3">
                O Modelo de Miller
              </h4>
              <p className="font-dm text-sm mb-5" style={{ color: "rgba(253,251,247,0.5)" }}>
                Miller defende prática deliberada individual, altamente reflexiva e baseada em autoavaliação. É como um jogador de basquete que, mesmo após 20 anos, treina apenas fundamentos básicos continuamente.
              </p>

              <Card style={{ borderLeft: "3px solid rgba(139,92,246,0.5)" }}>
                <p className="font-dm text-[13px] font-semibold mb-2" style={{ color: "#8B5CF6" }}>
                  ⚠ O Problema do Modelo de Miller
                </p>
                <p className="font-dm text-sm" style={{ color: "rgba(253,251,247,0.5)" }}>
                  O método é entediante, repetitivo e solitário. Miller apresenta <strong className="text-[#FDFBF7]">20% de perda de dados</strong> por conta de um método maçante que foca em exercícios simples executados continuamente. A repetitividade e a simplicidade geram baixa adesão.
                </p>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CAPÍTULO 06 — MÉTODO ALLOS
          ═══════════════════════════════════════ */}
      <section id="allos" className="relative py-20 md:py-28" style={{ background: "#141414" }}>
        <Grain />
        <GlowTL />
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 relative z-10">
          <SectionDivider label="Capítulo 06" />

          <Reveal>
            <h2 className="font-fraunces font-bold text-[#FDFBF7] mb-4" style={{ fontSize: "clamp(28px,4vw,48px)", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
              A Inovação{" "}
              <span className="italic text-[#C84B31]">Allos</span>
            </h2>
            <p className="font-dm mb-6" style={{ color: "rgba(253,251,247,0.45)", maxWidth: 720 }}>
              A Allos se diferencia na maneira de conduzir a prática deliberada: enquanto Scott defende que a prática deve ser técnica, a Allos acredita que ela deve ser divertida.
            </p>
          </Reveal>

          {/* PRINCÍPIO CENTRAL */}
          <Reveal>
            <div
              className="rounded-2xl p-10 relative overflow-hidden mb-12"
              style={{
                background: "linear-gradient(135deg,rgba(200,75,49,0.06),rgba(200,75,49,0.02))",
                border: "1px solid rgba(200,75,49,0.25)",
              }}
            >
              <span
                className="absolute -right-5 -bottom-5 font-fraunces font-bold text-[#FDFBF7] pointer-events-none select-none"
                style={{ fontSize: "clamp(60px,10vw,140px)", opacity: 0.025, lineHeight: 1 }}
                aria-hidden
              >
                Allos
              </span>
              <h3 className="font-fraunces font-semibold text-[#FDFBF7] text-xl mb-4">
                O Princípio Central
              </h3>
              <p className="font-dm text-[15px]" style={{ color: "rgba(253,251,247,0.65)" }}>
                A Allos <strong className="text-[#FDFBF7]">junta treino com performance</strong>. Em vez de separar o momento de aprender do de atender, integra os dois. A formação inclui dinâmicas em grupo e exercícios que estimulem o engajamento — um ambiente de aprendizado dinâmico e participativo que combina exercícios simples e complexos, individuais e coletivos.
              </p>
            </div>
          </Reveal>

          {/* 4 PILARES */}
          <Reveal>
            <div className="grid md:grid-cols-2 gap-5 mb-12">
              <Card accent>
                <Label>Dinâmica Grupal</Label>
                <p className="font-dm text-sm" style={{ color: "rgba(253,251,247,0.5)" }}>
                  Em vez do modelo individual e solitário de Miller, a Allos usa dinâmicas de grupo que tornam o treinamento <strong className="text-[#FDFBF7]">engajante e social</strong>. Exercícios variam entre simples e complexos, mantendo interesse e motivação.
                </p>
              </Card>
              <Card accent>
                <Label>Avaliação por Pares</Label>
                <p className="font-dm text-sm" style={{ color: "rgba(253,251,247,0.5)" }}>
                  A avaliação entre colegas identifica <strong className="text-[#FDFBF7]">padrões inconscientes</strong>. Uma pessoa observando o atendimento pode identificar aspectos que o próprio terapeuta não percebe — vícios de linguagem, posturas defensivas, pontos cegos. Se perguntar ao cliente, ele pode dizer que foi bom sem perceber os pontos de melhora.
                </p>
              </Card>
              <Card accent>
                <Label>Sem Gabarito Fixo</Label>
                <p className="font-dm text-sm" style={{ color: "rgba(253,251,247,0.5)" }}>
                  Os exercícios não possuem gabarito fixo. O próprio processo de <strong className="text-[#FDFBF7]">refletir sobre as respostas ideais já faz parte do treino</strong>. Não existe um estilo de comunicação — irônico, doce, confrontativo — que funcione sempre ou nunca. O aprendizado vem de testar, observar as consequências e adaptar.
                </p>
              </Card>
              <Card accent>
                <Label>Roleplays Decompositivos</Label>
                <p className="font-dm text-sm" style={{ color: "rgba(253,251,247,0.5)" }}>
                  Intervenções são decompostas em componentes: <strong className="text-[#FDFBF7]">frase, entonação, timing, fundamentos</strong>. Roleplays testam intervenções, depois reconstroem o que funcionou e o que não funcionou, criando aprendizado granular e transferível.
                </p>
              </Card>
            </div>
          </Reveal>

          {/* COMPARISON TABLE */}
          <Reveal>
            <h3 className="font-fraunces font-semibold text-[#FDFBF7] text-xl mb-6">
              Allos vs. Miller: Diferenças Fundamentais
            </h3>
            <div className="grid md:grid-cols-2 gap-6 mb-16">
              <div
                className="rounded-2xl p-8"
                style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <h4 className="font-fraunces font-semibold text-lg mb-4" style={{ color: "rgba(253,251,247,0.85)" }}>
                  Scott Miller
                </h4>
                <ul className="space-y-2">
                  {[
                    "Apenas intervenções suportadas pela literatura",
                    "Treino individual, solitário",
                    "Foco apenas em fundamentos",
                    "Repetitivo — 20% de perda de dados",
                    "Autoavaliação como base",
                    "Sem decomposição de intervenções",
                  ].map((t, i) => (
                    <li key={i} className="font-dm text-sm flex gap-2" style={{ color: "rgba(253,251,247,0.45)", borderBottom: "1px solid rgba(253,251,247,0.06)", paddingBottom: 8 }}>
                      <span className="text-[#C84B31] font-semibold">→</span> {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className="rounded-2xl p-8"
                style={{ background: "rgba(200,75,49,0.06)", border: "1px solid rgba(200,75,49,0.25)" }}
              >
                <h4 className="font-fraunces font-semibold text-lg text-[#FDFBF7] mb-4">
                  Associação Allos
                </h4>
                <ul className="space-y-2">
                  {[
                    "Valoriza plausibilidade (ex: interpretação, mesmo sem estudos)",
                    "Dinâmica grupal engajante",
                    "Mix de simples e complexo",
                    "Alta adesão e motivação",
                    "Avaliação por pares + autoavaliação",
                    "Decomposição: frase, entonação, timing, fundamentos",
                    "Compensação financeira ligada à melhora clínica",
                  ].map((t, i) => (
                    <li key={i} className="font-dm text-sm flex gap-2" style={{ color: "rgba(253,251,247,0.55)", borderBottom: "1px solid rgba(253,251,247,0.06)", paddingBottom: 8 }}>
                      <span className="text-[#C84B31] font-semibold">→</span> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          {/* SUPERVISÃO */}
          <Reveal>
            <h3 className="font-fraunces font-semibold text-[#FDFBF7] text-xl mb-3">
              O Modelo de Supervisão
            </h3>
            <p className="font-dm text-sm mb-8" style={{ color: "rgba(253,251,247,0.45)", maxWidth: 700 }}>
              Um modelo eficaz deve incorporar exercícios práticos e treinamento. Em vez de levar o profissional à supervisão apenas para formular um caso difícil, é importante que ele treine na prática os elementos problemáticos.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <p className="font-dm text-[13px] font-semibold text-[#C84B31] mb-2">Supervisão Tradicional</p>
                <p className="font-dm text-sm" style={{ color: "rgba(253,251,247,0.45)" }}>
                  Discute o caso → formula hipóteses → sugere direção.
                  <br /><br />
                  <em>Problema: o terapeuta aprende a resolver aquele caso específico, mas o aprendizado não é necessariamente transferível para outros contextos.</em>
                </p>
              </Card>
              <Card terra>
                <p className="font-dm text-[13px] font-semibold text-[#C84B31] mb-2">Supervisão Allos</p>
                <p className="font-dm text-sm" style={{ color: "rgba(253,251,247,0.65)" }}>
                  Usa o caso como ponto de partida para formular <strong className="text-[#FDFBF7]">princípios abstratos e transferíveis</strong>. Pratica os elementos problemáticos com feedback — como treinamentos esportivos onde cada movimento é corrigido de forma direcionada. Evita que o aprendizado fique restrito àquele caso.
                </p>
              </Card>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          INSIGHT EPISTEMOLÓGICO
          ═══════════════════════════════════════ */}
      <section className="relative py-20 md:py-28" style={{ background: "#1A1A1A" }}>
        <Grain />
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <Ornament />
          <Reveal>
            <div
              className="rounded-2xl p-10 text-center max-w-[800px] mx-auto relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg,rgba(200,75,49,0.06),rgba(200,75,49,0.02))",
                border: "1px solid rgba(200,75,49,0.25)",
              }}
            >
              <h3 className="font-fraunces font-semibold text-[#FDFBF7] mb-5" style={{ fontSize: "clamp(22px,3vw,32px)" }}>
                O Insight <span className="italic text-[#C84B31]">Epistemológico</span>
              </h3>
              <p className="font-dm text-[15px] mx-auto mb-5" style={{ color: "rgba(253,251,247,0.65)", maxWidth: 640 }}>
                Se não ajustarmos o objeto de estudo ao método científico, deixará de ser ciência. A ciência consiste em criar <strong className="text-[#FDFBF7]">métodos inovadores</strong> para solucionar ou investigar problemas, medindo-os corretamente. Em vez de buscar apenas o que pode ser mensurado, devemos <strong className="text-[#FDFBF7]">respeitar o objeto</strong> e encontrar maneiras de abordá-lo.
              </p>
              <p className="font-fraunces italic text-[#C84B31] text-lg mx-auto" style={{ maxWidth: 500, opacity: 0.8 }}>
                Mesmo que algo seja altamente plausível, alguns pesquisadores evitam investigá-lo por falta de literatura — isso é epistemologicamente fraco.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CAPÍTULO 07 — AVALIALLOS
          ═══════════════════════════════════════ */}
      <section id="avaliallos" className="relative py-20 md:py-28" style={{ background: "#141414" }}>
        <Grain />
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <SectionDivider label="Capítulo 07" />

          <Reveal>
            <h2 className="font-fraunces font-bold text-[#FDFBF7] mb-4" style={{ fontSize: "clamp(28px,4vw,48px)", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
              O Sistema <span className="italic text-[#C84B31]">AvaliAllos</span>
            </h2>
            <p className="font-dm mb-12" style={{ color: "rgba(253,251,247,0.45)", maxWidth: 720 }}>
              A materialização prática de toda essa filosofia — o sistema rigoroso de avaliação de competências clínicas que traduz os princípios da prática deliberada em métricas concretas.
            </p>
          </Reveal>

          {/* METRICS */}
          <Reveal>
            <div className="grid grid-cols-3 gap-6 mb-16">
              {[
                { num: "200+", label: "pacientes atendidos" },
                { num: "80+", label: "terapeutas formados" },
                { num: "~5%", label: "aprovação na 1ª tentativa" },
              ].map((m, i) => (
                <div key={i} className="text-center py-8">
                  <div className="w-full h-[3px] rounded-full mb-4 overflow-hidden" style={{ background: "rgba(253,251,247,0.06)" }}>
                    <motion.div
                      className="h-full bg-[#C84B31] rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: SPRING }}
                    />
                  </div>
                  <p
                    className="font-fraunces font-bold text-[#C84B31]"
                    style={{ fontSize: "clamp(36px,5vw,64px)", letterSpacing: "-0.03em", lineHeight: 1 }}
                  >
                    {m.num}
                  </p>
                  <p className="font-dm text-[13px] mt-2" style={{ color: "rgba(253,251,247,0.45)" }}>
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* COMPETÊNCIAS */}
          <Reveal>
            <h3 className="font-fraunces font-semibold text-[#FDFBF7] text-xl mb-2">
              Grade de Competências
            </h3>
            <p className="font-dm text-sm mb-8" style={{ color: "rgba(253,251,247,0.45)" }}>
              Escala de <strong className="text-[#FDFBF7]">-9 a +9</strong> por competência · Nota de corte:{" "}
              <strong className="text-[#C84B31]">+25</strong> · 12 competências em 4 categorias
            </p>

            {/* Estrutura */}
            <p className="font-dm font-semibold text-[10px] tracking-[.2em] uppercase mt-8 mb-3" style={{ color: COLORS.estrutura }}>
              Estrutura
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <CompCard name="Estágio de Mudança" category="Estrutura" color={COLORS.estrutura} />
              <CompCard name="Estrutura do Atendimento" category="Estrutura" color={COLORS.estrutura} />
              <CompCard name="Abertura & Encerramento" category="Estrutura" color={COLORS.estrutura} />
            </div>

            {/* Relação */}
            <p className="font-dm font-semibold text-[10px] tracking-[.2em] uppercase mt-8 mb-3" style={{ color: COLORS.relacao }}>
              Relação
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <CompCard name="Acolhimento" category="Relação" color={COLORS.relacao} />
              <CompCard name="Segurança no Terapeuta" category="Relação" color={COLORS.relacao} />
              <CompCard name="Segurança no Método" category="Relação" color={COLORS.relacao} />
            </div>

            {/* Formulação */}
            <p className="font-dm font-semibold text-[10px] tracking-[.2em] uppercase mt-8 mb-3" style={{ color: COLORS.formulacao }}>
              Formulação
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <CompCard name="Aprofundar / Investigação" category="Formulação" color={COLORS.formulacao} />
              <CompCard name="Hipóteses Clínicas" category="Formulação" color={COLORS.formulacao} />
              <CompCard name="Interpretação" category="Formulação" color={COLORS.formulacao} />
            </div>

            {/* Performance */}
            <p className="font-dm font-semibold text-[10px] tracking-[.2em] uppercase mt-8 mb-3" style={{ color: COLORS.performance }}>
              Performance
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <CompCard name="Frase & Timing" category="Performance" color={COLORS.performance} />
              <CompCard name="Corpo & Setting" category="Performance" color={COLORS.performance} />
              <CompCard name="Insight & Potência" category="Performance" color={COLORS.performance} />
            </div>
          </Reveal>

          <Reveal className="mt-12">
            <QuoteBlock>
              O modelo Allos é, acima de tudo, um compromisso ético: acreditar que é possível medir, treinar e elevar continuamente a qualidade do cuidado psicológico — sem simplificar o que é, por natureza, complexo.
            </QuoteBlock>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA FINAL
          ═══════════════════════════════════════ */}
      <section className="relative py-32 text-center overflow-hidden" style={{ background: "#0F0F0F" }}>
        <Grain />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[280px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at bottom,rgba(200,75,49,.12) 0%,transparent 70%)" }}
        />
        <p
          className="absolute font-fraunces italic text-[#FDFBF7] whitespace-nowrap select-none pointer-events-none"
          style={{
            bottom: "40%",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "clamp(36px,7vw,92px)",
            opacity: 0.025,
            letterSpacing: "-0.03em",
          }}
          aria-hidden
        >
          &ldquo;Cuidar com rigor é um ato ético&rdquo;
        </p>
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 relative z-10">
          <Ornament />
          <Reveal>
            <h2 className="font-fraunces font-bold text-[#FDFBF7] mb-4" style={{ fontSize: "clamp(28px,5vw,52px)", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
              Transformando Talentos{" "}
              <span className="italic text-[#C84B31]">em Legado</span>
            </h2>
            <p className="font-dm mx-auto mb-10" style={{ color: "rgba(253,251,247,0.45)", maxWidth: 560 }}>
              A Allos está revolucionando a formação profissional ao combinar ciência, criatividade e engajamento — estabelecendo novos padrões de excelência na formação de terapeutas e transformando a educação em saúde mental.
            </p>
            <motion.a
              href="https://wa.me/5531987577892"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 font-dm font-semibold text-white bg-[#C84B31] rounded-full"
              style={{ padding: "17px 52px", fontSize: "15px" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              animate={{
                boxShadow: [
                  "0 0 0 0px rgba(200,75,49,0.5)",
                  "0 0 0 14px rgba(200,75,49,0)",
                  "0 0 0 0px rgba(200,75,49,0)",
                ],
              }}
              transition={{
                boxShadow: { duration: 2.2, repeat: Infinity, ease: "easeOut" },
              }}
            >
              Agendar Sessão
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M1 7.5h12M8 2.5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.a>
            <p className="font-dm text-sm mt-12" style={{ color: "rgba(253,251,247,0.3)" }}>
              R$200/mês · Rua Rio Negro, 1048, Barroca, BH – MG
              <br />
              suporte@allos.org.br · +55 31 98757-7892
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
