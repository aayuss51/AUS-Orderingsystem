
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, CreditCard, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { CartItem, User, Order } from '../types';

interface CartPageProps {
  cart: CartItem[];
  user: User | null;
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
  onPlaceOrder: (table: string) => Order | undefined;
}

const CartPage: React.FC<CartPageProps> = ({ cart, user, onRemove, onUpdateQty, onPlaceOrder }) => {
  const [tableNumber, setTableNumber] = useState(user?.tableNumber || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const subtotal = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);
  const serviceCharge = subtotal * 0.1;
  const total = subtotal + serviceCharge;

  const handleCheckout = async () => {
    if (!tableNumber) {
      alert("Please provide your Table or Room number.");
      return;
    }
    setIsProcessing(true);
    // Simulate payment gateway
    await new Promise(r => setTimeout(r, 2000));
    const order = onPlaceOrder(tableNumber);
    if (order) {
      setPlacedOrder(order);
    }
    setIsProcessing(false);
  };

  if (placedOrder) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-white p-12 rounded-3xl shadow-xl border border-slate-100">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="font-serif text-3xl mb-4">Order Confirmed!</h2>
          <p className="text-slate-500 mb-8">Your order <span className="font-bold text-slate-900">#{placedOrder.id}</span> is being prepared and will be delivered to <span className="font-bold text-slate-900">Room/Table {placedOrder.tableNumber}</span> shortly.</p>
          <Link 
            to="/" 
            className="block w-full py-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-6">
          <Trash2 size={40} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Your basket is empty</h2>
        <p className="text-slate-500 mb-8">Explore our menu and discover something delicious.</p>
        <Link to="/menu" className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Link to="/menu" className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 mb-8 transition-colors">
        <ChevronLeft size={18} /> Continue Ordering
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <h1 className="font-serif text-4xl mb-8">My Order</h1>
          {cart.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex gap-6">
              <img src={item.image} alt={item.name} className="w-24 h-24 rounded-2xl object-cover" />
              <div className="flex-grow flex flex-col justify-center">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold">{item.name}</h3>
                    <p className="text-slate-500 text-sm">{item.category}</p>
                  </div>
                  <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3 bg-slate-100 p-1 rounded-lg">
                    <button onClick={() => onUpdateQty(item.id, -1)} className="p-1 hover:bg-white rounded-md transition-colors text-slate-600"><Minus size={16} /></button>
                    <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                    <button onClick={() => onUpdateQty(item.id, 1)} className="p-1 hover:bg-white rounded-md transition-colors text-slate-600"><Plus size={16} /></button>
                  </div>
                  <button onClick={() => onRemove(item.id)} className="text-red-500 hover:text-red-600 p-2"><Trash2 size={18} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Summary</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Service Charge (10%)</span>
                <span>${serviceCharge.toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between text-xl font-bold text-slate-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-700 mb-2">Room / Table Number</label>
              <input 
                type="text" 
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="e.g. 402 or Table 12"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              />
            </div>

            <button 
              onClick={handleCheckout}
              disabled={isProcessing}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                isProcessing 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'
              }`}
            >
              {isProcessing ? 'Processing...' : <><CreditCard size={20} /> Checkout & Pay</>}
            </button>
            <p className="mt-4 text-center text-xs text-slate-400">Secure 256-bit encrypted checkout.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
