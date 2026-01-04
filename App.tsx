
import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import CodeReview from './components/CodeReview';
import ChatBot from './components/ChatBot';
import Layout from './components/Layout';
import Login from './components/Login';
import DataVault from './components/DataVault';
import ConfirmationModal from './components/ConfirmationModal';
import { getGuidanceFromAI } from './services/aiService';
import { signOut, listenToAuthChanges } from './services/authService';
import { Message, ChatSession, User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitleValue, setEditTitleValue] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    onConfirm: () => void;
    isDanger?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: '',
    onConfirm: () => {},
  });

  // Helper to generate a unique storage key per user UID
  const getUserStorageKey = (uid: string) => `guidecode_sessions_${uid}`;

  // Initial Auth Check and Listener
  useEffect(() => {
    const unsubscribe = listenToAuthChanges((authUser) => {
      setUser(authUser);
      setIsAuthChecking(false);
    });
    return () => unsubscribe();
  }, []);

  // Load sessions strictly when the user UID changes
  useEffect(() => {
    if (!user) {
      setSessions([]);
      setActiveSessionId(null);
      return;
    }

    const storageKey = getUserStorageKey(user.uid);
    const saved = localStorage.getItem(storageKey);
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hydrated = parsed.map((s: any) => ({
          ...s,
          updatedAt: new Date(s.updatedAt),
          messages: s.messages.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp)
          }))
        }));
        setSessions(hydrated);
        if (hydrated.length > 0) {
          setActiveSessionId(hydrated[0].id);
        } else {
          setActiveSessionId(null);
        }
      } catch (e) {
        console.error("Session hydration failed", e);
        setSessions([]);
      }
    } else {
      setSessions([]);
      setActiveSessionId(null);
    }
  }, [user?.uid]);

  // Sync sessions to current user's storage
  useEffect(() => {
    if (user && sessions.length >= 0) {
      const storageKey = getUserStorageKey(user.uid);
      localStorage.setItem(storageKey, JSON.stringify(sessions));
    }
  }, [sessions, user?.uid]);

  const handleLogout = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Sign Out?',
      message: 'Your current mentoring progress is safely stored under your account.',
      confirmLabel: 'Sign Out',
      isDanger: false,
      onConfirm: async () => {
        try {
          await signOut();
          // State isolation reset
          setUser(null);
          setSessions([]);
          setActiveSessionId(null);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
          setCurrentPage('home');
        } catch (e) {
          alert('Failed to sign out. Please try again.');
        }
      }
    });
  };

  const handleReset = () => {
    if (!user) return;
    setConfirmModal({
      isOpen: true,
      title: 'Factory Reset?',
      message: `This will permanently delete ALL data for ${user.email}. This action is irreversible.`,
      confirmLabel: 'Clear All Data',
      isDanger: true,
      onConfirm: () => {
        const storageKey = getUserStorageKey(user.uid);
        localStorage.removeItem(storageKey);
        setSessions([]);
        setActiveSessionId(null);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        setCurrentPage('home');
      }
    });
  };

  const handleImport = (jsonStr: string) => {
    if (!user) return;
    try {
      const data = JSON.parse(jsonStr);
      if (!data.sessions) throw new Error("Invalid format");
      
      const hydratedSessions = data.sessions.map((s: any) => ({
        ...s,
        updatedAt: new Date(s.updatedAt),
        messages: s.messages.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }))
      }));

      setSessions(hydratedSessions);
      const storageKey = getUserStorageKey(user.uid);
      localStorage.setItem(storageKey, JSON.stringify(hydratedSessions));
      
      if (hydratedSessions.length > 0) {
        setActiveSessionId(hydratedSessions[0].id);
      }
      alert("Database successfully restored!");
    } catch (e) {
      alert("Error: Invalid GuideCode backup file.");
    }
  };

  const createNewChat = () => {
    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      title: 'New Discussion',
      messages: [
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `Hello ${user?.name}! I'm your GuideCode Mentor. What coding challenge should we tackle today?`,
          timestamp: new Date()
        }
      ],
      updatedAt: new Date()
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setCurrentPage('solve');
  };

  const handleSendMessage = async (text: string) => {
    if (!activeSessionId) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        const isFirst = s.messages.length <= 1;
        return {
          ...s,
          title: isFirst ? (text.length > 25 ? text.substring(0, 25) + '...' : text) : s.title,
          messages: [...s.messages, userMsg],
          updatedAt: new Date()
        };
      }
      return s;
    }));

    setIsLoading(true);
    try {
      const current = sessions.find(s => s.id === activeSessionId);
      const history = current ? [...current.messages, userMsg] : [userMsg];
      const aiResponse = await getGuidanceFromAI(history);
      
      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setSessions(prev => prev.map(s => s.id === activeSessionId ? {
        ...s,
        messages: [...s.messages, assistantMsg],
        updatedAt: new Date()
      } : s));
    } catch (error) {
      alert("I had a bit of trouble thinking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthChecking) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  const activeSession = sessions.find(s => s.id === activeSessionId);

  const sidebarContent = currentPage === 'solve' ? (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 p-3 bg-indigo-50/50 rounded-2xl mb-2">
        <div className={`w-10 h-10 rounded-xl ${user.avatarColor} flex items-center justify-center text-white font-bold shadow-sm`}>
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-sm font-bold text-slate-800 truncate">Hi, {user.name.split(' ')[0]}!</p>
          <p className="text-[10px] text-slate-500 font-medium">Mentoring Dashboard</p>
        </div>
      </div>

      <button
        onClick={createNewChat}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-100 active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        New Chat
      </button>

      <div className="space-y-1">
        <div className="flex justify-between items-center px-2 mb-2">
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recent Activity</h2>
          <span className="text-[9px] text-slate-300 font-medium italic">Right click to rename</span>
        </div>
        {sessions.length === 0 ? (
          <div className="px-2 py-4 text-xs text-slate-400 italic">No history yet.</div>
        ) : (
          sessions.map(session => (
            <div
              key={session.id}
              onClick={() => setActiveSessionId(session.id)}
              onContextMenu={(e) => { e.preventDefault(); setEditingSessionId(session.id); setEditTitleValue(session.title); }}
              className={`group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                activeSessionId === session.id 
                  ? 'bg-white border-indigo-100 text-indigo-700 shadow-sm' 
                  : 'hover:bg-slate-50 border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <div className="flex-1 overflow-hidden">
                {editingSessionId === session.id ? (
                  <input
                    ref={editInputRef}
                    autoFocus
                    type="text"
                    className="w-full text-sm font-semibold bg-white border border-indigo-300 rounded px-1 outline-none"
                    value={editTitleValue}
                    onChange={(e) => setEditTitleValue(e.target.value)}
                    onBlur={() => { if(editTitleValue.trim()) setSessions(prev => prev.map(s => s.id === session.id ? {...s, title: editTitleValue} : s)); setEditingSessionId(null); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <p className="text-sm font-semibold truncate">{session.title}</p>
                )}
                <p className="text-[10px] opacity-60">{session.updatedAt.toLocaleDateString()}</p>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setSessions(prev => prev.filter(s => s.id !== session.id)); }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  ) : null;

  return (
    <Layout sidebarContent={sidebarContent}>
      <Navbar onNavigate={setCurrentPage} currentPage={currentPage} user={user} onLogout={handleLogout} />
      
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${currentPage === 'solve' ? 'py-4 h-[calc(100vh-64px)]' : 'py-6'}`}>
          {currentPage === 'home' && <Home onStart={() => sessions.length > 0 ? setCurrentPage('solve') : createNewChat()} />}
          {currentPage === 'solve' && (
            <div className="h-full">
              {activeSession ? (
                <ChatBot messages={activeSession.messages} onSendMessage={handleSendMessage} isLoading={isLoading} onClear={() => setSessions(prev => prev.map(s => s.id === activeSessionId ? {...s, messages: [s.messages[0]]} : s))} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  </div>
                  <button onClick={createNewChat} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold">Start New Chat</button>
                </div>
              )}
            </div>
          )}
          {currentPage === 'review' && <CodeReview />}
          {currentPage === 'vault' && user && <DataVault user={user} sessions={sessions} onImport={handleImport} onReset={handleReset} />}
        </main>
      </div>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel={confirmModal.confirmLabel}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        isDanger={confirmModal.isDanger}
      />
    </Layout>
  );
};

export default App;
