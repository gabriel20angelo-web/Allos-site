"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const ringRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      ringRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    // Anel com lag via lerp
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    let currentRing = { x: -100, y: -100 };

    const animateRing = () => {
      currentRing.x = lerp(currentRing.x, ringRef.current.x, 0.12);
      currentRing.y = lerp(currentRing.y, ringRef.current.y, 0.12);
      setRingPos({ x: currentRing.x, y: currentRing.y });
      rafRef.current = requestAnimationFrame(animateRing);
    };
    rafRef.current = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {/* Ponto central — segue mouse exato */}
      <motion.div
        className="fixed top-0 left-0 z-[99999] pointer-events-none mix-blend-difference"
        style={{
          x: mousePos.x - 4,
          y: mousePos.y - 4,
        }}
      >
        <div
          style={{
            width: isHovering ? "10px" : "6px",
            height: isHovering ? "10px" : "6px",
            background: "#2dd4b8",
            borderRadius: "50%",
            transition: "width 0.2s, height 0.2s",
            marginLeft: isHovering ? "-2px" : "0",
            marginTop: isHovering ? "-2px" : "0",
          }}
        />
      </motion.div>

      {/* Anel com lag */}
      <div
        className="fixed top-0 left-0 z-[99998] pointer-events-none"
        style={{
          transform: `translate(${ringPos.x - (isHovering ? 24 : 16)}px, ${ringPos.y - (isHovering ? 24 : 16)}px)`,
          width: isHovering ? "48px" : "32px",
          height: isHovering ? "48px" : "32px",
          border: "1px solid rgba(45, 212, 184, 0.5)",
          borderRadius: "50%",
          transition: "width 0.3s, height 0.3s, opacity 0.3s",
          opacity: isHovering ? 0.8 : 0.4,
        }}
      />
    </>
  );
}
