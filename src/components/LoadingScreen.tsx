"use client";
import { motion, AnimatePresence } from "framer-motion";
export default function LoadingScreen({ isLoading }: { isLoading: boolean }) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div key="l" initial={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:.7 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center" style={{ background:"#FDFBF7" }}>
          <motion.div initial={{ opacity:0,scale:.85 }} animate={{ opacity:1,scale:1 }} transition={{ duration:.6 }}
            className="flex flex-col items-center gap-5">
            <motion.svg width="54" height="54" viewBox="0 0 54 54" fill="none"
              animate={{ rotate:360 }} transition={{ duration:10,repeat:Infinity,ease:"linear" }}>
              <circle cx="27" cy="27" r="24" stroke="#C84B31" strokeWidth="1" strokeDasharray="6 3" opacity=".4"/>
              <circle cx="27" cy="27" r="14" stroke="#C84B31" strokeWidth="1.2"/>
              <circle cx="27" cy="27" r="3.5" fill="#C84B31"/>
            </motion.svg>
            <div className="text-center">
              <p className="font-fraunces font-bold text-2xl text-[#1A1A1A]">Allos</p>
              <p className="font-dm text-[10px] tracking-[.3em] text-[#5C5C5C] uppercase mt-1">Associação</p>
            </div>
          </motion.div>
          <div className="absolute bottom-10 w-28 h-[1px] bg-[#E5DFD3] overflow-hidden">
            <motion.div className="h-full bg-[#C84B31]" initial={{ width:"0%" }} animate={{ width:"100%" }} transition={{ duration:1.4,ease:"easeInOut" }}/>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
