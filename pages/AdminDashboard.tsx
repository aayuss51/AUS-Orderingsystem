
import React, { useState } from 'react';
import { MenuItem, Order, OrderStatus, Category } from '../types';
import { Plus, Edit2, Trash2, CheckCircle, Clock, Save, X, Sparkles, Loader2, Image as ImageIcon, User as UserIcon, Mail, Power, PowerOff } from 'lucide-react';
import { generateMenuItemImage } from '../services/geminiService';

interface AdminDashboardProps {
  menuItems: MenuItem[];
  orders: Order[];
  onUpdateMenu: (items: MenuItem[]) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ menuItems, orders, onUpdateMenu, onUpdateOrderStatus }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'menu'>('orders');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({ category: 'Lunch', isAvailable: true });
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const handleDeleteItem = (id: string) => {
    onUpdateMenu(menuItems.filter(i => i.id !== id));
  };

  const handleToggleAvailability = (id: string) => {
    onUpdateMenu(menuItems.map(i => i.id === id ? { ...i, isAvailable: !i.isAvailable } : i));
  };

  const handleGenerateAIImage = async () => {
    if (!newItem.name) {
      alert("Please provide at least a name for the item to generate an image.");
      return;
    }
    setIsGeneratingImage(true);
    const imageUrl = await generateMenuItemImage(newItem.name, newItem.description || "");
    if (imageUrl) {
      setNewItem({ ...newItem, image: imageUrl });
    } else {
      alert("Failed to generate AI image. Please try again or use a placeholder.");
    }
    setIsGeneratingImage(false);
  };

  const handleSaveItem = () => {
    if (editingItem) {
      onUpdateMenu(menuItems.map(i => i.id === editingItem.id ? editingItem : i));
      setEditingItem(null);
    } else if (newItem.name && newItem.price) {
      const item: MenuItem = {
        id: `M-${Date.now()}`,
        name: newItem.name as string,
        description: newItem.description || '',
        price: Number(newItem.price),
        category: (newItem.category as Category) || 'Lunch',
        image: newItem.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600&h=400',
        isAvailable: true
      };
      onUpdateMenu([...menuItems, item]);
      setNewItem({ category: 'Lunch', isAvailable: true });
    }
  };

  const statusColors = {
    [OrderStatus.PENDING]: 'bg-amber-100 text-amber-700 border-amber-200',
    [OrderStatus.PREPARING]: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    [OrderStatus.DELIVERED]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    [OrderStatus.CANCELLED]: 'bg-red-100 text-red-700 border-red-200',
  };

  const statusIcons = {
    [OrderStatus.PENDING]: <Clock size={14} />,
    [OrderStatus.PREPARING]: <Clock size={14} />,
    [OrderStatus.DELIVERED]: <CheckCircle size={14} />,
    [OrderStatus.CANCELLED]: <Clock size={14} />,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-12">
        <h1 className="font-serif text-4xl">Admin Dashboard</h1>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Manage Orders
          </button>
          <button 
            onClick={() => setActiveTab('menu')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'menu' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Edit Menu
          </button>
        </div>
      </div>

      {activeTab === 'orders' ? (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="bg-white p-20 text-center rounded-3xl border border-slate-100 text-slate-400 italic">
              No orders have been placed yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xl font-bold text-slate-900">Order #{order.id.split('-').pop()}</span>
                        <span className="text-slate-400 font-medium">|</span>
                        <span className="text-slate-700 font-semibold">{order.userName || 'Guest'}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${statusColors[order.status]}`}>
                          {statusIcons[order.status]} {order.status}
                        </span>
                      </div>
                      <p className="text-slate-500 text-sm">
                        Location: <span className="text-slate-900 font-semibold">{order.tableNumber}</span> • {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-indigo-600">${order.total.toFixed(2)}</p>
                      <div className="flex gap-2 mt-4">
                        {order.status !== OrderStatus.DELIVERED && (
                          <>
                            <button 
                              onClick={() => onUpdateOrderStatus(order.id, OrderStatus.PREPARING)}
                              className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors"
                            >
                              Start Preparing
                            </button>
                            <button 
                              onClick={() => onUpdateOrderStatus(order.id, OrderStatus.DELIVERED)}
                              className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors"
                            >
                              Mark Delivered
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => onUpdateOrderStatus(order.id, OrderStatus.CANCELLED)}
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Items Section */}
                    <div className="bg-slate-50 rounded-2xl p-6">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Ordered Items</h4>
                      <ul className="space-y-3">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="flex justify-between text-sm">
                            <span className="text-slate-600 font-medium">
                              <span className="text-slate-900 font-bold mr-2">{item.quantity}x</span> {item.name}
                            </span>
                            <span className="text-slate-400 italic">{item.category}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Customer Section */}
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Customer Details</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 border border-slate-100">
                            <UserIcon size={16} />
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-tight">Full Name</p>
                            <p className="text-sm font-bold text-slate-900">{order.userName || 'Guest Customer'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 border border-slate-100">
                            <Mail size={16} />
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-tight">Email Address</p>
                            <p className="text-sm font-medium text-slate-600">{order.userEmail || 'No email provided'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 border border-slate-100">
                            <Clock size={16} />
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-tight">Identifier</p>
                            <p className="text-[10px] font-mono text-slate-400">{order.userId}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Add New Item Form */}
          <div className="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100 mb-12">
            <h2 className="text-xl font-bold text-indigo-900 mb-6 flex items-center gap-2"><Plus size={20} /> Add New Menu Item</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="col-span-1 md:col-span-2 space-y-4">
                <input 
                  placeholder="Item Name" 
                  className="w-full px-4 py-3 bg-white border border-indigo-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newItem.name || ''}
                  onChange={e => setNewItem({...newItem, name: e.target.value})}
                />
                <textarea 
                  placeholder="Description" 
                  className="w-full px-4 py-3 bg-white border border-indigo-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 h-24"
                  value={newItem.description || ''}
                  onChange={e => setNewItem({...newItem, description: e.target.value})}
                ></textarea>
              </div>
              <div className="col-span-1 space-y-4">
                <input 
                  type="number" 
                  placeholder="Price" 
                  className="w-full px-4 py-3 bg-white border border-indigo-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newItem.price || ''}
                  onChange={e => setNewItem({...newItem, price: Number(e.target.value)})}
                />
                <select 
                  className="w-full px-4 py-3 bg-white border border-indigo-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newItem.category}
                  onChange={e => setNewItem({...newItem, category: e.target.value as Category})}
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Drinks">Drinks</option>
                  <option value="Desserts">Desserts</option>
                </select>
              </div>
              <div className="col-span-1 flex flex-col gap-4">
                <div className="relative w-full aspect-[4/3] bg-white rounded-2xl border border-indigo-100 overflow-hidden flex items-center justify-center group">
                  {newItem.image ? (
                    <img src={newItem.image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="text-indigo-200" size={48} />
                  )}
                  {isGeneratingImage && (
                    <div className="absolute inset-0 bg-indigo-900/40 flex flex-col items-center justify-center text-white p-2 text-center">
                      <Loader2 className="animate-spin mb-2" size={32} />
                      <span className="text-xs font-bold">Imagining Dish...</span>
                    </div>
                  )}
                </div>
                <button 
                  onClick={handleGenerateAIImage}
                  disabled={isGeneratingImage || !newItem.name}
                  className={`w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    isGeneratingImage || !newItem.name
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 shadow-sm'
                  }`}
                >
                  <Sparkles size={16} /> {newItem.image ? 'Regenerate AI Image' : 'Generate AI Image'}
                </button>
              </div>
              
              <button 
                onClick={handleSaveItem}
                disabled={isGeneratingImage}
                className={`col-span-1 md:col-span-4 py-4 rounded-xl font-bold transition-colors shadow-lg shadow-indigo-200 ${
                    isGeneratingImage ? 'bg-slate-300 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                Add to Menu
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {menuItems.map(item => (
              <div key={item.id} className={`bg-white p-6 rounded-2xl border flex items-center gap-6 group hover:border-slate-300 transition-colors ${!item.isAvailable ? 'border-red-100 bg-red-50/20' : 'border-slate-100'}`}>
                <img src={item.image} alt={item.name} className={`w-16 h-16 rounded-xl object-cover ${!item.isAvailable ? 'grayscale opacity-50' : ''}`} />
                <div className="flex-grow">
                  <div className="flex items-center gap-3">
                    <h3 className={`font-bold ${!item.isAvailable ? 'text-slate-400' : 'text-slate-900'}`}>{item.name}</h3>
                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">{item.category}</span>
                    {!item.isAvailable && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Sold Out</span>}
                  </div>
                  <p className="text-slate-400 text-sm italic">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    className={`p-2 transition-colors ${item.isAvailable ? 'text-emerald-500 hover:text-emerald-600' : 'text-slate-300 hover:text-red-500'}`}
                    onClick={() => handleToggleAvailability(item.id)}
                    title={item.isAvailable ? "Mark as Sold Out" : "Mark as Available"}
                  >
                    {item.isAvailable ? <Power size={18} /> : <PowerOff size={18} />}
                  </button>
                  <button 
                    className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                    onClick={() => setEditingItem(item)}
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Modal Simulation */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Edit Item</h2>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-900"><X size={24} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Name</label>
                <input 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  value={editingItem.name}
                  onChange={e => setEditingItem({...editingItem, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Price</label>
                  <input 
                    type="number"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    value={editingItem.price}
                    onChange={e => setEditingItem({...editingItem, price: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Category</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    value={editingItem.category}
                    onChange={e => setEditingItem({...editingItem, category: e.target.value as Category})}
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Drinks">Drinks</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Description</label>
                <textarea 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 h-32"
                  value={editingItem.description}
                  onChange={e => setEditingItem({...editingItem, description: e.target.value})}
                ></textarea>
              </div>
              <button 
                onClick={handleSaveItem}
                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors mt-6 flex items-center justify-center gap-2"
              >
                <Save size={20} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
