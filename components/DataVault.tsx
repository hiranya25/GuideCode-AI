
import React, { useRef } from 'react';
import { User, ChatSession } from '../types';

interface DataVaultProps {
  user: User;
  sessions: ChatSession[];
  onImport: (data: string) => void;
  onReset: () => void;
}

const DataVault: React.FC<DataVaultProps> = ({ user, sessions, onImport, onReset }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalMessages = sessions.reduce((acc, s) => acc + s.messages.length, 0);
  const storageUsed = (JSON.stringify(sessions).length / 1024).toFixed(2);

  const handleExport = () => {
    const data = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      user,
      sessions,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guidecode-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      onImport(content);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto w-full py-12 px-4 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Data Vault</h2>
        <p className="text-slate-500">Manage your mentoring database and session history.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <StatCard title="Total Sessions" value={sessions.length} icon="📁" />
        <StatCard title="Total Messages" value={totalMessages} icon="💬" />
        <StatCard title="Storage Used" value={`${storageUsed} KB`} icon="💾" />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Export/Import Section */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-6">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>📤</span> Portability
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Take your data with you. Export your history to a JSON file or restore it from a previous backup.
          </p>
          <div className="flex flex-col gap-3 pt-4">
            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              Export Database
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 py-3 bg-white text-indigo-600 border border-indigo-200 rounded-xl font-bold hover:bg-indigo-50 transition-all"
            >
              Import Backup
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".json"
            />
          </div>
        </div>

        {/* Security & Reset Section */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-6">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>🛡️</span> Danger Zone
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Permanently delete all sessions and your profile from this device. This action cannot be undone.
          </p>
          <div className="pt-4">
            <button
              onClick={onReset}
              className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold hover:bg-red-100 transition-all"
            >
              Factory Reset Database
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12 p-6 bg-slate-900 rounded-3xl text-white flex items-center gap-6">
        <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center shrink-0">
          <span className="text-2xl">🔒</span>
        </div>
        <div>
          <h4 className="font-bold text-lg">Privacy First</h4>
          <p className="text-slate-400 text-sm">
            GuideCode AI stores all data locally in your browser. We never sync your chat history to our servers, keeping your learning journey 100% private.
          </p>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }: { title: string; value: string | number; icon: string }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
    <div className="text-2xl mb-2">{icon}</div>
    <div className="text-2xl font-black text-slate-900">{value}</div>
    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</div>
  </div>
);

export default DataVault;
