'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

interface HeaderProps {
  variant?: 'default' | 'transparent';
  cartCount?: number;
  onCartClick?: () => void;
}

export default function Header({ variant = 'default', cartCount = 0, onCartClick }: HeaderProps) {
  const { settings } = useSiteSettings();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navLinks = [
    { href: '#menu', label: 'Menu' },
    { href: '#comment', label: 'Comment ça marche' },
    { href: '#avis', label: 'Avis clients' },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled || variant === 'default' ?'bg-card/90 backdrop-blur-xl border-b border-border shadow-lg shadow-black/20' :'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-18 md:h-20 flex items-center justify-between gap-4" style={{ height: '72px' }}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <AppLogo size={36} onClick={() => {}} />
          <span className="font-black text-xl tracking-tight text-foreground">{settings.restaurantName}</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            Admin
          </Link>
          <a
            href="#menu"
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-black text-[11px] uppercase tracking-widest rounded-full hover:bg-accent hover:scale-105 transition-all shadow-lg"
          >
            <Icon name="ShoppingBagIcon" size={15} variant="solid" />
            Commander
          </a>
        </div>

        {/* Mobile: Cart + Hamburger */}
        <div className="flex md:hidden items-center gap-3">
          {onCartClick && (
            <button
              onClick={onCartClick}
              className="relative w-10 h-10 rounded-full bg-muted flex items-center justify-center"
              aria-label="Panier"
            >
              <Icon name="ShoppingBagIcon" size={18} className="text-foreground" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-black flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          )}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <Icon name="XMarkIcon" size={18} className="text-foreground" />
            ) : (
              <Icon name="Bars3Icon" size={18} className="text-foreground" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 top-[72px] bg-card/95 backdrop-blur-xl z-50 flex flex-col p-8 gap-6 md:hidden">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-2xl font-black uppercase tracking-tight text-foreground hover:text-primary transition-colors py-2 border-b border-border"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="text-2xl font-black uppercase tracking-tight text-muted-foreground hover:text-primary transition-colors py-2 border-b border-border"
          >
            Espace Admin
          </Link>
          <a
            href="#menu"
            onClick={() => setMenuOpen(false)}
            className="mt-4 py-4 bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest rounded-2xl text-center hover:bg-accent transition-colors"
          >
            Commander Maintenant
          </a>
        </div>
      )}
    </header>
  );
}