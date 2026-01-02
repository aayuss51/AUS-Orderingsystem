
import React from 'react';
import { HOTEL_INFO } from '../constants';
import { History, Award, Heart, Globe } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <img 
          src="https://picsum.photos/seed/about/1920/1080" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Hotel Interior"
        />
        <div className="absolute inset-0 bg-slate-900/60"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="font-serif text-5xl md:text-6xl text-white mb-6">A Century of Elegance</h1>
          <p className="text-xl text-slate-200 font-light">Defining luxury hospitality since 1924</p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl mb-8">Our Philosophy</h2>
            <p className="text-slate-500 text-lg leading-relaxed">{HOTEL_INFO.about}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-20">
            <div className="flex gap-6">
              <div className="w-12 h-12 flex-shrink-0 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <History size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Rich Heritage</h3>
                <p className="text-slate-500">Founded by Sir Arthur Sterling, the hotel has remained a beacon of class and sophistication for four generations.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-12 h-12 flex-shrink-0 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <Award size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Award Winning</h3>
                <p className="text-slate-500">Consistently ranked in the top 10 hotels globally for culinary excellence and personalized concierge services.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-12 h-12 flex-shrink-0 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                <Heart size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Guest First</h3>
                <p className="text-slate-500">We believe that every stay is a story. Our mission is to make yours an unforgettable masterpiece.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-12 h-12 flex-shrink-0 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                <Globe size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Eco-Conscious</h3>
                <p className="text-slate-500">Committed to luxury that lasts, we utilize 100% renewable energy and source all ingredients from local organic farms.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="font-serif text-4xl mb-12">The LuxeStay Experience</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <img src="https://picsum.photos/seed/ex1/500/500" className="w-full aspect-square object-cover rounded-3xl" alt="Luxe 1" />
            <img src="https://picsum.photos/seed/ex2/500/500" className="w-full aspect-square object-cover rounded-3xl" alt="Luxe 2" />
            <img src="https://picsum.photos/seed/ex3/500/500" className="w-full aspect-square object-cover rounded-3xl" alt="Luxe 3" />
            <img src="https://picsum.photos/seed/ex4/500/500" className="w-full aspect-square object-cover rounded-3xl" alt="Luxe 4" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
