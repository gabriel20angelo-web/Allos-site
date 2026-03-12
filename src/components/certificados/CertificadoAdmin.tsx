'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Atividade { id: string; nome: string; ativo: boolean }
interface Condutor { id: string; nome: string; ativo: boolean }
interface CondutorStat { nome: string; totalNotas: number; somaNotas: number; feedbacks: number }
interface Submission {
  id: string
  nome_completo: string
  nome_social: string | null
  email: string
  atividade_nome: string
  nota_grupo: number | null
  condutores_nomes: string[]
  nota_condutor: number | null
  relato: string | null
  criado_em: string
}

type Tab = 'dashboard' | 'gestao' | 'condutores' | 'envios'
type Period = 'day' | 'week' | 'month' | 'quarter' | 'semester' | 'year'

const PERIOD_LABELS: Record<Period, string> = {
  day: 'Dia', week: 'Semana', month: 'Mês', quarter: 'Trimestre', semester: 'Semestre', year: 'Ano'
}

function getDateRange(period: Period): { from: string; to: string } {
  const now = new Date()
  const to = now.toISOString().split('T')[0]
  const d = new Date(now)
  switch (period) {
    case 'day': break
    case 'week': d.setDate(d.getDate() - 7); break
    case 'month': d.setMonth(d.getMonth() - 1); break
    case 'quarter': d.setMonth(d.getMonth() - 3); break
    case 'semester': d.setMonth(d.getMonth() - 6); break
    case 'year': d.setFullYear(d.getFullYear() - 1); break
  }
  return { from: d.toISOString().split('T')[0], to }
}

