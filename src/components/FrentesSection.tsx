"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";

const cards = [
  { label:"INSTITUCIONAL", title:"O que é a Associação Allos",
    desc:"Uma organização dedicada à excelência clínica, formação profissional e cooperação institucional com impacto social.",
    btns:[{t:"Saiba mais",solid:true,href:"#"},{t:"Documentos",solid:false,href:"#"}] },
  { label:"SERVIÇOS", title:"Serviços para sua instituição",
    desc:"Soluções estruturadas em saúde mental e desenvolvimento clínico para organizações, redes públicas e parceiros estratégicos.",
    btns:[{t:"Ver serviços",solid:true,href:"#"}] },
  { label:"FORMAÇÃO", title:"Formação contínua Allos",
    desc:"Desenvolvimento clínico de alto nível com supervisão qualificada, conteúdos contínuos e comunidade profissional.",
    btns:[{t:"Conhecer a formação",solid:true,href:"/formacao"},{t:"WhatsApp Allos",solid:false,href:"https://chat.whatsapp.com/JpZtYWJovU03VlrZJ5oUxQ"}] },
  { label:"FAÇA PARTE", title:"Construa esse legado com a Allos",
    desc:"Faça parte de uma rede clínica comprometida com excelência, formação contínua e impacto social duradouro.",
    btns:[{t:"Quero me associar",solid:true,href:"/processo-seletivo"}] },
];

function Card({c,delay}:{c:typeof cards[0];delay:number}) {
  const {ref,inView} = useInView({triggerOnce:true,threshold:.12});
  return (
    <motion.div ref={ref} initial={{opacity:0,y:32}} animate={inView?{opacity:1,y:0}:{}}
      transition={{delay,duration:.65,ease:[.22,1,.36,1]}}
      whileHover={{y:-4,transition:{duration:.25,ease:"easeOut"}}}
      className="group relative flex flex-col rounded-2xl overflow-hidden cursor-default"
      style={{background:"#FDFBF7",border:"1px solid #E5DFD3",minHeight:"280px"}}>
      {/* Accent line top animada no hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
        style={{background:"linear-gradient(to right,#C84B31,rgba(200,75,49,0))"}}/>
      <div className="p-10 md:p-12 flex flex-col h-full relative z-10">
        <p className="font-dm font-semibold text-[11px] tracking-[.24em] text-[#C84B31] uppercase mb-4">{c.label}</p>
        <h3 className="font-fraunces font-bold text-[#1A1A1A] leading-snug mb-4" style={{fontSize:"clamp(19px,2.3vw,26px)"}}>{c.title}</h3>
        <p className="font-dm text-[#5C5C5C] text-[15px] leading-relaxed flex-1">{c.desc}</p>
        <div className="flex flex-wrap gap-3 mt-8">
          {c.btns.map(b => b.solid ? (
            <motion.div key={b.t} whileHover={{scale:1.03,boxShadow:"0 4px 18px rgba(200,75,49,.25)"}} whileTap={{scale:.97}}>
              <Link href={b.href} className="inline-flex font-dm font-semibold text-[13px] text-white bg-[#C84B31] px-5 py-2.5 rounded-full hover:bg-[#A33D27] transition-colors">{b.t}</Link>
            </motion.div>
          ) : (
            <motion.div key={b.t} whileHover={{scale:1.03}} whileTap={{scale:.97}}>
              <Link href={b.href} className="inline-flex font-dm font-medium text-[13px] text-[#C84B31] border border-[#C84B31] px-5 py-2.5 rounded-full hover:bg-[rgba(200,75,49,.05)] transition-all">{b.t}</Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function FrentesSection() {
  const {ref,inView} = useInView({triggerOnce:true,threshold:.2});
  return (
    <section id="frentes" className="py-24 md:py-32 px-6 md:px-10" style={{background:"#F5F0E8"}}>
      <div className="max-w-[1200px] mx-auto">
        <div ref={ref} className="mb-14 text-center">
          <motion.p initial={{opacity:0,y:10}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:.5}}
            className="font-dm font-semibold text-[11px] tracking-[.26em] text-[#C84B31] uppercase mb-4">
            Nossas Frentes
          </motion.p>
          <motion.h2 initial={{opacity:0,y:16}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.1,duration:.65,ease:[.22,1,.36,1]}}
            className="font-fraunces font-bold text-[#1A1A1A]" style={{fontSize:"clamp(28px,4vw,48px)"}}>
            Uma organização,{" "}<span className="italic text-[#C84B31]">múltiplos impactos</span>
          </motion.h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cards.map((c,i) => <Card key={c.label} c={c} delay={i<2?0:.1}/>)}
        </div>
      </div>
    </section>
  );
}
