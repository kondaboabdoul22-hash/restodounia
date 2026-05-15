import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Genius Pay webhook received:', body);

    const { event, data } = body;

    switch (event) {
      case 'payment.completed':
        console.log(`Paiement réussi pour la commande ${data.metadata?.order_id}`);
        break;
      case 'payment.failed':
        console.log(`Paiement échoué pour la commande ${data.metadata?.order_id}`);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: 'Invalid webhook' }, { status: 400 });
  }
}
