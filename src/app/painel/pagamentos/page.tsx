'use client'
import { useState, useCallback } from 'react'

// ── Types ──────────────────────────────────────────────────────────
interface PaymentResult {
  link: string
  resumo: {
    valor_total: string
    parcelas: string
    valor_parcela: string
    desconto: string
  }
}

interface Invoice {
  numero: string | null
  valor: number
  data_pagamento: number | null
  data_criacao: number | null
  status: string
  url_pagamento: string | null
  url_pdf: string | null
}

interface Subscription {
  id: string
  nome_cliente: string
  status: string
  tipo: string
  produto: string
  valor_parcela: number
  desconto: string
  parcelas_pagas: number
  parcelas_total: number
  parcelas_atrasadas: number
  criado_em: number
  cancela_em: number | null
  periodo_atual_fim: number | null
  faturas: Invoice[]
}

// ── Helpers ────────────────────────────────────────────────────────
function fmt(centavos: number): string {
  return 'R$ ' + (centavos / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

function dataFmt(ts: number | null): string {
  if (!ts) return '\u2014'
  const d = new Date(ts * 1000)
  return d.toLocaleDateString('pt-BR')
}

const statusLabels: Record<string, string> = {
  active: 'Ativa',
  past_due: 'Atrasada',
  canceled: 'Cancelada',
  trialing: 'Teste',
  unpaid: 'Não paga',
  incomplete: 'Incompleta',
  incomplete_expired: 'Expirada',
}

const faturaStatusLabels: Record<string, string> = {
  paid: 'Paga',
  open: 'Aberta',
  draft: 'Rascunho',
  void: 'Anulada',
  uncollectible: 'Perdida',
}

const tipoLabels: Record<string, string> = {
  neuro: 'Neuro Avaliacao',
  clinica: 'Clinica Escola',
}

function statusBadgeClasses(status: string): string {
  const m: Record<string, string> = {
    active: 'bg-teal-50 text-teal-700',
    past_due: 'bg-orange-50 text-orange-700',
    canceled: 'bg-gray-100 text-gray-500',
    trialing: 'bg-blue-50 text-blue-700',
    unpaid: 'bg-red-50 text-red-700',
    incomplete: 'bg-yellow-50 text-yellow-700',
  }
  return m[status] || 'bg-gray-100 text-gray-500'
}

function faturaStatusClasses(status: string): string {
  const m: Record<string, string> = {
    paid: 'bg-teal-50 text-teal-700',
    open: 'bg-orange-50 text-orange-700',
    draft: 'bg-gray-100 text-gray-500',
    void: 'bg-gray-100 text-gray-400',
    uncollectible: 'bg-red-50 text-red-700',
  }
  return m[status] || 'bg-gray-100 text-gray-500'
}

function statusBorderColor(status: string): string {
  const m: Record<string, string> = {
    active: '#2E9E8F',
    past_due: '#E65100',
    canceled: '#999',
  }
  return m[status] || '#E8E4DF'
}

// ── Component ──────────────────────────────────────────────────────
export default function PagamentosPage() {
  const [tab, setTab] = useState<'gerar' | 'assinaturas'>('gerar')
  const [toastMsg, setToastMsg] = useState('')

  // Gerar link state
  const [nomeCliente, setNomeCliente] = useState('')
  const [valorTotal, setValorTotal] = useState(1000)
  const [parcelas, setParcelas] = useState(1)
  const [desconto, setDesconto] = useState(0)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PaymentResult | null>(null)
  const [erro, setErro] = useState('')

  // Assinaturas state
  const [subs, setSubs] = useState<Subscription[]>([])
  const [subsLoaded, setSubsLoaded] = useState(false)
  const [subsLoading, setSubsLoading] = useState(false)
  const [filtroTipo, setFiltroTipo] = useState('all')
  const [filtroStatus, setFiltroStatus] = useState('all')
  const [openFaturas, setOpenFaturas] = useState<Set<string>>(new Set())

  const toast = useCallback((msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2500)
  }, [])

  // ── Preview calculation ──────────────────────────────────────────
  const finalReais = valorTotal * (1 - desconto / 100)
  const finalCentavos = Math.ceil(finalReais * 100)
  const parcelaCentavos = parcelas === 1 ? finalCentavos : Math.ceil(finalCentavos / parcelas)
  let previewText = `${parcelas}x de ${fmt(parcelaCentavos)} = ${fmt(finalCentavos)}`
  if (desconto > 0) previewText += ` (${desconto}% off)`

  // ── Generate link ────────────────────────────────────────────────
  async function gerarLink() {
    setErro('')
    setResult(null)
    setLoading(true)

    try {
      const resp = await fetch('/api/painel/pagamentos/criar-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome_cliente: nomeCliente.trim(),
          valor_total: valorTotal,
          parcelas,
          desconto_percentual: desconto,
        }),
      })
      const data = await resp.json()
      if (!resp.ok || data.erro) throw new Error(data.erro || 'Erro desconhecido')
      setResult(data)
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  function copiarLink() {
    if (!result) return
    navigator.clipboard.writeText(result.link).then(() => toast('Link copiado!'))
  }

  // ── Load subscriptions ──────────────────────────────────────────
  async function carregarAssinaturas() {
    setSubsLoading(true)
    try {
      const resp = await fetch(`/api/painel/pagamentos/assinaturas?status=${filtroStatus}&tipo=${filtroTipo}`)
      const data = await resp.json()
      if (!resp.ok || data.erro) throw new Error(data.erro || 'Erro desconhecido')
      setSubs(data)
      setSubsLoaded(true)
    } catch (err: unknown) {
      setSubs([])
      toast(err instanceof Error ? err.message : 'Erro ao carregar')
    } finally {
      setSubsLoading(false)
    }
  }

  function toggleFaturas(id: string) {
    setOpenFaturas(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // ── Subscription counts ──────────────────────────────────────────
  const countsTipo: Record<string, number> = {}
  const countsStatus: Record<string, number> = {}
  subs.forEach(s => {
    countsTipo[s.tipo] = (countsTipo[s.tipo] || 0) + 1
    countsStatus[s.status] = (countsStatus[s.status] || 0) + 1
  })
  const statusParts = Object.entries(countsStatus).map(([k, v]) => `${v} ${statusLabels[k] || k}`)
  const tipoParts: string[] = []
  if (countsTipo.clinica) tipoParts.push(`${countsTipo.clinica} Clinica`)
  if (countsTipo.neuro) tipoParts.push(`${countsTipo.neuro} Neuro`)
  const countText = subs.length > 0 ? `${subs.length} total \u2014 ${tipoParts.join(', ')} \u2014 ${statusParts.join(', ')}` : ''

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div className="font-dm min-h-screen" style={{ background: '#FDFBF7' }}>
      <div className="w-full max-w-[960px] mx-auto px-6 py-6">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b-2" style={{ borderColor: '#E8E4DF' }}>
          {[
            { key: 'gerar' as const, label: 'Gerar Link' },
            { key: 'assinaturas' as const, label: 'Assinaturas' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); if (t.key === 'assinaturas' && !subsLoaded) carregarAssinaturas() }}
              className="px-6 py-3 text-sm font-semibold border-b-2 -mb-[2px] transition-colors"
              style={{
                color: tab === t.key ? '#1A7A6D' : '#999',
                borderBottomColor: tab === t.key ? '#1A7A6D' : 'transparent',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ═══ GERAR LINK TAB ═══ */}
        {tab === 'gerar' && (
          <div className="max-w-[480px] mx-auto bg-white border rounded-2xl p-7 shadow-sm" style={{ borderColor: '#E8E4DF' }}>
            <div className="mb-5">
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#555' }}>Nome do cliente (opcional)</label>
              <input
                type="text"
                value={nomeCliente}
                onChange={e => setNomeCliente(e.target.value)}
                placeholder="Ex: Maria Silva"
                className="w-full px-3.5 py-3 text-sm border rounded-xl focus:outline-none"
                style={{ borderColor: '#DDD', background: '#FDFBF7' }}
              />
            </div>
            <div className="mb-5">
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#555' }}>Valor total (R$)</label>
              <input
                type="number"
                value={valorTotal}
                onChange={e => setValorTotal(parseFloat(e.target.value) || 0)}
                min={5}
                max={5000}
                step={10}
                className="w-full px-3.5 py-3 text-sm border rounded-xl focus:outline-none"
                style={{ borderColor: '#DDD', background: '#FDFBF7' }}
              />
            </div>
            <div className="mb-5">
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#555' }}>Parcelas</label>
              <select
                value={parcelas}
                onChange={e => setParcelas(parseInt(e.target.value))}
                className="w-full px-3.5 py-3 text-sm border rounded-xl focus:outline-none"
                style={{ borderColor: '#DDD', background: '#FDFBF7' }}
              >
                <option value={1}>1x (a vista)</option>
                <option value={2}>2x mensais</option>
                <option value={3}>3x mensais</option>
                <option value={4}>4x mensais</option>
                <option value={5}>5x mensais</option>
              </select>
            </div>
            <div className="mb-5">
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#555' }}>Desconto (%)</label>
              <input
                type="number"
                value={desconto}
                onChange={e => setDesconto(parseFloat(e.target.value) || 0)}
                min={0}
                max={30}
                step={1}
                className="w-full px-3.5 py-3 text-sm border rounded-xl focus:outline-none"
                style={{ borderColor: '#DDD', background: '#FDFBF7' }}
              />
            </div>

            {/* Preview */}
            <div className="flex items-center justify-center rounded-xl px-4 py-4 mb-5" style={{ background: '#F0FAF8', border: '1px solid #C8E6E0' }}>
              <span className="text-base font-semibold" style={{ color: '#1A7A6D' }}>{previewText}</span>
            </div>

            {/* Generate button */}
            <button
              onClick={gerarLink}
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: '#1A7A6D' }}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Gerando...
                </span>
              ) : 'Gerar Link'}
            </button>

            {/* Error */}
            {erro && (
              <div className="mt-4 text-center text-sm font-medium text-red-600">{erro}</div>
            )}

            {/* Result */}
            {result && (
              <div className="mt-6">
                <div className="rounded-xl px-4 py-3 text-xs break-all mb-3" style={{ background: '#F0FAF8', border: '1px solid #C8E6E0', color: '#1A7A6D' }}>
                  {result.link}
                </div>
                <button
                  onClick={copiarLink}
                  className="w-full py-3 rounded-xl text-sm font-semibold mb-4 transition-colors"
                  style={{ background: '#E8F5F2', color: '#1A7A6D' }}
                >
                  Copiar Link
                </button>
                <div className="text-sm leading-loose" style={{ color: '#555' }}>
                  <strong style={{ color: '#2D2D2D' }}>Valor total:</strong> {result.resumo.valor_total}<br />
                  <strong style={{ color: '#2D2D2D' }}>Parcelas:</strong> {result.resumo.parcelas}x<br />
                  <strong style={{ color: '#2D2D2D' }}>Valor por parcela:</strong> {result.resumo.valor_parcela}<br />
                  <strong style={{ color: '#2D2D2D' }}>Desconto:</strong> {result.resumo.desconto}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ ASSINATURAS TAB ═══ */}
        {tab === 'assinaturas' && (
          <div>
            {/* Toolbar */}
            <div className="flex gap-3 items-center mb-5 flex-wrap">
              <select
                value={filtroTipo}
                onChange={e => { setFiltroTipo(e.target.value); setTimeout(carregarAssinaturas, 0) }}
                className="px-3.5 py-2 text-sm border rounded-lg focus:outline-none"
                style={{ borderColor: '#DDD', background: '#FDFBF7' }}
              >
                <option value="all">Todos os tipos</option>
                <option value="clinica">Clinica Escola</option>
                <option value="neuro">Neuro Avaliacao</option>
              </select>
              <select
                value={filtroStatus}
                onChange={e => { setFiltroStatus(e.target.value); setTimeout(carregarAssinaturas, 0) }}
                className="px-3.5 py-2 text-sm border rounded-lg focus:outline-none"
                style={{ borderColor: '#DDD', background: '#FDFBF7' }}
              >
                <option value="all">Todos os status</option>
                <option value="active">Ativas</option>
                <option value="past_due">Atrasadas</option>
                <option value="canceled">Canceladas</option>
              </select>
              <button
                onClick={carregarAssinaturas}
                disabled={subsLoading}
                className="px-5 py-2 text-sm font-semibold border rounded-lg bg-white transition-colors hover:bg-teal-50 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ borderColor: '#1A7A6D', color: '#1A7A6D' }}
              >
                {subsLoading ? 'Carregando...' : 'Atualizar'}
              </button>
              {countText && (
                <span className="ml-auto text-xs" style={{ color: '#777' }}>{countText}</span>
              )}
            </div>

            {/* Content */}
            {subsLoading && !subsLoaded ? (
              <div className="text-center py-12 text-sm" style={{ color: '#999' }}>
                <span className="inline-block w-5 h-5 border-2 border-gray-200 border-t-teal-600 rounded-full animate-spin mr-2 align-middle" />
                Carregando assinaturas do Stripe...
              </div>
            ) : subs.length === 0 ? (
              <div className="text-center py-12 text-sm" style={{ color: '#999' }}>Nenhuma assinatura encontrada.</div>
            ) : (
              <div className="flex flex-col gap-4">
                {subs.map(sub => {
                  const isNeuro = sub.tipo === 'neuro'
                  const barClass = sub.parcelas_atrasadas > 0

                  // Progress
                  let pct: number
                  let progressLabel: string
                  let progressRight: string
                  if (isNeuro) {
                    pct = sub.parcelas_total > 0 ? Math.min(100, Math.round((sub.parcelas_pagas / sub.parcelas_total) * 100)) : 0
                    progressLabel = `${sub.parcelas_pagas} de ${sub.parcelas_total} parcelas pagas`
                    progressRight = `${pct}%`
                  } else {
                    pct = 100
                    progressLabel = `${sub.parcelas_pagas} mensalidade${sub.parcelas_pagas !== 1 ? 's' : ''} paga${sub.parcelas_pagas !== 1 ? 's' : ''}`
                    progressRight = 'Recorrente'
                  }

                  const valorLabel = isNeuro ? '/parcela' : '/mes'
                  const metaParts = [`Desde ${dataFmt(sub.criado_em)}`]
                  if (sub.cancela_em) metaParts.push(`Encerra em ${dataFmt(sub.cancela_em)}`)
                  if (!isNeuro) metaParts.push(`Proxima cobranca: ${dataFmt(sub.periodo_atual_fim)}`)

                  return (
                    <div key={sub.id} className="bg-white border rounded-2xl px-6 py-5 shadow-sm" style={{ borderColor: '#E8E4DF', borderLeftWidth: '4px', borderLeftColor: statusBorderColor(sub.status) }}>
                      {/* Header */}
                      <div className="flex justify-between items-start gap-3 mb-3.5 flex-wrap">
                        <div>
                          <div className="text-base font-bold">{sub.nome_cliente}</div>
                          <div className="text-xs mt-0.5" style={{ color: '#888' }}>{metaParts.join(' \u00B7 ')}</div>
                        </div>
                        <div className="flex gap-2 items-center flex-wrap">
                          <span className={`inline-block px-2.5 py-1 rounded-md text-[0.68rem] font-semibold ${sub.tipo === 'neuro' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
                            {tipoLabels[sub.tipo] || sub.produto}
                          </span>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${statusBadgeClasses(sub.status)}`}>
                            {statusLabels[sub.status] || sub.status}
                          </span>
                        </div>
                      </div>

                      {/* Valor */}
                      <div className="text-sm mb-3.5" style={{ color: '#555' }}>
                        <strong style={{ color: '#2D2D2D' }}>{fmt(sub.valor_parcela)}</strong>{valorLabel}
                        {sub.desconto !== '0' && ` \u00B7 ${sub.desconto}% desconto`}
                      </div>

                      {/* Progress bar */}
                      <div className="mb-3.5">
                        <div className="flex justify-between text-xs mb-1.5" style={{ color: '#555' }}>
                          <span>{progressLabel}</span>
                          <span>{progressRight}</span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ background: '#EEEDEB' }}>
                          <div className="h-full rounded-full transition-all duration-300" style={{ width: pct + '%', background: barClass ? '#E65100' : '#2E9E8F' }} />
                        </div>
                      </div>

                      {/* Invoices */}
                      {sub.faturas.length > 0 && (
                        <>
                          <button
                            onClick={() => toggleFaturas(sub.id)}
                            className="text-xs font-semibold hover:underline"
                            style={{ color: '#1A7A6D' }}
                          >
                            {openFaturas.has(sub.id) ? 'Ocultar faturas' : `Ver faturas (${sub.faturas.length})`}
                          </button>

                          {openFaturas.has(sub.id) && (
                            <div className="mt-3">
                              {sub.faturas.map((f, i) => (
                                <div key={i} className="flex items-center gap-3 py-2.5 border-b flex-wrap text-xs" style={{ borderColor: '#F0EFED' }}>
                                  <span className="font-semibold min-w-[90px]">{f.numero || '\u2014'}</span>
                                  <span className="min-w-[80px]" style={{ color: '#555' }}>{fmt(f.valor)}</span>
                                  <span className="min-w-[90px]" style={{ color: '#888' }}>{f.data_pagamento ? dataFmt(f.data_pagamento) : dataFmt(f.data_criacao)}</span>
                                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[0.68rem] font-semibold uppercase ${faturaStatusClasses(f.status)}`}>
                                    {faturaStatusLabels[f.status] || f.status}
                                  </span>
                                  <span className="flex gap-1">
                                    {f.url_pagamento && <a href={f.url_pagamento} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: '#1A7A6D' }}>Link</a>}
                                    {f.url_pdf && <a href={f.url_pdf} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: '#1A7A6D' }}>PDF</a>}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-[999] px-5 py-3 rounded-lg text-sm text-white shadow-lg" style={{ background: '#1a1a2e' }}>
          {toastMsg}
        </div>
      )}
    </div>
  )
}
