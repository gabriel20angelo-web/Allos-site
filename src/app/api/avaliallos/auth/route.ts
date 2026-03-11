import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { password, role } = await req.json()

  const passwords: Record<string, string | undefined> = {
    admin: process.env.AVALIALLOS_ADMIN_PASSWORD,
    avaliador: process.env.AVALIALLOS_AVALIADOR_PASSWORD,
  }

  const expected = passwords[role]
  if (!expected) return NextResponse.json({ success: false, error: 'Role inválido' })

  return NextResponse.json({ success: password === expected })
}
