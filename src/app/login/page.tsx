'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';
import SiteSettingsProvider, { useSiteSettings } from '@/contexts/SiteSettingsContext';

function LoginForm() {
  const router = useRouter();
  const { settings } = useSiteSettings();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      if (form.email === settings.adminEmail && form.password === settings.adminPassword) {
        router.push('/admin-dashboard');
      } else {
        setError('Email ou mot de passe incorrect.');
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 blob-primary rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 blob-accent rounded-full pointer-events-none" />
      <div className="absolute inset-0 grain-overlay" />

      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="flex items-center gap-2.5">
              <AppLogo size={44} />
              <span className="font-black text-2xl tracking-tight text-foreground">{settings.restaurantName}</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Espace Administrateur</p>
          </div>

          <h1 className="text-2xl font-black text-foreground text-center mb-2">Connexion</h1>
          <p className="text-muted-foreground text-sm text-center mb-8">Accédez au panneau d'administration.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl">
                <Icon name="ExclamationCircleIcon" size={18} className="text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">
                Adresse Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder={settings.adminEmail}
                className="w-full bg-muted border border-border rounded-xl px-4 py-3.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm transition-all"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">
                Mot de Passe
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full bg-muted border border-border rounded-xl px-4 py-3.5 pr-12 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm transition-all"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPass ? 'Cacher le mot de passe' : 'Afficher le mot de passe'}
                >
                  <Icon name={showPass ? 'EyeSlashIcon' : 'EyeIcon'} size={18} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-accent transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                  <path d="M12 2a10 10 0 0110 10" strokeLinecap="round" />
                </svg>
              ) : (
                <>
                  <Icon name="LockClosedIcon" size={16} variant="solid" />
                  Se Connecter
                </>
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 p-4 bg-muted rounded-2xl border border-border">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Identifiants actuels</p>
            <p className="text-xs text-muted-foreground">Email: <span className="text-foreground font-bold">{settings.adminEmail}</span></p>
            <p className="text-xs text-muted-foreground">Mot de passe: <span className="text-foreground font-bold">{settings.adminPassword}</span></p>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
              ← Retour au site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <SiteSettingsProvider>
      <LoginForm />
    </SiteSettingsProvider>
  );
}
