"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const expectativas = [
  "Leve o feedback a sério — ele é seu mapa de desenvolvimento",
  "Refaça a avaliação quantas vezes precisar — persistência é valorizada",
  "Assista aos vídeos de suporte indicados em cada competência",
  "Participe dos grupos abertos e busque supervisão quando necessário",
  "Entenda que a jornada importa tanto quanto o destino",
];

export default function PraticaPS() {
  const {ref,inView} = useInView({triggerOnce:true,threshold:.12});
  return (
    <section ref={ref} className="py-24 md:py-32" style={{background:"#FDFBF7"}}>
      <div className="max-w-[860px] mx-auto px-6 md:px-10">
        <motion.p initial={{opacity:0,y:10}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:.5}}
          className="font-dm font-semibold text-[11px] tracking-[.26em] text-[#C84B31] uppercase mb-4">Nossa filosofia</motion.p>
        <motion.h2 initial={{opacity:0,y:18}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.08,duration:.7,ease:[.22,1,.36,1]}}
          className="font-fraunces font-bold text-[#1A1A1A] leading-tight mb-8" style={{fontSize:"clamp(26px,3.5vw,44px)"}}>
          O aprendizado nasce <span className="italic text-[#C84B31]">da prática</span>
        </motion.h2>
        {["Na Allos, acreditamos que o aprendizado verdadeiro nasce da prática, do erro e do feedback. É fazendo, experimentando e refletindo que você se torna um terapeuta mais competente, seguro e capaz de lidar com a complexidade do encontro clínico.",
          "Cada prática é uma oportunidade de crescimento — de testar habilidades, superar inseguranças e evoluir continuamente."
        ].map((p,i) => (
          <motion.p key={i} initial={{opacity:0,y:10}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.1+i*.08,duration:.6}}
            className="font-dm text-[#5C5C5C] leading-relaxed mb-5 text-[15px]">{p}</motion.p>
        ))}
        <motion.div initial={{opacity:0,y:22}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.25,duration:.7,ease:[.22,1,.36,1]}}
          className="rounded-2xl overflow-hidden mt-10"
          style={{background:"linear-gradient(135deg,rgba(200,75,49,.07) 0%,rgba(45,106,79,.04) 100%)",border:"1px solid #E5DFD3"}}>
          <div className="px-8 py-5" style={{borderBottom:"1px solid #E5DFD3"}}>
            <h4 className="font-fraunces font-bold text-[#C84B31] text-lg">O que esperamos de você</h4>
          </div>
          <div>
            {expectativas.map((item,i) => (
              <motion.div key={i} initial={{opacity:0,x:-10}} animate={inView?{opacity:1,x:0}:{}} transition={{delay:.32+i*.06,duration:.5}}
                className="flex items-start gap-4 px-8 py-4" style={{borderBottom:i<expectativas.length-1?"1px solid #E5DFD3":"none"}}>
                <span className="text-[#C84B31] font-bold mt-0.5 flex-shrink-0">→</span>
                <p className="font-dm text-[#5C5C5C] text-[14px] leading-relaxed">{item}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <motion.p initial={{opacity:0,y:10}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.7,duration:.6}}
          className="font-dm text-[#5C5C5C] leading-relaxed mt-8 text-[15px]">
          Mais do que uma formação, somos uma <strong className="text-[#1A1A1A]">comunidade movida por um propósito</strong>: transformar a psicologia e a prática clínica em algo vivo, potente e humano.{" "}
          <em>Buscamos quem quer crescer junto, se desafiar e transformar talento em legado.</em>
        </motion.p>
      </div>
    </section>
  );
}
