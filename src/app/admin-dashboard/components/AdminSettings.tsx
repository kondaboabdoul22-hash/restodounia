'use client';

import React, { useState } from 'react';

interface SiteSettings {
  restaurantName: string;
  whatsappNumber: string;
  deliveryFee: number;
  openHours: string;
  address: string;
  payments: {
    orange: boolean;
    moov: boolean;
    wave: boolean;
    cash: boolean;
  };
  promoEnabled: boolean;
  promoCode: string;
  promoDiscount: number;
}

const defaultSettings: SiteSettings = {
  restaurantName: 'RestoDounia',
  whatsappNumber: '+226 70 12 34 56',
  deliveryFee: 500,
  openHours: '11h00 - 22h00, 7j/7',
  address: 'Secteur 15, Ouagadougou, Burkina Faso',
  payments: {
    orange: true,
    moov: true,
    wave: true,
    cash: true,
  },
  promoEnabled: false,
  promoCode: 'DOUNIA10',
  promoDiscount: 10,
};

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Mock save
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const updatePayment = (key: keyof SiteSettings['payments'], value: boolean) => {
    setSettings(s => ({ ...s, payments: { ...s.payments, [key]: value } }));
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Restaurant Info */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
        <h3 className="font-black text-foreground text-lg flex items-center gap-2">
          <span>🏪</span> Informations du Restaurant
        </h3>

        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Nom du Restaurant</label>
          <input
            type="text"
            value={settings.restaurantName}
            onChange={e => setSettings(s => ({ ...s, restaurantName: e.target.value }))}
            className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Numéro WhatsApp</label>
          <input
            type="tel"
            value={settings.whatsappNumber}
            onChange={e => setSettings(s => ({ ...s, whatsappNumber: e.target.value }))}
            className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Adresse</label>
          <input
            type="text"
            value={settings.address}
            onChange={e => setSettings(s => ({ ...s, address: e.target.value }))}
            className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Horaires d'ouverture</label>
          <input
            type="text"
            value={settings.openHours}
            onChange={e => setSettings(s => ({ ...s, openHours: e.target.value }))}
            className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Frais de Livraison (XOF)</label>
          <input
            type="number"
            value={settings.deliveryFee}
            onChange={e => setSettings(s => ({ ...s, deliveryFee: parseInt(e.target.value) || 0 }))}
            className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <h3 className="font-black text-foreground text-lg flex items-center gap-2">
          <span>💳</span> Moyens de Paiement
        </h3>
        <p className="text-muted-foreground text-sm">Activez ou désactivez les modes de paiement disponibles pour vos clients.</p>

        {([
          { key: 'orange', label: 'Orange Money', emoji: '🟠' },
          { key: 'moov', label: 'Moov Money', emoji: '🟢' },
          { key: 'wave', label: 'Wave', emoji: '🔵' },
          { key: 'cash', label: 'Paiement à la livraison', emoji: '💵' },
        ] as const).map(pm => (
          <div key={pm.key} className="flex items-center justify-between p-4 bg-muted rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{pm.emoji}</span>
              <span className="font-black text-foreground text-sm">{pm.label}</span>
            </div>
            <label className="toggle-switch" aria-label={`${settings.payments[pm.key] ? 'Désactiver' : 'Activer'} ${pm.label}`}>
              <input
                type="checkbox"
                checked={settings.payments[pm.key]}
                onChange={e => updatePayment(pm.key, e.target.checked)}
              />
              <span className="toggle-slider" />
            </label>
          </div>
        ))}
      </div>

      {/* Promo / Réduction */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-foreground text-lg flex items-center gap-2">
            <span>🎁</span> Code Promo
          </h3>
          <label className="toggle-switch" aria-label="Activer les codes promo">
            <input
              type="checkbox"
              checked={settings.promoEnabled}
              onChange={e => setSettings(s => ({ ...s, promoEnabled: e.target.checked }))}
            />
            <span className="toggle-slider" />
          </label>
        </div>

        {settings.promoEnabled && (
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Code Promo</label>
              <input
                type="text"
                value={settings.promoCode}
                onChange={e => setSettings(s => ({ ...s, promoCode: e.target.value.toUpperCase() }))}
                placeholder="DOUNIA10"
                className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm font-bold tracking-widest uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Réduction (%)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={settings.promoDiscount}
                onChange={e => setSettings(s => ({ ...s, promoDiscount: parseInt(e.target.value) || 0 }))}
                className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/30 rounded-xl">
              <span className="text-xl">✅</span>
              <p className="text-sm text-foreground font-medium">
                Code <span className="font-black text-primary">{settings.promoCode}</span> actif — {settings.promoDiscount}% de réduction sur toute commande.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        className={`w-full py-4 font-black text-sm uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 ${
          saved
            ? 'bg-success text-white' :'bg-primary text-primary-foreground hover:bg-accent'
        }`}
      >
        {saved ? (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
            Paramètres Enregistrés !
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>
            Enregistrer les Paramètres
          </>
        )}
      </button>
    </div>
  );
}