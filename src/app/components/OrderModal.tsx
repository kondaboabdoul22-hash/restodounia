'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useCart } from './CartProvider';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

interface OrderModalProps {
  onClose: () => void;
  grandTotal: number;
}

export default function OrderModal({ onClose, grandTotal }: OrderModalProps) {
  const { items, clearCart } = useCart();
  const { settings } = useSiteSettings();
  const [step, setStep] = useState<'form' | 'payment' | 'geniuspay' | 'success'>('form');
  const [form, setForm] = useState({ name: '', phone: '', address: '', delivery: 'livraison' as 'livraison' | 'emporter' });
  const [payment, setPayment] = useState('geniuspay');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const paymentMethods = [
    ...(settings.paymentGeniusPay ? [{ id: 'geniuspay', label: 'Genius Pay (Carte, Orange, Moov, Wave)', color: '#6C5CE7', icon: '💳' }] : []),
    ...(settings.paymentOrange ? [{ id: 'orange', label: 'Orange Money', color: '#FF6600', icon: '🟠' }] : []),
    ...(settings.paymentMoov ? [{ id: 'moov', label: 'Moov Money', color: '#00A651', icon: '🟢' }] : []),
    ...(settings.paymentWave ? [{ id: 'wave', label: 'Wave', color: '#1DC2FF', icon: '🔵' }] : []),
    ...(settings.paymentCash ? [{ id: 'cash', label: 'Paiement à la livraison', color: '#9A8F87', icon: '💵' }] : []),
  ];

  const handleSubmit = () => {
    if (!form.name || !form.phone) return;
    if (payment === 'geniuspay') {
      handleGeniusPay();
    } else {
      setStep('payment');
    }
  };

  const handleGeniusPay = async () => {
    setLoading(true);
    setError('');
    const orderId = `RD-${Date.now().toString().slice(-6)}`;

    try {
      const res = await fetch('/api/geniuspay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: grandTotal,
          customerName: form.name,
          customerPhone: form.phone,
          orderId,
        }),
      });

      const data = await res.json();

      if (data.paymentUrl) {
        clearCart();
        window.location.href = data.paymentUrl;
      } else {
        setError(data.error || 'Erreur de paiement Genius Pay');
        setLoading(false);
      }
    } catch {
      setError('Impossible de contacter Genius Pay');
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('success');
      clearCart();
    }, 1800);
  };

  const waNumber = settings.whatsappNumber.replace(/\s+/g, '').replace('+', '');

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10">
          <h2 className="font-black text-foreground text-xl">
            {step === 'form' && 'Votre Commande'}
            {step === 'payment' && 'Paiement'}
            {step === 'geniuspay' && 'Paiement Genius Pay'}
            {step === 'success' && 'Commande Confirmée !'}
          </h2>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors">
            <Icon name="XMarkIcon" size={16} className="text-foreground" />
          </button>
        </div>

        <div className="p-6">
          {/* Step 1: Form */}
          {step === 'form' && (
            <div className="space-y-5">
              {/* Order summary mini */}
              <div className="bg-muted rounded-2xl p-4 space-y-2">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-foreground font-medium">{item.name} ×{item.quantity}</span>
                    <span className="text-primary font-bold">{(item.price * item.quantity).toLocaleString('fr-FR')} XOF</span>
                  </div>
                ))}
                <div className="flex justify-between font-black text-foreground pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">{grandTotal.toLocaleString('fr-FR')} XOF</span>
                </div>
              </div>

              {/* Delivery toggle */}
              <div className="flex gap-3">
                {(['livraison', 'emporter'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setForm(f => ({ ...f, delivery: mode }))}
                    className={`flex-1 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all ${
                      form.delivery === mode ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {mode === 'livraison' ? '🛵 Livraison' : '🏃 À emporter'}
                  </button>
                ))}
              </div>

              {/* Payment selection first */}
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Mode de paiement</p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {paymentMethods.map(pm => (
                  <button
                    key={pm.id}
                    onClick={() => setPayment(pm.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      payment === pm.id ? 'border-primary bg-primary/10' : 'border-border bg-muted'
                    }`}
                  >
                    <span className="text-xl">{pm.icon}</span>
                    <span className="font-bold text-foreground text-xs flex-1 text-left">{pm.label}</span>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      payment === pm.id ? 'border-primary' : 'border-muted-foreground'
                    }`}>
                      {payment === pm.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                  </button>
                ))}
              </div>

              {/* Form fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Votre nom *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Ex: Aminata Ouédraogo"
                    className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">WhatsApp / Téléphone *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+226 70 00 00 00"
                    className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>
                {form.delivery === 'livraison' && (
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Adresse de livraison *</label>
                    <textarea
                      value={form.address}
                      onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                      placeholder="Secteur 15, Rue 15.30, Ouagadougou"
                      rows={3}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
                    />
                  </div>
                )}
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <p className="text-red-400 text-sm font-medium">{error}</p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={!form.name || !form.phone || loading}
                className="w-full py-4 bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0110 10" strokeLinecap="round" />
                  </svg>
                ) : payment === 'geniuspay' ? (
                  <>Payer avec Genius Pay →</>
                ) : (
                  <>Choisir le Paiement →</>
                )}
              </button>
            </div>
          )}

          {/* Step 2: Payment (non-Genius Pay) */}
          {step === 'payment' && (
            <div className="space-y-5">
              <p className="text-muted-foreground text-sm">Choisissez votre mode de paiement pour <span className="text-primary font-black">{grandTotal.toLocaleString('fr-FR')} XOF</span></p>

              <div className="space-y-3">
                {paymentMethods.filter(p => p.id !== 'geniuspay').map(pm => (
                  <button
                    key={pm.id}
                    onClick={() => setPayment(pm.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                      payment === pm.id
                        ? 'border-primary bg-primary/10' :'border-border bg-muted hover:border-muted-foreground'
                    }`}
                  >
                    <span className="text-2xl">{pm.icon}</span>
                    <span className="font-black text-foreground text-sm flex-1 text-left">{pm.label}</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      payment === pm.id ? 'border-primary' : 'border-muted-foreground'
                    }`}>
                      {payment === pm.id && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                  </button>
                ))}
              </div>

              {payment !== 'cash' && (
                <div className="bg-muted rounded-2xl p-4 text-sm text-muted-foreground">
                  <p className="font-black text-foreground mb-1">Instructions de paiement</p>
                  <p>Envoyez <span className="text-primary font-black">{grandTotal.toLocaleString('fr-FR')} XOF</span> au numéro <span className="font-bold text-foreground">{settings.whatsappNumber}</span> via {paymentMethods.find(p => p.id === payment)?.label}.</p>
                  <p className="mt-1">Référence: <span className="font-bold text-foreground">RD-{Date.now().toString().slice(-6)}</span></p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('form')}
                  className="flex-1 py-3 bg-muted text-foreground font-black text-sm uppercase tracking-wider rounded-2xl hover:bg-muted/70 transition-colors"
                >
                  ← Retour
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="flex-1 py-3 bg-primary text-primary-foreground font-black text-sm uppercase tracking-wider rounded-2xl hover:bg-accent transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                      <path d="M12 2a10 10 0 0110 10" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <>Confirmer la Commande</>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
            <div className="text-center py-8 space-y-6">
              <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto animate-bounce-in">
                <Icon name="CheckIcon" size={40} className="text-success" variant="solid" />
              </div>
              <div>
                <h3 className="font-black text-foreground text-2xl mb-2">Commande Reçue !</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Merci <span className="text-foreground font-bold">{form.name}</span> ! Votre commande est confirmée.
                  Nous vous contactons sur <span className="text-primary font-bold">{form.phone}</span> dans quelques minutes.
                </p>
              </div>
              <div className="bg-muted rounded-2xl p-4 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Numéro de commande</span>
                  <span className="font-black text-foreground">RD-{Date.now().toString().slice(-6)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Montant</span>
                  <span className="font-black text-primary">{grandTotal.toLocaleString('fr-FR')} XOF</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Livraison estimée</span>
                  <span className="font-black text-foreground">{settings.estimatedDelivery}</span>
                </div>
              </div>
              <a
                href={`https://wa.me/${waNumber}?text=Bonjour%20${encodeURIComponent(settings.restaurantName)}%2C%20j%27ai%20pass%C3%A9%20une%20commande%20de%20${grandTotal}%20XOF.%20Mon%20nom%20est%20${encodeURIComponent(form.name)}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-[#25D366] text-white font-black text-sm uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Suivre sur WhatsApp
              </a>
              <button onClick={onClose} className="text-muted-foreground text-sm font-bold hover:text-foreground transition-colors">
                Fermer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
