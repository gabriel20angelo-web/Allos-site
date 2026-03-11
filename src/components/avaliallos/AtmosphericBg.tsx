'use client'

import { useEffect, useRef } from 'react'

export default function AtmosphericBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    // Stars
    const stars: { x: number; y: number; r: number; speed: number; phase: number; color: string }[] = []
    const colors = ['rgba(14,165,160,0.6)', 'rgba(253,251,247,0.5)', 'rgba(253,251,247,0.3)', 'rgba(200,75,49,0.3)', 'rgba(139,92,246,0.3)']
    for (let i = 0; i < 80; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.3,
        speed: Math.random() * 0.5 + 0.2,
        phase: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    let frame = 0
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      frame++
      stars.forEach(s => {
        const opacity = 0.3 + 0.7 * Math.sin(frame * 0.01 * s.speed + s.phase) ** 2
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = s.color.replace(/[\d.]+\)$/, `${opacity})`)
        ctx.fill()

        // Subtle glow on brighter stars
        if (s.r > 1.2 && opacity > 0.6) {
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2)
          ctx.fillStyle = s.color.replace(/[\d.]+\)$/, `${opacity * 0.1})`)
          ctx.fill()
        }
      })
      requestAnimationFrame(animate)
    }
    animate()

    return () => window.removeEventListener('resize', resize)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Base gradient - deep navy blue, NOT black */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #0D1219 0%, #0F1318 30%, #111420 50%, #0E1016 70%, #0C1018 100%)' }} />

      {/* Color blobs */}
      <div className="absolute" style={{ top: '-8%', left: '20%', width: '60%', height: '45%', background: 'radial-gradient(ellipse, rgba(14,165,160,0.09) 0%, transparent 60%)', filter: 'blur(80px)' }} />
      <div className="absolute" style={{ bottom: '-5%', right: '-3%', width: '45%', height: '40%', background: 'radial-gradient(ellipse, rgba(200,75,49,0.07) 0%, transparent 55%)', filter: 'blur(70px)' }} />
      <div className="absolute" style={{ top: '35%', left: '-8%', width: '35%', height: '35%', background: 'radial-gradient(ellipse, rgba(139,92,246,0.06) 0%, transparent 55%)', filter: 'blur(60px)' }} />
      <div className="absolute" style={{ top: '60%', right: '10%', width: '25%', height: '25%', background: 'radial-gradient(ellipse, rgba(27,186,176,0.05) 0%, transparent 55%)', filter: 'blur(50px)' }} />

      {/* Grain texture */}
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")` }} />

      {/* Star canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Subtle dot grid */}
      <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'radial-gradient(rgba(253,251,247,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
    </div>
  )
}
