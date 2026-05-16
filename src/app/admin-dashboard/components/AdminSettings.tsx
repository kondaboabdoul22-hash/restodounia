'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSiteSettings, HeroSlide } from '@/contexts/SiteSettingsContext';

type Section = 'dashboard' | 'restaurant' | 'hero' | 'social' | 'livraison' | 'commandes' | 'sections' | 'paiements' | 'promo' | 'seo' | 'securite' | 'maintenance';

const sections: { key: Section; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Tableau de bord', icon: '📊' },
  { key: 'commandes', label: 'Commandes', icon: '📋' },
  { key: 'restaurant', label: 'Restaurant', icon: '🏪' },
  { key: 'hero', label: 'Hero & Contenu', icon: '🖼️' },
  { key: 'social', label: 'Réseaux sociaux', icon: '📱' },
  { key: 'livraison', label: 'Livraison', icon: '🛵' },
  { key: 'sections', label: 'Sections du site', icon: '📄' },
  { key: 'paiements', label: 'Paiements', icon: '💳' },
  { key: 'promo', label: 'Code promo', icon: '🎁' },
  { key: 'seo', label: 'SEO', icon: '🔍' },
  { key: 'securite', label: 'Sécurité', icon: '🔒' },
  { key: 'maintenance', label: 'Maintenance', icon: '⚙️' },
];

