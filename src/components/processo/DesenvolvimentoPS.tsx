"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function DesenvolvimentoPS() {
  const {ref,inView} = useInView({triggerOnce:true,threshold:.12});
  const up = (d:number) => ({initial:{opacity:0,y:24},animate:inView?{opacity:1,y:0}:{},transition:{delay:d,duration:.7,ease:[.22,1,.36,1]}});
  return (
    <section id="desenvolvimento" ref={ref} className="py-24 md:py-32" style={{background:"#F5F0E8"}}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div>
          <motion.p {...up(0)} className="font-dm font-semibold text-[11px] tracking-[.26em] text-[#C84B31] uppercase mb-4">Sobre o AvaliAllos</motion.p>
          <motion.h2 {...up(.08)} className="font-fraunces font-bold text-[#1A1A1A] leading-tight mb-8" style={{fontSize:"clamp(24px,3.2vw,40px)"}}>
            Mais do que uma avaliação,{" "}<span className="italic text-[#C84B31]">um caminho de desenvolvimento</span>
          </motion.h2>
          {["A avaliação por banca é o melhor instrumento disponível para cumprir uma tarefa quase impossível: avaliar a aptidão clínica de alguém em apenas meia hora.",
            "Seu principal objetivo não é aprovar ou reprovar, mas oferecer um feedback individual, específico e indicar caminhos concretos para desenvolver e aprimorar suas habilidades clínicas.",
            "Por isso, você pode — e deve — refazer a avaliação quantas vezes quiser, assistir aos vídeos de suporte, participar dos grupos abertos da formação e solicitar ajuda individual."
          ].map((p,i) => (
            <motion.p key={i} {...up(.1+i*.07)} className="font-dm text-[#5C5C5C] leading-relaxed mb-5 text-[15px]">{p}</motion.p>
          ))}
        </div>
        {/* Quote box — exatamente como no original */}
        <motion.div initial={{opacity:0,x:22}} animate={inView?{opacity:1,x:0}:{}} transition={{delay:.22,duration:.8,ease:[.22,1,.36,1]}}>
          <div className="rounded-2xl overflow-hidden"
            style={{background:"#FDFBF7",borderLeft:"4px solid #C84B31",borderRadius:"0 16px 16px 0"}}>
            <div className="p-10">
              <div className="font-fraunces text-[100px] text-[#C84B31] leading-none opacity-[.1] select-none mb-2">"</div>
              <p className="font-fraunces italic font-light text-[#1A1A1A] leading-relaxed mb-8" style={{fontSize:"clamp(17px,2.1vw,22px)"}}>
                Somos irrazoáveis na busca por excelência. O que realmente buscamos vai além do talento: queremos quem leva o feedback a sério, quem aprende, aplica e melhora.
              </p>
              <div className="flex items-center gap-3">
                <div className="h-px w-6 bg-[#C84B31] opacity-50"/>
                <cite className="not-italic font-dm text-[#5C5C5C] text-sm">Filosofia Allos</cite>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