function Stars({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <svg key={s} width="14" height="14" viewBox="0 0 24 24"
          fill={s <= value ? '#C84B31' : 'none'}
          stroke={s <= value ? '#C84B31' : 'rgba(253,251,247,0.2)'}
          strokeWidth="1.5">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

export default function CertificadoAdmin() {
  const [tab, setTab] = useState<Tab>('dashboard')
  const [period, setPeriod] = useState<Period>('month')
  const [loading, setLoading] = useState(true)

  // Dashboard data
  const [totalSubmissions, setTotalSubmissions] = useState(0)
  const [certCount, setCertCount] = useState(0)
  const [condutorStats, setCondutorStats] = useState<Record<string, CondutorStat>>({})
  const [dailyCounts, setDailyCounts] = useState<Record<string, number>>({})
  const [submissions, setSubmissions] = useState<Submission[]>([])

  // Management data
  const [atividades, setAtividades] = useState<Atividade[]>([])
  const [condutores, setCondutores] = useState<Condutor[]>([])
  const [newAtividade, setNewAtividade] = useState('')
  const [newCondutor, setNewCondutor] = useState('')
  const [selectedCondutor, setSelectedCondutor] = useState<string | null>(null)
  const [condutorFeedbacks, setCondutorFeedbacks] = useState<Submission[]>([])

  const loadDashboard = useCallback(async () => {
    setLoading(true)
    const range = getDateRange(period)
    try {
      const res = await fetch(`/api/certificados/dashboard?from=${range.from}&to=${range.to}`)
      const data = await res.json()
      setTotalSubmissions(data.totalSubmissions || 0)
      setCertCount(data.certCount || 0)
      setCondutorStats(data.condutorStats || {})
      setDailyCounts(data.dailyCounts || {})
      setSubmissions(data.submissions || [])
      setAtividades(data.atividades || [])
      setCondutores(data.condutores || [])
    } catch { /* ignore */ }
    setLoading(false)
  }, [period])

  useEffect(() => { loadDashboard() }, [loadDashboard])

  const loadCondutorFeedbacks = async (condutorId: string) => {
    setSelectedCondutor(condutorId)
    try {
      const res = await fetch(`/api/certificados/submissions?condutor_id=${condutorId}&limit=100`)
      const data = await res.json()
      setCondutorFeedbacks(data.data || [])
    } catch { /* ignore */ }
  }

  const handleAddAtividade = async () => {
    if (!newAtividade.trim()) return
    await fetch('/api/certificados/atividades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create', nome: newAtividade.trim() }),
    })
    setNewAtividade('')
    loadDashboard()
  }

  const handleToggleAtividade = async (id: string, ativo: boolean, nome: string) => {
    await fetch('/api/certificados/atividades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', id, ativo: !ativo, nome }),
    })
    loadDashboard()
  }

  const handleAddCondutor = async () => {
    if (!newCondutor.trim()) return
    await fetch('/api/certificados/condutores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create', nome: newCondutor.trim() }),
    })
    setNewCondutor('')
    loadDashboard()
  }

  const handleToggleCondutor = async (id: string, ativo: boolean, nome: string) => {
    await fetch('/api/certificados/condutores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', id, ativo: !ativo, nome }),
    })
    loadDashboard()
  }

  // Sorted conductor rankings
  const sortedCondutors = Object.entries(condutorStats)
    .map(([id, s]) => ({ id, ...s, media: s.totalNotas > 0 ? s.somaNotas / s.totalNotas : 0 }))
    .sort((a, b) => b.media - a.media)

  const mostFeedbacks = Object.entries(condutorStats)
    .map(([id, s]) => ({ id, ...s }))
    .sort((a, b) => b.feedbacks - a.feedbacks)

  const cardStyle = {
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '16px',
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'gestao', label: 'Atividades' },
    { key: 'condutores', label: 'Condutores' },
    { key: 'envios', label: 'Envios' },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(145deg, #1A1A1A 0%, #111111 40%, #1A1714 100%)' }}>
      {/* Grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[.03]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

      {/* Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top right, rgba(200,75,49,0.06) 0%, transparent 65%)' }} />

      <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(rgba(253,251,247,0.4) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="font-dm text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full inline-block mb-3"
              style={{ backgroundColor: 'rgba(200,75,49,0.1)', color: '#C84B31', border: '1px solid rgba(200,75,49,0.2)' }}>
              Admin
            </span>
            <h1 className="font-fraunces text-2xl md:text-3xl font-bold" style={{ color: 'rgba(253,251,247,0.95)' }}>
              Painel de Certificados
            </h1>
          </div>
          <button
            onClick={() => { sessionStorage.removeItem('cert_admin'); window.location.reload() }}
            className="font-dm text-sm px-4 py-2 rounded-lg transition-colors"
            style={{ color: 'rgba(253,251,247,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            Sair
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 p-1 rounded-xl overflow-x-auto" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="font-dm text-sm px-5 py-2.5 rounded-lg transition-all duration-200 whitespace-nowrap"
              style={{
                backgroundColor: tab === t.key ? 'rgba(200,75,49,0.15)' : 'transparent',
                color: tab === t.key ? '#C84B31' : 'rgba(253,251,247,0.4)',
                fontWeight: tab === t.key ? 600 : 400,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#C84B31] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {/* ====== DASHBOARD TAB ====== */}
            {tab === 'dashboard' && (
              <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Period filter */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {(Object.keys(PERIOD_LABELS) as Period[]).map(p => (
                    <button
                      key={p}
                      onClick={() => setPeriod(p)}
                      className="font-dm text-xs px-4 py-2 rounded-full transition-all"
                      style={{
                        backgroundColor: period === p ? 'rgba(200,75,49,0.15)' : 'rgba(255,255,255,0.03)',
                        border: period === p ? '1px solid rgba(200,75,49,0.4)' : '1px solid rgba(255,255,255,0.06)',
                        color: period === p ? '#C84B31' : 'rgba(253,251,247,0.4)',
                      }}
                    >
                      {PERIOD_LABELS[p]}
                    </button>
                  ))}
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="p-6" style={cardStyle}>
                    <p className="font-dm text-xs uppercase tracking-widest mb-1" style={{ color: 'rgba(253,251,247,0.3)' }}>Formulários enviados</p>
                    <p className="font-fraunces text-3xl font-bold" style={{ color: '#C84B31' }}>{totalSubmissions}</p>
                  </div>
                  <div className="p-6" style={cardStyle}>
                    <p className="font-dm text-xs uppercase tracking-widest mb-1" style={{ color: 'rgba(253,251,247,0.3)' }}>Certificados gerados</p>
                    <p className="font-fraunces text-3xl font-bold" style={{ color: 'rgba(253,251,247,0.9)' }}>{certCount}</p>
                  </div>
                  <div className="p-6" style={cardStyle}>
                    <p className="font-dm text-xs uppercase tracking-widest mb-1" style={{ color: 'rgba(253,251,247,0.3)' }}>Condutores avaliados</p>
                    <p className="font-fraunces text-3xl font-bold" style={{ color: 'rgba(253,251,247,0.9)' }}>{Object.keys(condutorStats).length}</p>
                  </div>
                </div>

                {/* Daily chart (simple bar) */}
                {Object.keys(dailyCounts).length > 0 && (
                  <div className="p-6 mb-8" style={cardStyle}>
                    <p className="font-dm text-sm font-medium mb-4" style={{ color: 'rgba(253,251,247,0.6)' }}>Envios por dia</p>
                    <div className="flex items-end gap-1 h-32 overflow-x-auto">
                      {Object.entries(dailyCounts).sort(([a], [b]) => a.localeCompare(b)).map(([day, count]) => {
                        const max = Math.max(...Object.values(dailyCounts))
                        const h = max > 0 ? (count / max) * 100 : 0
                        return (
                          <div key={day} className="flex flex-col items-center gap-1 flex-shrink-0" style={{ minWidth: '28px' }}>
                            <span className="font-dm text-[10px]" style={{ color: 'rgba(253,251,247,0.4)' }}>{count}</span>
                            <div className="w-5 rounded-t" style={{ height: `${Math.max(h, 4)}%`, backgroundColor: '#C84B31', opacity: 0.7 }} />
                            <span className="font-dm text-[9px] whitespace-nowrap" style={{ color: 'rgba(253,251,247,0.25)' }}>
                              {day.slice(5)}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Ranking */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="p-6" style={cardStyle}>
                    <p className="font-dm text-sm font-medium mb-4" style={{ color: 'rgba(253,251,247,0.6)' }}>Melhores avaliações</p>
                    <div className="space-y-3">
                      {sortedCondutors.slice(0, 10).map((c, i) => (
                        <button
                          key={c.id}
                          onClick={() => loadCondutorFeedbacks(c.id)}
                          className="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left"
                          style={{ backgroundColor: selectedCondutor === c.id ? 'rgba(200,75,49,0.1)' : 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
                        >
                          <span className="font-dm text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full"
                            style={{ backgroundColor: i < 3 ? 'rgba(200,75,49,0.15)' : 'rgba(255,255,255,0.05)', color: i < 3 ? '#C84B31' : 'rgba(253,251,247,0.3)' }}>
                            {i + 1}
                          </span>
                          <span className="font-dm text-sm flex-1" style={{ color: 'rgba(253,251,247,0.8)' }}>{c.nome}</span>
                          <Stars value={Math.round(c.media)} />
                          <span className="font-dm text-xs" style={{ color: 'rgba(253,251,247,0.35)' }}>{c.media.toFixed(1)}</span>
                        </button>
                      ))}
                      {sortedCondutors.length === 0 && (
                        <p className="font-dm text-sm" style={{ color: 'rgba(253,251,247,0.3)' }}>Nenhuma avaliação no período</p>
                      )}
                    </div>
                  </div>

                  <div className="p-6" style={cardStyle}>
                    <p className="font-dm text-sm font-medium mb-4" style={{ color: 'rgba(253,251,247,0.6)' }}>Mais feedbacks recebidos</p>
                    <div className="space-y-3">
                      {mostFeedbacks.slice(0, 10).map((c, i) => (
                        <button
                          key={c.id}
                          onClick={() => loadCondutorFeedbacks(c.id)}
                          className="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left"
                          style={{ backgroundColor: selectedCondutor === c.id ? 'rgba(200,75,49,0.1)' : 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
                        >
                          <span className="font-dm text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full"
                            style={{ backgroundColor: i < 3 ? 'rgba(200,75,49,0.15)' : 'rgba(255,255,255,0.05)', color: i < 3 ? '#C84B31' : 'rgba(253,251,247,0.3)' }}>
                            {i + 1}
                          </span>
                          <span className="font-dm text-sm flex-1" style={{ color: 'rgba(253,251,247,0.8)' }}>{c.nome}</span>
                          <span className="font-dm text-sm font-bold" style={{ color: '#C84B31' }}>{c.feedbacks}</span>
                          <span className="font-dm text-xs" style={{ color: 'rgba(253,251,247,0.3)' }}>feedbacks</span>
                        </button>
                      ))}
                      {mostFeedbacks.length === 0 && (
                        <p className="font-dm text-sm" style={{ color: 'rgba(253,251,247,0.3)' }}>Nenhum feedback no período</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Selected conductor feedbacks */}
                {selectedCondutor && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 mb-8" style={cardStyle}>
                    <div className="flex items-center justify-between mb-4">
                      <p className="font-dm text-sm font-medium" style={{ color: 'rgba(253,251,247,0.6)' }}>
                        Feedbacks de {condutorStats[selectedCondutor]?.nome}
                      </p>
                      <button onClick={() => setSelectedCondutor(null)} className="font-dm text-xs" style={{ color: 'rgba(253,251,247,0.3)' }}>Fechar</button>
                    </div>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {condutorFeedbacks.map(f => (
                        <div key={f.id} className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                          <div className="flex items-center gap-3 mb-2">
                            {f.nota_condutor && <Stars value={f.nota_condutor} />}
                            <span className="font-dm text-xs" style={{ color: 'rgba(253,251,247,0.3)' }}>
                              {new Date(f.criado_em).toLocaleDateString('pt-BR')}
                            </span>
                            <span className="font-dm text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(200,75,49,0.1)', color: '#C84B31' }}>
                              {f.atividade_nome}
                            </span>
                          </div>
                          {f.relato && (
                            <p className="font-dm text-sm leading-relaxed" style={{ color: 'rgba(253,251,247,0.6)' }}>
                              &ldquo;{f.relato}&rdquo;
                            </p>
                          )}
                        </div>
                      ))}
                      {condutorFeedbacks.length === 0 && (
                        <p className="font-dm text-sm" style={{ color: 'rgba(253,251,247,0.3)' }}>Nenhum feedback encontrado</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ====== ATIVIDADES TAB ====== */}
            {tab === 'gestao' && (
              <motion.div key="gestao" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="p-6 mb-6" style={cardStyle}>
                  <p className="font-dm text-sm font-medium mb-4" style={{ color: 'rgba(253,251,247,0.6)' }}>Adicionar atividade</p>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newAtividade}
                      onChange={e => setNewAtividade(e.target.value)}
                      placeholder="Nome da atividade"
                      className="font-dm flex-1 px-4 py-3 rounded-xl text-sm outline-none"
                      style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)', color: 'rgba(253,251,247,0.9)' }}
                      onKeyDown={e => e.key === 'Enter' && handleAddAtividade()}
                    />
                    <button onClick={handleAddAtividade}
                      className="font-dm text-sm font-bold px-6 py-3 rounded-xl"
                      style={{ backgroundColor: '#C84B31', color: '#fff' }}>
                      Adicionar
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {atividades.map(a => (
                    <div key={a.id} className="flex items-center gap-3 p-4 rounded-xl" style={{ ...cardStyle, opacity: a.ativo ? 1 : 0.5 }}>
                      <span className="font-dm text-sm flex-1" style={{ color: 'rgba(253,251,247,0.8)' }}>{a.nome}</span>
                      <button
                        onClick={() => handleToggleAtividade(a.id, a.ativo, a.nome)}
                        className="font-dm text-xs px-3 py-1.5 rounded-lg transition-all"
                        style={{
                          backgroundColor: a.ativo ? 'rgba(200,75,49,0.1)' : 'rgba(255,255,255,0.05)',
                          color: a.ativo ? '#C84B31' : 'rgba(253,251,247,0.4)',
                          border: a.ativo ? '1px solid rgba(200,75,49,0.3)' : '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        {a.ativo ? 'Ativa' : 'Inativa'}
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ====== CONDUTORES TAB ====== */}
            {tab === 'condutores' && (
              <motion.div key="cond" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="p-6 mb-6" style={cardStyle}>
                  <p className="font-dm text-sm font-medium mb-4" style={{ color: 'rgba(253,251,247,0.6)' }}>Adicionar condutor</p>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newCondutor}
                      onChange={e => setNewCondutor(e.target.value)}
                      placeholder="Nome do condutor"
                      className="font-dm flex-1 px-4 py-3 rounded-xl text-sm outline-none"
                      style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)', color: 'rgba(253,251,247,0.9)' }}
                      onKeyDown={e => e.key === 'Enter' && handleAddCondutor()}
                    />
                    <button onClick={handleAddCondutor}
                      className="font-dm text-sm font-bold px-6 py-3 rounded-xl"
                      style={{ backgroundColor: '#C84B31', color: '#fff' }}>
                      Adicionar
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {condutores.map(c => (
                    <div key={c.id} className="flex items-center gap-3 p-4 rounded-xl" style={{ ...cardStyle, opacity: c.ativo ? 1 : 0.5 }}>
                      <span className="font-dm text-sm flex-1" style={{ color: 'rgba(253,251,247,0.8)' }}>{c.nome}</span>
                      <button
                        onClick={() => handleToggleCondutor(c.id, c.ativo, c.nome)}
                        className="font-dm text-xs px-3 py-1.5 rounded-lg transition-all"
                        style={{
                          backgroundColor: c.ativo ? 'rgba(200,75,49,0.1)' : 'rgba(255,255,255,0.05)',
                          color: c.ativo ? '#C84B31' : 'rgba(253,251,247,0.4)',
                          border: c.ativo ? '1px solid rgba(200,75,49,0.3)' : '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        {c.ativo ? 'Ativo' : 'Inativo'}
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ====== ENVIOS TAB ====== */}
            {tab === 'envios' && (
              <motion.div key="envios" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="space-y-3">
                  {submissions.map(s => (
                    <div key={s.id} className="p-5 rounded-xl" style={cardStyle}>
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="font-dm text-sm font-medium" style={{ color: 'rgba(253,251,247,0.85)' }}>
                          {s.nome_social || s.nome_completo}
                        </span>
                        <span className="font-dm text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(200,75,49,0.1)', color: '#C84B31' }}>
                          {s.atividade_nome}
                        </span>
                        <span className="font-dm text-xs" style={{ color: 'rgba(253,251,247,0.25)' }}>
                          {new Date(s.criado_em).toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 mb-2">
                        <span className="font-dm text-xs" style={{ color: 'rgba(253,251,247,0.35)' }}>{s.email}</span>
                        {s.nota_grupo && (
                          <span className="flex items-center gap-1">
                            <span className="font-dm text-xs" style={{ color: 'rgba(253,251,247,0.35)' }}>Grupo:</span>
                            <Stars value={s.nota_grupo} />
                          </span>
                        )}
                        {s.nota_condutor && (
                          <span className="flex items-center gap-1">
                            <span className="font-dm text-xs" style={{ color: 'rgba(253,251,247,0.35)' }}>Condutor:</span>
                            <Stars value={s.nota_condutor} />
                          </span>
                        )}
                      </div>
                      {s.condutores_nomes && s.condutores_nomes.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {s.condutores_nomes.map((n, i) => (
                            <span key={i} className="font-dm text-xs px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: 'rgba(253,251,247,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>
                              {n}
                            </span>
                          ))}
                        </div>
                      )}
                      {s.relato && (
                        <p className="font-dm text-sm leading-relaxed mt-2" style={{ color: 'rgba(253,251,247,0.5)' }}>
                          &ldquo;{s.relato}&rdquo;
                        </p>
                      )}
                    </div>
                  ))}
                  {submissions.length === 0 && (
                    <div className="text-center py-16">
                      <p className="font-dm text-sm" style={{ color: 'rgba(253,251,247,0.3)' }}>Nenhum envio no período selecionado</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
