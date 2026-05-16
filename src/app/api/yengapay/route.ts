import { NextResponse } from 'next/server';

const YENGAPAY_API = 'https://api.yengapay.com/api/v1';

export async function POST(req: Request) {
  try {
    const { amount, customerName, customerPhone, orderId } = await req.json();
    const apiKey = process.env.YENGAPAY_API_KEY;
    const orgId = process.env.YENGAPAY_ORGANIZATION_ID;
    const projectId = process.env.YENGAPAY_PROJECT_ID;

    if (!apiKey || !orgId || !projectId) {
      return NextResponse.json({ error: 'YengaPay non configuré' }, { status: 500 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:4028';

    const response = await fetch(
      `${YENGAPAY_API}/groups/${orgId}/payment-intent/${projectId}`,
      {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentAmount: amount,
          reference: orderId,
          articles: [
            {
              title: `Commande ${orderId}`,
              description: `Commande ${orderId} - ${customerName}`,
              price: amount,
            },
          ],
          callbackUrl: `${siteUrl}/api/yengapay/webhook`,
          successUrl: `${siteUrl}/payment/success?order=${orderId}`,
          errorUrl: `${siteUrl}/payment/error?order=${orderId}`,
        }),
      }
    );

    const data = await response.json();

    if (!data.checkoutPageUrlWithPaymentToken && !data.checkoutUrl && !data.url) {
      return NextResponse.json({ error: data.message || data.error || 'Erreur YengaPay' }, { status: 400 });
    }

    return NextResponse.json({
      paymentUrl: data.checkoutPageUrlWithPaymentToken || data.checkoutUrl || data.url,
      reference: data.reference || data.id || orderId,
    });
  } catch (err) {
    console.error('YengaPay error:', err);
    return NextResponse.json({ error: 'Erreur de paiement' }, { status: 500 });
  }
}
