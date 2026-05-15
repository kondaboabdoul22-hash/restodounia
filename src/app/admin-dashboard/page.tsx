'use client';

import React, { useState } from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminStats from './components/AdminStats';
import AdminOrders from './components/AdminOrders';
import AdminMenu from './components/AdminMenu';
import AdminSettings from './components/AdminSettings';

export type AdminTab = 'dashboard' | 'orders' | 'menu' | 'settings';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-card/90 backdrop-blur-xl border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden w-10 h-10 rounded-xl bg-muted flex items-center justify-center"
              aria-label="Ouvrir le menu"
            >
              <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
            <div>
              <h1 className="font-black text-foreground text-lg leading-tight">
                {activeTab === 'dashboard' && 'Tableau de Bord'}
                {activeTab === 'orders' && 'Gestion des Commandes'}
                {activeTab === 'menu' && 'Gestion du Menu'}
                {activeTab === 'settings' && 'Paramètres du Site'}
              </h1>
              <p className="text-muted-foreground text-xs">RestoDounia Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/20 border border-success/30">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-success text-xs font-black uppercase tracking-wider">En ligne</span>
            </div>
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 p-6 md:p-8 overflow-auto">
          {activeTab === 'dashboard' && <AdminStats />}
          {activeTab === 'orders' && <AdminOrders />}
          {activeTab === 'menu' && <AdminMenu />}
          {activeTab === 'settings' && <AdminSettings />}
        </div>
      </div>
    </div>
  );
}