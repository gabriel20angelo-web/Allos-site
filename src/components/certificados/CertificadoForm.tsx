'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import StarRating from './StarRating'

interface Atividade { id: string; nome: string }
interface Condutor { id: string; nome: string }

type Step = 'identification' | 'feedback' | 'submitting' | 'success'

export default function CertificadoForm() {
  const [step, setStep] = useState<Step>('identification')
  const [atividades, setAtividades] = useState<Atividade[]>([])
  const [condutores, setCondutores] = useState<Condutor[]>([])
  const [loading, setLoading] = useState(true)

  // Form fields
  const [nomeCompleto, setNomeCompleto] = useState('')
  const [nomeSocial, setNomeSocial] = useState('')
  const [email, setEmail] = useState('')
  const [atividadeId, setAtividadeId] = useState('')
  const [atividadeNome, setAtividadeNome] = useState('')
  const [notaGrupo, setNotaGrupo] = useState(0)
  const [condutoresSelecionados, setCondutoresSelecionados] = useState<Condutor[]>([])
  const [notaCondutor, setNotaCondutor] = useState(0)
  const [relato, setRelato] = useState('')
  const [error, setError] = useState('')
  const [certId, setCertId] = useState('')
  const [certCodigo, setCertCodigo] = useState('')

  useEffect(() => {
    Promise.all([
      fetch('/api/certificados/atividades').then(r => r.json()),
      fetch('/api/certificados/condutores').then(r => r.json()),
    ]).then(([atv, cond]) => {
      setAtividades(atv)
      setCondutores(cond)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleAtividadeChange = (id: string) => {
    setAtividadeId(id)
    const atv = atividades.find(a => a.id === id)
    setAtividadeNome(atv?.nome || '')
  }

  const toggleCondutor = (c: Condutor) => {
    setCondutoresSelecionados(prev => {
      if (prev.find(s => s.id === c.id)) return prev.filter(s => s.id !== c.id)
      if (prev.length >= 3) return prev
      return [...prev, c]
    })
  }

  const canProceed = nomeCompleto.trim() && email.trim() && atividadeId

  const handleSubmit = async () => {
    setStep('submitting')
    setError('')

    try {
      const res = await fetch('/api/certificados/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome_completo: nomeCompleto,
          nome_social: nomeSocial,
          email,
          atividade_id: atividadeId,
          atividade_nome: atividadeNome,
          nota_grupo: notaGrupo || null,
          condutores_ids: condutoresSelecionados.map(c => c.id),
          condutores_nomes: condutoresSelecionados.map(c => c.nome),
          nota_condutor: notaCondutor || null,
          relato,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erro ao enviar formulário')
        setStep('feedback')
        return
      }

      setCertId(data.certificado_id)
      setCertCodigo(data.codigo_verificacao)
      setStep('success')
    } catch {
      setError('Erro de conexão. Tente novamente.')
      setStep('feedback')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#C84B31] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {step === 'identification' && (
          <motion.div
            key="id"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Identification fields */}
            <div>
              <label className="font-dm text-sm font-medium block mb-2" style={{ color: 'rgba(253,251,247,0.6)' }}>
                Nome completo <span className="text-[#C84B31]">*</span>
              </label>
              <input
                type="text"
                value={nomeCompleto}
                onChange={e => setNomeCompleto(e.target.value)}
                placeholder="Seu nome completo"
                className="font-dm w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-200"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)', color: 'rgba(253,251,247,0.9)' }}
                onFocus={e => { e.target.style.borderColor = 'rgba(200,75,49,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(200,75,49,0.1)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
              />
            </div>

            <div>
              <label className="font-dm text-sm font-medium block mb-2" style={{ color: 'rgba(253,251,247,0.6)' }}>
                Nome social <span className="font-dm text-xs" style={{ color: 'rgba(253,251,247,0.3)' }}>(opcional)</span>
              </label>
              <input
                type="text"
                value={nomeSocial}
                onChange={e => setNomeSocial(e.target.value)}
                placeholder="Como prefere ser chamado(a)"
                className="font-dm w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-200"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)', color: 'rgba(253,251,247,0.9)' }}
                onFocus={e => { e.target.style.borderColor = 'rgba(200,75,49,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(200,75,49,0.1)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
              />
            </div>

            <div>
              <label className="font-dm text-sm font-medium block mb-2" style={{ color: 'rgba(253,251,247,0.6)' }}>
                E-mail <span className="text-[#C84B31]">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="font-dm w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-200"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)', color: 'rgba(253,251,247,0.9)' }}
                onFocus={e => { e.target.style.borderColor = 'rgba(200,75,49,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(200,75,49,0.1)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
              />
            </div>

            <div>
              <label className="font-dm text-sm font-medium block mb-2" style={{ color: 'rgba(253,251,247,0.6)' }}>
                Atividade participada <span className="text-[#C84B31]">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {atividades.map(a => (
                  <motion.button
                    key={a.id}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAtividadeChange(a.id)}
                    className="font-dm text-sm text-left px-4 py-3.5 rounded-xl transition-all duration-200"
                    style={{
                      backgroundColor: atividadeId === a.id ? 'rgba(200,75,49,0.15)' : 'rgba(255,255,255,0.03)',
                      border: atividadeId === a.id ? '1.5px solid rgba(200,75,49,0.5)' : '1.5px solid rgba(255,255,255,0.08)',
                      color: atividadeId === a.id ? '#C84B31' : 'rgba(253,251,247,0.7)',
                    }}
                  >
                    {a.nome}
                  </motion.button>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(200,75,49,0.35)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStep('feedback')}
              disabled={!canProceed}
              className="font-dm w-full py-4 rounded-xl text-sm font-bold tracking-wide transition-all duration-300"
              style={{
                backgroundColor: canProceed ? '#C84B31' : 'rgba(253,251,247,0.08)',
                color: canProceed ? '#fff' : 'rgba(253,251,247,0.25)',
                boxShadow: canProceed ? '0 4px 20px rgba(200,75,49,0.3)' : 'none',
                cursor: canProceed ? 'pointer' : 'not-allowed',
              }}
            >
              Continuar para o feedback
            </motion.button>
          </motion.div>
        )}

        {step === 'feedback' && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* Intro text */}
            <div className="rounded-2xl p-6" style={{ backgroundColor: 'rgba(200,75,49,0.06)', border: '1px solid rgba(200,75,49,0.12)' }}>
              <p className="font-dm text-sm leading-relaxed" style={{ color: 'rgba(253,251,247,0.6)' }}>
                Seu feedback é muito importante para a construção do aprimoramento contínuo da nossa formação. Ele nos ajuda a melhorar a qualidade dos grupos e oferecer um percurso cada vez mais qualificado para todos os envolvidos.
              </p>
              <p className="font-dm text-sm leading-relaxed mt-3" style={{ color: 'rgba(253,251,247,0.6)' }}>
                Na Alos, todos estamos em constante formação, inclusive quem conduz os grupos.
              </p>
            </div>

            {/* Star rating for group */}
            <StarRating
              value={notaGrupo}
              onChange={setNotaGrupo}
              label="O quanto você gostou do formato do grupo que você participou?"
            />

            {/* Conductor selection */}
            <div>
              <p className="font-dm text-sm font-medium mb-2" style={{ color: 'rgba(253,251,247,0.7)' }}>
                Quem conduziu o grupo?
              </p>
              <p className="font-dm text-xs mb-4" style={{ color: 'rgba(253,251,247,0.35)' }}>
                Selecione até 3 pessoas
              </p>
              <div className="flex flex-wrap gap-2">
                {condutores.map(c => {
                  const selected = condutoresSelecionados.find(s => s.id === c.id)
                  return (
                    <motion.button
                      key={c.id}
                      type="button"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => toggleCondutor(c)}
                      className="font-dm text-sm px-4 py-2 rounded-full transition-all duration-200"
                      style={{
                        backgroundColor: selected ? 'rgba(200,75,49,0.15)' : 'rgba(255,255,255,0.04)',
                        border: selected ? '1px solid rgba(200,75,49,0.5)' : '1px solid rgba(255,255,255,0.1)',
                        color: selected ? '#C84B31' : 'rgba(253,251,247,0.6)',
                        opacity: !selected && condutoresSelecionados.length >= 3 ? 0.4 : 1,
                      }}
                    >
                      {c.nome}
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* Star rating for conductor */}
            {condutoresSelecionados.length > 0 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <StarRating
                  value={notaCondutor}
                  onChange={setNotaCondutor}
                  label="Qual nota você daria para quem conduziu o grupo?"
                />
              </motion.div>
            )}

            {/* Free text */}
            <div>
              <p className="font-dm text-sm font-medium mb-2" style={{ color: 'rgba(253,251,247,0.7)' }}>
                Faça um pequeno relato sobre sua experiência. Sugestões, críticas ou feedbacks.
              </p>
              <p className="font-dm text-xs mb-3" style={{ color: 'rgba(253,251,247,0.35)' }}>
                Essa resposta será anônima.
              </p>
              <textarea
                value={relato}
                onChange={e => setRelato(e.target.value)}
                placeholder="Compartilhe sua experiência..."
                rows={4}
                className="font-dm w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-200 resize-none"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)', color: 'rgba(253,251,247,0.9)' }}
                onFocus={e => { e.target.style.borderColor = 'rgba(200,75,49,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(200,75,49,0.1)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
              />
            </div>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="font-dm text-sm text-center py-3 rounded-xl"
                style={{ color: '#C84B31', backgroundColor: 'rgba(200,75,49,0.08)', border: '1px solid rgba(200,75,49,0.15)' }}>
                {error}
              </motion.div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep('identification')}
                className="font-dm px-6 py-4 rounded-xl text-sm font-medium transition-all duration-200"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(253,251,247,0.6)' }}
              >
                Voltar
              </button>
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(200,75,49,0.35)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                className="font-dm flex-1 py-4 rounded-xl text-sm font-bold tracking-wide transition-all duration-300"
                style={{ backgroundColor: '#C84B31', color: '#fff', boxShadow: '0 4px 20px rgba(200,75,49,0.3)' }}
              >
                Enviar e gerar certificado
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 'submitting' && (
          <motion.div
            key="submitting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 gap-4"
          >
            <div className="w-10 h-10 border-2 border-[#C84B31] border-t-transparent rounded-full animate-spin" />
            <p className="font-dm text-sm" style={{ color: 'rgba(253,251,247,0.5)' }}>Gerando seu certificado...</p>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-8"
          >
            {/* Success icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(200,75,49,0.12)', border: '2px solid rgba(200,75,49,0.3)' }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#C84B31" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
            </div>

            <div>
              <h2 className="font-fraunces text-2xl font-bold mb-4" style={{ color: 'rgba(253,251,247,0.95)' }}>
                Obrigado por participar.
              </h2>
              <p className="font-dm text-sm leading-relaxed mb-4" style={{ color: 'rgba(253,251,247,0.55)' }}>
                Lembre-se: este é apenas um dos grupos abertos dentro da Alos. Além deles, existem diversos outros grupos de estudo, projetos sociais e iniciativas de iniciação científica acontecendo em nossa comunidade.
              </p>
              <p className="font-dm text-sm leading-relaxed mb-4" style={{ color: 'rgba(253,251,247,0.55)' }}>
                Se você quiser participar mais ativamente, atender clinicamente com supervisão, realizar intervenções e ter acesso a todas as atividades que continuam crescendo dentro da Alos, considere se tornar associado.
              </p>
              <p className="font-dm text-sm leading-relaxed" style={{ color: 'rgba(253,251,247,0.55)' }}>
                Sua participação fortalece nossos projetos e amplia nosso impacto coletivo.
              </p>
            </div>

            {/* Certificate link */}
            <div className="rounded-2xl p-6" style={{ backgroundColor: 'rgba(200,75,49,0.08)', border: '1px solid rgba(200,75,49,0.15)' }}>
              <p className="font-dm text-xs uppercase tracking-widest mb-2" style={{ color: '#C84B31' }}>Seu certificado</p>
              <p className="font-dm text-sm mb-4" style={{ color: 'rgba(253,251,247,0.5)' }}>
                Código de verificação: <span className="font-bold text-[#C84B31]">{certCodigo}</span>
              </p>
              <motion.a
                href={`/certificados/certificado?id=${certId}`}
                target="_blank"
                whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(200,75,49,0.35)' }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 font-dm text-sm font-bold text-white px-6 py-3 rounded-xl"
                style={{ backgroundColor: '#C84B31', boxShadow: '0 4px 20px rgba(200,75,49,0.3)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Ver certificado
              </motion.a>
            </div>

            <motion.a
              href="/processo-seletivo"
              whileHover={{ scale: 1.02 }}
              className="inline-block font-dm text-sm font-medium px-6 py-3 rounded-xl transition-all"
              style={{ border: '1px solid rgba(200,75,49,0.3)', color: '#C84B31' }}
            >
              Quero me tornar associado
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
