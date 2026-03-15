'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// ============================================================
// Types
// ============================================================
interface Lead {
  id: number
  name: string
  phone: string | null
  campaign_id: number | null
  flow: string
  stage: string
  notes: string | null
  created_at: string
  updated_at: string
}

interface Campaign {
  id: number
  name: string
  channel: string
  active: boolean | number
}

interface Template {
  id: number
  flow: string
  stage: string
  template_key: string
  title: string
  body: string
  is_objection: boolean | number
}

// ============================================================
// Constants
// ============================================================
const KANBAN_STAGES = ['novo', 'em_conversa', 'proposta_enviada', 'pagamento_enviado'] as const
const ALL_STAGES = ['novo', 'em_conversa', 'proposta_enviada', 'pagamento_enviado', 'fechado', 'perdido'] as const

const STAGE_LABELS: Record<string, string> = {
  novo: 'Novo',
  em_conversa: 'Em conversa',
  proposta_enviada: 'Proposta enviada',
  pagamento_enviado: 'Pagamento enviado',
  fechado: 'Fechado',
  perdido: 'Perdido',
}

const STAGE_MAP: Record<string, Record<string, string[]>> = {
  terapia: {
    novo: ['abertura'],
    em_conversa: ['planos', 'coleta'],
    proposta_enviada: ['oferta'],
    pagamento_enviado: ['pagamento'],
    fechado: ['finalizacao'],
  },
  avaliacao_neuro: {
    novo: ['abertura'],
    em_conversa: ['triagem', 'apresentacao'],
    proposta_enviada: ['proposta'],
    pagamento_enviado: ['proposta'],
    fechado: ['agendamento'],
  },
}

const STAGE_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  novo: { text: '#1565C0', bg: '#E3F2FD', border: '#1565C0' },
  em_conversa: { text: '#1A7A6D', bg: '#F0FAF8', border: '#1A7A6D' },
  proposta_enviada: { text: '#E65100', bg: '#FFF3E0', border: '#E65100' },
  pagamento_enviado: { text: '#5E35B1', bg: '#EDE7F6', border: '#5E35B1' },
}

// ============================================================
// Helpers
// ============================================================
function tempoAtras(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const mins = Math.floor((Date.now() - d.getTime()) / 60000)
  if (mins < 1) return 'agora'
  if (mins < 60) return mins + 'min'
  const hours = Math.floor(mins / 60)
  if (hours < 24) return hours + 'h'
  const days = Math.floor(hours / 24)
  if (days < 30) return days + 'd'
  return Math.floor(days / 30) + 'mes'
}

