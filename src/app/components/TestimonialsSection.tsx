'use client';

import React, { useEffect, useRef } from 'react';
import AppImage from '@/components/ui/AppImage';

const testimonials = [
{
  quote: 'RestoDounia, c\'est ma cantine du midi ! Le riz gras est exactement comme ma mère le faisait. Livraison rapide et le livreur est toujours ponctuel.',
  name: 'Adama Kaboré',
  role: 'Ingénieur, Ouagadougou',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_169f8d19b-1768327385999.png",
  stat: { value: '50+', label: 'Commandes passées' }
},
{
  quote: 'J\'ai découvert RestoDounia par hasard et je ne commande plus ailleurs. Le poulet yassa est divin et le paiement Orange Money est très pratique.',
  name: 'Fatimata Traoré',
  role: 'Enseignante, Ouagadougou',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_129b234fd-1775142991294.png",
  stat: { value: '4.9★', label: 'Note donnée' }
},
{
  quote: 'Excellent service ! Les brochettes arrivent encore chaudes. Je commande pour toute mon équipe le vendredi et ils sont toujours ravis.',
  name: 'Ibrahim Sawadogo',
  role: 'Chef de projet, Secteur 15',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_14f2de1aa-1778799788845.png",
  stat: { value: '30 min', label: 'Livraison moyenne' }
}];


export default function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.animate-on-scroll').forEach((el, i) => {
              setTimeout(() => el.classList.add('is-visible'), i * 120);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (ref?.current) observer?.observe(ref?.current);
    return () => observer?.disconnect();
  }, []);

  return (
    <section className="py-20 md:py-28 bg-background" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="animate-on-scroll mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-3">Ils nous font confiance</p>
            <h2 className="text-section-xl font-black tracking-tighter text-foreground">
              Ce que disent<br />
              <span className="gradient-text">nos clients.</span>
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-4xl font-black text-foreground">2,400+</p>
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Clients satisfaits</p>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <p className="text-4xl font-black text-foreground">98%</p>
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Recommandent</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials?.map((t, i) =>
          <div
            key={i}
            className="animate-on-scroll card-hover bg-card border border-border rounded-3xl p-8 flex flex-col justify-between gap-6"
            style={{ transitionDelay: `${i * 120}ms` }}>
            
              {/* Stars */}
              <div className="flex gap-1">
                {[...Array(5)]?.map((_, j) =>
              <svg key={j} className="w-4 h-4 text-primary fill-primary" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              )}
              </div>

              <blockquote className="text-foreground font-medium leading-relaxed flex-1">
                "{t?.quote}"
              </blockquote>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-primary/30">
                  <AppImage src={t?.image} alt={t?.name} width={48} height={48} className="object-cover w-full h-full" />
                </div>
                <div className="flex-1">
                  <p className="font-black text-foreground text-sm">{t?.name}</p>
                  <p className="text-muted-foreground text-xs">{t?.role}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-primary text-lg">{t?.stat?.value}</p>
                  <p className="text-muted-foreground text-[10px] uppercase tracking-wider">{t?.stat?.label}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}