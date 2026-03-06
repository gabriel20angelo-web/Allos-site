"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";

const CAT_COLORS: Record<string,string> = {
  "Estrutura":"#C84B31",
  "Relação":"#D4854A",
  "Formulação":"#B84060",
  "Performance":"#8B5CF6",
};

const comps = [
  {c:"Estrutura",n:"Estágio de Mudança",href:"/estagios-mudanca"},
  {c:"Estrutura",n:"Estrutura do Atendimento",href:"/coerencia-consistencia"},
  {c:"Estrutura",n:"Abertura & Encerramento",href:"/abertura-encerramento"},
  {c:"Relação",n:"Acolhimento",href:"/acolhimento"},
  {c:"Relação",n:"Segurança no Terapeuta",href:"/seguranca-terapeuta"},
  {c:"Relação",n:"Segurança no Método",href:"/seguranca-metodo"},
  {c:"Formulação",n:"Aprofundar / Investigação",href:"/aprofundamento"},
  {c:"Formulação",n:"Hipóteses Clínicas",href:"/hipoteses-clinicas"},
  {c:"Formulação",n:"Interpretação",href:"/interpretacao"},
  {c:"Performance",n:"Frase & Timing",href:"/frase-timing"},
  {c:"Performance",n:"Corpo & Setting",href:"/setting-corpo"},
  {c:"Performance",n:"Insight & Potência",href:"/potencia-insight"},
];

const categories = ["Estrutura","Relação","Formulação","Performance"];

export default function CompetenciasPS() {
  const {ref,inView} = useInView({triggerOnce:true,threshold:.08});

  return (
    <section ref={ref} className="py-24 md:py-32 relative overflow-hidden" style={{background:"#1A1A1A"}}>
      {/* Grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[.025]"
        style={{backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"}}/>
      {/* Radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{background:"radial-gradient(ellipse at top,rgba(200,75,49,.08) 0%,transparent 60%)"}}/>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div initial={{opacity:0,y:10}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:.5}}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)"}}>
            <span className="text-[#C84B31] text-xs">◆</span>
            <span className="font-dm text-[11px] tracking-[.24em] text-[rgba(253,251,247,.6)] uppercase">As 12 Competências</span>
          </motion.div>
          <motion.h2 initial={{opacity:0,y:16}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.1,duration:.7,ease:[.22,1,.36,1]}}
            className="font-fraunces font-bold text-[#FDFBF7] mb-4" style={{fontSize:"clamp(26px,3.5vw,44px)"}}>
            O que avaliamos <span className="italic text-[#C84B31]">em você</span>
          </motion.h2>
          <motion.p initial={{opacity:0,y:10}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.18,duration:.6}}
            className="font-dm text-[rgba(253,251,247,.45)] max-w-[540px] mx-auto text-[15px]">
            Cada competência reflete uma dimensão essencial da prática clínica. Clique para explorar cada uma em detalhes.
          </motion.p>
        </div>

        {/* Category legend */}
        <motion.div initial={{opacity:0}} animate={inView?{opacity:1}:{}} transition={{delay:.2,duration:.5}}
          className="flex flex-wrap justify-center gap-6 mb-12">
          {categories.map(cat => (
            <div key={cat} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{background:CAT_COLORS[cat],boxShadow:`0 0 8px ${CAT_COLORS[cat]}40`}}/>
              <span className="font-dm text-[rgba(253,251,247,.5)] text-xs tracking-wide">{cat}</span>
            </div>
          ))}
        </motion.div>

        {/* Grid — 4 columns, 3 rows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {comps.map((comp,i) => {
            const color = CAT_COLORS[comp.c];
            return (
              <motion.div key={i}
                initial={{opacity:0,y:20}}
                animate={inView?{opacity:1,y:0}:{}}
                transition={{delay:.15+i*.04,duration:.5,ease:[.22,1,.36,1]}}
              >
                <Link href={comp.href}
                  className="group block rounded-xl p-5 h-full relative overflow-hidden no-underline transition-all duration-300"
                  style={{
                    background:"rgba(255,255,255,.04)",
                    border:"1px solid rgba(255,255,255,.08)",
                  }}
                  onMouseEnter={(e)=>{
                    e.currentTarget.style.background="rgba(255,255,255,.08)";
                    e.currentTarget.style.borderColor=`${color}50`;
                    e.currentTarget.style.transform="translateY(-4px)";
                    e.currentTarget.style.boxShadow=`0 12px 32px rgba(0,0,0,.3), 0 0 0 1px ${color}30`;
                  }}
                  onMouseLeave={(e)=>{
                    e.currentTarget.style.background="rgba(255,255,255,.04)";
                    e.currentTarget.style.borderColor="rgba(255,255,255,.08)";
                    e.currentTarget.style.transform="translateY(0)";
                    e.currentTarget.style.boxShadow="none";
                  }}
                >
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity"
                    style={{background:`linear-gradient(to right, ${color}, transparent)`}}/>

                  {/* Category dot + label */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full" style={{background:color}}/>
                    <span className="font-dm text-[9px] font-semibold tracking-[.2em] uppercase" style={{color}}>{comp.c}</span>
                  </div>

                  {/* Name */}
                  <p className="font-fraunces font-bold text-[#FDFBF7] text-[15px] leading-snug mb-3 group-hover:text-white transition-colors">
                    {comp.n}
                  </p>

                  {/* Arrow */}
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-4px] group-hover:translate-x-0">
                    <span className="font-dm text-[11px]" style={{color}}>Explorar</span>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
