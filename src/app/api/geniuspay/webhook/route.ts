import { NextResponse } from 'next/server';
import crypto from 'crypto';

const WEBHOOK_SECRET = process.env.GENIUSPAY_WEBHOOK_SECRET;

function verifyHmac(body: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) return false;
  try {
    const computed = crypto
      .createHmac('sha256', WEBHOOK_SECRET)
      .update(body, 'utf8')
      .digest('hex');
    return crypto.timingSafeEqual(
      Buffer.from(computed),
      Buffer.from(signature)
    );
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-webhook-signature') || req.headers.get('X-Webhook-Signature');
    const timestamp = req.headers.get('x-webhook-timestamp');

    if (timestamp) {
      const now = Math.floor(Date.now() / 1000);
      const webhookTime = parseInt(timestamp, 10);
      if (now - webhookTime > 300) {
        return NextResponse.json({ error: 'Timestamp expiré' }, { status: 401 });
      }
    }

    if (WEBHOOK_SECRET && signature) {
      if (!verifyHmac(rawBody, signature)) {
        return NextResponse.json({ error: 'Signature invalide' }, { status: 401 });
      }
    }

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Corps JSON invalide' }, { status: 400 });
    }

    const { event, data } = payload;

    switch (event) {
      case 'payment.success':
        console.log(`Paiement réussi: ${data?.metadata?.order_id || data?.metadata?.transaction_id || 'N/A'}`);
        break;

      case 'payment.failed':
        console.warn(`Paiement échoué: ${data?.metadata?.order_id || 'N/A'} - ${data?.reason || data?.message || ''}`);
        break;

      case 'payment.cancelled':
        console.warn(`Paiement annulé: ${data?.metadata?.order_id || 'N/A'}`);
        break;

      case 'payment.refunded':
        console.log(`Remboursement: ${data?.metadata?.order_id || 'N/A'} - ${data?.amount || ''} XOF`);
        break;

      case 'payment.expired':
        console.warn(`Paiement expiré: ${data?.metadata?.order_id || 'N/A'}`);
        break;

      case 'webhook.test':
        return NextResponse.json({ received: true, message: 'Webhook OK' });

      default:
        if (event?.startsWith('cashout.')) {
          console.log(`Cashout ${event}`);
        }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Méthode non autorisée' }, { status: 405 });
}

export const runtime = 'nodejs';
