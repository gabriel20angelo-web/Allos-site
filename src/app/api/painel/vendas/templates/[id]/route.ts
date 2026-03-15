import { NextRequest, NextResponse } from 'next/server'
import { validatePainelAuth, getSafeSupabaseAdmin } from '@/lib/painel-auth'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = validatePainelAuth(req)
  if (authError) return authError

  const { id } = await params
  const [supabase, dbError] = getSafeSupabaseAdmin()
  if (dbError) return dbError
  const body = await req.json()
  const { title, body: templateBody } = body

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }
  if (title !== undefined) updates.title = title
  if (templateBody !== undefined) updates.body = templateBody

  const { data, error } = await supabase
    .from('sales_templates')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ error: 'Template não encontrado.' }, { status: 404 })
  return NextResponse.json(data)
}
