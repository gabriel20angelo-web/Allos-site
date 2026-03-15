"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import Image from "next/image";
import basePath from "@/lib/basePath";

const EASE = [0.22, 1, 0.36, 1];

const projetos = [
  {
    slug: "prosam-bela-vista",
    title: "ProSam Bela Vista de Minas",
    tagline: "Programa de saúde mental para servidores públicos municipais.",
    pill: "Saúde Pública",
    pillColor: "#2E9E8F",
    stats: "1230+ atendimentos · 9.5/10 satisfação",
    image: null,
    gradient: "linear-gradient(135deg, #0D3B36 0%, #1A2A28 100%)",
  },
  {
    slug: "prosam-materlandia",
    title: "ProSam Materlândia",
    tagline: "Expansão do modelo ProSam para novo município.",
    pill: "Saúde Pública",
    pillColor: "#2E9E8F",
    stats: "Iniciado em 2026",
    image: null,
    gradient: "linear-gradient(135deg, #1A2E2B 0%, #0F1F1D 100%)",
  },
  {
    slug: "rama",
    title: "Rede RAMA",
    tagline: "Grupos de apoio para mães em territórios vulneráveis.",
    pill: "Comunidade",
    pillColor: "#C84B31",
    stats: "50+ mães atendidas · 3 territórios",
    image: "projetoRAMA1.jpeg",
    gradient: null,
  },
];

function ProjectCard({ project, index }: { project: typeof projetos[0]; index: number }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });
  return (
    <Link href={`${basePath}/projetos/${project.slug}`}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: index * 0.12, duration: 0.7, ease: EASE }}
        whileHover={{ y: -6, transition: { duration: 0.25 } }}
        className="group relative rounded-2xl overflow-hidden flex flex-col h-full cursor-pointer"
        style={{ background: "rgba(253,251,247,0.03)", border: "1px solid rgba(253,251,247,0.07)" }}
      >
        {/* Accent line on hover */}
        <div
          className="h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
          style={{ background: `linear-gradient(to right,${project.pillColor},transparent)` }}
        />

        {/* Cover */}
        <div className="relative w-full h-48 overflow-hidden">
          {project.image ? (
            <Image
              src={`${basePath}/${project.image}`}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-700" style={{ background: project.gradient! }} />
          )}
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 flex items-center justify-center">
            <span className="font-dm text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity duration-400 tracking-wide">
              Ver projeto →
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-7 flex flex-col flex-1">
          {/* Pill badge */}
          <span
            className="inline-block self-start font-dm text-[10px] font-semibold tracking-[.18em] uppercase rounded-full px-3 py-1 mb-4"
            style={{
              color: project.pillColor,
              background: `${project.pillColor}15`,
              border: `1px solid ${project.pillColor}30`,
            }}
          >
            {project.pill}
          </span>

          <h3
            className="font-fraunces font-bold text-[#FDFBF7] mb-2 leading-snug"
            style={{ fontSize: "clamp(17px,1.8vw,21px)" }}
          >
            {project.title}
          </h3>

          <p
            className="font-dm leading-relaxed flex-1 mb-4"
            style={{ fontSize: "14px", color: "rgba(253,251,247,0.5)" }}
          >
            {project.tagline}
          </p>

          <p
            className="font-dm text-[12px] tracking-wide"
            style={{ color: "rgba(253,251,247,0.35)" }}
          >
            {project.stats}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}

export default function ProjetosGallery() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section
      className="py-20 md:py-28 px-6 md:px-10"
      style={{ background: "radial-gradient(ellipse at 50% 0%,rgba(46,158,143,.04) 0%,transparent 50%),#111111" }}
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Section header */}
        <div ref={ref} className="max-w-[720px] mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="font-dm font-semibold text-[11px] tracking-[.26em] text-[#2E9E8F] uppercase mb-4"
          >
            Nossas iniciativas
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.08, duration: 0.7, ease: EASE }}
            className="font-dm leading-relaxed mb-5"
            style={{ fontSize: "clamp(16px,1.8vw,19px)", color: "rgba(253,251,247,0.75)" }}
          >
            Projetos de impacto social em saúde mental, desenvolvidos em parceria com redes públicas e organizações comunitárias.
          </motion.p>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="flex items-center gap-6 mb-12 origin-left"
        >
          <div className="h-px flex-1" style={{ background: "rgba(253,251,247,0.07)" }} />
          <span className="font-dm text-[10px] tracking-[.28em] uppercase flex-shrink-0" style={{ color: "rgba(253,251,247,0.25)" }}>
            Projetos ativos
          </span>
          <div className="h-px flex-1" style={{ background: "rgba(253,251,247,0.07)" }} />
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projetos.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
