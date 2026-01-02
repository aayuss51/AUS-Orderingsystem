
import React, { useState, useEffect } from 'react';
import { MenuItem, Category } from '../types';
import { getAIPairingSuggestion } from '../services/geminiService';
import { Sparkles, ShoppingBag } from 'lucide-react';

interface MenuPageProps {
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

const MenuPage: React.FC<MenuPageProps> = ({ menuItems, onAddToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [pairings, setPairings] = useState<Record<string, string>>({});
  const [loadingPairing, setLoadingPairing] = useState<string | null>(null);

  const categories: (Category | 'All')[] = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Drinks', 'Desserts'];

  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const fetchPairing = async (item: MenuItem) => {
    if (pairings[item.id]) return;
    setLoadingPairing(item.id);
    const suggestion = await getAIPairingSuggestion(item);
    setPairings(prev => ({ ...prev, [item.id]: suggestion }));
    setLoadingPairing(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white border-b border-slate-200 pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-serif text-4xl mb-8">Culinary Menu</h1>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex gap-6 hover:shadow-md transition-shadow group">
              <div className="relative h-40 w-40 flex-shrink-0 overflow-hidden rounded-2xl">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                {!item.isAvailable && (
                  <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                    <span className="text-white text-xs font-bold uppercase tracking-widest">Sold Out</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col flex-grow py-2">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-xl font-bold text-slate-900">{item.name}</h3>
                  <span className="text-lg font-bold text-slate-900">${item.price.toFixed(2)}</span>
                </div>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2">{item.description}</p>
                
                <div className="flex items-center gap-4 mt-auto">
                  <button 
                    disabled={!item.isAvailable}
                    onClick={() => onAddToCart(item)}
                    className={`flex-grow py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                      item.isAvailable 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingBag size={18} /> Add to Order
                  </button>
                  <button 
                    onClick={() => fetchPairing(item)}
                    className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors"
                    title="Get AI Pairing"
                  >
                    <Sparkles size={20} />
                  </button>
                </div>

                {pairings[item.id] && (
                  <div className="mt-4 p-3 bg-indigo-50/50 rounded-lg text-xs text-indigo-800 italic animate-in fade-in slide-in-from-top-2">
                    <span className="font-bold flex items-center gap-1 mb-1"><Sparkles size={12} /> AI Sommelier Recommendation:</span>
                    {pairings[item.id]}
                  </div>
                )}
                {loadingPairing === item.id && (
                  <div className="mt-4 flex items-center gap-2 text-xs text-indigo-500 animate-pulse">
                    <Sparkles size={12} className="animate-spin" /> Analyzing flavor profiles...
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
