
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogIn, Shield } from 'lucide-react';
import { User as UserType } from '../types';

interface LoginPageProps {
  onLogin: (user: UserType) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple mock login logic
    let mockUser: UserType;
    if (email === 'admin@hotel.com') {
      mockUser = { id: 'admin-1', name: 'Hotel Administrator', email: 'admin@hotel.com', isAdmin: true };
    } else {
      mockUser = { id: `u-${Date.now()}`, name: email.split('@')[0], email: email, isAdmin: false };
    }
    
    onLogin(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    if (mockUser.isAdmin) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
          <div className="text-center mb-10">
            <h1 className="font-serif text-3xl mb-2">Welcome Back</h1>
            <p className="text-slate-500">Sign in to your LuxeStay account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="email" 
                  required
                  placeholder="name@company.com"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-[0.98]"
            >
              <LogIn size={20} /> Sign In
            </button>
          </form>

          <div className="mt-10 p-4 bg-amber-50 rounded-2xl border border-amber-100">
            <p className="text-xs text-amber-800 font-medium">
              <span className="font-bold">Demo Login:</span><br/>
              Admin: admin@hotel.com<br/>
              Guest: user@example.com (any password)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
