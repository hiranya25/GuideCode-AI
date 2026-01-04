
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  sidebarContent: React.ReactNode | null;
}

const Layout: React.FC<LayoutProps> = ({ children, sidebarContent }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Conditional Sidebar - Only visible when content is provided */}
      {sidebarContent && (
        <aside className="hidden md:flex md:w-72 flex-col bg-white border-r border-slate-200 animate-fade-in">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">GuideCode</h1>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Chat History</p>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar p-4">
            {sidebarContent}
          </div>
          <div className="p-4 border-t border-slate-100">
             <div className="text-[10px] text-slate-400 text-center font-medium">
               &copy; 2025 GuideCode AI
             </div>
          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default Layout;
