"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const grupos = [
  {t:"Grupos Teóricos",d:"Encontros expositivos sobre fundamentos da prática clínica, oferecendo base conceitual e compreensão do nosso modelo de atuação."},
  {t:"Grupos Práticos",d:"Focados no treino de habilidades clínicas e na observação das avaliações de aptidão clínica de outros candidatos."},
];

export default function ConvitePS() {
  const {ref,inView} = useInView({triggerOnce:true,threshold:.12});
  return (
    <section ref={ref} className="py-24 md:py-32" style={{background:"#F5F0E8"}}>
      <div className="max-w-[860px] mx-auto px-6 md:px-10">
        <motion.p initial={{opacity:0,y:10}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:.5}}
          className="font-dm font-semibold text-[11px] tracking-[.26em] text-[#C84B31] uppercase mb-4">Etapa facultativa</motion.p>
        <motion.h2 initial={{opacity:0,y:16}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.08,duration:.7,ease:[.22,1,.36,1]}}
          className="font-fraunces font-bold text-[#1A1A1A] leading-tight mb-6" style={{fontSize:"clamp(26px,3.5vw,44px)"}}>
          Um convite para quem quer <span className="italic text-[#C84B31]">ir além</span>
        </motion.h2>
        <motion.p initial={{opacity:0}} animate={inView?{opacity:1}:{}} transition={{delay:.15,duration:.6}}
          className="font-dm text-[#5C5C5C] leading-relaxed mb-10 text-[15px]">
          Embora não sejam etapa obrigatória, os grupos formativos representam um diferencial para quem deseja compreender mais profundamente a cultura e a proposta da Allos.
        </motion.p>
        <motion.div initial={{opacity:0,y:22}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.22,duration:.7,ease:[.22,1,.36,1]}}
          className="rounded-2xl overflow-hidden" style={{background:"#FDFBF7",border:"1px solid #E5DFD3"}}>
          <div className="p-8 md:p-10">
            <div className="space-y-4 font-dm text-[#5C5C5C] text-[14px] leading-relaxed mb-8">
              <p>Os encontros são <strong className="text-[#1A1A1A]">abertos e gratuitos</strong>, realizados via <strong className="text-[#1A1A1A]">Google Meet</strong>. O cronograma é divulgado no grupo oficial do processo seletivo no WhatsApp.</p>
            </div>
            <motion.a href="https://chat.whatsapp.com/KP2z0vFRaSVBSXRjIyvR3R" target="_blank" rel="noopener noreferrer"
              whileHover={{scale:1.04,boxShadow:"0 6px 22px rgba(37,211,102,.3)"}} whileTap={{scale:.97}}
              className="inline-flex items-center gap-3 font-dm font-semibold text-white rounded-full mb-8 hover:opacity-90 transition-opacity"
              style={{background:"#25D366",padding:"13px 24px",fontSize:"14px"}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/><path d="M11.998 0C5.374 0 0 5.373 0 11.998c0 2.115.553 4.103 1.522 5.83L0 24l6.335-1.498A11.954 11.954 0 0011.998 24C18.623 24 24 18.626 24 11.998 24 5.373 18.623 0 11.998 0zm0 21.818a9.822 9.822 0 01-5.002-1.363l-.36-.214-3.724.98.993-3.628-.234-.375A9.83 9.83 0 012.18 12.001c0-5.42 4.4-9.818 9.82-9.818 5.418 0 9.82 4.399 9.82 9.818 0 5.42-4.4 9.817-9.82 9.817z"/>
              </svg>
              Acessar grupo oficial do WhatsApp
            </motion.a>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {grupos.map((g,i) => (
                <motion.div key={i} initial={{opacity:0,y:10}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.42+i*.08,duration:.5}}
                  whileHover={{y:-2,transition:{duration:.2}}}
                  className="rounded-xl p-5" style={{background:"rgba(200,75,49,.05)",border:"1px solid rgba(200,75,49,.12)"}}>
                  <p className="font-fraunces font-bold text-[#C84B31] text-sm mb-2">{g.t}</p>
                  <p className="font-dm text-[#5C5C5C] text-xs leading-relaxed">{g.d}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
