"use client";
import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useInView } from "react-intersection-observer";

const filters = [
  "Todos",
  "Epistemologia",
  "Hermenêutica",
  "TCC",
  "Sistêmica",
  "Junguiana",
  "Psicanálise",
  "Prática Deliberada",
];

const badgeStyles: Record<string, { bg: string; color: string; border: string }> = {
  Gratuito:  { bg: "rgba(45,106,79,.15)",   color: "#4ADE80", border: "rgba(74,222,128,.25)" },
  Membro:    { bg: "rgba(200,75,49,.12)",   color: "#C84B31", border: "rgba(200,75,49,.3)" },
  Gravado:   { bg: "rgba(253,251,247,.06)", color: "rgba(253,251,247,.6)", border: "rgba(253,251,247,.12)" },
  "Ao Vivo": { bg: "rgba(239,68,68,.12)",   color: "#EF4444", border: "rgba(239,68,68,.3)" },
};

interface Course {
  title: string;
  meta: string;
  badge: "Gratuito" | "Membro" | "Gravado" | "Ao Vivo";
  categories: string[];
  href: string;
}

const courses: Course[] = [
  { title: "Bases da Escuta Existencial",    meta: "Prof. Ana Duarte · Existencial · 6 aulas",      badge: "Gratuito", categories: ["Epistemologia","Prática Deliberada"], href: "#" },
  { title: "Psicologia Crítica e Sociedade", meta: "Prof. Marcelo Lins · 4 aulas · Debate",          badge: "Membro",   categories: ["Psicanálise","Hermenêutica"], href: "#" },
  { title: "Clínica e Narrativas de Vida",   meta: "Prof. Joana Reis · Existencial · 5 aulas",       badge: "Gravado",  categories: ["Junguiana","Hermenêutica"], href: "#" },
  { title: "Ética do Cuidado",               meta: "Prof. Camila Rocha · Ética · 3 aulas",           badge: "Gravado",  categories: ["Sistêmica","Prática Deliberada"], href: "#" },
  { title: "Fenomenologia Avançada",         meta: "Prof. Pedro Vale · 8 aulas · Avançado",          badge: "Membro",   categories: ["Epistemologia","TCC"], href: "#" },
  { title: "Prática Clínica Institucional",  meta: "Prof. Elisa Prado · Institucional · 7 aulas",    badge: "Gravado",  categories: ["Sistêmica","Prática Deliberada"], href: "#" },
];

function CourseCard({ course, index }: { course: Course; index: number }) {
  const badge = badgeStyles[course.badge];
  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.94, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -8 }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.28, ease: "easeOut" } }}
      className="group relative rounded-2xl overflow-hidden flex flex-col cursor-default"
      style={{ background: "rgba(253,251,247,0.03)", border: "1px solid rgba(253,251,247,0.07)" }}
    >
      {/* Top accent hover */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 z-10"
        style={{ background: "linear-gradient(to right,#C84B31,rgba(200,75,49,0))" }}
      />

      {/* Glow hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ boxShadow: "inset 0 0 0 1px rgba(200,75,49,0.2), 0 24px 60px rgba(200,75,49,0.08)" }}
      />

      {/* Thumb */}
      <div
        className="relative overflow-hidden flex items-center justify-center"
        style={{ aspectRatio: "16/9", background: "linear-gradient(135deg,#191212,#0F0F0F)" }}
      >
        <span
          className="font-fraunces italic text-[#C84B31] opacity-[.06] group-hover:opacity-[.12] transition-opacity duration-500 select-none"
          style={{ fontSize: "72px", lineHeight: 1 }}
        >
          ◆
        </span>
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: "radial-gradient(ellipse at 50% 50%,rgba(200,75,49,.07) 0%,transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 flex flex-col flex-1 p-7 gap-4">
        {/* Badge */}
        <div
          className="self-start font-dm font-bold text-[10px] tracking-[.16em] uppercase px-3 py-1.5 rounded-full"
          style={{ color: badge.color, background: badge.bg, border: `1px solid ${badge.border}` }}
        >
          {course.badge}
        </div>

        <h3
          className="font-fraunces font-bold text-[#FDFBF7] leading-snug group-hover:text-[#F5DDD7] transition-colors duration-300"
          style={{ fontSize: "clamp(16px,1.6vw,18px)" }}
        >
          {course.title}
        </h3>

        <p className="font-dm" style={{ fontSize: "13px", color: "rgba(253,251,247,0.35)" }}>
          {course.meta}
        </p>

        <motion.a
          href={course.href}
          className="mt-auto inline-flex items-center gap-2 font-dm font-semibold self-start"
          style={{ fontSize: "13px", color: "#C84B31" }}
          whileHover={{ x: 4 }}
          transition={{ duration: 0.2 }}
        >
          Ver detalhes
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.a>
      </div>
    </motion.article>
  );
}

export default function CursosGrid() {
  const [active, setActive] = useState("Todos");
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.08 });

  const filtered =
    active === "Todos"
      ? courses
      : courses.filter((c) => c.categories.includes(active));

  return (
    <section id="cursos" className="py-24 md:py-28 px-6 md:px-10"
      style={{ background: "radial-gradient(ellipse at 50% 0%,rgba(200,75,49,.03) 0%,transparent 60%),#0E0E0E" }}>
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div ref={ref} className="mb-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
            className="font-dm font-semibold text-[11px] tracking-[.26em] text-[#C84B31] uppercase mb-3"
          >
            Catálogo completo
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-fraunces font-bold text-[#FDFBF7] mb-2"
            style={{ fontSize: "clamp(26px,3.5vw,40px)" }}
          >
            Todos os <span className="italic text-[#C84B31]">cursos</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.18, duration: 0.5 }}
            className="font-dm"
            style={{ fontSize: "15px", color: "rgba(253,251,247,0.4)" }}
          >
            Trilhas para diferentes estágios da prática clínica.
          </motion.p>
        </div>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.22, duration: 0.5 }}
          className="flex flex-wrap gap-2.5 mb-10"
        >
          <LayoutGroup>
            {filters.map((f) => (
              <motion.button
                key={f}
                onClick={() => setActive(f)}
                className="relative font-dm font-semibold rounded-full cursor-pointer transition-colors duration-200"
                style={{
                  fontSize: "13px",
                  padding: "9px 20px",
                  color: active === f ? "#FDFBF7" : "rgba(253,251,247,0.45)",
                  border: active === f ? "1px solid rgba(200,75,49,0.5)" : "1px solid rgba(253,251,247,0.08)",
                  background: "transparent",
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                {active === f && (
                  <motion.div
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: "rgba(200,75,49,0.15)" }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{f}</span>
              </motion.button>
            ))}
          </LayoutGroup>
        </motion.div>

        {/* Grid animado */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((course, i) => (
              <CourseCard key={course.title} course={course} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Vazio */}
        <AnimatePresence>
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="py-20 text-center"
            >
              <p className="font-fraunces italic text-[#C84B31] text-xl mb-2">Nenhum curso nessa categoria</p>
              <p className="font-dm text-sm" style={{ color: "rgba(253,251,247,0.3)" }}>
                Novos conteúdos em breve.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
