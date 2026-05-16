import { NextResponse } from 'next/server';
import crypto from 'crypto';

const PUBLIC_KEY = process.env.LEEKPAY_PUBLIC_KEY;

function verifySignature(body: string, signature: string): boolean {
  if (!PUBLIC_KEY) return false;
  try {
    const computed = crypto
      .createHmac('sha256', PUBLIC_KEY)
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
    const signature = req.headers.get('x-leekpay-signature') || req.headers.get('X-LeekPay-Signature');

    if (PUBLIC_KEY && signature) {
      if (!verifySignature(rawBody, signature)) {
        return NextResponse.json({ error: 'Signature invalide' }, { status: 401 });
      }
    }

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Corps JSON invalide' }, { status: 400 });
    }

    const { event, transaction } = payload;

    switch (event) {
      case 'payment.success':
        console.log(`Paiement LeekPay réussi: ${transaction?.id} - ${transaction?.amount} XOF`);
        break;

      case 'payment.failed':
        console.warn(`Paiement LeekPay échoué: ${transaction?.id}`);
        break;

      case 'payment.cancelled':
        console.warn(`Paiement LeekPay annulé: ${transaction?.id}`);
        break;

      default:
        console.log(`Événement LeekPay: ${event}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('LeekPay webhook error:', err);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ received: true, message: 'Webhook LeekPay OK' });
}

export const runtime = 'nodejs';
