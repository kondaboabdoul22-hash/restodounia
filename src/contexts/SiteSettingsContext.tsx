'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface HeroSlide {
  tag: string;
  headline: string;
  sub: string;
  image: string;
  alt: string;
}

export interface DashboardCard {
  label: string;
  value: string;
  sub: string;
  icon: string;
  trend: string;
  trendUp: boolean;
}

export interface DashboardChartDay {
  day: string;
  amount: string;
  value: number;
}

export interface SiteSettings {
  restaurantName: string;
  tagline: string;
  description: string;
  contactEmail: string;
  whatsappNumber: string;
  phoneNumber: string;
  address: string;
  openHours: string;
  deliveryFee: number;
  minOrderAmount: number;
  estimatedDelivery: string;

  logoUrl: string;
  primaryColor: string;
  heroTagline: string;
  heroSubheadline: string;
  heroSlides: HeroSlide[];

  statsOrderPerDay: string;
  statsDeliveryTime: string;
  statsRating: string;

  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  tiktokUrl: string;

  showHero: boolean;
  showHowItWorks: boolean;
  showTestimonials: boolean;
  showCTA: boolean;
  showWhatsAppBtn: boolean;

  paymentOrange: boolean;
  paymentMoov: boolean;
  paymentWave: boolean;
  paymentCash: boolean;
  paymentYengaPay: boolean;

  promoEnabled: boolean;
  promoCode: string;
  promoDiscount: number;

  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;

  maintenanceMode: boolean;
  maintenanceMessage: string;

  adminEmail: string;
  adminPassword: string;

  dashboardCards: DashboardCard[];
  dashboardShowChart: boolean;
  dashboardShowRecentOrders: boolean;
  dashboardChartData: DashboardChartDay[];
  dashboardWelcome: string;
}

const defaultSettings: SiteSettings = {
  restaurantName: 'RestoDounia',
  tagline: 'La saveur de chez nous.',
  description: 'Plats authentiques, livrés chauds à votre porte à Ouagadougou.',
  contactEmail: 'contact@restodounia.bf',
  whatsappNumber: '+226 70 12 34 56',
  phoneNumber: '+226 70 12 34 56',
  address: 'Secteur 15, Ouagadougou, Burkina Faso',
  openHours: '11h00 - 22h00, 7j/7',
  deliveryFee: 500,
  minOrderAmount: 1000,
  estimatedDelivery: '30 min',

  logoUrl: '',
  primaryColor: '#E85D2C',
  heroTagline: 'La saveur de chez nous.',
  heroSubheadline: 'Plats authentiques, livrés chauds à votre porte à Ouagadougou.',
  heroSlides: [
    {
      image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1e45257ec-1777985019629.png',
      alt: 'Vibrant African cuisine spread on dark wooden table',
      tag: 'Spécialité du Jour',
      headline: 'La saveur\nde chez nous.',
      sub: 'Plats authentiques, livrés chauds à votre porte à Ouagadougou.',
    },
    {
      image: 'https://images.unsplash.com/photo-1530085438345-a3f5313c6897',
      alt: 'Grilled meat and vegetables on dark plate',
      tag: 'Grillades Maison',
      headline: 'Grillé\nà la perfection.',
      sub: 'Viandes marinées et grillées sur feu de bois, livrées en 30 min.',
    },
    {
      image: 'https://images.unsplash.com/photo-1661881781609-e2b6adc0b27b',
      alt: 'Colorful African breakfast bowl with fresh fruits',
      tag: 'Nouveauté',
      headline: 'Fraîcheur\net tradition.',
      sub: 'Des ingrédients locaux sélectionnés chaque matin au marché.',
    },
  ],

  statsOrderPerDay: '500+',
  statsDeliveryTime: '30 min',
  statsRating: '4.9★',

  facebookUrl: '#',
  instagramUrl: '#',
  twitterUrl: '#',
  tiktokUrl: '#',

  showHero: true,
  showHowItWorks: true,
  showTestimonials: true,
  showCTA: true,
  showWhatsAppBtn: true,

  paymentOrange: true,
  paymentMoov: true,
  paymentWave: true,
  paymentCash: true,
  paymentYengaPay: true,

  promoEnabled: false,
  promoCode: 'DOUNIA10',
  promoDiscount: 10,

  metaTitle: 'RestoDounia — Commandez en Ligne à Ouagadougou',
  metaDescription: 'Commandez vos plats préférés chez RestoDounia, livraison rapide à Ouagadougou.',
  ogTitle: 'RestoDounia — Cuisine Authentique',
  ogDescription: 'Commandez en ligne, livraison rapide à Ouagadougou.',

  maintenanceMode: false,
  maintenanceMessage: 'Site en maintenance. Revenez bientôt !',

  adminEmail: 'admin@restodounia.bf',
  adminPassword: 'admin123',

  dashboardCards: [
    { label: "Commandes Aujourd'hui", value: '47', sub: '+12 vs hier', icon: '📦', trend: '34%', trendUp: true },
    { label: 'Revenus du Jour', value: '128,500 XOF', sub: 'Toutes commandes', icon: '💰', trend: '18%', trendUp: true },
    { label: 'En Attente', value: '3', sub: 'À traiter maintenant', icon: '⏳', trend: '2', trendUp: false },
    { label: 'Note Moyenne', value: '4.9 ★', sub: 'Sur 2,400 avis', icon: '⭐', trend: '0.1', trendUp: true },
  ],
  dashboardShowChart: true,
  dashboardShowRecentOrders: true,
  dashboardChartData: [
    { day: 'Lun', amount: '85k', value: 85 },
    { day: 'Mar', amount: '120k', value: 120 },
    { day: 'Mer', amount: '95k', value: 95 },
    { day: 'Jeu', amount: '140k', value: 140 },
    { day: 'Ven', amount: '180k', value: 180 },
    { day: 'Sam', amount: '210k', value: 210 },
    { day: 'Dim', amount: '128k', value: 128 },
  ],
  dashboardWelcome: '',
};

const STORAGE_KEY = 'restodounia_settings';

interface SiteSettingsContextType {
  settings: SiteSettings;
  updateSettings: (partial: Partial<SiteSettings>) => void;
  resetSettings: () => void;
  saved: boolean;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | null>(null);

export function useSiteSettings() {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) throw new Error('useSiteSettings must be used within SiteSettingsProvider');
  return ctx;
}

function loadSettings(): SiteSettings {
  if (typeof window === 'undefined') return defaultSettings;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultSettings, ...parsed };
    }
  } catch {}
  return defaultSettings;
}

export default function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch {}
    }
  }, [settings, loaded]);

  const updateSettings = useCallback((partial: Partial<SiteSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, updateSettings, resetSettings, saved }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}
