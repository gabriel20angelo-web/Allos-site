import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _adminClient: SupabaseClient | null = null

/**
 * Supabase admin client for the Formacao database (service role).
 * Used in API routes for certificado_atividades, certificado_condutores,
 * certificado_submissions, formacao_slots, etc.
 */
export function getFormacaoAdmin(): SupabaseClient {
  if (!_adminClient) {
    _adminClient = createClient(
      process.env.NEXT_PUBLIC_FORMACAO_SUPABASE_URL!,
      process.env.FORMACAO_SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_FORMACAO_SUPABASE_ANON_KEY!
    )
  }
  return _adminClient
}
