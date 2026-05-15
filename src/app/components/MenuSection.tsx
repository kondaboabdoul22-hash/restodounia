'use client';

import React, { useState, useEffect, useRef } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { useCart, MenuItem } from './CartProvider';

const menuItems: MenuItem[] = [
// Plats
{
  id: 'p1',
  name: 'Riz Gras au Poulet',
  description: 'Riz cuit dans un bouillon épicé avec poulet fermier, légumes frais et sauce tomate maison.',
  price: 2500,
  image: "https://images.unsplash.com/photo-1709731104921-74ed63f7c4ef",
  category: 'plats',
  active: true
},
{
  id: 'p2',
  name: 'Tô à la Sauce Gombo',
  description: 'Pâte de maïs traditionnelle servie avec sauce gombo aux légumes et viande de bœuf.',
  price: 1800,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1b4c84738-1768833255119.png",
  category: 'plats',
  active: true
},
{
  id: 'p3',
  name: 'Brochettes de Bœuf',
  description: 'Brochettes marinées grillées sur charbon, servies avec oignons, tomates et sauce pimentée.',
  price: 3000,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_199986f07-1765245696752.png",
  category: 'plats',
  active: true
},
{
  id: 'p4',
  name: 'Poulet Yassa',
  description: 'Poulet braisé mariné au citron et oignons caramélisés, servi avec riz basmati.',
  price: 3500,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_16a69d58f-1767015440045.png",
  category: 'plats',
  active: true
},
{
  id: 'p5',
  name: 'Thiéboudienne',
  description: 'Riz au poisson sénégalais avec légumes variés, sauce tomate concentrée et épices locales.',
  price: 3200,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_127dd96e3-1774407436834.png",
  category: 'plats',
  active: true
},
{
  id: 'p6',
  name: 'Alloco Poulet',
  description: 'Bananes plantains frites dorées, servies avec poulet grillé et sauce piquante maison.',
  price: 2200,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1e50f7f5a-1772818698896.png",
  category: 'plats',
  active: true
},
// Boissons
{
  id: 'b1',
  name: 'Bissap Frais',
  description: 'Jus d\'hibiscus naturel, légèrement sucré, servi bien frais avec glaçons.',
  price: 500,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_123a91f5f-1765095384593.png",
  category: 'boissons',
  active: true
},
{
  id: 'b2',
  name: 'Gingembre Citron',
  description: 'Boisson artisanale au gingembre frais pressé, jus de citron vert et miel local.',
  price: 600,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_14baa7eb4-1771884523907.png",
  category: 'boissons',
  active: true
},
{
  id: 'b3',
  name: 'Dégué Lacté',
  description: 'Boisson traditionnelle à base de mil fermenté, lait frais et sucre de canne.',
  price: 700,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1a2eec38c-1765348713825.png",
  category: 'boissons',
  active: true
},
// Desserts
{
  id: 'd1',
  name: 'Beignets de Banane',
  description: 'Beignets chauds à la banane plantain, saupoudrés de sucre glace et servis avec sirop de caramel.',
  price: 800,
  image: "https://images.unsplash.com/photo-1583212794476-d97f2334c8ae",
  category: 'desserts',
  active: true
},
{
  id: 'd2',
  name: 'Salade de Fruits Tropicaux',
  description: 'Mangue, papaye, ananas et pastèque locaux, arrosés de jus de citron vert et menthe fraîche.',
  price: 1000,
  image: "https://images.unsplash.com/photo-1584586994460-0c8d029148fd",
  category: 'desserts',
  active: true
},
{
  id: 'd3',
  name: 'Gâteau Fondant Chocolat',
  description: 'Fondant au chocolat noir coulant, servi tiède avec une boule de crème glacée vanille.',
  price: 1200,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1af4df8f6-1772207433785.png",
  category: 'desserts',
  active: true
}];


const categories = [
{ key: 'all', label: 'Tout le Menu', icon: 'SparklesIcon' },
{ key: 'plats', label: 'Plats', icon: 'FireIcon' },
{ key: 'boissons', label: 'Boissons', icon: 'BeakerIcon' },
{ key: 'desserts', label: 'Desserts', icon: 'CakeIcon' }] as
const;

function MenuCard({ item, index }: {item: MenuItem;index: number;}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleAdd = () => {
    addItem(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      ref={ref}
      className="animate-on-scroll card-hover bg-card border border-border rounded-3xl overflow-hidden group cursor-pointer"
      style={{ transitionDelay: `${index % 3 * 80}ms` }}>
      
      <div className="relative h-52 overflow-hidden">
        <AppImage
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
        
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-primary/90 text-primary-foreground backdrop-blur-sm">
            {item.category}
          </span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-black text-foreground text-lg leading-tight">{item.name}</h3>
          <span className="text-primary font-black text-lg whitespace-nowrap">{item.price.toLocaleString('fr-FR')} XOF</span>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed mb-5 line-clamp-2">{item.description}</p>
        <button
          onClick={handleAdd}
          className={`w-full py-3 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
          added ?
          'bg-success text-white scale-95' : 'bg-primary text-primary-foreground hover:bg-accent hover:scale-[1.02] active:scale-95'}`
          }>
          
          {added ?
          <>
              <Icon name="CheckIcon" size={16} variant="solid" />
              Ajouté !
            </> :

          <>
              <Icon name="PlusIcon" size={16} variant="solid" />
              Ajouter au Panier
            </>
          }
        </button>
      </div>
    </div>);

}

export default function MenuSection() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'plats' | 'boissons' | 'desserts'>('all');
  const sectionRef = useRef<HTMLDivElement>(null);

  const filtered = activeCategory === 'all' ? menuItems : menuItems.filter((i) => i.category === activeCategory);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.05 }
    );
    const els = sectionRef.current?.querySelectorAll('.animate-on-scroll');
    els?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [activeCategory]);

  return (
    <section id="menu" className="py-20 md:py-28 bg-background" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="animate-on-scroll mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-3">Notre Carte</p>
            <h2 className="text-section-xl font-black tracking-tighter text-foreground">
              Des plats qui font<br />
              <span className="gradient-text">voyager les papilles.</span>
            </h2>
          </div>
          <p className="text-muted-foreground font-medium max-w-xs leading-relaxed">
            Cuisine authentique d'Afrique de l'Ouest, préparée chaque jour avec des produits frais du marché.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="animate-on-scroll flex gap-3 mb-10 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((cat) =>
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key as typeof activeCategory)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-black text-sm uppercase tracking-wider whitespace-nowrap transition-all duration-300 flex-shrink-0 ${
            activeCategory === cat.key ?
            'bg-primary text-primary-foreground shadow-lg scale-105' :
            'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'}`
            }>
            
              <Icon name={cat.icon as any} size={16} variant={activeCategory === cat.key ? 'solid' : 'outline'} />
              {cat.label}
            </button>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, i) =>
          <MenuCard key={item.id} item={item} index={i} />
          )}
        </div>
      </div>
    </section>);

}