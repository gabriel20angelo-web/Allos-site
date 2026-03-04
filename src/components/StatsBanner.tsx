"use client";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

function CountUp({to,suffix="",prefix=""}:{to:number;suffix?:string;prefix?:string}) {
  const [v,setV] = useState(0);
  const {ref,inView} = useInView({triggerOnce:true});
  const started = useRef(false);
  useEffect(() => {
    if(!inView||started.current) return;
    started.current=true;
    const dur=1600,start=Date.now();
    const tick=()=>{
      const p=Math.min((Date.now()-start)/dur,1);
      const e=1-Math.pow(1-p,3);
      setV(Math.round(e*to));
      if(p<1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  },[inView,to]);
  return <span ref={ref}>{prefix}{v}{suffix}</span>;
}

const stats = [
  {v:201,s:"",l:"Avaliações realizadas"},
  {v:24,s:"",l:"Avaliadores na banca"},
  {v:91,s:"%",p:"9.",l:"Taxa de aprovação eventual"},
];

export default function StatsBanner() {
  const {ref,inView} = useInView({triggerOnce:true,threshold:.2});
  return (
    <section ref={ref} className="py-20 md:py-28 px-6 md:px-10 relative overflow-hidden text-center"
      style={{background:"linear-gradient(135deg,#C84B31 0%,#A33D27 100%)"}}>
      {/* Decorativos */}
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-[.08]" style={{border:"1px solid white"}}/>
      <div className="absolute -bottom-12 -left-12 w-56 h-56 rounded-full opacity-[.06]" style={{border:"1px solid white"}}/>

      <div className="relative z-10 max-w-[1000px] mx-auto">
        <motion.h2 initial={{opacity:0,y:18}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:.7,ease:[.22,1,.36,1]}}
          className="font-fraunces font-light text-white italic mb-12" style={{fontSize:"clamp(19px,3vw,30px)"}}>
          Os números mostram nosso rigor —{" "}
          <span className="font-bold not-italic">e nosso compromisso com a excelência</span>
        </motion.h2>
        <div className="flex flex-wrap justify-center gap-12 md:gap-20">
          {stats.map((s,i) => (
            <motion.div key={i} initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.15+i*.1,duration:.6}}
              className="text-center">
              <span className="block font-fraunces font-bold text-white" style={{fontSize:"clamp(52px,7vw,72px)",lineHeight:1}}>
                {i===2 ? <><span className="text-white/80 font-light">9.</span><CountUp to={91} suffix="%"/></> : <CountUp to={s.v} suffix={s.s} prefix={s.p||""}/>}
              </span>
              <span className="block font-dm text-white/80 text-sm mt-2.5 uppercase tracking-wider">{s.l}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
