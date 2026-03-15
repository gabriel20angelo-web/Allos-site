import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { validatePainelAuth } from '@/lib/painel-auth'

function formatBRL(centavos: number): string {
  return `R$ ${(centavos / 100).toFixed(2).replace('.', ',')}`
}

export async function POST(req: NextRequest) {
  const authError = validatePainelAuth(req)
  if (authError) return authError

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe não configurado.' }, { status: 503 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

  const { nome_cliente, valor_total, parcelas, desconto_percentual } = await req.json()

  // Validations
  if (!nome_cliente || !nome_cliente.trim()) {
    return NextResponse.json({ error: 'Nome do cliente é obrigatório.' }, { status: 400 })
  }
  if (!valor_total || valor_total < 5 || valor_total > 5000) {
    return NextResponse.json({ error: 'Valor total deve estar entre R$ 5 e R$ 5.000.' }, { status: 400 })
  }
  const numParcelas = parcelas || 1
  if (numParcelas < 1 || numParcelas > 5) {
    return NextResponse.json({ error: 'Número de parcelas deve ser entre 1 e 5.' }, { status: 400 })
  }
  const desconto = desconto_percentual || 0
  if (desconto < 0 || desconto > 30) {
    return NextResponse.json({ error: 'Desconto deve ser entre 0% e 30%.' }, { status: 400 })
  }

  // Calculate values
  const valorComDesconto = valor_total * (1 - desconto / 100)
  const valorTotalCentavos = Math.round(valorComDesconto * 100)
  const valorParcelaCentavos = Math.round(valorTotalCentavos / numParcelas)

  try {
    let link: string

    if (numParcelas === 1) {
      // One-time payment: create price + payment link
      const price = await stripe.prices.create({
        unit_amount: valorTotalCentavos,
        currency: 'brl',
        product_data: {
          name: `Neuro Avaliação Neuropsicológica - ${nome_cliente.trim()}`,
        },
      })

      const paymentLink = await stripe.paymentLinks.create({
        line_items: [{ price: price.id, quantity: 1 }],
      })

      link = paymentLink.url
    } else {
      // Multiple installments: create recurring price + checkout session
      const price = await stripe.prices.create({
        unit_amount: valorParcelaCentavos,
        currency: 'brl',
        recurring: { interval: 'month', interval_count: 1 },
        product_data: {
          name: `Neuro Avaliação Neuropsicológica - ${nome_cliente.trim()} (${numParcelas}x)`,
        },
      })

      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [{ price: price.id, quantity: 1 }],
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://allos.com.br'}/pagamento-sucesso`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://allos.com.br'}/pagamento-cancelado`,
        subscription_data: {
          metadata: {
            nome_cliente: nome_cliente.trim(),
            parcelas_total: numParcelas.toString(),
            valor_total_centavos: valorTotalCentavos.toString(),
          },
        },
      })

      link = session.url!
    }

    return NextResponse.json({
      link,
      resumo: {
        valor_total: formatBRL(valorTotalCentavos),
        parcelas: numParcelas,
        valor_parcela: formatBRL(valorParcelaCentavos),
        desconto: desconto > 0 ? `${desconto}%` : null,
      },
    })
  } catch (err) {
    console.error('Stripe error:', err)
    return NextResponse.json({ error: 'Erro ao criar link de pagamento.' }, { status: 500 })
  }
}
