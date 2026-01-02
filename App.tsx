
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import ScanPage from './pages/ScanPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import { MenuItem, CartItem, User, Order, OrderStatus } from './types';
import { INITIAL_MENU } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Simulation of persistence (optional)
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === itemId) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const clearCart = () => setCart([]);

  const placeOrder = (tableNumber: string) => {
    if (cart.length === 0) return;
    const total = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      userId: user?.id || 'guest',
      items: [...cart],
      total,
      status: OrderStatus.PENDING,
      tableNumber,
      createdAt: Date.now()
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar 
          cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)} 
          user={user} 
          onLogout={handleLogout}
        />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home menuItems={menuItems} onAddToCart={addToCart} />} />
            <Route path="/menu" element={<MenuPage menuItems={menuItems} onAddToCart={addToCart} />} />
            <Route 
              path="/cart" 
              element={
                <CartPage 
                  cart={cart} 
                  user={user}
                  onRemove={removeFromCart} 
                  onUpdateQty={updateQuantity} 
                  onPlaceOrder={placeOrder} 
                />
              } 
            />
            <Route path="/scan" element={<ScanPage setUserTable={(table) => setUser(prev => prev ? {...prev, tableNumber: table} : null)} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage onLogin={setUser} />} />
            <Route 
              path="/admin" 
              element={
                user?.isAdmin ? (
                  <AdminDashboard 
                    menuItems={menuItems} 
                    orders={orders} 
                    onUpdateMenu={setMenuItems}
                    onUpdateOrderStatus={updateOrderStatus}
                  />
                ) : <Navigate to="/login" />
              } 
            />
          </Routes>
        </main>
        <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
          <p>© {new Date().getFullYear()} LuxeStay Grand Hotel. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
