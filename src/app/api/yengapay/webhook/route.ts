import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { event, data, status, reference } = body;

    const eventType = event || body.type || status;

    switch (eventType) {
      case 'payment.success':
      case 'completed':
      case 'success':
        console.log(`Paiement YengaPay réussi: ${reference || data?.reference || 'N/A'}`);
        break;

      case 'payment.failed':
      case 'failed':
        console.warn(`Paiement YengaPay échoué: ${reference || data?.reference || 'N/A'}`);
        break;

      case 'payment.cancelled':
      case 'cancelled':
        console.warn(`Paiement YengaPay annulé: ${reference || data?.reference || 'N/A'}`);
        break;

      case 'webhook.test':
      case 'test':
        return NextResponse.json({ received: true, message: 'Webhook YengaPay OK' });

      default:
        console.log(`Événement YengaPay: ${eventType}`, reference || data?.reference || '');
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('YengaPay webhook error:', err);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ received: true, message: 'Webhook YengaPay OK' });
}

export const runtime = 'nodejs';
