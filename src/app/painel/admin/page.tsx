'use client'
import React, { useState, useEffect, useCallback } from 'react'

// ── Types ──────────────────────────────────────────────────────────
interface LinkItem {
  id: number
  slug: string
  campaign_id: number
  campaign_name: string
  campaign_channel: string
  campaign_strategy: string
  description: string
  wa_message: string
  active: boolean | number
  total_clicks: number
  last_click: string | null
}

interface Campaign {
  id: number
  name: string
  channel: string
  strategy: string
  active_links: number
  total_clicks: number
}

interface CampaignLink {
  id: number
  slug: string
  description: string
  wa_message: string
  active: boolean | number
  total_clicks: number
  last_click: string | null
}

interface AnalyticsSummary {
  total_clicks: number
  clicks_today: number
  clicks_week: number
  top_link: { slug: string; clicks: number } | null
}

interface ByCampaign {
  name: string
  channel: string
  clicks: number
}

// ── Helpers ────────────────────────────────────────────────────────
const CHANNELS = ['Instagram', 'Facebook', 'Google Ads', 'Panfleto', 'Indicação', 'Email', 'LinkedIn', 'Outro'] as const

function channelBadgeClasses(ch: string): string {
  const m: Record<string, string> = {
    Instagram: 'bg-pink-100 text-pink-700',
    Facebook: 'bg-blue-100 text-blue-700',
    'Google Ads': 'bg-orange-100 text-orange-700',
    Panfleto: 'bg-purple-100 text-purple-700',
    'Indicação': 'bg-teal-100 text-teal-700',
    Email: 'bg-yellow-100 text-yellow-700',
    LinkedIn: 'bg-indigo-100 text-indigo-700',
  }
  return m[ch] || 'bg-gray-100 text-gray-600'
}

