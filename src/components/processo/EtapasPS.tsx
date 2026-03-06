"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";

const etapas = [
  {n:"01",nome:"Inscrições",desc:"Formulário inicial de candidatura"},
  {n:"02",nome:"Chamada",desc:"Todos os inscritos são chamados",destaque:true},
  {n:"03",nome:"AvaliAllos",desc:"Avaliação de aptidão clínica"},
  {n:"04",nome:"Entrevista",desc:"Conversa de alinhamento",destaque:true},
  {n:"05",nome:"Onboarding",desc:"Integração e início das atividades"},
];

export default function EtapasPS() {
  const {ref,inView} = useInView({triggerOnce:true,threshold:.15});
  return (
    <section ref={ref} className="py-24 md:py-32 overflow-hidden" style={{background:"#F5F0E8"}}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <div className="text-center mb-20">
          <motion.p initial={{opacity:0}} animate={inView?{opacity:1}:{}} transition={{duration:.5}}
            className="font-dm font-semibold text-[11px] tracking-[.26em] text-[#C84B31] uppercase mb-4">Jornada</motion.p>
          <motion.h2 initial={{opacity:0,y:16}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.1,duration:.7,ease:[.22,1,.36,1]}}
            className="font-fraunces font-bold text-[#1A1A1A]" style={{fontSize:"clamp(26px,3.5vw,44px)"}}>
            As etapas do <span className="italic text-[#C84B31]">processo seletivo</span>
          </motion.h2>
        </div>
        <div className="relative">
          <div className="hidden md:block absolute top-[26px] left-0 right-0 h-px" style={{background:"#E5DFD3"}}/>
          <motion.div className="hidden md:block absolute top-[26px] left-0 h-px origin-left"
            style={{background:"linear-gradient(to right,#C84B31,rgba(200,75,49,.15))"}}
            initial={{scaleX:0}} animate={inView?{scaleX:1}:{}} transition={{delay:.3,duration:1.1,ease:[.22,1,.36,1]}}/>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4">
            {etapas.map((e,i) => (
              <motion.div key={e.n} initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.22+i*.1,duration:.6}}
                className="flex flex-col items-center text-center">
                <motion.div whileHover={{scale:1.1}} transition={{duration:.2}}
                  className="relative z-10 w-[52px] h-[52px] rounded-full flex items-center justify-center mb-5"
                  style={e.destaque?{background:"#C84B31",color:"white"}:{background:"#FDFBF7",border:"1.5px solid #E5DFD3",color:"#C84B31"}}>
                  <span className="font-fraunces font-bold text-sm">{e.n}</span>
                </motion.div>
                <p className="font-fraunces font-bold text-[13px] mb-1.5 leading-tight"
                  style={{color:e.destaque?"#C84B31":"#1A1A1A"}}>{e.nome}</p>
                <p className="font-dm text-[#5C5C5C] text-xs leading-snug">{e.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <motion.div initial={{opacity:0,y:16}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.85,duration:.6}}
          className="mt-16 p-8 md:p-10 rounded-2xl text-center"
          style={{background:"#FDFBF7",border:"1px solid #E5DFD3"}}>
          <p className="font-dm text-[11px] tracking-[.24em] text-[#C84B31] uppercase mb-2">Prepare-se</p>
          <p className="font-fraunces font-bold text-[#1A1A1A] text-xl mb-3">Prepare-se para a avaliação</p>
          <p className="font-dm text-[#5C5C5C] text-sm mb-6 max-w-[500px] mx-auto leading-relaxed">Conheça os critérios, assista aos vídeos de suporte e participe dos grupos formativos antes da sua avaliação.</p>
          <motion.div whileHover={{scale:1.04,boxShadow:"0 6px 20px rgba(200,75,49,.25)"}} whileTap={{scale:.97}} className="inline-block">
            <Link href="/formacao"
              className="inline-flex font-dm font-semibold text-white bg-[#C84B31] rounded-full hover:bg-[#A33D27] transition-colors"
              style={{padding:"11px 28px",fontSize:"14px"}}>Conheça a Formação</Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
