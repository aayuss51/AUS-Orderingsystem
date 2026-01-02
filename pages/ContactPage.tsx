
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, ExternalLink } from 'lucide-react';
import { HOTEL_INFO } from '../constants';

const ContactPage: React.FC = () => {
  const [formState, setFormState] = useState({ name: '', email: '', subject: 'In-room Dining', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl mb-4">Get in Touch</h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">Whether you need a late-night feast or a personalized city tour, our concierge team is at your disposal 24/7.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Call Us</h3>
                  <p className="text-slate-500">{HOTEL_INFO.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Email Us</h3>
                  <p className="text-slate-500">{HOTEL_INFO.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Find Us</h3>
                  <p className="text-slate-500">Kathmandu 44600, Nepal</p>
                </div>
              </div>
            </div>

            <div className="bg-indigo-600 text-white p-8 rounded-3xl shadow-xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MessageCircle size={24} /> Immediate Assistance?
              </h3>
              <p className="text-indigo-100 mb-6">Dial '0' from your room phone for instant connection to our 5-star concierge desk.</p>
              <button className="w-full py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors">
                Chat with Concierge
              </button>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 h-full">
              {sent ? (
                <div className="py-20 text-center animate-in fade-in zoom-in h-full flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                    <Send size={40} />
                  </div>
                  <h2 className="text-3xl font-serif mb-4">Message Sent!</h2>
                  <p className="text-slate-500">We have received your inquiry and will get back to you within 30 minutes.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Your Name</label>
                      <input 
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        value={formState.name}
                        onChange={e => setFormState({...formState, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                      <input 
                        type="email"
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        value={formState.email}
                        onChange={e => setFormState({...formState, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Inquiry Type</label>
                    <select 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      value={formState.subject}
                      onChange={e => setFormState({...formState, subject: e.target.value})}
                    >
                      <option>In-room Dining</option>
                      <option>Table Reservation</option>
                      <option>Special Event</option>
                      <option>Feedback</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                    <textarea 
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-40"
                      value={formState.message}
                      onChange={e => setFormState({...formState, message: e.target.value})}
                    ></textarea>
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg"
                  >
                    <Send size={20} /> Send Inquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="bg-white p-4 rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 border-b border-slate-50 gap-4">
              <div>
                <h3 className="font-serif text-2xl text-slate-900">Ramrosoft Location</h3>
                <p className="text-slate-500 text-sm">Visit us at the heart of the city.</p>
              </div>
              <a 
                href="https://www.google.com/maps/place/Kathmandu+44600/@27.7090302,85.284933,13z/data=!3m1!4b1!4m6!3m5!1s0x39eb198a307baabf:0xb5137c1bf18db1ea!8m2!3d27.7103145!4d85.3221634!16zL20vMDRjeDU?entry=ttu" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 transition-colors text-sm"
              >
                Open in Google Maps <ExternalLink size={16} />
              </a>
            </div>
            <div className="relative w-full h-[450px] bg-slate-100">
              <iframe 
                title="Ramrosoft Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56516.316259513334!2d85.291113!3d27.7089559!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb198a307baabf%3A0xb5137c1bf18db1ea!2sKathmandu%2044600!5e0!3m2!1sen!2snp!4v1710183456789!5m2!1sen!2snp" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale-[20%] hover:grayscale-0 transition-all duration-500"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
