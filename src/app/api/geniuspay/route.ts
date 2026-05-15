import { NextResponse } from 'next/server';

const GENIUSPAY_API = 'https://pay.genius.ci/api/v1/merchant/payments';

export async function POST(req: Request) {
  try {
    const { amount, customerName, customerPhone, orderId } = await req.json();
    const publicKey = process.env.NEXT_PUBLIC_GENIUSPAY_PUBLIC_KEY;

    if (!publicKey) {
      return NextResponse.json({ error: 'Genius Pay non configuré' }, { status: 500 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:4028';

    const response = await fetch(GENIUSPAY_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency: 'XOF',
        customer: {
          name: customerName,
          phone: customerPhone,
        },
        metadata: {
          order_id: orderId,
        },
        success_url: `${siteUrl}/payment/success?order=${orderId}`,
        error_url: `${siteUrl}/payment/error?order=${orderId}`,
        callback_url: `${siteUrl}/api/geniuspay/webhook`,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      return NextResponse.json({ error: data.error?.message || data.message || 'Erreur Genius Pay' }, { status: 400 });
    }

    return NextResponse.json({
      paymentUrl: data.data?.checkout_url || data.data?.payment_url || data.data?.paymentUrl,
      reference: data.data?.reference || data.data?.id,
    });
  } catch (err) {
    console.error('Genius Pay error:', err);
    return NextResponse.json({ error: 'Erreur de paiement' }, { status: 500 });
  }
}
