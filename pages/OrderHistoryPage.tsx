
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, Package, ArrowRight, ChevronLeft, ShoppingBag, Calendar } from 'lucide-react';
import { Order, OrderStatus, User } from '../types';

interface OrderHistoryPageProps {
  orders: Order[];
  user: User | null;
}

const OrderHistoryPage: React.FC<OrderHistoryPageProps> = ({ orders, user }) => {
  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-6">
          <Package size={40} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Please log in</h2>
        <p className="text-slate-500 mb-8">You need to be logged in to view your order history.</p>
        <Link to="/login" className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
          Sign In
        </Link>
      </div>
    );
  }

  const userOrders = orders.filter(o => o.userId === user.id);

  const statusColors = {
    [OrderStatus.PENDING]: 'bg-amber-100 text-amber-700 border-amber-200',
    [OrderStatus.PREPARING]: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    [OrderStatus.DELIVERED]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    [OrderStatus.CANCELLED]: 'bg-red-100 text-red-700 border-red-200',
  };

  const statusIcons = {
    [OrderStatus.PENDING]: <Clock size={14} />,
    [OrderStatus.PREPARING]: <Package size={14} />,
    [OrderStatus.DELIVERED]: <CheckCircle size={14} />,
    [OrderStatus.CANCELLED]: <Clock size={14} />,
  };

  const formatExactDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'full',
      timeStyle: 'medium',
    }).format(new Date(timestamp));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link to="/menu" className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 mb-8 transition-colors">
        <ChevronLeft size={18} /> Back to Menu
      </Link>

      <div className="mb-12">
        <h1 className="font-serif text-4xl mb-2">Order History</h1>
        <p className="text-slate-500">Track and review your gourmet experiences at Ramrosoft.</p>
      </div>

      {userOrders.length === 0 ? (
        <div className="bg-white p-16 text-center rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No orders found</h3>
          <p className="text-slate-500 mb-8">It looks like you haven't placed any orders yet during this stay.</p>
          <Link to="/menu" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all">
            Browse our menu <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {userOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6 md:p-8">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-bold text-slate-900">Order #{order.id.split('-').pop()}</span>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider flex items-center gap-1.5 ${statusColors[order.status]}`}>
                        {statusIcons[order.status]} {order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <Calendar size={14} className="text-slate-400" />
                      <span>{formatExactDate(order.createdAt)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-indigo-600">${order.total.toFixed(2)}</p>
                    <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Room/Table: {order.tableNumber}</p>
                  </div>
                </div>

                <div className="border-t border-slate-50 pt-6">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Items Ordered</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 bg-slate-100 text-slate-600 rounded flex items-center justify-center text-[10px] font-bold">
                            {item.quantity}
                          </span>
                          <span className="text-slate-700 font-medium">{item.name}</span>
                        </div>
                        <span className="text-slate-400 text-xs">${(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {order.status === OrderStatus.DELIVERED && (
                <div className="bg-slate-50 px-8 py-4 flex justify-between items-center border-t border-slate-100">
                  <span className="text-xs text-slate-500 italic">Delivered to your location</span>
                  <Link to="/menu" className="text-xs font-bold text-indigo-600 hover:underline">Order this again</Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