export default function AdminSettings() {
  const { settings, updateSettings, resetSettings, saved } = useSiteSettings();
  const [activeSection, setActiveSection] = useState<Section>('restaurant');

  const update = (partial: Partial<typeof settings>) => updateSettings(partial);

  const updatePayment = (key: 'paymentOrange' | 'paymentMoov' | 'paymentWave' | 'paymentCash' | 'paymentYengaPay', value: boolean) => {
    update({ [key]: value });
  };

  const updateSlide = (index: number, slide: Partial<HeroSlide>) => {
    const slides = [...settings.heroSlides];
    slides[index] = { ...slides[index], ...slide };
    update({ heroSlides: slides });
  };

  const addSlide = () => {
    update({
      heroSlides: [...settings.heroSlides, { tag: 'Nouveau', headline: 'Titre', sub: 'Description', image: '', alt: '' }],
    });
  };

  const removeSlide = (index: number) => {
    if (settings.heroSlides.length <= 1) return;
    update({ heroSlides: settings.heroSlides.filter((_, i) => i !== index) });
  };

  const Input = ({ label, value, onChange, type = 'text', min, max, placeholder }: {
    label: string; value: string | number; onChange: (v: string) => void; type?: string; min?: number; max?: number; placeholder?: string;
  }) => {
    const [local, setLocal] = useState(String(value));
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (document.activeElement !== inputRef.current) {
        setLocal(String(value));
      }
    }, [value]);

    return (
      <div>
        <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">{label}</label>
        <input
          ref={inputRef}
          type={type}
          value={local}
          onChange={e => setLocal(e.target.value)}
          onBlur={() => onChange(local)}
          min={min}
          max={max}
          placeholder={placeholder}
          className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm touch-manipulation"
        />
      </div>
    );
  };

  const Toggle = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
    <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
      <span className="font-black text-foreground text-sm">{label}</span>
      <label className="toggle-switch" aria-label={label}>
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
        <span className="toggle-slider" />
      </label>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'commandes':
        return (
          <div className="space-y-5">
            <h3 className="font-black text-foreground text-lg">Gestion des Commandes</h3>

            <div className="border-t border-border pt-5">
              <h4 className="font-black text-foreground mb-4">Libellés des Statuts</h4>
              <div className="grid grid-cols-2 gap-3">
                <Input label="En attente" value={settings.orderStatusLabels.en_attente} onChange={v => update({ orderStatusLabels: { ...settings.orderStatusLabels, en_attente: v } })} />
                <Input label="En préparation" value={settings.orderStatusLabels.en_preparation} onChange={v => update({ orderStatusLabels: { ...settings.orderStatusLabels, en_preparation: v } })} />
                <Input label="Livré" value={settings.orderStatusLabels.livre} onChange={v => update({ orderStatusLabels: { ...settings.orderStatusLabels, livre: v } })} />
                <Input label="Annulé" value={settings.orderStatusLabels.annule} onChange={v => update({ orderStatusLabels: { ...settings.orderStatusLabels, annule: v } })} />
              </div>
            </div>

            <div className="border-t border-border pt-5">
              <h4 className="font-black text-foreground mb-4">Paramètres</h4>
              <Toggle label="Autoriser l'annulation des commandes" checked={settings.orderCancelEnabled} onChange={v => update({ orderCancelEnabled: v })} />
            </div>

            <div className="border-t border-border pt-5">
              <h4 className="font-black text-foreground mb-4">Motifs d'annulation prédéfinis</h4>
              <p className="text-muted-foreground text-xs mb-3">Un motif par ligne.</p>
              <textarea
                value={settings.orderDefaultCancelReasons.join('\n')}
                onChange={e => update({ orderDefaultCancelReasons: e.target.value.split('\n').filter(s => s.trim()) })}
                rows={5}
                className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none touch-manipulation"
              />
            </div>

            <div className="border-t border-border pt-5">
              <h4 className="font-black text-foreground mb-4">Message WhatsApp</h4>
              <p className="text-muted-foreground text-xs mb-3">Utilisez {'{customer}'} et {'{order}'} comme variables.</p>
              <Input label="Template message" value={settings.orderWhatsAppTemplate} onChange={v => update({ orderWhatsAppTemplate: v })} placeholder="Bonjour {customer}, votre commande {order}..." />
            </div>
          </div>
        );

      case 'restaurant':
        return (
          <div className="space-y-5">
            <h3 className="font-black text-foreground text-lg">Informations du Restaurant</h3>
            <Input label="Nom du restaurant" value={settings.restaurantName} onChange={v => update({ restaurantName: v })} />
            <Input label="Slogan" value={settings.tagline} onChange={v => update({ tagline: v })} />
            <Input label="Description" value={settings.description} onChange={v => update({ description: v })} />
            <Input label="Email de contact" value={settings.contactEmail} onChange={v => update({ contactEmail: v })} />
            <Input label="Numéro WhatsApp" value={settings.whatsappNumber} onChange={v => update({ whatsappNumber: v })} />
            <Input label="Téléphone" value={settings.phoneNumber} onChange={v => update({ phoneNumber: v })} />
            <Input label="Adresse" value={settings.address} onChange={v => update({ address: v })} />
            <Input label="Horaires d'ouverture" value={settings.openHours} onChange={v => update({ openHours: v })} />
          </div>
        );

      case 'hero':
        return (
          <div className="space-y-5">
            <h3 className="font-black text-foreground text-lg">Contenu du Hero</h3>
            <Input label="Titre principal" value={settings.heroTagline} onChange={v => update({ heroTagline: v })} />
            <Input label="Sous-titre" value={settings.heroSubheadline} onChange={v => update({ heroSubheadline: v })} />
            <Input label="Commandes/jour (stat)" value={settings.statsOrderPerDay} onChange={v => update({ statsOrderPerDay: v })} />
            <Input label="Temps livraison (stat)" value={settings.statsDeliveryTime} onChange={v => update({ statsDeliveryTime: v })} />
            <Input label="Note (stat)" value={settings.statsRating} onChange={v => update({ statsRating: v })} />

            <div className="border-t border-border pt-5">
              <h4 className="font-black text-foreground mb-4">Slides du Hero ({settings.heroSlides.length})</h4>
              {settings.heroSlides.map((slide, i) => (
                <div key={i} className="bg-muted rounded-xl p-4 mb-4 space-y-3 border border-border">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-foreground">Slide {i + 1}</span>
                    {settings.heroSlides.length > 1 && (
                      <button onClick={() => removeSlide(i)} className="text-red-400 text-xs font-black uppercase hover:text-red-300">Supprimer</button>
                    )}
                  </div>
                  <Input label="Tag" value={slide.tag} onChange={v => updateSlide(i, { tag: v })} />
                  <Input label="Titre (utilisez \\n pour un retour à la ligne)" value={slide.headline} onChange={v => updateSlide(i, { headline: v })} />
                  <Input label="Sous-titre" value={slide.sub} onChange={v => updateSlide(i, { sub: v })} />
                  <Input label="URL de l'image" value={slide.image} onChange={v => updateSlide(i, { image: v })} />
                  <Input label="Texte alternatif" value={slide.alt} onChange={v => updateSlide(i, { alt: v })} />
                </div>
              ))}
              <button onClick={addSlide} className="px-4 py-2 bg-primary text-primary-foreground font-black text-xs uppercase tracking-wider rounded-xl hover:bg-accent transition-colors">
                + Ajouter une slide
              </button>
            </div>
          </div>
        );

      case 'social':
        return (
          <div className="space-y-5">
            <h3 className="font-black text-foreground text-lg">Réseaux Sociaux</h3>
            <Input label="Facebook URL" value={settings.facebookUrl} onChange={v => update({ facebookUrl: v })} />
            <Input label="Instagram URL" value={settings.instagramUrl} onChange={v => update({ instagramUrl: v })} />
            <Input label="Twitter / X URL" value={settings.twitterUrl} onChange={v => update({ twitterUrl: v })} />
            <Input label="TikTok URL" value={settings.tiktokUrl} onChange={v => update({ tiktokUrl: v })} />
          </div>
        );

      case 'livraison':
        return (
          <div className="space-y-5">
            <h3 className="font-black text-foreground text-lg">Paramètres de Livraison</h3>
            <Input label="Frais de livraison (XOF)" type="number" value={settings.deliveryFee} onChange={v => update({ deliveryFee: parseInt(v) || 0 })} />
            <Input label="Montant minimum de commande (XOF)" type="number" value={settings.minOrderAmount} onChange={v => update({ minOrderAmount: parseInt(v) || 0 })} />
            <Input label="Temps de livraison estimé" value={settings.estimatedDelivery} onChange={v => update({ estimatedDelivery: v })} />
          </div>
        );

      case 'sections':
        return (
          <div className="space-y-5">
            <h3 className="font-black text-foreground text-lg">Afficher / Masquer les Sections</h3>
            <p className="text-muted-foreground text-sm">Activez ou désactivez chaque section du site.</p>
            <Toggle label="Section Hero (accueil)" checked={settings.showHero} onChange={v => update({ showHero: v })} />
            <Toggle label="Comment ça marche" checked={settings.showHowItWorks} onChange={v => update({ showHowItWorks: v })} />
            <Toggle label="Avis clients" checked={settings.showTestimonials} onChange={v => update({ showTestimonials: v })} />
            <Toggle label="Section CTA (Appel à l'action)" checked={settings.showCTA} onChange={v => update({ showCTA: v })} />
            <Toggle label="Bouton WhatsApp flottant" checked={settings.showWhatsAppBtn} onChange={v => update({ showWhatsAppBtn: v })} />
          </div>
        );

      case 'paiements':
        return (
          <div className="space-y-5">
            <h3 className="font-black text-foreground text-lg">Moyens de Paiement</h3>
            <p className="text-muted-foreground text-sm">Activez ou désactivez les modes de paiement disponibles.</p>
            <Toggle label="Orange Money" checked={settings.paymentOrange} onChange={v => updatePayment('paymentOrange', v)} />
            <Toggle label="Moov Money" checked={settings.paymentMoov} onChange={v => updatePayment('paymentMoov', v)} />
            <Toggle label="Wave" checked={settings.paymentWave} onChange={v => updatePayment('paymentWave', v)} />
            <Toggle label="Paiement à la livraison" checked={settings.paymentCash} onChange={v => updatePayment('paymentCash', v)} />
            <Toggle label="LeekPay (Mobile Money & Carte)" checked={settings.paymentYengaPay} onChange={v => updatePayment('paymentYengaPay', v)} />
          </div>
        );

      case 'promo':
        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-foreground text-lg">Code Promo</h3>
              <Toggle label="Activer promo" checked={settings.promoEnabled} onChange={v => update({ promoEnabled: v })} />
            </div>
            {settings.promoEnabled && (
              <>
                <Input label="Code promo" value={settings.promoCode} onChange={v => update({ promoCode: v.toUpperCase() })} />
                <Input label="Réduction (%)" type="number" min={1} max={100} value={settings.promoDiscount} onChange={v => update({ promoDiscount: parseInt(v) || 0 })} />
                <div className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/30 rounded-xl">
                  <span className="text-xl">✅</span>
                  <p className="text-sm text-foreground font-medium">
                    Code <span className="font-black text-primary">{settings.promoCode}</span> actif — {settings.promoDiscount}% de réduction.
                  </p>
                </div>
              </>
            )}
          </div>
        );

      case 'seo':
        return (
          <div className="space-y-5">
            <h3 className="font-black text-foreground text-lg">Référencement (SEO)</h3>
            <Input label="Meta Title" value={settings.metaTitle} onChange={v => update({ metaTitle: v })} />
            <Input label="Meta Description" value={settings.metaDescription} onChange={v => update({ metaDescription: v })} />
            <Input label="Open Graph Title" value={settings.ogTitle} onChange={v => update({ ogTitle: v })} />
            <Input label="Open Graph Description" value={settings.ogDescription} onChange={v => update({ ogDescription: v })} />
          </div>
        );

      case 'securite':
        return (
          <div className="space-y-5">
            <h3 className="font-black text-foreground text-lg">Identifiants Administrateur</h3>
            <p className="text-muted-foreground text-sm">Modifiez l'email et le mot de passe de connexion à l'administration.</p>
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <p className="text-amber-400 text-xs font-medium">
                ⚠️ Les identifiants sont stockés localement dans votre navigateur. Assurez-vous de les mémoriser.
              </p>
            </div>
            <Input label="Email administrateur" value={settings.adminEmail} onChange={v => update({ adminEmail: v })} />
            <Input label="Nouveau mot de passe" type="password" value={settings.adminPassword} onChange={v => update({ adminPassword: v })} placeholder="Entrez un nouveau mot de passe" />
          </div>
        );

      case 'dashboard':
        return (
          <div className="space-y-5">
            <h3 className="font-black text-foreground text-lg">Personnaliser le Tableau de Bord</h3>
            <Input label="Message d'accueil" value={settings.dashboardWelcome} onChange={v => update({ dashboardWelcome: v })} placeholder="Bonjour, heureux de vous revoir !" />

            <div className="border-t border-border pt-5">
              <h4 className="font-black text-foreground mb-4">Cartes Statistiques</h4>
              {settings.dashboardCards.map((card, i) => (
                <div key={i} className="bg-muted rounded-xl p-4 mb-4 space-y-3 border border-border">
                  <p className="font-bold text-sm text-foreground">Carte {i + 1}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Icône" value={card.icon} onChange={v => {
                      const c = [...settings.dashboardCards];
                      c[i] = { ...c[i], icon: v };
                      update({ dashboardCards: c });
                    }} />
                    <Input label="Valeur" value={card.value} onChange={v => {
                      const c = [...settings.dashboardCards];
                      c[i] = { ...c[i], value: v };
                      update({ dashboardCards: c });
                    }} />
                    <Input label="Label" value={card.label} onChange={v => {
                      const c = [...settings.dashboardCards];
                      c[i] = { ...c[i], label: v };
                      update({ dashboardCards: c });
                    }} />
                    <Input label="Sous-texte" value={card.sub} onChange={v => {
                      const c = [...settings.dashboardCards];
                      c[i] = { ...c[i], sub: v };
                      update({ dashboardCards: c });
                    }} />
                    <Input label="Tendance (ex: +12%)" value={card.trend} onChange={v => {
                      const c = [...settings.dashboardCards];
                      c[i] = { ...c[i], trend: v };
                      update({ dashboardCards: c });
                    }} />
                    <Toggle label="Tendance positive" checked={card.trendUp} onChange={v => {
                      const c = [...settings.dashboardCards];
                      c[i] = { ...c[i], trendUp: v };
                      update({ dashboardCards: c });
                    }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-5">
              <h4 className="font-black text-foreground mb-4">Sections du Dashboard</h4>
              <Toggle label="Afficher le graphique des revenus" checked={settings.dashboardShowChart} onChange={v => update({ dashboardShowChart: v })} />
              <Toggle label="Afficher les commandes récentes" checked={settings.dashboardShowRecentOrders} onChange={v => update({ dashboardShowRecentOrders: v })} />
            </div>

            {settings.dashboardShowChart && (
              <div className="border-t border-border pt-5">
                <h4 className="font-black text-foreground mb-4">Données du Graphique</h4>
                {settings.dashboardChartData.map((d, i) => (
                  <div key={i} className="bg-muted rounded-xl p-4 mb-3 space-y-3 border border-border">
                    <p className="font-bold text-sm text-foreground">Jour {i + 1}</p>
                    <div className="grid grid-cols-3 gap-3">
                      <Input label="Jour" value={d.day} onChange={v => {
                        const c = [...settings.dashboardChartData];
                        c[i] = { ...c[i], day: v };
                        update({ dashboardChartData: c });
                      }} />
                      <Input label="Montant" value={d.amount} onChange={v => {
                        const c = [...settings.dashboardChartData];
                        c[i] = { ...c[i], amount: v };
                        update({ dashboardChartData: c });
                      }} />
                      <Input label="Hauteur" type="number" value={d.value} onChange={v => {
                        const c = [...settings.dashboardChartData];
                        c[i] = { ...c[i], value: parseInt(v) || 0 };
                        update({ dashboardChartData: c });
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex gap-6 flex-col lg:flex-row">
      {/* Sidebar navigation */}
      <div className="lg:w-64 flex-shrink-0 space-y-1">
        {sections.map(sec => (
          <button
            key={sec.key}
            onClick={() => setActiveSection(sec.key)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black transition-all ${
              activeSection === sec.key
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <span>{sec.icon}</span>
            <span className="uppercase tracking-wider text-xs">{sec.label}</span>
          </button>
        ))}
        <button
          onClick={resetSettings}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black text-red-400 hover:bg-red-500/10 transition-all mt-6"
        >
          <span>↺</span>
          <span className="uppercase tracking-wider text-xs">Réinitialiser</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 bg-card border border-border rounded-2xl p-6 space-y-5">
        {renderContent()}

        {/* Save indicator */}
        <div className="pt-4 border-t border-border">
          <div className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all ${
            saved ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'
          }`}>
            {saved ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                <span className="font-black text-xs uppercase tracking-wider">Paramètres enregistrés automatiquement ✓</span>
              </>
            ) : (
              <span className="font-black text-xs uppercase tracking-wider">Les modifications sont sauvegardées automatiquement</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
