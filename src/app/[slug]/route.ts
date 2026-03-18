export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  let supabase
  try {
    supabase = getSupabaseAdmin()
  } catch {
    return NextResponse.json({ error: 'DB não configurado.' }, { status: 503 })
  }

  // Find active link by slug
  const { data: link, error } = await supabase
    .from('links')
    .select('id, wa_message')
    .eq('slug', slug)
    .eq('active', true)
    .single()

  if (error || !link) {
    // No matching link — return 404
    return NextResponse.redirect(new URL('/', req.url), 302)
  }

  // Record the click
  const ua = req.headers.get('user-agent') || ''
  const referer = req.headers.get('referer') || ''
  const isMobile = /mobile|android|iphone/i.test(ua)
  const deviceType = isMobile ? 'mobile' : 'desktop'

  await supabase.from('clicks').insert({
    link_id: link.id,
    device_type: deviceType,
    user_agent: ua.slice(0, 500),
    referer: referer.slice(0, 500),
  })

  // Redirect to WhatsApp with pre-filled message
  const waUrl = `https://wa.me/?text=${encodeURIComponent(link.wa_message)}`
  return NextResponse.redirect(waUrl, 302)
}
