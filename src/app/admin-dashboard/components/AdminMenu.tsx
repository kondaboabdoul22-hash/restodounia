'use client';

import React, { useState } from 'react';
import AppImage from '@/components/ui/AppImage';

interface DishItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'plats' | 'boissons' | 'desserts';
  active: boolean;
}

const initialMenu: DishItem[] = [
{ id: 'p1', name: 'Riz Gras au Poulet', description: 'Riz cuit dans un bouillon épicé avec poulet fermier.', price: 2500, image: "https://images.unsplash.com/photo-1709731104921-74ed63f7c4ef", category: 'plats', active: true },
{ id: 'p2', name: 'Tô à la Sauce Gombo', description: 'Pâte de maïs traditionnelle avec sauce gombo.', price: 1800, image: "https://img.rocket.new/generatedImages/rocket_gen_img_12f902d78-1767175225386.png", category: 'plats', active: true },
{ id: 'p3', name: 'Brochettes de Bœuf', description: 'Brochettes marinées grillées sur charbon.', price: 3000, image: "https://images.unsplash.com/photo-1578387498774-38f90f175423", category: 'plats', active: true },
{ id: 'p4', name: 'Poulet Yassa', description: 'Poulet braisé mariné au citron et oignons.', price: 3500, image: "https://images.unsplash.com/photo-1577110563602-54e15a96ac7a", category: 'plats', active: true },
{ id: 'b1', name: 'Bissap Frais', description: "Jus d'hibiscus naturel, légèrement sucré.", price: 500, image: "https://img.rocket.new/generatedImages/rocket_gen_img_1ee6a19aa-1775307444667.png", category: 'boissons', active: true },
{ id: 'b2', name: 'Gingembre Citron', description: 'Boisson artisanale au gingembre frais.', price: 600, image: "https://img.rocket.new/generatedImages/rocket_gen_img_14baa7eb4-1771884523907.png", category: 'boissons', active: true },
{ id: 'd1', name: 'Beignets de Banane', description: 'Beignets chauds à la banane plantain.', price: 800, image: "https://images.unsplash.com/photo-1716239026389-9cdbcffbad9e", category: 'desserts', active: false },
{ id: 'd2', name: 'Salade de Fruits Tropicaux', description: 'Mangue, papaye, ananas et pastèque locaux.', price: 1000, image: "https://images.unsplash.com/photo-1605741905032-fa0bd3847b07", category: 'desserts', active: true }];


const emptyDish: Omit<DishItem, 'id'> = {
  name: '',
  description: '',
  price: 0,
  image: '',
  category: 'plats',
  active: true
};

