"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

export interface FaqItem {
  q: string;
  a: string | React.ReactNode;
}

export interface FaqGroup {
  label: string;
  items: FaqItem[];
}

function AccordionItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.06, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-xl cursor-pointer group"
      style={{
        background: isOpen
          ? "rgba(200,75,49,0.06)"
          : "rgba(253,251,247,0.03)",
        border: isOpen
          ? "1px solid rgba(200,75,49,0.25)"
          : "1px solid rgba(253,251,247,0.06)",
        transition: "background 0.35s ease, border-color 0.35s ease",
      }}
      onClick={onToggle}
    >
      {/* Accent left bar */}
      <motion.div
        className="absolute top-0 left-0 bottom-0 w-[3px] rounded-l-xl"
        style={{ background: "#C84B31" }}
        initial={{ scaleY: 0, originY: 0 }}
        animate={{ scaleY: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Question row */}
      <div className="flex items-center justify-between gap-4 px-7 py-5">
        <span
          className="font-fraunces font-bold leading-snug transition-colors duration-300"
          style={{
            fontSize: "clamp(14px, 1.5vw, 16px)",
            color: isOpen ? "#FDFBF7" : "rgba(253,251,247,0.85)",
          }}
        >
          {item.q}
        </span>

        {/* Icon */}
        <div
          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            background: isOpen ? "#C84B31" : "rgba(253,251,247,0.07)",
            border: isOpen ? "none" : "1px solid rgba(253,251,247,0.1)",
          }}
        >
          <motion.svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <path
              d="M6 1V11M1 6H11"
              stroke={isOpen ? "#FDFBF7" : "rgba(253,251,247,0.7)"}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </motion.svg>
        </div>
      </div>

      {/* Answer */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div
              className="px-7 pb-6 font-dm leading-relaxed"
              style={{
                fontSize: "clamp(13px, 1.4vw, 15px)",
                color: "rgba(253,251,247,0.6)",
                borderTop: "1px solid rgba(253,251,247,0.05)",
                paddingTop: "16px",
              }}
            >
              {item.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function GroupSection({
  group,
  groupIndex,
}: {
  group: FaqGroup;
  groupIndex: number;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <div ref={ref} className="mb-16 last:mb-0">
      {/* Group header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-5 mb-7"
      >
        <div
          className="flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0"
          style={{ background: "rgba(200,75,49,0.12)", border: "1px solid rgba(200,75,49,0.25)" }}
        >
          <span className="font-dm font-bold text-[#C84B31] text-xs">
            {String(groupIndex + 1).padStart(2, "0")}
          </span>
        </div>
        <div className="flex items-center gap-4 flex-1">
          <h2
            className="font-fraunces font-bold text-[#C84B31]"
            style={{ fontSize: "clamp(17px, 2vw, 21px)" }}
          >
            {group.label}
          </h2>
          <div className="flex-1 h-px" style={{ background: "rgba(200,75,49,0.15)" }} />
          <span
            className="font-dm text-[rgba(253,251,247,0.3)] text-xs tracking-widest uppercase"
          >
            {group.items.length} {group.items.length === 1 ? "pergunta" : "perguntas"}
          </span>
        </div>
      </motion.div>

      {/* Items */}
      <div className="space-y-3">
        {group.items.map((item, i) => (
          <AccordionItem
            key={i}
            item={item}
            index={i}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
    </div>
  );
}

export default function FaqAccordion({ groups }: { groups: FaqGroup[] }) {
  return (
    <div className="space-y-0">
      {groups.map((group, i) => (
        <GroupSection key={group.label} group={group} groupIndex={i} />
      ))}
    </div>
  );
}
