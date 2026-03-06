"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef, useState } from "react";

function CountUp({to,suffix=""}:{to:number;suffix?:string}) {
  const [v,setV] = useState(0);
  const {ref,inView} = useInView({triggerOnce:true});
  const started = useRef(false);
  useEffect(() => {
    if(!inView||started.current) return;
    started.current=true;
    const dur=1600,start=Date.now();
    const tick=()=>{const p=Math.min((Date.now()-start)/dur,1);const e=1-Math.pow(1-p,3);setV(Math.round(e*to));if(p<1)requestAnimationFrame(tick);};
    requestAnimationFrame(tick);
  },[inView,to]);
  return <span ref={ref}>{v}{suffix}</span>;
}

export default function AvaliAllosSection() {
  const {ref,inView} = useInView({triggerOnce:true,threshold:.15});
  return (
    <section ref={ref} className="py-24 md:py-32 relative overflow-hidden" style={{background:"#1A1A1A"}}>
      <div className="absolute inset-0 pointer-events-none opacity-[.025]"
        style={{backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"}}/>
      <div className="absolute top-0 left-0 w-[400px] h-[300px] pointer-events-none"
        style={{background:"radial-gradient(ellipse at top left,rgba(200,75,49,.1) 0%,transparent 60%)"}}/>
      <div className="relative z-10 max-w-[1100px] mx-auto px-6 md:px-10">
        <div className="text-center mb-16">
          <motion.div initial={{opacity:0,y:10}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:.5}}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)"}}>
            <span className="text-[#C84B31] text-xs">◆</span>
            <span className="font-dm text-[11px] tracking-[.24em] text-[rgba(253,251,247,.6)] uppercase">Processo de entrada</span>
          </motion.div>
          <motion.div initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.1,duration:.75,ease:[.22,1,.36,1]}}>
            <h2 style={{fontSize:"clamp(56px,10vw,100px)",lineHeight:1,letterSpacing:"-.02em"}}>
              <span className="font-fraunces font-bold text-[#FDFBF7]">Avali</span>
              <span className="font-fraunces italic font-light text-[#C84B31]">Allos</span>
            </h2>
          </motion.div>
          <motion.p initial={{opacity:0,y:12}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.2,duration:.6}}
            className="font-dm text-[rgba(253,251,247,.55)] mt-6 max-w-[480px] mx-auto leading-relaxed" style={{fontSize:"clamp(15px,1.7vw,17px)"}}>
            Avaliação de Aptidão Clínica — onde transformamos talento em legado através de feedback, prática e crescimento contínuo.
          </motion.p>
        </div>
        <motion.div initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.25,duration:.7}}
          className="relative mb-12 pb-10" style={{borderBottom:"1px solid rgba(255,255,255,.08)"}}>
          <div className="flex justify-between items-end">
            {[
              {v:"-100",l:"Limite inferior",c:"text-[#EF4444]"},
              {v:"-9",l:"Erro fatal",c:"text-[#EF4444]"},
              {v:"0",l:"Mediano",c:"text-[#FBBF24]"},
              {v:"+25",l:"Nota de corte",c:"text-[#C84B31]"},
              {v:"+100",l:"Limite superior",c:"text-[#10B981]"},
            ].map((p,i) => (
              <motion.div key={i} initial={{opacity:0,y:10}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.3+i*.06,duration:.5}}
                className="text-center flex-1">
                <div className={`font-fraunces font-bold text-2xl md:text-3xl mb-2 ${p.c}`}>{p.v}</div>
                <div className="font-dm text-[rgba(253,251,247,.45)] text-xs hidden sm:block leading-snug">{p.l}</div>
              </motion.div>
            ))}
          </div>
          <motion.div className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full origin-left"
            style={{background:"linear-gradient(to right,#EF4444,#FBBF24 50%,#10B981)"}}
            initial={{scaleX:0}} animate={inView?{scaleX:1}:{}} transition={{delay:.55,duration:1,ease:[.22,1,.36,1]}}/>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {[
            {i:"📊",t:"Escala por Competência",b:"Cada uma das 12 competências é avaliada de -9 (erro fatal) a +9 (excepcional). A soma gera sua nota total."},
            {i:"🎯",t:"Nota de Corte",b:"A nota +25 é o mínimo para aprovação. Isso representa desempenho consistentemente acima da média em todas as dimensões."},
            {i:"💡",t:"Além da Técnica",b:"Os valores, a ambição e a vontade de aprimorar-se também influenciam significativamente a avaliação final."},
          ].map((c,i) => (
            <motion.div key={i} initial={{opacity:0,y:22}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.4+i*.1,duration:.65}}
              whileHover={{y:-4,transition:{duration:.25}}}
              className="rounded-xl p-6" style={{background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)"}}>
              <div className="text-2xl mb-4">{c.i}</div>
              <h4 className="font-fraunces font-bold text-[#FDFBF7] text-lg mb-3">{c.t}</h4>
              <p className="font-dm text-[rgba(253,251,247,.6)] text-sm leading-relaxed">{c.b}</p>
            </motion.div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[{v:5,s:"%",l:"Taxa de aprovação na 1ª tentativa"},{v:12,s:"",l:"Competências avaliadas"},{v:25,s:"",p:"+",l:"Nota de corte para aprovação"}].map((s,i) => (
            <motion.div key={i} initial={{opacity:0,y:16}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.6+i*.1,duration:.6}}
              className="rounded-xl p-6 text-center" style={{background:"rgba(200,75,49,.08)",border:"1px solid rgba(200,75,49,.2)"}}>
              <div className="font-fraunces font-bold text-[#C84B31] mb-2" style={{fontSize:"clamp(40px,6vw,56px)",lineHeight:1}}>
                {s.p||""}<CountUp to={s.v} suffix={s.s}/>
              </div>
              <p className="font-dm text-[rgba(253,251,247,.55)] text-sm leading-snug">{s.l}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
