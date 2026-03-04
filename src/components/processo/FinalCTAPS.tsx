"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function FinalCTAPS() {
  const {ref,inView} = useInView({triggerOnce:true,threshold:.15});
  return (
    <section id="agendar" ref={ref} className="py-28 md:py-36 px-6 md:px-10 relative overflow-hidden" style={{background:"#1A1A1A"}}>
      {/* Grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[.025]"
        style={{backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"}}/>
      {/* Radial terracota bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] pointer-events-none"
        style={{background:"radial-gradient(ellipse at bottom,rgba(200,75,49,.12) 0%,transparent 70%)"}}/>

      <div className="relative z-10 max-w-[700px] mx-auto text-center">
        {/* Ornamento */}
        <motion.div initial={{opacity:0,scaleX:0}} animate={inView?{opacity:1,scaleX:1}:{}} transition={{duration:.6}}
          className="flex items-center justify-center gap-3 mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-[#C84B31] opacity-50"/>
          <div className="h-px w-12 bg-[#C84B31] opacity-20"/>
          <div className="w-2 h-2 rounded-full bg-[#C84B31]"/>
          <div className="h-px w-12 bg-[#C84B31] opacity-20"/>
          <div className="w-1.5 h-1.5 rounded-full bg-[#C84B31] opacity-50"/>
        </motion.div>

        <motion.h2 initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.1,duration:.8,ease:[.22,1,.36,1]}}
          className="font-fraunces font-bold text-[#FDFBF7] leading-tight mb-5" style={{fontSize:"clamp(30px,5vw,58px)"}}>
          Pronto para começar{" "}
          <span className="italic text-[#C84B31]">sua jornada?</span>
        </motion.h2>
        <motion.p initial={{opacity:0,y:14}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.2,duration:.6}}
          className="font-dm text-[rgba(253,251,247,.55)] leading-relaxed mb-10" style={{fontSize:"clamp(15px,1.7vw,17px)"}}>
          Agende sua avaliação e dê o primeiro passo para se tornar parte da comunidade Allos. Não é sobre passar de primeira — é sobre evoluir.
        </motion.p>
        <motion.div initial={{opacity:0,scale:.92}} animate={inView?{opacity:1,scale:1}:{}} transition={{delay:.32,duration:.5}}
          className="flex flex-col items-center gap-4">
          <motion.a href="/agendar-avaliacao" whileHover={{scale:1.05,boxShadow:"0 10px 40px rgba(200,75,49,.4)"}} whileTap={{scale:.97}}
            className="inline-flex items-center gap-2.5 font-dm font-semibold text-white bg-[#C84B31] rounded-full hover:bg-[#A33D27] transition-colors"
            style={{padding:"16px 48px",fontSize:"15px",boxShadow:"inset 0 1px 0 rgba(255,255,255,.12)"}}>
            Agendar minha avaliação
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </motion.a>
          <p className="font-dm text-[rgba(253,251,247,.4)] text-sm">
            Dúvidas?{" "}
            <a href="#" className="text-[#C84B31] hover:underline">Fale com a equipe de seleção</a>
            {" "}ou{" "}
            <a href="#" className="text-[#C84B31] hover:underline">acesse os materiais de preparação.</a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
