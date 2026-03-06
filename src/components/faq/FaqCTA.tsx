"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function FaqCTA() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  return (
    <section
      ref={ref}
      className="py-24 md:py-32 px-6 md:px-10 relative overflow-hidden"
      style={{ background: "#1A1A1A" }}
    >
      {/* Linha separadora top */}
      <div className="absolute top-0 left-6 right-6 h-px" style={{ background: "rgba(253,251,247,0.06)" }} />

      {/* Radial bottom */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at bottom, rgba(200,75,49,.1) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-[700px] mx-auto text-center">
        {/* Ornamento */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={inView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#C84B31] opacity-40" />
          <div className="h-px w-10 bg-[#C84B31] opacity-15" />
          <div className="w-2 h-2 rounded-full bg-[#C84B31]" />
          <div className="h-px w-10 bg-[#C84B31] opacity-15" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#C84B31] opacity-40" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="font-fraunces font-bold text-[#FDFBF7] leading-tight mb-5"
          style={{ fontSize: "clamp(26px, 4vw, 48px)" }}
        >
          Não encontrou sua{" "}
          <span className="italic text-[#C84B31]">dúvida?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-dm leading-relaxed mb-10"
          style={{ fontSize: "clamp(14px, 1.6vw, 16px)", color: "rgba(253,251,247,0.5)" }}
        >
          Entre em contato com nossa equipe. Respondemos por e-mail e WhatsApp.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <motion.a
            href="https://chat.whatsapp.com/JpZtYWJovU03VlrZJ5oUxQ" target="_blank" rel="noopener noreferrer"
            whileHover={{ scale: 1.04, boxShadow: "0 6px 22px rgba(37,211,102,.3)" }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2.5 font-dm font-semibold text-white rounded-full hover:opacity-90 transition-all"
            style={{ background: "#25D366", padding: "13px 26px", fontSize: "14px" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
              <path d="M11.998 0C5.374 0 0 5.373 0 11.998c0 2.115.553 4.103 1.522 5.83L0 24l6.335-1.498A11.954 11.954 0 0011.998 24C18.623 24 24 18.626 24 11.998 24 5.373 18.623 0 11.998 0zm0 21.818a9.822 9.822 0 01-5.002-1.363l-.36-.214-3.724.98.993-3.628-.234-.375A9.83 9.83 0 012.18 12.001c0-5.42 4.4-9.818 9.82-9.818 5.418 0 9.82 4.399 9.82 9.818 0 5.42-4.4 9.817-9.82 9.817z" />
            </svg>
            WhatsApp
          </motion.a>

          <motion.a
            href="mailto:suporte@allos.org.br"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 font-dm font-medium rounded-full transition-all"
            style={{
              color: "#C84B31",
              border: "1px solid rgba(200,75,49,0.4)",
              padding: "13px 26px",
              fontSize: "14px",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            suporte@allos.org.br
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
