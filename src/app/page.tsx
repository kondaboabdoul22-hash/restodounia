'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/app/components/HeroSection';
import MenuSection from '@/app/components/MenuSection';
import HowItWorksSection from '@/app/components/HowItWorksSection';
import TestimonialsSection from '@/app/components/TestimonialsSection';
import CTASection from '@/app/components/CTASection';
import WhatsAppButton from '@/app/components/WhatsAppButton';
import CartProvider from '@/app/components/CartProvider';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

function HomeContent() {
  const { settings } = useSiteSettings();

  if (settings.maintenanceMode) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">🔧</div>
          <h1 className="font-black text-2xl text-foreground mb-4">Site en Maintenance</h1>
          <p className="text-muted-foreground">{settings.maintenanceMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <CartProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main>
          {settings.showHero && <HeroSection />}
          <MenuSection />
          {settings.showHowItWorks && <HowItWorksSection />}
          {settings.showTestimonials && <TestimonialsSection />}
          {settings.showCTA && <CTASection />}
        </main>
        <Footer />
        {settings.showWhatsAppBtn && <WhatsAppButton />}
      </div>
    </CartProvider>
  );
}

export default function HomePage() {
  return <HomeContent />;
}
