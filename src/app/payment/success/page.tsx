'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-3xl p-10 max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto">
          <Icon name="CheckIcon" size={40} className="text-success" variant="solid" />
        </div>
        <div>
          <h1 className="font-black text-2xl text-foreground mb-2">Paiement Réussi !</h1>
          <p className="text-muted-foreground text-sm">Votre commande a été confirmée et sera préparée dans les plus brefs délais.</p>
        </div>
        <Link
          href="/"
          className="block w-full py-4 bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-accent transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
