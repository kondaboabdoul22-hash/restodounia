'use client';

import React, { useEffect, useRef, useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import { useCart } from './CartProvider';

const heroSlides = [
{
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1e45257ec-1777985019629.png",
  alt: 'Vibrant African cuisine spread on dark wooden table, rich colors, warm candlelight, deep shadows, moody restaurant atmosphere',
  tag: 'Spécialité du Jour',
  headline: 'La saveur\nde chez nous.',
  sub: 'Plats authentiques, livrés chauds à votre porte à Ouagadougou.'
},
{
  image: "https://images.unsplash.com/photo-1530085438345-a3f5313c6897",
  alt: 'Grilled meat and vegetables on dark plate, dramatic dark background, restaurant fine dining, low-key moody lighting',
  tag: 'Grillades Maison',
  headline: 'Grillé\nà la perfection.',
  sub: 'Viandes marinées et grillées sur feu de bois, livrées en 30 min.'
},
{
  image: "https://images.unsplash.com/photo-1661881781609-e2b6adc0b27b",
  alt: 'Colorful African breakfast bowl with fresh fruits on dark surface, dramatic shadows, atmospheric dim lighting',
  tag: 'Nouveauté',
  headline: 'Fraîcheur\net tradition.',
  sub: 'Des ingrédients locaux sélectionnés chaque matin au marché.'
}];


export default function HeroSection() {
  const [active, setActive] = React.useState(0);
  const [animating, setAnimating] = React.useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { openCart } = useCart();

  const goTo = (idx: number) => {
    if (animating || idx === active) return;
    setAnimating(true);
    setTimeout(() => {
      setActive(idx);
      setAnimating(false);
    }, 300);
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => {if (intervalRef.current) clearInterval(intervalRef.current);};
  }, []);

  const slide = heroSlides[active];

  return (
    <section className="relative w-full min-h-screen flex items-end overflow-hidden" aria-label="Accueil RestoDounia">
      {/* Background image */}
      <div className={`absolute inset-0 transition-opacity duration-700 ${animating ? 'opacity-0' : 'opacity-100'}`}>
        <AppImage
          src={slide.image}
          alt={slide.alt}
          fill
          priority
          className="object-cover"
          sizes="100vw" />
        
        {/* Scrim */}
        <div className="absolute inset-0 hero-scrim-mobile md:hidden" />
        <div className="absolute inset-0 hero-scrim hidden md:block" />
        {/* Grain */}
        <div className="absolute inset-0 grain-overlay" />
      </div>

      {/* Atmospheric blobs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 blob-primary rounded-full pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-20 md:pb-32 pt-32">
        <div className="max-w-2xl">
          {/* Tag */}
          <div className={`inline-flex items-center gap-2 mb-6 transition-all duration-500 ${animating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">{slide.tag}</span>
          </div>

          {/* Headline */}
          <h1 className={`text-hero-xl font-black tracking-tighter text-white leading-none mb-6 transition-all duration-500 ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
          style={{ transitionDelay: '50ms' }}>
            {slide.headline.split('\n').map((line, i) =>
            <span key={i} className="block">{i === 1 ? <span className="gradient-text">{line}</span> : line}</span>
            )}
          </h1>

          {/* Sub */}
          <p className={`text-white/75 text-lg md:text-xl font-medium leading-relaxed mb-10 max-w-md transition-all duration-500 ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
          style={{ transitionDelay: '100ms' }}>
            {slide.sub}
          </p>

          {/* CTAs */}
          <div className={`flex flex-wrap gap-4 transition-all duration-500 ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
          style={{ transitionDelay: '150ms' }}>
            <a
              href="#menu"
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest rounded-full hover:scale-105 transition-transform shadow-xl animate-pulse-glow">
              
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
              Commander Maintenant
            </a>
            <button
              onClick={openCart}
              className="inline-flex items-center gap-3 px-8 py-4 border border-white/30 text-white font-black text-sm uppercase tracking-widest rounded-full hover:bg-white/10 hover:border-white/60 transition-all backdrop-blur-sm">
              
              Voir le Panier
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className={`flex flex-wrap gap-8 mt-16 transition-all duration-700 ${animating ? 'opacity-0' : 'opacity-100'}`}
        style={{ transitionDelay: '200ms' }}>
          {[
          { value: '500+', label: 'Commandes / jour' },
          { value: '30 min', label: 'Livraison moyenne' },
          { value: '4.9★', label: 'Note clients' }].
          map((stat, i) =>
          <div key={i} className="flex items-center gap-3">
              <div>
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-white/40">{stat.label}</p>
              </div>
              {i < 2 && <div className="w-px h-10 bg-white/10 ml-8" />}
            </div>
          )}
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 right-8 md:right-12 z-10 flex flex-col gap-2">
        {heroSlides.map((_, i) =>
        <button
          key={i}
          onClick={() => goTo(i)}
          className={`rounded-full transition-all duration-300 ${i === active ? 'w-1 h-8 bg-primary' : 'w-1 h-3 bg-white/30 hover:bg-white/60'}`}
          aria-label={`Diapositive ${i + 1}`} />

        )}
      </div>
    </section>);

}