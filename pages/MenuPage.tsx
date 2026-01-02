
import React, { useState, useEffect, useRef } from 'react';
import { MenuItem, Category } from '../types';
import { ShoppingBag, Search, X, Ban } from 'lucide-react';

interface MenuPageProps {
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

const MenuPage: React.FC<MenuPageProps> = ({ menuItems, onAddToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const categories: (Category | 'All')[] = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Drinks', 'Desserts'];

  // Keyboard shortcut to focus search bar with '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Combined filtering logic: category + search query
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Helper to highlight matching text in results
  const HighlightedText: React.FC<{ text: string; query: string }> = ({ text, query }) => {
    if (!query.trim()) return <>{text}</>;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() 
            ? <mark key={i} className="bg-indigo-100 text-indigo-900 rounded-sm p-0 px-0.5 font-bold">{part}</mark> 
            : part
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white border-b border-slate-200 pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="font-serif text-4xl mb-2">Culinary Menu</h1>
              <p className="text-slate-500">Discover our chef's hand-picked selections.</p>
            </div>
            
            <div className="relative w-full md:w-96 group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                <Search size={20} />
              </div>
              <input 
                ref={searchInputRef}
                type="text"
                placeholder="Search menu items..."
                className="w-full pl-12 pr-16 py-3 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {searchQuery ? (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-slate-400 hover:text-slate-600 bg-white rounded-full shadow-sm"
                  >
                    <X size={14} />
                  </button>
                ) : (
                  <div className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-400 font-mono">
                    <span>/</span>
                  </div>
                )}
              </div>
            </div>
          </div>

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
        {searchQuery && (
          <div className="mb-8 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <p className="text-sm text-slate-500">
              Found <span className="font-bold text-slate-900">{filteredItems.length}</span> results for "<span className="italic">{searchQuery}</span>" 
              {selectedCategory !== 'All' && <span> in <span className="font-bold text-slate-900">{selectedCategory}</span></span>}
            </p>
            <button 
              onClick={() => {setSearchQuery(''); setSelectedCategory('All');}}
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}

        {filteredItems.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">No matches found</h3>
            <p className="text-slate-500">Try adjusting your search or category filters.</p>
            <button 
              onClick={() => {setSearchQuery(''); setSelectedCategory('All');}}
              className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredItems.map((item) => (
              <div key={item.id} className={`bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex gap-6 hover:shadow-md transition-all group ${!item.isAvailable ? 'bg-slate-50/50' : ''}`}>
                <div className="relative h-40 w-40 flex-shrink-0 overflow-hidden rounded-2xl">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className={`h-full w-full object-cover group-hover:scale-110 transition-transform duration-500 ${!item.isAvailable ? 'grayscale opacity-60' : ''}`} 
                  />
                  {!item.isAvailable && (
                    <div className="absolute top-2 left-2 z-10">
                      <span className="bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                        <Ban size={10} /> Sold Out
                      </span>
                    </div>
                  )}
                  {!item.isAvailable && (
                    <div className="absolute inset-0 bg-slate-900/10 pointer-events-none"></div>
                  )}
                </div>
                <div className={`flex flex-col flex-grow py-2 transition-opacity duration-300 ${!item.isAvailable ? 'opacity-50' : ''}`}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-xl font-bold text-slate-900">
                      <HighlightedText text={item.name} query={searchQuery} />
                    </h3>
                    <span className={`text-lg font-bold ${!item.isAvailable ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                    <HighlightedText text={item.description} query={searchQuery} />
                  </p>
                  
                  <div className="flex items-center gap-4 mt-auto">
                    <button 
                      disabled={!item.isAvailable}
                      onClick={() => onAddToCart(item)}
                      className={`flex-grow py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                        item.isAvailable 
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {item.isAvailable ? (
                        <>
                          <ShoppingBag size={18} /> Add to Order
                        </>
                      ) : (
                        <>
                          Currently Unavailable
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
