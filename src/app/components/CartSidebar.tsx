'use client';

import React, { useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { useCart } from './CartProvider';
import OrderModal from './OrderModal';

export default function CartSidebar() {
  const { items, removeItem, updateQuantity, total, count, isOpen, closeCart } = useCart();
  const [showOrder, setShowOrder] = useState(false);

  const deliveryFee = 500;
  const grandTotal = total + (items?.length > 0 ? deliveryFee : 0);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={closeCart}
        aria-hidden="true"
      />
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border z-50 flex flex-col cart-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Icon name="ShoppingBagIcon" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="font-black text-foreground text-lg">Mon Panier</h2>
              <p className="text-muted-foreground text-xs">{count} article{count > 1 ? 's' : ''}</p>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors"
            aria-label="Fermer le panier"
          >
            <Icon name="XMarkIcon" size={18} className="text-foreground" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                <Icon name="ShoppingCartIcon" size={32} className="text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium">Votre panier est vide</p>
              <button
                onClick={closeCart}
                className="text-primary font-black text-sm uppercase tracking-wider hover:underline"
              >
                Parcourir le menu →
              </button>
            </div>
          ) : (
            items?.map(item => (
              <div key={item?.id} className="flex gap-4 bg-muted rounded-2xl p-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <AppImage src={item?.image} alt={item?.name} width={64} height={64} className="object-cover w-full h-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-foreground text-sm leading-tight mb-1 truncate">{item?.name}</p>
                  <p className="text-primary font-black text-sm">{(item?.price * item?.quantity)?.toLocaleString('fr-FR')} XOF</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => updateQuantity(item?.id, item?.quantity - 1)}
                      className="w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                    >
                      <Icon name="MinusIcon" size={12} />
                    </button>
                    <span className="font-black text-foreground w-6 text-center">{item?.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item?.id, item?.quantity + 1)}
                      className="w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                    >
                      <Icon name="PlusIcon" size={12} />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item?.id)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 transition-all text-muted-foreground flex-shrink-0"
                >
                  <Icon name="TrashIcon" size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items?.length > 0 && (
          <div className="p-6 border-t border-border space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Sous-total</span>
                <span className="font-bold text-foreground">{total?.toLocaleString('fr-FR')} XOF</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Frais de livraison</span>
                <span className="font-bold text-foreground">{deliveryFee?.toLocaleString('fr-FR')} XOF</span>
              </div>
              <div className="flex justify-between font-black text-foreground text-lg pt-2 border-t border-border">
                <span>Total</span>
                <span className="text-primary">{grandTotal?.toLocaleString('fr-FR')} XOF</span>
              </div>
            </div>
            <button
              onClick={() => { setShowOrder(true); closeCart(); }}
              className="w-full py-4 bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-accent transition-colors flex items-center justify-center gap-2"
            >
              <Icon name="CreditCardIcon" size={18} />
              Passer la Commande
            </button>
          </div>
        )}
      </div>
      {showOrder && <OrderModal onClose={() => setShowOrder(false)} grandTotal={grandTotal} />}
    </>
  );
}