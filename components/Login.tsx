
import React, { useState } from 'react';
import { User } from '../types';
import { signIn, signUp } from '../services/authService';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  };

  const getFriendlyErrorMessage = (code: string) => {
    switch (code) {
      case 'auth/invalid-email':
        return 'The email address format is invalid. Please double-check it.';
      case 'auth/user-not-found':
        return 'No account found with this email. Please sign up instead.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/invalid-credential':
        return 'Invalid login credentials. Please check your email and password.';
      case 'auth/email-already-in-use':
        return 'An account already exists with this email. Try logging in instead.';
      case 'auth/weak-password':
        return 'Your password is too weak. Please use at least 6 characters.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (isSignUp) {
      if (!name.trim()) {
        setError('Please enter your name.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      let user;
      if (isSignUp) {
        user = await signUp(email, password, name);
      } else {
        user = await signIn(email, password);
      }
      // Successfully authenticated
      onLogin(user);
    } catch (err: any) {
      console.error("Auth Error:", err);
      const message = getFriendlyErrorMessage(err.code || '');
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10 animate-fade-in">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-200 mx-auto mb-6">
            <span className="text-white font-bold text-3xl">G</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {isSignUp ? 'Create Account' : 'Welcome back'}
          </h1>
          <p className="text-slate-500 mt-2">
            {isSignUp ? 'Join the community of logical thinkers' : 'Continue your mentoring sessions'}
          </p>
        </div>

        <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10 animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(''); }}
                  placeholder="Enter your name"
                  className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
                />
              </div>
            )}
            
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="you@example.com"
                className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Minimum 6 characters"
                className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
              />
            </div>

            {isSignUp && (
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                  placeholder="Re-enter password"
                  className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
                />
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold flex items-start gap-2 animate-fade-in border border-red-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span className="leading-tight">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 rounded-xl font-bold text-md shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 ${
                isSubmitting ? 'bg-slate-100 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin"></div>
                  Verifying...
                </>
              ) : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-50 text-center">
            <button 
              onClick={toggleMode}
              className="text-sm font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-4"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
