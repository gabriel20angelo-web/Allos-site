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
    }

    if (statusFilter !== 'all') {
      listParams.status = statusFilter as Stripe.SubscriptionListParams['status']
    }

    const subscriptions = await stripe.subscriptions.list(listParams)

    // Cache products to avoid repeated API calls
    const productCache = new Map<string, string>()

    const results = await Promise.all(
      subscriptions.data.map(async (sub) => {
        // Get product name to determine type
        const item = sub.items.data[0]
        const productId = typeof item?.price?.product === 'string' ? item.price.product : ''
        let productName = ''
        if (productId) {
          if (productCache.has(productId)) {
            productName = productCache.get(productId)!
          } else {
            try {
              const prod = await stripe.products.retrieve(productId)
              productName = prod.name || ''
              productCache.set(productId, productName)
            } catch { /* ignore */ }
          }
        }

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

        // Map invoices to the format expected by the frontend
        const faturas = invoices.data.map((inv) => ({
          numero: inv.number || null,
          valor: inv.amount_due ?? 0,
          data_pagamento: inv.status_transitions?.paid_at ?? null,
          data_criacao: inv.created ?? null,
          status: inv.status ?? 'draft',
          url_pagamento: inv.hosted_invoice_url ?? null,
          url_pdf: inv.invoice_pdf ?? null,
        }))

        return {
          id: sub.id,
          status: sub.status,
          tipo,
          nome_cliente: sub.metadata?.nome_cliente || null,
          produto: productName,
          valor_parcela: item?.price?.unit_amount ?? 0,
          desconto: sub.metadata?.desconto_percentual || '0',
          parcelas_total: totalParcelas,
          parcelas_pagas,
          parcelas_atrasadas,
          criado_em: sub.created,
          cancela_em: sub.cancel_at ?? null,
          periodo_atual_fim: (() => {
            // Find the next billing date from the latest open invoice, or estimate from billing anchor
            const openInv = invoices.data.find((inv) => inv.status === 'open')
            if (openInv?.due_date) return openInv.due_date
            // Estimate next period from billing cycle anchor
            if (sub.billing_cycle_anchor) {
              const anchor = sub.billing_cycle_anchor
              const now = Math.floor(Date.now() / 1000)
              const monthSec = 30 * 24 * 60 * 60
              let next = anchor
              while (next <= now) next += monthSec
              return next
            }
            return null
          })(),
          faturas,
        }
      })
    )

    // Filter out nulls (filtered by tipo)
    const filtered = results.filter(Boolean)

    return NextResponse.json(filtered)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    const stack = err instanceof Error ? err.stack : ''
    console.error('Stripe error:', message, stack)
    return NextResponse.json({ error: `Erro ao listar assinaturas: ${message}` }, { status: 500 })
  }
}
