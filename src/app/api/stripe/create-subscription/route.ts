import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

function getNextDay10(): Date {
  const now = new Date()
  const currentDay = now.getDate()
  const target = currentDay >= 10
    ? new Date(now.getFullYear(), now.getMonth() + 1, 10)
    : new Date(now.getFullYear(), now.getMonth(), 10)
  return target
}

function calculateProRata(monthlyAmount: number): { amount: number; days: number } {
  const now = new Date()
  const nextDay10 = getNextDay10()
  const diffMs = nextDay10.getTime() - now.getTime()
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  const amount = (monthlyAmount / 30) * days
  return { amount: Math.round(amount * 100) / 100, days }
}

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe não configurado.' }, { status: 503 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

  const { patientName, patientEmail, monthlyAmount } = await req.json()

  if (!patientName || !patientName.trim()) {
    return NextResponse.json({ error: 'Nome do paciente é obrigatório.' }, { status: 400 })
  }
  if (!patientEmail || !patientEmail.trim()) {
    return NextResponse.json({ error: 'Email do paciente é obrigatório.' }, { status: 400 })
  }
  if (!monthlyAmount || monthlyAmount < 50 || monthlyAmount > 2000) {
    return NextResponse.json({ error: 'Valor mensal deve estar entre R$50 e R$2.000.' }, { status: 400 })
  }

  const nextDay10 = getNextDay10()
  const nextDay10Timestamp = Math.floor(nextDay10.getTime() / 1000)
  const proRata = calculateProRata(monthlyAmount)
  const proRataCentavos = Math.round(proRata.amount * 100)
  const monthlyCentavos = Math.round(monthlyAmount * 100)

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      locale: 'pt-BR',
      customer_email: patientEmail.trim(),
      line_items: [{
        price_data: {
          currency: 'brl',
          product_data: { name: `Assinatura Terapia - ${patientName.trim()}` },
          unit_amount: monthlyCentavos,
          recurring: { interval: 'month' },
        },
        quantity: 1,
      }],
      subscription_data: {
        billing_cycle_anchor: nextDay10Timestamp,
        proration_behavior: 'create_prorations',
        metadata: {
          patient_name: patientName.trim(),
          tipo: 'clinica',
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://allos.org.br'}/pagamento-sucesso`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://allos.org.br'}/pagamento-cancelado`,
    })

    return NextResponse.json({
      url: session.url,
      proRataAmount: proRata.amount,
      daysUntilAnchor: proRata.days,
      nextDay10: nextDay10.toISOString(),
      monthlyAmount,
    })
  } catch (err) {
    console.error('Stripe create-subscription error:', err)
    const message = err instanceof Error ? err.message : 'Erro desconhecido'
    return NextResponse.json({ error: `Erro ao criar assinatura: ${message}` }, { status: 500 })
  }
}
