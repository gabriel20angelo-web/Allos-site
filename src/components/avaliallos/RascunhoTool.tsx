'use client'

import { useState, useEffect, useRef } from 'react'

const CRITERIOS = [
  { key: 'estagio_mudanca', label: 'Estágio de Mudança', cat: 'estrutura' },
  { key: 'estrutura_coerencia', label: 'Coerência & Consistência', cat: 'estrutura' },
  { key: 'encerramento_abertura', label: 'Abertura & Encerramento', cat: 'estrutura' },
  { key: 'acolhimento', label: 'Sensação de Acolhimento', cat: 'relacao' },
  { key: 'seguranca_terapeuta', label: 'Segurança no Terapeuta', cat: 'relacao' },
  { key: 'seguranca_metodo', label: 'Segurança no Método', cat: 'relacao' },
  { key: 'aprofundamento', label: 'Capacidade de Aprofundar', cat: 'formulacao' },
  { key: 'hipoteses', label: 'Construção de Hipóteses', cat: 'formulacao' },
  { key: 'interpretacao', label: 'Capacidade Interpretativa', cat: 'formulacao' },
  { key: 'frase_timing', label: 'Frase & Timing', cat: 'performance' },
  { key: 'corpo_setting', label: 'Corpo & Setting', cat: 'performance' },
  { key: 'insight_potencia', label: 'Insight & Potência', cat: 'performance' },
]

const CAT_COLORS: Record<string, string> = { estrutura: '#C84B31', relacao: '#D4854A', formulacao: '#B84060', performance: '#8B5CF6' }
const CAT_LABELS: Record<string, string> = { estrutura: 'Estrutura', relacao: 'Relação', formulacao: 'Formulação', performance: 'Performance' }
const SCORES = [-9, -3, -1, 1, 3, 9]

const T = '#0EA5A0'
const C = 'rgba(255,255,255,0.025)'
const B = 'rgba(255,255,255,0.07)'
const X = 'rgba(253,251,247,0.92)'
const X2 = 'rgba(253,251,247,0.5)'
const X3 = 'rgba(253,251,247,0.3)'

