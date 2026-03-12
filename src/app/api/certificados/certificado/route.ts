import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'ID não informado' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('cert_certificados')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Certificado não encontrado' }, { status: 404 })
  }

  return NextResponse.json(data)
}
