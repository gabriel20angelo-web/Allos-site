import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  const expected = process.env.CERTIFICADOS_ADMIN_PASSWORD

  if (!expected) {
    return NextResponse.json({ success: false, error: 'Senha não configurada' })
  }

  return NextResponse.json({ success: password === expected })
}
