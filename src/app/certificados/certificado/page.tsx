'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

interface Cert {
  id: string
  nome_participante: string
  atividade_nome: string
  data_participacao: string
  carga_horaria: string
  codigo_verificacao: string
  criado_em: string
}

function CertificadoContent() {
  const params = useSearchParams()
  const [cert, setCert] = useState<Cert | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const certRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const id = params.get('id')
    if (!id) { setError('ID não informado'); setLoading(false); return }

    fetch(`/api/certificados/certificado?id=${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError(data.error); setLoading(false); return }
        setCert(data)
        setLoading(false)
      })
      .catch(() => { setError('Erro ao carregar certificado'); setLoading(false) })
  }, [params])

  const handlePrint = () => window.print()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#1A1A1A' }}>
        <div className="w-8 h-8 border-2 border-[#C84B31] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !cert) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#1A1A1A' }}>
        <div className="text-center">
          <p className="font-dm text-lg mb-2" style={{ color: '#C84B31' }}>{error || 'Certificado não encontrado'}</p>
          <a href="/certificados" className="font-dm text-sm underline" style={{ color: 'rgba(253,251,247,0.5)' }}>Voltar ao formulário</a>
        </div>
      </div>
    )
  }

  const dataFormatada = new Date(cert.data_participacao + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric'
  })

  return (
    <div className="min-h-screen" style={{ background: '#1A1A1A' }}>
      {/* Print button (hidden in print) */}
      <div className="print:hidden flex justify-center gap-4 py-6 px-4">
        <button
          onClick={handlePrint}
          className="font-dm text-sm font-bold text-white px-6 py-3 rounded-xl inline-flex items-center gap-2"
          style={{ backgroundColor: '#C84B31', boxShadow: '0 4px 20px rgba(200,75,49,0.3)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          Imprimir / Salvar PDF
        </button>
        <a href="/certificados" className="font-dm text-sm px-6 py-3 rounded-xl"
          style={{ color: 'rgba(253,251,247,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
          Voltar
        </a>
      </div>

      {/* Certificate */}
      <div className="flex justify-center px-4 pb-10">
        <div
          ref={certRef}
          className="w-full max-w-[800px] relative overflow-hidden"
          style={{
            aspectRatio: '1.414',
            background: 'linear-gradient(145deg, #1A1A1A 0%, #111111 50%, #1A1714 100%)',
            border: '2px solid rgba(200,75,49,0.2)',
            borderRadius: '16px',
            padding: 'clamp(24px, 5vw, 60px)',
          }}
        >
          {/* Corner decorations */}
          <div className="absolute top-6 left-6 w-16 h-16 pointer-events-none" style={{ borderTop: '2px solid rgba(200,75,49,0.3)', borderLeft: '2px solid rgba(200,75,49,0.3)' }} />
          <div className="absolute top-6 right-6 w-16 h-16 pointer-events-none" style={{ borderTop: '2px solid rgba(200,75,49,0.3)', borderRight: '2px solid rgba(200,75,49,0.3)' }} />
          <div className="absolute bottom-6 left-6 w-16 h-16 pointer-events-none" style={{ borderBottom: '2px solid rgba(200,75,49,0.3)', borderLeft: '2px solid rgba(200,75,49,0.3)' }} />
          <div className="absolute bottom-6 right-6 w-16 h-16 pointer-events-none" style={{ borderBottom: '2px solid rgba(200,75,49,0.3)', borderRight: '2px solid rgba(200,75,49,0.3)' }} />

          {/* Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[40%] pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(200,75,49,0.08) 0%, transparent 70%)' }} />

          {/* Dot pattern */}
          <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(rgba(253,251,247,0.5) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

          <div className="relative z-10 h-full flex flex-col items-center justify-between text-center">
            {/* Header */}
            <div>
              <div className="flex items-center justify-center gap-3 mb-3">
                <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
                  <circle cx="18" cy="18" r="16" stroke="#C84B31" strokeWidth="1" strokeDasharray="4 2.5" opacity=".6" />
                  <circle cx="18" cy="18" r="8.5" stroke="#C84B31" strokeWidth="1.2" />
                  <circle cx="18" cy="18" r="2.5" fill="#C84B31" />
                </svg>
                <span className="font-fraunces font-bold text-xl tracking-wide" style={{ color: 'rgba(253,251,247,0.95)' }}>Allos</span>
              </div>
              <p className="font-dm text-[10px] tracking-[.3em] uppercase" style={{ color: 'rgba(253,251,247,0.3)' }}>
                Associação Livre de Orientação em Saúde
              </p>
            </div>

            {/* Body */}
            <div className="py-6">
              <p className="font-dm text-[11px] tracking-[.25em] uppercase mb-6" style={{ color: '#C84B31' }}>
                Certificado de Participação
              </p>

              <p className="font-dm text-sm mb-2" style={{ color: 'rgba(253,251,247,0.45)' }}>
                Certificamos que
              </p>

              <h2 className="font-fraunces font-bold italic mb-6" style={{ fontSize: 'clamp(24px, 4vw, 40px)', color: 'rgba(253,251,247,0.95)' }}>
                {cert.nome_participante}
              </h2>

              <div className="h-px w-24 mx-auto mb-6" style={{ background: 'rgba(200,75,49,0.3)' }} />

              <p className="font-dm text-sm leading-relaxed max-w-md mx-auto" style={{ color: 'rgba(253,251,247,0.5)' }}>
                participou da atividade <strong style={{ color: '#C84B31' }}>{cert.atividade_nome}</strong> da
                Formação Base Alos, realizada em <strong style={{ color: 'rgba(253,251,247,0.7)' }}>{dataFormatada}</strong>,
                com carga horária de <strong style={{ color: 'rgba(253,251,247,0.7)' }}>{cert.carga_horaria}</strong>.
              </p>
            </div>

            {/* Footer */}
            <div className="w-full">
              <div className="h-px mb-4" style={{ background: 'rgba(253,251,247,0.06)' }} />
              <div className="flex justify-between items-end">
                <p className="font-dm text-[10px]" style={{ color: 'rgba(253,251,247,0.2)' }}>
                  Código: {cert.codigo_verificacao}
                </p>
                <p className="font-dm text-[10px]" style={{ color: 'rgba(253,251,247,0.2)' }}>
                  Belo Horizonte — MG
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          @page { size: landscape; margin: 0; }
        }
      `}</style>
    </div>
  )
}

export default function CertificadoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#1A1A1A' }}>
        <div className="w-8 h-8 border-2 border-[#C84B31] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CertificadoContent />
    </Suspense>
  )
}
