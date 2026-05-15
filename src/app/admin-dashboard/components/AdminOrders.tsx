'use client';

import React, { useState } from 'react';

type OrderStatus = 'en_attente' | 'en_preparation' | 'livre' | 'annule';

interface Order {
  id: string;
  customer: string;
  phone: string;
  address: string;
  items: string;
  total: number;
  payment: string;
  delivery: string;
  status: OrderStatus;
  time: string;
  date: string;
  cancelReason?: string;
  cancelledAt?: string;
}

const initialOrders: Order[] = [
  { id: 'RD-847291', customer: 'Adama Kaboré', phone: '+226 70 45 23 18', address: 'Secteur 15, Rue 15.30, Ouagadougou', items: 'Riz Gras au Poulet ×2, Bissap Frais ×1', total: 5500, payment: 'Orange Money', delivery: 'Livraison', status: 'en_preparation', time: '12:34', date: '14/05/2026' },
  { id: 'RD-847285', customer: 'Fatimata Traoré', phone: '+226 76 12 88 45', address: 'Zone du Bois, Ouagadougou', items: 'Poulet Yassa ×1, Gingembre Citron ×1', total: 4100, payment: 'Wave', delivery: 'Livraison', status: 'livre', time: '12:18', date: '14/05/2026' },
  { id: 'RD-847279', customer: 'Ibrahim Sawadogo', phone: '+226 65 34 77 22', address: "Secteur 22, Patte d'Oie", items: 'Brochettes de Bœuf ×3, Dégué Lacté ×2', total: 10400, payment: 'Paiement livraison', delivery: 'Livraison', status: 'en_attente', time: '12:05', date: '14/05/2026' },
  { id: 'RD-847271', customer: 'Mariam Ouédraogo', phone: '+226 70 99 56 10', address: 'Secteur 30, Pissy', items: 'Thiéboudienne ×2', total: 7000, payment: 'Moov Money', delivery: 'À emporter', status: 'livre', time: '11:52', date: '14/05/2026' },
  { id: 'RD-847264', customer: 'Souleymane Compaoré', phone: '+226 77 23 40 88', address: 'Tampouy, Ouagadougou', items: 'Tô à la Sauce Gombo ×2, Bissap ×2', total: 5100, payment: 'Orange Money', delivery: 'Livraison', status: 'en_attente', time: '11:30', date: '14/05/2026' },
  { id: 'RD-847258', customer: 'Aïssata Diallo', phone: '+226 65 88 12 44', address: 'Karpala, Ouagadougou', items: 'Alloco Poulet ×1, Salade Fruits ×1', total: 3200, payment: 'Wave', delivery: 'Livraison', status: 'annule', time: '11:10', date: '14/05/2026' },
];

const statusMap: Record<OrderStatus, { label: string; cls: string }> = {
  en_attente: { label: 'En attente', cls: 'status-pending' },
  en_preparation: { label: 'En préparation', cls: 'status-preparing' },
  livre: { label: 'Livré', cls: 'status-delivered' },
  annule: { label: 'Annulé', cls: 'status-cancelled' },
};

const statusTransitions: Record<OrderStatus, OrderStatus | null> = {
  en_attente: 'en_preparation',
  en_preparation: 'livre',
  livre: null,
  annule: null,
};

const nextActionLabel: Record<OrderStatus, string> = {
  en_attente: '→ En préparation',
  en_preparation: '→ Marquer Livré',
  livre: 'Livré ✓',
  annule: 'Annulé',
};

const STORAGE_KEY = 'restodounia_orders';

function loadOrders(): Order[] {
  if (typeof window === 'undefined') return initialOrders;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return initialOrders;
}