// ============================================================
// Component
// ============================================================
export default function WorkspacePage() {
  // State
  const [leads, setLeads] = useState<Lead[]>([])
  const [campanhas, setCampanhas] = useState<Campaign[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null)
  const [finalizadosOpen, setFinalizadosOpen] = useState(false)
  const [vendedorName, setVendedorName] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [draggedLeadId, setDraggedLeadId] = useState<number | null>(null)
  const [toastMsg, setToastMsg] = useState('')
  const [objectionsOpen, setObjectionsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Payment form state
  const [pagNome, setPagNome] = useState('')
  const [pagValor, setPagValor] = useState('200')
  const [pagParcelas, setPagParcelas] = useState('1')
  const [pagDesconto, setPagDesconto] = useState('0')
  const [pagLoading, setPagLoading] = useState(false)
  const [pagResult, setPagResult] = useState('')

  // Modal form state
  const [modalName, setModalName] = useState('')
  const [modalPhone, setModalPhone] = useState('')
  const [modalCampaignId, setModalCampaignId] = useState('')
  const [modalFlow, setModalFlow] = useState('terapia')

  // Notes ref for blur saving
  const notesRef = useRef<HTMLTextAreaElement>(null)
  const scriptsPanelRef = useRef<HTMLDivElement>(null)
  const columnRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // ============================================================
  // Toast
  // ============================================================
  const toast = useCallback((msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2500)
  }, [])

  // ============================================================
  // Replace variables
  // ============================================================
  const replaceVars = useCallback((text: string, leadName?: string): string => {
    const nome = leadName || '{nome}'
    const vendedor = vendedorName || '{vendedor}'
    return text.replace(/\{nome\}/g, nome).replace(/\{vendedor\}/g, vendedor)
  }, [vendedorName])

  // ============================================================
  // Mobile detection
  // ============================================================
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // ============================================================
  // Vendedor localStorage
  // ============================================================
  useEffect(() => {
    setVendedorName(localStorage.getItem('vendas_vendedor') || '')
  }, [])

  const handleVendedorChange = useCallback((val: string) => {
    setVendedorName(val)
    localStorage.setItem('vendas_vendedor', val)
  }, [])

  // ============================================================
  // API Calls
  // ============================================================
  const fetchLeads = useCallback(async () => {
    try {
      const resp = await fetch('/api/painel/leads')
      if (!resp.ok) return []
      const data = await resp.json()
      setLeads(data)
      return data
    } catch (e) {
      console.error('Erro ao buscar leads', e)
      return []
    }
  }, [])

  const fetchCampanhas = useCallback(async () => {
    try {
      const resp = await fetch('/api/painel/campaigns')
      if (!resp.ok) return
      const data = await resp.json()
      setCampanhas(data)
    } catch (e) {
      console.error('Erro ao buscar campanhas', e)
    }
  }, [])

  const fetchTemplates = useCallback(async () => {
    try {
      const [r1, r2] = await Promise.all([
        fetch('/api/painel/vendas/templates?flow=terapia'),
        fetch('/api/painel/vendas/templates?flow=avaliacao_neuro'),
      ])
      const t1 = r1.ok ? await r1.json() : []
      const t2 = r2.ok ? await r2.json() : []
      setTemplates([...t1, ...t2])
    } catch (e) {
      console.error('Erro ao buscar templates', e)
    }
  }, [])

  const updateLead = useCallback(async (id: number, data: Partial<Lead>) => {
    const resp = await fetch(`/api/painel/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!resp.ok) throw new Error('Erro ao atualizar')
    return resp.json()
  }, [])

  // ============================================================
  // Initial fetch
  // ============================================================
  useEffect(() => {
    Promise.all([fetchLeads(), fetchCampanhas(), fetchTemplates()])
  }, [fetchLeads, fetchCampanhas, fetchTemplates])

  // ============================================================
  // Lead actions
  // ============================================================
  const moveLead = useCallback(async (id: number, newStage: string) => {
    setLeads(prev => {
      const updated = prev.map(l => l.id === id ? { ...l, stage: newStage } : l)
      return updated
    })

    try {
      await updateLead(id, { stage: newStage } as Partial<Lead>)
      toast('Movido para ' + STAGE_LABELS[newStage])
    } catch {
      await fetchLeads()
      toast('Erro ao mover lead')
    }
  }, [updateLead, toast, fetchLeads])

  const marcarPerdido = useCallback(async (id: number) => {
    if (!confirm('Marcar como perdido?')) return
    await moveLead(id, 'perdido')
  }, [moveLead])

  const reabrirLead = useCallback(async (id: number) => {
    await moveLead(id, 'novo')
  }, [moveLead])

  const selectLead = useCallback((id: number) => {
    if (selectedLeadId === id) {
      setSelectedLeadId(null)
      return
    }
    setSelectedLeadId(id)
    setObjectionsOpen(false)
    setPagResult('')
    if (isMobile && scriptsPanelRef.current) {
      setTimeout(() => scriptsPanelRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }, [selectedLeadId, isMobile])

  const changeLeadStage = useCallback(async (id: number, newStage: string) => {
    await moveLead(id, newStage)
  }, [moveLead])

  const changeLeadFlow = useCallback(async (id: number, newFlow: string) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, flow: newFlow } : l))
    try {
      await updateLead(id, { flow: newFlow } as Partial<Lead>)
    } catch {
      toast('Erro ao alterar fluxo')
    }
  }, [updateLead, toast])

  const saveNotes = useCallback(async (id: number) => {
    const textarea = notesRef.current
    if (!textarea) return
    const lead = leads.find(l => l.id === id)
    if (!lead) return
    const newNotes = textarea.value.trim() || null
    if (newNotes === (lead.notes || null)) return
    setLeads(prev => prev.map(l => l.id === id ? { ...l, notes: newNotes } : l))
    try {
      await updateLead(id, { notes: newNotes || '' } as Partial<Lead>)
    } catch {
      toast('Erro ao salvar notas')
    }
  }, [leads, updateLead, toast])

  const copyScript = useCallback((tplId: number, leadName: string) => {
    const tpl = templates.find(t => t.id === tplId)
    if (!tpl) return
    navigator.clipboard.writeText(replaceVars(tpl.body, leadName))
    toast('Copiado!')
  }, [templates, replaceVars, toast])

  // ============================================================
  // Drag and Drop
  // ============================================================
  const handleDragStart = useCallback((e: React.DragEvent, leadId: number) => {
    setDraggedLeadId(leadId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(leadId))
  }, [])

  const handleDragEnd = useCallback(() => {
    setDraggedLeadId(null)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent, newStage: string) => {
    e.preventDefault()
    const leadId = parseInt(e.dataTransfer.getData('text/plain'))
    if (!leadId) return
    await moveLead(leadId, newStage)
  }, [moveLead])

  const handleDropPerdido = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    const leadId = parseInt(e.dataTransfer.getData('text/plain'))
    if (leadId) {
      await moveLead(leadId, 'perdido')
    }
  }, [moveLead])

  // ============================================================
  // Quick nav scroll
  // ============================================================
  const scrollToCol = useCallback((stage: string) => {
    const el = columnRefs.current[stage]
    if (el) el.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
  }, [])

  // ============================================================
  // Modal
  // ============================================================
  const abrirModal = useCallback(() => {
    setModalName('')
    setModalPhone('')
    setModalCampaignId('')
    setModalFlow('terapia')
    setShowModal(true)
  }, [])

  const salvarLead = useCallback(async () => {
    if (!modalName.trim()) return

    const body = {
      name: modalName.trim(),
      phone: modalPhone.trim() || null,
      campaign_id: modalCampaignId ? Number(modalCampaignId) : null,
      flow: modalFlow,
    }

    try {
      const resp = await fetch('/api/painel/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!resp.ok) {
        const d = await resp.json()
        throw new Error(d.error || 'Erro')
      }
      setShowModal(false)
      toast('Lead criado')
      await fetchLeads()
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : 'Erro ao criar lead')
    }
  }, [modalName, modalPhone, modalCampaignId, modalFlow, toast, fetchLeads])

  // ============================================================
  // Payment
  // ============================================================
  const gerarPagamento = useCallback(async () => {
    setPagLoading(true)
    setPagResult('')

    try {
      const resp = await fetch('/api/painel/pagamentos/criar-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome_cliente: pagNome.trim(),
          valor_total: parseFloat(pagValor),
          parcelas: parseInt(pagParcelas),
          desconto_percentual: parseFloat(pagDesconto) || 0,
        }),
      })
      const data = await resp.json()
      if (!resp.ok) throw new Error(data.erro || 'Erro')
      setPagResult(data.link)
      toast('Link gerado!')
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : 'Erro ao gerar link')
    } finally {
      setPagLoading(false)
    }
  }, [pagNome, pagValor, pagParcelas, pagDesconto, toast])

  // ============================================================
  // Derived data
  // ============================================================
  const selectedLead = leads.find(l => l.id === selectedLeadId) || null
  const stageCounts: Record<string, number> = {}
  KANBAN_STAGES.forEach(s => { stageCounts[s] = 0 })
  leads.forEach(l => { if (stageCounts[l.stage] !== undefined) stageCounts[l.stage]++ })

  const fechados = leads.filter(l => l.stage === 'fechado')
  const perdidos = leads.filter(l => l.stage === 'perdido')

  // Update pagNome when selectedLead changes
  useEffect(() => {
    if (selectedLead) {
      setPagNome(selectedLead.name)
    }
  }, [selectedLead])

  // Scripts data for selected lead
  const selectedFlow = selectedLead?.flow || 'terapia'
  const stageScripts = selectedLead ? (STAGE_MAP[selectedFlow]?.[selectedLead.stage] || []) : []
  const relevantTemplates = templates.filter(
    t => t.flow === selectedFlow && stageScripts.includes(t.stage) && !Number(t.is_objection)
  )
  const flowObjections = templates.filter(
    t => t.flow === selectedFlow && Number(t.is_objection)
  )

  // ============================================================
  // Render
  // ============================================================
  return (
    <div className="font-dm flex flex-col flex-1 bg-[#FDFBF7]" style={{ minHeight: 0 }}>
      {/* Vendedor input (top-right, desktop) */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#E8E4DF]">
        <div className="flex gap-1.5 overflow-x-auto flex-1 py-0.5">
          {/* Quick nav pills */}
          {KANBAN_STAGES.map(stage => {
            const colors = STAGE_COLORS[stage]
            return (
              <button
                key={stage}
                onClick={() => scrollToCol(stage)}
                className="font-dm text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap transition-all hover:opacity-80"
                style={{ background: colors.bg, color: colors.text, border: `1.5px solid ${colors.border}` }}
              >
                {STAGE_LABELS[stage]} ({stageCounts[stage]})
              </button>
            )
          })}
          <button
            onClick={abrirModal}
            className="font-dm text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap bg-[#2E9E8F] text-white hover:opacity-90 transition-all"
          >
            + Novo lead
          </button>
        </div>
        <div className="hidden min-[500px]:flex items-center gap-1.5 ml-3 flex-shrink-0">
          <label className="font-dm text-xs text-[#777]">Vendedor(a):</label>
          <input
            type="text"
            value={vendedorName}
            onChange={e => handleVendedorChange(e.target.value)}
            placeholder="Seu nome"
            className="font-dm text-xs px-2 py-1 rounded-lg border border-[#E8E4DF] bg-white outline-none focus:border-[#2E9E8F] w-[120px]"
          />
        </div>
      </div>

      {/* Main container */}
      <div className="flex flex-1 min-h-0 max-[900px]:flex-col">
        {/* Kanban wrap */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Kanban columns */}
          <div className="flex-1 flex gap-3 p-3 overflow-x-auto max-[900px]:gap-0 max-[900px]:p-0 max-[900px]:snap-x max-[900px]:snap-mandatory">
            {KANBAN_STAGES.map(stage => {
              const stageLeads = leads.filter(l => l.stage === stage)
              const colors = STAGE_COLORS[stage]
              const idx = KANBAN_STAGES.indexOf(stage)

              return (
                <div
                  key={stage}
                  ref={el => { columnRefs.current[stage] = el }}
                  className="flex-1 min-w-[240px] flex flex-col bg-white rounded-xl border border-[#E8E4DF] overflow-hidden max-[900px]:flex-none max-[900px]:w-[85vw] max-[900px]:snap-start max-[900px]:rounded-none max-[900px]:min-h-[50vh]"
                  onDragOver={handleDragOver}
                  onDrop={e => handleDrop(e, stage)}
                >
                  {/* Column header */}
                  <div
                    className="flex items-center justify-between px-3 py-2 border-b"
                    style={{ borderColor: colors.border, background: colors.bg }}
                  >
                    <span className="font-dm text-sm font-semibold" style={{ color: colors.text }}>
                      {STAGE_LABELS[stage]}
                    </span>
                    <span
                      className="font-dm text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: colors.border, color: '#fff' }}
                    >
                      {stageLeads.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
                    {stageLeads.map(lead => {
                      const campanha = campanhas.find(c => c.id === lead.campaign_id)
                      const flowLabel = lead.flow === 'avaliacao_neuro' ? 'Neuro' : 'Terapia'
                      const isSelected = selectedLeadId === lead.id

                      return (
                        <div
                          key={lead.id}
                          draggable={!isMobile}
                          onDragStart={e => handleDragStart(e, lead.id)}
                          onDragEnd={handleDragEnd}
                          onClick={() => selectLead(lead.id)}
                          className={`relative bg-white rounded-lg border p-2.5 cursor-pointer transition-all hover:shadow-md ${
                            isSelected
                              ? 'border-[#2E9E8F] shadow-md ring-2 ring-[#2E9E8F]/20'
                              : 'border-[#E8E4DF]'
                          } ${draggedLeadId === lead.id ? 'opacity-50' : ''}`}
                        >
                          {/* X button for perdido */}
                          <button
                            onClick={e => { e.stopPropagation(); marcarPerdido(lead.id) }}
                            className="absolute top-1.5 right-1.5 w-5 h-5 flex items-center justify-center rounded-full text-[#999] hover:text-red-500 hover:bg-red-50 text-sm leading-none transition-colors"
                            title="Marcar como perdido"
                          >
                            &times;
                          </button>

                          <div className="font-dm text-sm font-semibold text-[#2D2D2D] pr-5 truncate">
                            {lead.name}
                          </div>
                          {lead.phone && (
                            <div className="font-dm text-xs text-[#777] mt-0.5">{lead.phone}</div>
                          )}

                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {campanha && (
                              <span className="font-dm text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#F0FAF8] text-[#1A7A6D] border border-[#C8E6E0]">
                                {campanha.channel}
                              </span>
                            )}
                            <span className={`font-dm text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                              lead.flow === 'avaliacao_neuro'
                                ? 'bg-[#EDE7F6] text-[#5E35B1] border border-[#D1C4E9]'
                                : 'bg-[#E3F2FD] text-[#1565C0] border border-[#BBDEFB]'
                            }`}>
                              {flowLabel}
                            </span>
                          </div>

                          <div className="font-dm text-[10px] text-[#999] mt-1.5">
                            {tempoAtras(lead.updated_at)}
                          </div>

                          {/* Mobile move buttons */}
                          {isMobile && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {idx > 0 && (
                                <button
                                  onClick={e => { e.stopPropagation(); moveLead(lead.id, KANBAN_STAGES[idx - 1]) }}
                                  className="font-dm text-[10px] font-semibold px-2 py-1 rounded border border-[#E8E4DF] bg-white text-[#777] hover:bg-[#e0f5f1] hover:text-[#1A7A6D] min-h-[28px] transition-colors"
                                >
                                  &larr; {STAGE_LABELS[KANBAN_STAGES[idx - 1]]}
                                </button>
                              )}
                              {idx < KANBAN_STAGES.length - 1 && (
                                <button
                                  onClick={e => { e.stopPropagation(); moveLead(lead.id, KANBAN_STAGES[idx + 1]) }}
                                  className="font-dm text-[10px] font-semibold px-2 py-1 rounded border border-[#E8E4DF] bg-white text-[#777] hover:bg-[#e0f5f1] hover:text-[#1A7A6D] min-h-[28px] transition-colors"
                                >
                                  {STAGE_LABELS[KANBAN_STAGES[idx + 1]]} &rarr;
                                </button>
                              )}
                              <button
                                onClick={e => { e.stopPropagation(); moveLead(lead.id, 'fechado') }}
                                className="font-dm text-[10px] font-semibold px-2 py-1 rounded border border-[#E8E4DF] bg-white text-[#777] hover:bg-[#e0f5f1] hover:text-[#1A7A6D] min-h-[28px] transition-colors"
                              >
                                Fechado
                              </button>
                              <button
                                onClick={e => { e.stopPropagation(); marcarPerdido(lead.id) }}
                                className="font-dm text-[10px] font-semibold px-2 py-1 rounded border border-red-200 bg-white text-red-600 hover:bg-red-50 min-h-[28px] transition-colors"
                              >
                                Perdido
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    })}

                    {stage === 'novo' && (
                      <button
                        onClick={abrirModal}
                        className="font-dm text-sm font-semibold text-[#2E9E8F] border border-dashed border-[#2E9E8F] rounded-lg py-2.5 hover:bg-[#F0FAF8] transition-colors"
                      >
                        + Novo lead
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Drop zone perdido */}
          {draggedLeadId !== null && (
            <div
              onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move' }}
              onDrop={handleDropPerdido}
              className="mx-3 mb-2 py-3 rounded-xl border-2 border-dashed border-red-300 bg-red-50 text-center font-dm text-sm font-semibold text-red-500 transition-colors"
            >
              Soltar aqui para marcar como Perdido
            </div>
          )}

          {/* Finalizados */}
          <div className="px-3 pb-2">
            <button
              onClick={() => setFinalizadosOpen(!finalizadosOpen)}
              className="w-full font-dm text-xs font-semibold text-[#777] py-2 rounded-lg border border-[#E8E4DF] bg-white hover:bg-gray-50 transition-colors"
            >
              Ver finalizados ({fechados.length} fechados, {perdidos.length} perdidos)
            </button>

            {finalizadosOpen && (
              <div className="mt-2 bg-white rounded-xl border border-[#E8E4DF] overflow-hidden">
                {fechados.length === 0 && perdidos.length === 0 ? (
                  <div className="text-center py-4 font-dm text-sm text-[#777]">
                    Nenhum lead finalizado.
                  </div>
                ) : (
                  [...fechados, ...perdidos].map(l => (
                    <div
                      key={l.id}
                      className="flex items-center justify-between px-3 py-2 border-b border-[#E8E4DF] last:border-b-0"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-dm text-sm font-semibold">{l.name}</span>
                        <span
                          className={`font-dm text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                            l.stage === 'fechado'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {STAGE_LABELS[l.stage]}
                        </span>
                      </div>
                      <button
                        onClick={() => reabrirLead(l.id)}
                        className="font-dm text-xs font-semibold text-[#2E9E8F] hover:underline"
                      >
                        Reabrir
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Scripts Panel */}
        <div
          ref={scriptsPanelRef}
          className="w-[380px] border-l border-[#E8E4DF] bg-white overflow-y-auto flex-shrink-0 max-[900px]:w-full max-[900px]:border-l-0 max-[900px]:border-t max-[900px]:border-[#E8E4DF] max-[900px]:max-h-[50vh] max-[900px]:flex-none"
        >
          {!selectedLead ? (
            <div className="flex items-center justify-center h-full min-h-[200px] font-dm text-sm text-[#777]">
              Selecione um lead para ver scripts e ações
            </div>
          ) : (
            <div className="p-4 flex flex-col gap-4">
              {/* Lead name header */}
              <div className="flex items-center justify-between">
                <h2 className="font-dm text-lg font-bold text-[#2D2D2D]">{selectedLead.name}</h2>
              </div>

              {/* Contact info */}
              <div>
                <h3 className="font-dm text-xs font-semibold text-[#777] uppercase tracking-wide mb-1.5">Contato</h3>
                {selectedLead.phone ? (
                  <div className="font-dm text-sm">
                    {selectedLead.phone}{' '}
                    <a
                      href={`https://wa.me/55${selectedLead.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2E9E8F] hover:underline ml-1"
                    >
                      Abrir WhatsApp
                    </a>
                  </div>
                ) : (
                  <div className="font-dm text-sm text-[#777]">Sem telefone</div>
                )}
                {(() => {
                  const campanha = campanhas.find(c => c.id === selectedLead.campaign_id)
                  return campanha ? (
                    <div className="font-dm text-sm text-[#555] mt-0.5">
                      Campanha: {campanha.name} ({campanha.channel})
                    </div>
                  ) : null
                })()}
              </div>

              {/* Stage select */}
              <div>
                <h3 className="font-dm text-xs font-semibold text-[#777] uppercase tracking-wide mb-1.5">Etapa</h3>
                <select
                  value={selectedLead.stage}
                  onChange={e => changeLeadStage(selectedLead.id, e.target.value)}
                  className="font-dm text-sm w-full px-2.5 py-1.5 rounded-lg border border-[#E8E4DF] bg-[#FDFBF7] outline-none focus:border-[#2E9E8F]"
                >
                  {ALL_STAGES.map(s => (
                    <option key={s} value={s}>{STAGE_LABELS[s]}</option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <h3 className="font-dm text-xs font-semibold text-[#777] uppercase tracking-wide mb-1.5">Notas</h3>
                <textarea
                  ref={notesRef}
                  defaultValue={selectedLead.notes || ''}
                  key={selectedLead.id}
                  onBlur={() => saveNotes(selectedLead.id)}
                  placeholder="Adicionar notas..."
                  className="font-dm text-sm w-full px-2.5 py-2 rounded-lg border border-[#E8E4DF] bg-[#FDFBF7] outline-none focus:border-[#2E9E8F] resize-y min-h-[60px]"
                />
              </div>

              {/* Flow toggle + scripts */}
              <div>
                <h3 className="font-dm text-xs font-semibold text-[#777] uppercase tracking-wide mb-1.5">
                  Scripts ({selectedFlow === 'avaliacao_neuro' ? 'Avaliacao Neuro' : 'Terapia'})
                </h3>
                <div className="inline-flex rounded-lg border border-[#E8E4DF] overflow-hidden mb-3">
                  <button
                    onClick={() => changeLeadFlow(selectedLead.id, 'terapia')}
                    className={`font-dm text-xs font-semibold px-3 py-1.5 transition-colors ${
                      selectedFlow === 'terapia'
                        ? 'bg-[#2E9E8F] text-white'
                        : 'text-[#777] hover:bg-gray-50'
                    }`}
                  >
                    Terapia
                  </button>
                  <button
                    onClick={() => changeLeadFlow(selectedLead.id, 'avaliacao_neuro')}
                    className={`font-dm text-xs font-semibold px-3 py-1.5 transition-colors ${
                      selectedFlow === 'avaliacao_neuro'
                        ? 'bg-[#2E9E8F] text-white'
                        : 'text-[#777] hover:bg-gray-50'
                    }`}
                  >
                    Neuro
                  </button>
                </div>

                {relevantTemplates.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {relevantTemplates.map(tpl => (
                      <div key={tpl.id} className="border border-[#E8E4DF] rounded-lg overflow-hidden">
                        <div className="flex items-center justify-between px-3 py-2 bg-[#F0FAF8]">
                          <span className="font-dm text-sm font-semibold">{tpl.title}</span>
                          <button
                            onClick={() => copyScript(tpl.id, selectedLead.name)}
                            className="font-dm text-xs font-semibold px-2.5 py-1 rounded-md bg-[#2E9E8F] text-white hover:opacity-90 transition-opacity"
                          >
                            Copiar
                          </button>
                        </div>
                        <div className="px-3 py-2 font-dm text-sm text-[#555] whitespace-pre-wrap break-words max-h-[120px] overflow-y-auto leading-relaxed">
                          {replaceVars(tpl.body, selectedLead.name)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="font-dm text-sm text-[#777]">Nenhum script para esta etapa.</div>
                )}

                {/* Objections accordion */}
                {flowObjections.length > 0 && (
                  <div className="mt-3">
                    <button
                      onClick={() => setObjectionsOpen(!objectionsOpen)}
                      className="w-full flex items-center justify-between px-3 py-2 border border-[#E8E4DF] rounded-lg font-dm text-sm font-semibold text-[#2D2D2D] hover:bg-gray-50 transition-colors"
                    >
                      <span>Objecoes ({flowObjections.length})</span>
                      <span className="text-xs">{objectionsOpen ? '\u25BC' : '\u25B6'}</span>
                    </button>
                    {objectionsOpen && (
                      <div className="mt-2 flex flex-col gap-2">
                        {flowObjections.map(obj => (
                          <div key={obj.id} className="border border-[#E8E4DF] rounded-lg overflow-hidden">
                            <div className="flex items-center justify-between px-3 py-2 bg-[#F0FAF8]">
                              <span className="font-dm text-sm font-semibold">{obj.title}</span>
                              <button
                                onClick={() => copyScript(obj.id, selectedLead.name)}
                                className="font-dm text-xs font-semibold px-2.5 py-1 rounded-md bg-[#2E9E8F] text-white hover:opacity-90 transition-opacity"
                              >
                                Copiar
                              </button>
                            </div>
                            <div className="px-3 py-2 font-dm text-sm text-[#555] whitespace-pre-wrap break-words max-h-[120px] overflow-y-auto leading-relaxed">
                              {replaceVars(obj.body, selectedLead.name)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Payment form */}
              {selectedLead.stage === 'pagamento_enviado' && (
                <div>
                  <h3 className="font-dm text-xs font-semibold text-[#777] uppercase tracking-wide mb-1.5">
                    Gerar Link de Pagamento
                  </h3>
                  <div className="flex flex-col gap-2.5">
                    <div>
                      <label className="font-dm text-xs font-semibold text-[#555] block mb-0.5">Nome</label>
                      <input
                        type="text"
                        value={pagNome}
                        onChange={e => setPagNome(e.target.value)}
                        className="font-dm text-sm w-full px-2.5 py-1.5 rounded-lg border border-[#E8E4DF] bg-[#FDFBF7] outline-none focus:border-[#2E9E8F]"
                      />
                    </div>
                    <div>
                      <label className="font-dm text-xs font-semibold text-[#555] block mb-0.5">Valor total (R$)</label>
                      <input
                        type="number"
                        value={pagValor}
                        onChange={e => setPagValor(e.target.value)}
                        min="5"
                        max="5000"
                        className="font-dm text-sm w-full px-2.5 py-1.5 rounded-lg border border-[#E8E4DF] bg-[#FDFBF7] outline-none focus:border-[#2E9E8F]"
                      />
                    </div>
                    <div>
                      <label className="font-dm text-xs font-semibold text-[#555] block mb-0.5">Parcelas</label>
                      <select
                        value={pagParcelas}
                        onChange={e => setPagParcelas(e.target.value)}
                        className="font-dm text-sm w-full px-2.5 py-1.5 rounded-lg border border-[#E8E4DF] bg-[#FDFBF7] outline-none focus:border-[#2E9E8F]"
                      >
                        <option value="1">1x (a vista)</option>
                        <option value="2">2x</option>
                        <option value="3">3x</option>
                        <option value="4">4x</option>
                        <option value="5">5x</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-dm text-xs font-semibold text-[#555] block mb-0.5">Desconto (%)</label>
                      <input
                        type="number"
                        value={pagDesconto}
                        onChange={e => setPagDesconto(e.target.value)}
                        min="0"
                        max="30"
                        className="font-dm text-sm w-full px-2.5 py-1.5 rounded-lg border border-[#E8E4DF] bg-[#FDFBF7] outline-none focus:border-[#2E9E8F]"
                      />
                    </div>
                    <button
                      onClick={gerarPagamento}
                      disabled={pagLoading}
                      className="font-dm text-sm font-semibold w-full py-2 rounded-lg bg-[#1A7A6D] text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {pagLoading ? 'Gerando...' : 'Gerar link de pagamento'}
                    </button>
                    {pagResult && (
                      <div className="p-2.5 bg-[#F0FAF8] rounded-lg font-dm text-sm break-all">
                        <a href={pagResult} target="_blank" rel="noopener noreferrer" className="text-[#1A7A6D] hover:underline">
                          {pagResult}
                        </a>
                        <button
                          onClick={() => { navigator.clipboard.writeText(pagResult); toast('Link copiado!') }}
                          className="font-dm text-xs font-semibold px-2.5 py-1 rounded-md bg-[#2E9E8F] text-white hover:opacity-90 ml-2 transition-opacity"
                        >
                          Copiar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Mark as lost button */}
              {selectedLead.stage !== 'perdido' && selectedLead.stage !== 'fechado' && (
                <button
                  onClick={() => marcarPerdido(selectedLead.id)}
                  className="font-dm text-sm font-semibold w-full py-2 rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 transition-colors"
                >
                  Marcar como Perdido
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* New lead modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-[420px] shadow-xl"
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); salvarLead() } }}
          >
            <h2 className="font-dm text-lg font-bold text-[#1A7A6D] mb-4">Novo Lead</h2>

            <div className="flex flex-col gap-3.5">
              <div>
                <label className="font-dm text-sm font-semibold text-[#555] block mb-1">Nome *</label>
                <input
                  type="text"
                  value={modalName}
                  onChange={e => setModalName(e.target.value)}
                  placeholder="Ex: Maria Silva"
                  autoFocus
                  className="font-dm text-sm w-full px-3 py-2 rounded-lg border-[1.5px] border-[#DDD] bg-[#FDFBF7] outline-none focus:border-[#1A7A6D]"
                />
              </div>
              <div>
                <label className="font-dm text-sm font-semibold text-[#555] block mb-1">Telefone (opcional)</label>
                <input
                  type="tel"
                  value={modalPhone}
                  onChange={e => setModalPhone(e.target.value)}
                  placeholder="(21) 99999-9999"
                  className="font-dm text-sm w-full px-3 py-2 rounded-lg border-[1.5px] border-[#DDD] bg-[#FDFBF7] outline-none focus:border-[#1A7A6D]"
                />
              </div>
              <div>
                <label className="font-dm text-sm font-semibold text-[#555] block mb-1">Campanha (opcional)</label>
                <select
                  value={modalCampaignId}
                  onChange={e => setModalCampaignId(e.target.value)}
                  className="font-dm text-sm w-full px-3 py-2 rounded-lg border-[1.5px] border-[#DDD] bg-[#FDFBF7] outline-none focus:border-[#1A7A6D]"
                >
                  <option value="">Sem campanha</option>
                  {campanhas
                    .filter(c => c.active === 1 || c.active === true)
                    .map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.channel})</option>
                    ))}
                </select>
              </div>
              <div>
                <label className="font-dm text-sm font-semibold text-[#555] block mb-1">Fluxo</label>
                <select
                  value={modalFlow}
                  onChange={e => setModalFlow(e.target.value)}
                  className="font-dm text-sm w-full px-3 py-2 rounded-lg border-[1.5px] border-[#DDD] bg-[#FDFBF7] outline-none focus:border-[#1A7A6D]"
                >
                  <option value="terapia">Terapia</option>
                  <option value="avaliacao_neuro">Avaliacao Neuro</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2.5 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 font-dm text-sm font-semibold py-2.5 rounded-lg bg-gray-100 text-[#555] hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={salvarLead}
                className="flex-1 font-dm text-sm font-semibold py-2.5 rounded-lg bg-[#1A7A6D] text-white hover:opacity-90 transition-opacity"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] bg-[#333] text-white font-dm text-sm font-medium px-6 py-2.5 rounded-lg shadow-lg animate-fade-in">
          {toastMsg}
        </div>
      )}
    </div>
  )
}
