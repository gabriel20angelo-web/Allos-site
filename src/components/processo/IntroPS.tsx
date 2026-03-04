"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function IntroPS() {
  const {ref,inView} = useInView({triggerOnce:true,threshold:.15});
  const up = (d:number) => ({initial:{opacity:0,y:26},animate:inView?{opacity:1,y:0}:{},transition:{delay:d,duration:.7,ease:[.22,1,.36,1]}});
  return (
    <section ref={ref} className="py-24 md:py-32" style={{background:"#F5F0E8"}}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Decorativo circular */}
        <motion.div initial={{opacity:0,scale:.9}} animate={inView?{opacity:1,scale:1}:{}} transition={{duration:.9,ease:[.22,1,.36,1]}}
          className="hidden lg:flex items-center justify-center">
          <div className="relative w-72 h-72">
            <div className="absolute inset-0 rounded-full" style={{border:"1px solid #E5DFD3"}}/>
            <div className="absolute inset-8 rounded-full" style={{border:"1px dashed #D4CBB8"}}/>
            <div className="absolute inset-16 rounded-full flex items-center justify-center"
              style={{background:"rgba(200,75,49,.05)",border:"1px solid rgba(200,75,49,.15)"}}>
              <div className="text-center">
                <p className="font-dm text-[10px] tracking-[.28em] text-[#5C5C5C] uppercase mb-1">Programa</p>
                <p className="font-fraunces font-bold italic text-[#C84B31] text-2xl">Estágio</p>
                <p className="font-dm text-[10px] tracking-[.22em] text-[#5C5C5C] uppercase mt-1">Allos</p>
              </div>
            </div>
          </div>
        </motion.div>
        <div>
          <motion.p {...up(0)} className="font-dm font-semibold text-[11px] tracking-[.26em] text-[#C84B31] uppercase mb-4">Sobre o programa</motion.p>
          <motion.h2 {...up(.08)} className="font-fraunces font-bold text-[#1A1A1A] leading-tight mb-8" style={{fontSize:"clamp(28px,4vw,48px)"}}>
            Transformando <span className="italic text-[#C84B31]">Talentos</span> em Legado
          </motion.h2>
          <div className="space-y-4 font-dm text-[#5C5C5C] leading-relaxed text-[15px]">
            <motion.p {...up(.12)}>O Programa de Estágio tem como objetivo desenvolver jovens talentos por meio da participação ativa na rotina, nos processos e nos projetos da associação — encarando desafios reais com iniciativas inovadoras.</motion.p>
            <motion.p {...up(.18)}>A duração do programa é de até dois anos e, ao longo de todo o processo, o estudante terá acesso a uma trilha de desenvolvimento estruturada e diversos benefícios.</motion.p>
          </div>
          <motion.div {...up(.26)} className="mt-8 flex items-center gap-3">
            <div className="h-px w-8 bg-[#C84B31] opacity-50"/>
            <p className="font-dm text-[11px] tracking-[.24em] text-[#5C5C5C] uppercase">Associação Allos</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
