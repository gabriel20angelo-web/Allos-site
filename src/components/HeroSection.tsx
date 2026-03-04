"use client";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
const HeroCanvas = dynamic(()=>import("./HeroCanvas"),{ssr:false});

function WordReveal({words,italic=false,delay=0}:{words:string[];italic?:boolean;delay?:number}) {
  const r = useReducedMotion();
  return (
    <div className="flex flex-wrap justify-center gap-x-5 gap-y-0">
      {words.map((w,i)=>(
        <div key={w} style={{overflow:"hidden",paddingBottom:".1em",marginBottom:"-.1em"}}>
          <motion.span className={`block font-fraunces font-bold ${italic?"italic":""}`}
            style={{color:italic?"#C84B31":"#1A1A1A"}}
            initial={r?{opacity:0}:{clipPath:"inset(0 100% 0 0)",opacity:0}}
            animate={r?{opacity:1}:{clipPath:"inset(0 0% 0 0)",opacity:1}}
            transition={{delay:delay+i*.12,duration:r?.3:.75,ease:[.22,1,.36,1]}}>
            {w}
          </motion.span>
        </div>
      ))}
    </div>
  );
}

export default function HeroSection() {
  const r = useReducedMotion();
  const up = (d:number) => ({initial:{opacity:0,y:r?0:22},animate:{opacity:1,y:0},transition:{delay:d,duration:.7,ease:[.22,1,.36,1]}});
  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden"
      style={{background:"radial-gradient(ellipse at 20% 80%,rgba(200,75,49,.07) 0%,transparent 50%),radial-gradient(ellipse at 80% 20%,rgba(45,106,79,.05) 0%,transparent 50%),#FDFBF7"}}>
      <HeroCanvas/>
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">
        <motion.div {...up(.1)} className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-dm text-[13px] font-medium text-[#5C5C5C]"
            style={{background:"#F5F0E8",border:"1px solid #E5DFD3"}}>
            <span className="text-[#C84B31] text-xs">◆</span>
            Transformando talentos em legado
          </div>
        </motion.div>
        <div className="mb-6 leading-none" style={{fontSize:"clamp(44px,8vw,88px)"}}>
          <WordReveal words={["TRANSFORMANDO","TALENTOS"]} delay={.3}/>
          <WordReveal words={["EM","LEGADO"]} italic delay={.52}/>
        </div>
        <motion.p {...up(.85)} className="font-dm text-[#5C5C5C] max-w-[560px] leading-relaxed mb-10"
          style={{fontSize:"clamp(15px,1.8vw,18px)"}}>
          Uma associação que integra aprendizado teórico e prático à prestação de serviços clínicos, formação profissional e projetos sociais de impacto.
        </motion.p>
        <motion.div {...up(1.05)} className="flex flex-wrap gap-4 justify-center">
          <motion.a href="#" whileHover={{scale:1.04,boxShadow:"0 8px 28px rgba(200,75,49,.3)"}} whileTap={{scale:.97}}
            className="font-dm font-semibold text-white bg-[#C84B31] px-8 py-3.5 rounded-full hover:bg-[#A33D27] transition-colors">
            Agendar sessão →
          </motion.a>
          <motion.a href="#frentes" whileHover={{scale:1.03}} whileTap={{scale:.97}}
            className="font-dm font-medium text-[#C84B31] border border-[#C84B31] px-8 py-3.5 rounded-full hover:bg-[rgba(200,75,49,.05)] transition-all">
            Conheça a Allos
          </motion.a>
        </motion.div>
      </div>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.4,duration:.6}}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <p className="font-dm text-[10px] tracking-[.25em] text-[#5C5C5C] uppercase">Role para explorar</p>
        <motion.div animate={{y:[0,6,0]}} transition={{duration:1.6,repeat:Infinity,ease:"easeInOut"}}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M3 6L8 11L13 6" stroke="#5C5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </motion.div>
      <div className="absolute bottom-0 left-0 right-0 h-px z-10"
        style={{background:"linear-gradient(to right,transparent,#E5DFD3 30%,#E5DFD3 70%,transparent)"}}/>
    </section>
  );
}
