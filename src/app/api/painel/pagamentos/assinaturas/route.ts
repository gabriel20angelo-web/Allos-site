export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { validatePainelAuth } from '@/lib/painel-auth'

export async function GET(req: NextRequest) {
  const authError = validatePainelAuth(req)
  if (authError) return authError

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe não configurado.' }, { status: 503 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

  const statusFilter = req.nextUrl.searchParams.get('status') || 'all'
  const tipoFilter = req.nextUrl.searchParams.get('tipo') || 'all'

  try {
    // Build Stripe list params
    const listParams: Stripe.SubscriptionListParams = {
      limit: 100,
      expand: ['data.items.data.price.product'],
    }

    if (statusFilter !== 'all') {
      listParams.status = statusFilter as Stripe.SubscriptionListParams['status']
    }

    const subscriptions = await stripe.subscriptions.list(listParams)

    const results = await Promise.all(
      subscriptions.data.map(async (sub) => {
        // Get product name to determine type
        const item = sub.items.data[0]
        const product = item?.price?.product as Stripe.Product | undefined
        const productName = product?.name || ''

        const tipo = productName.toLowerCase().includes('neuro') ? 'neuro' : 'clinica'

        // Filter by tipo
        if (tipoFilter !== 'all' && tipo !== tipoFilter) {
          return null
        }

        // Get invoices for this subscription
        const invoices = await stripe.invoices.list({
          subscription: sub.id,
          limit: 12,
        })

        const parcelas_pagas = invoices.data.filter((inv) => inv.status === 'paid').length
        const parcelas_atrasadas = invoices.data.filter((inv) => inv.status === 'open' && inv.due_date && inv.due_date * 1000 < Date.now()).length

        const totalParcelas = sub.metadata?.parcelas_total
          ? parseInt(sub.metadata.parcelas_total)
          : null

        return {
          id: sub.id,
          status: sub.status,
          tipo,
          nome_cliente: sub.metadata?.nome_cliente || null,
          produto: productName,
          valor_parcela: item?.price?.unit_amount
            ? `R$ ${(item.price.unit_amount / 100).toFixed(2).replace('.', ',')}`
            : null,
          parcelas_total: totalParcelas,
          parcelas_pagas,
          parcelas_atrasadas,
          created_at: new Date(sub.created * 1000).toISOString(),
          current_period_end: (sub as unknown as { current_period_end: number }).current_period_end
            ? new Date((sub as unknown as { current_period_end: number }).current_period_end * 1000).toISOString()
            : null,
        }
      })
    )

    // Filter out nulls (filtered by tipo)
    const filtered = results.filter(Boolean)

    return NextResponse.json(filtered)
  } catch (err) {
    console.error('Stripe error:', err)
    return NextResponse.json({ error: 'Erro ao listar assinaturas.' }, { status: 500 })
  }
}
