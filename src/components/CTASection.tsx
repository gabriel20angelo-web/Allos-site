"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function CTASection() {
  const {ref,inView} = useInView({triggerOnce:true,threshold:.2});
  return (
    <section ref={ref} className="py-8 px-6 md:px-10" style={{background:"#FDFBF7"}}>
      <div className="max-w-[1200px] mx-auto">
        <div className="relative rounded-2xl overflow-hidden py-24 md:py-32 px-8 md:px-16 text-center"
          style={{background:"linear-gradient(135deg,#F5F0E8 0%,#EDE5D8 100%)",border:"1px solid #E5DFD3"}}>
          <div className="absolute inset-0 pointer-events-none"
            style={{background:"radial-gradient(ellipse 60% 55% at 50% 50%,rgba(200,75,49,.06) 0%,transparent 70%)"}}/>
          <div className="relative z-10">
            <motion.p initial={{opacity:0,y:10}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.05,duration:.5}}
              className="font-dm font-semibold text-[11px] tracking-[.28em] text-[#C84B31] uppercase mb-5">Projetos</motion.p>
            <motion.h2 initial={{opacity:0,y:18}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.12,duration:.7,ease:[.22,1,.36,1]}}
              className="font-fraunces font-bold text-[#1A1A1A] mb-5 leading-tight" style={{fontSize:"clamp(28px,5vw,56px)"}}>
              Conheça nossos{" "}<span className="italic text-[#C84B31]">projetos</span>
            </motion.h2>
            <motion.p initial={{opacity:0,y:14}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.2,duration:.6}}
              className="font-dm text-[#5C5C5C] max-w-[460px] mx-auto leading-relaxed mb-10" style={{fontSize:"clamp(15px,1.7vw,17px)"}}>
              Iniciativas clínicas e institucionais que promovem saúde mental, formação profissional e impacto social duradouro.
            </motion.p>
            <motion.div initial={{opacity:0,scale:.92}} animate={inView?{opacity:1,scale:1}:{}} transition={{delay:.3,duration:.5}}>
              <motion.a href="#" whileHover={{scale:1.04,boxShadow:"0 10px 36px rgba(200,75,49,.32)"}} whileTap={{scale:.97}}
                className="inline-flex items-center gap-2.5 font-dm font-semibold text-white bg-[#C84B31] rounded-full hover:bg-[#A33D27] transition-colors"
                style={{padding:"15px 44px",fontSize:"15px"}}>
                Ver projetos
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </motion.a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
