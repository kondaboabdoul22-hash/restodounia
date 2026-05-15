'use client';

import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { AdminTab } from '../page';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  isOpen: boolean;
  onClose: () => void;
}

const navItems: { tab: AdminTab; label: string; icon: string }[] = [
  { tab: 'dashboard', label: 'Tableau de Bord', icon: '📊' },
  { tab: 'orders', label: 'Commandes', icon: '📦' },
  { tab: 'menu', label: 'Menu', icon: '🍽️' },
  { tab: 'settings', label: 'Paramètres', icon: '⚙️' },
];

export default function AdminSidebar({ activeTab, setActiveTab, isOpen, onClose }: AdminSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-card border-r border-border z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2.5">
            <AppLogo size={32} />
            <div>
              <p className="font-black text-foreground text-sm leading-tight">RestoDounia</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Administration</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.tab}
              onClick={() => { setActiveTab(item.tab); onClose(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black transition-all admin-sidebar-link ${
                activeTab === item.tab ? 'active' : 'text-muted-foreground'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
              {item.tab === 'orders' && (
                <span className="ml-auto bg-primary text-primary-foreground text-[10px] font-black px-2 py-0.5 rounded-full">3</span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            <span>🌐</span> Voir le site
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <span>🚪</span> Déconnexion
          </Link>
        </div>
      </aside>
    </>
  );
}