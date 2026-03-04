"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const cats: Record<string,{cor:string;bg:string}> = {
  "Processo":    {cor:"#8B5CF6",bg:"rgba(139,92,246,.06)"},
  "Estrutura":   {cor:"#6366F1",bg:"rgba(99,102,241,.06)"},
  "Relação":     {cor:"#EC4899",bg:"rgba(236,72,153,.06)"},
  "Técnica":     {cor:"#F59E0B",bg:"rgba(245,158,11,.06)"},
  "Performance": {cor:"#10B981",bg:"rgba(16,185,129,.06)"},
};

const comps = [
  {c:"Processo",n:"Estágio de Mudança"},
  {c:"Estrutura",n:"Estrutura do Atendimento"},{c:"Estrutura",n:"Encerramento"},
  {c:"Relação",n:"Acolhimento"},{c:"Relação",n:"Segurança no Terapeuta"},{c:"Relação",n:"Segurança no Método"},
  {c:"Técnica",n:"Aprofundar / Investigação"},{c:"Técnica",n:"Hipóteses Clínicas"},{c:"Técnica",n:"Interpretação"},
  {c:"Performance",n:"Frase & Timing"},{c:"Performance",n:"Corpo & Setting"},{c:"Performance",n:"Insight & Potência"},
];

export default function CompetenciasPS() {
  const {ref,inView} = useInView({triggerOnce:true,threshold:.08});
  return (
    <section ref={ref} className="py-24 md:py-32" style={{background:"#F5F0E8"}}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <div className="mb-14">
          <motion.p initial={{opacity:0,y:10}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:.5}}
            className="font-dm font-semibold text-[11px] tracking-[.26em] text-[#C84B31] uppercase mb-4">As 12 Competências</motion.p>
          <motion.h2 initial={{opacity:0,y:16}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.1,duration:.7,ease:[.22,1,.36,1]}}
            className="font-fraunces font-bold text-[#1A1A1A] mb-4" style={{fontSize:"clamp(26px,3.5vw,44px)"}}>
            O que avaliamos <span className="italic text-[#C84B31]">em você</span>
          </motion.h2>
          <motion.p initial={{opacity:0,y:10}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.18,duration:.6}}
            className="font-dm text-[#5C5C5C] max-w-[600px] text-[15px]">
            Cada competência reflete uma dimensão essencial da prática clínica. A avaliação é holística — buscamos equilíbrio entre todas elas.
          </motion.p>
        </div>
        {/* Legenda */}
        <motion.div initial={{opacity:0,y:8}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.2,duration:.5}}
          className="flex flex-wrap gap-4 mb-8">
          {Object.entries(cats).map(([cat,{cor}]) => (
            <div key={cat} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm" style={{background:cor}}/>
              <span className="font-dm text-[#5C5C5C] text-xs tracking-wide">{cat}</span>
            </div>
          ))}
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {comps.map((comp,i) => {
            const {cor,bg} = cats[comp.c];
            return (
              <motion.div key={i} initial={{opacity:0,y:18}} animate={inView?{opacity:1,y:0}:{}}
                transition={{delay:.15+i*.04,duration:.5}}
                whileHover={{y:-4,boxShadow:"0 8px 24px rgba(0,0,0,.08)",transition:{duration:.2}}}
                className="rounded-xl p-5 cursor-default"
                style={{background:"#FDFBF7",border:"1px solid #E5DFD3",borderLeft:`3px solid ${cor}`}}>
                <div className="inline-flex items-center px-2 py-0.5 rounded-full mb-3" style={{background:bg}}>
                  <span className="font-dm font-semibold text-[9px] tracking-[.18em] uppercase" style={{color:cor}}>{comp.c}</span>
                </div>
                <p className="font-fraunces font-bold text-[#1A1A1A] text-sm leading-snug">{comp.n}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