export default function AdminMenu() {
  const [menu, setMenu] = useState<DishItem[]>(initialMenu);
  const [filterCat, setFilterCat] = useState<'all' | 'plats' | 'boissons' | 'desserts'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<DishItem, 'id'>>(emptyDish);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = filterCat === 'all' ? menu : menu.filter((d) => d.category === filterCat);

  const openAdd = () => {
    setFormData(emptyDish);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (dish: DishItem) => {
    const { id, ...rest } = dish;
    setFormData(rest);
    setEditingId(id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.price) return;
    if (editingId) {
      setMenu((prev) => prev.map((d) => d.id === editingId ? { ...formData, id: editingId } : d));
    } else {
      const newId = `item-${Date.now()}`;
      setMenu((prev) => [...prev, { ...formData, id: newId }]);
    }
    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    setMenu((prev) => prev.filter((d) => d.id !== id));
    setDeleteConfirm(null);
  };

  const toggleActive = (id: string) => {
    setMenu((prev) => prev.map((d) => d.id === id ? { ...d, active: !d.active } : d));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {(['all', 'plats', 'boissons', 'desserts'] as const).map((cat) =>
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
            filterCat === cat ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`
            }>
            
              {cat === 'all' ? 'Tout' : cat}
            </button>
          )}
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-black text-xs uppercase tracking-wider rounded-xl hover:bg-accent transition-colors">
          
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Ajouter un Plat
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((dish) =>
        <div key={dish.id} className={`bg-card border rounded-2xl overflow-hidden transition-all ${dish.active ? 'border-border' : 'border-border opacity-60'}`}>
            <div className="relative h-40">
              <AppImage
              src={dish.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop'}
              alt={dish.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 25vw" />
            
              <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
              {/* Active toggle */}
              <div className="absolute top-3 right-3">
                <label className="toggle-switch" aria-label={`${dish.active ? 'Désactiver' : 'Activer'} ${dish.name}`}>
                  <input type="checkbox" checked={dish.active} onChange={() => toggleActive(dish.id)} />
                  <span className="toggle-slider" />
                </label>
              </div>
              <div className="absolute bottom-3 left-3">
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary/90 text-primary-foreground">
                  {dish.category}
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-black text-foreground text-sm leading-tight flex-1">{dish.name}</h3>
                <span className="text-primary font-black text-sm whitespace-nowrap">{dish.price.toLocaleString('fr-FR')} XOF</span>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed mb-4 line-clamp-2">{dish.description}</p>
              <div className="flex gap-2">
                <button
                onClick={() => openEdit(dish)}
                className="flex-1 py-2 bg-muted text-foreground font-black text-xs uppercase tracking-wider rounded-xl hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-1.5">
                
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  Modifier
                </button>
                <button
                onClick={() => setDeleteConfirm(dish.id)}
                className="w-9 h-9 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/25 transition-colors flex-shrink-0"
                aria-label={`Supprimer ${dish.name}`}>
                
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm &&
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-card border border-border rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10">
              <h2 className="font-black text-foreground text-lg">{editingId ? 'Modifier le Plat' : 'Ajouter un Plat'}</h2>
              <button onClick={() => setShowForm(false)} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors">
                <svg className="w-4 h-4 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Image preview */}
              {formData.image &&
            <div className="relative h-40 rounded-2xl overflow-hidden">
                  <AppImage src={formData.image} alt="Aperçu" fill className="object-cover" sizes="100vw" />
                </div>
            }

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Nom du plat *</label>
                <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                placeholder="Ex: Riz Gras au Poulet"
                className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
              
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Description</label>
                <textarea
                value={formData.description}
                onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
                placeholder="Description du plat..."
                rows={3}
                className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none" />
              
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Prix (XOF) *</label>
                  <input
                  type="number"
                  value={formData.price || ''}
                  onChange={(e) => setFormData((f) => ({ ...f, price: parseInt(e.target.value) || 0 }))}
                  placeholder="2500"
                  className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Catégorie</label>
                  <select
                  value={formData.category}
                  onChange={(e) => setFormData((f) => ({ ...f, category: e.target.value as DishItem['category'] }))}
                  className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                  
                    <option value="plats">Plats</option>
                    <option value="boissons">Boissons</option>
                    <option value="desserts">Desserts</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">URL de l'image</label>
                <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData((f) => ({ ...f, image: e.target.value }))}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
              
              </div>

              <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                <div>
                  <p className="font-black text-foreground text-sm">Plat actif</p>
                  <p className="text-muted-foreground text-xs">Visible sur le menu public</p>
                </div>
                <label className="toggle-switch" aria-label="Activer le plat">
                  <input type="checkbox" checked={formData.active} onChange={(e) => setFormData((f) => ({ ...f, active: e.target.checked }))} />
                  <span className="toggle-slider" />
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-3 bg-muted text-foreground font-black text-sm uppercase tracking-wider rounded-2xl hover:bg-muted/70 transition-colors">
                
                  Annuler
                </button>
                <button
                onClick={handleSave}
                disabled={!formData.name || !formData.price}
                className="flex-1 py-3 bg-primary text-primary-foreground font-black text-sm uppercase tracking-wider rounded-2xl hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                
                  {editingId ? 'Enregistrer' : 'Ajouter'}
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Delete Confirm Modal */}
      {deleteConfirm &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-card border border-border rounded-2xl p-8 w-full max-w-sm animate-scale-in text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-red-500/15 flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <div>
              <h3 className="font-black text-foreground text-xl mb-2">Supprimer ce plat ?</h3>
              <p className="text-muted-foreground text-sm">Cette action est irréversible. Le plat sera définitivement supprimé du menu.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 bg-muted text-foreground font-black text-sm rounded-xl hover:bg-muted/70 transition-colors">Annuler</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-3 bg-red-500 text-white font-black text-sm rounded-xl hover:bg-red-600 transition-colors">Supprimer</button>
            </div>
          </div>
        </div>
      }
    </div>);

}