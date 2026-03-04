import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || supabaseUrl.includes('SEU_PROJETO')) {
  console.warn(
    '[AvaliAllos] Supabase não configurado. Leia o SETUP.md e preencha o .env.local'
  )
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder')

// ─── tipos ───────────────────────────────────────────────────────────────────

export type Avaliador = {
  id: string
  nome: string
  created_at: string
}

export type Disponibilidade = {
  id: string
  avaliador_id: string
  data: string
  horario_inicio: string
  created_at: string
}

export type Agendamento = {
  id: string
  data: string
  horario_inicio: string
  nome_completo: string
  telefone: string
  participou_grupo_pratica: boolean
  categoria: string
  categoria_outro: string | null
  status: 'pendente' | 'aprovado' | 'cancelado'
  created_at: string
}

export type SlotDisponivel = {
  data: string
  horario_inicio: string
  total_avaliadores: number
  nomes_avaliadores: string[]
  total_agendamentos: number   // 0, 1 ou 2
  cheio: boolean               // total_agendamentos >= 2
}
