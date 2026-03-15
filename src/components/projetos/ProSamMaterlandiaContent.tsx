"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import basePath from "@/lib/basePath";

const EASE = [0.22, 1, 0.36, 1];

export default function ProSamMaterlandiaContent() {
  const { ref: aboutRef, inView: aboutInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: statusRef, inView: statusInView } = useInView({ triggerOnce: true, threshold: 0.15 });
  const { ref: ctaRef, inView: ctaInView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <>
      {/* About section */}
      <section
        className="py-20 md:py-28 px-6 md:px-10"
        style={{ background: "radial-gradient(ellipse at 50% 0%,rgba(46,158,143,.04) 0%,transparent 50%),#111111" }}
      >
        <div className="max-w-[1200px] mx-auto">
          <div ref={aboutRef} className="max-w-[800px]">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={aboutInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="font-dm font-semibold text-[11px] tracking-[.26em] text-[#2E9E8F] uppercase mb-4"
            >
              Sobre o programa
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={aboutInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.08, duration: 0.7, ease: EASE }}
              className="font-dm leading-relaxed mb-6"
              style={{ fontSize: "clamp(16px,1.8vw,19px)", color: "rgba(253,251,247,0.75)" }}
            >
              O ProSam — Programa de Saúde Mental — é um modelo de cuidado psicológico estruturado
              para servidores públicos municipais, desenvolvido pela Allos com base em evidências
              científicas e métricas de impacto.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={aboutInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.14, duration: 0.6 }}
              className="font-dm leading-relaxed mb-6"
              style={{ fontSize: "15px", color: "rgba(253,251,247,0.45)" }}
            >
              Após os resultados expressivos da primeira implementação em Bela Vista de Minas — com
              mais de 1.230 atendimentos e NPS acima de 90 — o modelo está sendo expandido para o
              município de Materlândia, MG.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={aboutInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="font-dm leading-relaxed"
              style={{ fontSize: "15px", color: "rgba(253,251,247,0.45)" }}
            >
              A implementação em Materlândia segue o mesmo modelo estruturado: seleção rigorosa de
              profissionais, supervisão clínica contínua, coleta sistemática de dados e foco em
              prevenção e promoção de saúde mental.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Status section */}
      <section
        className="py-20 md:py-28 px-6 md:px-10"
        style={{ background: "#F5F0E8" }}
      >
        <div className="max-w-[900px] mx-auto">
          <motion.div
            ref={statusRef}
            initial={{ opacity: 0, y: 24 }}
            animate={statusInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
            className="rounded-2xl overflow-hidden"
            style={{ background: "#FDFBF7", border: "1px solid rgba(26,26,26,0.08)", boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}
          >
            <div className="h-[3px]" style={{ background: "linear-gradient(to right,#2E9E8F,rgba(46,158,143,0.3))" }} />
            <div className="p-10 md:p-14">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-[#2E9E8F] animate-pulse" />
                <span className="font-dm font-semibold text-[12px] tracking-[.2em] text-[#2E9E8F] uppercase">
                  Programa em andamento
                </span>
              </div>

              <h3
                className="font-fraunces font-bold text-[#1A1A1A] mb-6 leading-snug"
                style={{ fontSize: "clamp(22px,3vw,32px)" }}
              >
                Implementação iniciada em 2026
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { label: "Atendimentos", value: "Dados em breve" },
                  { label: "Satisfação", value: "Dados em breve" },
                  { label: "Equipe", value: "Em formação" },
                ].map((item) => (
                  <div key={item.label} className="text-center p-5 rounded-xl" style={{ background: "rgba(46,158,143,0.06)" }}>
                    <p className="font-dm text-[11px] tracking-[.2em] text-[#2E9E8F] uppercase mb-2">
                      {item.label}
                    </p>
                    <p className="font-fraunces font-bold text-[#1A1A1A]" style={{ fontSize: "16px" }}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA link to Bela Vista */}
      <section
        className="py-20 md:py-28 px-6 md:px-10"
        style={{ background: "radial-gradient(ellipse at 95% 0%,rgba(46,158,143,.04) 0%,transparent 50%),#161616" }}
      >
        <div className="max-w-[900px] mx-auto">
          <motion.div
            ref={ctaRef}
            initial={{ opacity: 0, y: 24 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
            className="rounded-2xl overflow-hidden"
            style={{ background: "rgba(46,158,143,0.06)", border: "1px solid rgba(46,158,143,0.18)" }}
          >
            <div className="p-10 md:p-12 flex flex-col md:flex-row items-start md:items-center gap-8">
              <div className="flex-1">
                <p className="font-dm font-semibold text-[11px] tracking-[.26em] text-[#2E9E8F] uppercase mb-3">
                  Primeira implementação
                </p>
                <h3
                  className="font-fraunces font-bold text-[#FDFBF7] leading-snug mb-3"
                  style={{ fontSize: "clamp(20px,2.5vw,28px)" }}
                >
                  Veja os resultados da primeira implementação
                </h3>
                <p
                  className="font-dm leading-relaxed"
                  style={{ fontSize: "15px", color: "rgba(253,251,247,0.5)" }}
                >
                  O ProSam em Bela Vista de Minas já realizou mais de 1.230 atendimentos com NPS acima
                  de 90. Conheça os dados completos do projeto.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Link href={`${basePath}/projetos/prosam-bela-vista`}>
                  <motion.span
                    whileHover={{ scale: 1.04, boxShadow: "0 8px 28px rgba(46,158,143,.3)" }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2.5 font-dm font-semibold text-white bg-[#2E9E8F] rounded-full hover:bg-[#247F73] transition-colors"
                    style={{ padding: "13px 26px", fontSize: "14px" }}
                  >
                    ProSam Bela Vista
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
