
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, User, ShieldCheck, History } from 'lucide-react';
import { User as UserType } from '../types';

interface NavbarProps {
  cartCount: number;
  user: UserType | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'QR Scan', path: '/scan' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="font-serif text-2xl font-bold text-slate-900 tracking-tight uppercase">RAMROSOFT</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium ${
                  location.pathname === link.path ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'
                } transition-colors`}
              >
                {link.name}
              </Link>
            ))}
            
            {user && (
              <Link 
                to="/history" 
                className={`text-sm font-medium flex items-center gap-1.5 ${
                  location.pathname === '/history' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'
                } transition-colors`}
              >
                <History size={16} /> My Orders
              </Link>
            )}
            
            {user?.isAdmin && (
              <Link to="/admin" className="text-sm font-medium text-amber-600 hover:text-amber-700 flex items-center gap-1">
                <ShieldCheck size={16} /> Admin
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 text-slate-500 hover:text-slate-900 transition-colors">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {cartCount}
                </span>
              )}
            </Link>
            
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{user.name}</span>
                  <button 
                    onClick={onLogout}
                    className="text-sm font-medium text-red-500 hover:text-red-600"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" className="text-sm font-medium text-slate-500 hover:text-slate-900">
                  Login
                </Link>
              )}
            </div>

            <button 
              className="md:hidden p-2 text-slate-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 py-4 px-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-base font-medium text-slate-500 hover:text-slate-900"
            >
              {link.name}
            </Link>
          ))}
          {user && (
            <Link 
              to="/history" 
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-base font-medium text-slate-500 hover:text-indigo-600"
            >
              My Orders
            </Link>
          )}
          {user?.isAdmin && (
            <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block py-2 text-base font-medium text-amber-600">
              Admin Dashboard
            </Link>
          )}
          {user ? (
            <button 
              onClick={() => { onLogout(); setIsMenuOpen(false); }}
              className="block w-full text-left py-2 text-base font-medium text-red-500"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block py-2 text-base font-medium text-slate-500">
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
