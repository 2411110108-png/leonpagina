import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

const planPrices: Record<string, string> = {
  basic: process.env.STRIPE_PRICE_BASIC || '',
  professional: process.env.STRIPE_PRICE_PROFESSIONAL || '',
  enterprise: process.env.STRIPE_PRICE_ENTERPRISE || '',
};

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { planId, userId } = await request.json();

    if (userId !== user.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const priceId = planPrices[planId];

    if (!priceId) {
      return NextResponse.json({ error: 'Plan no válido' }, { status: 400 });
    }

    // Crear sesión de checkout de Stripe
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pricing?canceled=true`,
      customer_email: user.email,
      metadata: {
        userId: user.id,
        planId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error en checkout:', error);
    return NextResponse.json(
      { error: 'Error al procesar el pago' },
      { status: 500 }
    );
  }
}


