'use client'

import { useEffect } from 'react'

export default function AdminFormacaoPage() {
  const formacaoUrl = process.env.NEXT_PUBLIC_FORMACAO_URL || 'https://formacao.allos.org.br'

  useEffect(() => {
    window.location.href = `${formacaoUrl}/formacao/admin/calendario`
  }, [formacaoUrl])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#111111' }}>
      <div className="text-center">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-4" style={{ borderColor: 'rgba(253,251,247,0.1)', borderTopColor: 'transparent' }} />
        <p className="font-dm text-sm" style={{ color: 'rgba(253,251,247,0.4)' }}>Redirecionando para o painel de formação...</p>
      </div>
    </div>
  )
}
