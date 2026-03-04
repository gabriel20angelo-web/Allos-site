"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface DocItem {
  title: string;
  description: string;
  href: string; // substitua com o link real do arquivo
}

const docs: DocItem[] = [
  {
    title: "Estatuto Social",
    description: "Documento que estabelece as regras, objetivos e a estrutura de funcionamento da Associação Allos, orientando suas decisões e diretrizes institucionais.",
    href: "#", // TROCAR PELO LINK REAL
  },
  {
    title: "Ata de Fundação",
    description: "Documento que formaliza a criação da Associação Allos, registrando as decisões e acordos estabelecidos na reunião inaugural.",
    href: "#", // TROCAR PELO LINK REAL
  },
  {
    title: "Certidão Cível Negativa",
    description: "Certidão que atesta a inexistência de ações cíveis em nome da Associação Allos, comprovando sua regularidade jurídica.",
    href: "#", // TROCAR PELO LINK REAL
  },
  {
    title: "Processo Licitatório nº 03 / 2024",
    description: "Contratação da Associação Allos para o projeto 'Saúde Mental para o Servidor Público', junto à Prefeitura Municipal de Bela Vista de Minas.",
    href: "#", // TROCAR PELO LINK REAL
  },
  {
    title: "Regularidade do FGTS",
    description: "Documento que comprova a regularidade da Associação Allos junto ao Fundo de Garantia do Tempo de Serviço.",
    href: "#", // TROCAR PELO LINK REAL
  },
  {
    title: "Fazenda Pública Municipal",
    description: "Certidão que atesta a regularidade fiscal da Associação Allos perante a Fazenda Pública Municipal.",
    href: "#", // TROCAR PELO LINK REAL
  },
  {
    title: "Ações Trabalhistas",
    description: "Certidão negativa que comprova a inexistência de ações trabalhistas em nome da Associação Allos.",
    href: "#", // TROCAR PELO LINK REAL
  },
  {
    title: "Débitos Tributários",
    description: "Documento que atesta a inexistência de débitos tributários junto aos órgãos competentes.",
    href: "#", // TROCAR PELO LINK REAL
  },
  {
    title: "Débitos Trabalhistas",
    description: "Certidão que comprova a regularidade da Associação Allos quanto às obrigações trabalhistas.",
    href: "#", // TROCAR PELO LINK REAL
  },
  {
    title: "RFB e Dívida Ativa da União",
    description: "Certidão emitida pela Receita Federal do Brasil que atesta a regularidade da Associação Allos junto à RFB e à DAU.",
    href: "#", // TROCAR PELO LINK REAL
  },
];

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3v7M5 7l3 3 3-3M3 13h10" />
    </svg>
  );
}

function DocCard({ doc, index }: { doc: DocItem; index: number }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: (index % 3) * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.25, ease: "easeOut" } }}
      className="group flex flex-col rounded-2xl overflow-hidden"
      style={{ background: "rgba(253,251,247,0.03)", border: "1px solid rgba(253,251,247,0.07)" }}
    >
      {/* Top accent bar */}
      <div className="h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
        style={{ background: "linear-gradient(to right,#C84B31,rgba(200,75,49,0))" }} />

      <div className="flex flex-col flex-1 p-7">
        {/* Número do documento */}
        <span className="font-dm text-[10px] tracking-[.28em] uppercase mb-4"
          style={{ color: "rgba(253,251,247,0.25)" }}>
          {String(index + 1).padStart(2, "0")}
        </span>

        <h3 className="font-fraunces font-bold text-[#FDFBF7] leading-snug mb-4"
          style={{ fontSize: "clamp(15px,1.5vw,18px)" }}>
          {doc.title}
        </h3>

        <p className="font-dm leading-relaxed flex-1 mb-7"
          style={{ fontSize: "14px", color: "rgba(253,251,247,0.5)" }}>
          {doc.description}
        </p>

        <motion.a
          href={doc.href}
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2.5 self-start font-dm font-semibold rounded-full transition-all duration-300"
          style={{
            fontSize: "13px",
            color: "#C84B31",
            border: "1px solid rgba(200,75,49,0.3)",
            padding: "9px 18px",
          }}
        >
          <DownloadIcon />
          Download
        </motion.a>
      </div>
    </motion.div>
  );
}

export default function DocumentosGrid() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-20 md:py-28 px-6 md:px-10"
      style={{ background: "radial-gradient(ellipse at 5% 0%,rgba(200,75,49,.04) 0%,transparent 50%),#161616" }}>
      <div className="max-w-[1200px] mx-auto">
        {/* Header da seção */}
        <div ref={ref} className="mb-14 flex flex-col md:flex-row md:items-end gap-4 md:gap-12">
          <div>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
              className="font-dm font-semibold text-[11px] tracking-[.26em] text-[#C84B31] uppercase mb-3">
              Transparência institucional
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-fraunces font-bold text-[#FDFBF7]" style={{ fontSize: "clamp(24px,3vw,36px)" }}>
              {docs.length} documentos disponíveis
            </motion.h2>
          </div>
          <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2, duration: 0.5 }}
            className="font-dm max-w-[380px] md:ml-auto" style={{ fontSize: "14px", color: "rgba(253,251,247,0.4)" }}>
            Todos os documentos são atualizados conforme renovação das certidões. Clique em "Download" para acessar o arquivo.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {docs.map((doc, i) => (
            <DocCard key={doc.title} doc={doc} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
