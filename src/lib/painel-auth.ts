import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { SupabaseClient } from '@supabase/supabase-js'

const COOKIE_NAME = 'painel_token'

/**
 * Validates that the request has a valid painel auth cookie.
 * Returns a 401 NextResponse if invalid, or null if valid.
 */
export function validatePainelAuth(req: NextRequest): NextResponse | null {
  const token = req.cookies.get(COOKIE_NAME)?.value
  const expected = process.env.PAINEL_PASSWORD

  if (!expected || token !== expected) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  return null
}

/**
 * Creates Set-Cookie header value for painel authentication.
 */
export function painelAuthCookieHeader(password: string): string {
  const isProduction = process.env.NODE_ENV === 'production'
  const parts = [
    `${COOKIE_NAME}=${password}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    `Max-Age=${60 * 60 * 24 * 7}`, // 7 days
  ]
  if (isProduction) {
    parts.push('Secure')
  }
  return parts.join('; ')
}

/**
 * Safely get the Supabase admin client.
 * Returns [client, null] on success or [null, NextResponse] on failure.
 */
export function getSafeSupabaseAdmin(): [SupabaseClient, null] | [null, NextResponse] {
  try {
    return [getSupabaseAdmin(), null]
  } catch {
    return [null, NextResponse.json(
      { error: 'Banco de dados não configurado. Verifique NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.local' },
      { status: 503 }
    )]
  }
}

/**
 * Creates Set-Cookie header to clear the painel auth cookie.
 */
export function painelAuthClearCookieHeader(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`
}
