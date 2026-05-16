'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  icon: string;
  trend?: string;
  trendUp?: boolean;
}

function StatCard({ label, value, sub, icon, trend, trendUp }: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`bg-card border border-border rounded-2xl p-6 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">{icon}</div>
        {trend && (
          <span className={`text-xs font-black px-2.5 py-1 rounded-full ${trendUp ? 'bg-success/15 text-success' : 'bg-red-500/15 text-red-400'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>
      <p className="text-3xl font-black text-foreground mb-1">{value}</p>
      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="text-xs text-muted-foreground mt-1">{sub}</p>
    </div>
  );
}

const recentOrders = [
  { id: 'RD-847291', customer: 'Adama Kaboré', items: 'Riz Gras ×2, Bissap ×1', total: 5500, status: 'en_preparation', time: '12:34' },
  { id: 'RD-847285', customer: 'Fatimata Traoré', items: 'Poulet Yassa ×1, Gingembre ×1', total: 4100, status: 'livre', time: '12:18' },
  { id: 'RD-847279', customer: 'Ibrahim Sawadogo', items: 'Brochettes ×3, Dégué ×2', total: 10400, status: 'en_attente', time: '12:05' },
  { id: 'RD-847271', customer: 'Mariam Ouédraogo', items: 'Thiéboudienne ×2', total: 7000, status: 'livre', time: '11:52' },
];

const statusMap: Record<string, { label: string; cls: string }> = {
  en_attente: { label: 'En attente', cls: 'status-pending' },
  en_preparation: { label: 'En préparation', cls: 'status-preparing' },
  livre: { label: 'Livré', cls: 'status-delivered' },
};

export default function AdminStats() {
  const { settings } = useSiteSettings();

  const maxChartValue = Math.max(...settings.dashboardChartData.map(d => d.value), 1);

  return (
    <div className="space-y-8">
      {settings.dashboardWelcome && (
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl px-6 py-4">
          <p className="text-lg font-black text-foreground">{settings.dashboardWelcome}</p>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {settings.dashboardCards.map((card, i) => (
          <StatCard key={i} {...card} />
        ))}
      </div>

      {/* Revenue chart */}
      {settings.dashboardShowChart && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-black text-foreground text-lg">Revenus de la Semaine</h3>
              <p className="text-muted-foreground text-sm">Mai 2026</p>
            </div>
            <span className="text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-success/15 text-success">↑ +23% vs semaine passée</span>
          </div>
          <div className="flex items-end gap-3 h-40">
            {settings.dashboardChartData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <p className="text-[10px] font-bold text-muted-foreground">{d.amount}</p>
                <div
                  className="w-full rounded-t-xl bg-gradient-to-t from-primary to-accent transition-all duration-700"
                  style={{ height: `${(d.value / maxChartValue) * 100}%` }}
                />
                <p className="text-[10px] font-black uppercase text-muted-foreground">{d.day}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent orders */}
      {settings.dashboardShowRecentOrders && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="font-black text-foreground text-lg">Commandes Récentes</h3>
            <span className="text-xs font-black uppercase tracking-widest text-primary">Voir tout →</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-6 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Commande</th>
                  <th className="text-left px-6 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground hidden sm:table-cell">Client</th>
                  <th className="text-left px-6 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground hidden lg:table-cell">Articles</th>
                  <th className="text-right px-6 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total</th>
                  <th className="text-right px-6 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => {
                  const st = statusMap[order.status];
                  return (
                    <tr key={order.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-black text-foreground text-sm">{order.id}</p>
                        <p className="text-muted-foreground text-xs">{order.time}</p>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <p className="font-bold text-foreground text-sm">{order.customer}</p>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <p className="text-muted-foreground text-sm truncate max-w-xs">{order.items}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-black text-primary text-sm">{order.total.toLocaleString('fr-FR')} XOF</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${st.cls}`}>{st.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}