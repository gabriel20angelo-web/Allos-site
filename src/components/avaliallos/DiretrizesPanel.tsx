'use client'

import { useState } from 'react'

const T = '#0EA5A0', B = 'rgba(255,255,255,0.06)', X = 'rgba(253,251,247,0.92)', X2 = 'rgba(253,251,247,0.45)', X3 = 'rgba(253,251,247,0.22)'

const COMPETENCIAS = [
  { l: 'Estágio de Mudança', h: '/estagios-mudanca', c: '#C84B31' },
  { l: 'Coerência & Consistência', h: '/coerencia-consistencia', c: '#C84B31' },
  { l: 'Abertura & Encerramento', h: '/abertura-encerramento', c: '#C84B31' },
  { l: 'Sensação de Acolhimento', h: '/acolhimento', c: '#D4854A' },
  { l: 'Segurança no Terapeuta', h: '/seguranca-terapeuta', c: '#D4854A' },
  { l: 'Segurança no Método', h: '/seguranca-metodo', c: '#D4854A' },
  { l: 'Capacidade de Aprofundar', h: '/aprofundamento', c: '#B84060' },
  { l: 'Construção de Hipóteses', h: '/hipoteses-clinicas', c: '#B84060' },
  { l: 'Capacidade Interpretativa', h: '/interpretacao', c: '#B84060' },
  { l: 'Frase & Timing', h: '/frase-timing', c: '#8B5CF6' },
  { l: 'Corpo & Setting', h: '/setting-corpo', c: '#8B5CF6' },
  { l: 'Insight & Potência', h: '/potencia-insight', c: '#8B5CF6' },
]

type Sec = 'geral' | 'novos' | 'notas' | 'competencias' | 'recursos'

