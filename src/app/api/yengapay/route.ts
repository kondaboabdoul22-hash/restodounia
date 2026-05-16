import { NextResponse } from 'next/server';

const LEEKPAY_API = 'https://leekpay.fr/api/v1/checkout';

export async function POST(req: Request) {
  try {
    const { amount, customerName, customerPhone, orderId } = await req.json();
    const secretKey = process.env.LEEKPAY_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json({ error: 'LeekPay non configuré' }, { status: 500 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:4028';

    const response = await fetch(LEEKPAY_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency: 'XOF',
        description: `Commande ${orderId} - ${customerName}`,
        return_url: `${siteUrl}/payment/success?order=${orderId}`,
        customer_email: customerPhone,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      return NextResponse.json({ error: data.message || data.error || 'Erreur LeekPay' }, { status: 400 });
    }

    return NextResponse.json({
      paymentUrl: data.data?.payment_url,
      reference: data.data?.payment_id || orderId,
    });
  } catch (err) {
    console.error('LeekPay error:', err);
    return NextResponse.json({ error: 'Erreur de paiement' }, { status: 500 });
  }
}
