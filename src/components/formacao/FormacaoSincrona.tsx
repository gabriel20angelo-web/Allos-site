"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

/* ── FORMAÇÃO SÍNCRONA ── */
export function FormacaoSincrona() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <section
      id="formacao-sincrona"
      ref={ref}
      className="py-24 md:py-28 px-6 md:px-10 relative overflow-hidden"
      style={{ background: "#1A1A1A" }}
    >
      {/* Grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[.025]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div
        className="absolute top-0 right-0 w-[600px] h-[500px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at top right,rgba(200,75,49,.09) 0%,transparent 65%)" }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Texto */}
          <div>
            <motion.p
              initial={{ opacity: 0, x: -14 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5 }}
              className="font-dm font-semibold text-[11px] tracking-[.26em] text-[#C84B31] uppercase mb-4"
            >
              Programa central
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.08, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="font-fraunces font-bold text-[#FDFBF7] leading-tight mb-8"
              style={{ fontSize: "clamp(26px,3.8vw,46px)" }}
            >
              Formação síncrona —{" "}
              <span className="italic text-[#C84B31]">turma contínua</span>
            </motion.h2>

            <div className="space-y-5 mb-10">
              {[
                "Encontros ao vivo quinzenais com equipe docente e convidados.",
                "Cronograma organizado por módulos, com estudo de casos e leitura dirigida.",
                "Espaço de acompanhamento institucional e práticas de supervisão.",
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.15 + i * 0.08, duration: 0.55 }}
                  className="flex items-start gap-4"
                >
                  <div
                    className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                    style={{ background: "rgba(200,75,49,.12)", border: "1px solid rgba(200,75,49,.3)" }}
                  >
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5L4.5 7.5L8 3" stroke="#C84B31" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="font-dm leading-relaxed" style={{ fontSize: "15px", color: "rgba(253,251,247,0.6)" }}>
                    {item}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.42, duration: 0.55 }}
            >
              <motion.a
                href="#"
                whileHover={{ scale: 1.04, boxShadow: "0 10px 36px rgba(200,75,49,.35)" }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 font-dm font-semibold text-white bg-[#C84B31] rounded-full hover:bg-[#A33D27] transition-colors"
                style={{ padding: "14px 32px", fontSize: "15px" }}
              >
                Inscrever-se na formação →
              </motion.a>
            </motion.div>
          </div>

          {/* Visual card decorativo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex items-center justify-center"
          >
            <div
              className="relative w-full max-w-[360px] aspect-square rounded-3xl flex items-center justify-center"
              style={{ background: "rgba(200,75,49,.05)", border: "1px solid rgba(200,75,49,.15)" }}
            >
              {/* Anéis concêntricos */}
              {[1, 0.72, 0.48, 0.28].map((scale, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: `${scale * 100}%`,
                    height: `${scale * 100}%`,
                    border: `1px solid rgba(200,75,49,${0.08 + i * 0.04})`,
                  }}
                  animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                  transition={{ duration: 20 + i * 8, repeat: Infinity, ease: "linear" }}
                />
              ))}
              <div className="relative z-10 text-center">
                <p className="font-fraunces font-bold italic text-[#C84B31]" style={{ fontSize: "52px", lineHeight: 1 }}>
                  AO
                </p>
                <p className="font-fraunces font-bold text-[#FDFBF7]" style={{ fontSize: "52px", lineHeight: 1 }}>
                  VIVO
                </p>
                <p className="font-dm text-[10px] tracking-[.3em] uppercase mt-3" style={{ color: "rgba(253,251,247,0.3)" }}>
                  Quinzenal
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── PILARES ── */
const pilares = [
  { icon: "✦", title: "Clínica Existencial", desc: "Atenção à singularidade, presença clínica e abertura ao sentido.", href: "#" },
  { icon: "◎", title: "Crítica Institucional", desc: "Reflexão sobre práticas, discursos e políticas do cuidado.", href: "#" },
  { icon: "◈", title: "Ética do Cuidado", desc: "Compromisso com responsabilidade clínica e contextos sociais.", href: "#" },
  { icon: "◆", title: "Pesquisa e Formação", desc: "Produção de conhecimento, atualização contínua e troca institucional.", href: "#" },
];

export function PilaresSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section
      className="py-24 md:py-28 px-6 md:px-10 relative overflow-hidden"
      style={{ background: "#111111" }}
    >
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at bottom,rgba(200,75,49,.05) 0%,transparent 70%)" }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto">
        <div ref={ref} className="mb-14 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
            className="font-dm font-semibold text-[11px] tracking-[.26em] text-[#C84B31] uppercase mb-4"
          >
            Nossa identidade
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.08, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="font-fraunces font-bold text-[#FDFBF7]"
            style={{ fontSize: "clamp(26px,3.5vw,44px)" }}
          >
            Pilares da <span className="italic text-[#C84B31]">Allos</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pilares.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.28 } }}
              className="group relative rounded-2xl p-8 flex flex-col gap-5 cursor-default"
              style={{ background: "rgba(253,251,247,0.03)", border: "1px solid rgba(253,251,247,0.07)" }}
            >
              {/* Glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
                style={{ boxShadow: "inset 0 0 0 1px rgba(200,75,49,0.2), 0 20px 50px rgba(200,75,49,0.08)" }}
              />

              {/* Icon */}
              <div
                className="relative z-10 w-14 h-14 rounded-xl flex items-center justify-center font-bold transition-all duration-300 group-hover:scale-110"
                style={{
                  background: "rgba(200,75,49,.1)",
                  border: "1px solid rgba(200,75,49,.25)",
                  color: "#C84B31",
                  fontSize: "22px",
                }}
              >
                {p.icon}
              </div>

              <div className="relative z-10 flex flex-col gap-3 flex-1">
                <h3 className="font-fraunces font-bold text-[#FDFBF7] leading-snug group-hover:text-[#F5DDD7] transition-colors duration-300"
                  style={{ fontSize: "clamp(16px,1.6vw,18px)" }}>
                  {p.title}
                </h3>
                <p className="font-dm leading-relaxed flex-1" style={{ fontSize: "14px", color: "rgba(253,251,247,0.45)" }}>
                  {p.desc}
                </p>
                <motion.a
                  href={p.href}
                  className="inline-flex items-center gap-1.5 font-dm font-semibold self-start"
                  style={{ fontSize: "12px", color: "#C84B31" }}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  Saiba mais
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7H11M8 4L11 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