export default function DiretrizesPanel() {
  const [sec, setSec] = useState<Sec>('geral')

  const NAV: { k: Sec; l: string; svg: string }[] = [
    { k: 'geral', l: 'Diretriz', svg: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2' },
    { k: 'novos', l: 'Novos', svg: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' },
    { k: 'notas', l: 'Notas', svg: 'M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z' },
    { k: 'competencias', l: 'Leituras', svg: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z' },
    { k: 'recursos', l: 'Recursos', svg: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' },
  ]

  const Card = ({ children, accent }: { children: React.ReactNode; accent?: string }) => (
    <div className="rounded-2xl p-6 sm:p-7" style={{ backgroundColor: 'rgba(253,251,247,0.015)', border: `1px solid ${B}`, borderLeft: accent ? `3px solid ${accent}` : undefined }}>
      {children}
    </div>
  )

  const SectionTitle = ({ children, color }: { children: React.ReactNode; color?: string }) => (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-2 h-8 rounded-full" style={{ backgroundColor: color || T }} />
      <h2 className="font-fraunces text-2xl sm:text-3xl" style={{ color: X }}>{children}</h2>
    </div>
  )

  return (
    <div>
      {/* Section nav */}
      <div className="flex gap-2 mb-10 overflow-x-auto pb-1">
        {NAV.map(n => (
          <button key={n.k} onClick={() => setSec(n.k)}
            className="font-dm text-xs px-4 py-2.5 rounded-xl font-medium inline-flex items-center gap-2 transition-all whitespace-nowrap shrink-0"
            style={{
              backgroundColor: sec === n.k ? 'rgba(14,165,160,0.08)' : 'rgba(253,251,247,0.02)',
              color: sec === n.k ? T : X3,
              border: `1px solid ${sec === n.k ? 'rgba(14,165,160,0.2)' : B}`,
            }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={n.svg} /></svg>
            {n.l}
          </button>
        ))}
      </div>

      {/* DIRETRIZ GERAL */}
      {sec === 'geral' && (
        <div className="space-y-6">
          <SectionTitle>Diretriz Geral do <em className="italic" style={{ color: T }}>Processo de Avaliação</em></SectionTitle>

          <Card accent={T}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${T}12` }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T} strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              </div>
              <p className="font-dm text-sm font-bold" style={{ color: X }}>Antes de começar</p>
            </div>
            <p className="font-dm text-sm leading-relaxed" style={{ color: X2 }}>Apresente-se como estagiário clínico da Associação Allos e conte um pouco sobre você. Isso humaniza o processo e reduz a ansiedade. Depois, explique como a avaliação funciona.</p>
          </Card>

          <Card accent="#D4854A">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(212,133,74,0.1)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4854A" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
              </div>
              <p className="font-dm text-sm font-bold" style={{ color: X }}>Durante o feedback</p>
            </div>
            <div className="space-y-4">
              {[
                { n: 1, c: T, t: 'Mostre no atendimento', d: 'Sempre aponte no próprio atendimento da pessoa o que acertou e errou. Não fale em abstrato.' },
                { n: 2, c: '#D4854A', t: 'Explique COMO melhorar', d: 'Não basta apontar o erro. Indique caminhos concretos: grupos da Allos, supervisão, terapia a valor social.' },
                { n: 3, c: '#8B5CF6', t: 'Traduza a teoria', d: 'Evite puxar pra própria abordagem teórica o tempo todo — isso gera resistência. Pense teoricamente, mas fale sobre o atendimento em si.' },
                { n: 4, c: '#C84B31', t: 'Seja claro e educado', d: 'Diga o que mais impactou. Se o atendimento não foi bom, a pessoa precisa sair com clareza do porquê e de como melhorar.' },
              ].map(i => (
                <div key={i.n} className="flex gap-4 items-start">
                  <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center mt-0.5" style={{ backgroundColor: `${i.c}12`, border: `1px solid ${i.c}25` }}>
                    <span className="font-dm text-xs font-bold" style={{ color: i.c }}>{i.n}</span>
                  </div>
                  <div>
                    <p className="font-dm text-sm font-bold mb-1" style={{ color: X }}>{i.t}</p>
                    <p className="font-dm text-sm leading-relaxed" style={{ color: X2 }}>{i.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card accent="#8B5CF6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(139,92,246,0.1)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              </div>
              <p className="font-dm text-sm font-bold" style={{ color: X }}>Ao encerrar</p>
            </div>
            <p className="font-dm text-sm leading-relaxed mb-3" style={{ color: X2 }}>Pergunte se a pessoa tem alguma dúvida. Indique sempre a reavaliação — independente do resultado. Explique que o processo é formativo: pode refazer quantas vezes quiser.</p>
            <p className="font-dm text-sm leading-relaxed" style={{ color: X2 }}>Indique os grupos de formação da Allos e a terapia a valor social como recursos de desenvolvimento.</p>
          </Card>
        </div>
      )}

      {/* NOVOS AVALIADORES */}
      {sec === 'novos' && (
        <div className="space-y-6">
          <SectionTitle color="#D4854A">Para <em className="italic" style={{ color: '#D4854A' }}>Novos Avaliadores</em></SectionTitle>

          <Card accent="#D4854A">
            <p className="font-dm text-sm font-bold mb-6" style={{ color: X }}>Caminho de formação</p>
            <div className="space-y-6">
              {[
                { n: '01', c: '#D4854A', t: 'Observar', d: 'Acompanhe ao menos 5 avaliações com avaliadores experientes. Absorva o ritmo, a postura, como o feedback é dado.' },
                { n: '02', c: '#D4854A', t: 'Praticar', d: 'Teste dar feedbacks qualitativos (sem nota) e pratique atribuir notas sem mostrar ao avaliado. Compare com o avaliador principal.' },
                { n: '03', c: T, t: 'Avaliar', d: 'Depois das 5 observações e dos testes, você está pronto para conduzir avaliações de forma autônoma.' },
              ].map(i => (
                <div key={i.n} className="flex gap-5 items-start">
                  <div className="w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center" style={{ backgroundColor: `${i.c}10`, border: `1px solid ${i.c}20` }}>
                    <span className="font-dm text-lg font-bold" style={{ color: i.c }}>{i.n}</span>
                  </div>
                  <div className="pt-1">
                    <p className="font-dm text-sm font-bold mb-1" style={{ color: X }}>{i.t}</p>
                    <p className="font-dm text-sm leading-relaxed" style={{ color: X2 }}>{i.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* SISTEMA DE NOTAS */}
      {sec === 'notas' && (
        <div className="space-y-6">
          <SectionTitle color="#C84B31">Sistema de <em className="italic" style={{ color: '#C84B31' }}>Notas</em></SectionTitle>

          <Card>
            <p className="font-dm text-sm leading-relaxed mb-4" style={{ color: X2 }}>As notas refletem aspectos específicos do atendimento, não a qualidade do terapeuta como um todo. A <strong style={{ color: X }}>nota qualitativa</strong> (feedback descritivo) é geralmente mais relevante que o número.</p>
            <p className="font-dm text-sm leading-relaxed mb-4" style={{ color: X2 }}>Quando há dúvida entre duas notas, o avaliador <strong style={{ color: X }}>sempre opta pela menor</strong> para preservar a coerência. Variações entre avaliadores costumam ser até 4 pontos no total.</p>
            <p className="font-dm text-sm leading-relaxed" style={{ color: X2 }}>O processo também considera engajamento nos grupos, disposição em aprender, participação na comunidade e esforço em novas tentativas.</p>
          </Card>

          {/* Negative */}
          <div>
            <p className="font-dm text-xs font-bold tracking-widest uppercase mb-4 ml-1" style={{ color: '#C84B31' }}>Notas negativas</p>
            <div className="space-y-3">
              {[
                { v: -9, c: '#C84B31', d: 'Erro muito grave, que compromete vínculo, ética ou base técnica. Ruptura difícil de reparar — paciente perde confiança, sente-se desrespeitado ou inseguro.' },
                { v: -3, c: '#C84B31', d: 'Erro clínico claro e relevante. Afeta a condução da sessão mas não rompe o vínculo. Passível de correção com supervisão.' },
                { v: -1, c: '#D4854A', d: 'Erro pontual de execução. O terapeuta sabe o que deveria fazer, mas a aplicação não foi clara ou suficiente.' },
              ].map(n => (
                <div key={n.v} className="flex gap-4 rounded-2xl p-5" style={{ backgroundColor: `${n.c}06`, border: `1px solid ${n.c}12` }}>
                  <div className="shrink-0 w-14 text-center pt-1">
                    <span className="font-dm text-3xl font-bold" style={{ color: n.c }}>{n.v}</span>
                  </div>
                  <p className="font-dm text-sm leading-relaxed" style={{ color: X2 }}>{n.d}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Zero */}
          <div className="rounded-2xl p-5" style={{ backgroundColor: 'rgba(253,251,247,0.015)', border: `1px solid ${B}` }}>
            <div className="flex gap-4">
              <div className="shrink-0 w-14 text-center pt-1">
                <span className="font-dm text-3xl font-bold" style={{ color: X3 }}>0</span>
              </div>
              <div>
                <p className="font-dm text-xs font-bold tracking-widest uppercase mb-2" style={{ color: X3 }}>Sem dados</p>
                <p className="font-dm text-sm leading-relaxed" style={{ color: X2 }}>Sem dados para avaliar. A categoria assume a nota mais frequente das demais.</p>
              </div>
            </div>
          </div>

          {/* Positive */}
          <div>
            <p className="font-dm text-xs font-bold tracking-widest uppercase mb-4 ml-1" style={{ color: T }}>Notas positivas</p>
            <div className="space-y-3">
              {[
                { v: 1, c: '#1BBAB0', d: 'Procedimento adequado mas básico. Funciona, mas carece de refinamento. Não há erro, há potencial de precisão.' },
                { v: 3, c: '#0EA5A0', d: 'Acerto consistente e seguro. Domínio da técnica, coerência entre ações, efeitos clínicos positivos e observáveis.' },
                { v: 9, c: '#0EA5A0', d: 'Nota rara e excepcional. Excelência técnica e sensibilidade notável. Não é apenas correto — é inspirador. Gesto clínico de alto valor.' },
              ].map(n => (
                <div key={n.v} className="flex gap-4 rounded-2xl p-5" style={{ backgroundColor: `${n.c}06`, border: `1px solid ${n.c}12` }}>
                  <div className="shrink-0 w-14 text-center pt-1">
                    <span className="font-dm text-3xl font-bold" style={{ color: n.c }}>+{n.v}</span>
                  </div>
                  <p className="font-dm text-sm leading-relaxed" style={{ color: X2 }}>{n.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* COMPETÊNCIAS */}
      {sec === 'competencias' && (
        <div className="space-y-6">
          <SectionTitle color="#8B5CF6">Leituras <em className="italic" style={{ color: '#8B5CF6' }}>Recomendadas</em></SectionTitle>
          <p className="font-dm text-sm -mt-2 mb-6" style={{ color: X3 }}>Clique para ler sobre cada competência em detalhes.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {COMPETENCIAS.map((c, i) => (
              <a key={i} href={c.h} target="_blank" rel="noopener noreferrer"
                className="group rounded-2xl p-4 transition-all hover:-translate-y-0.5 flex items-center gap-3"
                style={{ backgroundColor: 'rgba(253,251,247,0.015)', border: `1px solid ${B}`, textDecoration: 'none' }}>
                <div className="w-2 h-8 rounded-full shrink-0 transition-all" style={{ backgroundColor: `${c.c}40` }} />
                <div className="flex-1 min-w-0">
                  <span className="font-dm text-sm font-medium block" style={{ color: X }}>{c.l}</span>
                </div>
                <svg className="shrink-0 opacity-30 group-hover:opacity-70 transition-opacity" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c.c} strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" /></svg>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* RECURSOS */}
      {sec === 'recursos' && (
        <div className="space-y-6">
          <SectionTitle>Recursos de <em className="italic" style={{ color: T }}>Suporte</em></SectionTitle>

          <a href="/pbe" target="_blank" rel="noopener noreferrer" className="group block rounded-2xl p-6 transition-all hover:-translate-y-0.5" style={{ backgroundColor: 'rgba(253,251,247,0.015)', border: `1px solid ${B}`, borderLeft: '3px solid #8B5CF6', textDecoration: 'none' }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(139,92,246,0.08)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" /></svg>
              </div>
              <div>
                <p className="font-dm text-base font-bold" style={{ color: X }}>Prática Baseada em Evidências</p>
                <p className="font-dm text-sm mt-1" style={{ color: X2 }}>Conheça a história da Prática Deliberada e a ciência por trás do instrumento.</p>
              </div>
            </div>
          </a>

          <a href="https://www.youtube.com/playlist?list=PL1Vwy7VAMFcqh-ACF12DmZ00Z9lxmVaPH" target="_blank" rel="noopener noreferrer" className="group block rounded-2xl p-6 transition-all hover:-translate-y-0.5" style={{ backgroundColor: 'rgba(253,251,247,0.015)', border: `1px solid ${B}`, borderLeft: '3px solid #C84B31', textDecoration: 'none' }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(200,75,49,0.08)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C84B31" strokeWidth="2" strokeLinecap="round"><polygon points="5 3 19 12 5 21" /></svg>
              </div>
              <div>
                <p className="font-dm text-base font-bold" style={{ color: X }}>Playlist de Suporte</p>
                <p className="font-dm text-sm mt-1" style={{ color: X2 }}>Vídeos sobre cada competência e dicas para aprimorar sua prática clínica.</p>
              </div>
            </div>
          </a>
        </div>
      )}
    </div>
  )
}
