"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import basePath from "@/lib/basePath";

const EASE = [0.22, 1, 0.36, 1];

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
    icon: "💬",
    title: "Dinâmicas de conversa",
    desc: "Rodas de diálogo que promovem troca de experiências e construção de vínculos entre as participantes.",
  },
  {
    icon: "🤝",
    title: "Acolhimento",
    desc: "Escuta qualificada e espaço seguro para expressão de emoções, dificuldades e conquistas da maternidade.",
  },
  {
    icon: "👁️",
    title: "Percepção e autocuidado",
    desc: "Atividades que desenvolvem a capacidade de autopercepção e práticas de cuidado consigo mesma.",
  },
  {
    icon: "💪",
    title: "Fortalecimento emocional",
    desc: "Estratégias para lidar com os desafios do cotidiano e construir resiliência emocional.",
  },
];

function AtividadeCard({ item, index }: { item: typeof atividades[0]; index: number }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.65, ease: EASE }}
      whileHover={{ y: -5, transition: { duration: 0.25 } }}
      className="group relative rounded-2xl overflow-hidden flex flex-col"
      style={{ background: "rgba(253,251,247,0.03)", border: "1px solid rgba(253,251,247,0.07)" }}
    >
      <div
        className="h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
        style={{ background: "linear-gradient(to right,#C84B31,rgba(200,75,49,0))" }}
      />
      <div className="p-8 flex flex-col flex-1">
        <span className="text-3xl mb-5">{item.icon}</span>
        <h3
          className="font-fraunces font-bold text-[#FDFBF7] mb-4 leading-snug"
          style={{ fontSize: "clamp(17px,1.8vw,20px)" }}
        >
          {item.title}
        </h3>
        <p
          className="font-dm leading-relaxed flex-1"
          style={{ fontSize: "15px", color: "rgba(253,251,247,0.5)" }}
        >
          {item.desc}
        </p>
      </div>
    </motion.div>
  );
}

export default function RamaContent() {
  const { ref: aboutRef, inView: aboutInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: statsRef, inView: statsInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: photoRef, inView: photoInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <>
      {/* About section */}
      <section
        className="py-20 md:py-28 px-6 md:px-10"
        style={{ background: "radial-gradient(ellipse at 50% 0%,rgba(200,75,49,.04) 0%,transparent 50%),#111111" }}
      >
        <div className="max-w-[1200px] mx-auto">
          <div ref={aboutRef} className="max-w-[800px]">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={aboutInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="font-dm font-semibold text-[11px] tracking-[.26em] text-[#C84B31] uppercase mb-4"
            >
              Sobre o projeto
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={aboutInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.08, duration: 0.7, ease: EASE }}
              className="font-dm leading-relaxed mb-6"
              style={{ fontSize: "clamp(16px,1.8vw,19px)", color: "rgba(253,251,247,0.75)" }}
            >
              A Rede RAMA — Rede de Apoio a Mães e Acompanhantes — é um projeto desenvolvido em
              parceria com o PROINEPE nos territórios de Vigário Geral, Parada de Lucas e Jardim América,
              no Rio de Janeiro.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={aboutInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.14, duration: 0.6 }}
              className="font-dm leading-relaxed mb-6"
              style={{ fontSize: "15px", color: "rgba(253,251,247,0.45)" }}
            >
              A Allos atua desde setembro de 2024 oferecendo grupos de acolhimento e fortalecimento
              emocional para mães em situação de vulnerabilidade social. O projeto promove espaços
              seguros de escuta, troca e desenvolvimento de estratégias de enfrentamento, contribuindo
              para a saúde mental materna e o fortalecimento de vínculos comunitários.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={aboutInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="font-dm leading-relaxed"
              style={{ fontSize: "15px", color: "rgba(253,251,247,0.45)" }}
            >
              A atuação integra dinâmicas de conversa, atividades de autocuidado e percepção emocional,
              sempre em diálogo com a realidade e as demandas das participantes.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Impact stats */}
      <section
        ref={statsRef}
        className="py-20 md:py-28 px-6 md:px-10 relative overflow-hidden text-center"
        style={{ background: "linear-gradient(135deg,#C84B31 0%,#A33D27 100%)" }}
      >
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-[.08]" style={{ border: "1px solid white" }} />
        <div className="absolute -bottom-12 -left-12 w-56 h-56 rounded-full opacity-[.06]" style={{ border: "1px solid white" }} />

        <div className="relative z-10 max-w-[1000px] mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
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
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
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

      {/* Photo gallery */}
      <section
        className="py-20 md:py-28 px-6 md:px-10"
        style={{ background: "#F5F0E8" }}
      >
        <div className="max-w-[1200px] mx-auto">
          <div ref={photoRef} className="mb-12">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={photoInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="font-dm font-semibold text-[11px] tracking-[.26em] text-[#C84B31] uppercase mb-4"
            >
              Registro
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={photoInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.08, duration: 0.7, ease: EASE }}
              className="font-fraunces font-bold text-[#1A1A1A] leading-snug"
              style={{ fontSize: "clamp(24px,3.5vw,36px)" }}
            >
              Momentos do projeto
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {["projetoRAMA1.jpeg", "projetoRAMA2.jpeg"].map((img, i) => (
              <motion.div
                key={img}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.7, ease: EASE }}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden"
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

      {/* Activities section */}
      <section
        className="py-20 md:py-28 px-6 md:px-10"
        style={{ background: "radial-gradient(ellipse at 95% 0%,rgba(200,75,49,.04) 0%,transparent 50%),#161616" }}
      >
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="flex items-center gap-6 mb-12 origin-left"
          >
            <div className="h-px flex-1" style={{ background: "rgba(253,251,247,0.07)" }} />
            <span className="font-dm text-[10px] tracking-[.28em] uppercase flex-shrink-0" style={{ color: "rgba(253,251,247,0.25)" }}>
              O que fazemos
            </span>
            <div className="h-px flex-1" style={{ background: "rgba(253,251,247,0.07)" }} />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {atividades.map((item, i) => (
              <AtividadeCard key={item.title} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
