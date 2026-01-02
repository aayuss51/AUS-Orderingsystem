
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star, Sparkles } from 'lucide-react';
import { MenuItem } from '../types';
import { getAIMenuDescription } from '../services/geminiService';

interface HomeProps {
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

const Home: React.FC<HomeProps> = ({ menuItems, onAddToCart }) => {
  const [aiWelcome, setAiWelcome] = useState("Discover our handcrafted seasonal menu selections.");
  const featured = menuItems.slice(0, 3);

  useEffect(() => {
    const fetchWelcome = async () => {
      const desc = await getAIMenuDescription("The Ultimate Luxury Dining Experience");
      setAiWelcome(desc);
    };
    fetchWelcome();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <img 
          src="https://picsum.photos/seed/hotelhero/1920/1080" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Luxury Dining"
        />
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <h1 className="font-serif text-5xl md:text-7xl text-white mb-6 leading-tight">
            Exquisite Taste, <br/>Room Service Reimagined
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-8 font-light italic">
            {aiWelcome}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/menu" 
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
            >
              Order Now <ChevronRight size={20} />
            </Link>
            <Link 
              to="/scan" 
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md rounded-full font-semibold border border-white/30 transition-all flex items-center justify-center gap-2"
            >
              Scan Table QR
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center group">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Star size={32} />
            </div>
            <h3 className="font-serif text-2xl mb-4">Michelin Star Chefs</h3>
            <p className="text-slate-500">Every dish is prepared by award-winning culinary masters using the finest ingredients.</p>
          </div>
          <div className="text-center group">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Sparkles size={32} />
            </div>
            <h3 className="font-serif text-2xl mb-4">AI Recommendations</h3>
            <p className="text-slate-500">Get personalized wine and side pairings suggested by our proprietary AI sommelier.</p>
          </div>
          <div className="text-center group">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <ChevronRight size={32} />
            </div>
            <h3 className="font-serif text-2xl mb-4">Swift Delivery</h3>
            <p className="text-slate-500">Guaranteed room delivery within 30 minutes, or your signature cocktails are on us.</p>
          </div>
        </div>
      </section>

      {/* Featured Menu */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-serif text-4xl mb-2">Chef's Highlights</h2>
              <p className="text-slate-500">Our most requested seasonal delicacies.</p>
            </div>
            <Link to="/menu" className="text-indigo-600 font-semibold flex items-center gap-1 hover:underline">
              View Full Menu <ChevronRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featured.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-shadow flex flex-col h-full">
                <img src={item.image} alt={item.name} className="h-64 w-full object-cover" />
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{item.name}</h3>
                    <span className="text-indigo-600 font-bold">${item.price.toFixed(2)}</span>
                  </div>
                  <p className="text-slate-500 text-sm mb-6 flex-grow">{item.description}</p>
                  <button 
                    onClick={() => onAddToCart(item)}
                    className="w-full py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
                  >
                    Add to Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