function saveOrders(orders: Order[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch {}
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'all' | OrderStatus>('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  React.useEffect(() => {
    setOrders(loadOrders());
  }, []);

  React.useEffect(() => {
    if (orders.length > 0) saveOrders(orders);
  }, [orders]);

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const updateStatus = (id: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const confirmCancel = () => {
    if (!cancelTarget || !cancelReason.trim()) return;
    const now = new Date();
    setOrders(prev => prev.map(o =>
      o.id === cancelTarget
        ? { ...o, status: 'annule', cancelReason: cancelReason.trim(), cancelledAt: now.toLocaleString('fr-FR') }
        : o
    ));
    setCancelTarget(null);
    setCancelReason('');
  };

  const openCancelModal = (id: string) => {
    setCancelTarget(id);
    setCancelReason('');
  };

  const counts = {
    all: orders.length,
    en_attente: orders.filter(o => o.status === 'en_attente').length,
    en_preparation: orders.filter(o => o.status === 'en_preparation').length,
    livre: orders.filter(o => o.status === 'livre').length,
    annule: orders.filter(o => o.status === 'annule').length,
  };

  return (
    <div className="space-y-6">
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {([
          { key: 'all', label: 'Toutes' },
          { key: 'en_attente', label: 'En attente' },
          { key: 'en_preparation', label: 'En préparation' },
          { key: 'livre', label: 'Livrées' },
          { key: 'annule', label: 'Annulées' },
        ] as const).map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
              filter === f.key
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {f.label}
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              filter === f.key ? 'bg-white/20 text-white' : 'bg-card text-foreground'
            }`}>
              {counts[f.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Orders list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground font-medium">
            Aucune commande dans cette catégorie.
          </div>
        )}
        {filtered.map(order => {
          const st = statusMap[order.status];
          const nextStatus = statusTransitions[order.status];
          const isExpanded = expanded === order.id;

          return (
            <div key={order.id} className="bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300">
              {/* Row header */}
              <div
                className="flex flex-wrap items-center gap-4 p-5 cursor-pointer hover:bg-muted/20 transition-colors"
                onClick={() => setExpanded(isExpanded ? null : order.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-black text-foreground text-sm">{order.id}</span>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${st.cls}`}>{st.label}</span>
                  </div>
                  <p className="text-muted-foreground text-xs mt-0.5">{order.date} à {order.time} · {order.delivery}</p>
                </div>
                <div className="hidden sm:block flex-1 min-w-0">
                  <p className="font-bold text-foreground text-sm truncate">{order.customer}</p>
                  <p className="text-muted-foreground text-xs truncate">{order.items}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-black text-primary text-base">{order.total.toLocaleString('fr-FR')} XOF</p>
                  <p className="text-muted-foreground text-xs">{order.payment}</p>
                </div>
                <svg
                  className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="border-t border-border p-5 bg-muted/20 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Client</p>
                      <p className="font-bold text-foreground text-sm">{order.customer}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Téléphone / WhatsApp</p>
                      <a
                        href={`https://wa.me/${order.phone.replace(/\s+/g, '').replace('+', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-bold text-sm text-[#25D366] hover:underline"
                      >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#25D366]"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        {order.phone}
                      </a>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Adresse</p>
                      <p className="font-medium text-foreground text-sm">{order.address}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Articles commandés</p>
                      <p className="font-medium text-foreground text-sm">{order.items}</p>
                    </div>
                    {order.status === 'annule' && order.cancelReason && (
                      <div className="sm:col-span-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Motif d'annulation</p>
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                          <p className="font-medium text-sm text-red-400">{order.cancelReason}</p>
                          {order.cancelledAt && (
                            <p className="text-xs text-muted-foreground mt-1">Annulé le {order.cancelledAt}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    {nextStatus && (
                      <button
                        onClick={() => updateStatus(order.id, nextStatus)}
                        className="px-5 py-2.5 bg-primary text-primary-foreground font-black text-xs uppercase tracking-wider rounded-xl hover:bg-accent transition-colors"
                      >
                        {nextActionLabel[order.status]}
                      </button>
                    )}
                    {order.status === 'en_attente' && (
                      <button
                        onClick={() => openCancelModal(order.id)}
                        className="px-5 py-2.5 bg-red-500/15 text-red-400 border border-red-500/30 font-black text-xs uppercase tracking-wider rounded-xl hover:bg-red-500/25 transition-colors"
                      >
                        Annuler
                      </button>
                    )}
                    <a
                      href={`https://wa.me/${order.phone.replace(/\s+/g, '').replace('+', '')}?text=Bonjour%20${encodeURIComponent(order.customer)}%2C%20votre%20commande%20${order.id}%20est%20en%20cours%20de%20traitement.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/30 font-black text-xs uppercase tracking-wider rounded-xl hover:bg-[#25D366]/25 transition-colors flex items-center gap-2"
                    >
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-[#25D366]"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      Contacter
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>

      {/* Cancel modal */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="font-black text-lg text-foreground">Annuler la commande</h3>
            <p className="text-sm text-muted-foreground">
              Veuillez indiquer le motif de l'annulation pour la commande <strong className="text-foreground">{cancelTarget}</strong>.
            </p>
            <textarea
              autoFocus
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
              placeholder="Ex: Client indisponible, produit en rupture..."
              className="w-full h-24 px-4 py-3 bg-muted border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setCancelTarget(null); setCancelReason(''); }}
                className="px-5 py-2.5 bg-muted text-muted-foreground font-black text-xs uppercase tracking-wider rounded-xl hover:text-foreground transition-colors"
              >
                Retour
              </button>
              <button
                onClick={confirmCancel}
                disabled={!cancelReason.trim()}
                className="px-5 py-2.5 bg-red-500/15 text-red-400 border border-red-500/30 font-black text-xs uppercase tracking-wider rounded-xl hover:bg-red-500/25 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Confirmer l'annulation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}