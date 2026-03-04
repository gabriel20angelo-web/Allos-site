"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const cards = [
  { icon:"📊", title:"Avaliação Real", body:"O AvaliAllos é uma simulação de atendimento clínico com banca avaliadora ao vivo. Duração de 20 minutos, critérios claros, feedback imediato." },
  { icon:"🎯", title:"Nota de Corte +25", body:"Cada competência vale de -9 a +9. A soma gera sua nota total. Precisamos de +25 para a aprovação — isso exige equilíbrio em todas as dimensões." },
  { icon:"💡", title:"Formativo, Não Punitivo", body:"Reprovar não é fracasso — é aprendizado. Refaça quantas vezes quiser. Os valores e a disposição de crescer também influenciam a avaliação." },
];

export default function DarkInfoSection() {
  const {ref,inView} = useInView({triggerOnce:true,threshold:.15});
  return (
    <section ref={ref} className="py-24 md:py-32 px-6 md:px-10 relative overflow-hidden" style={{background:"#1A1A1A"}}>
      {/* Grain sutil */}
      <div className="absolute inset-0 pointer-events-none opacity-[.025]"
        style={{backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"}}/>
      {/* Radial terracota suave */}
      <div className="absolute top-0 right-0 w-[500px] h-[400px] pointer-events-none"
        style={{background:"radial-gradient(ellipse at top right,rgba(200,75,49,.08) 0%,transparent 65%)"}}/>

      <div className="relative z-10 max-w-[1200px] mx-auto">
        <div className="mb-14">
          <motion.p initial={{opacity:0,x:-12}} animate={inView?{opacity:1,x:0}:{}} transition={{duration:.5}}
            className="font-dm font-semibold text-[11px] tracking-[.26em] text-[#C84B31] uppercase mb-4">
            Como funciona
          </motion.p>
          <motion.h2 initial={{opacity:0,y:18}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.1,duration:.7,ease:[.22,1,.36,1]}}
            className="font-fraunces font-bold text-[#FDFBF7] max-w-[600px]" style={{fontSize:"clamp(28px,4vw,48px)"}}>
            O processo que{" "}<span className="italic text-[#C84B31]">transforma</span> terapeutas
          </motion.h2>
        </div>

        {/* Escala de pontuação — fiel ao original */}
        <motion.div initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.2,duration:.7}}
          className="mb-12 pb-10 relative" style={{borderBottom:"1px solid rgba(255,255,255,.08)"}}>
          <div className="flex justify-between items-end">
            {[
              {v:"-100",label:"Limite inferior",cls:"text-[#EF4444]"},
              {v:"-9",label:"Erro fatal",cls:"text-[#EF4444]"},
              {v:"0",label:"Mediano",cls:"text-[#FBBF24]"},
              {v:"+25",label:"Nota de corte",cls:"text-[#C84B31]"},
              {v:"+100",label:"Limite superior",cls:"text-[#10B981]"},
            ].map((p,i) => (
              <motion.div key={i} initial={{opacity:0,y:12}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.25+i*.06,duration:.5}}
                className="text-center flex-1">
                <div className={`font-fraunces font-bold text-2xl md:text-3xl mb-2 ${p.cls}`}>{p.v}</div>
                <div className="font-dm text-[rgba(253,251,247,.5)] text-xs max-w-[80px] mx-auto leading-snug hidden sm:block">{p.label}</div>
              </motion.div>
            ))}
          </div>
          {/* Barra gradiente */}
          <motion.div className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full"
            style={{background:"linear-gradient(to right,#EF4444,#FBBF24 50%,#10B981)"}}
            initial={{scaleX:0,originX:0}} animate={inView?{scaleX:1}:{}} transition={{delay:.5,duration:1,ease:[.22,1,.36,1]}}/>
        </motion.div>

        {/* Cards glassmorphism — exatamente como no original */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cards.map((c,i) => (
            <motion.div key={i} initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.35+i*.1,duration:.65,ease:[.22,1,.36,1]}}
              whileHover={{y:-4,transition:{duration:.25}}}
              className="rounded-xl p-6" style={{background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)"}}>
              <div className="text-2xl mb-4">{c.icon}</div>
              <h4 className="font-fraunces font-bold text-[#FDFBF7] text-lg mb-3">{c.title}</h4>
              <p className="font-dm text-[rgba(253,251,247,.65)] text-sm leading-relaxed">{c.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
