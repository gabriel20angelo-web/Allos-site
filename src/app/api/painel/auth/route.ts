import { NextRequest, NextResponse } from 'next/server'
import { painelAuthCookieHeader, painelAuthClearCookieHeader } from '@/lib/painel-auth'

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  const expected = process.env.PAINEL_PASSWORD
  if (!expected) return NextResponse.json({ success: false })

  if (password === expected) {
    const response = NextResponse.json({ success: true })
    response.headers.set('Set-Cookie', painelAuthCookieHeader(password))
    return response
  }

  return NextResponse.json({ success: false })
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.headers.set('Set-Cookie', painelAuthClearCookieHeader())
  return response
}
