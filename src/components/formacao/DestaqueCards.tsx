"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const destaques = [
  {
    tag: "AO VIVO",
    tagColor: "#EF4444",
    title: "Clínica Existencial Contemporânea",
    desc: "Encontros síncronos sobre manejo clínico e presença terapêutica.",
    href: "#",
  },
  {
    tag: "NOVO",
    tagColor: "#C84B31",
    title: "Crítica e Ética na Psicoterapia",
    desc: "Reflexões atuais sobre responsabilidade clínica e políticas do cuidado.",
    href: "#",
  },
  {
    tag: "GRAVADO",
    tagColor: "rgba(253,251,247,0.4)",
    title: "Fenomenologia na Prática",
    desc: "Série de aulas gravadas com exercícios e estudos de caso.",
    href: "#",
  },
];

function DestaqueCard({ item, index }: { item: typeof destaques[0]; index: number }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });
  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
      className="group relative flex flex-col rounded-2xl overflow-hidden flex-shrink-0"
      style={{
        background: "rgba(253,251,247,0.03)",
        border: "1px solid rgba(253,251,247,0.07)",
        minWidth: "320px",
        maxWidth: "380px",
      }}
    >
      {/* Glow hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ boxShadow: "inset 0 0 0 1px rgba(200,75,49,0.25), 0 20px 60px rgba(200,75,49,0.1)" }}
      />

      {/* Thumb */}
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: "16/9",
          background: "linear-gradient(135deg,#1C1414,#111111)",
        }}
      >
        {/* Decorativo no thumb */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-[.06] group-hover:opacity-[.1] transition-opacity duration-500"
          style={{ fontSize: "80px", userSelect: "none" }}
        >
          ◆
        </div>
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 50% 50%,rgba(200,75,49,.12) 0%,transparent 70%)" }}
        />
        {/* Tag */}
        <div
          className="absolute top-4 left-4 font-dm font-bold text-[10px] tracking-[.2em] uppercase px-3 py-1.5 rounded-full"
          style={{ color: item.tagColor, background: "rgba(0,0,0,0.6)", border: `1px solid ${item.tagColor}40` }}
        >
          {item.tag}
        </div>
      </div>

      <div className="flex flex-col flex-1 p-7 gap-4">
        <h3 className="font-fraunces font-bold text-[#FDFBF7] leading-snug group-hover:text-[#F5DDD7] transition-colors duration-300"
          style={{ fontSize: "clamp(17px,1.8vw,20px)" }}>
          {item.title}
        </h3>
        <p className="font-dm leading-relaxed flex-1"
          style={{ fontSize: "14px", color: "rgba(253,251,247,0.5)" }}>
          {item.desc}
        </p>
        <motion.a
          href={item.href}
          className="inline-flex items-center gap-2 font-dm font-semibold self-start group/link"
          style={{ fontSize: "13px", color: "#C84B31" }}
          whileHover={{ x: 4 }}
          transition={{ duration: 0.2 }}
        >
          Ver curso
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.a>
      </div>
    </motion.article>
  );
}

export default function DestaqueCards() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <section className="py-24 md:py-28 px-6 md:px-10" style={{ background: "#111111" }}>
      <div className="max-w-[1200px] mx-auto">
        <div ref={ref} className="mb-10 flex items-end justify-between gap-6">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
              className="font-dm font-semibold text-[11px] tracking-[.26em] text-[#C84B31] uppercase mb-3"
            >
              Em destaque
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-fraunces font-bold text-[#FDFBF7]"
              style={{ fontSize: "clamp(26px,3.5vw,40px)" }}
            >
              Seleções em <span className="italic text-[#C84B31]">destaque</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}
            className="font-dm text-[11px] hidden md:block flex-shrink-0"
            style={{ color: "rgba(253,251,247,0.25)", letterSpacing: ".1em" }}
          >
            arraste para ver mais →
          </motion.p>
        </div>

        {/* Scroll row */}
        <div
          className="flex gap-5 overflow-x-auto pb-4"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(200,75,49,0.3) rgba(255,255,255,0.03)",
          }}
        >
          {destaques.map((item, i) => (
            <DestaqueCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
