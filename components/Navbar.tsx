
import React, { useState } from 'react';
import { User } from '../types';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  user?: User | null;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage, user, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">GuideCode <span className="text-indigo-600">AI</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => onNavigate('home')}
              className={`text-sm font-semibold transition-colors ${currentPage === 'home' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Home
            </button>
            <button 
              onClick={() => onNavigate('solve')}
              className={`text-sm font-semibold transition-colors ${currentPage === 'solve' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Mentoring
            </button>
            <button 
              onClick={() => onNavigate('review')}
              className={`text-sm font-semibold transition-colors ${currentPage === 'review' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Code Review
            </button>
            <button 
              onClick={() => onNavigate('vault')}
              className={`text-sm font-semibold transition-colors ${currentPage === 'vault' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Data Vault
            </button>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 p-1.5 pr-3 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100 group"
                >
                  <div className={`w-8 h-8 rounded-xl ${user.avatarColor} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900">{user.name.split(' ')[0]}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </button>

                {showDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl z-20 overflow-hidden py-1 animate-fade-in">
                      <div className="px-4 py-3 border-b border-slate-50">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Signed in as</p>
                        <p className="text-xs font-semibold text-slate-700 truncate">{user.email}</p>
                      </div>
                      <button 
                        onClick={() => {
                          onLogout?.();
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 font-bold hover:bg-red-50 transition-colors flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
            
            {!user && (
              <button 
                onClick={() => onNavigate('solve')}
                className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
