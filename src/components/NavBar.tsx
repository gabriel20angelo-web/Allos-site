"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <motion.nav initial={{ opacity:0,y:-20 }} animate={{ opacity:1,y:0 }} transition={{ delay:.2,duration:.6 }}
      className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500"
      style={{
        background: scrolled ? "rgba(253,251,247,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid #E5DFD3" : "1px solid transparent",
      }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 h-[68px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <svg width="30" height="30" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="16" stroke="#C84B31" strokeWidth="1" strokeDasharray="4 2.5" opacity=".5"/>
            <circle cx="18" cy="18" r="8.5" stroke="#C84B31" strokeWidth="1.2"/>
            <circle cx="18" cy="18" r="2.5" fill="#C84B31"/>
          </svg>
          <div>
            <span className="font-fraunces font-bold text-[17px] text-[#1A1A1A] tracking-wide">Allos</span>
            <span className="block font-dm text-[9px] tracking-[.28em] text-[#5C5C5C] uppercase -mt-0.5">Associação</span>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {["Sobre","Formação","Projetos"].map(l => (
            <a key={l} href="#" className="font-dm text-sm text-[#5C5C5C] hover:text-[#1A1A1A] transition-colors duration-200">{l}</a>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <a href="#" className="font-dm text-sm font-medium text-[#C84B31] border border-[#C84B31] px-5 py-2 rounded-full hover:bg-[rgba(200,75,49,.05)] transition-all">
            Parcerias
          </a>
          <motion.a href="#" whileHover={{ scale:1.03,boxShadow:"0 4px 20px rgba(200,75,49,.28)" }} whileTap={{ scale:.97 }}
            className="font-dm text-sm font-semibold text-white bg-[#C84B31] px-5 py-2 rounded-full hover:bg-[#A33D27] transition-colors">
            Agendar sessão
          </motion.a>
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden flex flex-col gap-[5px] p-2" aria-label="Menu">
          <span className={`block w-6 h-[1.5px] bg-[#1A1A1A] transition-all duration-300 ${open?"rotate-45 translate-y-[6.5px]":""}`}/>
          <span className={`block w-6 h-[1.5px] bg-[#1A1A1A] transition-all duration-300 ${open?"opacity-0":""}`}/>
          <span className={`block w-6 h-[1.5px] bg-[#1A1A1A] transition-all duration-300 ${open?"-rotate-45 -translate-y-[6.5px]":""}`}/>
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity:0,x:"100%" }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:"100%" }}
            transition={{ duration:.3,ease:"easeOut" }}
            className="fixed top-0 right-0 bottom-0 w-[72vw] max-w-[300px] z-[99]"
            style={{ background:"#FDFBF7",borderLeft:"1px solid #E5DFD3" }}>
            <div className="flex flex-col gap-6 p-10 pt-24">
              {["Sobre","Formação","Projetos","Parcerias"].map(l => (
                <a key={l} href="#" onClick={() => setOpen(false)}
                  className="font-fraunces font-bold text-xl text-[#1A1A1A] hover:text-[#C84B31] transition-colors">{l}</a>
              ))}
              <a href="#" className="mt-4 font-dm text-sm font-semibold text-white bg-[#C84B31] px-6 py-3 rounded-full text-center">Agendar sessão</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
