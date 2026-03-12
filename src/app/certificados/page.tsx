import type { Metadata } from 'next'
import CertificadoForm from '@/components/certificados/CertificadoForm'

export const metadata: Metadata = {
  title: 'Certificado de Participação — Alos',
  description: 'Solicite seu certificado de participação nos grupos da Formação Base Alos.',
}

export default function CertificadosPage() {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(145deg, #1A1A1A 0%, #111111 40%, #1A1714 100%)' }}>
      {/* Grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[.03]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

      {/* Orange glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top left, rgba(200,75,49,0.08) 0%, transparent 65%)' }} />
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at bottom right, rgba(200,75,49,0.05) 0%, transparent 60%)' }} />

      {/* Dot pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(rgba(253,251,247,0.4) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      {/* Header */}
      <div className="relative z-10 pt-12 pb-6 px-6 md:px-10">
        <div className="max-w-2xl mx-auto">
          <a href="/" className="inline-flex items-center gap-2 font-dm text-sm mb-10 transition-colors" style={{ color: 'rgba(253,251,247,0.4)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Voltar ao site
          </a>

          {/* Decorative SVG */}
          <div className="hidden lg:block absolute right-10 top-16 pointer-events-none opacity-[0.06]">
            <svg width="180" height="180" viewBox="0 0 240 240" fill="none">
              <circle cx="120" cy="120" r="116" stroke="#C84B31" strokeWidth="0.8" strokeDasharray="8 5" />
              <circle cx="120" cy="120" r="80" stroke="#C84B31" strokeWidth="0.7" strokeDasharray="4 6" />
              <circle cx="120" cy="120" r="45" stroke="#C84B31" strokeWidth="0.8" />
              <circle cx="120" cy="120" r="13" stroke="#C84B31" strokeWidth="0.8" />
              <circle cx="120" cy="120" r="3" fill="#C84B31" />
            </svg>
          </div>

          <div className="mb-2">
            <span className="font-dm text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full inline-block"
              style={{ backgroundColor: 'rgba(200,75,49,0.1)', color: '#C84B31', border: '1px solid rgba(200,75,49,0.2)' }}>
              Formação Base
            </span>
          </div>
          <h1 className="font-fraunces font-bold leading-tight mb-3"
            style={{ fontSize: 'clamp(32px, 5vw, 48px)', color: 'rgba(253,251,247,0.95)' }}>
            Certificado de{' '}
            <span className="italic text-[#C84B31]">Participação</span>
          </h1>
          <p className="font-dm text-sm leading-relaxed max-w-md"
            style={{ color: 'rgba(253,251,247,0.4)' }}>
            Preencha o formulário abaixo para registrar sua participação e receber seu certificado.
          </p>
          <div className="h-px mt-8" style={{ background: 'rgba(253,251,247,0.06)' }} />
        </div>
      </div>

      {/* Form */}
      <div className="relative z-10 px-6 md:px-10 pb-20 pt-6">
        <CertificadoForm />
      </div>
    </div>
  )
}
