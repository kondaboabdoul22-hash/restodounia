'use client';

import React, { useEffect, useRef } from 'react';

const steps = [
  {
    number: '01',
    icon: '🍽️',
    title: 'Choisissez vos plats',
    description: 'Parcourez notre menu et ajoutez vos plats préférés au panier en un clic.',
    color: 'from-primary/20 to-primary/5',
    border: 'border-primary/30',
  },
  {
    number: '02',
    icon: '📱',
    title: 'Payez facilement',
    description: 'Réglez avec Orange Money, Moov Money, Wave ou à la livraison. Simple et sécurisé.',
    color: 'from-accent/20 to-accent/5',
    border: 'border-accent/30',
  },
  {
    number: '03',
    icon: '🛵',
    title: 'Recevez en 30 min',
    description: 'Notre livreur vous apporte votre commande chaude directement à votre porte.',
    color: 'from-success/20 to-success/5',
    border: 'border-success/30',
  },
];

export default function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.animate-on-scroll').forEach((el, i) => {
              setTimeout(() => el.classList.add('is-visible'), i * 150);
            });
          }
        });
      },
      { threshold: 0.2 }
    );
    if (ref?.current) observer?.observe(ref?.current);
    return () => observer?.disconnect();
  }, []);

  return (
    <section className="py-20 md:py-28 bg-secondary relative overflow-hidden" ref={ref}>
      {/* Background blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 blob-primary rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 blob-accent rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="animate-on-scroll text-center mb-16">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-3">Comment ça marche</p>
          <h2 className="text-section-xl font-black tracking-tighter text-foreground mb-4">
            Commander en <span className="gradient-text">3 étapes simples</span>
          </h2>
          <p className="text-muted-foreground font-medium max-w-md mx-auto">
            De la sélection à la livraison, tout est pensé pour vous faciliter la vie.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line - desktop */}
          <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {steps?.map((step, i) => (
            <div
              key={i}
              className={`animate-on-scroll relative bg-gradient-to-br ${step?.color} border ${step?.border} rounded-3xl p-8 text-center`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              {/* Number badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground font-black text-xs flex items-center justify-center shadow-lg">
                {step?.number}
              </div>

              <div className="text-5xl mb-6 mt-4 animate-float" style={{ animationDelay: `${i * 0.5}s` }}>
                {step?.icon}
              </div>
              <h3 className="font-black text-foreground text-xl mb-3">{step?.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step?.description}</p>
            </div>
          ))}
        </div>

        {/* Payment logos */}
        <div className="animate-on-scroll mt-16 text-center">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground mb-6">Moyens de paiement acceptés</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {[
              { label: 'Orange Money', color: '#FF6600', emoji: '🟠' },
              { label: 'Moov Money', color: '#00A651', emoji: '🟢' },
              { label: 'Wave', color: '#1DC2FF', emoji: '🔵' },
              { label: 'Cash', color: '#9A8F87', emoji: '💵' },
            ]?.map((p, i) => (
              <div key={i} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-muted border border-border">
                <span className="text-lg">{p?.emoji}</span>
                <span className="font-black text-sm text-foreground">{p?.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}