function fmtDate(d: string): string {
  const dt = new Date(d), now = new Date(), diff = now.getTime() - dt.getTime(), min = Math.floor(diff / 60000)
  if (min < 1) return 'agora'
  if (min < 60) return min + 'min'
  const h = Math.floor(diff / 3600000)
  if (h < 24) return h + 'h'
  const days = Math.floor(diff / 86400000)
  if (days < 7) return days + 'd'
  return dt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

function isActive(v: boolean | number): boolean {
  return v === true || v === 1
}

// ── Component ──────────────────────────────────────────────────────
export default function AdminPage() {
  const [tab, setTab] = useState<'links' | 'campanhas'>('links')
  const [links, setLinks] = useState<LinkItem[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [period, setPeriod] = useState('all')
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null)
  const [byCampaign, setByCampaign] = useState<ByCampaign[]>([])
  const [toastMsg, setToastMsg] = useState('')

  // Modals
  const [linkModal, setLinkModal] = useState(false)
  const [campaignModal, setCampaignModal] = useState(false)
  const [detailModal, setDetailModal] = useState(false)

  // Link form
  const [linkEditId, setLinkEditId] = useState<number | null>(null)
  const [fSlug, setFSlug] = useState('')
  const [fCampaignId, setFCampaignId] = useState('')
  const [fDesc, setFDesc] = useState('')
  const [fMsg, setFMsg] = useState('')

  // Campaign form
  const [campEditId, setCampEditId] = useState<number | null>(null)
  const [fCName, setFCName] = useState('')
  const [fChannel, setFChannel] = useState('')
  const [fStrategy, setFStrategy] = useState('')

  // Detail
  const [detailLink, setDetailLink] = useState<LinkItem | null>(null)

  // Expanded campaigns
  const [expandedCamp, setExpandedCamp] = useState<Record<number, CampaignLink[] | null>>({})

  const toast = useCallback((msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2500)
  }, [])

  const BASE = typeof window !== 'undefined' ? window.location.origin : ''

  // ── Data loading ─────────────────────────────────────────────────
  const loadLinks = useCallback(async () => {
    try {
      const r = await fetch('/api/painel/links')
      if (!r.ok) return
      const data = await r.json()
      setLinks(data)
    } catch (e) { console.error(e) }
  }, [])

  const loadCampaigns = useCallback(async () => {
    try {
      const r = await fetch('/api/painel/campaigns')
      if (!r.ok) return
      const data = await r.json()
      setCampaigns(data)
    } catch (e) { console.error(e) }
  }, [])

  const loadAnalytics = useCallback(async (p: string) => {
    try {
      const [r1, r2] = await Promise.all([
        fetch('/api/painel/analytics/summary?period=' + p),
        fetch('/api/painel/analytics/by-campaign?period=' + p),
      ])
      if (r1.ok) setSummary(await r1.json())
      if (r2.ok) setByCampaign(await r2.json())
    } catch (e) { console.error(e) }
  }, [])

  useEffect(() => {
    loadLinks()
    loadCampaigns()
    loadAnalytics(period)
  }, [loadLinks, loadCampaigns, loadAnalytics, period])

  // ── Link CRUD ────────────────────────────────────────────────────
  function openLinkModal(link?: LinkItem) {
    setLinkEditId(link ? link.id : null)
    setFSlug(link ? link.slug : '')
    setFDesc(link ? (link.description || '') : '')
    setFMsg(link ? link.wa_message : '')
    setFCampaignId(link ? String(link.campaign_id) : '')
    setLinkModal(true)
  }

  async function saveLink() {
    const slug = fSlug.trim()
    if (!slug || !/^[a-z0-9-]+$/.test(slug)) return toast('Slug inválido')
    if (!fCampaignId || !fMsg.trim()) return toast('Preencha campanha e mensagem')

    const data = { slug, campaign_id: parseInt(fCampaignId), description: fDesc.trim(), wa_message: fMsg.trim() }
    try {
      const r = await fetch(linkEditId ? '/api/painel/links/' + linkEditId : '/api/painel/links', {
        method: linkEditId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const res = await r.json()
      if (!r.ok) return toast(res.error || 'Erro')
      setLinkModal(false)
      toast(linkEditId ? 'Link atualizado!' : 'Link criado!')
      loadLinks()
    } catch { toast('Erro de conexão') }
  }

  async function deactivateLink(id: number) {
    if (!confirm('Desativar este link?')) return
    await fetch('/api/painel/links/' + id, { method: 'DELETE' })
    toast('Link desativado')
    loadLinks()
  }

  function copyLink(slug: string) {
    navigator.clipboard.writeText(BASE + '/' + slug).then(() => toast('Link copiado!'))
  }

  function showDetail(id: number) {
    const l = links.find(x => x.id === id)
    if (l) { setDetailLink(l); setDetailModal(true) }
  }

  // ── Campaign CRUD ────────────────────────────────────────────────
  function openCampaignModal(camp?: Campaign) {
    setCampEditId(camp ? camp.id : null)
    setFCName(camp ? camp.name : '')
    setFChannel(camp ? camp.channel : '')
    setFStrategy(camp ? (camp.strategy || '') : '')
    setCampaignModal(true)
  }

  async function saveCampaign() {
    if (!fCName.trim() || !fChannel) return toast('Preencha nome e canal')
    const data = { name: fCName.trim(), channel: fChannel, strategy: fStrategy.trim() }
    try {
      const r = await fetch(campEditId ? '/api/painel/campaigns/' + campEditId : '/api/painel/campaigns', {
        method: campEditId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const res = await r.json()
      if (!r.ok) return toast(res.error || 'Erro')
      setCampaignModal(false)
      toast(campEditId ? 'Campanha atualizada!' : 'Campanha criada!')
      loadCampaigns()
      loadLinks()
    } catch { toast('Erro de conexão') }
  }

  async function toggleCampaignDetail(id: number) {
    if (expandedCamp[id] !== undefined) {
      setExpandedCamp(prev => { const n = { ...prev }; delete n[id]; return n })
      return
    }
    setExpandedCamp(prev => ({ ...prev, [id]: null }))
    try {
      const r = await fetch('/api/painel/campaigns/' + id + '/links')
      const data: CampaignLink[] = await r.json()
      setExpandedCamp(prev => ({ ...prev, [id]: data }))
    } catch {
      setExpandedCamp(prev => ({ ...prev, [id]: [] }))
    }
  }

  // ── Derived ──────────────────────────────────────────────────────
  const activeCount = links.filter(l => isActive(l.active)).length

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div className="font-dm min-h-screen" style={{ background: '#FDFBF7' }}>
      {/* Tabs */}
      <div className="flex border-b-2 bg-white px-4" style={{ borderColor: '#E8E4DF' }}>
        {(['links', 'campanhas'] as const).map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); if (t === 'campanhas') loadAnalytics(period) }}
            className={`px-5 py-3 text-sm font-medium border-b-[3px] transition-colors ${tab === t ? 'font-semibold' : ''}`}
            style={{
              color: tab === t ? '#2E9E8F' : '#777',
              borderBottomColor: tab === t ? '#2E9E8F' : 'transparent',
            }}
          >
            {t === 'links' ? 'Links' : 'Campanhas + Analytics'}
          </button>
        ))}
      </div>

      {/* ═══ LINKS TAB ═══ */}
      {tab === 'links' && (
        <div className="max-w-[1100px] mx-auto p-6">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <h2 className="text-base font-semibold">Links de rastreamento</h2>
            <div className="flex items-center gap-3">
              <span className="text-xs px-3 py-1 rounded-full bg-white/80" style={{ color: '#777' }}>
                {activeCount} link{activeCount !== 1 ? 's' : ''} ativo{activeCount !== 1 ? 's' : ''}
              </span>
              <button onClick={() => openLinkModal()} className="inline-flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: '#2E9E8F' }}>
                + Novo link
              </button>
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {['Link', 'Campanha', 'Descrição', 'Cliques', 'Status', 'Ações'].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left text-xs uppercase tracking-wide font-semibold whitespace-nowrap" style={{ background: '#e0f5f1', color: '#1A7A6D' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {links.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-sm" style={{ color: '#777' }}>Nenhum link criado. Clique em &quot;+ Novo link&quot;.</td></tr>
                ) : links.map(l => (
                  <tr key={l.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2.5 border-b" style={{ borderColor: '#E8E4DF' }}>
                      <span
                        onClick={() => copyLink(l.slug)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md font-mono text-xs cursor-pointer hover:opacity-80"
                        style={{ background: '#e0f5f1', color: '#1A7A6D' }}
                        title="Clique para copiar"
                      >
                        &#128203; {BASE}/{l.slug}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 border-b" style={{ borderColor: '#E8E4DF' }}>
                      <span className={`inline-block px-2 py-0.5 rounded-xl text-xs font-semibold ${channelBadgeClasses(l.campaign_channel)}`}>
                        {l.campaign_channel || '-'}
                      </span>
                      <br />
                      <small className="text-xs" style={{ color: '#777' }}>{l.campaign_name || '-'}</small>
                    </td>
                    <td className="px-3 py-2.5 border-b text-sm" style={{ borderColor: '#E8E4DF' }}>{l.description || '-'}</td>
                    <td className="px-3 py-2.5 border-b text-sm" style={{ borderColor: '#E8E4DF' }}>
                      <strong>{l.total_clicks}</strong>
                      {l.last_click && <><br /><small style={{ color: '#777' }}>{fmtDate(l.last_click)}</small></>}
                    </td>
                    <td className="px-3 py-2.5 border-b" style={{ borderColor: '#E8E4DF' }}>
                      <span className={`inline-block px-2 py-0.5 rounded-xl text-xs font-semibold ${isActive(l.active) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {isActive(l.active) ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 border-b whitespace-nowrap" style={{ borderColor: '#E8E4DF' }}>
                      <button onClick={() => showDetail(l.id)} className="p-1 rounded-md hover:bg-teal-50 text-gray-400 hover:text-teal-600" title="Detalhes">&#128269;</button>
                      <button onClick={() => openLinkModal(l)} className="p-1 rounded-md hover:bg-teal-50 text-gray-400 hover:text-teal-600" title="Editar">&#9998;</button>
                      {isActive(l.active) && (
                        <button onClick={() => deactivateLink(l.id)} className="p-1 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500" title="Desativar">&#10060;</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══ CAMPANHAS + ANALYTICS TAB ═══ */}
      {tab === 'campanhas' && (
        <div className="max-w-[1100px] mx-auto p-6">
          {/* Summary toolbar */}
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <h2 className="text-base font-semibold">Resumo</h2>
            <div className="flex gap-1 flex-wrap">
              {[{ k: 'today', l: 'Hoje' }, { k: '7d', l: '7 dias' }, { k: '30d', l: '30 dias' }, { k: 'all', l: 'Tudo' }].map(p => (
                <button
                  key={p.k}
                  onClick={() => setPeriod(p.k)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${period === p.k ? 'text-white' : 'bg-white'}`}
                  style={{
                    background: period === p.k ? '#2E9E8F' : undefined,
                    borderColor: period === p.k ? '#2E9E8F' : '#E8E4DF',
                    color: period === p.k ? '#fff' : undefined,
                  }}
                >
                  {p.l}
                </button>
              ))}
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { val: summary?.total_clicks ?? '-', lbl: 'Total de cliques' },
              { val: summary?.clicks_today ?? '-', lbl: 'Cliques hoje' },
              { val: summary?.clicks_week ?? '-', lbl: 'Esta semana' },
              { val: summary?.top_link?.clicks ?? '-', lbl: summary?.top_link ? '/' + summary.top_link.slug : 'Link mais clicado' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-3xl font-bold" style={{ color: '#2E9E8F' }}>{s.val}</div>
                <div className="text-xs mt-1" style={{ color: '#777' }}>{s.lbl}</div>
              </div>
            ))}
          </div>

          {/* Bar chart */}
          <h3 className="text-sm font-semibold mb-3 mt-5">Cliques por campanha</h3>
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            {byCampaign.length === 0 || byCampaign.every(c => Number(c.clicks) === 0) ? (
              <div className="text-center py-4 text-sm" style={{ color: '#777' }}>Sem dados para o período.</div>
            ) : (() => {
              const max = Math.max(...byCampaign.map(c => Number(c.clicks)), 1)
              return byCampaign.map((c, i) => {
                const clicks = Number(c.clicks)
                const pct = Math.max((clicks / max) * 100, clicks > 0 ? 4 : 0)
                return (
                  <div key={i} className="flex items-center gap-3 mb-2">
                    <div className="min-w-[110px] text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                      <span className={`inline-block px-2 py-0.5 rounded-xl text-xs font-semibold mr-1 ${channelBadgeClasses(c.channel)}`}>{c.channel}</span>
                      {c.name}
                    </div>
                    <div className="flex-1 h-[22px] rounded-md overflow-hidden" style={{ background: '#e0f5f1' }}>
                      <div className="h-full rounded-md flex items-center justify-end pr-1 text-xs text-white font-semibold transition-all duration-300" style={{ background: '#2E9E8F', width: pct + '%' }}>
                        {clicks > 0 ? clicks : ''}
                      </div>
                    </div>
                    <div className="min-w-[35px] text-right text-sm font-semibold">{clicks}</div>
                  </div>
                )
              })
            })()}
          </div>

          {/* Campaigns table */}
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2 mt-6">
            <h2 className="text-base font-semibold">Campanhas</h2>
            <button onClick={() => openCampaignModal()} className="inline-flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: '#2E9E8F' }}>
              + Nova campanha
            </button>
          </div>

          <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {['Nome', 'Canal', 'Estratégia', 'Links', 'Cliques', 'Ações'].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left text-xs uppercase tracking-wide font-semibold whitespace-nowrap" style={{ background: '#e0f5f1', color: '#1A7A6D' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {campaigns.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-sm" style={{ color: '#777' }}>Nenhuma campanha. Crie a primeira!</td></tr>
                ) : campaigns.map(c => (
                  <React.Fragment key={c.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 py-2.5 border-b text-sm font-semibold" style={{ borderColor: '#E8E4DF' }}>{c.name}</td>
                      <td className="px-3 py-2.5 border-b" style={{ borderColor: '#E8E4DF' }}>
                        <span className={`inline-block px-2 py-0.5 rounded-xl text-xs font-semibold ${channelBadgeClasses(c.channel)}`}>{c.channel}</span>
                      </td>
                      <td className="px-3 py-2.5 border-b text-sm max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap" style={{ borderColor: '#E8E4DF' }} title={c.strategy || ''}>
                        {c.strategy ? c.strategy.substring(0, 80) : '-'}
                      </td>
                      <td className="px-3 py-2.5 border-b text-sm" style={{ borderColor: '#E8E4DF' }}>{c.active_links}</td>
                      <td className="px-3 py-2.5 border-b text-sm font-semibold" style={{ borderColor: '#E8E4DF' }}>{c.total_clicks}</td>
                      <td className="px-3 py-2.5 border-b whitespace-nowrap" style={{ borderColor: '#E8E4DF' }}>
                        <button onClick={() => toggleCampaignDetail(c.id)} className="p-1 rounded-md hover:bg-teal-50 text-gray-400 hover:text-teal-600" title="Ver links">
                          {expandedCamp[c.id] !== undefined ? '\u25B2' : '\u25BC'}
                        </button>
                        <button onClick={() => openCampaignModal(c)} className="p-1 rounded-md hover:bg-teal-50 text-gray-400 hover:text-teal-600" title="Editar">&#9998;</button>
                      </td>
                    </tr>
                    {expandedCamp[c.id] !== undefined && (
                      <tr>
                        <td colSpan={6} className="p-4" style={{ background: '#f9fafb' }}>
                          {expandedCamp[c.id] === null ? (
                            <em style={{ color: '#777' }}>Carregando...</em>
                          ) : expandedCamp[c.id]!.length === 0 ? (
                            <p style={{ color: '#777' }}>Nenhum link nesta campanha.</p>
                          ) : (
                            <>
                              <div className="mb-3 text-sm"><strong>Estratégia:</strong> {c.strategy || 'Não definida'}</div>
                              {expandedCamp[c.id]!.map(l => (
                                <div key={l.id} className="border rounded-xl p-4 mb-2" style={{ background: '#f9fafb', borderColor: '#E8E4DF' }}>
                                  <div className="text-xs uppercase tracking-wide font-semibold mb-1" style={{ color: '#777' }}>Link</div>
                                  <span
                                    onClick={() => copyLink(l.slug)}
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md font-mono text-xs cursor-pointer hover:opacity-80 mb-2"
                                    style={{ background: '#e0f5f1', color: '#1A7A6D' }}
                                  >
                                    &#128203; {BASE}/{l.slug}
                                  </span>
                                  <div className="text-xs uppercase tracking-wide font-semibold mb-1 mt-2" style={{ color: '#777' }}>Descrição</div>
                                  <div className="text-sm mb-2">{l.description || '-'}</div>
                                  <div className="flex gap-4 text-sm mb-2">
                                    <div><span className="text-xs uppercase tracking-wide font-semibold" style={{ color: '#777' }}>Cliques:</span> <strong>{l.total_clicks}</strong></div>
                                    <div><span className="text-xs uppercase tracking-wide font-semibold" style={{ color: '#777' }}>Último:</span> {l.last_click ? fmtDate(l.last_click) : '-'}</div>
                                    <span className={`inline-block px-2 py-0.5 rounded-xl text-xs font-semibold ${isActive(l.active) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                      {isActive(l.active) ? 'Ativo' : 'Inativo'}
                                    </span>
                                  </div>
                                  <div className="text-xs uppercase tracking-wide font-semibold mb-1" style={{ color: '#777' }}>Mensagem WhatsApp</div>
                                  <div className="rounded-xl px-3 py-2 text-sm whitespace-pre-wrap break-words shadow-sm" style={{ background: '#dcf8c6' }}>{l.wa_message}</div>
                                </div>
                              ))}
                            </>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══ LINK MODAL ═══ */}
      {linkModal && (
        <div className="fixed inset-0 z-[100] flex justify-center items-start pt-8 px-4 overflow-y-auto" style={{ background: 'rgba(0,0,0,0.45)' }} onClick={e => { if (e.target === e.currentTarget) setLinkModal(false) }}>
          <div className="bg-white rounded-xl w-full max-w-[520px] shadow-2xl animate-in fade-in slide-in-from-top-2">
            <div className="flex justify-between items-center px-5 py-4 border-b" style={{ borderColor: '#E8E4DF' }}>
              <h2 className="text-base font-semibold">{linkEditId ? 'Editar link' : 'Novo link'}</h2>
              <button onClick={() => setLinkModal(false)} className="text-gray-400 hover:text-gray-600 text-lg">&times;</button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Slug</label>
                <input
                  type="text"
                  value={fSlug}
                  onChange={e => setFSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="ex: consulta-ig"
                  className="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: '#E8E4DF', '--tw-ring-color': 'rgba(46,158,143,0.3)' } as React.CSSProperties}
                />
                <p className="text-xs mt-1" style={{ color: '#777' }}>Apenas letras minúsculas, números e hífen. Link: <strong>{fSlug ? BASE + '/' + fSlug : '...'}</strong></p>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Campanha</label>
                <select
                  value={fCampaignId}
                  onChange={e => setFCampaignId(e.target.value)}
                  className="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: '#E8E4DF' }}
                >
                  <option value="">Selecione...</option>
                  {campaigns.map(c => <option key={c.id} value={c.id}>{c.name} ({c.channel})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Descrição interna</label>
                <input
                  type="text"
                  value={fDesc}
                  onChange={e => setFDesc(e.target.value)}
                  placeholder="ex: Link principal do Instagram"
                  className="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: '#E8E4DF' }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Mensagem de WhatsApp</label>
                <textarea
                  value={fMsg}
                  onChange={e => setFMsg(e.target.value)}
                  rows={3}
                  placeholder="A mensagem que o lead vai enviar..."
                  className="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 resize-y"
                  style={{ borderColor: '#E8E4DF' }}
                />
                <p className="text-xs mt-1" style={{ color: '#777' }}>Preview — o lead vai enviar exatamente isso:</p>
                <div className="mt-1 rounded-xl px-3 py-2 text-sm whitespace-pre-wrap break-words shadow-sm relative" style={{ background: '#dcf8c6' }}>
                  {fMsg || '...'}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-5 py-4 border-t" style={{ borderColor: '#E8E4DF' }}>
              <button onClick={() => setLinkModal(false)} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: '#e0f5f1', color: '#1A7A6D' }}>Cancelar</button>
              <button onClick={saveLink} className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: '#2E9E8F' }}>Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ CAMPAIGN MODAL ═══ */}
      {campaignModal && (
        <div className="fixed inset-0 z-[100] flex justify-center items-start pt-8 px-4 overflow-y-auto" style={{ background: 'rgba(0,0,0,0.45)' }} onClick={e => { if (e.target === e.currentTarget) setCampaignModal(false) }}>
          <div className="bg-white rounded-xl w-full max-w-[520px] shadow-2xl">
            <div className="flex justify-between items-center px-5 py-4 border-b" style={{ borderColor: '#E8E4DF' }}>
              <h2 className="text-base font-semibold">{campEditId ? 'Editar campanha' : 'Nova campanha'}</h2>
              <button onClick={() => setCampaignModal(false)} className="text-gray-400 hover:text-gray-600 text-lg">&times;</button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Nome da campanha</label>
                <input type="text" value={fCName} onChange={e => setFCName(e.target.value)} placeholder="ex: Captação Instagram Março 2026" className="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none" style={{ borderColor: '#E8E4DF' }} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Canal</label>
                <select value={fChannel} onChange={e => setFChannel(e.target.value)} className="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none" style={{ borderColor: '#E8E4DF' }}>
                  <option value="">Selecione...</option>
                  {CHANNELS.map(ch => <option key={ch} value={ch}>{ch}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Estratégia de divulgação</label>
                <textarea value={fStrategy} onChange={e => setFStrategy(e.target.value)} rows={3} placeholder="Descreva a estratégia..." className="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none resize-y" style={{ borderColor: '#E8E4DF' }} />
              </div>
            </div>
            <div className="flex justify-end gap-2 px-5 py-4 border-t" style={{ borderColor: '#E8E4DF' }}>
              <button onClick={() => setCampaignModal(false)} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: '#e0f5f1', color: '#1A7A6D' }}>Cancelar</button>
              <button onClick={saveCampaign} className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: '#2E9E8F' }}>Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ DETAIL MODAL ═══ */}
      {detailModal && detailLink && (
        <div className="fixed inset-0 z-[100] flex justify-center items-start pt-8 px-4 overflow-y-auto" style={{ background: 'rgba(0,0,0,0.45)' }} onClick={e => { if (e.target === e.currentTarget) setDetailModal(false) }}>
          <div className="bg-white rounded-xl w-full max-w-[520px] shadow-2xl">
            <div className="flex justify-between items-center px-5 py-4 border-b" style={{ borderColor: '#E8E4DF' }}>
              <h2 className="text-base font-semibold">Detalhes do link</h2>
              <button onClick={() => setDetailModal(false)} className="text-gray-400 hover:text-gray-600 text-lg">&times;</button>
            </div>
            <div className="p-5">
              <div className="border rounded-xl p-4" style={{ background: '#f9fafb', borderColor: '#E8E4DF' }}>
                {[
                  { label: 'Link', content: (
                    <span onClick={() => copyLink(detailLink.slug)} className="inline-flex items-center gap-1 px-2 py-1 rounded-md font-mono text-xs cursor-pointer hover:opacity-80" style={{ background: '#e0f5f1', color: '#1A7A6D' }}>
                      &#128203; {BASE}/{detailLink.slug}
                    </span>
                  )},
                  { label: 'Campanha', content: <span className="text-sm">{detailLink.campaign_name || '-'}</span> },
                  { label: 'Canal', content: <span className={`inline-block px-2 py-0.5 rounded-xl text-xs font-semibold ${channelBadgeClasses(detailLink.campaign_channel)}`}>{detailLink.campaign_channel || '-'}</span> },
                  { label: 'Estratégia', content: <span className="text-sm">{detailLink.campaign_strategy || 'Não definida'}</span> },
                  { label: 'Mensagem no WhatsApp', content: (
                    <div className="mt-1 rounded-xl px-3 py-2 text-sm whitespace-pre-wrap break-words shadow-sm" style={{ background: '#dcf8c6' }}>{detailLink.wa_message}</div>
                  )},
                ].map((item, i, arr) => (
                  <div key={i}>
                    <div className="py-2">
                      <div className="text-xs uppercase tracking-wide font-semibold" style={{ color: '#777' }}>{item.label}</div>
                      <div className="mt-1">{item.content}</div>
                    </div>
                    {i < arr.length - 1 && <div className="text-center text-sm py-0.5" style={{ color: '#2E9E8F' }}>&darr;</div>}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-white rounded-xl p-3 text-center shadow-sm border" style={{ borderColor: '#E8E4DF' }}>
                  <div className="text-2xl font-bold" style={{ color: '#2E9E8F' }}>{detailLink.total_clicks}</div>
                  <div className="text-xs" style={{ color: '#777' }}>Cliques</div>
                </div>
                <div className="bg-white rounded-xl p-3 text-center shadow-sm border" style={{ borderColor: '#E8E4DF' }}>
                  <div className="text-2xl font-bold" style={{ color: '#2E9E8F' }}>{detailLink.last_click ? fmtDate(detailLink.last_click) : '-'}</div>
                  <div className="text-xs" style={{ color: '#777' }}>Último clique</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-[999] px-5 py-3 rounded-lg text-sm text-white shadow-lg transition-all" style={{ background: '#1a1a2e' }}>
          {toastMsg}
        </div>
      )}
    </div>
  )
}

