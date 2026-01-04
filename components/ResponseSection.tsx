
import React from 'react';
import { AIResponse } from '../types';

// Fixed: Defined Card component before its usage and marked children as optional to satisfy strict property checking in JSX.
const Card = ({ title, icon, children }: { title: string, icon: string, children?: React.ReactNode }) => (
  <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
    <div className="flex items-center gap-3 mb-4">
      <span className="text-2xl">{icon}</span>
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
    </div>
    <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">
      {children}
    </div>
  </div>
);

interface Props {
  response: AIResponse;
}

const ResponseSection: React.FC<Props> = ({ response }) => {
  return (
    <div className="max-w-4xl mx-auto w-full py-12 px-4 space-y-8 animate-fade-in">
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center gap-4">
        <div className="text-2xl">⚠️</div>
        <p className="text-sm font-medium text-amber-800">
          This AI does not provide complete code. It only guides your thinking. Use these insights to build your own solution.
        </p>
      </div>

      <div className="grid gap-6">
        <Card title="Problem Understanding" icon="📖">
          {response.problemUnderstanding}
        </Card>
        
        <Card title="Approach / Strategy" icon="💡">
          {response.approach}
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card title="Hints" icon="🗝️">
            <ul className="space-y-3">
              {response.hints.map((hint, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-indigo-600 font-bold">#{i + 1}</span>
                  {hint}
                </li>
              ))}
            </ul>
          </Card>
          <Card title="Edge Cases" icon="🧪">
            {response.edgeCases}
          </Card>
        </div>

        <Card title="Time & Space Complexity" icon="⚡">
          {response.complexity}
        </Card>
      </div>
      
      <div className="text-center pt-8">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-indigo-600 font-bold hover:underline"
        >
          Want to try another problem?
        </button>
      </div>
    </div>
  );
};

export default ResponseSection;
