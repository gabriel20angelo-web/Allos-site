'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'

// ── Types ──────────────────────────────────────────────────────────
interface Template {
  id: number
  flow: string
  stage: string
  template_key: string
  title: string
  body: string
  sort_order: number
  is_objection: boolean | number
}

// ── Component ──────────────────────────────────────────────────────
export default function VendasPage() {
  const [currentFlow, setCurrentFlow] = useState('terapia')
  const [currentStage, setCurrentStage] = useState('todas')
  const [templates, setTemplates] = useState<Template[]>([])
  const [nome, setNome] = useState('')
  const [vendedor, setVendedor] = useState('Thainá')
  const [toastMsg, setToastMsg] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState('')
  const [openObjIds, setOpenObjIds] = useState<Set<number>>(new Set())
  const [editingObjId, setEditingObjId] = useState<number | null>(null)
  const [editObjText, setEditObjText] = useState('')
  const [newStageName, setNewStageName] = useState('')
  const [showNewStage, setShowNewStage] = useState(false)
  const [addingToStage, setAddingToStage] = useState<string | null>(null)
  const [newScriptTitle, setNewScriptTitle] = useState('')

  const toast = useCallback((msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2500)
  }, [])

  // ── localStorage persistence ─────────────────────────────────────
  useEffect(() => {
    setNome(localStorage.getItem('vendas_nome') || '')
    setVendedor(localStorage.getItem('vendas_vendedor') || 'Thainá')
  }, [])

  useEffect(() => { localStorage.setItem('vendas_nome', nome) }, [nome])
  useEffect(() => { localStorage.setItem('vendas_vendedor', vendedor) }, [vendedor])

  // ── Variable replacement ─────────────────────────────────────────
  function replaceVars(text: string): string {
    return text
      .replace(/\{nome\}/g, nome || '{nome}')
      .replace(/\{vendedor\}/g, vendedor || '{vendedor}')
  }

  // ── Data loading ─────────────────────────────────────────────────
  const loadTemplates = useCallback(async (flow: string) => {
    try {
      const resp = await fetch(`/api/painel/vendas/templates?flow=${flow}`)
      if (!resp.ok) return
      const data = await resp.json()
      setTemplates(data)
    } catch (err) {
      console.error('Erro ao carregar templates:', err)
    }
  }, [])

  useEffect(() => {
    loadTemplates(currentFlow)
  }, [currentFlow, loadTemplates])

  // ── Dynamic stages derived from templates ────────────────────────
  const { stageKeys, stageLabels } = useMemo(() => {
    const regular = templates.filter(t => !Number(t.is_objection))
    const stageMap = new Map<string, { minOrder: number; label: string }>()

    for (const t of regular) {
      const existing = stageMap.get(t.stage)
      if (!existing || t.sort_order < existing.minOrder) {
        stageMap.set(t.stage, {
          minOrder: existing ? Math.min(existing.minOrder, t.sort_order) : t.sort_order,
          label: existing?.label || t.stage.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        })
      }
    }

    const entries: [string, { minOrder: number; label: string }][] = []
    stageMap.forEach((val, key) => entries.push([key, val]))
    entries.sort((a, b) => a[1].minOrder - b[1].minOrder)
    return {
      stageKeys: entries.map(([key]) => key),
      stageLabels: Object.fromEntries(entries.map(([key, val]) => [key, val.label])),
    }
  }, [templates])

  const regularTemplates = templates.filter(t => !Number(t.is_objection))
  const objections = templates.filter(t => Number(t.is_objection))

  // ── Save template ────────────────────────────────────────────────
  async function saveTemplate(id: number, body: string) {
    try {
      const resp = await fetch(`/api/painel/vendas/templates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body }),
      })
      if (!resp.ok) throw new Error('Erro ao salvar')
      const updated = await resp.json()
      setTemplates(prev => prev.map(t => t.id === id ? updated : t))
      toast('Salvo!')
      setEditingId(null)
      setEditingObjId(null)
    } catch {
      toast('Erro ao salvar')
    }
  }

  // ── Create new template ──────────────────────────────────────────
  async function createTemplate(stage: string, title: string) {
    const stageTemplates = regularTemplates.filter(t => t.stage === stage)
    const maxOrder = stageTemplates.length > 0 ? Math.max(...stageTemplates.map(t => t.sort_order)) : -1

    try {
      const resp = await fetch('/api/painel/vendas/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flow: currentFlow,
          stage,
          title: title.trim(),
          body: 'Digite o texto do script aqui...',
          sort_order: maxOrder + 1,
          is_objection: false,
        }),
      })
      if (!resp.ok) throw new Error('Erro ao criar')
      toast('Script criado!')
      setAddingToStage(null)
      setNewScriptTitle('')
      loadTemplates(currentFlow)
    } catch {
      toast('Erro ao criar script')
    }
  }

  // ── Create new stage ─────────────────────────────────────────────
  async function createStage() {
    const stageName = newStageName.trim().toLowerCase().replace(/\s+/g, '_')
    if (!stageName) return

    const maxOrder = stageKeys.length > 0
      ? Math.max(...templates.filter(t => !Number(t.is_objection)).map(t => t.sort_order)) + 100
      : 0

    try {
      const resp = await fetch('/api/painel/vendas/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flow: currentFlow,
          stage: stageName,
          title: newStageName.trim(),
          body: 'Digite o texto do script aqui...',
          sort_order: maxOrder,
          is_objection: false,
        }),
      })
      if (!resp.ok) throw new Error('Erro ao criar')
      toast('Etapa criada!')
      setShowNewStage(false)
      setNewStageName('')
      loadTemplates(currentFlow)
    } catch {
      toast('Erro ao criar etapa')
    }
  }

  // ── Reset all ────────────────────────────────────────────────────
  async function resetAll() {
    if (!confirm('Restaurar todos os textos ao original? Suas edições serão perdidas.')) return
    try {
      await fetch('/api/painel/vendas/templates/reset', { method: 'POST' })
      toast('Textos restaurados!')
      loadTemplates(currentFlow)
    } catch {
      toast('Erro ao restaurar')
    }
  }

  // ── Copy template ────────────────────────────────────────────────
  function copyTemplate(id: number) {
    const tpl = templates.find(t => t.id === id)
    if (!tpl) return
    navigator.clipboard.writeText(replaceVars(tpl.body)).then(() => toast('Copiado!'))
  }

  // ── Toggle objection accordion ───────────────────────────────────
  function toggleObj(id: number) {
    setOpenObjIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div className="font-dm min-h-screen flex flex-col" style={{ background: '#FDFBF7' }}>
      {/* Flow tabs */}
      <div className="flex bg-white border-b-2 px-4" style={{ borderColor: '#E5DFD3' }}>
        {[
          { key: 'terapia', label: 'Terapia' },
          { key: 'avaliacao_neuro', label: 'Avaliação Neuro' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => { setCurrentFlow(f.key); setCurrentStage('todas'); setEditingId(null); setEditingObjId(null) }}
            className="px-6 py-3 text-sm font-semibold border-b-[3px] transition-colors"
            style={{
              color: currentFlow === f.key ? '#1A7A6D' : '#5C5C5C',
              borderBottomColor: currentFlow === f.key ? '#2E9E8F' : 'transparent',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Variables bar */}
      <div className="flex gap-4 px-6 py-3 flex-wrap items-center" style={{ background: '#F0FAF8', borderBottom: '1px solid #E5DFD3' }}>
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold" style={{ color: '#1A7A6D' }}>Nome do paciente:</label>
          <input
            type="text"
            value={nome}
            onChange={e => setNome(e.target.value)}
            placeholder="Ex: Maria"
            className="px-3 py-1.5 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2E9E8F]/20 w-40"
            style={{ borderColor: '#E5DFD3' }}
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold" style={{ color: '#1A7A6D' }}>Vendedor(a):</label>
          <input
            type="text"
            value={vendedor}
            onChange={e => setVendedor(e.target.value)}
            className="px-3 py-1.5 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2E9E8F]/20 w-40"
            style={{ borderColor: '#E5DFD3' }}
          />
        </div>
      </div>

      {/* Main layout */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[200px_1fr_280px] max-w-[1200px] mx-auto w-full" style={{ minHeight: 'calc(100vh - 180px)' }}>
        {/* Stages sidebar */}
        <aside className="bg-white border-r p-4 md:block flex flex-wrap gap-1 overflow-x-auto md:overflow-visible" style={{ borderColor: '#E5DFD3' }}>
          <h3 className="font-fraunces text-xs uppercase tracking-wide font-semibold mb-3 hidden md:block" style={{ color: '#5C5C5C' }}>Etapas</h3>
          <button
            onClick={() => { setCurrentStage('todas'); setEditingId(null) }}
            className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium mb-0.5 transition-colors"
            style={{
              background: currentStage === 'todas' ? '#2E9E8F' : undefined,
              color: currentStage === 'todas' ? '#fff' : '#5C5C5C',
              fontWeight: currentStage === 'todas' ? 600 : undefined,
            }}
          >
            Todas
          </button>
          {stageKeys.map((key, i) => (
            <button
              key={key}
              onClick={() => { setCurrentStage(key); setEditingId(null) }}
              className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium mb-0.5 transition-colors"
              style={{
                background: currentStage === key ? '#2E9E8F' : undefined,
                color: currentStage === key ? '#fff' : '#5C5C5C',
                fontWeight: currentStage === key ? 600 : undefined,
              }}
            >
              <span
                className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[0.7rem] font-bold mr-2"
                style={{
                  background: currentStage === key ? 'rgba(255,255,255,0.3)' : '#e0f5f1',
                  color: currentStage === key ? '#fff' : '#1A7A6D',
                }}
              >
                {i + 1}
              </span>
              {stageLabels[key]}
            </button>
          ))}

          {/* Add new stage button */}
          {showNewStage ? (
            <div className="mt-3 p-2 border rounded-lg" style={{ borderColor: '#E5DFD3' }}>
              <input
                type="text"
                value={newStageName}
                onChange={e => setNewStageName(e.target.value)}
                placeholder="Nome da etapa"
                className="w-full px-2 py-1.5 text-sm border rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-[#2E9E8F]/20"
                style={{ borderColor: '#E5DFD3' }}
                autoFocus
                onKeyDown={e => e.key === 'Enter' && createStage()}
              />
              <div className="flex gap-1">
                <button onClick={createStage} className="flex-1 px-2 py-1 rounded-md text-xs font-semibold text-white" style={{ background: '#2E9E8F' }}>Criar</button>
                <button onClick={() => { setShowNewStage(false); setNewStageName('') }} className="flex-1 px-2 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-500">Cancelar</button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowNewStage(true)}
              className="block w-full text-left px-3 py-2 mt-2 rounded-lg text-sm font-medium transition-colors border border-dashed"
              style={{ color: '#2E9E8F', borderColor: '#2E9E8F' }}
            >
              + Nova etapa
            </button>
          )}
        </aside>

        {/* Templates area */}
        <main className="p-6 overflow-y-auto">
          {(() => {
            let hasContent = false
            const sections = stageKeys.map((stageKey, i) => {
              if (currentStage !== 'todas' && currentStage !== stageKey) return null
              const stageTpls = regularTemplates.filter(t => t.stage === stageKey)
              if (!stageTpls.length) return null
              hasContent = true

              return (
                <div key={stageKey} className="mb-8">
                  <h2 className="font-fraunces text-base font-semibold flex items-center gap-2 pb-2 mb-4 border-b" style={{ color: '#1A1A1A', borderColor: '#E5DFD3' }}>
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold" style={{ background: '#e0f5f1', color: '#1A7A6D' }}>{i + 1}</span>
                    {stageLabels[stageKey]}
                  </h2>

                  {stageTpls.map(tpl => (
                    <div key={tpl.id} className="bg-white border rounded-xl p-4 mb-3 transition-shadow hover:shadow-md" style={{ borderColor: '#E5DFD3' }}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold" style={{ color: '#1A1A1A' }}>{tpl.title}</span>
                      </div>

                      {editingId === tpl.id ? (
                        <>
                          <p className="text-xs mb-2" style={{ color: '#5C5C5C' }}>Use &#123;nome&#125; e &#123;vendedor&#125; como variáveis. O texto será substituído ao copiar.</p>
                          <textarea
                            value={editText}
                            onChange={e => setEditText(e.target.value)}
                            className="w-full min-h-[120px] px-4 py-3 text-sm leading-relaxed border-2 rounded-xl bg-white resize-y focus:outline-none mb-3"
                            style={{ borderColor: '#2E9E8F' }}
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <button onClick={() => saveTemplate(tpl.id, editText)} className="px-4 py-2 rounded-full text-xs font-semibold text-white transition-all hover:-translate-y-0.5" style={{ background: '#2E9E8F' }}>Salvar</button>
                            <button onClick={() => setEditingId(null)} className="px-4 py-2 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">Cancelar</button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-sm leading-relaxed whitespace-pre-wrap break-words rounded-xl px-4 py-3 mb-3" style={{ background: '#F0FAF8', border: '1px solid #E5DFD3', color: '#444' }}>
                            {replaceVars(tpl.body)}
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <button onClick={() => copyTemplate(tpl.id)} className="px-4 py-2 rounded-full text-xs font-semibold text-white transition-all hover:-translate-y-0.5" style={{ background: '#2E9E8F' }}>Copiar</button>
                            <button onClick={() => { setEditingId(tpl.id); setEditText(tpl.body) }} className="px-4 py-2 rounded-full text-xs font-semibold transition-all hover:-translate-y-0.5" style={{ background: '#e0f5f1', color: '#1A7A6D' }}>Editar</button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}

                  {/* Add new script to this stage */}
                  {addingToStage === stageKey ? (
                    <div className="border border-dashed rounded-xl p-4 mb-3" style={{ borderColor: '#2E9E8F' }}>
                      <input
                        type="text"
                        value={newScriptTitle}
                        onChange={e => setNewScriptTitle(e.target.value)}
                        placeholder="Título do novo script"
                        className="w-full px-3 py-2 text-sm border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-[#2E9E8F]/20"
                        style={{ borderColor: '#E5DFD3' }}
                        autoFocus
                        onKeyDown={e => e.key === 'Enter' && newScriptTitle.trim() && createTemplate(stageKey, newScriptTitle)}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => newScriptTitle.trim() && createTemplate(stageKey, newScriptTitle)}
                          className="px-4 py-2 rounded-full text-xs font-semibold text-white"
                          style={{ background: '#2E9E8F' }}
                        >
                          Criar script
                        </button>
                        <button
                          onClick={() => { setAddingToStage(null); setNewScriptTitle('') }}
                          className="px-4 py-2 rounded-full text-xs font-semibold bg-gray-100 text-gray-500"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAddingToStage(stageKey)}
                      className="w-full border border-dashed rounded-xl py-3 text-sm font-medium transition-colors hover:bg-[#F0FAF8]"
                      style={{ color: '#2E9E8F', borderColor: '#2E9E8F' }}
                    >
                      + Novo script
                    </button>
                  )}

                  {/* Link to pagamentos on payment/proposal stages */}
                  {((currentFlow === 'terapia' && stageKey === 'pagamento') ||
                    (currentFlow === 'avaliacao_neuro' && stageKey === 'proposta')) && (
                    <a href="/painel/pagamentos" className="inline-flex items-center gap-1 mt-3 px-4 py-2.5 rounded-full text-sm font-semibold transition-all hover:-translate-y-0.5" style={{ background: '#E8F5F2', color: '#1A7A6D' }}>
                      Gerar link de pagamento (Stripe) &rarr;
                    </a>
                  )}
                </div>
              )
            })

            if (!hasContent) {
              return <p className="text-center py-8 text-sm" style={{ color: '#5C5C5C' }}>Nenhum template nesta etapa.</p>
            }
            return sections
          })()}
        </main>

        {/* Objections panel */}
        <aside className="bg-white border-l border-t md:border-t-0 p-4 overflow-y-auto" style={{ borderColor: '#E5DFD3' }}>
          <h3 className="font-fraunces text-xs uppercase tracking-wide font-semibold mb-3" style={{ color: '#5C5C5C' }}>Objeções</h3>

          {objections.length === 0 ? (
            <p className="text-sm" style={{ color: '#5C5C5C' }}>Nenhuma objeção para este fluxo.</p>
          ) : objections.map(obj => (
            <div key={obj.id} className="mb-2 border rounded-xl overflow-hidden" style={{ borderColor: '#E5DFD3' }}>
              <button
                onClick={() => toggleObj(obj.id)}
                className="w-full flex justify-between items-center px-3 py-3 text-left text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                <span>{obj.title}</span>
                <span className="text-xs transition-transform" style={{ color: '#5C5C5C', transform: openObjIds.has(obj.id) ? 'rotate(90deg)' : 'none' }}>&#9654;</span>
              </button>

              {openObjIds.has(obj.id) && (
                <div className="px-3 pb-3">
                  {editingObjId === obj.id ? (
                    <>
                      <p className="text-xs mb-2" style={{ color: '#5C5C5C' }}>Use &#123;nome&#125; e &#123;vendedor&#125; como variáveis.</p>
                      <textarea
                        value={editObjText}
                        onChange={e => setEditObjText(e.target.value)}
                        className="w-full min-h-[100px] px-3 py-2 text-sm leading-relaxed border-2 rounded-xl bg-white resize-y focus:outline-none mb-2"
                        style={{ borderColor: '#2E9E8F' }}
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button onClick={() => saveTemplate(obj.id, editObjText)} className="px-3 py-1.5 rounded-full text-xs font-semibold text-white" style={{ background: '#2E9E8F' }}>Salvar</button>
                        <button onClick={() => setEditingObjId(null)} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">Cancelar</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-xs leading-relaxed whitespace-pre-wrap break-words rounded-lg px-3 py-2 mb-2" style={{ background: '#F0FAF8', border: '1px solid #E5DFD3', color: '#555' }}>
                        {replaceVars(obj.body)}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => copyTemplate(obj.id)} className="px-3 py-1.5 rounded-full text-xs font-semibold text-white" style={{ background: '#2E9E8F' }}>Copiar</button>
                        <button onClick={() => { setEditingObjId(obj.id); setEditObjText(obj.body); if (!openObjIds.has(obj.id)) toggleObj(obj.id) }} className="px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: '#e0f5f1', color: '#1A7A6D' }}>Editar</button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </aside>
      </div>

      {/* Reset bar */}
      <div className="text-right px-6 py-2 bg-white border-t" style={{ borderColor: '#E5DFD3' }}>
        <button onClick={resetAll} className="text-xs font-medium px-3 py-1.5 border rounded-full bg-white hover:bg-red-50 transition-colors" style={{ color: '#a44', borderColor: '#e0c8c8' }}>
          Restaurar todos os textos originais
        </button>
      </div>

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-xl text-sm font-medium text-white shadow-lg transition-all" style={{ background: '#1A7A6D' }}>
          {toastMsg}
        </div>
      )}
    </div>
  )
}
