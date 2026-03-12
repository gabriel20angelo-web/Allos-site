import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

function hashString(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  return Math.abs(hash).toString(36)
}

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const admin = getSupabaseAdmin()

  const { nome_completo, nome_social, email, atividade_id, atividade_nome, nota_grupo, condutores_ids, condutores_nomes, nota_condutor, relato } = body

  if (!nome_completo || !email || !atividade_id || !atividade_nome) {
    return NextResponse.json({ error: 'Campos obrigatórios não preenchidos' }, { status: 400 })
  }

  // Abuse control: check certificates per email per day
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
  const ipHash = hashString(ip)
  const today = new Date().toISOString().split('T')[0]

  const { count: emailCount } = await admin
    .from('cert_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('email', email.toLowerCase().trim())
    .gte('criado_em', `${today}T00:00:00`)
    .lt('criado_em', `${today}T23:59:59`)

  if (emailCount !== null && emailCount >= 3) {
    return NextResponse.json({
      error: 'Limite de certificados atingido. Você pode gerar no máximo 3 certificados por dia.'
    }, { status: 429 })
  }

  const { count: ipCount } = await admin
    .from('cert_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .gte('criado_em', `${today}T00:00:00`)
    .lt('criado_em', `${today}T23:59:59`)

  if (ipCount !== null && ipCount >= 3) {
    return NextResponse.json({
      error: 'Limite de certificados atingido para este dispositivo. Tente novamente amanhã.'
    }, { status: 429 })
  }

  // Insert submission
  const { data: submission, error: subError } = await admin
    .from('cert_submissions')
    .insert({
      nome_completo: nome_completo.trim(),
      nome_social: nome_social?.trim() || null,
      email: email.toLowerCase().trim(),
      atividade_id,
      atividade_nome,
      nota_grupo: nota_grupo || null,
      condutores_ids: condutores_ids || [],
      condutores_nomes: condutores_nomes || [],
      nota_condutor: nota_condutor || null,
      relato: relato?.trim() || null,
      ip_hash: ipHash,
    })
    .select()
    .single()

  if (subError) {
    return NextResponse.json({ error: subError.message }, { status: 500 })
  }

  // Generate certificate
  const nomeExibicao = nome_social?.trim() || nome_completo.trim()
  const codigo = generateCode()

  const { data: cert, error: certError } = await admin
    .from('cert_certificados')
    .insert({
      submission_id: submission.id,
      nome_participante: nomeExibicao,
      atividade_nome,
      data_participacao: today,
      codigo_verificacao: codigo,
    })
    .select()
    .single()

  if (certError) {
    return NextResponse.json({ error: certError.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    certificado_id: cert.id,
    codigo_verificacao: codigo,
  })
}