export default function RascunhoTool() {
  // Timer
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Competency scores + notes — persist in localStorage
  const [marks, setMarks] = useState<Record<string, number>>({})
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [generalNotes, setGeneralNotes] = useState('')
  const [loaded, setLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('avaliallos_rascunho')
      if (saved) {
        const d = JSON.parse(saved)
        if (d.marks) setMarks(d.marks)
        if (d.notes) setNotes(d.notes)
        if (d.generalNotes) setGeneralNotes(d.generalNotes)
        if (d.elapsed) setElapsed(d.elapsed)
      }
    } catch {}
    setLoaded(true)
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem('avaliallos_rascunho', JSON.stringify({ marks, notes, generalNotes, elapsed }))
    } catch {}
  }, [marks, notes, generalNotes, elapsed, loaded])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running])

  const fmtTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const toggleTimer = () => setRunning(!running)
  const resetTimer = () => { setRunning(false); setElapsed(0) }

  const setScore = (key: string, val: number) => {
    setMarks(m => m[key] === val ? { ...m, [key]: 0 } : { ...m, [key]: val })
  }

  const setNote = (key: string, val: string) => setNotes(n => ({ ...n, [key]: val }))

  const resetAll = () => {
    if (!confirm('Limpar tudo? Isso apaga todas as marcações e anotações.')) return
    setMarks({}); setNotes({}); setGeneralNotes(''); resetTimer()
    try { localStorage.removeItem('avaliallos_rascunho') } catch {}
  }

  const scoreColor = (v: number) => {
    if (v >= 3) return T
    if (v >= 1) return '#1BBAB0'
    if (v >= -1) return '#D4854A'
    return '#C84B31'
  }

  const critByCat = CRITERIOS.reduce<Record<string, typeof CRITERIOS>>((a, c) => {
    if (!a[c.cat]) a[c.cat] = []; a[c.cat].push(c); return a
  }, {})

  const filledCount = Object.values(marks).filter(v => v !== 0 && v !== undefined).length

  return (
    <div>
      {/* Info banner */}
      <div className="rounded-xl px-4 py-3 mb-6 flex items-start gap-3" style={{ backgroundColor: 'rgba(14,165,160,0.04)', border: '1px solid rgba(14,165,160,0.1)' }}>
        <svg className="shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0EA5A0" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
        <p className="font-dm text-xs leading-relaxed" style={{ color: 'rgba(253,251,247,0.4)' }}>
          Seu rascunho é salvo automaticamente neste navegador. Se limpar dados do navegador ou usar outro dispositivo, ele será perdido.
        </p>
      </div>

      {/* Timer */}
      <div className="rounded-3xl p-6 mb-8" style={{ backgroundColor: C, border: `1.5px solid ${B}` }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={running ? T : X3} strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
            </svg>
            <span className="font-dm text-sm font-bold" style={{ color: X }}>Cronômetro</span>
            {running && (
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#C84B31' }} />
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={resetAll} className="font-dm text-xs px-3 py-1.5 rounded-lg" style={{ color: '#C84B31', backgroundColor: 'rgba(200,75,49,0.06)' }}>
              Limpar tudo
            </button>
          </div>
        </div>

        <div className="text-center py-4">
          <div
            className="font-dm text-6xl font-bold tracking-tight"
            style={{
              color: running ? X : X2,
              fontVariantNumeric: 'tabular-nums',
              textShadow: running ? `0 0 40px ${T}30` : 'none',
            }}
          >
            {fmtTime(elapsed)}
          </div>
          {elapsed > 0 && (
            <p className="font-dm text-xs mt-2" style={{ color: X3 }}>
              {elapsed >= 1200
                ? 'Tempo recomendado atingido'
                : `${Math.ceil((1200 - elapsed) / 60)} min restantes (recomendado: 20min)`}
            </p>
          )}
        </div>

        <div className="flex justify-center gap-3 mt-2">
          <button
            onClick={toggleTimer}
            className="font-dm text-sm px-8 py-3 rounded-2xl font-bold transition-all hover:-translate-y-0.5"
            style={{
              backgroundColor: running ? 'rgba(200,75,49,0.15)' : T,
              color: running ? '#C84B31' : '#fff',
              border: running ? '1.5px solid rgba(200,75,49,0.3)' : 'none',
              boxShadow: running ? 'none' : `0 4px 16px ${T}25`,
            }}
          >
            {running ? (
              <><svg className="inline mr-2 -mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>Pausar</>
            ) : elapsed > 0 ? (
              <><svg className="inline mr-2 -mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21" /></svg>Continuar</>
            ) : (
              <><svg className="inline mr-2 -mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21" /></svg>Iniciar</>
            )}
          </button>
          {elapsed > 0 && (
            <button
              onClick={resetTimer}
              className="font-dm text-sm px-4 py-3 rounded-2xl font-medium"
              style={{ backgroundColor: C, color: X3, border: `1.5px solid ${B}` }}
            >
              <svg className="inline mr-1.5 -mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 4v6h6" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>
              Zerar
            </button>
          )}
        </div>
      </div>

      {/* Competencies */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-fraunces text-lg" style={{ color: X }}>Rascunho de Avaliação</h3>
        <span className="font-dm text-xs px-3 py-1 rounded-full" style={{ backgroundColor: filledCount === 12 ? 'rgba(14,165,160,0.1)' : C, color: filledCount === 12 ? T : X3, border: `1px solid ${filledCount === 12 ? 'rgba(14,165,160,0.2)' : B}` }}>
          {filledCount}/12
        </span>
      </div>
      <p className="font-dm text-xs mb-6" style={{ color: X3 }}>
        Marque as notas durante a avaliação. Nada é salvo — é só pra rascunho.
      </p>

      <div className="space-y-6">
        {Object.entries(critByCat).map(([cat, crits]) => (
          <div key={cat}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: CAT_COLORS[cat] }} />
              <span className="font-dm text-xs font-bold tracking-widest uppercase" style={{ color: CAT_COLORS[cat] }}>{CAT_LABELS[cat]}</span>
              <div className="flex-1 h-px" style={{ backgroundColor: B }} />
            </div>

            <div className="space-y-1.5">
              {crits.map(c => {
                const val = marks[c.key] || 0
                const note = notes[c.key] || ''
                return (
                  <div key={c.key} className="rounded-xl px-3 py-2.5" style={{ backgroundColor: val !== 0 ? `${scoreColor(val)}05` : C, border: `1px solid ${val !== 0 ? `${scoreColor(val)}18` : B}` }}>
                    <div className="flex items-center gap-2">
                      <span className="font-dm text-xs font-medium shrink-0" style={{ color: X2, minWidth: '120px' }}>{c.label}</span>
                      <div className="flex gap-1 flex-1">
                        {SCORES.map(s => {
                          const active = val === s
                          const col = scoreColor(s)
                          return (
                            <button key={s} onClick={() => setScore(c.key, s)}
                              className="font-dm font-bold flex-1 py-1 rounded text-xs transition-all"
                              style={{ backgroundColor: active ? `${col}22` : 'transparent', color: active ? col : 'rgba(253,251,247,0.15)', border: `1px solid ${active ? `${col}30` : 'transparent'}` }}>
                              {s > 0 ? `+${s}` : s}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    <input type="text" value={note} onChange={e => setNote(c.key, e.target.value)} placeholder="obs..." className="font-dm text-xs w-full mt-1.5 px-2 py-1 rounded-md outline-none placeholder:text-white/10" style={{ backgroundColor: 'rgba(253,251,247,0.015)', border: 'none', color: X3 }} />
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* General notes */}
      <div className="mt-8">
        <label className="font-dm text-sm font-bold block mb-3" style={{ color: X }}>
          <svg className="inline mr-2 -mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T} strokeWidth="2" strokeLinecap="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          Anotações gerais
        </label>
        <textarea
          value={generalNotes}
          onChange={(e) => setGeneralNotes(e.target.value)}
          placeholder="Anotações livres sobre a avaliação..."
          rows={5}
          className="font-dm text-sm w-full px-4 py-3 rounded-2xl outline-none resize-none placeholder:text-white/15"
          style={{ backgroundColor: C, border: `1.5px solid ${B}`, color: X2 }}
        />
      </div>
    </div>
  )
}
